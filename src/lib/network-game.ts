import { Dialog } from "./dialog/dialog";
import { Dot } from "./enums/dot";
import { GameMode } from "./enums/game-mode";
import { Sound } from "./enums/sound";
import { Game } from "./game";
import { GameOptions } from "./game-options";
import { GameMessage } from "./models/game-message";
import { Socket } from "./socket";
import { Utils } from "./utils";

export class NetworkGame extends Game {

    private static instance: NetworkGame;

    private socket: Socket;
    private skipTurn: boolean;
    private endGameDueToInactivity: boolean;
    private turnCountDown: number;
    private turnCountDownInterval: any;
    private countdownSpan: any;

    private constructor(options: GameOptions) {
        super(options);
        this.mode = GameMode.Network;

        if (options.countdownId) {
            this.countdownSpan = document.getElementById(options.countdownId);
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
    }

    private onSocketMessage = (messageData: GameMessage) => {
        if (messageData.opponentName && this.socket && this.playerNames) {
            if (this.socket.getPlayerColor() === Dot.Red) {
                this.playerNames.setPlayerGreen(messageData.opponentName);
            } else if (this.socket.getPlayerColor() === Dot.Green) {
                this.playerNames.setPlayerRed(messageData.opponentName);
            }

            if (this.timer) {
                this.timer.setRunnable(true);
            }
        }

        if (messageData.color && this.socket && this.playerNames) {
            if (messageData.color === Dot.Red) {
                this.playerNames.setPlayerRed(this.socket.getPlayerName());
            } else if (messageData.color === Dot.Green) {
                this.playerNames.setPlayerGreen(this.socket.getPlayerName());
            }
        }

        if (messageData.endGameDueToInactivity && messageData.currentTurn !== this.socket.getPlayerColor()) {
            Dialog.notify('You win due to opponent inactivity!');
            Utils.playSound(Sound.Win);
            this.closeGameAfterWinning();
        }

        if (!isNaN(messageData.column) && messageData.action === 'mousemove') {
            this.moveDot(messageData.column);
        }

        if (!isNaN(messageData.column) && messageData.action === 'click') {
            this.landDot(messageData.column);
        }

        if (messageData.skipTurn && messageData.currentTurn !== this.socket.getPlayerColor()) {
            this.switchTurn();
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

    protected canvasMousemove = (event) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && (!this.playerNames || this.playerNames.bothPlayersConnected())) {
            let column = this.getColumnFromCursorPosition(event);
            this.moveDot(column);

            let data = {
                action: 'mousemove',
                column: column
            };
            this.socket.send(data);

            this.endGameDueToInactivity = false;
        }
    };

    protected canvasClick = (event) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && (!this.playerNames || this.playerNames.bothPlayersConnected())) {
            let column = this.getColumnFromCursorPosition(event);

            let data = {
                action: 'click',
                column: column
            };
            this.socket.send(data);

            this.skipTurn = false;

            this.landDot(column);
        }
    };

    public exit() {
        Dialog.confirm('Network game in progress. Are you sure you want to quit?', {
            yesCallback: this.confirmExit,
            noCallback: () => {}
        });
    }

    private confirmExit = () => {
        if (this.socket) {
            this.socket.close();
        }

        super.exit();
    };

    protected beforeUnload = (event) => {
        // Display default dialog before closing
        event.preventDefault();
        event.returnValue = ''; // Required by Chrome
    }

    protected winDialog(winner: string) {
        let winMsg: string = winner + ' wins!';
        if (this.timer) {
            winMsg += '\nTime taken: ' + this.timer.getTimeInStringFormat();
        }
        winMsg += '\n';
        if (this.socket && this.socket.getPlayerColor() === this.turn) {
            winMsg += 'You win!';
            Utils.playSound(Sound.Win);
        } else {
            winMsg += 'You lose!';
            Utils.playSound(Sound.Lose);
        }
        Dialog.notify(winMsg);
    }

    protected switchTurn() {
        super.switchTurn();
        this.resetCountdown();
    }

    private turnCountDownCallback = () => {
        if (this.playerNames && this.playerNames.bothPlayersConnected()) {
            this.turnCountDown--;
            this.countdownSpan.innerText = this.turnCountDown;
            this.adaptCountDownColor();
        }

        let playerColor: Dot = this.socket.getPlayerColor();
        if (this.turn === playerColor && this.turnCountDown <= 0 && this.socket) {
            if (this.endGameDueToInactivity) {
                this.socket.send({
                    endGameDueToInactivity: true,
                    currentTurn: playerColor
                });

                Dialog.notify('You lose due to inactivity!');
                Utils.playSound(Sound.Lose);
                this.closeGameAfterWinning();
            } else if (this.skipTurn) {
                this.switchTurn();

                this.socket.send({
                    skipTurn: true,
                    currentTurn: playerColor
                });
            }
        }
    }

    private adaptCountDownColor() {
        if (this.turnCountDown > 30) {
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
        this.turnCountDown = 60;
        this.turnCountDownInterval = setInterval(this.turnCountDownCallback, 1000);
    }

    private stopCountdown() {
        clearInterval(this.turnCountDownInterval);
        this.countdownSpan.innerText = '';
    }

    private resetCountdown() {
        this.turnCountDown = 60;
        this.skipTurn = true;
        this.endGameDueToInactivity = true;
    }
    
}