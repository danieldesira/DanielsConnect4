(()=>{"use strict";var e={307:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BoardLogic=void 0;var n=o(434),r=function(){function e(){}return e.initBoard=function(t){for(var o=0;o<e.columns;o++){t[o]=new Array(e.rows);for(var r=0;r<e.rows;r++)t[o][r]=n.Dot.Empty}},e.countConsecutiveDots=function(t,o,n,r){for(var i=n,a=0;a<4&&i<e.rows&&t[o][i]===r;)a++,i++;if(a<4){for(a=0,i=o;i<e.columns&&t[i][n]===r;)a++,i++;for(i=o-1;i>-1&&t[i][n]===r;)a++,i--;if(a<4){a=0;for(var s=n-1,c=o+1;a<4&&s>-1&&c<e.columns&&t[c][s]===r;)a++,c++,s--;for(c=o,s=n;a<4&&s<e.rows&&c>-1&&t[c][s]===r;)a++,c--,s++;if(a<4){for(a=0,s=n-1,c=o-1;a<4&&s>-1&&c>-1&&t[c][s]===r;)a++,c--,s--;for(c=o,s=n;a<4&&s<e.rows&&c<e.columns&&t[c][s]===r;)a++,c++,s++}}}return a},e.isBoardFull=function(t){for(var o=!0,r=0;r<e.columns;r++)if(t[r][0]===n.Dot.Empty){o=!1;break}return o},e.columns=9,e.rows=8,e}();t.BoardLogic=r},434:(e,t)=>{var o;Object.defineProperty(t,"__esModule",{value:!0}),t.Dot=void 0,(o=t.Dot||(t.Dot={})).Empty="black",o.Red="red",o.Green="greenyellow"},607:(e,t)=>{var o;Object.defineProperty(t,"__esModule",{value:!0}),t.GameMode=void 0,(o=t.GameMode||(t.GameMode={}))[o.SamePC=1]="SamePC",o[o.Network=2]="Network"},998:(e,t)=>{var o;Object.defineProperty(t,"__esModule",{value:!0}),t.Sound=void 0,(o=t.Sound||(t.Sound={})).LandDot="./sounds/land-dot.m4a",o.Win="./sounds/win.m4a",o.Lose="./sounds/lose.m4a"},664:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;var n=o(434),r=o(42),i=o(721),a=o(998),s=o(307),c=o(656),l=o(698),u=function(){function e(e){var t=this;this.board=new Array(s.BoardLogic.columns),this.turn=n.Dot.Red,this.resizeCanvas=function(){t.canvas.height=window.innerHeight-100,t.canvas.width=window.innerWidth,t.canvas.width<1e3?t.circleRadius=20:t.circleRadius=30,t.canvas.height>t.canvas.width?(t.colGap=t.canvas.width/s.BoardLogic.columns,t.rowGap=t.canvas.height/s.BoardLogic.rows):(t.colGap=t.canvas.width/s.BoardLogic.columns,t.rowGap=65),t.paintBoard()},this.canvas=document.getElementById(e.canvasId),this.context=this.canvas.getContext("2d"),s.BoardLogic.initBoard(this.board),e.exitBtnId&&(this.exitBtn=document.getElementById(e.exitBtnId)),e.timerId&&(this.timer=new c.Timer(e.timerId)),e.playerRedId&&e.playerGreenId&&(this.playerNames=new l.PlayerNameSection(e.playerRedId,e.playerGreenId))}return e.prototype.start=function(){this.playerNames&&(this.playerNames.printPlayerNames(this.mode),this.playerNames.indicateTurn(this.turn)),this.resizeCanvas(),this.setGameEvents(),this.timer&&this.timer.set()},e.prototype.paintBoard=function(){var e=this.context.createLinearGradient(0,0,this.canvas.width,0);e.addColorStop(0,"blue"),e.addColorStop(1,"aqua"),this.context.fillStyle=e,this.context.fillRect(0,70,this.canvas.width,this.canvas.height);for(var t=s.BoardLogic.columns-1;t>=0;t--)for(var o=s.BoardLogic.rows-1;o>=0;o--)this.context.fillStyle=this.board[t][o],this.context.beginPath(),this.context.arc(50+t*this.colGap,150+o*this.rowGap,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.setGameEvents=function(){this.canvas.addEventListener("mousemove",this.canvasMousemove,!1),this.canvas.addEventListener("click",this.canvasClick,!1),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("resize",this.resizeCanvas)},e.prototype.getColumnFromCursorPosition=function(e){var t=r.Position.getCursorPosition(e,this.canvas);return Math.round((t.x-50)/this.colGap)},e.prototype.switchTurn=function(){this.turn===n.Dot.Red?this.turn=n.Dot.Green:this.turn===n.Dot.Green&&(this.turn=n.Dot.Red),this.playerNames&&this.playerNames.indicateTurn(this.turn)},e.prototype.moveDot=function(e){this.clearUpper(),this.context.fillStyle=this.turn,this.paintDotToDrop(e)},e.prototype.landDot=function(e){var t;if(this.board[e][0]===n.Dot.Empty){for(var o=s.BoardLogic.rows-1;o>-1;o--)if(this.board[e][o]===n.Dot.Empty){this.board[e][o]=this.turn,t=o;break}if(this.context.fillStyle=this.turn,this.context.beginPath(),this.context.arc(50+e*this.colGap,150+o*this.rowGap,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill(),s.BoardLogic.countConsecutiveDots(this.board,e,t,this.turn)>=4){var r="";this.playerNames&&(this.turn===n.Dot.Red?r=this.playerNames.getPlayerRed()+" (Red)":this.turn===n.Dot.Green&&(r=this.playerNames.getPlayerGreen()+" (Green)")),this.winDialog(r),this.closeGameAfterWinning()}else if(s.BoardLogic.isBoardFull(this.board)){var c="";this.playerNames&&(c+=this.playerNames.getPlayerRed()+" (Red) and "+this.playerNames.getPlayerGreen()+" (Green)"),c+=" are tied!",alert(c),this.closeGameAfterWinning()}else this.switchTurn(),this.context.fillStyle=this.turn,this.paintDotToDrop(e),i.Utils.playSound(a.Sound.LandDot)}},e.prototype.winDialog=function(e){var t=e+" wins!";this.timer&&(t+="\nTime taken: "+this.timer.getTimeInStringFormat()),i.Utils.playSound(a.Sound.Win),alert(t)},e.prototype.closeGameAfterWinning=function(){this.cleanUpEvents(),this.playerNames&&this.playerNames.clear(),this.timer&&this.timer.stop(),this.exitBtn&&this.exitBtn.classList.add("hide"),this.resetValues(),this.onGameEnd&&setTimeout(this.onGameEnd,3e3)},e.prototype.paintDotToDrop=function(e){this.context.beginPath(),this.context.arc(50+e*this.colGap,this.circleRadius,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.clearUpper=function(){this.context.clearRect(0,0,this.canvas.width,70)},e.prototype.cleanUpEvents=function(){this.canvas.removeEventListener("mousemove",this.canvasMousemove,!1),this.canvas.removeEventListener("click",this.canvasClick,!1),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("resize",this.resizeCanvas)},e.prototype.exit=function(){this.cleanUpEvents(),this.onGameEnd(),this.resetValues(),this.playerNames&&this.playerNames.clear(),this.timer&&this.timer.stop()},e.prototype.resetValues=function(){this.turn=n.Dot.Red,s.BoardLogic.initBoard(this.board),this.playerNames&&this.playerNames.reset(),this.timer&&this.timer.reset()},e}();t.Game=u},547:function(e,t,o){var n,r=this&&this.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])},n(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.NetworkGame=void 0;var i=o(434),a=o(607),s=o(998),c=o(664),l=o(771),u=o(721),p=function(e){function t(t){var o=e.call(this,t)||this;return o.socketMessage=function(e){e.opponentName&&o.socket&&o.playerNames&&(o.socket.getPlayerColor()===i.Dot.Red?o.playerNames.setPlayerGreen(e.opponentName):o.socket.getPlayerColor()===i.Dot.Green&&o.playerNames.setPlayerRed(e.opponentName),o.timer&&o.timer.setRunnable(!0)),e.color&&o.socket&&o.playerNames&&(e.color===i.Dot.Red?o.playerNames.setPlayerRed(o.socket.getPlayerName()):e.color===i.Dot.Green&&o.playerNames.setPlayerGreen(o.socket.getPlayerName())),e.win&&o.closeGameAfterWinning(),isNaN(e.column)||"mousemove"!==e.action||o.moveDot(e.column),isNaN(e.column)||"click"!==e.action||o.landDot(e.column),e.skipTurn&&e.currentTurn!==o.socket.getPlayerColor()&&o.switchTurn()},o.canvasMousemove=function(e){if(o.socket&&o.turn===o.socket.getPlayerColor()&&(!o.playerNames||o.playerNames.bothPlayersConnected())){var t=o.getColumnFromCursorPosition(e);o.moveDot(t);var n={action:"mousemove",column:t};o.socket.send(n),o.endGameDueToInactivity=!1}},o.canvasClick=function(e){if(o.socket&&o.turn===o.socket.getPlayerColor()&&(!o.playerNames||o.playerNames.bothPlayersConnected())){var t=o.getColumnFromCursorPosition(e),n={action:"click",column:t};o.socket.send(n),o.skipTurn=!1,o.landDot(t)}},o.beforeUnload=function(e){e.preventDefault(),e.returnValue=""},o.turnCountDownCallback=function(){o.turnCountDown--,o.turnCountDown<=0&&o.socket&&(o.endGameDueToInactivity,o.skipTurn&&(o.switchTurn(),o.socket.send({skipTurn:o.skipTurn,currentTurn:o.turn})))},o.mode=a.GameMode.Network,o}return r(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.defineSocket(),e.prototype.start.call(this)},t.prototype.defineSocket=function(){this.socket=new l.Socket,this.socket.onMessageCallback=this.socketMessage},t.prototype.resetValues=function(){e.prototype.resetValues.call(this),this.socket&&this.socket.close()},t.prototype.exit=function(){confirm("Network game in progress. Are you sure you want to quit?")&&(this.socket&&this.socket.close(),e.prototype.exit.call(this))},t.prototype.winDialog=function(e){var t=e+" wins!";this.timer&&(t+="\nTime taken: "+this.timer.getTimeInStringFormat()),t+="\n",this.socket&&this.socket.getPlayerColor()===this.turn?(t+="You win!",u.Utils.playSound(s.Sound.Win)):(t+="You lose!",u.Utils.playSound(s.Sound.Lose)),alert(t)},t.prototype.switchTurn=function(){e.prototype.switchTurn.call(this),this.socket&&this.turn===this.socket.getPlayerColor()?(this.skipTurn=!0,this.endGameDueToInactivity=!0,this.turnCountDown=60,this.turnCountDownInterval=setInterval(this.turnCountDownCallback,1e3)):clearInterval(this.turnCountDownInterval)},t}(c.Game);t.NetworkGame=p},698:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PlayerNameSection=void 0;var n=o(434),r=o(607),i=function(){function e(e,t){e&&(this.playerRedSpan=document.getElementById(e)),t&&(this.playerGreenSpan=document.getElementById(t))}return e.prototype.setUpPlayerNames=function(){localStorage.getItem("playerRed")&&localStorage.getItem("playerGreen")||(this.playerRed=prompt("Please enter name for Red Player!"),this.playerGreen=prompt("Please enter name for Green Player!"))},e.prototype.printPlayerNames=function(e){var t="Waiting to connect...";this.playerGreenSpan&&(e!==r.GameMode.Network||this.playerGreen?this.playerGreenSpan.innerText=this.playerGreen:this.playerGreenSpan.innerText=t),this.playerRedSpan&&(e!==r.GameMode.Network||this.playerRed?this.playerRedSpan.innerText=this.playerRed:this.playerRedSpan.innerText=t)},e.prototype.clear=function(){this.playerGreenSpan&&(this.playerGreenSpan.innerText=""),this.playerRedSpan&&(this.playerRedSpan.innerText="")},e.prototype.reset=function(){this.playerRed=null,this.playerGreen=null},e.prototype.getPlayerRed=function(){return this.playerRed},e.prototype.getPlayerGreen=function(){return this.playerGreen},e.prototype.bothPlayersConnected=function(){return!!this.playerRed&&!!this.playerGreen},e.prototype.saveIntoLocalStorage=function(){localStorage.setItem("playerRed",this.playerRed),localStorage.setItem("playerGreen",this.playerGreen)},e.prototype.setFromLocalStorage=function(){this.playerRed=localStorage.getItem("playerRed"),this.playerGreen=localStorage.getItem("playerGreen")},e.prototype.setPlayerRed=function(e){this.playerRed=e,this.playerRedSpan&&(this.playerRedSpan.innerText=this.playerRed)},e.prototype.setPlayerGreen=function(e){this.playerGreen=e,this.playerGreenSpan&&(this.playerGreenSpan.innerText=this.playerGreen)},e.prototype.indicateTurn=function(e){e===n.Dot.Red?(this.playerRedSpan.classList.add("currentTurn"),this.playerGreenSpan.classList.remove("currentTurn")):e===n.Dot.Green&&(this.playerGreenSpan.classList.add("currentTurn"),this.playerRedSpan.classList.remove("currentTurn"))},e}();t.PlayerNameSection=i},42:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Position=void 0;var o=function(){function e(e,t){this.x=e,this.y=t}return e.getCursorPosition=function(t,o){var n,r;return void 0!==t.pageX||void 0!==t.pageY?(n=t.pageX,r=t.pageY):(n=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,r=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),new e(n-=o.offsetLeft,r-=o.offsetTop)},e}();t.Position=o},952:function(e,t,o){var n,r=this&&this.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])},n(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.SameDeviceGame=void 0;var i=o(434),a=o(607),s=function(e){function t(t){var o=e.call(this,t)||this;return o.canvasMousemove=function(e){var t=o.getColumnFromCursorPosition(e);o.moveDot(t)},o.canvasClick=function(e){var t=o.getColumnFromCursorPosition(e);o.landDot(t)},o.beforeUnload=function(e){o.saveGame()},o.pageVisibilityChange=function(){o.timer&&o.timer.pauseWhenDocumentHidden()},o.mode=a.GameMode.SamePC,o}return r(t,e),t.getInstance=function(e){return t.instance||(t.instance=new t(e)),t.instance},t.prototype.start=function(){this.checkGameData(),this.playerNames&&this.playerNames.setUpPlayerNames(),this.timer&&this.timer.setRunnable(!0),e.prototype.start.call(this)},t.prototype.checkGameData=function(){var e=localStorage.getItem("board"),t=localStorage.getItem("nextTurn");e&&t&&(confirm("Do you want to continue playing the previous game? OK/Cancel")?this.restoreLastGame():localStorage.clear())},t.prototype.restoreLastGame=function(){var e=localStorage.getItem("nextTurn");e===i.Dot.Red?this.turn=i.Dot.Red:e===i.Dot.Green&&(this.turn=i.Dot.Green),this.board=JSON.parse(localStorage.getItem("board")),this.timer&&this.timer.setSecondsRunningFromLocalStorage(),this.playerNames&&this.playerNames.setFromLocalStorage()},t.prototype.saveGame=function(){localStorage.setItem("nextTurn",this.turn.toString()),localStorage.setItem("board",JSON.stringify(this.board)),this.playerNames&&this.playerNames.saveIntoLocalStorage(),this.timer&&this.timer.saveSecondsRunningToLocalStorage()},t.prototype.exit=function(){this.saveGame(),e.prototype.exit.call(this)},t.prototype.closeGameAfterWinning=function(){localStorage.clear(),e.prototype.closeGameAfterWinning.call(this)},t.prototype.setGameEvents=function(){e.prototype.setGameEvents.call(this),document.addEventListener("visibilitychange",this.pageVisibilityChange)},t.prototype.cleanUpEvents=function(){e.prototype.cleanUpEvents.call(this),document.removeEventListener("changevisibility",this.pageVisibilityChange)},t}(o(664).Game);t.SameDeviceGame=s},771:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Socket=void 0;var n=o(721),r=function(){function e(){var e=this;this.onMessage=function(t){var o=JSON.parse(t.data);if(e.gameId||isNaN(o.gameId)||(e.gameId=o.gameId),!e.playerColor&&o.color){e.playerColor=o.color,e.playerName=prompt("You are "+e.playerColor+". Please enter your name.");var n={name:e.playerName};e.send(n)}e.onMessageCallback&&e.onMessageCallback(o)},this.onError=function(){alert("Problem connecting to server!")},this.onClose=function(){e.connect()},this.connect()}return e.prototype.connect=function(){var e;e=n.Utils.isLocal()?"ws://localhost:3000/":"wss://daniels-connect4-server.adaptable.app/",this.playerColor&&!isNaN(this.gameId)&&(e+="?playerColor="+this.playerColor+"&gameId="+this.gameId+"&playerName="+this.playerName),this.webSocket=new WebSocket(e),this.webSocket.onmessage=this.onMessage,this.webSocket.onerror=this.onError,this.webSocket.onclose=this.onClose},e.prototype.send=function(e){this.webSocket.send(JSON.stringify(e))},e.prototype.close=function(){this.webSocket.onclose=null,this.webSocket.onmessage=null,this.webSocket.onerror=null,this.webSocket.close()},e.prototype.getPlayerColor=function(){return this.playerColor},e.prototype.getPlayerName=function(){return this.playerName},e}();t.Socket=r},656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Timer=void 0;var o=function(){function e(e){var t=this;this.timerCallback=function(){if(t.runnable){t.secondsRunning++;var e=Math.floor(t.secondsRunning/60),o=t.secondsRunning%60;t.timerSpan.innerText=e+":"+(o<10?"0":"")+o}t.timerSpan.classList.contains("hide")?clearTimeout(t.timeout):t.timeout=setTimeout(t.timerCallback,1e3)},this.timerSpan=document.getElementById(e),this.secondsRunning=0}return e.prototype.set=function(){this.timerSpan&&(this.timerSpan.classList.remove("hide"),this.timerCallback())},e.prototype.stop=function(){this.timeout&&(clearTimeout(this.timeout),this.timerSpan.innerText="",this.timerSpan.classList.add("hide"))},e.prototype.pauseWhenDocumentHidden=function(){document.hidden?clearTimeout(this.timeout):this.timeout=setTimeout(this.timerCallback,1e3)},e.prototype.getTimeInStringFormat=function(){return this.timerSpan?this.timerSpan.innerText:""},e.prototype.saveSecondsRunningToLocalStorage=function(){localStorage.setItem("secondsRunning",this.secondsRunning.toString())},e.prototype.setSecondsRunningFromLocalStorage=function(){this.secondsRunning=parseInt(localStorage.getItem("secondsRunning"))},e.prototype.reset=function(){this.secondsRunning=0,this.runnable=!1},e.prototype.setRunnable=function(e){this.runnable=e},e}();t.Timer=o},721:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=void 0;var o=function(){function e(){}return e.isLocal=function(){return"file:"===location.protocol||"localhost"===location.hostname},e.playSound=function(e){new Audio(e).play()},e}();t.Utils=o}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,o),i.exports}(()=>{var e,t=o(607),n=o(547),r=o(952),i=document.getElementById("menu"),a=document.getElementById("samePC"),s=document.getElementById("sockets"),c=document.getElementById("credits"),l=document.getElementById("exitBtn"),u=document.getElementById("board");function p(o){var a;(a=document.getElementById("errorMessage"))&&a.classList.add("hide");try{var s={canvasId:"board",exitBtnId:"exitBtn",timerId:"timer",playerRedId:"playerRed",playerGreenId:"playerGreen"};(e=o===t.GameMode.Network?n.NetworkGame.getInstance(s):r.SameDeviceGame.getInstance(s)).onGameEnd=function(){i.classList.remove("hide"),u.classList.add("hide"),l.classList.add("hide")},t.GameMode.Network,e.start(),i.classList.add("hide"),u.classList.remove("hide"),l.classList.remove("hide")}catch(e){!function(e){var t=document.getElementById("errorMessage");t&&(t.classList.remove("hide"),t.innerText="Problem encountered!")}()}}a.addEventListener("click",(function(){p(t.GameMode.SamePC)}),!1),s.addEventListener("click",(function(){p(t.GameMode.Network)}),!1),c.addEventListener("click",(function(){open("contributors.html")}),!1),l.addEventListener("click",(function(){n.NetworkGame,e.exit()}),!1)})()})();
//# sourceMappingURL=bundle.js.map