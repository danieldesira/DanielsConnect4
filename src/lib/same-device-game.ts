import Dialog from "./dialog/dialog";
import Game from "./game";
import GameOptions from "./game-options";
import { Sound } from "./enums/sound";
import Utils from "./utils";
import Timer from "./timer";
import { BoardDimensions, Coin, randomiseColor } from "@danieldesira/daniels-connect4-common";
import { DialogIds } from "./enums/dialog-ids";
import PreviousGameData, { MainGameDataModel } from "./models/previous-game-data";
import { BoardLogic } from "@danieldesira/daniels-connect4-common/lib/board-logic";

export default class SameDeviceGame extends Game {

    private static instance: SameDeviceGame;
    private timer: Timer;
    private dimensions: BoardDimensions;

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

    public start(dimensions: BoardDimensions = BoardDimensions.Large) {
        this.dimensions = dimensions;
        this.board = new BoardLogic(dimensions);
        this.checkGameData();
    }

    private onGameDataCheck() {
        this.setUpPlayerNames(this.setTimer, this.exit);
        
        if (this.areBothPlayersConnected()) {
            this.setTimer();
        }

        super.start();
    }

    private setUpPlayerNames(okAction: Function, cancelAction: Function) {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as MainGameDataModel;
        const dimensionData = this.getGameDimensionData(gameData);

        const onPromptOK = (): string => {
            const redInput = document.getElementById('dialog-input-red') as HTMLInputElement;
            const greenInput = document.getElementById('dialog-input-green') as HTMLInputElement;
            if (redInput.value && greenInput.value && redInput.value.trim()
                    && greenInput.value.trim() && this.playerNameSection) {
                this.playerNameSection.setPlayerRed(redInput.value);
                this.playerNameSection.setPlayerGreen(greenInput.value);
                okAction();
                return null;
            }
        };

        if (!dimensionData) {
            Dialog.prompt({
                id: DialogIds.PlayerNames,
                title: 'Input Players',
                text: ['Please enter player names! (10 characters or less.)'],
                onOK: () => onPromptOK(),
                onCancel: cancelAction,
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
                ]
            });
        }
    }

    private checkGameData() {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as MainGameDataModel;
        const dimensionData = this.getGameDimensionData(gameData);
        
        if (dimensionData) {
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
            this.turn = randomiseColor();
            this.onGameDataCheck();
        }
    }

    private continuePreviousGame = () => {
        this.restoreLastGame();
        this.onGameDataCheck();
    };

    private cancelPreviousGame = () => {
        this.clearGameData();
        this.turn = randomiseColor();
        this.onGameDataCheck();
    };

    private restoreLastGame() {
        const gameData = JSON.parse(localStorage.getItem('gameData')) as MainGameDataModel;
        const dimensionData = this.getGameDimensionData(gameData);
        
        this.turn = dimensionData.nextTurn;
        this.board.setBoard(dimensionData.board);

        if (this.timer) {
            this.timer.setSecondsRunning(dimensionData.secondsRunning);
        }

        if (this.playerNameSection) {
            this.playerNameSection.setPlayerGreen(dimensionData.playerGreen);
            this.playerNameSection.setPlayerRed(dimensionData.playerRed);
        }
    }

    private saveGame() {
        if (this.areBothPlayersConnected()) {
            let gameData = JSON.parse(localStorage.getItem('gameData')) as MainGameDataModel;
            if (!gameData) {
                gameData = {
                    small: null,
                    medium: null,
                    large: null
                };
            }
            const dimensionData: PreviousGameData = {
                nextTurn: this.turn,
                board: this.board.getBoard(),
                secondsRunning: this.timer?.getSecondsRunning(),
                playerRed: this.playerNameSection?.getPlayerRed(),
                playerGreen: this.playerNameSection?.getPlayerGreen()
            };
            switch (this.dimensions) {
                case BoardDimensions.Small:
                    gameData.small = dimensionData;
                    break;
                case BoardDimensions.Medium:
                    gameData.medium = dimensionData;
                    break;
                case BoardDimensions.Large:
                    gameData.large = dimensionData;
                    break;
            }
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

                if (this.playerNameSection) {
                    if (this.turn === Coin.Red) {
                        winner = `${this.playerNameSection.getPlayerRed()} (Red)`;
                    } else if (this.turn === Coin.Green) {
                        winner = `${this.playerNameSection.getPlayerGreen()} (Green)`;
                    }
                }

                this.showWinDialog(winner, this.turn);
                this.closeGameAfterWinning();
            } else if (this.board.isBoardFull()) {
                let message: string = '';
                if (this.playerNameSection) {
                    message += `${this.playerNameSection.getPlayerRed()} (Red) and ${this.playerNameSection.getPlayerGreen()} (Green)`;
                }
                message += ' are tied!';
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
        const gameData = JSON.parse(localStorage.getItem('gameData')) as MainGameDataModel;
        switch (this.dimensions) {
            case BoardDimensions.Small:
                gameData.small = null;
                break;
            case BoardDimensions.Medium:
                gameData.medium = null;
                break;
            case BoardDimensions.Large:
                gameData.large = null;
                break;
        }
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    private getGameDimensionData(gameData: MainGameDataModel): PreviousGameData | null {
        let dimensionData: PreviousGameData = null;
        if (gameData) {
            switch (this.dimensions) {
                case BoardDimensions.Small:
                    dimensionData = gameData.small;
                    break;
                case BoardDimensions.Medium:
                    dimensionData = gameData.medium;
                    break;
                case BoardDimensions.Large:
                    dimensionData = gameData.large;
                    break;
            }
        }
        return dimensionData;
    }

}