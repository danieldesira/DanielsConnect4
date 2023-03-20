import { Dot } from "./enums/dot";
import { Game } from "./game";
import { GameOptions } from "./game-options";

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

    public start(): void {
        this.checkGameData();

        if (this.playerNames) {
            this.playerNames.setUpPlayerNames();
        }

        if (this.timer) {
            this.timer.setRunnable(true);
        }

        super.start();
    }

    private checkGameData() {
        let board = localStorage.getItem('board');
        let nextTurn = localStorage.getItem('nextTurn');
        
        if (board && nextTurn) {
            let restore = confirm('Do you want to continue playing the previous game? OK/Cancel');
            if (restore) {
                this.restoreLastGame();
            } else {
                localStorage.clear();
            }
        }
    }

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

        if (this.playerNames) {
            this.playerNames.setFromLocalStorage();
        }
    }

    private saveGame() {
        localStorage.setItem('nextTurn', this.turn.toString());
	    localStorage.setItem('board', JSON.stringify(this.board));

        if (this.playerNames) {
            this.playerNames.saveIntoLocalStorage();
        }

        if (this.timer) {
            this.timer.saveSecondsRunningToLocalStorage();
        }
    }

    protected canvasMousemove = (event) => {
        let column = this.getColumnFromCursorPosition();
        this.moveDot(column);
    };

    protected canvasClick = (event) => {
        let column = this.getColumnFromCursorPosition();
        this.landDot(column);
    };

    public exit() {
        this.saveGame();
        super.exit();
    }

    protected beforeUnload = (event) => {
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

    protected setGameEvents() {
        super.setGameEvents();
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    }

    protected cleanUpEvents() {
        super.cleanUpEvents();
        document.removeEventListener('changevisibility', this.pageVisibilityChange);
    }

}