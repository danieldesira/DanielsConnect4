import Dialog from "./lib/dialog/dialog";
import { DialogIds } from "./lib/enums/dialog-ids";
import { GameMode } from "./lib/enums/game-mode";
import GameOptions from "./lib/game-options";
import NetworkGame from "./lib/network-game";
import SameDeviceGame from "./lib/same-device-game";

const samePCBtn = document.getElementById('samePC') as HTMLButtonElement;
const networkBtn = document.getElementById('network') as HTMLButtonElement;
const instructionsBtn = document.getElementById('instructions') as HTMLButtonElement;

samePCBtn.addEventListener('click', () => {
    initGame(GameMode.SamePC);
}, false);

networkBtn.addEventListener('click', () => {
    initGame(GameMode.Network);
}, false);

function initGame(mode: GameMode) {
    clearError();

    try {
        const options: GameOptions = {
            canvasId: 'board',
            exitBtnId: 'exitBtn',
            timerCountdownId: 'timer',
            playerRedId: 'playerRed',
            playerGreenId: 'playerGreen',
            menuId: 'menu',
            gameIndicatorsId: 'gameIndicators'
        };
        if (mode === GameMode.Network) {
            const connect4 = NetworkGame.getInstance(options);
            connect4.start();
        } else {
            const connect4 = SameDeviceGame.getInstance(options);
            connect4.start();
        }
    } catch (ex) {
        showError('Problem encountered!');
        // To-do: include logging
    }
}

function showError(message: string) {
    const errorMessageDiv = document.getElementById('errorMessage') as HTMLDivElement;
    if (errorMessageDiv) {
        errorMessageDiv.classList.remove('hide');
        errorMessageDiv.innerText = message;
    }
}

function clearError() {
    const errorMessageDiv = document.getElementById('errorMessage') as HTMLDivElement;
    if (errorMessageDiv) {
        errorMessageDiv.classList.add('hide');
    }
}

instructionsBtn.addEventListener('click', () => {
    const text = [
        'The principle behind Connect4 is simple:',
        `The player who first places 4 coins next to each other, wins. These may be 
            horizontal, vertical or diagonal.`,
        `Furthermore, in network play, you must place your coin within 60 seconds.
            If you fail to do so, you pass the turn to your opponent.`,
        'Good luck and have fun playing!'
    ];
    Dialog.notify(DialogIds.Instructions, text);
}, false);