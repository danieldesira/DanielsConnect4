import { Dot } from "@danieldesira/daniels-connect4-common/lib/enums/dot";
import { Dialog } from "./dialog/dialog";
import { Game } from "./game";
import { GameOptions } from "./game-options";
import { BoardLogic } from "@danieldesira/daniels-connect4-common/lib/board-logic";
import { Sound } from "./enums/sound";
import { Utils } from "./utils";

export class SameDeviceGame extends Game {

    private static instance: SameDeviceGame;

    private constructor(options: GameOptions) {
        super(options);
    }

    public static getInstance(options: GameOptions): Game {
        if (!SameDeviceGame.instance) {
            SameDeviceGame.instance = new SameDeviceGame(options);
        }
        return SameDeviceGame.instance;
    }

    public start() {
        this.checkGameData();
    }

    private onGameDataCheck() {
        if (this.playerNameSection) {
            this.playerNameSection.setUpPlayerNames(this.setTimer);
        }

        if (this.areBothPlayersConnected()) {
            this.setTimer();
        }

        super.start();
    }

    private checkGameData() {
        let board = localStorage.getItem('board');
        let nextTurn = localStorage.getItem('nextTurn');
        
        if (board && nextTurn) {
            Dialog.confirm(['Do you want to continue playing the previous game?'], {
                yesCallback: this.continuePreviousGame,
                noCallback: this.cancelPreviousGame
            });
        } else {
            this.onGameDataCheck();
        }
    }

    private continuePreviousGame = () => {
        this.restoreLastGame();
        this.onGameDataCheck();
    };

    private cancelPreviousGame = () => {
        localStorage.clear();
        this.onGameDataCheck();
    };

    private restoreLastGame() {
        let nextTurn: string = localStorage.getItem('nextTurn');
        if (nextTurn === Dot.Red) {
            this.turn = Dot.Red;
        } else if (nextTurn === Dot.Green) {
            this.turn = Dot.Green;
        }
        
        this.board = JSON.parse(localStorage.getItem('board'));

        if (this.timer) {
            this.timer.setSecondsRunningFromLocalStorage();
        }

        if (this.playerNameSection) {
            this.playerNameSection.setFromLocalStorage();
        }
    }

    private saveGame() {
        if (this.areBothPlayersConnected()) {
            localStorage.setItem('nextTurn', this.turn.toString());
            localStorage.setItem('board', JSON.stringify(this.board));

            if (this.playerNameSection) {
                this.playerNameSection.saveIntoLocalStorage();
            }

            if (this.timer) {
                this.timer.saveSecondsRunningToLocalStorage();
            }
        }
    }

    protected canvasMousemove = (event: MouseEvent) => {
        if (this.areBothPlayersConnected()) {
            let column = this.getColumnFromCursorPosition(event);
            this.moveDot(column);
        }
    };

    protected canvasClick = (event: MouseEvent) => {
        if (this.areBothPlayersConnected()) {
            let column = this.getColumnFromCursorPosition(event);
            this.landDot(column);
        }
    };

    public exit = () => {
        this.saveGame();
        Dialog.closeAllOpenDialogs();
        super.exit();
    };

    protected beforeUnload = () => {
        this.saveGame();
    }

    private pageVisibilityChange = () => {
        if (this.timer) {
            this.timer.pauseWhenDocumentHidden();
        }
    };

    protected closeGameAfterWinning() {
        // Clear game data
        localStorage.clear();

        super.closeGameAfterWinning();
    }

    protected landDot(column: number): number {
        if (this.board[column][0] === Dot.Empty) {
            let row = super.landDot(column);
            
            let dotCount = BoardLogic.countConsecutiveDots(this.board, column, row, this.turn);

            if (dotCount >= 4) {
                let winner: string = '';

                if (this.playerNameSection) {
                    if (this.turn === Dot.Red) {
                        winner = this.playerNameSection.getPlayerRed() + ' (Red)';
                    } else if (this.turn === Dot.Green) {
                        winner = this.playerNameSection.getPlayerGreen() + ' (Green)';
                    }
                }

                this.showWinDialog(winner, this.turn);
                this.closeGameAfterWinning();
            } else if (BoardLogic.isBoardFull(this.board)) {
                let message: string = '';
                if (this.playerNameSection) {
                    message += this.playerNameSection.getPlayerRed() + ' (Red) and ' + this.playerNameSection.getPlayerGreen() + ' (Green)';
                }
                message += ' are tied!';
                Dialog.notify([message]);
                this.closeGameAfterWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = this.turn;
                this.paintDotToDrop(column);
                Utils.playSound(Sound.LandDot);
            }

            return row;
        } else {
            return -1;
        }
    }

    protected setGameEvents() {
        super.setGameEvents();
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    }

    protected cleanUpEvents() {
        super.cleanUpEvents();
        document.removeEventListener('changevisibility', this.pageVisibilityChange);
    }

}