import { Coin } from "@danieldesira/daniels-connect4-common/lib/enums/coin";
import Dialog from "../dialog/dialog";
import { Sound } from "../enums/sound";
import Game from "./game";
import GameOptions from "./game-options";
import Socket from "./socket";
import Utils from "../utils";
import {
  ActionMessage,
  BoardDimensions,
  CurrentTurnMessage,
  ErrorMessage,
  GameMessage,
  InitialMessage,
  WinnerMessage,
  skipTurnMaxWait,
} from "@danieldesira/daniels-connect4-common";
import { DialogIds } from "../enums/dialog-ids";
import Authentication from "../authentication";
import { AuthenticationModel } from "../models/authentication-model";
import { BoardLogic } from "@danieldesira/daniels-connect4-common/lib/board-logic";

export default class NetworkGame extends Game {
  private static instance: NetworkGame;

  private socket: Socket;
  private turnCountDown: number;
  private turnCountDownInterval: number;

  private constructor(options: GameOptions) {
    super(options);
  }

  public static getInstance(options: GameOptions): NetworkGame {
    if (!NetworkGame.instance) {
      NetworkGame.instance = new NetworkGame(options);
    }
    return NetworkGame.instance;
  }

  public start() {
    this.board = new BoardLogic(BoardDimensions.Large);
    const auth = Authentication.getToken();
    if (auth) {
      this.defineSocket(auth);
      this.startCountdown();
      super.start();
      Utils.enableProgressCursor();
      if (this.timerSpan) {
        this.timerSpan.classList.add("hidden");
      }
      if (this.countdownSpan) {
        this.countdownSpan.classList.remove("hidden");
      }
    } else {
      Dialog.notify({
        title: "Error",
        text: ["User not logged in!"],
        id: DialogIds.ServerError,
      });
    }
  }

  private defineSocket(auth: AuthenticationModel) {
    this.socket = new Socket(auth);
    this.socket.onMessageCallback = this.onSocketMessage;
    this.socket.onErrorCallback = this.onSocketError;
    this.socket.onGameCancel = this.confirmExit;
  }

  private onSocketMessage = (messageData: GameMessage) => {
    if (GameMessage.isInitialMessage(messageData)) {
      const data = messageData as InitialMessage;
      if (this.socket && this.playerNameSection) {
        if (data.opponentName) {
          this.toggleWaitingClass();
          if (this.socket.getPlayerColor() === Coin.Red) {
            this.playerNameSection.setPlayerGreen(data.opponentName);
            this.playerNameSection.setPlayerGreenPic(data.oppenentPic);
          } else if (this.socket.getPlayerColor() === Coin.Green) {
            this.playerNameSection.setPlayerRed(data.opponentName);
            this.playerNameSection.setPlayerRedPic(data.oppenentPic);
          }
        }

        if (data.playerName) {
          if (this.socket.getPlayerColor() === Coin.Red) {
            this.playerNameSection.setPlayerRed(data.playerName);
            this.playerNameSection.setPlayerRedPic(data.playerPic);
          } else if (this.socket.getPlayerColor() === Coin.Green) {
            this.playerNameSection.setPlayerGreen(data.playerName);
            this.playerNameSection.setPlayerGreenPic(data.playerPic);
          }
        }

        if (data.color) {
          if (data.color === Coin.Red) {
            this.playerNameSection.setPlayerRed(this.socket.getPlayerName());
          } else {
            this.playerNameSection.setPlayerGreen(this.socket.getPlayerName());
          }
        }

        if (data.dimensions) {
          this.board = new BoardLogic(data.dimensions);
          this.resizeCanvas();
        }
      }
    }

    if (GameMessage.isActionMessage(messageData)) {
      const data = messageData as ActionMessage;
      if (data.action === "mousemove") {
        this.currentCoinColumn = data.column;
        this.moveCoin();
      }

      if (data.action === "click") {
        this.turn = data.color;
        this.currentCoinColumn = data.column;
        this.landCoin();
      }
    }

    if (GameMessage.isCurrentTurnMessage(messageData)) {
      const data = messageData as CurrentTurnMessage;
      this.turn = data.currentTurn;
      this.turnCountDown = skipTurnMaxWait;
      this.toggleWaitingClass();
    }

    if (GameMessage.isWinnerMessage(messageData)) {
      const data = messageData as WinnerMessage;
      let winner: string = null;
      if (this.playerNameSection) {
        if (data.winner === Coin.Red) {
          winner = `${this.playerNameSection.getPlayerRed()} (Red)`;
        } else {
          winner = `${this.playerNameSection.getPlayerGreen()} (Green)`;
        }
      }
      this.showWinDialog(winner, data.winner);

      this.closeGameAfterWinning();
      Utils.disableProgressCursor();
    }

    if (GameMessage.isTieMessage(messageData)) {
      Dialog.notify({
        id: DialogIds.GameEnd,
        text: ["Game resulted in tie!"],
        title: null,
      });
      Utils.disableProgressCursor();
      this.closeGameAfterWinning();
    }

    if (GameMessage.isCurrentTurnMessage(messageData)) {
      const data = messageData as CurrentTurnMessage;
      this.turn = data.currentTurn;
      this.toggleWaitingClass();
      if (this.playerNameSection) {
        this.playerNameSection.indicateTurn(this.turn);
      }
    }

    if (GameMessage.isDisconnectMessage(messageData)) {
      Dialog.notify({
        id: DialogIds.GameEnd,
        text: ["Your opponent disconnected. You win!"],
        title: "We have a winner!",
      });
      Utils.disableProgressCursor();
      this.closeGameAfterWinning();
    }

    if (GameMessage.isErrorMessage(messageData)) {
      const data = messageData as ErrorMessage;
      Dialog.closeAllOpenDialogs();
      Dialog.notify({
        id: DialogIds.ServerError,
        text: [data.error],
        title: "Error",
      });
      Utils.disableProgressCursor();
      this.closeGameAfterWinning();
    }
  };

  private onSocketError = () => super.exit();

  protected resetValues() {
    super.resetValues();
    this.stopCountdown();

    if (this.socket) {
      this.socket.close();
    }
  }

  protected canvasMousemove = (event: MouseEvent) => {
    if (
      this.socket &&
      this.turn === this.socket.getPlayerColor() &&
      this.areBothPlayersConnected()
    ) {
      this.currentCoinColumn = this.getColumnFromCursorPosition(event);
      this.moveCoin();

      const data: ActionMessage = {
        column: this.currentCoinColumn,
        action: "mousemove",
        color: this.turn,
      };
      this.socket.send(data);
    }
  };

  protected canvasClick = (event: MouseEvent) => {
    if (
      this.socket &&
      this.turn === this.socket.getPlayerColor() &&
      this.areBothPlayersConnected()
    ) {
      this.currentCoinColumn = this.getColumnFromCursorPosition(event);

      const data: ActionMessage = {
        column: this.currentCoinColumn,
        action: "click",
        color: this.turn,
      };
      this.socket.send(data);

      this.landCoin();
    }
  };

  protected canvasTouchmove = (event: TouchEvent) => {
    if (
      this.socket &&
      this.turn === this.socket.getPlayerColor() &&
      this.areBothPlayersConnected()
    ) {
      const firstTouch = event.changedTouches[0];
      this.currentCoinColumn = this.getColumnFromCursorPosition(firstTouch);
      this.moveCoin();

      const data: ActionMessage = {
        column: this.currentCoinColumn,
        action: "mousemove",
        color: this.turn,
      };
      this.socket.send(data);
    }
  };

  protected landCoin(): number {
    if (this.board.getBoard()[this.currentCoinColumn][0] === Coin.Empty) {
      const row = super.landCoin();

      // Assume the game is still going on
      this.switchTurn();
      this.context.fillStyle = Game.getColor(this.turn);
      this.paintCoinToDrop(this.currentCoinColumn);
      Utils.playSound(Sound.LandCoin);
      this.toggleWaitingClass();

      return row;
    } else {
      return -1;
    }
  }

  private toggleWaitingClass() {
    if (this.socket.getPlayerColor() === this.turn) {
      Utils.disableProgressCursor();
    } else {
      Utils.enableProgressCursor();
    }
  }

  public exit = () => {
    Dialog.confirm({
      id: DialogIds.ExitGame,
      title: null,
      text: ["Network game in progress. Are you sure you want to quit?"],
      yesCallback: this.confirmExit,
      noCallback: () => {},
    });
  };

  private confirmExit = () => {
    if (this.socket) {
      this.socket.close();
    }
    Dialog.closeAllOpenDialogs();
    Utils.disableProgressCursor();

    super.exit();
  };

  protected beforeUnload = (event: Event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  };

  protected showWinDialog(winner: string, currentTurn: Coin) {
    const winMsg: Array<string> = [];
    winMsg.push(`${winner} wins!`);
    if (this.socket && this.socket.getPlayerColor() === currentTurn) {
      winMsg.push("You win!");
      Utils.playSound(Sound.Win);
    } else {
      winMsg.push("You lose!");
      Utils.playSound(Sound.Lose);
    }
    Dialog.notify({
      id: DialogIds.GameEnd,
      text: winMsg,
      title: "Game Ends",
    });
  }

  protected switchTurn() {
    super.switchTurn();
    this.resetCountdown();
  }

  private turnCountDownCallback = () => {
    if (this.areBothPlayersConnected()) {
      this.turnCountDown--;
      this.countdownSpan.innerText = this.turnCountDown.toString();
      this.adaptCountDownColor();
    }
  };

  private adaptCountDownColor() {
    if (this.turnCountDown > skipTurnMaxWait / 2) {
      this.countdownSpan.classList.add("green-text");
      this.countdownSpan.classList.remove("red-text");
    } else {
      this.countdownSpan.classList.remove("green-text");
      this.countdownSpan.classList.add("red-text");
    }
  }

  private startCountdown() {
    this.turnCountDown = skipTurnMaxWait;
    this.turnCountDownInterval = window.setInterval(
      this.turnCountDownCallback,
      1000
    );
  }

  private stopCountdown() {
    clearInterval(this.turnCountDownInterval);
    this.countdownSpan.innerText = "";
  }

  private resetCountdown() {
    this.turnCountDown = skipTurnMaxWait;
  }

  protected handleKeyDown = (event: KeyboardEvent) => {
    if (
      this.socket &&
      this.turn === this.socket.getPlayerColor() &&
      this.areBothPlayersConnected()
    ) {
      let data: GameMessage;

      if (Game.moveLeftKeys.includes(event.key)) {
        if (this.currentCoinColumn > 0) {
          this.currentCoinColumn--;

          data = {
            column: this.currentCoinColumn,
            action: "mousemove",
            color: this.turn,
          };
          this.socket.send(data);

          this.moveCoin();
        }
      }

      if (Game.moveRightKeys.includes(event.key)) {
        if (this.currentCoinColumn < this.board.getColumns() - 1) {
          this.currentCoinColumn++;

          data = {
            column: this.currentCoinColumn,
            action: "mousemove",
            color: this.turn,
          };
          this.socket.send(data);

          this.moveCoin();
        }
      }

      if (event.key === " ") {
        data = {
          column: this.currentCoinColumn,
          action: "click",
          color: this.turn,
        };
        this.socket.send(data);

        this.landCoin();
      }
    }

    if (event.key === "Escape") {
      this.exit();
    }
  };
}
