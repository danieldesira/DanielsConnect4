import { GameMode } from './enums/game-mode';
import { Dot } from './enums/dot';
import { Position } from './position';
import { Utils } from './utils';
import { Socket } from './socket';
import { Sound } from './enums/sound';
import { BoardLogic } from './board-logic';
import { Timer } from './timer';
import { PlayerNameArea } from './player-name-area';

export class Game {

    private static instance: Game;

    private canvas: any;
    private context: any;
    private board: Array<Array<Dot>> = new Array(BoardLogic.columns);

    private exitBtn: any;
    private playerNames: PlayerNameArea;

    private turn: Dot = Dot.Red;

    public mode: GameMode;
    public onGameEnd: Function;

    private circleRadius: number;
    private rowGap: number;
    private colGap: number;

    private socket: Socket;

    private timer: Timer;

    private constructor(canvasId: string,
                exitBtnId: string,
                timerId: string,
                playerRedId: string,
                playerGreenId: string) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        BoardLogic.initBoard(this.board);

        if (exitBtnId) {
            this.exitBtn = document.getElementById(exitBtnId);
        }

        if (timerId) {
            this.timer = new Timer(timerId);
        }

        if (playerRedId && playerGreenId) {
            this.playerNames = new PlayerNameArea(playerRedId, playerGreenId);
        }
    }

    public static getInstance(options: any): Game {
        if (!Game.instance) {
            Game.instance = new Game(options.canvasId, options.exitBtnId, options.timerId, options.playerRedId, options.playerGreenId);
        }
        return Game.instance;
    }

    public start() {
        if (this.mode === GameMode.SamePC) {
            this.checkGameData();

            if (this.playerNames) {
                this.playerNames.setUpPlayerNames();
            }

            if (this.timer) {
                this.timer.setRunnable(true);
            }
        } else if (this.mode === GameMode.Network) {
            this.defineSocket();
        }
        
        if (this.playerNames) {
            this.playerNames.printPlayerNames(this.mode);
        }

        this.resizeCanvas();
        this.setGameEvents();

        if (this.timer) {
            this.timer.set();
        }
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

    private setGameEvents() {
        this.canvas.addEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.addEventListener('click', this.canvasClick, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    }

    private canvasMousemove = (event) => {
        if (this.mode === GameMode.SamePC || (this.socket && this.turn === this.socket.getPlayerColor() && (!this.playerNames || this.playerNames.bothPlayersConnected()))) {
            let position: Position = Position.getCursorPosition(event, this.canvas);
            let column = Math.round((position.x - 50) / this.colGap);
            this.moveDot(column);

            if (this.mode === GameMode.Network && this.socket) {
                let data = {
                    action: 'mousemove',
                    column: column
                };
                this.socket.send(data);
            }
        }
    };

    private canvasClick = (event) => {
        if (this.mode === GameMode.SamePC || (this.socket && this.turn === this.socket.getPlayerColor() && (!this.playerNames || this.playerNames.bothPlayersConnected()))) {
            let position = Position.getCursorPosition(event, this.canvas);
            let column = Math.round((position.x - 50) / this.colGap);

            if (this.mode === GameMode.Network && this.socket) {
                let data = {
                    action: 'click',
                    column: column
                };
                this.socket.send(data);
            }

            this.landDot(column);
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
            
            let dotCount = BoardLogic.checkDotCount(this.board, column, row, this.turn);

            if (dotCount > 3) { // If a player completes 4 dots
                let winner: string = '';

                if (this.playerNames) {
                    if (this.turn === Dot.Red) {
                        winner = this.playerNames.getPlayerRed() + ' (Red)';
                    } else if (this.turn === Dot.Green) {
                        winner = this.playerNames.getPlayerGreen() + ' (Green)';
                    }
                }

                this.winDialog(winner);
                this.closeGameByWinning();
            } else if (BoardLogic.isBoardFull(this.board)) {
                let message: string = '';
                if (this.playerNames) {
                    message += this.playerNames.getPlayerRed() + ' (Red) and ' + this.playerNames.getPlayerGreen() + ' (Green)';
                }
                message += ' are tied!';
                alert(message);
                this.closeGameByWinning();
            } else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = this.turn;
                this.paintDotToDrop(column);
                Utils.playSound(Sound.LandDot);
            }
        }
    }

    private winDialog(winner: string) {
        let winMsg: string = winner + ' wins!';
        if (this.timer) {
            winMsg += '\nTime taken: ' + this.timer.getTimeInStringFormat();
        }
        if (this.mode === GameMode.Network) {
            winMsg += '\n';
            if (this.socket.getPlayerColor() === this.turn) {
                winMsg += 'You win!';
                Utils.playSound(Sound.Win);
            } else {
                winMsg += 'You lose!';
                Utils.playSound(Sound.Lose);
            }
        } else {
            Utils.playSound(Sound.Win);
        }
        alert(winMsg);
    }

    private closeGameByWinning() {
        if (this.mode === GameMode.SamePC) {
            // Clear game data
            localStorage.clear();
        }

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

    private beforeUnload = (event) => {
        if (this.mode === GameMode.SamePC) {
            this.saveGame();
        } else if (this.mode === GameMode.Network) {
            // Display default dialog before closing
            event.preventDefault();
            event.returnValue = ''; // Required by Chrome
        }
    };

    private pageVisibilityChange = () => {
        if (this.mode !== GameMode.Network && this.timer) {
            this.timer.pauseWhenDocumentHidden();
        }
    };

    private clearUpper() {
        this.context.clearRect(0, 0, this.canvas.width, 70);
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

        if (this.playerNames) {
            this.playerNames.saveIntoLocalStorage();
        }

        if (this.timer) {
            this.timer.saveSecondsRunningToLocalStorage();
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

    public exit() {
        let exitConfirmation: boolean = (this.mode === GameMode.Network ? confirm('Network game in progress. Are you sure you want to quit?') : true);

        if (exitConfirmation) {
            this.cleanUpEvents();
            if (this.mode === GameMode.SamePC) {
                this.saveGame();
            } else if (this.mode === GameMode.Network) {
                this.socket.close();
            }
            this.onGameEnd();
            this.resetValues();

            if (this.playerNames) {
                this.playerNames.clear();
            }

            if (this.timer) {
                this.timer.stop();
            }
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
            this.closeGameByWinning();
        }

        if (!isNaN(messageData.column) && messageData.action === 'mousemove') {
            this.moveDot(messageData.column);
        }

        if (!isNaN(messageData.column) && messageData.action === 'click') {
            this.landDot(messageData.column);
        }
    };

    private resetValues() {
        this.turn = Dot.Red;
        BoardLogic.initBoard(this.board);
        
        if (this.playerNames) {
            this.playerNames.reset();
        }

        if (this.socket) {
            this.socket.close();
        }

        if (this.timer) {
            this.timer.reset();
        }
    }

}