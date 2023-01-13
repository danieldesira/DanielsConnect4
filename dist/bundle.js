(()=>{"use strict";var e,t,n,o,a,r,i,s={150:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Dot=void 0,(n=t.Dot||(t.Dot={}))[n.EMPTY=0]="EMPTY",n[n.RED=1]="RED",n[n.GREEN=2]="GREEN"},533:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.GameMode=void 0,(n=t.GameMode||(t.GameMode={}))[n.SAME_PC=1]="SAME_PC"},769:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;var o=n(533),a=n(150),r=function(){function e(t,n,o,r,i){void 0===n&&(n=null),void 0===o&&(o=null),void 0===r&&(r=null),void 0===i&&(i=null);var s=this;this.board=new Array(e.columns),this.turn=a.Dot.RED,this.moveDot=function(e){s.clearUpper();var t=s.getCursorPosition(e),n=Math.round(t.x-50)/s.colGap;s.turn==a.Dot.RED?s.context.fillStyle="red":s.turn==a.Dot.GREEN&&(s.context.fillStyle="greenyellow"),s.context.beginPath(),s.context.arc(50+n*s.colGap,s.rowGap-s.circleRadius,s.circleRadius,0,2*Math.PI),s.context.closePath(),s.context.fill()},this.landDot=function(t){var n,o=s.getCursorPosition(t),r=Math.round((o.x-50)/s.colGap);if(s.board[r][0]===a.Dot.EMPTY){for(var i=e.rows-1;i>-1;i--)if(0===s.board[r][i]){s.board[r][i]=s.turn,n=i;break}if(s.turn===a.Dot.RED?s.context.fillStyle="red":s.turn===a.Dot.GREEN&&(s.context.fillStyle="greenyellow"),s.context.beginPath(),s.context.arc(50+r*s.colGap,150+i*s.rowGap,s.circleRadius,0,2*Math.PI),s.context.closePath(),s.context.fill(),s.checkDotCount(r,n)>3){var l="";s.turn===a.Dot.RED?l=s.playerRed+" (Red)":s.turn===a.Dot.GREEN&&(l=s.playerGreen+" (Green)"),s.exitBtn&&s.exitBtn.classList.add("hide");var c=l+" wins!";s.timerSpan&&(c+="\nTime taken: "+s.timerSpan.innerText),alert(c),localStorage.clear(),s.cleanUpEvents(),s.stopTimer(),s.clearPlayerNames(),void 0!==s.onGameEnd&&null!==s.onGameEnd&&setTimeout(s.onGameEnd,3e3)}s.turn===a.Dot.RED?s.turn=a.Dot.GREEN:s.turn===a.Dot.GREEN&&(s.turn=a.Dot.RED)}},this.beforeUnload=function(){s.saveGame()},this.timerCallback=function(){s.secondsRunning++;var e=Math.floor(s.secondsRunning/60),t=s.secondsRunning%60;s.timerSpan.innerText=e+":"+(t<10?"0":"")+t},this.resizeCanvas=function(){s.canvas.height=window.innerHeight-100,s.canvas.width=window.innerWidth,s.canvas.height>s.canvas.width?(s.circleRadius=Math.max(s.canvas.width/e.columns-65,10),s.colGap=65,s.rowGap=s.canvas.height/e.rows+s.circleRadius):(s.circleRadius=Math.max(s.canvas.height/e.rows-65,10),s.colGap=s.canvas.width/e.columns+s.circleRadius,s.rowGap=65),s.paintBoard()},this.canvas=document.getElementById(t),this.context=this.canvas.getContext("2d");for(var l=0;l<e.columns;l++){this.board[l]=new Array(e.rows);for(var c=0;c<e.rows;c++)this.board[l][c]=a.Dot.EMPTY}null!==n&&(this.exitBtn=document.getElementById(n)),null!==o&&(this.timerSpan=document.getElementById(o),this.secondsRunning=0),null!==r&&(this.playerRedSpan=document.getElementById(r)),null!==i&&(this.playerGreenSpan=document.getElementById(i))}return e.prototype.start=function(){this.resizeCanvas(),this.checkGameData(),this.setUpPlayerNames(),this.setGameEvents(),this.setTimer()},e.prototype.checkGameData=function(){if(this.mode===o.GameMode.SAME_PC){var e=localStorage.getItem("board"),t=localStorage.getItem("nextTurn");e&&t&&(confirm("Do you want to continue playing the previous game? OK/Cancel")?this.restoreLastGame():localStorage.clear())}},e.prototype.setUpPlayerNames=function(){this.mode===o.GameMode.SAME_PC&&(localStorage.getItem("playerRed")&&localStorage.getItem("playerGreen")||(this.playerRed=prompt("Please enter name for Red Player!"),this.playerGreen=prompt("Please enter name for Green Player!"))),this.playerGreenSpan&&(this.playerGreenSpan.innerText=this.playerGreen),this.playerRedSpan&&(this.playerRedSpan.innerText=this.playerRed)},e.prototype.paintBoard=function(){var t=this.context.createLinearGradient(0,0,this.canvas.width,0);t.addColorStop(0,"blue"),t.addColorStop(1,"aqua"),this.context.fillStyle=t,this.context.fillRect(0,70,this.canvas.width,this.canvas.height);for(var n=e.columns-1;n>=0;n--)for(var o=e.rows-1;o>=0;o--)this.board[n][o]===a.Dot.RED?this.context.fillStyle="red":this.board[n][o]===a.Dot.GREEN?this.context.fillStyle="greenyellow":this.context.fillStyle="black",this.context.beginPath(),this.context.arc(50+n*this.colGap,150+o*this.rowGap,this.circleRadius,0,2*Math.PI),this.context.closePath(),this.context.fill()},e.prototype.getCursorPosition=function(e){var t,n;return void 0!==e.pageX||void 0!==e.pageY?(t=e.pageX,n=e.pageY):(t=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,n=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),t-=this.canvas.offsetLeft,n-=this.canvas.offsetTop,new i(t,n)},e.prototype.setGameEvents=function(){this.canvas.addEventListener("mousemove",this.moveDot,!1),this.canvas.addEventListener("click",this.landDot,!1),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("resize",this.resizeCanvas)},e.prototype.clearUpper=function(){this.context.clearRect(0,0,this.canvas.width,70)},e.prototype.checkDotCount=function(t,n){for(var o=n,a=0;a<4&&o<e.rows&&this.board[t][o]===this.turn;)a++,o++;if(a<4){for(a=0,o=t;o<e.columns&&this.board[o][n]===this.turn;)a++,o++;for(o=t-1;o>-1&&this.board[o][n]===this.turn;)a++,o--;if(a<4){a=0;for(var r=n-1,i=t+1;a<4&&r>-1&&i<e.columns&&this.board[i][r]===this.turn;)a++,i++,r--;for(i=t,r=n;a<4&&r<e.rows&&i>-1&&this.board[i][r]===this.turn;)a++,i--,r++;if(a<4){for(a=0,r=n-1,i=t-1;a<4&&r>-1&&i>-1&&this.board[i][r]===this.turn;)a++,i--,r--;for(i=t,r=n;a<4&&r<e.rows&&i<e.columns&&this.board[i][r]===this.turn;)a++,i++,r++}}}return a},e.prototype.cleanUpEvents=function(){this.canvas.removeEventListener("mousemove",this.moveDot,!1),this.canvas.removeEventListener("click",this.landDot,!1),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("resize",this.resizeCanvas)},e.prototype.saveGame=function(){localStorage.setItem("nextTurn",this.turn.toString()),localStorage.setItem("board",JSON.stringify(this.board)),localStorage.setItem("playerRed",this.playerRed),localStorage.setItem("playerGreen",this.playerGreen),localStorage.setItem("secondsRunning",this.secondsRunning.toString())},e.prototype.restoreLastGame=function(){this.turn=parseInt(localStorage.getItem("nextTurn")),this.playerRed=localStorage.getItem("playerRed"),this.playerGreen=localStorage.getItem("playerGreen"),this.board=JSON.parse(localStorage.getItem("board")),this.secondsRunning=parseInt(localStorage.getItem("secondsRunning"))},e.prototype.exit=function(){this.cleanUpEvents(),this.saveGame(),this.onGameEnd(),this.stopTimer(),this.clearPlayerNames()},e.prototype.setTimer=function(){this.timerSpan&&(this.timerCallback(),this.timerInterval=setInterval(this.timerCallback,1e3),this.timerSpan.classList.remove("hide"))},e.prototype.stopTimer=function(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerSpan.classList.add("hide"))},e.prototype.clearPlayerNames=function(){this.playerGreenSpan&&(this.playerGreenSpan.innerText=""),this.playerRedSpan&&(this.playerRedSpan.innerText="")},e.columns=9,e.rows=8,e}();t.Game=r;var i=function(e,t){this.x=e,this.y=t}}},l={};function c(e){var t=l[e];if(void 0!==t)return t.exports;var n=l[e]={exports:{}};return s[e](n,n.exports,c),n.exports}t=c(769),n=c(533),o=document.getElementById("menu"),a=document.getElementById("samePC"),r=document.getElementById("exitBtn"),i=document.getElementById("board"),a.addEventListener("click",(function(){(e=new t.Game("board","exitBtn","timer","playerRed","playerGreen")).mode=n.GameMode.SAME_PC,e.onGameEnd=function(){o.classList.remove("hide"),i.classList.add("hide"),r.classList.add("hide")},e.start(),o.classList.add("hide"),i.classList.remove("hide"),r.classList.remove("hide")}),!1),r.addEventListener("click",(function(){e.exit()}),!1)})();
//# sourceMappingURL=bundle.js.map