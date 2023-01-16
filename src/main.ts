import { Game } from "./game";
import { GameMode } from "./game-mode";

let connect4: Game;

let menu = document.getElementById('menu');
let samePCBtn = document.getElementById('samePC');
let socketsBtn = document.getElementById('sockets');
let creditsBtn = document.getElementById('credits');

let exitBtn = document.getElementById('exitBtn');

let canvas = document.getElementById('board');

samePCBtn.addEventListener('click', () => {
    connect4 = new Game('board', 'exitBtn', 'timer', 'playerRed', 'playerGreen');
    connect4.mode = GameMode.SAME_PC;
    connect4.onGameEnd = () => {
        menu.classList.remove('hide');
        canvas.classList.add('hide');
        exitBtn.classList.add('hide');
    };
    connect4.start();

    menu.classList.add('hide');
    canvas.classList.remove('hide');
    exitBtn.classList.remove('hide');
}, false);

socketsBtn.addEventListener('click', () => {
    
}, false);

creditsBtn.addEventListener('click', () => {
    open('contributors.html');
}, false);

exitBtn.addEventListener('click', () => {
    connect4.exit();
}, false);