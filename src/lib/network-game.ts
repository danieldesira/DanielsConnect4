import { Dot } from "./enums/dot";
import { GameMode } from "./enums/game-mode";
import { Sound } from "./enums/sound";
import { Game } from "./game";
import { GameOptions } from "./game-options";
import { Socket } from "./socket";
import { Utils } from "./utils";

export class NetworkGame extends Game {

    private static instance: NetworkGame;

    private socket: Socket;
    private skipTurn: boolean;
    private endGameDueToInactivity: boolean;
    private turnCountDown: number;
    private turnCountDownInterval: any;

    private constructor(options: GameOptions) {
        super(options);
        this.mode = GameMode.Network;
    }

    public static getInstance(options: GameOptions): Game {
        if (!NetworkGame.instance) {
            NetworkGame.instance = new NetworkGame(options);
        }
        return NetworkGame.instance;
    }

    public start() {
        this.defineSocket();

        super.start();
    }

    private defineSocket() {
        this.socket = new Socket();
        this.socket.onMessageCallback = this.socketMessage;
    }

    private socketMessage = (messageData) => {
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

        if (messageData.win) {
            this.closeGameAfterWinning();
        }

        if (!isNaN(messageData.column) && messageData.action === 'mousemove') {
            this.moveDot(messageData.column);
        }

        if (!isNaN(messageData.column) && messageData.action === 'click') {
            this.landDot(messageData.column);
        }
    };

    protected resetValues() {
        super.resetValues();

        if (this.socket) {
            this.socket.close();
        }
    }

    protected canvasMousemove = (event) => {
        if (this.socket && this.turn === this.socket.getPlayerColor() && (!this.playerNames || this.playerNames.bothPlayersConnected())) {
            let column = this.getColumnFromCursorPosition();
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
            let column = this.getColumnFromCursorPosition();

            let data = {
                action: 'click',
                column: column
            };
            this.socket.send(data);

            this.skipTurn = false;

            this.landDot(column);
        }
    };

    public exit(): void {
        let exitConfirmation: boolean = confirm('Network game in progress. Are you sure you want to quit?');

        if (exitConfirmation) {
            if (this.socket) {
                this.socket.close();
            }

            super.exit();
        }
    }

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
        alert(winMsg);
    }

    protected switchTurn() {
        super.switchTurn();

        if (this.socket && this.turn === this.socket.getPlayerColor()) {
            this.skipTurn = true;
            this.endGameDueToInactivity = true;
            this.turnCountDown = 60;
            this.turnCountDownInterval = setInterval(this.turnCountDownCallback, 1000);
        } else {
            clearInterval(this.turnCountDownInterval);
        }
    }

    private turnCountDownCallback = () => {
        this.turnCountDown--;

        if (this.turnCountDown <= 0) {
            if (this.endGameDueToInactivity) {
                // to-do: end game and send flag to server
            }

            if (this.skipTurn) {
                this.switchTurn();
                // to-do: send message to server to let the opponent's client know that the turn switched
            }
        }
    }
    
}