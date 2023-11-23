import Authentication from "./lib/authentication";
import Dialog from "./lib/dialog/dialog";
import { DialogIds } from "./lib/enums/dialog-ids";
import { GameMode } from "./lib/enums/game-mode";
import GameOptions from "./lib/gameplay/game-options";
import NetworkGame from "./lib/gameplay/network-game";
import SameDeviceGame from "./lib/gameplay/same-device-game";
import openCredits from "./lib/screens/credits";
import showInstructions from "./lib/screens/instructions";
import openChangelog from "./lib/screens/changelog";
import config from "./lib/config";
import openUserMenu from "./lib/screens/user-menu";
import Utils from "./lib/utils";

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
            title: `Daniel's Connect4 ${config.version}`
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
    Authentication.initGoogleSSO(() => {
        showLoginLogout();
        loadUserData();
    });
    Authentication.renderGoogleBtn('googleSignonContainer');
});

function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('logged-in') as HTMLDivElement;
    if (localStorage.getItem('auth')) {
        loginBtns.classList.add('hidden');
        loggedInArea.classList.remove('hidden');
    } else {
        loginBtns.classList.remove('hidden');
        loggedInArea.classList.add('hidden');
    }
}

function loadUserData() {
    Utils.enableProgressCursor();
    Authentication.getUserData().then((user) => {
        const userName = document.getElementById('authPlayerName');
        userName.innerText = user.user;
        authPlayerPicture.src = user.picUrl;
    }).catch(() => {
        Authentication.logout();
        showLoginLogout();
    }).finally(() => {
        Utils.disableProgressCursor();
    });
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
    openUserMenu(userText.innerText, showLoginLogout);
});

const applySystemTheme = (isDark: boolean) => isDark ?
        document.documentElement.classList.add('dark') :
        document.documentElement.classList.remove('dark');

const darkSystemTheme = window.matchMedia('(prefers-color-scheme: dark)');
darkSystemTheme.addEventListener('change', ({ matches }) => applySystemTheme(matches));

(() => {
    showLoginLogout();
    loadUserData();
    applySystemTheme(darkSystemTheme.matches);

    changelogLink.innerText = config.version;
    document.title = `Daniel's Connect4 ${config.version}`;
})();