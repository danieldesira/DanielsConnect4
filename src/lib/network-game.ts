import { Dot } from "@danieldesira/daniels-connect4-common/lib/enums/dot";
import { Dialog } from "./dialog/dialog";
import { Sound } from "./enums/sound";
import { Game } from "./game";
import { GameOptions } from "./game-options";

import { Socket } from "./socket";
import { Utils } from "./utils";
import { GameMessage } from "@danieldesira/daniels-connect4-common/lib/models/game-message";
import { InitialMessage } from "@danieldesira/daniels-connect4-common/lib/models/initial-message";
import { InactivityMessage } from "@danieldesira/daniels-connect4-common/lib/models/inactivity-message";
import { ActionMessage } from "@danieldesira/daniels-connect4-common/lib/models/action-message";
import { SkipTurnMessage } from "@danieldesira/daniels-connect4-common/lib/models/skip-turn-message";
import { WinnerMessage } from "@danieldesira/daniels-connect4-common/lib/models/winner-message";

export class NetworkGame extends Game {

    private static instance: NetworkGame;

    private socket: Socket;
    private skipTurn: boolean;
    private endGameDueToInactivity: boolean;
    private turnCountDown: number;
    private turnCountDownInterval: number;
    private countdownSpan: HTMLSpanElement;
    private static countDownMaxSeconds: number = 60;

    private constructor(options: GameOptions) {
        super(options);

        if (options.countdownId) {
            this.countdownSpan = document.getElementById(options.countdownId) as HTMLSpanElement;
        }
    }

    public static getInstance(options: GameOptions): Game {
        if (!NetworkGame.instance) {
            NetworkGame.instance = new NetworkGame(options);
        }
        return NetworkGame.instance;
    }

    public start() {
        this.defineSocket();
        this.startCountdown();
        super.start();
    }

    private defineSocket() {
        this.socket = new Socket();
        this.socket.onMessageCallback = this.onSocketMessage;
        this.socket.onErrorCallback = this.onSocketError;
        this.socket.onInputPlayerNameInDialog = this.onInputPlayerNameInDialog;
    }

    private onSocketMessage = (messageData: GameMessage) => {
        if (GameMessage.isInitialMessage(messageData)) {
            let data = messageData as InitialMessage;
            if (data.opponentName && this.socket && this.playerNameSection) {
                if (this.socket.getPlayerColor() === Dot.Red) {
                    this.playerNameSection.setPlayerGreen(data.opponentName);
                } else if (this.socket.getPlayerColor() === Dot.Green) {
                    this.playerNameSection.setPlayerRed(data.opponentName);
                }
    
                this.setTimer();
            }
    
            if (data.color && this.socket && this.playerNameSection) {
                if (data.color === Dot.Red) {
                    this.playerNameSection.setPlayerRed(this.socket.getPlayerName());
                } else {
                    this.playerNameSection.setPlayerGreen(this.socket.getPlayerName());
                }
            }
        }
        
        if (GameMessage.isInactivityMessage(messageData)) {
            let data = messageData as InactivityMessage;
            if (data.currentTurn !== this.socket.getPlayerColor()) {
                Dialog.notify(['You win due to opponent inactivity!']);
                Utils.playSound(Sound.Win);
                this.closeGameAfterWinning();
            }
        }
        
        if (GameMessage.isActionMessage(messageData)) {
            let data = messageData as ActionMessage;
            if (data.action === 'mousemove') {
                this.moveDot(data.column);
            }
    
            if (data.action === 'click') {
                this.landDot(data.column);
            }
        }
        
        if (GameMessage.isSkipTurnMessage(messageData)) {
            let data = messageData as SkipTurnMessage;
            if (data.skipTurn && data.currentTurn !== this.socket.getPlayerColor()) {
                this.switchTurn();
            }
        }

        if (GameMessage.isWinnerMessage(messageData)) {
            let data = messageData as WinnerMessage;
            let winner: string = null;
            if (this.playerNameSection) {
                if (data.winner === Dot.Red) {
                    winner = this.playerNameSection.getPlayerRed() + ' (Red)';
                } else {
                    winner = this.playerNameSection.getPlayerGreen() + ' (Green)';
                }
            }
            this.showWinDialog(winner, data.winner);

            this.closeGameAfterWinning();
        }

        if (GameMessage.isTieMessage(messageData)) {
            Dialog.notify(['Game resulted in tie!']);
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
            let column = this.getColumnFromCursorPosition(event);
            this.moveDot(column);

            let data = new ActionMessage(column, 'mousemove');
            this.socket.send(data);

            this.endGameDueToInactivity = false;
        }
    };

    protected canvasClick = (event: MouseEvent) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && this.areBothPlayersConnected()) {
            let column = this.getColumnFromCursorPosition(event);

            let data = new ActionMessage(column, 'click');
            this.socket.send(data);

            this.skipTurn = false;

            this.landDot(column);
        }
    };

    protected landDot(column: number): number {
        if (this.board[column][0] === Dot.Empty) {
            let row = super.landDot(column);
            
            // Assume the game is still going on
            this.switchTurn();
            this.context.fillStyle = this.turn;
            this.paintDotToDrop(column);
            Utils.playSound(Sound.LandDot);

            return row;
        } else {
            return -1;
        }
    }

    public exit = () => {
        Dialog.confirm(['Network game in progress. Are you sure you want to quit?'], {
            yesCallback: this.confirmExit,
            noCallback: () => {}
        });
    };

    private confirmExit = () => {
        if (this.socket) {
            this.socket.close();
        }
        Dialog.closeAllOpenDialogs();

        super.exit();
    };

    protected beforeUnload = (event: Event) => {
        // Display default dialog before closing
        event.preventDefault();
        event.returnValue = false; // Required by Chrome
    };

    protected showWinDialog(winner: string, currentTurn: Dot) {
        let winMsg: Array<string> = new Array();
        winMsg.push(winner + ' wins!');
        if (this.timer) {
            winMsg.push('Time taken: ' + this.timer.getTimeInStringFormat());
        }
        if (this.socket && this.socket.getPlayerColor() === currentTurn) {
            winMsg.push('You win!');
            Utils.playSound(Sound.Win);
        } else {
            winMsg.push('You lose!');
            Utils.playSound(Sound.Lose);
        }
        Dialog.notify(winMsg);
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

        let playerColor: Dot = this.socket.getPlayerColor();
        if (this.turn === playerColor && this.turnCountDown <= 0 && this.socket) {
            if (this.endGameDueToInactivity) {
                let data = new InactivityMessage(true, playerColor);
                this.socket.send(data);

                Dialog.notify(['You lose due to inactivity!']);
                Utils.playSound(Sound.Lose);
                this.closeGameAfterWinning();
            } else if (this.skipTurn) {
                this.switchTurn();

                let data = new SkipTurnMessage(true, playerColor);
                this.socket.send(data);
            }
        }
    }

    private adaptCountDownColor() {
        if (this.turnCountDown > NetworkGame.countDownMaxSeconds / 2) {
            this.countdownSpan.classList.add('green-text');
            this.countdownSpan.classList.remove('red-text');
        } else {
            this.countdownSpan.classList.remove('green-text');
            this.countdownSpan.classList.add('red-text');
        }
    }

    private startCountdown() {
        this.skipTurn = true;
        this.endGameDueToInactivity = true;
        this.turnCountDown = NetworkGame.countDownMaxSeconds;
        this.turnCountDownInterval = window.setInterval(this.turnCountDownCallback, 1000);
    }

    private stopCountdown() {
        clearInterval(this.turnCountDownInterval);
        this.countdownSpan.innerText = '';
    }

    private resetCountdown() {
        this.turnCountDown = NetworkGame.countDownMaxSeconds;
        this.skipTurn = true;
        this.endGameDueToInactivity = true;
    }

    private onInputPlayerNameInDialog = (playerName: string) => {
        if (this.socket) {
            if (this.socket.getPlayerColor() === Dot.Red) {
                this.playerNameSection.setPlayerRed(playerName);
            } else {
                this.playerNameSection.setPlayerGreen(playerName);
            }
        }
    }
    
}