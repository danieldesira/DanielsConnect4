import { GameMode } from './enums/game-mode';
import { Dot } from './enums/dot';
import { Position } from './position';
import { Utils } from './utils';

export class Game {

    private static instance: Game;

    private static columns: number = 9;
    private static rows: number = 8;

    private canvas: any;
    private context: any;
    private board: Array<Array<Dot>> = new Array(Game.columns);

    private exitBtn: any;
    private timerSpan: any;
    private playerRedSpan: any;
    private playerGreenSpan: any;

    private turn: Dot = Dot.Red;

    private playerRed: string;
    private playerGreen: string;

    public mode: GameMode;
    public onGameEnd: Function;

    private secondsRunning: number;
    private timeouts: Array<any> = [];

    private circleRadius: number;
    private rowGap: number;
    private colGap: number;

    // Network game state
    private socket: WebSocket;
    private playerColor: Dot;
    private gameId: number;

    private constructor(canvasId: string,
                exitBtnId: string,
                timerId: string,
                playerRedId: string,
                playerGreenId: string) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.initBoard();

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

    public static getInstance(canvasId: string,
                exitBtnId: string = null,
                timerId: string = null,
                playerRedId: string = null,
                playerGreenId: string = null): Game {
        if (!Game.instance) {
            Game.instance = new Game(canvasId, exitBtnId, timerId, playerRedId, playerGreenId);
        }
        return Game.instance;
    }

    private initBoard() {
        for (let col = 0; col < Game.columns; col++) {
            this.board[col] = new Array(Game.rows);
            for (let row = 0; row < Game.rows; row++){
                this.board[col][row] = Dot.Empty;
            }
        }
    }

    public start() {
        this.defineSocket();
        this.checkGameData();
        this.resizeCanvas();
        this.setUpPlayerNames();
        this.setGameEvents();
        this.setTimer();
    }

    private checkGameData() {
        if (this.mode === GameMode.SamePC) {
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
        if (this.mode === GameMode.SamePC) {
            if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
                this.playerRed = prompt('Please enter name for Red Player!');
                this.playerGreen = prompt('Please enter name for Green Player!');
            }
        } else if (this.mode === GameMode.Network && this.playerColor) { // This client's color should be defined
            let playerName = prompt('You are ' + this.playerColor + '. Please enter your name.');
            if (this.playerColor === Dot.Red) {
                this.playerRed = playerName;
            } else if (this.playerColor === Dot.Green) {
                this.playerGreen = playerName;
            }
        }

        this.printPlayerNames();
    }

    private printPlayerNames() {
        const waiting = 'Waiting to connect...';
        if (this.playerGreenSpan) {
            if (this.mode === GameMode.Network && !this.playerGreen) {
                this.playerGreenSpan.innerText = waiting;
            } else {
                this.playerGreenSpan.innerText = this.playerGreen;
            }
        }
        if (this.playerRedSpan) {
            if (this.mode === GameMode.Network && !this.playerRed) {
                this.playerRedSpan.innerText = waiting;
            } else {
                this.playerRedSpan.innerText = this.playerRed;
            }
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
                this.context.fillStyle = this.board[col][row];

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
        this.canvas.addEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.addEventListener('click', this.canvasClick, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    }

    private canvasMousemove = (event) => {
        if (this.mode === GameMode.SamePC || (this.turn === this.playerColor && this.opponentConnected())) {
            let position: Position = this.getCursorPosition(event);
            let column = Math.round((position.x - 50) / this.colGap);
            this.moveDot(column);

            if (this.mode === GameMode.Network && this.socket) {
                let data = {
                    action: 'mousemove',
                    column: column
                };
                this.socket.send(JSON.stringify(data));
            }
        }
    };

    private canvasClick = (event) => {
        if (this.mode === GameMode.SamePC || (this.turn === this.playerColor && this.opponentConnected())) {
            let position = this.getCursorPosition(event);
            let column = Math.round((position.x - 50) / this.colGap);
            this.landDot(column);

            if (this.mode === GameMode.Network && this.socket) {
                let data = {
                    action: 'click',
                    column: column
                };
                this.socket.send(JSON.stringify(data));
            }
        }
    };

    private switchTurn() {
        if (this.turn === Dot.Red) {
            this.turn = Dot.Green;
        } else if (this.turn === Dot.Green) {
            this.turn = Dot.Red;
        }
    }

    private moveDot(column: number) {
        this.clearUpper();
        this.context.fillStyle = this.turn;
        this.paintDotToDrop(column);
    }

    private landDot(column: number) {
        let row: number;

        if (this.board[column][0] === Dot.Empty) {

            // Places the circle at the buttom of the column
            for (var r = Game.rows - 1; r > -1; r--) {
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
            
            let dotCount = this.checkDotCount(column, row);

            if (dotCount > 3) { // If a player completes 4 dots
                let winner: string = '';
                if (this.turn === Dot.Red) {
                    winner = this.playerRed + ' (Red)';
                } else if (this.turn === Dot.Green) {
                    winner = this.playerGreen + ' (Green)';
                }

                this.winDialog(winner);
                this.closeGameByWinning();
            } else if (this.isBoardFull()) {
                alert(this.playerRed + ' (Red) and ' + this.playerGreen + ' (Green) are tied!');
                this.closeGameByWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = this.turn;
                this.paintDotToDrop(column);
            }
        }
    }

    private winDialog(winner: string) {
        let winMsg: string = winner + ' wins!';
        if (this.timerSpan) {
            winMsg += '\nTime taken: ' + this.timerSpan.innerText;
        }
        if (this.mode === GameMode.Network) {
            winMsg += '\n';
            if (this.playerColor === this.turn) {
                winMsg += 'You win!';
            } else {
                winMsg += 'You lose!';
            }
        }
        alert(winMsg);
    }

    private closeGameByWinning() {
        // Clear game data
        localStorage.clear();

        this.cleanUpEvents();
        this.stopTimer();
        this.clearPlayerNames();

        if (this.exitBtn) {
            this.exitBtn.classList.add('hide');
        }

        this.resetValues();

        // Run delegate function to return to main menu, in case it is defined
        if (this.onGameEnd !== undefined && this.onGameEnd !== null) {
            setTimeout(this.onGameEnd, 3000);
        }
    }

    private paintDotToDrop(column: number) {
        this.context.beginPath();
        this.context.arc(50 + column * this.colGap, this.circleRadius, this.circleRadius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    private beforeUnload = (event) => {
        if (this.mode === GameMode.SamePC) {
            this.saveGame();
        } else if (this.mode === GameMode.Network) {
            // Display default dialog before closing
            event.preventDefault();
            event.returnValue = ''; // Required by Chrome
        }
    };

    private timerCallback = () => {
        if (this.mode !== GameMode.Network || this.opponentConnected()) {
            this.secondsRunning++;
            let minutes: number = Math.floor(this.secondsRunning / 60);
            let seconds: number = this.secondsRunning % 60;
            this.timerSpan.innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }
        
        if (!this.timerSpan.classList.contains('hide')) {
            let timeout = setTimeout(this.timerCallback, 1000);
            this.timeouts.push(timeout);console.log(timeout);
        } else {
            Utils.clearTimeouts(this.timeouts);
        }
    };

    private pageVisibilityChange = () => {
        if (this.mode !== GameMode.Network) {
            if (document.hidden) {
                Utils.clearTimeouts(this.timeouts);
            } else {
                let timeout = setTimeout(this.timerCallback, 1000);
                this.timeouts.push(timeout);
            }
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
        this.canvas.removeEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.removeEventListener('click', this.canvasClick, false);
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
        let nextTurn: string = localStorage.getItem('nextTurn');
        if (nextTurn === Dot.Red) {
            this.turn = Dot.Red;
        } else if (nextTurn === Dot.Green) {
            this.turn = Dot.Green;
        }
        
        this.playerRed = localStorage.getItem('playerRed');
        this.playerGreen = localStorage.getItem('playerGreen');
        this.board = JSON.parse(localStorage.getItem('board'));
        this.secondsRunning = parseInt(localStorage.getItem('secondsRunning'));
    }

    public exit() {
        let exitConfirmation: boolean = (this.mode === GameMode.Network ? confirm('Network game in progress. Are you sure you want to quit?') : true);

        if (exitConfirmation) {
            this.cleanUpEvents();
            if (this.mode === GameMode.SamePC) {
                this.saveGame();
            } else if (this.mode === GameMode.Network && this.socket) {
                this.socket.close();
                this.socket = null;
            }
            this.onGameEnd();
            this.stopTimer();
            this.clearPlayerNames();
            this.resetValues();
        }
    }

    private setTimer() {
        if (this.timerSpan) {
            this.timerSpan.classList.remove('hide');
            this.timerCallback();
        }
    }

    private stopTimer() {
        if (this.timeouts.length > 0) {
            Utils.clearTimeouts(this.timeouts);
            this.timerSpan.innerText = '';
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
        if (this.mode === GameMode.Network) {
            let url: string;
            if (Utils.isLocal()) {
                url = 'ws://localhost:443/';
            } else {
                //to set url to deployed location
            }

            this.socket = new WebSocket(url);

            this.socket.onmessage = this.socketMessage;
            this.socket.onerror = this.socketError;
        }
    }

    private socketMessage = (event) => {
        let messageData = JSON.parse(event.data);

        if (!this.playerColor && messageData.color) {
            this.playerColor = messageData.color;
            this.setUpPlayerNames();
            let data = { name: null };
            if (this.playerColor === Dot.Red) {
                data.name = this.playerRed;
            } else if (this.playerColor === Dot.Green) {
                data.name = this.playerGreen;
            }
            this.socket.send(JSON.stringify(data));
        }

        if (messageData.opponentName) {
            if (this.playerColor === Dot.Red) {
                this.playerGreen = messageData.opponentName;
                if (this.playerGreenSpan) {
                    this.playerGreenSpan.innerText = this.playerGreen;
                }
            } else if (this.playerColor === Dot.Green) {
                this.playerRed = messageData.opponentName;
                if (this.playerRedSpan) {
                    this.playerRedSpan.innerText = this.playerRed;
                }
            }
        }

        if (!this.gameId && messageData.gameId) {
            this.gameId = messageData.gameId;
        }

        if (messageData.message) {
            alert(messageData.message);
        }

        if (messageData.win) {
            this.closeGameByWinning();
        }

        if (messageData.column && messageData.action === 'mousemove') {
            this.moveDot(messageData.column);
        }

        if (messageData.column && messageData.action === 'click') {
            this.landDot(messageData.column);
        }
    };

    private socketError = (event) => {
        alert('Problem connecting to server!');
    };

    private opponentConnected(): boolean {
        // Return true for network play when both player names are defined (i.e. both connected)
        return this.mode === GameMode.Network && !!this.playerRed && !!this.playerGreen;
    }

    private isBoardFull(): boolean {
        let full: boolean = true;
        for (let col: number = 0; col < Game.columns; col++) {
            // Check upper row in every column
            if (this.board[col][0] === Dot.Empty) {
                full = false;
                break;
            }
        }
        return full;
    }

    private resetValues() {
        this.secondsRunning = 0;
        this.turn = Dot.Red;
        this.initBoard();
        this.playerRed = null;
        this.playerGreen = null;
    }

}