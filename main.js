var connect4;
var menu = document.getElementById('menu');
var samePCBtn = document.getElementById('samePC');
var exitBtn = document.getElementById('exitBtn');
var canvas = document.getElementById('board');
samePCBtn.addEventListener('click', function () {
    connect4 = new Game('board');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = function () {
        menu.style.display = 'block';
        canvas.style.display = 'none';
        exitBtn.style.display = 'none';
    };
    connect4.start();
    menu.style.display = 'none';
    canvas.style.display = 'block';
    exitBtn.style.display = 'inline';
}, false);
exitBtn.addEventListener('click', function () {
    connect4.exit();
}, false);
// Hide Exit button by default
exitBtn.style.display = 'none';
