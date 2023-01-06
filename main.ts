let menu = document.getElementById('menu');
let samePCBtn = document.getElementById('samePC');

let canvas = document.getElementById('board');

samePCBtn.addEventListener('click', () => {
    let connect4: Game = new Game('board');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = () => {
        menu.style.display = 'block';
        canvas.style.display = 'none';
    };
    connect4.start();

    menu.style.display = 'none';
    canvas.style.display = 'block';
}, false);