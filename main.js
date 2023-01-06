var menu = document.getElementById('menu');
var samePCBtn = document.getElementById('samePC');
var canvas = document.getElementById('board');
samePCBtn.addEventListener('click', function () {
    var connect4 = new Game('board');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = function () {
        menu.style.display = 'block';
        canvas.style.display = 'none';
    };
    connect4.start();
    menu.style.display = 'none';
    canvas.style.display = 'block';
}, false);
