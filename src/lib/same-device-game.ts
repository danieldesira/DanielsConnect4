import Dialog from "./dialog/dialog";
import Game from "./game";
import GameOptions from "./game-options";
import { Sound } from "./enums/sound";
import Utils from "./utils";
import Timer from "./timer";
import BoardLogic, { Coin, randomiseColor } from "@danieldesira/daniels-connect4-common";

export default class SameDeviceGame extends Game {

    private static instance: SameDeviceGame;
    private timer: Timer;

    private constructor(options: GameOptions) {
        super(options);

        if (options.timerCountdownId) {
            this.timer = new Timer(options.timerCountdownId);
        }
    }

    public static getInstance(options: GameOptions): SameDeviceGame {
        if (!SameDeviceGame.instance) {
            SameDeviceGame.instance = new SameDeviceGame(options);
        }
        return SameDeviceGame.instance;
    }

    private setTimer = () => {
        if (this.timer) {
            this.timer.set();
        }
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
                noCallback: this.cancelPreviousGame,
                yesColor: 'green',
                noColor: 'red'
            });
        } else {
            this.turn = randomiseColor();
            this.onGameDataCheck();
        }
    }

    private continuePreviousGame = () => {
        this.restoreLastGame();
        this.onGameDataCheck();
    };

    private cancelPreviousGame = () => {
        localStorage.clear();
        this.turn = randomiseColor();
        this.onGameDataCheck();
    };

    private restoreLastGame() {
        this.turn = parseInt(localStorage.getItem('nextTurn'));
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
            this.moveCoin(column);
        }
    };

    protected canvasClick = (event: MouseEvent) => {
        if (this.areBothPlayersConnected()) {
            let column = this.getColumnFromCursorPosition(event);
            this.landCoin(column);
        }
    };

    public exit = () => {
        this.saveGame();
        Dialog.closeAllOpenDialogs();

        if (this.timer) {
            this.timer.stop();
        }

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

        if (this.timer) {
            this.timer.stop();
        }

        super.closeGameAfterWinning();
    }

    protected landCoin(column: number): number {
        if (this.board[column][0] === Coin.Empty) {
            let row = super.landCoin(column);
            
            let coinCount = BoardLogic.countConsecutiveCoins(this.board, column, row, this.turn);

            if (coinCount >= 4) {
                let winner: string = '';

                if (this.playerNameSection) {
                    if (this.turn === Coin.Red) {
                        winner = `${this.playerNameSection.getPlayerRed()} (Red)`;
                    } else if (this.turn === Coin.Green) {
                        winner = `${this.playerNameSection.getPlayerGreen()} (Green)`;
                    }
                }

                this.showWinDialog(winner, this.turn);
                this.closeGameAfterWinning();
            } else if (BoardLogic.isBoardFull(this.board)) {
                let message: string = '';
                if (this.playerNameSection) {
                    message += `${this.playerNameSection.getPlayerRed()} (Red) and ${this.playerNameSection.getPlayerGreen()} (Green)`;
                }
                message += ' are tied!';
                Dialog.notify([message]);
                this.closeGameAfterWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = Game.getColor(this.turn);
                this.paintCoinToDrop(column);
                Utils.playSound(Sound.LandCoin);
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

    protected showWinDialog(winner: string, currentTurn: Coin) {
        let winMsg: Array<string> = new Array();
        winMsg.push(`${winner} wins!`);
        if (this.timer) {
            winMsg.push(`Time taken: ${this.timer.getTimeInStringFormat()}`);
        }
        Utils.playSound(Sound.Win);
        Dialog.notify(winMsg);
    }

    protected resetValues() {
        super.resetValues();

        if (this.timer) {
            this.timer.reset();
        }
    }

}