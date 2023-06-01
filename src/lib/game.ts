import Position from './position';
import PlayerNameSection from './player-name-section';
import GameOptions from './game-options';
import BoardLogic from '@danieldesira/daniels-connect4-common/lib/board-logic';
import { Coin } from '@danieldesira/daniels-connect4-common/lib/enums/coin';

export default abstract class Game {

    private canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;
    protected board: Array<Array<Coin>> = new Array(BoardLogic.columns);

    private exitBtn: HTMLButtonElement;
    protected playerNameSection: PlayerNameSection;
    private gameIndicatorsContainer: HTMLDivElement;
    private gameMenu: HTMLDivElement;

    protected turn: Coin = Coin.Red;

    private circleRadius: number;
    private rowGap: number;
    private colGap: number;
    private colOffset: number;
    private static verticalOffset: number = 70;

    protected constructor(options: GameOptions) {
        this.canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');

        BoardLogic.initBoard(this.board);

        if (options.exitBtnId) {
            this.exitBtn = document.getElementById(options.exitBtnId) as HTMLButtonElement;
        }

        if (options.playerRedId && options.playerGreenId) {
            this.playerNameSection = new PlayerNameSection(options.playerRedId, options.playerGreenId);
        }

        if (options.gameIndicatorsId) {
            this.gameIndicatorsContainer = document.getElementById(options.gameIndicatorsId) as HTMLDivElement;
        }

        if (options.menuId) {
            this.gameMenu = document.getElementById(options.menuId) as HTMLDivElement;
        }
    }

    protected start() {
        this.showGame();

        if (this.playerNameSection) {
            this.playerNameSection.printPlayerNames();
            this.playerNameSection.indicateTurn(this.turn);
        }

        this.resizeCanvas();
        this.setGameEvents();
    }

    private paintBoard() {
        let boardGradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        boardGradient.addColorStop(0, 'blue');
        boardGradient.addColorStop(1, 'aqua');
        this.context.fillStyle = boardGradient;
        this.context.fillRect(0, Game.verticalOffset, this.canvas.width, this.canvas.height);

        for (let col = BoardLogic.columns - 1; col >= 0; col--) {
            for (let row = BoardLogic.rows - 1; row >= 0; row--) {
                this.context.fillStyle = Game.getColor(this.board[col][row]);
                this.drawCircle(col, row);
            }
        }
    }

    protected setGameEvents() {
        this.canvas.addEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.addEventListener('click', this.canvasClick, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
        this.exitBtn.addEventListener('click', this.exit);
    }

    protected abstract canvasMousemove(event: MouseEvent): void;
    protected abstract canvasClick(event: MouseEvent): void;

    protected getColumnFromCursorPosition(event: MouseEvent): number {
        let position = Position.getCursorPosition(event, this.canvas);
        let column = Math.round((position.x - this.colOffset) / this.colGap);
        return column;
    }

    protected switchTurn() {
        if (this.turn === Coin.Red) {
            this.turn = Coin.Green;
        } else {
            this.turn = Coin.Red;
        }

        if (this.playerNameSection) {
            this.playerNameSection.indicateTurn(this.turn);
        }
    }

    protected moveCoin(column: number) {
        this.clearUpper();
        this.context.fillStyle = Game.getColor(this.turn);
        this.paintCoinToDrop(column);
    }

    protected landCoin(column: number): number {
        if (this.board[column][0] === Coin.Empty) {
            let row = BoardLogic.putCoin(this.board, this.turn, column);
            
            this.context.fillStyle = Game.getColor(this.turn);
            this.drawCircle(column, row);

            return row;
        } else {
            return -1;
        }
    }

    protected abstract showWinDialog(winner: string, currentTurn: Coin);

    protected closeGameAfterWinning() {
        this.cleanUpEvents();

        if (this.exitBtn) {
            this.exitBtn.classList.add('hide');
        }
        
        setTimeout(() => {
            this.resetValues();
            this.hideGame();

            if (this.playerNameSection) {
                this.playerNameSection.clear();
            }
        }, 3000);
    }

    protected paintCoinToDrop(column: number) {
        this.context.beginPath();
        this.context.arc(this.colOffset + column * this.colGap, this.circleRadius, this.circleRadius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    protected abstract beforeUnload(event: Event);

    private clearUpper() {
        this.context.clearRect(0, 0, this.canvas.width, Game.verticalOffset);
    }

    protected cleanUpEvents() {
        this.canvas.removeEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.removeEventListener('click', this.canvasClick, false);
        window.removeEventListener('beforeunload', this.beforeUnload);
        window.removeEventListener('resize', this.resizeCanvas);
        this.exitBtn.removeEventListener('click', this.exit);
    }

    protected exit() {
        this.cleanUpEvents();
        this.hideGame();
        this.resetValues();

        if (this.playerNameSection) {
            this.playerNameSection.clear();
        }
    }

    private resizeCanvas = () => {
        this.canvas.height = window.innerHeight - 100;
        this.canvas.width = window.innerWidth;

        if (this.canvas.width < 1000) {
            this.circleRadius = 20; // Mobile/tablet
        } else {
            this.circleRadius = 30; // Desktop
        }

        if (this.canvas.height > this.canvas.width) {
            this.colGap = this.canvas.width / BoardLogic.columns;
            this.rowGap = (this.canvas.height / BoardLogic.rows) - this.circleRadius;
        } else {
            this.colGap = this.canvas.width / BoardLogic.columns;
            this.rowGap = 65;
        }

        this.colOffset = this.colGap / 2;

        this.paintBoard();
    };

    protected resetValues() {
        this.turn = Coin.Red;
        BoardLogic.initBoard(this.board);
        
        if (this.playerNameSection) {
            this.playerNameSection.reset();
        }
    }

    private drawCircle(column: number, row: number) {
        this.context.beginPath();
        this.context.arc(this.colOffset + column * this.colGap, Game.verticalOffset * 2 + row * this.rowGap, this.circleRadius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fill();
    }

    protected areBothPlayersConnected(): boolean {
        return this.playerNameSection && this.playerNameSection.areBothPlayersConnected();
    }

    private showGame() {
        this.canvas.classList.remove('hide');
        this.exitBtn.classList.remove('hide');
        this.gameIndicatorsContainer.classList.remove('hide');
        this.gameMenu.classList.add('hide');
    }

    private hideGame() {
        this.canvas.classList.add('hide');
        this.exitBtn.classList.add('hide');
        this.gameIndicatorsContainer.classList.add('hide');
        this.gameMenu.classList.remove('hide');
    }

    protected static getColor(color: Coin): string {
        let value: string = '';
        switch (color) {
            case Coin.Empty:
                value = 'lightyellow';
                break;
            case Coin.Red:
                value = 'red';
                break;
            case Coin.Green:
                value = 'greenyellow';
                break;
        }
        return value;
    }

}