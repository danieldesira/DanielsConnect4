(()=>{"use strict";var e={583:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BoardLogic=void 0;var o=n(39);t.BoardLogic=function(){function e(){}return e.initBoard=function(t){for(var n=0;n<e.columns;n++){t[n]=new Array(e.rows);for(var r=0;r<e.rows;r++)t[n][r]=o.Coin.Empty}},e.countConsecutiveCoins=function(t,n,o,r){for(var i=o,a=0;a<4&&i<e.rows&&t[n][i]===r;)a++,i++;if(a<4){for(a=0,i=n;i<e.columns&&t[i][o]===r;)a++,i++;for(i=n-1;i>-1&&t[i][o]===r;)a++,i--;if(a<4){a=0;for(var s=o-1,c=n+1;a<4&&s>-1&&c<e.columns&&t[c][s]===r;)a++,c++,s--;for(c=n,s=o;a<4&&s<e.rows&&c>-1&&t[c][s]===r;)a++,c--,s++;if(a<4){for(a=0,s=o-1,c=n-1;a<4&&s>-1&&c>-1&&t[c][s]===r;)a++,c--,s--;for(c=n,s=o;a<4&&s<e.rows&&c<e.columns&&t[c][s]===r;)a++,c++,s++}}}return a},e.isBoardFull=function(t){for(var n=!0,r=0;r<e.columns;r++)if(t[r][0]===o.Coin.Empty){n=!1;break}return n},e.putCoin=function(t,n,r){for(var i=e.rows-1;i>=0;i--)if(t[r][i]===o.Coin.Empty)return t[r][i]=n,i;return-1},e.columns=9,e.rows=8,e}()},304:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.skipTurnMaxWait=void 0,t.skipTurnMaxWait=60},39:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Coin=void 0,function(e){e[e.Empty=0]="Empty",e[e.Red=1]="Red",e[e.Green=2]="Green"}(n||(t.Coin=n={}))},118:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.skipTurnMaxWait=t.switchTurn=t.randomiseColor=t.WinnerMessage=t.TieMessage=t.SkipTurnMessage=t.PlayerNameMessage=t.InitialMessage=t.GameMessage=t.ErrorMessage=t.DisconnectMessage=t.CurrentTurnMessage=t.ActionMessage=t.Coin=t.default=void 0;var o=n(583);Object.defineProperty(t,"default",{enumerable:!0,get:function(){return o.BoardLogic}});var r=n(39);Object.defineProperty(t,"Coin",{enumerable:!0,get:function(){return r.Coin}});var i=n(237);Object.defineProperty(t,"ActionMessage",{enumerable:!0,get:function(){return i.ActionMessage}});var a=n(671);Object.defineProperty(t,"CurrentTurnMessage",{enumerable:!0,get:function(){return a.CurrentTurnMessage}});var s=n(602);Object.defineProperty(t,"DisconnectMessage",{enumerable:!0,get:function(){return s.DisconnectMessage}});var c=n(297);Object.defineProperty(t,"ErrorMessage",{enumerable:!0,get:function(){return c.ErrorMessage}});var l=n(905);Object.defineProperty(t,"GameMessage",{enumerable:!0,get:function(){return l.GameMessage}});var u=n(164);Object.defineProperty(t,"InitialMessage",{enumerable:!0,get:function(){return u.InitialMessage}});var d=n(344);Object.defineProperty(t,"PlayerNameMessage",{enumerable:!0,get:function(){return d.PlayerNameMessage}});var p=n(462);Object.defineProperty(t,"SkipTurnMessage",{enumerable:!0,get:function(){return p.SkipTurnMessage}});var f=n(684);Object.defineProperty(t,"TieMessage",{enumerable:!0,get:function(){return f.TieMessage}});var h=n(651);Object.defineProperty(t,"WinnerMessage",{enumerable:!0,get:function(){return h.WinnerMessage}});var m=n(635);Object.defineProperty(t,"randomiseColor",{enumerable:!0,get:function(){return m.randomiseColor}}),Object.defineProperty(t,"switchTurn",{enumerable:!0,get:function(){return m.switchTurn}});var y=n(304);Object.defineProperty(t,"skipTurnMaxWait",{enumerable:!0,get:function(){return y.skipTurnMaxWait}})},237:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.ActionMessage=void 0;var i=function(e){function t(t,n,o){var r=e.call(this)||this;return r.column=t,r.action=n,r.color=o,r}return r(t,e),t}(n(905).GameMessage);t.ActionMessage=i},671:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.CurrentTurnMessage=void 0;var i=n(39),a=function(e){function t(){var t=e.call(this)||this;return t.currentTurn=i.Coin.Empty,t}return r(t,e),t}(n(905).GameMessage);t.CurrentTurnMessage=a},602:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.DisconnectMessage=void 0;var i=function(e){function t(){var t=e.call(this)||this;return t.hardDisconnect=!0,t}return r(t,e),t}(n(905).GameMessage);t.DisconnectMessage=i},297:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.ErrorMessage=void 0;var i=function(e){function t(t){var n=e.call(this)||this;return n.error=t,n}return r(t,e),t}(n(905).GameMessage);t.ErrorMessage=i},905:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GameMessage=void 0;var n=function(){function e(){}return e.isInitialMessage=function(e){return!isNaN(e.gameId)&&e.color||e.opponentName},e.isInactivityMessage=function(e){return e.endGameDueToInactivity&&e.currentTurn},e.isActionMessage=function(e){return e.action&&!isNaN(e.column)&&e.color},e.isSkipTurnMessage=function(e){return e.skipTurn&&e.currentTurn},e.isWinnerMessage=function(e){return e.winner},e.isTieMessage=function(e){return e.tie},e.isCurrentTurnMessage=function(e){return e.currentTurn},e.isDisconnectMessage=function(e){return e.hardDisconnect},e.isErrorMessage=function(e){return e.error},e}();t.GameMessage=n},164:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.InitialMessage=void 0;var i=function(e){function t(t,n,o){var r=e.call(this)||this;return r.gameId=t,r.opponentName=n,r.color=o,r}return r(t,e),t}(n(905).GameMessage);t.InitialMessage=i},344:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.PlayerNameMessage=void 0;var i=function(e){function t(t){var n=e.call(this)||this;return n.name=t,n}return r(t,e),t}(n(905).GameMessage);t.PlayerNameMessage=i},462:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.SkipTurnMessage=void 0;var i=function(e){function t(t,n){var o=e.call(this)||this;return o.skipTurn=t,o.currentTurn=n,o}return r(t,e),t}(n(905).GameMessage);t.SkipTurnMessage=i},684:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.TieMessage=void 0;var i=function(e){function t(t){void 0===t&&(t=!0);var n=e.call(this)||this;return n.tie=t,n}return r(t,e),t}(n(905).GameMessage);t.TieMessage=i},651:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.WinnerMessage=void 0;var i=function(e){function t(t){var n=e.call(this)||this;return n.winner=t,n}return r(t,e),t}(n(905).GameMessage);t.WinnerMessage=i},635:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.switchTurn=t.randomiseColor=void 0;var o=n(39);t.randomiseColor=function(){return Math.floor(2*Math.random())+1},t.switchTurn=function(e){return e===o.Coin.Red?o.Coin.Green:o.Coin.Red}},833:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});var o=n(305),r=function(){function e(){}return e.modal=function(e,t){var n=this;if(!document.getElementById(t.id)){var r=document.createElement("div");r.id=t.id,r.classList.add("dialog");var i=document.createElement("div");switch(this.appendText(t.text,i),r.appendChild(i),e){case o.DialogType.Confirmation:var a=t;(s=document.createElement("div")).classList.add("dialog-btn-container"),r.appendChild(s),this.appendBtn(s,"Yes",(function(){a.yesCallback(),n.closeModal(r)}),a.yesColor,"button"),this.appendBtn(s,"No",(function(){a.noCallback(),n.closeModal(r)}),a.noColor,"button");break;case o.DialogType.Notification:var s;(s=document.createElement("div")).classList.add("dialog-btn-container"),r.appendChild(s),this.appendBtn(s,"OK",(function(){n.closeModal(r)}),"green","button");break;case o.DialogType.Prompt:var c=t;this.appendForm(r,c)}document.body.appendChild(r)}},e.appendBtn=function(e,t,n,o,r){var i=document.createElement("button");i.type=r,i.innerText=t,i.classList.add("text"),i.classList.add("dialog-btn"),i.classList.add("dialog-btn-".concat(o)),"button"===r&&i.addEventListener("click",n),e.appendChild(i)},e.appendForm=function(e,t){var n=this,o=document.createElement("div");o.classList.add("dialog-input-container"),e.appendChild(o);var r=document.createElement("form");o.appendChild(r),r.addEventListener("submit",(function(o){o.preventDefault();var r=t.onOK();r?n.appendError(e,r):n.closeModal(e)})),this.appendInputs(r,t.inputs);var i=document.createElement("div");i.classList.add("dialog-btn-container"),r.appendChild(i),this.appendBtn(i,"OK",null,"green","submit"),this.appendBtn(i,"Cancel",(function(){t.onCancel(),n.closeModal(e)}),"red","button")},e.appendInputs=function(e,t){for(var n=0;n<t.length;n++){var o=document.createElement("input");o.type=t[n].type,o.id="dialog-input-".concat(t[n].name),o.name="dialog-input-".concat(t[n].name),o.placeholder="Enter ".concat(t[n].label),o.maxLength=t[n].limit,o.classList.add("dialog-input"),o.classList.add("text"),o.required=t[n].required,o.ariaRequired=t[n].required.toString(),e.appendChild(o),this.appendBrElement(e),this.appendBrElement(e)}},e.appendBrElement=function(e){var t=document.createElement("br");e.appendChild(t)},e.appendError=function(e,t){var n=document.getElementById("dialogError");n||((n=document.createElement("div")).id="dialogError",n.classList.add("red-text"),n.classList.add("text"),n.classList.add("dialog-error"),e.appendChild(n)),n.innerText=t},e.appendText=function(e,t){t.classList.add("text"),t.classList.add("dialog-text");for(var n=0;n<e.length;n++){var o=document.createElement("p");o.innerText=e[n],t.appendChild(o)}},e.closeModal=function(e){document.body.contains(e)&&document.body.removeChild(e)},e.confirm=function(t){e.modal(o.DialogType.Confirmation,t)},e.notify=function(t){e.modal(o.DialogType.Notification,t)},e.prompt=function(t){e.modal(o.DialogType.Prompt,t)},e.closeAllOpenDialogs=function(){for(var e=document.getElementsByClassName("dialog"),t=0;t<e.length;t++)this.closeModal(e[t])},e}();t.default=r},305:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.DialogType=void 0,function(e){e[e.Confirmation=0]="Confirmation",e[e.Notification=1]="Notification",e[e.Prompt=2]="Prompt"}(n||(t.DialogType=n={}))},365:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.DialogIds=void 0,function(e){e.PlayerNames="player-input-dialog",e.ServerError="server-error-dialog",e.Instructions="instructions-dialog",e.GameEnd="game-end-dialog",e.ExitGame="exit-game-dialog",e.ContinueGame="continue-game-dialog"}(n||(t.DialogIds=n={}))},607:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.GameMode=void 0,function(e){e[e.SamePC=1]="SamePC",e[e.Network=2]="Network"}(n||(t.GameMode=n={}))},998:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Sound=void 0,function(e){e.LandCoin="./sounds/land-coin.m4a",e.Win="./sounds/win.m4a",e.Lose="./sounds/lose.m4a"}(n||(t.Sound=n={}))},664:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});var o=n(42),r=n(698),i=n(118),a=function(){function e(e){var t=this;this.board=new Array(i.default.columns),this.turn=i.Coin.Red,this.currentCoinColumn=4,this.resizeCanvas=function(){t.canvas.height=window.innerHeight-100,t.canvas.width=window.innerWidth,t.canvas.width<1e3?t.circleRadius=20:t.circleRadius=30,t.canvas.height>t.canvas.width?(t.colGap=t.canvas.width/i.default.columns,t.rowGap=t.canvas.height/i.default.rows-t.circleRadius):(t.colGap=t.canvas.width/i.default.columns,t.rowGap=65),t.colOffset=t.colGap/2,t.paintBoard()},this.canvas=document.getElementById(e.canvasId),this.context=this.canvas.getContext("2d"),i.default.initBoard(this.board),e.exitBtnId&&(this.exitBtn=document.getElementById(e.exitBtnId)),e.playerRedId&&e.playerGreenId&&(this.playerNameSection=new r.default(e.playerRedId,e.playerGreenId)),e.gameIndicatorsId&&(this.gameIndicatorsContainer=document.getElementById(e.gameIndicatorsId)),e.menuId&&(this.gameMenu=document.getElementById(e.menuId))}return e.prototype.start=function(){this.showGame(),this.playerNameSection&&(this.playerNameSection.printPlayerNames(),this.playerNameSection.indicateTurn(this.turn)),this.resizeCanvas(),this.setGameEvents()},e.prototype.paintBoard=function(){var t=this.context.createLinearGradient(0,0,this.canvas.width,0);t.addColorStop(0,"blue"),t.addColorStop(1,"aqua"),this.context.fillStyle=t,this.context.fillRect(0,e.verticalOffset,this.canvas.width,this.canvas.height);for(var n=i.default.columns-1;n>=0;n--)for(var o=i.default.rows-1;o>=0;o--)this.context.fillStyle=e.getColor(this.board[n][o]),this.drawCircle(n,o)},e.prototype.setGameEvents=function(){this.canvas.addEventListener("mousemove",this.canvasMousemove,!1),this.canvas.addEventListener("click",this.canvasClick,!1),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("resize",this.resizeCanvas),this.exitBtn.addEventListener("click",this.exit),document.body.addEventListener("keydown",this.handleKeyDown)},e.prototype.getColumnFromCursorPosition=function(e){var t=o.default.getCursorPosition(e,this.canvas);return Math.round((t.x-this.colOffset)/this.colGap)},e.prototype.switchTurn=function(){this.turn=(0,i.switchTurn)(this.turn),this.playerNameSection&&this.playerNameSection.indicateTurn(this.turn)},e.prototype.moveCoin=function(){this.clearUpper(),this.context.fillStyle=e.getColor(this.turn),this.paintCoinToDrop(this.currentCoinColumn)},e.prototype.landCoin=function(){if(this.board[this.currentCoinColumn][0]===i.Coin.Empty){var t=i.default.putCoin(this.board,this.turn,this.currentCoinColumn);return this.context.fillStyle=e.getColor(this.turn),this.drawCircle(this.currentCoinColumn,t),t}return-1},e.prototype.closeGameAfterWinning=function(){var e=this;this.cleanUpEvents(),this.exitBtn&&this.exitBtn.classList.add("hide"),setTimeout((function(){e.resetValues(),e.hideGame(),e.playerNameSection&&e.playerNameSection.clear()}),3e3)},e.prototype.paintCoinToDrop=function(e){this.context.beginPath(),this.context.arc(this.colOffset+e*this.colGap,this.circleRadius,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.clearUpper=function(){this.context.clearRect(0,0,this.canvas.width,e.verticalOffset)},e.prototype.cleanUpEvents=function(){this.canvas.removeEventListener("mousemove",this.canvasMousemove,!1),this.canvas.removeEventListener("click",this.canvasClick,!1),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("resize",this.resizeCanvas),this.exitBtn.removeEventListener("click",this.exit),document.body.removeEventListener("keydown",this.handleKeyDown)},e.prototype.exit=function(){this.cleanUpEvents(),this.hideGame(),this.resetValues(),this.playerNameSection&&this.playerNameSection.clear()},e.prototype.resetValues=function(){this.turn=i.Coin.Red,i.default.initBoard(this.board),this.playerNameSection&&this.playerNameSection.reset()},e.prototype.drawCircle=function(t,n){this.context.beginPath(),this.context.arc(this.colOffset+t*this.colGap,2*e.verticalOffset+n*this.rowGap,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.areBothPlayersConnected=function(){return this.playerNameSection&&this.playerNameSection.areBothPlayersConnected()},e.prototype.showGame=function(){this.canvas.classList.remove("hide"),this.exitBtn.classList.remove("hide"),this.gameIndicatorsContainer.classList.remove("hide"),this.gameMenu.classList.add("hide")},e.prototype.hideGame=function(){this.canvas.classList.add("hide"),this.exitBtn.classList.add("hide"),this.gameIndicatorsContainer.classList.add("hide"),this.gameMenu.classList.remove("hide")},e.getColor=function(e){var t="";switch(e){case i.Coin.Empty:t="lightyellow";break;case i.Coin.Red:t="red";break;case i.Coin.Green:t="greenyellow"}return t},e.verticalOffset=70,e.moveLeftKeys=["a","A","ArrowLeft"],e.moveRightKeys=["d","D","ArrowRight"],e}();t.default=a},547:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var i=n(39),a=n(833),s=n(998),c=n(664),l=n(771),u=n(721),d=n(118),p=n(365),f=n(583),h=function(e){function t(t){var n=e.call(this,t)||this;return n.onSocketMessage=function(e){if(d.GameMessage.isInitialMessage(e)&&((t=e).opponentName&&n.socket&&n.playerNameSection&&(n.toggleWaitingClass(),n.socket.getPlayerColor()===i.Coin.Red?n.playerNameSection.setPlayerGreen(t.opponentName):n.socket.getPlayerColor()===i.Coin.Green&&n.playerNameSection.setPlayerRed(t.opponentName)),t.color&&n.socket&&n.playerNameSection&&(t.color===i.Coin.Red?n.playerNameSection.setPlayerRed(n.socket.getPlayerName()):n.playerNameSection.setPlayerGreen(n.socket.getPlayerName()))),d.GameMessage.isActionMessage(e)&&("mousemove"===(t=e).action&&(n.currentCoinColumn=t.column,n.moveCoin()),"click"===t.action&&(n.turn=t.color,n.currentCoinColumn=t.column,n.landCoin())),d.GameMessage.isSkipTurnMessage(e)&&(t=e).skipTurn&&t.currentTurn&&(n.turn=t.currentTurn,n.turnCountDown=d.skipTurnMaxWait,n.toggleWaitingClass()),d.GameMessage.isWinnerMessage(e)){var t=e,o=null;n.playerNameSection&&(o=t.winner===i.Coin.Red?"".concat(n.playerNameSection.getPlayerRed()," (Red)"):"".concat(n.playerNameSection.getPlayerGreen()," (Green)")),n.showWinDialog(o,t.winner),n.closeGameAfterWinning(),document.body.classList.remove("waiting")}d.GameMessage.isTieMessage(e)&&(a.default.notify({id:p.DialogIds.GameEnd,text:["Game resulted in tie!"]}),document.body.classList.remove("waiting"),n.closeGameAfterWinning()),d.GameMessage.isCurrentTurnMessage(e)&&(t=e,n.turn=t.currentTurn,n.toggleWaitingClass(),n.playerNameSection&&n.playerNameSection.indicateTurn(n.turn)),d.GameMessage.isDisconnectMessage(e)&&(a.default.notify({id:p.DialogIds.GameEnd,text:["Your opponent disconnected. You win!"]}),document.body.classList.remove("waiting"),n.closeGameAfterWinning()),d.GameMessage.isErrorMessage(e)&&(t=e,a.default.closeAllOpenDialogs(),a.default.notify({id:p.DialogIds.ServerError,text:[t.error]}),document.body.classList.remove("waiting"),n.closeGameAfterWinning())},n.onSocketError=function(){e.prototype.exit.call(n)},n.canvasMousemove=function(e){if(n.socket&&n.turn===n.socket.getPlayerColor()&&n.areBothPlayersConnected()){n.currentCoinColumn=n.getColumnFromCursorPosition(e),n.moveCoin();var t=new d.ActionMessage(n.currentCoinColumn,"mousemove",n.turn);n.socket.send(t)}},n.canvasClick=function(e){if(n.socket&&n.turn===n.socket.getPlayerColor()&&n.areBothPlayersConnected()){n.currentCoinColumn=n.getColumnFromCursorPosition(e);var t=new d.ActionMessage(n.currentCoinColumn,"click",n.turn);n.socket.send(t),n.landCoin()}},n.exit=function(){a.default.confirm({id:p.DialogIds.ExitGame,text:["Network game in progress. Are you sure you want to quit?"],yesCallback:n.confirmExit,noCallback:function(){},yesColor:"red",noColor:"green"})},n.confirmExit=function(){n.socket&&n.socket.close(),a.default.closeAllOpenDialogs(),document.body.classList.remove("waiting"),e.prototype.exit.call(n)},n.beforeUnload=function(e){e.preventDefault(),e.returnValue=!1},n.turnCountDownCallback=function(){n.areBothPlayersConnected()&&(n.turnCountDown--,n.countdownSpan.innerText=n.turnCountDown.toString(),n.adaptCountDownColor())},n.onInputPlayerNameInDialog=function(e){n.socket&&(n.socket.getPlayerColor()===i.Coin.Red?n.playerNameSection.setPlayerRed(e):n.playerNameSection.setPlayerGreen(e))},n.handleKeyDown=function(e){if(n.socket&&n.turn===n.socket.getPlayerColor()&&n.areBothPlayersConnected()){var t=void 0;c.default.moveLeftKeys.includes(e.key)&&n.currentCoinColumn>0&&(n.currentCoinColumn--,t=new d.ActionMessage(n.currentCoinColumn,"mousemove",n.turn),n.socket.send(t),n.moveCoin()),c.default.moveRightKeys.includes(e.key)&&n.currentCoinColumn<f.BoardLogic.columns-1&&(n.currentCoinColumn++,t=new d.ActionMessage(n.currentCoinColumn,"mousemove",n.turn),n.socket.send(t),n.moveCoin())," "===e.key&&(t=new d.ActionMessage(n.currentCoinColumn,"click",n.turn),n.socket.send(t),n.landCoin())}"Escape"===e.key&&n.exit()},t.timerCountdownId&&(n.countdownSpan=document.getElementById(t.timerCountdownId)),n}return r(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.defineSocket(),this.startCountdown(),e.prototype.start.call(this),document.body.classList.add("waiting")},t.prototype.defineSocket=function(){this.socket=new l.default,this.socket.onMessageCallback=this.onSocketMessage,this.socket.onErrorCallback=this.onSocketError,this.socket.onInputPlayerNameInDialog=this.onInputPlayerNameInDialog,this.socket.onGameCancel=this.confirmExit},t.prototype.resetValues=function(){e.prototype.resetValues.call(this),this.stopCountdown(),this.socket&&this.socket.close()},t.prototype.landCoin=function(){if(this.board[this.currentCoinColumn][0]===i.Coin.Empty){var t=e.prototype.landCoin.call(this);return this.switchTurn(),this.context.fillStyle=c.default.getColor(this.turn),this.paintCoinToDrop(this.currentCoinColumn),u.default.playSound(s.Sound.LandCoin),this.toggleWaitingClass(),t}return-1},t.prototype.toggleWaitingClass=function(){this.socket.getPlayerColor()===this.turn?document.body.classList.remove("waiting"):document.body.classList.add("waiting")},t.prototype.showWinDialog=function(e,t){var n=new Array;n.push("".concat(e," wins!")),this.socket&&this.socket.getPlayerColor()===t?(n.push("You win!"),u.default.playSound(s.Sound.Win)):(n.push("You lose!"),u.default.playSound(s.Sound.Lose)),a.default.notify({id:p.DialogIds.GameEnd,text:n})},t.prototype.switchTurn=function(){e.prototype.switchTurn.call(this),this.resetCountdown()},t.prototype.adaptCountDownColor=function(){this.turnCountDown>d.skipTurnMaxWait/2?(this.countdownSpan.classList.add("green-text"),this.countdownSpan.classList.remove("red-text")):(this.countdownSpan.classList.remove("green-text"),this.countdownSpan.classList.add("red-text"))},t.prototype.startCountdown=function(){this.turnCountDown=d.skipTurnMaxWait,this.turnCountDownInterval=window.setInterval(this.turnCountDownCallback,1e3)},t.prototype.stopCountdown=function(){clearInterval(this.turnCountDownInterval),this.countdownSpan.innerText=""},t.prototype.resetCountdown=function(){this.turnCountDown=d.skipTurnMaxWait},t}(c.default);t.default=h},698:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});var o=n(118),r=n(833),i=n(365),a=function(){function e(e,t){var n=this;this.onPromptOK=function(e){var t=document.getElementById("dialog-input-red"),o=document.getElementById("dialog-input-green");if(t.value&&o.value&&t.value.trim()&&o.value.trim())return n.playerRed=t.value,n.playerGreen=o.value,n.printPlayerNames(),e(),null},this.onPromptCancel=function(e){e()},e&&(this.playerRedSpan=document.getElementById(e)),t&&(this.playerGreenSpan=document.getElementById(t))}return e.prototype.setUpPlayerNames=function(e,t){var n=this;localStorage.getItem("playerRed")&&localStorage.getItem("playerGreen")||r.default.prompt({id:i.DialogIds.PlayerNames,text:["Please enter player names! (10 characters or less.)"],onOK:function(){return n.onPromptOK(e)},onCancel:function(){return n.onPromptCancel(t)},inputs:[{label:"Player Red",name:"red",type:"text",limit:10,required:!0},{label:"Player Green",name:"green",type:"text",limit:10,required:!0}]})},e.prototype.printPlayerNames=function(){var e="Waiting to connect...";this.playerGreenSpan&&(this.playerGreen?this.playerGreenSpan.innerText=this.playerGreen:this.playerGreenSpan.innerText=e),this.playerRedSpan&&(this.playerRed?this.playerRedSpan.innerText=this.playerRed:this.playerRedSpan.innerText=e)},e.prototype.clear=function(){this.playerGreenSpan&&(this.playerGreenSpan.innerText=""),this.playerRedSpan&&(this.playerRedSpan.innerText="")},e.prototype.reset=function(){this.playerRed=null,this.playerGreen=null},e.prototype.getPlayerRed=function(){return this.playerRed},e.prototype.getPlayerGreen=function(){return this.playerGreen},e.prototype.areBothPlayersConnected=function(){return!!this.playerRed&&!!this.playerGreen},e.prototype.saveIntoLocalStorage=function(){localStorage.setItem("playerRed",this.playerRed),localStorage.setItem("playerGreen",this.playerGreen)},e.prototype.setFromLocalStorage=function(){this.playerRed=localStorage.getItem("playerRed"),this.playerGreen=localStorage.getItem("playerGreen")},e.prototype.setPlayerRed=function(e){this.playerRed=e,this.playerRedSpan&&(this.playerRedSpan.innerText=this.playerRed)},e.prototype.setPlayerGreen=function(e){this.playerGreen=e,this.playerGreenSpan&&(this.playerGreenSpan.innerText=this.playerGreen)},e.prototype.indicateTurn=function(e){e===o.Coin.Red?(this.playerRedSpan.classList.add("currentTurn"),this.playerGreenSpan.classList.remove("currentTurn")):(this.playerGreenSpan.classList.add("currentTurn"),this.playerRedSpan.classList.remove("currentTurn"))},e}();t.default=a},42:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){this.x=e,this.y=t}return e.getCursorPosition=function(t,n){var o,r;return void 0!==t.pageX||void 0!==t.pageY?(o=t.pageX,r=t.pageY):(o=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,r=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),new e(o-=n.offsetLeft,r-=n.offsetTop)},e}();t.default=n},952:function(e,t,n){var o,r=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var i=n(833),a=n(664),s=n(998),c=n(721),l=n(656),u=n(118),d=n(365),p=function(e){function t(t){var n=e.call(this,t)||this;return n.setTimer=function(){n.timer&&n.timer.set()},n.continuePreviousGame=function(){n.restoreLastGame(),n.onGameDataCheck()},n.cancelPreviousGame=function(){localStorage.clear(),n.turn=(0,u.randomiseColor)(),n.onGameDataCheck()},n.canvasMousemove=function(e){n.areBothPlayersConnected()&&(n.currentCoinColumn=n.getColumnFromCursorPosition(e),n.moveCoin())},n.canvasClick=function(e){n.areBothPlayersConnected()&&(n.currentCoinColumn=n.getColumnFromCursorPosition(e),n.landCoin())},n.exit=function(){n.saveGame(),i.default.closeAllOpenDialogs(),n.timer&&n.timer.stop(),e.prototype.exit.call(n)},n.beforeUnload=function(){n.saveGame()},n.pageVisibilityChange=function(){n.timer&&n.timer.pauseWhenDocumentHidden()},n.handleKeyDown=function(e){n.areBothPlayersConnected()&&(a.default.moveLeftKeys.includes(e.key)&&n.currentCoinColumn>0&&(n.currentCoinColumn--,n.moveCoin()),a.default.moveRightKeys.includes(e.key)&&n.currentCoinColumn<u.default.columns-1&&(n.currentCoinColumn++,n.moveCoin())," "===e.key&&n.landCoin()),"Escape"===e.key&&n.exit()},t.timerCountdownId&&(n.timer=new l.default(t.timerCountdownId)),n}return r(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.checkGameData()},t.prototype.onGameDataCheck=function(){this.playerNameSection&&this.playerNameSection.setUpPlayerNames(this.setTimer,this.exit),this.areBothPlayersConnected()&&this.setTimer(),e.prototype.start.call(this)},t.prototype.checkGameData=function(){var e=localStorage.getItem("board"),t=localStorage.getItem("nextTurn");e&&t?i.default.confirm({id:d.DialogIds.ContinueGame,text:["Do you want to continue playing the previous game?"],yesCallback:this.continuePreviousGame,noCallback:this.cancelPreviousGame,yesColor:"green",noColor:"red"}):(this.turn=(0,u.randomiseColor)(),this.onGameDataCheck())},t.prototype.restoreLastGame=function(){this.turn=parseInt(localStorage.getItem("nextTurn")),this.board=JSON.parse(localStorage.getItem("board")),this.timer&&this.timer.setSecondsRunningFromLocalStorage(),this.playerNameSection&&this.playerNameSection.setFromLocalStorage()},t.prototype.saveGame=function(){this.areBothPlayersConnected()&&(localStorage.setItem("nextTurn",this.turn.toString()),localStorage.setItem("board",JSON.stringify(this.board)),this.playerNameSection&&this.playerNameSection.saveIntoLocalStorage(),this.timer&&this.timer.saveSecondsRunningToLocalStorage())},t.prototype.closeGameAfterWinning=function(){localStorage.clear(),this.timer&&this.timer.stop(),e.prototype.closeGameAfterWinning.call(this)},t.prototype.landCoin=function(){if(this.board[this.currentCoinColumn][0]===u.Coin.Empty){var t=e.prototype.landCoin.call(this);if(u.default.countConsecutiveCoins(this.board,this.currentCoinColumn,t,this.turn)>=4){var n="";this.playerNameSection&&(this.turn===u.Coin.Red?n="".concat(this.playerNameSection.getPlayerRed()," (Red)"):this.turn===u.Coin.Green&&(n="".concat(this.playerNameSection.getPlayerGreen()," (Green)"))),this.showWinDialog(n,this.turn),this.closeGameAfterWinning()}else if(u.default.isBoardFull(this.board)){var o="";this.playerNameSection&&(o+="".concat(this.playerNameSection.getPlayerRed()," (Red) and ").concat(this.playerNameSection.getPlayerGreen()," (Green)")),o+=" are tied!",i.default.notify({id:d.DialogIds.GameEnd,text:[o]}),this.closeGameAfterWinning()}else this.switchTurn(),this.context.fillStyle=a.default.getColor(this.turn),this.paintCoinToDrop(this.currentCoinColumn),c.default.playSound(s.Sound.LandCoin);return t}return-1},t.prototype.setGameEvents=function(){e.prototype.setGameEvents.call(this),document.addEventListener("visibilitychange",this.pageVisibilityChange)},t.prototype.cleanUpEvents=function(){e.prototype.cleanUpEvents.call(this),document.removeEventListener("changevisibility",this.pageVisibilityChange)},t.prototype.showWinDialog=function(e,t){var n=new Array;n.push("".concat(e," wins!")),this.timer&&n.push("Time taken: ".concat(this.timer.getTimeInStringFormat())),c.default.playSound(s.Sound.Win),i.default.notify({id:d.DialogIds.GameEnd,text:n})},t.prototype.resetValues=function(){e.prototype.resetValues.call(this),this.timer&&this.timer.reset()},t}(a.default);t.default=p},771:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});var o=n(833),r=n(365),i=n(721),a=n(118),s=function(){function e(){var e=this;this.getPlayerColor=function(){return e.playerColor},this.getPlayerName=function(){return e.playerName},this.onMessage=function(t){var n=JSON.parse(t.data);if(a.GameMessage.isInitialMessage(n)){var i,s=n;e.gameId||(e.gameId=s.gameId),e.playerColor||(e.playerColor=s.color,i=e.playerColor===a.Coin.Red?"red":"green",o.default.prompt({id:r.DialogIds.PlayerNames,text:["You are ".concat(i,". Please enter your name. (10 characters or less.)")],onOK:function(){return e.onPlayerNameInput(i)},onCancel:function(){return e.onGameCancel()},inputs:[{label:"Player ".concat(i[0].toUpperCase()).concat(i.substring(1)),name:i,type:"text",limit:10,required:!0}]}))}e.onMessageCallback&&e.onMessageCallback(n)},this.onPlayerNameInput=function(t){var n=document.getElementById("dialog-input-".concat(t));if(n&&n.value&&n.value.trim()){e.playerName=n.value,e.onInputPlayerNameInDialog(e.playerName);var o=new a.PlayerNameMessage(e.playerName);return e.send(o),null}},this.onError=function(){e.onErrorCallback(),o.default.closeAllOpenDialogs(),o.default.notify({id:r.DialogIds.ServerError,text:["Problem connecting to server!"]}),document.body.classList.remove("waiting")},this.onClose=function(){e.connect()},this.connect()}return e.prototype.connect=function(){var e;e=i.default.isLocal()?"ws://localhost:3000/":"wss://daniels-connect4-server.adaptable.app/",this.playerColor&&!isNaN(this.gameId)&&(e+="?playerColor=".concat(this.playerColor,"&gameId=").concat(this.gameId,"&playerName=").concat(this.playerName)),this.webSocket=new WebSocket(e),this.webSocket.onmessage=this.onMessage,this.webSocket.onerror=this.onError,this.webSocket.onclose=this.onClose},e.prototype.send=function(e){this.webSocket.send(JSON.stringify(e))},e.prototype.close=function(){this.webSocket.onclose=null,this.webSocket.onmessage=null,this.webSocket.onerror=null,this.webSocket.close()},e}();t.default=s},656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){var t=this;this.timerCallback=function(){t.secondsRunning++;var e=Math.floor(t.secondsRunning/60),n=t.secondsRunning%60;t.timerSpan.innerText="".concat(e,":").concat(n<10?"0":"").concat(n),t.timerSpan.classList.contains("hide")&&clearInterval(t.interval)},this.timerSpan=document.getElementById(e),this.secondsRunning=0}return e.prototype.set=function(){this.timerSpan&&(this.timerSpan.classList.remove("hide"),this.interval=window.setInterval(this.timerCallback,1e3))},e.prototype.stop=function(){this.interval&&(clearInterval(this.interval),this.timerSpan.innerText="",this.timerSpan.classList.add("hide"))},e.prototype.pauseWhenDocumentHidden=function(){document.hidden?clearInterval(this.interval):this.interval=window.setInterval(this.timerCallback,1e3)},e.prototype.getTimeInStringFormat=function(){return this.timerSpan?this.timerSpan.innerText:""},e.prototype.saveSecondsRunningToLocalStorage=function(){localStorage.setItem("secondsRunning",this.secondsRunning.toString())},e.prototype.setSecondsRunningFromLocalStorage=function(){this.secondsRunning=parseInt(localStorage.getItem("secondsRunning"))},e.prototype.reset=function(){this.secondsRunning=0},e}();t.default=n},721:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e.isLocal=function(){return"file:"===location.protocol||"localhost"===location.hostname},e.playSound=function(e){new Audio(e).play()},e}();t.default=n}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}(()=>{var e=n(833),t=n(365),o=n(607),r=n(547),i=n(952),a=document.getElementById("samePC"),s=document.getElementById("network"),c=document.getElementById("instructions");function l(e){var t;(t=document.getElementById("errorMessage"))&&t.classList.add("hide");try{var n={canvasId:"board",exitBtnId:"exitBtn",timerCountdownId:"timer",playerRedId:"playerRed",playerGreenId:"playerGreen",menuId:"menu",gameIndicatorsId:"gameIndicators"};e===o.GameMode.Network?r.default.getInstance(n).start():i.default.getInstance(n).start()}catch(e){!function(e){var t=document.getElementById("errorMessage");t&&(t.classList.remove("hide"),t.innerText="Problem encountered!")}()}}a.addEventListener("click",(function(){l(o.GameMode.SamePC)}),!1),s.addEventListener("click",(function(){l(o.GameMode.Network)}),!1),c.addEventListener("click",(function(){e.default.notify({id:t.DialogIds.Instructions,text:["The principle behind Connect4 is simple:","The player who first places 4 coins next to each other, wins. These may be \n            horizontal, vertical or diagonal.","Furthermore, in network play, you must place your coin within 60 seconds.\n            If you fail to do so, you pass the turn to your opponent.","Good luck and have fun playing!"]})}),!1),document.getElementById("shareBtn").addEventListener("click",(function(e){if(e.preventDefault(),navigator.canShare){var t={url:location.href,title:"Daniel's Connect4"};navigator.share(t).catch((function(e){return console.error("Problem while sharing: ".concat(e))}))}}))})()})();
//# sourceMappingURL=bundle.js.map