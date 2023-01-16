import { GameMode } from './game-mode';
import { Dot } from './dot';

export class Game {

    private static columns: number = 9;
    private static rows: number = 8;

    private canvas: any;
    private context: any;
    private board: Array<Array<Dot>> = new Array(Game.columns);

    private exitBtn: any;
    private timerSpan: any;
    private playerRedSpan: any;
    private playerGreenSpan: any;

    private turn: Dot = Dot.RED;

    private playerRed: string;
    private playerGreen: string;

    public mode: GameMode;
    public onGameEnd: Function;

    private secondsRunning: number;
    private timerInterval: any;

    private circleRadius: number;
    private rowGap: number;
    private colGap: number;

    private socket: WebSocket;

    constructor(canvasId: string,
                exitBtnId: string = null,
                timerId: string = null,
                playerRedId: string = null,
                playerGreenId: string = null) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        // Initialise board with empty dots
        for (let col = 0; col < Game.columns; col++) {
            this.board[col] = new Array(Game.rows);
            for (let row = 0; row < Game.rows; row++){
                this.board[col][row] = Dot.EMPTY;
            }
        }

        if (exitBtnId !== null) {
            this.exitBtn = document.getElementById(exitBtnId);
        }

        if (timerId !== null) {
            this.timerSpan = document.getElementById(timerId);
            this.secondsRunning = 0;
        }

        if (playerRedId !== null) {
            this.playerRedSpan = document.getElementById(playerRedId);
        }

        if (playerGreenId !== null) {
            this.playerGreenSpan = document.getElementById(playerGreenId);
        }
    }

    public start() {
        this.checkGameData();
        this.resizeCanvas();
        this.setUpPlayerNames();
        this.setGameEvents();
        this.setTimer();
    }

    private checkGameData(){
        if (this.mode === GameMode.SAME_PC) {
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
    }

    private setUpPlayerNames() {
        if (this.mode === GameMode.SAME_PC) {
            if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
                this.playerRed = prompt('Please enter name for Red Player!');
                this.playerGreen = prompt('Please enter name for Green Player!');
            }
        }

        // Print player names on screen
        if (this.playerGreenSpan) {
            this.playerGreenSpan.innerText = this.playerGreen;
        }
        if (this.playerRedSpan) {
            this.playerRedSpan.innerText = this.playerRed;
        }
    }

    private paintBoard() {
        let boardGradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        boardGradient.addColorStop(0, 'blue');
        boardGradient.addColorStop(1, 'aqua');
        this.context.fillStyle = boardGradient;
        this.context.fillRect(0, 70, this.canvas.width, this.canvas.height);

        for (let col = Game.columns - 1; col >= 0; col--) {
            for (let row = Game.rows - 1; row >= 0; row--) {
                if (this.board[col][row] === Dot.RED) {
                    this.context.fillStyle = 'red';
                } else if (this.board[col][row] === Dot.GREEN) {
                    this.context.fillStyle = 'greenyellow';
                } else {
                    this.context.fillStyle = 'black';
                }

                this.context.beginPath();
                this.context.arc(50 + col * this.colGap, 150 + row * this.rowGap, this.circleRadius, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
            }
        }
    }

    private getCursorPosition(event): Position {
        var x: number;
        var y: number;
        if (event.pageX !== undefined || event.pageY !== undefined) {
            x = event.pageX;
            y = event.pageY;
        }
        else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= this.canvas.offsetLeft;
        y -= this.canvas.offsetTop;
        return new Position(x, y);
    }

    private setGameEvents() {
        this.canvas.addEventListener('mousemove', this.moveDot, false);
        this.canvas.addEventListener('click', this.landDot, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    }

    private moveDot = (event) => {
        this.clearUpper();

        let position: Position = this.getCursorPosition(event);
        let column = Math.round((position.x - 50) / this.colGap);
        
        if (this.turn == Dot.RED) {
            this.context.fillStyle = 'red';
        } else if (this.turn == Dot.GREEN) {
            this.context.fillStyle = 'greenyellow';
        }

        this.paintDotToDrop(column);
    };

    private landDot = (event) => {
        let position = this.getCursorPosition(event);
        let column = Math.round((position.x - 50) / this.colGap);
        let row: number;

        if (this.board[column][0] === Dot.EMPTY) {

            // Places the circle at the buttom of the column
            for (var r = Game.rows - 1; r > -1; r--) {
                if (this.board[column][r] === 0) {
                    this.board[column][r] = this.turn;
                    row = r;
                    break;
                }
            }
            
            if (this.turn === Dot.RED) {
                this.context.fillStyle = 'red';
            } else if (this.turn === Dot.GREEN) {
                this.context.fillStyle = 'greenyellow';
            }
            
            // Draws the circle at the appropriate position
            this.context.beginPath();
            this.context.arc(50 + column * this.colGap, 150 + r * this.rowGap, this.circleRadius, 0, Math.PI * 2);
            this.context.closePath();
            this.context.fill();
            
            let dotCount = this.checkDotCount(column, row);

            // Announce winner in case any player completes 4 Dots
            if (dotCount > 3) {
                let winner: string = '';
                if (this.turn === Dot.RED) {
                    winner = this.playerRed + ' (Red)';
                } else if (this.turn === Dot.GREEN) {
                    winner = this.playerGreen + ' (Green)';
                }

                if (this.exitBtn) {
                    this.exitBtn.classList.add('hide');
                }

                let winMsg: string = winner + ' wins!';
                if (this.timerSpan) {
                    winMsg += '\nTime taken: ' + this.timerSpan.innerText;
                }
                alert(winMsg);

                // Clear game data
                localStorage.clear();

                this.cleanUpEvents();
                this.stopTimer();
                this.clearPlayerNames();

                // Run delegate function to return to main menu, in case it is defined
                if (this.onGameEnd !== undefined && this.onGameEnd !== null){
                    setTimeout(this.onGameEnd, 3000);
                }
            }
            
            // Switches turn
            if (this.turn === Dot.RED) {
                this.turn = Dot.GREEN;
                this.context.fillStyle = 'greenyellow';
            } else if (this.turn === Dot.GREEN) {
                this.turn = Dot.RED;
                this.context.fillStyle = 'red';
            }

            this.paintDotToDrop(column);

        }
    };

    private paintDotToDrop(column: number) {
        this.context.beginPath();
        this.context.arc(50 + column * this.colGap, this.circleRadius, this.circleRadius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    private beforeUnload = () => {
        if (this.mode === GameMode.SAME_PC) {
            this.saveGame();
        } else if (this.mode === GameMode.SOCKETS) {
            // add logic for confirmation box before closing
        }
    };

    private timerCallback = () => {
        this.secondsRunning++;
        let minutes: number = Math.floor(this.secondsRunning / 60);
        let seconds: number = this.secondsRunning % 60;
        this.timerSpan.innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };

    private pageVisibilityChange = () => {
        if (document.hidden) {
            clearInterval(this.timerInterval);
        } else {
            this.timerInterval = setInterval(this.timerCallback, 1000);
        }
    };

    private clearUpper() {
        this.context.clearRect(0, 0, this.canvas.width, 70);
    }

    private checkDotCount(column: number, row: number): number {
        let count: number = row;
        let dotCount: number = 0;

        // Vertical check
        while (dotCount < 4 && count < Game.rows && this.board[column][count] === this.turn) {
            dotCount++;
            count++;
        }
        
        if (dotCount < 4) {

            // Horizontal check
            dotCount = 0;
            count = column;
            while (count < Game.columns && this.board[count][row] === this.turn) {
                dotCount++;
                count++;
            }
            count = column - 1;
            while (count > -1 && this.board[count][row] === this.turn) {
                dotCount++;
                count--;
            }
        
            // Diagonal checks
            if (dotCount < 4) {
                dotCount = 0;
                let rowCount: number = row - 1;
                let colCount: number = column + 1;
                while (dotCount < 4 && rowCount > -1 &&  colCount < Game.columns && this.board[colCount][rowCount] === this.turn) {
                    dotCount++;
                    colCount++; //right columns
                    rowCount--; //upper rows
                }
                colCount = column;
                rowCount = row;
                while (dotCount < 4 && rowCount < Game.rows && colCount > -1 && this.board[colCount][rowCount] === this.turn) {
                    dotCount++;
                    colCount--; // left columns
                    rowCount++; // lower rows
                }
                
                if (dotCount < 4) {
                    dotCount = 0;
                    rowCount = row - 1;
                    colCount = column - 1;
                    while (dotCount < 4 && rowCount > -1 && colCount > -1 && this.board[colCount][rowCount] === this.turn) {
                        dotCount++;
                        colCount--; // left columns
                        rowCount--; // upper rows
                    }
                    colCount = column;
                    rowCount = row;
                    while (dotCount < 4 && rowCount < Game.rows && colCount < Game.columns && this.board[colCount][rowCount] === this.turn) {
                        dotCount++;
                        colCount++; // right columns
                        rowCount++; // lower rows
                    }
                }
            }
        }

        return dotCount;
    }

    private cleanUpEvents() {
        this.canvas.removeEventListener('mousemove', this.moveDot, false);
        this.canvas.removeEventListener('click', this.landDot, false);
        window.removeEventListener('beforeunload', this.beforeUnload);
        window.removeEventListener('resize', this.resizeCanvas);
        document.removeEventListener('changevisibility', this.pageVisibilityChange);
    }

    private saveGame() {
        localStorage.setItem('nextTurn', this.turn.toString());
	    localStorage.setItem('board', JSON.stringify(this.board));
        localStorage.setItem('playerRed', this.playerRed);
        localStorage.setItem('playerGreen', this.playerGreen);
        localStorage.setItem('secondsRunning', this.secondsRunning.toString());
    }

    private restoreLastGame() {
        this.turn = parseInt(localStorage.getItem('nextTurn'));
        this.playerRed = localStorage.getItem('playerRed');
        this.playerGreen = localStorage.getItem('playerGreen');
        this.board = JSON.parse(localStorage.getItem('board'));
        this.secondsRunning = parseInt(localStorage.getItem('secondsRunning'));
    }

    public exit() {
        this.cleanUpEvents();
        if (this.mode === GameMode.SAME_PC) {
            this.saveGame();
        }
        this.onGameEnd();
        this.stopTimer();
        this.clearPlayerNames();
    }

    private setTimer() {
        if (this.timerSpan) {
            this.timerCallback();
            this.timerInterval = setInterval(this.timerCallback, 1000);
            this.timerSpan.classList.remove('hide');
        }
    }

    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerSpan.classList.add('hide');
        }
    }

    private clearPlayerNames() {
        if (this.playerGreenSpan) {
            this.playerGreenSpan.innerText = '';
        }
        if (this.playerRedSpan) {
            this.playerRedSpan.innerText = '';
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
            this.colGap = this.canvas.width / (Game.columns + 1);
            this.rowGap = this.canvas.height / (Game.rows + 1);
        } else {
            this.colGap = this.canvas.width / (Game.columns + 1);
            this.rowGap = 65;
        }

        this.paintBoard();
    };

    private defineSocket() {
        // connect to websocket

        // define event handler for ServerSent event
    }

}

class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}