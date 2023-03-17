import { Game } from "./lib/game";
import { GameMode } from "./lib/enums/game-mode";

let connect4: Game;

let menu = document.getElementById('menu');
let samePCBtn = document.getElementById('samePC');
let socketsBtn = document.getElementById('sockets');
let creditsBtn = document.getElementById('credits');

let exitBtn = document.getElementById('exitBtn');

let canvas = document.getElementById('board');

samePCBtn.addEventListener('click', () => {
    initGame(GameMode.SamePC);
}, false);

socketsBtn.addEventListener('click', () => {
    initGame(GameMode.Network);
}, false);

creditsBtn.addEventListener('click', () => {
    open('contributors.html');
}, false);

exitBtn.addEventListener('click', () => {
    connect4.exit();
}, false);

function initGame(mode: GameMode) {
    connect4 = Game.getInstance({
        canvasId: 'board',
        exitBtnId: 'exitBtn',
        timerId: 'timer',
        playerRedId: 'playerRed',
        playerGreenId: 'playerGreen'
    });
    connect4.mode = mode;
    connect4.onGameEnd = () => {
        menu.classList.remove('hide');
        canvas.classList.add('hide');
        exitBtn.classList.add('hide');
    };
    connect4.start();

    menu.classList.add('hide');
    canvas.classList.remove('hide');
    exitBtn.classList.remove('hide');
}