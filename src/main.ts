import { BoardDimensions } from "@danieldesira/daniels-connect4-common";
import { initGoogleSSO, loadStats, logout, showLoginLogout, updatePlayerDimensions } from "./lib/authentication";
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
    try {const dimensionsSelect = document.getElementById('dimensions') as HTMLSelectElement;
        const dimensions = parseInt(dimensionsSelect.options[dimensionsSelect.selectedIndex].value) as BoardDimensions;

        const options: GameOptions = {
            canvasId: 'board',
            exitBtnId: 'exitBtn',
            timerCountdownId: 'timer',
            playerRedId: 'playerRed',
            playerGreenId: 'playerGreen',
            menuId: 'menu',
            gameIndicatorsId: 'gameIndicators',
            logoutBtnId: 'logout'
        };
        if (mode === GameMode.Network) {
            const connect4 = NetworkGame.getInstance(options);
            connect4.start(dimensions);
        } else {
            const connect4 = SameDeviceGame.getInstance(options);
            connect4.start(dimensions);
        }
    } catch (ex) {
        Dialog.notify({
            id: DialogIds.ServerError,
            title: 'Error',
            text: ['Problem encountered!']
        });
        console.error(ex);
    }
}

instructionsBtn.addEventListener('click', () => {
    const text = [
        'The principle behind Connect4 is simple:',
        'The player who first places 4 coins next to each other, wins. You may ' +
            'match horizontally, vertically or diagonally.',
        'Furthermore, in Network Play, you must place your coin within 60 seconds. ' +
            'If you fail to do so, you pass the turn to your opponent.',
        'Further note that exiting in Same Device Play, saves game progress. You ' +
            'will be presented with the option to continue the same game the next ' +
            'time. This does not work for Network Play because your opponent might ' +
            'not be available the next time and you might not even know him/her/them.',
        'Good luck and have fun playing!'
    ];
    Dialog.notify({
        id: DialogIds.Instructions,
        text,
        title: 'Instructions'
    });
}, false);

const shareBtn = document.getElementById('shareBtn') as HTMLAnchorElement;
shareBtn.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    if (navigator.canShare) {
        const shareData = {
            url: location.href,
            title: `Daniel's Connect4`
        };
        navigator.share(shareData)
            .catch((err) => console.error(`Problem while sharing: ${err}`));
    } else {
        Dialog.notify({
            id: DialogIds.ServerError,
            title: 'Error',
            text: ['Problem opening share menu!']
        });
    }
});

const googleSignonBtn = document.getElementById('googleSignon') as HTMLButtonElement;
googleSignonBtn.addEventListener('click', initGoogleSSO);

(async () => {
    await showLoginLogout();
})();

const logoutBtn = document.getElementById('logout') as HTMLButtonElement;
logoutBtn.addEventListener('click', logout);

const statsBtn = document.getElementById('stats') as HTMLButtonElement;
statsBtn.addEventListener('click', async () => {
    await loadStats();
});

const settingsBtn = document.getElementById('settings') as HTMLButtonElement;
settingsBtn.addEventListener('click', () => {
    Dialog.prompt({
        id: DialogIds.Settings,
        title: 'Settings',
        text: ['Configure as desired'],
        inputs: [],
        selects: [{
            name: 'dimensions',
            label: 'Dimensions',
            required: true,
            options: [
                {
                    text: 'Small (6x5)',
                    value: BoardDimensions.Small.toString()
                },
                {
                    text: 'Medium (7x6)',
                    value: BoardDimensions.Medium.toString()
                },
                {
                    text: 'Large (9x8)',
                    value: BoardDimensions.Large.toString()
                }
            ],
            default: 3
        }],
        onOK: async () => {
            const dimensionsSelect = document.getElementById('dimensions') as HTMLSelectElement;
            const dimensions = parseInt(dimensionsSelect.value) as BoardDimensions;
            await updatePlayerDimensions(dimensions);
        },
        onCancel: null
    });
});