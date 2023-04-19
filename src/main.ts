import { GameMode } from "./lib/enums/game-mode";
import { Game } from "./lib/game";
import { GameOptions } from "./lib/game-options";
import { NetworkGame } from "./lib/network-game";
import { SameDeviceGame } from "./lib/same-device-game";
import '../styles/style.css';

let connect4: Game;

let samePCBtn = document.getElementById('samePC') as HTMLButtonElement;
let networkBtn = document.getElementById('network') as HTMLButtonElement;
let creditsBtn = document.getElementById('credits') as HTMLButtonElement;

samePCBtn.addEventListener('click', () => {
    initGame(GameMode.SamePC);
}, false);

networkBtn.addEventListener('click', () => {
    initGame(GameMode.Network);
}, false);

creditsBtn.addEventListener('click', () => {
    open('contributors.html');
}, false);

function initGame(mode: GameMode) {
    clearError();

    try {
        let options: GameOptions = {
            canvasId: 'board',
            exitBtnId: 'exitBtn',
            timerId: 'timer',
            playerRedId: 'playerRed',
            playerGreenId: 'playerGreen',
            countdownId: 'countdown',
            menuId: 'menu',
            gameIndicatorsId: 'gameIndicators'
        };
        if (mode === GameMode.Network) {
            connect4 = NetworkGame.getInstance(options);
            (connect4 as NetworkGame).start();
        } else {
            connect4 = SameDeviceGame.getInstance(options);
            (connect4 as SameDeviceGame).start();
        }
    } catch (ex) {
        showError('Problem encountered!');
        // To-do: include logging
    }
}

function showError(message: string) {
    let errorMessageDiv = document.getElementById('errorMessage') as HTMLDivElement;
    if (errorMessageDiv) {
        errorMessageDiv.classList.remove('hide');
        errorMessageDiv.innerText = message;
    }
}

function clearError() {
    let errorMessageDiv = document.getElementById('errorMessage') as HTMLDivElement;
    if (errorMessageDiv) {
        errorMessageDiv.classList.add('hide');
    }
}