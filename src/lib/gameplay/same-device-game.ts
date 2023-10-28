import Dialog from "../dialog/dialog";
import Game from "./game";
import GameOptions from "./game-options";
import { Sound } from "../enums/sound";
import Utils from "../utils";
import Timer from "./timer";
import { BoardDimensions, Coin, randomiseTurn } from "@danieldesira/daniels-connect4-common";
import { DialogIds } from "../enums/dialog-ids";
import PreviousGameData from "../models/previous-game-data";
import { BoardLogic } from "@danieldesira/daniels-connect4-common/lib/board-logic";
import dimensionsSelectData from "../dimensions-select";

export default class SameDeviceGame extends Game {

    private static instance: SameDeviceGame;
    private timer: Timer;

    private constructor(options: GameOptions) {
        super(options);
        
        if (options.timerId) {
            this.timer = new Timer(options.timerId);
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
        if (this.timerSpan) {
            this.timerSpan.classList.remove('hidden');
        }
        if (this.countdownSpan) {
            this.countdownSpan.classList.add('hidden');
        }
    }

    private onGameDataCheck() {
        this.setUpPlayerNames();
        
        if (this.areBothPlayersConnected()) {
            this.setTimer();
        }

        super.start();
    }

    private setUpPlayerNames() {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as PreviousGameData;

        const onPromptOK = () => {
            const redInput = document.getElementById('dialog-input-red') as HTMLInputElement;
            const greenInput = document.getElementById('dialog-input-green') as HTMLInputElement;
            if (redInput.value && greenInput.value && redInput.value.trim()
                    && greenInput.value.trim()) {
                this.playerNameSection?.setPlayerRed(redInput.value);
                this.playerNameSection?.setPlayerGreen(greenInput.value);
                this.setTimer();
            }

            const dimensionsSelect = document.getElementById('dialog-select-dimensions') as HTMLSelectElement;
            const dimensions = parseInt(dimensionsSelect.value) as BoardDimensions;
            this.board = new BoardLogic(dimensions);
        };

        if (!gameData) {
            dimensionsSelectData.onChange = (value: string) => {
                const dimensions = parseInt(value);
                this.board = new BoardLogic(dimensions);
                this.resizeCanvas();
            };
            Dialog.prompt({
                id: DialogIds.PlayerNames,
                title: 'Input Players',
                text: ['Please enter player names! (10 characters or less.)'],
                onOK: () => onPromptOK(),
                onCancel: this.exit,
                inputs: [
                    {
                        label: 'Player Red',
                        name: 'red',
                        type: 'text',
                        limit: 10,
                        required: true
                    },
                    {
                        label: 'Player Green',
                        name: 'green',
                        type: 'text',
                        limit: 10,
                        required: true
                    }
                ],
                selects: [dimensionsSelectData]
            });
        }
    }

    private checkGameData() {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as PreviousGameData;
        
        if (gameData) {
            Dialog.confirm({
                id: DialogIds.ContinueGame,
                title: null,
                text: ['Do you want to continue playing the previous game?'],
                yesCallback: this.continuePreviousGame,
                noCallback: this.cancelPreviousGame,
                yesColor: 'green',
                noColor: 'red'
            });
        } else {
            this.turn = randomiseTurn();
            this.onGameDataCheck();
        }
    }

    private continuePreviousGame = () => {
        this.restoreLastGame();
        this.onGameDataCheck();
    };

    private cancelPreviousGame = () => {
        this.clearGameData();
        this.turn = randomiseTurn();
        this.onGameDataCheck();
    };

    private restoreLastGame() {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as PreviousGameData;
        
        this.turn = gameData.nextTurn;
        this.board = new BoardLogic(gameData.dimensions);
        this.board.setBoard(gameData.board);

        if (this.timer) {
            this.timer.setSecondsRunning(gameData.secondsRunning);
        }

        if (this.playerNameSection) {
            this.playerNameSection.setPlayerGreen(gameData.playerGreen);
            this.playerNameSection.setPlayerRed(gameData.playerRed);
        }
    }

    private saveGame() {
        if (this.areBothPlayersConnected()) {
            const gameData: PreviousGameData = {
                nextTurn: this.turn,
                board: this.board.getBoard(),
                secondsRunning: this.timer?.getSecondsRunning(),
                playerRed: this.playerNameSection?.getPlayerRed(),
                playerGreen: this.playerNameSection?.getPlayerGreen(),
                dimensions: this.board.getDimensions()
            };
            localStorage.setItem('gameData', JSON.stringify(gameData));
        }
    }

    protected canvasMousemove = (event: MouseEvent) => {
        if (this.areBothPlayersConnected()) {
            this.currentCoinColumn = this.getColumnFromCursorPosition(event);
            this.moveCoin();
        }
    };

    protected canvasClick = (event: MouseEvent) => {
        if (this.areBothPlayersConnected()) {
            this.currentCoinColumn = this.getColumnFromCursorPosition(event);
            this.landCoin();
        }
    };

    protected canvasTouchmove = (event: TouchEvent) => {
        if (this.areBothPlayersConnected()) {
            const firstTouch = event.changedTouches[0];
            this.currentCoinColumn = this.getColumnFromCursorPosition(firstTouch);
            this.moveCoin();
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
        this.clearGameData();

        if (this.timer) {
            this.timer.stop();
        }

        super.closeGameAfterWinning();
    }

    protected landCoin(): number {
        if (this.board.getBoard()[this.currentCoinColumn][0] === Coin.Empty) {
            const row = super.landCoin();
            
            const coinCount = this.board.countConsecutiveCoins(this.currentCoinColumn, row, this.turn);

            if (coinCount >= 4) {
                let winner: string = '';

                if (this.turn === Coin.Red) {
                    winner = `${this.playerNameSection?.getPlayerRed()} (Red)`;
                } else if (this.turn === Coin.Green) {
                    winner = `${this.playerNameSection?.getPlayerGreen()} (Green)`;
                }

                this.showWinDialog(winner, this.turn);
                this.closeGameAfterWinning();
            } else if (this.board.isBoardFull()) {
                const message: string = `${this.playerNameSection?.getPlayerRed()} (Red) and ${this.playerNameSection?.getPlayerGreen()} (Green) are tied!`;
                Dialog.notify({
                    id: DialogIds.GameEnd,
                    title: 'Tie',
                    text: [message]
                });
                this.closeGameAfterWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = Game.getColor(this.turn);
                this.paintCoinToDrop(this.currentCoinColumn);
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

    protected showWinDialog(winner: string, _: Coin) {
        const winMsg: Array<string> = new Array();
        winMsg.push(`${winner} wins!`);
        if (this.timer) {
            winMsg.push(`Time taken: ${this.timer.getTimeInStringFormat()}`);
        }
        Utils.playSound(Sound.Win);
        Dialog.notify({
            id: DialogIds.GameEnd,
            text: winMsg,
            title: 'We have a winner!'
        });
    }

    protected resetValues() {
        super.resetValues();

        if (this.timer) {
            this.timer.reset();
        }
    }

    protected handleKeyDown = (event: KeyboardEvent) => {
        if (this.areBothPlayersConnected()) {
            if (Game.moveLeftKeys.includes(event.key)) {
                if (this.currentCoinColumn > 0) {
                    this.currentCoinColumn--;
                    this.moveCoin();
                }
            }
    
            if (Game.moveRightKeys.includes(event.key)) {
                if (this.currentCoinColumn < this.board.getColumns() - 1) {
                    this.currentCoinColumn++;
                    this.moveCoin();
                }
            }
    
            if (event.key === ' ') {
                this.landCoin();
            }
        }

        if (event.key === 'Escape') {
            this.exit();
        }
    };

    private clearGameData() {
        localStorage.removeItem('gameData');
    }

}