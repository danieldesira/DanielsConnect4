import { Coin } from "@danieldesira/daniels-connect4-common/lib/enums/coin";
import Dialog from "./dialog/dialog";
import { Sound } from "./enums/sound";
import Game from "./game";
import GameOptions from "./game-options";
import Socket from "./socket";
import Utils from "./utils";
import { ActionMessage, CurrentTurnMessage, ErrorMessage, GameMessage, InitialMessage, SkipTurnMessage, WinnerMessage, skipTurnMaxWait } from "@danieldesira/daniels-connect4-common";
import { DialogIds } from "./enums/dialog-ids";
import { BoardLogic } from "@danieldesira/daniels-connect4-common/lib/board-logic";

export default class NetworkGame extends Game {

    private static instance: NetworkGame;

    private socket: Socket;
    private turnCountDown: number;
    private turnCountDownInterval: number;
    private countdownSpan: HTMLSpanElement;

    private constructor(options: GameOptions) {
        super(options);

        if (options.timerCountdownId) {
            this.countdownSpan = document.getElementById(options.timerCountdownId) as HTMLSpanElement;
        }
    }

    public static getInstance(options: GameOptions): NetworkGame {
        if (!NetworkGame.instance) {
            NetworkGame.instance = new NetworkGame(options);
        }
        return NetworkGame.instance;
    }

    public start() {
        this.defineSocket();
        this.startCountdown();
        super.start();
        document.body.classList.add('waiting');
    }

    private defineSocket() {
        this.socket = new Socket();
        this.socket.onMessageCallback = this.onSocketMessage;
        this.socket.onErrorCallback = this.onSocketError;
        this.socket.onInputPlayerNameInDialog = this.onInputPlayerNameInDialog;
        this.socket.onGameCancel = this.confirmExit;
    }

    private onSocketMessage = (messageData: GameMessage) => {
        if (GameMessage.isInitialMessage(messageData)) {
            const data = messageData as InitialMessage;
            if (data.opponentName && this.socket && this.playerNameSection) {
                this.toggleWaitingClass();
                if (this.socket.getPlayerColor() === Coin.Red) {
                    this.playerNameSection.setPlayerGreen(data.opponentName);
                } else if (this.socket.getPlayerColor() === Coin.Green) {
                    this.playerNameSection.setPlayerRed(data.opponentName);
                }
            }
    
            if (data.color && this.socket && this.playerNameSection) {
                if (data.color === Coin.Red) {
                    this.playerNameSection.setPlayerRed(this.socket.getPlayerName());
                } else {
                    this.playerNameSection.setPlayerGreen(this.socket.getPlayerName());
                }
            }
        }
        
        if (GameMessage.isActionMessage(messageData)) {
            const data = messageData as ActionMessage;
            if (data.action === 'mousemove') {
                this.currentCoinColumn = data.column;
                this.moveCoin();
            }
    
            if (data.action === 'click') {
                this.turn = data.color;
                this.currentCoinColumn = data.column;
                this.landCoin();
            }
        }
        
        if (GameMessage.isSkipTurnMessage(messageData)) {
            const data = messageData as SkipTurnMessage;
            if (data.skipTurn && data.currentTurn) {
                this.turn = data.currentTurn;
                this.turnCountDown = skipTurnMaxWait;
                this.toggleWaitingClass();
            }
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
            document.body.classList.remove('waiting');
        }

        if (GameMessage.isTieMessage(messageData)) {
            Dialog.notify({
                id: DialogIds.GameEnd,
                text: ['Game resulted in tie!'],
                title: null
            });
            document.body.classList.remove('waiting');
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
                text: ['Your opponent disconnected. You win!'],
                title: 'We have a winner!'
            });
            document.body.classList.remove('waiting');
            this.closeGameAfterWinning();
        }

        if (GameMessage.isErrorMessage(messageData)) {
            const data = messageData as ErrorMessage;
            Dialog.closeAllOpenDialogs();
            Dialog.notify({
                id: DialogIds.ServerError,
                text: [data.error],
                title: 'Error'
            });
            document.body.classList.remove('waiting');
            this.closeGameAfterWinning();
        }
    };

    private onSocketError = () => {
        super.exit();
    };

    protected resetValues() {
        super.resetValues();
        this.stopCountdown();

        if (this.socket) {
            this.socket.close();
        }
    }

    protected canvasMousemove = (event: MouseEvent) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && this.areBothPlayersConnected()) {
            this.currentCoinColumn = this.getColumnFromCursorPosition(event);
            this.moveCoin();

            const data = new ActionMessage(this.currentCoinColumn, 'mousemove', this.turn);
            this.socket.send(data);
        }
    };

    protected canvasClick = (event: MouseEvent) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && this.areBothPlayersConnected()) {
            this.currentCoinColumn = this.getColumnFromCursorPosition(event);

            const data = new ActionMessage(this.currentCoinColumn, 'click', this.turn);
            this.socket.send(data);
            
            this.landCoin();
        }
    };

    protected landCoin(): number {
        if (this.board[this.currentCoinColumn][0] === Coin.Empty) {
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
            document.body.classList.remove('waiting');
        } else {
            document.body.classList.add('waiting');
        }
    }

    public exit = () => {
        Dialog.confirm({
            id: DialogIds.ExitGame,
            title: null,
            text: ['Network game in progress. Are you sure you want to quit?'],
            yesCallback: this.confirmExit,
            noCallback: () => {},
            yesColor: 'red',
            noColor: 'green'
        });
    };

    private confirmExit = () => {
        if (this.socket) {
            this.socket.close();
        }
        Dialog.closeAllOpenDialogs();
        document.body.classList.remove('waiting');

        super.exit();
    };

    protected beforeUnload = (event: Event) => {
        // Display default dialog before closing
        event.preventDefault();
        event.returnValue = false; // Required by Chrome
    };

    protected showWinDialog(winner: string, currentTurn: Coin) {
        let winMsg: Array<string> = new Array();
        winMsg.push(`${winner} wins!`);
        if (this.socket && this.socket.getPlayerColor() === currentTurn) {
            winMsg.push('You win!');
            Utils.playSound(Sound.Win);
        } else {
            winMsg.push('You lose!');
            Utils.playSound(Sound.Lose);
        }
        Dialog.notify({
            id: DialogIds.GameEnd,
            text: winMsg,
            title: 'Game Ends'
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
            this.countdownSpan.classList.add('green-text');
            this.countdownSpan.classList.remove('red-text');
        } else {
            this.countdownSpan.classList.remove('green-text');
            this.countdownSpan.classList.add('red-text');
        }
    }

    private startCountdown() {
        this.turnCountDown = skipTurnMaxWait;
        this.turnCountDownInterval = window.setInterval(this.turnCountDownCallback, 1000);
    }

    private stopCountdown() {
        clearInterval(this.turnCountDownInterval);
        this.countdownSpan.innerText = '';
    }

    private resetCountdown() {
        this.turnCountDown = skipTurnMaxWait;
    }

    private onInputPlayerNameInDialog = (playerName: string) => {
        if (this.socket) {
            if (this.socket.getPlayerColor() === Coin.Red) {
                this.playerNameSection.setPlayerRed(playerName);
            } else {
                this.playerNameSection.setPlayerGreen(playerName);
            }
        }
    };

    protected handleKeyDown = (event: KeyboardEvent) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && this.areBothPlayersConnected()) {
            let data: GameMessage;

            if (Game.moveLeftKeys.includes(event.key)) {
                if (this.currentCoinColumn > 0) {
                    this.currentCoinColumn--;

                    data = new ActionMessage(this.currentCoinColumn, 'mousemove', this.turn);
                    this.socket.send(data);

                    this.moveCoin();
                }
            }
    
            if (Game.moveRightKeys.includes(event.key)) {
                if (this.currentCoinColumn < BoardLogic.columns - 1) {
                    this.currentCoinColumn++;

                    data = new ActionMessage(this.currentCoinColumn, 'mousemove', this.turn);
                    this.socket.send(data);

                    this.moveCoin();
                }
            }
    
            if (event.key === ' ') {
                data = new ActionMessage(this.currentCoinColumn, 'click', this.turn);
                this.socket.send(data);

                this.landCoin();
            }
        }

        if (event.key === 'Escape') {
            this.exit();
        }
    };
    
}