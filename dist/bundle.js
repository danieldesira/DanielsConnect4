(()=>{"use strict";var e={307:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BoardLogic=void 0;var o=n(434),i=function(){function e(){}return e.initBoard=function(t){for(var n=0;n<e.columns;n++){t[n]=new Array(e.rows);for(var i=0;i<e.rows;i++)t[n][i]=o.Dot.Empty}},e.countConsecutiveDots=function(t,n,o,i){for(var r=o,a=0;a<4&&r<e.rows&&t[n][r]===i;)a++,r++;if(a<4){for(a=0,r=n;r<e.columns&&t[r][o]===i;)a++,r++;for(r=n-1;r>-1&&t[r][o]===i;)a++,r--;if(a<4){a=0;for(var s=o-1,c=n+1;a<4&&s>-1&&c<e.columns&&t[c][s]===i;)a++,c++,s--;for(c=n,s=o;a<4&&s<e.rows&&c>-1&&t[c][s]===i;)a++,c--,s++;if(a<4){for(a=0,s=o-1,c=n-1;a<4&&s>-1&&c>-1&&t[c][s]===i;)a++,c--,s--;for(c=n,s=o;a<4&&s<e.rows&&c<e.columns&&t[c][s]===i;)a++,c++,s++}}}return a},e.isBoardFull=function(t){for(var n=!0,i=0;i<e.columns;i++)if(t[i][0]===o.Dot.Empty){n=!1;break}return n},e.columns=9,e.rows=8,e}();t.BoardLogic=i},833:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Dialog=void 0;var o=n(305),i=function(){function e(){}return e.modal=function(e,t,n){var i=this;void 0===n&&(n=null);var r=document.createElement("div");r.classList.add("dialog");var a=document.createElement("div");this.appendText(e,a),r.appendChild(a);var s=document.createElement("div");switch(s.classList.add("dialog-btn-container"),t){case o.DialogType.Confirmation:var c=n;this.appendBtn(s,"Yes",(function(){c.yesCallback(),i.closeModal(r)}),"green"),this.appendBtn(s,"No",(function(){c.noCallback(),i.closeModal(r)}),"red");break;case o.DialogType.Notification:this.appendBtn(s,"OK",(function(){i.closeModal(r)}),"green");break;case o.DialogType.Prompt:var l=n;this.appendInputs(r,l.inputs),this.appendBtn(s,"OK",(function(){var e=l.onOK();e?i.appendError(r,e):i.closeModal(r)}),"green")}r.appendChild(s),document.body.appendChild(r)},e.appendBtn=function(e,t,n,o){var i=document.createElement("button");i.type="button",i.innerText=t,i.classList.add("text"),i.classList.add("dialog-btn"),i.classList.add("dialog-btn-"+o),i.addEventListener("click",n),e.appendChild(i)},e.appendInputs=function(e,t){var n=document.createElement("div");n.classList.add("dialog-input-container");for(var o=0;o<t.length;o++){var i=document.createElement("label");i.innerText=t[o].name+": ",i.classList.add("text"),n.appendChild(i);var r=document.createElement("input");r.type=t[o].type,r.id=t[o].name,r.name=t[o].name,r.classList.add("dialog-input"),r.classList.add("text"),n.appendChild(r),this.appendBrElement(n),this.appendBrElement(n)}e.appendChild(n)},e.appendBrElement=function(e){var t=document.createElement("br");e.appendChild(t)},e.appendError=function(e,t){var n=document.getElementById("dialogError");n||((n=document.createElement("div")).id="dialogError",n.classList.add("red-text"),n.classList.add("text"),n.classList.add("dialog-error"),e.appendChild(n)),n.innerText=t},e.appendText=function(e,t){t.classList.add("text"),t.classList.add("dialog-text");for(var n=0;n<e.length;n++){var o=document.createElement("p");o.innerText=e[n],t.appendChild(o)}},e.closeModal=function(e){document.body.contains(e)&&document.body.removeChild(e)},e.confirm=function(t,n){e.modal(t,o.DialogType.Confirmation,n)},e.notify=function(t){e.modal(t,o.DialogType.Notification)},e.prompt=function(t,n){e.modal(t,o.DialogType.Prompt,n)},e.closeAllOpenDialogs=function(){for(var e=document.getElementsByClassName("dialog"),t=0;t<e.length;t++)this.closeModal(e[t])},e}();t.Dialog=i},305:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.DialogType=void 0,(n=t.DialogType||(t.DialogType={}))[n.Confirmation=0]="Confirmation",n[n.Notification=1]="Notification",n[n.Prompt=2]="Prompt"},434:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Dot=void 0,(n=t.Dot||(t.Dot={})).Empty="lightyellow",n.Red="red",n.Green="greenyellow"},607:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.GameMode=void 0,(n=t.GameMode||(t.GameMode={}))[n.SamePC=1]="SamePC",n[n.Network=2]="Network"},998:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Sound=void 0,(n=t.Sound||(t.Sound={})).LandDot="./sounds/land-dot.m4a",n.Win="./sounds/win.m4a",n.Lose="./sounds/lose.m4a"},664:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;var o=n(434),i=n(42),r=n(721),a=n(998),s=n(307),c=n(656),l=n(698),u=n(833),p=function(){function e(e){var t=this;this.board=new Array(s.BoardLogic.columns),this.turn=o.Dot.Red,this.resizeCanvas=function(){t.canvas.height=window.innerHeight-100,t.canvas.width=window.innerWidth,t.canvas.width<1e3?t.circleRadius=20:t.circleRadius=30,t.canvas.height>t.canvas.width?(t.colGap=t.canvas.width/s.BoardLogic.columns,t.rowGap=t.canvas.height/s.BoardLogic.rows):(t.colGap=t.canvas.width/s.BoardLogic.columns,t.rowGap=65),t.colOffset=t.colGap/2,t.paintBoard()},this.setTimer=function(){t.timer&&t.timer.set()},this.canvas=document.getElementById(e.canvasId),this.context=this.canvas.getContext("2d"),s.BoardLogic.initBoard(this.board),e.exitBtnId&&(this.exitBtn=document.getElementById(e.exitBtnId)),e.timerId&&(this.timer=new c.Timer(e.timerId)),e.playerRedId&&e.playerGreenId&&(this.playerNameSection=new l.PlayerNameSection(e.playerRedId,e.playerGreenId))}return e.prototype.start=function(){this.playerNameSection&&(this.playerNameSection.printPlayerNames(),this.playerNameSection.indicateTurn(this.turn)),this.resizeCanvas(),this.setGameEvents()},e.prototype.paintBoard=function(){var t=this.context.createLinearGradient(0,0,this.canvas.width,0);t.addColorStop(0,"blue"),t.addColorStop(1,"aqua"),this.context.fillStyle=t,this.context.fillRect(0,e.verticalOffset,this.canvas.width,this.canvas.height);for(var n=s.BoardLogic.columns-1;n>=0;n--)for(var o=s.BoardLogic.rows-1;o>=0;o--)this.context.fillStyle=this.board[n][o],this.drawCircle(n,o)},e.prototype.setGameEvents=function(){this.canvas.addEventListener("mousemove",this.canvasMousemove,!1),this.canvas.addEventListener("click",this.canvasClick,!1),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("resize",this.resizeCanvas),this.exitBtn.addEventListener("click",this.exit)},e.prototype.getColumnFromCursorPosition=function(e){var t=i.Position.getCursorPosition(e,this.canvas);return Math.round((t.x-this.colOffset)/this.colGap)},e.prototype.switchTurn=function(){this.turn===o.Dot.Red?this.turn=o.Dot.Green:this.turn===o.Dot.Green&&(this.turn=o.Dot.Red),this.playerNameSection&&this.playerNameSection.indicateTurn(this.turn)},e.prototype.moveDot=function(e){this.clearUpper(),this.context.fillStyle=this.turn,this.paintDotToDrop(e)},e.prototype.landDot=function(e){var t;if(this.board[e][0]===o.Dot.Empty){var n=void 0;for(n=s.BoardLogic.rows-1;n>=0;n--)if(this.board[e][n]===o.Dot.Empty){this.board[e][n]=this.turn,t=n;break}if(this.context.fillStyle=this.turn,this.drawCircle(e,n),s.BoardLogic.countConsecutiveDots(this.board,e,t,this.turn)>=4){var i="";this.playerNameSection&&(this.turn===o.Dot.Red?i=this.playerNameSection.getPlayerRed()+" (Red)":this.turn===o.Dot.Green&&(i=this.playerNameSection.getPlayerGreen()+" (Green)")),this.showWinDialog(i),this.closeGameAfterWinning()}else if(s.BoardLogic.isBoardFull(this.board)){var c="";this.playerNameSection&&(c+=this.playerNameSection.getPlayerRed()+" (Red) and "+this.playerNameSection.getPlayerGreen()+" (Green)"),c+=" are tied!",u.Dialog.notify([c]),this.closeGameAfterWinning()}else this.switchTurn(),this.context.fillStyle=this.turn,this.paintDotToDrop(e),r.Utils.playSound(a.Sound.LandDot)}},e.prototype.showWinDialog=function(e){var t=new Array;t.push(e+" wins!"),this.timer&&t.push("Time taken: "+this.timer.getTimeInStringFormat()),r.Utils.playSound(a.Sound.Win),u.Dialog.notify(t)},e.prototype.closeGameAfterWinning=function(){this.cleanUpEvents(),this.playerNameSection&&this.playerNameSection.clear(),this.timer&&this.timer.stop(),this.exitBtn&&this.exitBtn.classList.add("hide"),this.resetValues(),this.onGameEnd&&setTimeout(this.onGameEnd,3e3)},e.prototype.paintDotToDrop=function(e){this.context.beginPath(),this.context.arc(this.colOffset+e*this.colGap,this.circleRadius,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.clearUpper=function(){this.context.clearRect(0,0,this.canvas.width,e.verticalOffset)},e.prototype.cleanUpEvents=function(){this.canvas.removeEventListener("mousemove",this.canvasMousemove,!1),this.canvas.removeEventListener("click",this.canvasClick,!1),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("resize",this.resizeCanvas),this.exitBtn.removeEventListener("click",this.exit)},e.prototype.exit=function(){this.cleanUpEvents(),this.onGameEnd(),this.resetValues(),this.playerNameSection&&this.playerNameSection.clear(),this.timer&&this.timer.stop()},e.prototype.resetValues=function(){this.turn=o.Dot.Red,s.BoardLogic.initBoard(this.board),this.playerNameSection&&this.playerNameSection.reset(),this.timer&&this.timer.reset()},e.prototype.drawCircle=function(t,n){this.context.beginPath(),this.context.arc(this.colOffset+t*this.colGap,2*e.verticalOffset+n*this.rowGap,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.areBothPlayersConnected=function(){return this.playerNameSection&&this.playerNameSection.areBothPlayersConnected()},e.verticalOffset=70,e}();t.Game=p},480:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.ActionMessage=void 0;var r=function(e){function t(t,n){var o=e.call(this)||this;return o.column=t,o.action=n,o}return i(t,e),t}(n(388).GameMessage);t.ActionMessage=r},388:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GameMessage=void 0;var n=function(){function e(){}return e.isInitialMessage=function(e){return!isNaN(e.gameId)&&e.color||e.opponentName},e.isInactivityMessage=function(e){return e.endGameDueToInactivity&&e.currentTurn},e.isActionMessage=function(e){return e.action&&!isNaN(e.column)},e.isSkipTurnMessage=function(e){return e.skipTurn&&e.currentTurn},e}();t.GameMessage=n},687:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.InactivityMessage=void 0;var r=function(e){function t(t,n){var o=e.call(this)||this;return o.endGameDueToInactivity=t,o.currentTurn=n,o}return i(t,e),t}(n(388).GameMessage);t.InactivityMessage=r},726:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.PlayerNameMessage=void 0;var r=function(e){function t(t){var n=e.call(this)||this;return n.name=t,n}return i(t,e),t}(n(388).GameMessage);t.PlayerNameMessage=r},836:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.SkipTurnMessage=void 0;var r=function(e){function t(t,n){var o=e.call(this)||this;return o.skipTurn=t,o.currentTurn=n,o}return i(t,e),t}(n(388).GameMessage);t.SkipTurnMessage=r},547:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.NetworkGame=void 0;var r=n(833),a=n(434),s=n(998),c=n(664),l=n(480),u=n(388),p=n(687),d=n(836),h=n(771),m=n(721),y=function(e){function t(t){var n=e.call(this,t)||this;return n.onSocketMessage=function(e){var t;u.GameMessage.isInitialMessage(e)&&((t=e).opponentName&&n.socket&&n.playerNameSection&&(n.socket.getPlayerColor()===a.Dot.Red?n.playerNameSection.setPlayerGreen(t.opponentName):n.socket.getPlayerColor()===a.Dot.Green&&n.playerNameSection.setPlayerRed(t.opponentName),n.setTimer()),t.color&&n.socket&&n.playerNameSection&&(t.color===a.Dot.Red?n.playerNameSection.setPlayerRed(n.socket.getPlayerName()):n.playerNameSection.setPlayerGreen(n.socket.getPlayerName()))),u.GameMessage.isInactivityMessage(e)&&(t=e).currentTurn!==n.socket.getPlayerColor()&&(r.Dialog.notify(["You win due to opponent inactivity!"]),m.Utils.playSound(s.Sound.Win),n.closeGameAfterWinning()),u.GameMessage.isActionMessage(e)&&("mousemove"===(t=e).action&&n.moveDot(t.column),"click"===t.action&&n.landDot(t.column)),u.GameMessage.isSkipTurnMessage(e)&&(t=e).skipTurn&&t.currentTurn!==n.socket.getPlayerColor()&&n.switchTurn()},n.onSocketError=function(){e.prototype.exit.call(n)},n.canvasMousemove=function(e){if(n.socket&&n.turn===n.socket.getPlayerColor()&&n.areBothPlayersConnected()){var t=n.getColumnFromCursorPosition(e);n.moveDot(t);var o=new l.ActionMessage(t,"mousemove");n.socket.send(o),n.endGameDueToInactivity=!1}},n.canvasClick=function(e){if(n.socket&&n.turn===n.socket.getPlayerColor()&&n.areBothPlayersConnected()){var t=n.getColumnFromCursorPosition(e),o=new l.ActionMessage(t,"click");n.socket.send(o),n.skipTurn=!1,n.landDot(t)}},n.exit=function(){r.Dialog.confirm(["Network game in progress. Are you sure you want to quit?"],{yesCallback:n.confirmExit,noCallback:function(){}})},n.confirmExit=function(){n.socket&&n.socket.close(),r.Dialog.closeAllOpenDialogs(),e.prototype.exit.call(n)},n.beforeUnload=function(e){e.preventDefault(),e.returnValue=!1},n.turnCountDownCallback=function(){n.areBothPlayersConnected()&&(n.turnCountDown--,n.countdownSpan.innerText=n.turnCountDown.toString(),n.adaptCountDownColor());var e=n.socket.getPlayerColor();if(n.turn===e&&n.turnCountDown<=0&&n.socket)if(n.endGameDueToInactivity){var t=new p.InactivityMessage(!0,e);n.socket.send(t),r.Dialog.notify(["You lose due to inactivity!"]),m.Utils.playSound(s.Sound.Lose),n.closeGameAfterWinning()}else n.skipTurn&&(n.switchTurn(),t=new d.SkipTurnMessage(!0,e),n.socket.send(t))},n.onInputPlayerNameInDialog=function(e){n.socket&&(n.socket.getPlayerColor()===a.Dot.Red?n.playerNameSection.setPlayerRed(e):n.playerNameSection.setPlayerGreen(e))},t.countdownId&&(n.countdownSpan=document.getElementById(t.countdownId)),n}return i(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.defineSocket(),this.startCountdown(),e.prototype.start.call(this)},t.prototype.defineSocket=function(){this.socket=new h.Socket,this.socket.onMessageCallback=this.onSocketMessage,this.socket.onErrorCallback=this.onSocketError,this.socket.onInputPlayerNameInDialog=this.onInputPlayerNameInDialog},t.prototype.resetValues=function(){e.prototype.resetValues.call(this),this.stopCountdown(),this.socket&&this.socket.close()},t.prototype.showWinDialog=function(e){var t=new Array;t.push(e+" wins!"),this.timer&&t.push("Time taken: "+this.timer.getTimeInStringFormat()),this.socket&&this.socket.getPlayerColor()===this.turn?(t.push("You win!"),m.Utils.playSound(s.Sound.Win)):(t.push("You lose!"),m.Utils.playSound(s.Sound.Lose)),r.Dialog.notify(t)},t.prototype.switchTurn=function(){e.prototype.switchTurn.call(this),this.resetCountdown()},t.prototype.adaptCountDownColor=function(){this.turnCountDown>t.countDownMaxSeconds/2?(this.countdownSpan.classList.add("green-text"),this.countdownSpan.classList.remove("red-text")):(this.countdownSpan.classList.remove("green-text"),this.countdownSpan.classList.add("red-text"))},t.prototype.startCountdown=function(){this.skipTurn=!0,this.endGameDueToInactivity=!0,this.turnCountDown=t.countDownMaxSeconds,this.turnCountDownInterval=window.setInterval(this.turnCountDownCallback,1e3)},t.prototype.stopCountdown=function(){clearInterval(this.turnCountDownInterval),this.countdownSpan.innerText=""},t.prototype.resetCountdown=function(){this.turnCountDown=t.countDownMaxSeconds,this.skipTurn=!0,this.endGameDueToInactivity=!0},t.countDownMaxSeconds=60,t}(c.Game);t.NetworkGame=y},698:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PlayerNameSection=void 0;var o=n(833),i=n(434),r=function(){function e(e,t){var n=this;this.onPromptOK=function(e){var t=document.getElementById("red"),o=document.getElementById("green");return t&&o?t.value&&o.value&&t.value.trim()&&o.value.trim()?(n.playerRed=t.value,n.playerGreen=o.value,n.printPlayerNames(),e(),null):"No empty fields allowed!":"Field not implemented! Please fix this stupid bug!"},e&&(this.playerRedSpan=document.getElementById(e)),t&&(this.playerGreenSpan=document.getElementById(t))}return e.prototype.setUpPlayerNames=function(e){var t=this;localStorage.getItem("playerRed")&&localStorage.getItem("playerGreen")||o.Dialog.prompt(["Please enter player names!"],{onOK:function(){return t.onPromptOK(e)},inputs:[{name:"red",type:"text"},{name:"green",type:"text"}]})},e.prototype.printPlayerNames=function(){var e="Waiting to connect...";this.playerGreenSpan&&(this.playerGreen?this.playerGreenSpan.innerText=this.playerGreen:this.playerGreenSpan.innerText=e),this.playerRedSpan&&(this.playerRed?this.playerRedSpan.innerText=this.playerRed:this.playerRedSpan.innerText=e)},e.prototype.clear=function(){this.playerGreenSpan&&(this.playerGreenSpan.innerText=""),this.playerRedSpan&&(this.playerRedSpan.innerText="")},e.prototype.reset=function(){this.playerRed=null,this.playerGreen=null},e.prototype.getPlayerRed=function(){return this.playerRed},e.prototype.getPlayerGreen=function(){return this.playerGreen},e.prototype.areBothPlayersConnected=function(){return!!this.playerRed&&!!this.playerGreen},e.prototype.saveIntoLocalStorage=function(){localStorage.setItem("playerRed",this.playerRed),localStorage.setItem("playerGreen",this.playerGreen)},e.prototype.setFromLocalStorage=function(){this.playerRed=localStorage.getItem("playerRed"),this.playerGreen=localStorage.getItem("playerGreen")},e.prototype.setPlayerRed=function(e){this.playerRed=e,this.playerRedSpan&&(this.playerRedSpan.innerText=this.playerRed)},e.prototype.setPlayerGreen=function(e){this.playerGreen=e,this.playerGreenSpan&&(this.playerGreenSpan.innerText=this.playerGreen)},e.prototype.indicateTurn=function(e){e===i.Dot.Red?(this.playerRedSpan.classList.add("currentTurn"),this.playerGreenSpan.classList.remove("currentTurn")):e===i.Dot.Green&&(this.playerGreenSpan.classList.add("currentTurn"),this.playerRedSpan.classList.remove("currentTurn"))},e}();t.PlayerNameSection=r},42:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Position=void 0;var n=function(){function e(e,t){this.x=e,this.y=t}return e.getCursorPosition=function(t,n){var o,i;return void 0!==t.pageX||void 0!==t.pageY?(o=t.pageX,i=t.pageY):(o=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,i=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),new e(o-=n.offsetLeft,i-=n.offsetTop)},e}();t.Position=n},952:function(e,t,n){var o,i=this&&this.__extends||(o=function(e,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},o(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.SameDeviceGame=void 0;var r=n(833),a=n(434),s=function(e){function t(t){var n=e.call(this,t)||this;return n.continuePreviousGame=function(){n.restoreLastGame(),n.onGameDataCheck()},n.cancelPreviousGame=function(){localStorage.clear(),n.onGameDataCheck()},n.canvasMousemove=function(e){if(n.areBothPlayersConnected()){var t=n.getColumnFromCursorPosition(e);n.moveDot(t)}},n.canvasClick=function(e){if(n.areBothPlayersConnected()){var t=n.getColumnFromCursorPosition(e);n.landDot(t)}},n.exit=function(){n.saveGame(),r.Dialog.closeAllOpenDialogs(),e.prototype.exit.call(n)},n.beforeUnload=function(){n.saveGame()},n.pageVisibilityChange=function(){n.timer&&n.timer.pauseWhenDocumentHidden()},n}return i(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.checkGameData()},t.prototype.onGameDataCheck=function(){this.playerNameSection&&this.playerNameSection.setUpPlayerNames(this.setTimer),this.areBothPlayersConnected()&&this.setTimer(),e.prototype.start.call(this)},t.prototype.checkGameData=function(){var e=localStorage.getItem("board"),t=localStorage.getItem("nextTurn");e&&t?r.Dialog.confirm(["Do you want to continue playing the previous game?"],{yesCallback:this.continuePreviousGame,noCallback:this.cancelPreviousGame}):this.onGameDataCheck()},t.prototype.restoreLastGame=function(){var e=localStorage.getItem("nextTurn");e===a.Dot.Red?this.turn=a.Dot.Red:e===a.Dot.Green&&(this.turn=a.Dot.Green),this.board=JSON.parse(localStorage.getItem("board")),this.timer&&this.timer.setSecondsRunningFromLocalStorage(),this.playerNameSection&&this.playerNameSection.setFromLocalStorage()},t.prototype.saveGame=function(){this.areBothPlayersConnected()&&(localStorage.setItem("nextTurn",this.turn.toString()),localStorage.setItem("board",JSON.stringify(this.board)),this.playerNameSection&&this.playerNameSection.saveIntoLocalStorage(),this.timer&&this.timer.saveSecondsRunningToLocalStorage())},t.prototype.closeGameAfterWinning=function(){localStorage.clear(),e.prototype.closeGameAfterWinning.call(this)},t.prototype.setGameEvents=function(){e.prototype.setGameEvents.call(this),document.addEventListener("visibilitychange",this.pageVisibilityChange)},t.prototype.cleanUpEvents=function(){e.prototype.cleanUpEvents.call(this),document.removeEventListener("changevisibility",this.pageVisibilityChange)},t}(n(664).Game);t.SameDeviceGame=s},771:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Socket=void 0;var o=n(833),i=n(434),r=n(388),a=n(726),s=n(721),c=function(){function e(){var e=this;this.onMessage=function(t){var n=JSON.parse(t.data);if(r.GameMessage.isInitialMessage(n)){var a,s=n;e.gameId||(e.gameId=s.gameId),e.playerColor||(e.playerColor=s.color,a=e.playerColor===i.Dot.Red?"red":"green",o.Dialog.prompt(["You are "+a+". Please enter your name."],{onOK:function(){return e.onPlayerNameInput(a)},inputs:[{name:a,type:"text"}]}))}e.onMessageCallback&&e.onMessageCallback(n)},this.onPlayerNameInput=function(t){var n=document.getElementById(t);if(n){if(n.value&&n.value.trim()){e.playerName=n.value,e.onInputPlayerNameInDialog(e.playerName);var o=new a.PlayerNameMessage(e.playerName);return e.send(o),null}return"Field may not be empty!"}return"Field not implemented! Please fix this stupid bug!"},this.onError=function(){e.onErrorCallback(),o.Dialog.notify(["Problem connecting to server!"])},this.onClose=function(){e.connect()},this.connect()}return e.prototype.connect=function(){var e;e=s.Utils.isLocal()?"ws://localhost:3000/":"wss://daniels-connect4-server.adaptable.app/",this.playerColor&&!isNaN(this.gameId)&&(e+="?playerColor="+this.playerColor+"&gameId="+this.gameId+"&playerName="+this.playerName),this.webSocket=new WebSocket(e),this.webSocket.onmessage=this.onMessage,this.webSocket.onerror=this.onError,this.webSocket.onclose=this.onClose},e.prototype.send=function(e){this.webSocket.send(JSON.stringify(e))},e.prototype.close=function(){this.webSocket.onclose=null,this.webSocket.onmessage=null,this.webSocket.onerror=null,this.webSocket.close()},e.prototype.getPlayerColor=function(){return this.playerColor},e.prototype.getPlayerName=function(){return this.playerName},e}();t.Socket=c},656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Timer=void 0;var n=function(){function e(e){var t=this;this.timerCallback=function(){t.secondsRunning++;var e=Math.floor(t.secondsRunning/60),n=t.secondsRunning%60;t.timerSpan.innerText=e+":"+(n<10?"0":"")+n,t.timerSpan.classList.contains("hide")?clearTimeout(t.timeout):t.timeout=window.setTimeout(t.timerCallback,1e3)},this.timerSpan=document.getElementById(e),this.secondsRunning=0}return e.prototype.set=function(){this.timerSpan&&(this.timerSpan.classList.remove("hide"),this.timerCallback())},e.prototype.stop=function(){this.timeout&&(clearTimeout(this.timeout),this.timerSpan.innerText="",this.timerSpan.classList.add("hide"))},e.prototype.pauseWhenDocumentHidden=function(){document.hidden?clearTimeout(this.timeout):this.timeout=window.setTimeout(this.timerCallback,1e3)},e.prototype.getTimeInStringFormat=function(){return this.timerSpan?this.timerSpan.innerText:""},e.prototype.saveSecondsRunningToLocalStorage=function(){localStorage.setItem("secondsRunning",this.secondsRunning.toString())},e.prototype.setSecondsRunningFromLocalStorage=function(){this.secondsRunning=parseInt(localStorage.getItem("secondsRunning"))},e.prototype.reset=function(){this.secondsRunning=0},e}();t.Timer=n},721:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=void 0;var n=function(){function e(){}return e.isLocal=function(){return"file:"===location.protocol||"localhost"===location.hostname},e.playSound=function(e){new Audio(e).play()},e}();t.Utils=n}},t={};function n(o){var i=t[o];if(void 0!==i)return i.exports;var r=t[o]={exports:{}};return e[o].call(r.exports,r,r.exports,n),r.exports}(()=>{var e,t=n(607),o=n(547),i=n(952),r=document.getElementById("menu"),a=document.getElementById("samePC"),s=document.getElementById("network"),c=document.getElementById("credits"),l=document.getElementById("exitBtn"),u=document.getElementById("board");function p(n){var a;(a=document.getElementById("errorMessage"))&&a.classList.add("hide");try{var s={canvasId:"board",exitBtnId:"exitBtn",timerId:"timer",playerRedId:"playerRed",playerGreenId:"playerGreen",countdownId:"countdown"};(e=n===t.GameMode.Network?o.NetworkGame.getInstance(s):i.SameDeviceGame.getInstance(s)).onGameEnd=function(){r.classList.remove("hide"),u.classList.add("hide"),l.classList.add("hide")},t.GameMode.Network,e.start(),r.classList.add("hide"),u.classList.remove("hide"),l.classList.remove("hide")}catch(e){!function(e){var t=document.getElementById("errorMessage");t&&(t.classList.remove("hide"),t.innerText="Problem encountered!")}()}}a.addEventListener("click",(function(){p(t.GameMode.SamePC)}),!1),s.addEventListener("click",(function(){p(t.GameMode.Network)}),!1),c.addEventListener("click",(function(){open("contributors.html")}),!1)})()})();
//# sourceMappingURL=bundle.js.map