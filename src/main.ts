import { GameMode } from "./lib/enums/game-mode";
import { Game } from "./lib/game";
import { GameOptions } from "./lib/game-options";
import { NetworkGame } from "./lib/network-game";
import { SameDeviceGame } from "./lib/same-device-game";

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
    if (connect4 instanceof NetworkGame) {
        (connect4 as NetworkGame).exit();
    } else {
        (connect4 as SameDeviceGame).exit();
    }
}, false);

function initGame(mode: GameMode) {
    let options: GameOptions = {
        canvasId: 'board',
        exitBtnId: 'exitBtn',
        timerId: 'timer',
        playerRedId: 'playerRed',
        playerGreenId: 'playerGreen'
    };
    if (mode === GameMode.Network) {
        connect4 = NetworkGame.getInstance(options);
    } else {
        connect4 = SameDeviceGame.getInstance(options);
    }
    connect4.onGameEnd = () => {
        menu.classList.remove('hide');
        canvas.classList.add('hide');
        exitBtn.classList.add('hide');
    };
    if (mode === GameMode.Network) {
        (connect4 as NetworkGame).start();
    } else {
        (connect4 as SameDeviceGame).start();
    }

    menu.classList.add('hide');
    canvas.classList.remove('hide');
    exitBtn.classList.remove('hide');
}