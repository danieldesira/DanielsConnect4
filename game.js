"use strict";
exports.__esModule = true;
exports.Game = exports.GameMode = void 0;
var Tile;
(function (Tile) {
    Tile[Tile["EMPTY"] = 0] = "EMPTY";
    Tile[Tile["RED"] = 1] = "RED";
    Tile[Tile["GREEN"] = 2] = "GREEN";
})(Tile || (Tile = {}));
var GameMode;
(function (GameMode) {
    GameMode[GameMode["SAME_PC"] = 1] = "SAME_PC";
})(GameMode = exports.GameMode || (exports.GameMode = {}));
var Game = /** @class */ (function () {
    function Game(canvasId) {
        var _this = this;
        this.board = new Array(Game.columns);
        this.turn = Tile.RED;
        this.moveDot = function (event) {
            _this.clearUpper();
            var position = _this.getCursorPosition(event);
            var column = Math.round(position.x - 50) / 110;
            if (_this.turn == Tile.RED) {
                _this.context.fillStyle = 'red';
            }
            else if (_this.turn == Tile.GREEN) {
                _this.context.fillStyle = 'greenyellow';
            }
            _this.context.beginPath();
            _this.context.arc(50 + column * 120, 35, 35, 0, 2 * Math.PI);
            _this.context.closePath();
            _this.context.fill();
        };
        this.landDot = function (event) {
            var position = _this.getCursorPosition(event);
            var column = Math.round((position.x - 50) / 110);
            var row;
            if (_this.board[column][0] === 0) {
                // Places the circle at the buttom of the column
                for (var r = Game.rows - 1; r > -1; r--) {
                    if (_this.board[column][r] === 0) {
                        _this.board[column][r] = _this.turn;
                        row = r;
                        break;
                    }
                }
                if (_this.turn === Tile.RED) {
                    _this.context.fillStyle = 'red';
                }
                else if (_this.turn === Tile.GREEN) {
                    _this.context.fillStyle = 'greenyellow';
                }
                // Draws the circle at the appropriate position
                _this.context.beginPath();
                _this.context.arc(50 + column * 110, 150 + r * 110, 30, 0, Math.PI * 2);
                _this.context.closePath();
                _this.context.fill();
                var dotCount = _this.checkTileCount(column, row);
                // Announce winner in case any player completes 4 tiles
                if (dotCount > 3) {
                    var winner = '';
                    if (_this.turn === Tile.RED) {
                        winner = _this.playerRed + ' (Red)';
                    }
                    else if (_this.turn === Tile.GREEN) {
                        winner = _this.playerGreen + ' (Green)';
                    }
                    alert(winner + ' wins!');
                    // Clear game data
                    localStorage.clear();
                    _this.cleanUpEvents();
                    // Run delegate function to return to main menu, in case it is defined
                    if (_this.onGameEnd !== undefined && _this.onGameEnd !== null) {
                        setTimeout(_this.onGameEnd, 3000);
                    }
                }
                // Switches turn
                if (_this.turn === Tile.RED) {
                    _this.turn = Tile.GREEN;
                }
                else if (_this.turn === Tile.GREEN) {
                    _this.turn = Tile.RED;
                }
            }
        };
        this.beforeUnload = function () {
            _this.saveGame();
        };
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        // Initialise board with empty tiles
        for (var col = 0; col < Game.columns; col++) {
            this.board[col] = new Array(Game.rows);
            for (var row = 0; row < Game.rows; row++) {
                this.board[col][row] = Tile.EMPTY;
            }
        }
    }
    Game.prototype.start = function () {
        this.checkGameData();
        this.setUpPlayerNames();
        this.paintBoard();
        this.setGameEvents();
    };
    Game.prototype.checkGameData = function () {
        if (this.mode === GameMode.SAME_PC) {
            var board = localStorage.getItem('board');
            var nextTurn = localStorage.getItem('nextTurn');
            if (board && nextTurn) {
                var restore = confirm('Do you want to continue playing the previous game? OK/Cancel');
                if (restore) {
                    this.restoreLastGame();
                }
                else {
                    localStorage.clear();
                }
            }
        }
    };
    Game.prototype.setUpPlayerNames = function () {
        if (this.mode === GameMode.SAME_PC) {
            if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
                this.playerRed = prompt('Please enter name for Red Player!');
                this.playerGreen = prompt('Please enter name for Green Player!');
            }
        }
    };
    Game.prototype.paintBoard = function () {
        var boardGradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        boardGradient.addColorStop(0, 'blue');
        boardGradient.addColorStop(1, 'aqua');
        this.context.fillStyle = boardGradient;
        this.context.fillRect(0, 70, this.canvas.width, this.canvas.height);
        for (var col = Game.columns - 1; col >= 0; col--) {
            for (var row = Game.rows - 1; row >= 0; row--) {
                if (this.board[col][row] === Tile.RED) {
                    this.context.fillStyle = 'red';
                }
                else if (this.board[col][row] === Tile.GREEN) {
                    this.context.fillStyle = 'greenyellow';
                }
                else {
                    this.context.fillStyle = 'black';
                }
                this.context.beginPath();
                this.context.arc(50 + col * 110, 150 + row * 110, 30, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
            }
        }
    };
    Game.prototype.getCursorPosition = function (event) {
        var x;
        var y;
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
    };
    Game.prototype.setGameEvents = function () {
        this.canvas.addEventListener('mousemove', this.moveDot, false);
        this.canvas.addEventListener('click', this.landDot, false);
        window.addEventListener('beforeunload', this.beforeUnload);
    };
    Game.prototype.clearUpper = function () {
        this.context.clearRect(0, 0, this.canvas.width, 70);
    };
    Game.prototype.checkTileCount = function (column, row) {
        var count = row;
        var dotCount = 0;
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
                var rowCount = row - 1;
                var colCount = column + 1;
                while (dotCount < 4 && rowCount > -1 && colCount < Game.columns && this.board[colCount][rowCount] === this.turn) {
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
    };
    Game.prototype.cleanUpEvents = function () {
        this.canvas.removeEventListener('mousemove', this.moveDot, false);
        this.canvas.removeEventListener('click', this.landDot, false);
        window.removeEventListener('beforeunload', this.beforeUnload);
    };
    Game.prototype.saveGame = function () {
        localStorage.setItem('nextTurn', this.turn.toString());
        localStorage.setItem('board', JSON.stringify(this.board));
        localStorage.setItem('playerRed', this.playerRed);
        localStorage.setItem('playerGreen', this.playerGreen);
    };
    Game.prototype.restoreLastGame = function () {
        this.turn = parseInt(localStorage.getItem('nextTurn'));
        this.playerRed = localStorage.getItem('playerRed');
        this.playerGreen = localStorage.getItem('playerGreen');
        this.board = JSON.parse(localStorage.getItem('board'));
    };
    Game.prototype.exit = function () {
        this.cleanUpEvents();
        this.saveGame();
        this.onGameEnd();
    };
    Game.columns = 9;
    Game.rows = 8;
    return Game;
}());
exports.Game = Game;
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    return Position;
}());
