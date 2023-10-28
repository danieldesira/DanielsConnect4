import Authentication from "./lib/authentication";
import Dialog from "./lib/dialog/dialog";
import { DialogIds } from "./lib/enums/dialog-ids";
import { GameMode } from "./lib/enums/game-mode";
import GameOptions from "./lib/gameplay/game-options";
import NetworkGame from "./lib/gameplay/network-game";
import SameDeviceGame from "./lib/gameplay/same-device-game";
import openCredits from "./lib/screens/credits";
import showInstructions from "./lib/screens/instructions";
import openSettings from "./lib/screens/settings-dialog";
import openChangelog from "./lib/screens/changelog";
import config from "./lib/config";
import logout from "./lib/logout";

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
            title: `${config.title} ${config.version}`
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
        loginBtns.classList.add('hidden');
        loggedInArea.classList.remove('hidden');
    } else {
        loginBtns.classList.remove('hidden');
        loggedInArea.classList.add('hidden');
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
                callback: () => logout('board', 'countdown', showLoginLogout),
                color: 'red'
            }
        ]
    });
});

(async () => {
    showLoginLogout();
    await loadUserData();

    changelogLink.innerText = config.version;

    const heading = document.getElementById('heading');
    heading.innerText = config.title;
    document.title = `${config.title} ${config.version}`;
})();