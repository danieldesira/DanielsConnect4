import { Dot } from "./enums/dot";
import { Sound } from "./enums/sound";
import { Game } from "./game";
import { GameOptions } from "./game-options";
import { Socket } from "./socket";
import { Utils } from "./utils";

export class NetworkGame extends Game {

    private static instance: NetworkGame;

    private socket: Socket;

    private constructor(options: GameOptions) {
        super(options);
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
    
}