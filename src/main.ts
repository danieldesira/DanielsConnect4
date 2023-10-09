import { BoardDimensions } from "@danieldesira/daniels-connect4-common";
import { getSettings, getUserData, initGoogleSSO, loadStats, logout, updateSettings } from "./lib/authentication";
import Dialog from "./lib/dialog/dialog";
import { DialogIds } from "./lib/enums/dialog-ids";
import { GameMode } from "./lib/enums/game-mode";
import GameOptions from "./lib/game-options";
import NetworkGame from "./lib/network-game";
import SameDeviceGame from "./lib/same-device-game";
import dimensionsSelect from "./lib/dimensions-select";
import openCredits from "./lib/credits";

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
    try {
        const options: GameOptions = {
            canvasId: 'board',
            exitBtnId: 'exitBtn',
            timerId: 'timer',
            countdownId: 'countdown',
            playerRedId: 'playerRed',
            playerGreenId: 'playerGreen',
            menuId: 'menu',
            gameIndicatorsId: 'gameIndicators',
            logoutBtnId: 'logout'
        };
        if (mode === GameMode.Network) {
            const connect4 = NetworkGame.getInstance(options);
            connect4.start();
        } else {
            const connect4 = SameDeviceGame.getInstance(options);
            connect4.start();
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
googleSignonBtn.addEventListener('click', () => {
    initGoogleSSO(showLoginLogout);
});

showLoginLogout();

const logoutBtn = document.getElementById('logout') as HTMLButtonElement;
logoutBtn.addEventListener('click', () => {
    logout();
    showLoginLogout();
});

const statsBtn = document.getElementById('stats') as HTMLButtonElement;
statsBtn.addEventListener('click', async () => {
    await loadStats();
});

const settingsBtn = document.getElementById('settings') as HTMLButtonElement;
settingsBtn.addEventListener('click', async () => {
    dimensionsSelect.onChange = null;
    const settings = await getSettings();
    dimensionsSelect.default = settings.dimensions;
    Dialog.prompt({
        id: DialogIds.Settings,
        title: 'Settings',
        text: [],
        inputs: [],
        selects: [dimensionsSelect],
        onOK: async () => {
            const dimensionsSelect = document.getElementById('dialog-select-dimensions') as HTMLSelectElement;
            const dimensions = parseInt(dimensionsSelect.value) as BoardDimensions;
            await updateSettings(dimensions);
        },
        onCancel: null
    });
});

async function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('slidebar') as HTMLDivElement;
    if (localStorage.getItem('auth')) {
        loginBtns.classList.add('hide');
        loggedInArea.classList.remove('hide');
        await loadUserData();
    } else {
        loginBtns.classList.remove('hide');
        loggedInArea.classList.add('hide');
    }
}

async function loadUserData() {
    const user = await getUserData();
    if (user) {
        const userName = document.getElementById('authPlayerName') as HTMLButtonElement;
        userName.innerText = user.user;
        const authPlayerPicture = document.getElementById('authPlayerPicture') as HTMLImageElement;
        authPlayerPicture.src = user.picUrl;
    } else {
        logout();
        showLoginLogout();
    }
}

const creditsBtn = document.getElementById('credits') as HTMLButtonElement;
creditsBtn.addEventListener('click', openCredits);