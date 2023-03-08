/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/enums/dot.ts":
/*!******************************!*\
  !*** ./src/lib/enums/dot.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dot = void 0;
var Dot;
(function (Dot) {
    Dot["Empty"] = "black";
    Dot["Red"] = "red";
    Dot["Green"] = "greenyellow";
})(Dot = exports.Dot || (exports.Dot = {}));


/***/ }),

/***/ "./src/lib/enums/game-mode.ts":
/*!************************************!*\
  !*** ./src/lib/enums/game-mode.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameMode = void 0;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["SamePC"] = 1] = "SamePC";
    GameMode[GameMode["Network"] = 2] = "Network";
})(GameMode = exports.GameMode || (exports.GameMode = {}));


/***/ }),

/***/ "./src/lib/enums/sound.ts":
/*!********************************!*\
  !*** ./src/lib/enums/sound.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sound = void 0;
var Sound;
(function (Sound) {
    Sound["LandDot"] = "./sounds/land-dot.m4a";
    Sound["Win"] = "./sounds/win.m4a";
    Sound["Lose"] = "./sounds/lose.m4a";
})(Sound = exports.Sound || (exports.Sound = {}));


/***/ }),

/***/ "./src/lib/game.ts":
/*!*************************!*\
  !*** ./src/lib/game.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
var game_mode_1 = __webpack_require__(/*! ./enums/game-mode */ "./src/lib/enums/game-mode.ts");
var dot_1 = __webpack_require__(/*! ./enums/dot */ "./src/lib/enums/dot.ts");
var position_1 = __webpack_require__(/*! ./position */ "./src/lib/position.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/lib/utils.ts");
var socket_1 = __webpack_require__(/*! ./socket */ "./src/lib/socket.ts");
var sound_1 = __webpack_require__(/*! ./enums/sound */ "./src/lib/enums/sound.ts");
var Game = /** @class */ (function () {
    function Game(canvasId, exitBtnId, timerId, playerRedId, playerGreenId) {
        var _this = this;
        this.board = new Array(Game.columns);
        this.turn = dot_1.Dot.Red;
        this.canvasMousemove = function (event) {
            if (_this.mode === game_mode_1.GameMode.SamePC || (_this.socket && _this.turn === _this.socket.getPlayerColor() && _this.opponentConnected())) {
                var position = position_1.Position.getCursorPosition(event, _this.canvas);
                var column = Math.round((position.x - 50) / _this.colGap);
                _this.moveDot(column);
                if (_this.mode === game_mode_1.GameMode.Network && _this.socket) {
                    var data = {
                        action: 'mousemove',
                        column: column
                    };
                    _this.socket.send(data);
                }
            }
        };
        this.canvasClick = function (event) {
            if (_this.mode === game_mode_1.GameMode.SamePC || (_this.socket && _this.turn === _this.socket.getPlayerColor() && _this.opponentConnected())) {
                var position = position_1.Position.getCursorPosition(event, _this.canvas);
                var column = Math.round((position.x - 50) / _this.colGap);
                _this.landDot(column);
                if (_this.mode === game_mode_1.GameMode.Network && _this.socket) {
                    var data = {
                        action: 'click',
                        column: column
                    };
                    _this.socket.send(data);
                }
            }
        };
        this.beforeUnload = function (event) {
            if (_this.mode === game_mode_1.GameMode.SamePC) {
                _this.saveGame();
            }
            else if (_this.mode === game_mode_1.GameMode.Network) {
                // Display default dialog before closing
                event.preventDefault();
                event.returnValue = ''; // Required by Chrome
            }
        };
        this.timerCallback = function () {
            if (_this.mode !== game_mode_1.GameMode.Network || _this.opponentConnected()) {
                _this.secondsRunning++;
                var minutes = Math.floor(_this.secondsRunning / 60);
                var seconds = _this.secondsRunning % 60;
                _this.timerSpan.innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            }
            if (!_this.timerSpan.classList.contains('hide')) {
                _this.timeout = setTimeout(_this.timerCallback, 1000);
            }
            else {
                clearTimeout(_this.timeout);
            }
        };
        this.pageVisibilityChange = function () {
            if (_this.mode !== game_mode_1.GameMode.Network) {
                if (document.hidden) {
                    clearTimeout(_this.timeout);
                }
                else {
                    _this.timeout = setTimeout(_this.timerCallback, 1000);
                }
            }
        };
        this.resizeCanvas = function () {
            _this.canvas.height = window.innerHeight - 100;
            _this.canvas.width = window.innerWidth;
            if (_this.canvas.width < 1000) {
                _this.circleRadius = 20; // Mobile/tablet
            }
            else {
                _this.circleRadius = 30; // Desktop
            }
            if (_this.canvas.height > _this.canvas.width) {
                _this.colGap = _this.canvas.width / Game.columns;
                _this.rowGap = _this.canvas.height / Game.rows;
            }
            else {
                _this.colGap = _this.canvas.width / Game.columns;
                _this.rowGap = 65;
            }
            _this.paintBoard();
        };
        this.socketMessage = function (messageData) {
            if (messageData.opponentName && _this.socket) {
                if (_this.socket.getPlayerColor() === dot_1.Dot.Red) {
                    _this.playerGreen = messageData.opponentName;
                    if (_this.playerGreenSpan) {
                        _this.playerGreenSpan.innerText = _this.playerGreen;
                    }
                }
                else if (_this.socket.getPlayerColor() === dot_1.Dot.Green) {
                    _this.playerRed = messageData.opponentName;
                    if (_this.playerRedSpan) {
                        _this.playerRedSpan.innerText = _this.playerRed;
                    }
                }
            }
            if (messageData.color && _this.socket) {
                if (messageData.color === dot_1.Dot.Red) {
                    _this.playerRed = _this.socket.getPlayerName();
                    if (_this.playerRedSpan) {
                        _this.playerRedSpan.innerText = _this.playerRed;
                    }
                }
                else if (messageData.color === dot_1.Dot.Green) {
                    _this.playerGreen = _this.socket.getPlayerName();
                    if (_this.playerGreenSpan) {
                        _this.playerGreenSpan.innerText = _this.playerGreen;
                    }
                }
            }
            if (messageData.win) {
                _this.closeGameByWinning();
            }
            if (!isNaN(messageData.column) && messageData.action === 'mousemove') {
                _this.moveDot(messageData.column);
            }
            if (!isNaN(messageData.column) && messageData.action === 'click') {
                _this.landDot(messageData.column);
            }
        };
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
    Game.getInstance = function (canvasId, exitBtnId, timerId, playerRedId, playerGreenId) {
        if (exitBtnId === void 0) { exitBtnId = null; }
        if (timerId === void 0) { timerId = null; }
        if (playerRedId === void 0) { playerRedId = null; }
        if (playerGreenId === void 0) { playerGreenId = null; }
        if (!Game.instance) {
            Game.instance = new Game(canvasId, exitBtnId, timerId, playerRedId, playerGreenId);
        }
        return Game.instance;
    };
    Game.prototype.initBoard = function () {
        for (var col = 0; col < Game.columns; col++) {
            this.board[col] = new Array(Game.rows);
            for (var row = 0; row < Game.rows; row++) {
                this.board[col][row] = dot_1.Dot.Empty;
            }
        }
    };
    Game.prototype.start = function () {
        if (this.mode === game_mode_1.GameMode.SamePC) {
            this.checkGameData();
            this.setUpPlayerNames();
        }
        else if (this.mode === game_mode_1.GameMode.Network) {
            this.defineSocket();
        }
        this.printPlayerNames();
        this.resizeCanvas();
        this.setGameEvents();
        this.setTimer();
    };
    Game.prototype.checkGameData = function () {
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
    };
    Game.prototype.setUpPlayerNames = function () {
        if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
            this.playerRed = prompt('Please enter name for Red Player!');
            this.playerGreen = prompt('Please enter name for Green Player!');
        }
    };
    Game.prototype.printPlayerNames = function () {
        var waiting = 'Waiting to connect...';
        if (this.playerGreenSpan) {
            if (this.mode === game_mode_1.GameMode.Network && !this.playerGreen) {
                this.playerGreenSpan.innerText = waiting;
            }
            else {
                this.playerGreenSpan.innerText = this.playerGreen;
            }
        }
        if (this.playerRedSpan) {
            if (this.mode === game_mode_1.GameMode.Network && !this.playerRed) {
                this.playerRedSpan.innerText = waiting;
            }
            else {
                this.playerRedSpan.innerText = this.playerRed;
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
                this.context.fillStyle = this.board[col][row];
                this.context.beginPath();
                this.context.arc(50 + col * this.colGap, 150 + row * this.rowGap, this.circleRadius, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
            }
        }
    };
    Game.prototype.setGameEvents = function () {
        this.canvas.addEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.addEventListener('click', this.canvasClick, false);
        window.addEventListener('beforeunload', this.beforeUnload);
        window.addEventListener('resize', this.resizeCanvas);
        document.addEventListener('visibilitychange', this.pageVisibilityChange);
    };
    Game.prototype.switchTurn = function () {
        if (this.turn === dot_1.Dot.Red) {
            this.turn = dot_1.Dot.Green;
        }
        else if (this.turn === dot_1.Dot.Green) {
            this.turn = dot_1.Dot.Red;
        }
    };
    Game.prototype.moveDot = function (column) {
        this.clearUpper();
        this.context.fillStyle = this.turn;
        this.paintDotToDrop(column);
    };
    Game.prototype.landDot = function (column) {
        var row;
        if (this.board[column][0] === dot_1.Dot.Empty) {
            // Places the circle at the buttom of the column
            for (var r = Game.rows - 1; r > -1; r--) {
                if (this.board[column][r] === dot_1.Dot.Empty) {
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
            var dotCount = this.checkDotCount(column, row);
            if (dotCount > 3) { // If a player completes 4 dots
                var winner = '';
                if (this.turn === dot_1.Dot.Red) {
                    winner = this.playerRed + ' (Red)';
                }
                else if (this.turn === dot_1.Dot.Green) {
                    winner = this.playerGreen + ' (Green)';
                }
                this.winDialog(winner);
                this.closeGameByWinning();
            }
            else if (this.isBoardFull()) {
                alert(this.playerRed + ' (Red) and ' + this.playerGreen + ' (Green) are tied!');
                this.closeGameByWinning();
            }
            else { // If game is still going on
                this.switchTurn();
                this.context.fillStyle = this.turn;
                this.paintDotToDrop(column);
                utils_1.Utils.playSound(sound_1.Sound.LandDot);
            }
        }
    };
    Game.prototype.winDialog = function (winner) {
        var winMsg = winner + ' wins!';
        if (this.timerSpan) {
            winMsg += '\nTime taken: ' + this.timerSpan.innerText;
        }
        if (this.mode === game_mode_1.GameMode.Network) {
            winMsg += '\n';
            if (this.socket.getPlayerColor() === this.turn) {
                winMsg += 'You win!';
                utils_1.Utils.playSound(sound_1.Sound.Win);
            }
            else {
                winMsg += 'You lose!';
                utils_1.Utils.playSound(sound_1.Sound.Lose);
            }
        }
        else {
            utils_1.Utils.playSound(sound_1.Sound.Win);
        }
        alert(winMsg);
    };
    Game.prototype.closeGameByWinning = function () {
        if (this.mode === game_mode_1.GameMode.SamePC) {
            // Clear game data
            localStorage.clear();
        }
        this.cleanUpEvents();
        this.stopTimer();
        this.clearPlayerNames();
        if (this.exitBtn) {
            this.exitBtn.classList.add('hide');
        }
        this.resetValues();
        // Run delegate function to return to main menu, in case it is defined
        if (this.onGameEnd) {
            setTimeout(this.onGameEnd, 3000);
        }
    };
    Game.prototype.paintDotToDrop = function (column) {
        this.context.beginPath();
        this.context.arc(50 + column * this.colGap, this.circleRadius, this.circleRadius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    };
    Game.prototype.clearUpper = function () {
        this.context.clearRect(0, 0, this.canvas.width, 70);
    };
    Game.prototype.checkDotCount = function (column, row) {
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
        this.canvas.removeEventListener('mousemove', this.canvasMousemove, false);
        this.canvas.removeEventListener('click', this.canvasClick, false);
        window.removeEventListener('beforeunload', this.beforeUnload);
        window.removeEventListener('resize', this.resizeCanvas);
        document.removeEventListener('changevisibility', this.pageVisibilityChange);
    };
    Game.prototype.saveGame = function () {
        localStorage.setItem('nextTurn', this.turn.toString());
        localStorage.setItem('board', JSON.stringify(this.board));
        localStorage.setItem('playerRed', this.playerRed);
        localStorage.setItem('playerGreen', this.playerGreen);
        localStorage.setItem('secondsRunning', this.secondsRunning.toString());
    };
    Game.prototype.restoreLastGame = function () {
        var nextTurn = localStorage.getItem('nextTurn');
        if (nextTurn === dot_1.Dot.Red) {
            this.turn = dot_1.Dot.Red;
        }
        else if (nextTurn === dot_1.Dot.Green) {
            this.turn = dot_1.Dot.Green;
        }
        this.playerRed = localStorage.getItem('playerRed');
        this.playerGreen = localStorage.getItem('playerGreen');
        this.board = JSON.parse(localStorage.getItem('board'));
        this.secondsRunning = parseInt(localStorage.getItem('secondsRunning'));
    };
    Game.prototype.exit = function () {
        var exitConfirmation = (this.mode === game_mode_1.GameMode.Network ? confirm('Network game in progress. Are you sure you want to quit?') : true);
        if (exitConfirmation) {
            this.cleanUpEvents();
            if (this.mode === game_mode_1.GameMode.SamePC) {
                this.saveGame();
            }
            else if (this.mode === game_mode_1.GameMode.Network) {
                this.socket.close();
            }
            this.onGameEnd();
            this.stopTimer();
            this.clearPlayerNames();
            this.resetValues();
        }
    };
    Game.prototype.setTimer = function () {
        if (this.timerSpan) {
            this.timerSpan.classList.remove('hide');
            this.timerCallback();
        }
    };
    Game.prototype.stopTimer = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timerSpan.innerText = '';
            this.timerSpan.classList.add('hide');
        }
    };
    Game.prototype.clearPlayerNames = function () {
        if (this.playerGreenSpan) {
            this.playerGreenSpan.innerText = '';
        }
        if (this.playerRedSpan) {
            this.playerRedSpan.innerText = '';
        }
    };
    Game.prototype.defineSocket = function () {
        this.socket = new socket_1.Socket();
        this.socket.onMessageCallback = this.socketMessage;
    };
    Game.prototype.opponentConnected = function () {
        // Return true for network play when both player names are defined (i.e. both connected)
        return this.mode === game_mode_1.GameMode.Network && !!this.playerRed && !!this.playerGreen;
    };
    Game.prototype.isBoardFull = function () {
        var full = true;
        for (var col = 0; col < Game.columns; col++) {
            // Check upper row in every column
            if (this.board[col][0] === dot_1.Dot.Empty) {
                full = false;
                break;
            }
        }
        return full;
    };
    Game.prototype.resetValues = function () {
        this.secondsRunning = 0;
        this.turn = dot_1.Dot.Red;
        this.initBoard();
        this.playerRed = null;
        this.playerGreen = null;
    };
    Game.columns = 9;
    Game.rows = 8;
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/lib/position.ts":
/*!*****************************!*\
  !*** ./src/lib/position.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Position = void 0;
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.getCursorPosition = function (event, canvas) {
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
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        return new Position(x, y);
    };
    return Position;
}());
exports.Position = Position;


/***/ }),

/***/ "./src/lib/socket.ts":
/*!***************************!*\
  !*** ./src/lib/socket.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Socket = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/lib/utils.ts");
var Socket = /** @class */ (function () {
    function Socket() {
        var _this = this;
        this.onMessage = function (event) {
            var messageData = JSON.parse(event.data);
            if (!_this.gameId && messageData.gameId) {
                _this.gameId = messageData.gameId;
            }
            if (messageData.message) {
                alert(messageData.message);
            }
            if (!_this.playerColor && messageData.color) {
                _this.playerColor = messageData.color;
                _this.playerName = prompt('You are ' + _this.playerColor + '. Please enter your name.');
                var data = {
                    name: _this.playerName
                };
                _this.send(data);
            }
            if (_this.onMessageCallback) {
                _this.onMessageCallback(messageData);
            }
        };
        this.onError = function () {
            alert('Problem connecting to server!');
        };
        this.onClose = function () {
            _this.connect();
        };
        this.connect();
    }
    Socket.prototype.connect = function () {
        var url;
        if (utils_1.Utils.isLocal()) {
            url = 'ws://localhost:3000/';
        }
        else {
            url = 'wss://daniels-connect4-server.adaptable.app/';
        }
        if (this.playerColor && this.gameId) {
            url += '?playerColor=' + this.playerColor + '&gameId=' + this.gameId;
        }
        this.webSocket = new WebSocket(url);
        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onerror = this.onError;
        this.webSocket.onclose = this.onClose;
    };
    Socket.prototype.send = function (data) {
        this.webSocket.send(JSON.stringify(data));
    };
    Socket.prototype.close = function () {
        this.webSocket.close();
        this.webSocket = null;
    };
    Socket.prototype.getPlayerColor = function () {
        return this.playerColor;
    };
    Socket.prototype.getPlayerName = function () {
        return this.playerName;
    };
    return Socket;
}());
exports.Socket = Socket;


/***/ }),

/***/ "./src/lib/utils.ts":
/*!**************************!*\
  !*** ./src/lib/utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.isLocal = function () {
        return location.protocol === 'file:'
            || location.hostname === 'localhost';
    };
    Utils.playSound = function (path) {
        var audio = new Audio(path);
        audio.play();
    };
    return Utils;
}());
exports.Utils = Utils;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var game_1 = __webpack_require__(/*! ./lib/game */ "./src/lib/game.ts");
var game_mode_1 = __webpack_require__(/*! ./lib/enums/game-mode */ "./src/lib/enums/game-mode.ts");
var connect4;
var menu = document.getElementById('menu');
var samePCBtn = document.getElementById('samePC');
var socketsBtn = document.getElementById('sockets');
var creditsBtn = document.getElementById('credits');
var exitBtn = document.getElementById('exitBtn');
var canvas = document.getElementById('board');
samePCBtn.addEventListener('click', function () {
    initGame(game_mode_1.GameMode.SamePC);
}, false);
socketsBtn.addEventListener('click', function () {
    initGame(game_mode_1.GameMode.Network);
}, false);
creditsBtn.addEventListener('click', function () {
    open('contributors.html');
}, false);
exitBtn.addEventListener('click', function () {
    connect4.exit();
}, false);
function initGame(mode) {
    connect4 = game_1.Game.getInstance('board', 'exitBtn', 'timer', 'playerRed', 'playerGreen');
    connect4.mode = mode;
    connect4.onGameEnd = function () {
        menu.classList.remove('hide');
        canvas.classList.add('hide');
        exitBtn.classList.add('hide');
    };
    connect4.start();
    menu.classList.add('hide');
    canvas.classList.remove('hide');
    exitBtn.classList.remove('hide');
}

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map