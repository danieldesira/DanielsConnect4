let connect4: Game;

let menu = document.getElementById('menu');
let samePCBtn = document.getElementById('samePC');

let exitBtn = document.getElementById('exitBtn');

let canvas = document.getElementById('board');

samePCBtn.addEventListener('click', () => {
    connect4 = new Game('board');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = () => {
        menu.style.display = 'block';
        canvas.style.display = 'none';
        exitBtn.style.display = 'none';
    };
    connect4.start();

    menu.style.display = 'none';
    canvas.style.display = 'block';
    exitBtn.style.display = 'block';
}, false);

exitBtn.addEventListener('click', () => {
    connect4.exit();
}, false);

// Hide Exit button by default
exitBtn.style.display = 'none';