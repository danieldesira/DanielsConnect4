import { Dot } from './enums/dot';
import { Position } from './position';
import { Utils } from './utils';
import { Sound } from './enums/sound';
import { BoardLogic } from './board-logic';
import { Timer } from './timer';
import { PlayerNameSection } from './player-name-section';
import { GameOptions } from './game-options';
import { GameMode } from './enums/game-mode';

export abstract class Game {

    private canvas: any;
    private context: any;
    protected board: Array<Array<Dot>> = new Array(BoardLogic.columns);

    private exitBtn: any;
    protected playerNames: PlayerNameSection;

    protected turn: Dot = Dot.Red;

    protected mode: GameMode;
    public onGameEnd: Function;

    private circleRadius: number;
    private rowGap: number;
    private colGap: number;

    protected timer: Timer;

    protected constructor(options: GameOptions) {
        this.canvas = document.getElementById(options.canvasId);
        this.context = this.canvas.getContext('2d');

        BoardLogic.initBoard(this.board);

        if (options.exitBtnId) {
            this.exitBtn = document.getElementById(options.exitBtnId);
        }

        if (options.timerId) {
            this.timer = new Timer(options.timerId);
        }

        if (options.playerRedId && options.playerGreenId) {
            this.playerNames = new PlayerNameSection(options.playerRedId, options.playerGreenId);
        }
    }

    protected start() {
        if (this.playerNames) {
            this.playerNames.printPlayerNames(this.mode);
            this.playerNames.indicateTurn(this.turn);
        }

        this.resizeCanvas();
        this.setGameEvents();

        if (this.timer) {
            this.timer.set();
        }
    }

    private paintBoard() {
        let boardGradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        boardGradient.addColorStop(0, 'blue');
        boardGradient.addColorStop(1, 'aqua');
        this.context.fillStyle = boardGradient;
        this.context.fillRect(0, 70, this.canvas.width, this.canvas.height);

        for (let col = BoardLogic.columns - 1; col >= 0; col--) {
            for (let row = BoardLogic.rows - 1; row >= 0; row--) {
                this.context.fillStyle = this.board[col][row];

                this.context.beginPath();
                this.context.arc(50 + col * this.colGap, 150 + row * this.rowGap, this.circleRadius, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
            }
        }
    }

    protected setGameEvents() {
        this.canvas.addEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.addEventListener('click', this.canvasClick, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
    }

    protected abstract canvasMousemove(event);
    protected abstract canvasClick(event);

    protected getColumnFromCursorPosition(event): number {
        let position = Position.getCursorPosition(event, this.canvas);
        let column = Math.round((position.x - 50) / this.colGap);
        return column;
    }

    protected switchTurn() {
        if (this.turn === Dot.Red) {
            this.turn = Dot.Green;
        } else if (this.turn === Dot.Green) {
            this.turn = Dot.Red;
        }

        if (this.playerNames) {
            this.playerNames.indicateTurn(this.turn);
        }
    }

    protected moveDot(column: number) {
        this.clearUpper();
        this.context.fillStyle = this.turn;
        this.paintDotToDrop(column);
    }

    protected landDot(column: number) {
        let row: number;

        if (this.board[column][0] === Dot.Empty) {

            // Places the circle at the buttom of the column
            for (var r = BoardLogic.rows - 1; r > -1; r--) {
                if (this.board[column][r] === Dot.Empty) {
                    this.board[column][r] = this.turn;
                    row = r;
                    break;
                }
            }
            
            this.context.fillStyle = this.turn;
            
            // Draws the circle at the appropriate position
            this.context.beginPath();
            this.context.arc(50 + column * this.colGap, 150 + r * this.rowGap, this.circleRadius, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();
            
            let dotCount = BoardLogic.countConsecutiveDots(this.board, column, row, this.turn);

            if (dotCount >= 4) {
                let winner: string = '';

                if (this.playerNames) {
                    if (this.turn === Dot.Red) {
                        winner = this.playerNames.getPlayerRed() + ' (Red)';
                    } else if (this.turn === Dot.Green) {
                        winner = this.playerNames.getPlayerGreen() + ' (Green)';
                    }
                }

                this.winDialog(winner);
                this.closeGameAfterWinning();
            } else if (BoardLogic.isBoardFull(this.board)) {
                let message: string = '';
                if (this.playerNames) {
                    message += this.playerNames.getPlayerRed() + ' (Red) and ' + this.playerNames.getPlayerGreen() + ' (Green)';
                }
                message += ' are tied!';
                alert(message);
                this.closeGameAfterWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = this.turn;
                this.paintDotToDrop(column);
                Utils.playSound(Sound.LandDot);
            }
        }
    }

    protected winDialog(winner: string) {
        let winMsg: string = winner + ' wins!';
        if (this.timer) {
            winMsg += '\nTime taken: ' + this.timer.getTimeInStringFormat();
        }
        Utils.playSound(Sound.Win);
        alert(winMsg);
    }

    protected closeGameAfterWinning() {
        this.cleanUpEvents();

        if (this.playerNames) {
            this.playerNames.clear();
        }

        if (this.timer) {
            this.timer.stop();
        }

        if (this.exitBtn) {
            this.exitBtn.classList.add('hide');
        }

        this.resetValues();

        // Run delegate function to return to main menu, in case it is defined
        if (this.onGameEnd) {
            setTimeout(this.onGameEnd, 3000);
        }
    }

    private paintDotToDrop(column: number) {
        this.context.beginPath();
        this.context.arc(50 + column * this.colGap, this.circleRadius, this.circleRadius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    protected abstract beforeUnload(event);

    private clearUpper() {
        this.context.clearRect(0, 0, this.canvas.width, 70);
    }

    protected cleanUpEvents() {
        this.canvas.removeEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.removeEventListener('click', this.canvasClick, false);
        window.removeEventListener('beforeunload', this.beforeUnload);
        window.removeEventListener('resize', this.resizeCanvas);
    }

    protected exit() {
        this.cleanUpEvents();
        this.onGameEnd();
        this.resetValues();

        if (this.playerNames) {
            this.playerNames.clear();
        }

        if (this.timer) {
            this.timer.stop();
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
            this.rowGap = this.canvas.height / BoardLogic.rows;
        } else {
            this.colGap = this.canvas.width / BoardLogic.columns;
            this.rowGap = 65;
        }

        this.paintBoard();
    };

    protected resetValues() {
        this.turn = Dot.Red;
        BoardLogic.initBoard(this.board);
        
        if (this.playerNames) {
            this.playerNames.reset();
        }

        if (this.timer) {
            this.timer.reset();
        }
    }

}