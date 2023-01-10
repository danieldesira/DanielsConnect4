var connect4;
var menu = document.getElementById('menu');
var samePCBtn = document.getElementById('samePC');
var exitBtn = document.getElementById('exitBtn');
var canvas = document.getElementById('board');
samePCBtn.addEventListener('click', function () {
    connect4 = new Game('board', 'exitBtn', 'timer');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = function () {
        menu.classList.remove('hide');
        canvas.classList.add('hide');
        exitBtn.classList.add('hide');
    };
    connect4.start();
    menu.classList.add('hide');
    canvas.classList.remove('hide');
    exitBtn.classList.remove('hide');
}, false);
exitBtn.addEventListener('click', function () {
    connect4.exit();
}, false);
