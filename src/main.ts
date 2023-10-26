import Authentication from "./lib/authentication";
import Dialog from "./lib/dialog/dialog";
import { DialogIds } from "./lib/enums/dialog-ids";
import { GameMode } from "./lib/enums/game-mode";
import GameOptions from "./lib/game-options";
import NetworkGame from "./lib/network-game";
import SameDeviceGame from "./lib/same-device-game";
import openCredits from "./lib/credits";
import showInstructions from "./lib/instructions";
import openSettings from "./lib/settings-dialog";
import openChangelog from "./lib/changelog";
import config from "./lib/config";

const samePCBtn = document.getElementById('samePC') as HTMLButtonElement;
const networkBtn = document.getElementById('network') as HTMLButtonElement;
const instructionsBtn = document.getElementById('instructions') as HTMLButtonElement;

samePCBtn.addEventListener('click', () => {
    initGame(GameMode.SamePC);
});

networkBtn.addEventListener('click', () => {
    initGame(GameMode.Network);
});

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
        Dialog.notify({
            id: DialogIds.ServerError,
            title: 'Error',
            text: ['Problem encountered!']
        });
        console.error(ex);
    }
}

instructionsBtn.addEventListener('click', showInstructions);

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

window.addEventListener('load', () => {
    Authentication.initGoogleSSO(async () => {
        showLoginLogout();
        await loadUserData();
    });
    Authentication.renderGoogleBtn('googleSignonContainer');
});

function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('logged-in') as HTMLDivElement;
    if (localStorage.getItem('auth')) {
        loginBtns.classList.add('hide');
        loggedInArea.classList.remove('hide');
    } else {
        loginBtns.classList.remove('hide');
        loggedInArea.classList.add('hide');
    }
}

async function loadUserData() {
    const user = await Authentication.getUserData();
    if (user) {
        const userName = document.getElementById('authPlayerName');
        userName.innerText = user.user;
        authPlayerPicture.src = user.picUrl;
    } else {
        Authentication.logout();
        showLoginLogout();
    }
}

const creditsBtn = document.getElementById('credits') as HTMLAnchorElement;
creditsBtn.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    openCredits();
});

const changelogLink = document.getElementById('changelog') as HTMLAnchorElement;
changelogLink.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    openChangelog();
});

const authPlayerPicture = document.getElementById('authPlayerPicture') as HTMLImageElement;
authPlayerPicture.addEventListener('click', () => {
    const userText = document.getElementById('authPlayerName');
    Dialog.menu({
        id: DialogIds.AccountMenu,
        title: userText.innerText,
        text: [],
        buttons: [
            {
                text: 'Load Stats',
                callback: async () => await Authentication.loadStats(),
                color: 'green'
            },
            {
                text: 'Settings',
                callback: openSettings,
                color: 'green'
            },
            {
                text: 'Logout',
                callback: () => {
                    const canvas = document.getElementById('board');
                    const countdown = document.getElementById('countdown');
                    if (canvas.classList.contains('hide') || countdown.classList.contains('hide')) {
                        Authentication.logout();
                        showLoginLogout();
                        Dialog.closeAllOpenDialogs();
                    } else {
                        Dialog.notify({
                            id: DialogIds.LogoutDisabled,
                            title: 'Logout Disabled',
                            text: ['You may not logout while Network Game is in progress.']
                        });
                    }
                },
                color: 'red'
            }
        ]
    });
});

(async () => {
    showLoginLogout();
    await loadUserData();

    changelogLink.innerText = config.version;
})();