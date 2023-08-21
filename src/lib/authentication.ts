import { BoardDimensions, PlayerInfo, PlayerStats } from "@danieldesira/daniels-connect4-common";
import config from "./config";
import { AuthenticationModel } from "./models/authentication-model";
import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

declare global {
    interface Window {
        google: any;
    }
}

export async function handleGoogleSignon(response: any) {
    const {credential} = response;
    storeGoogleToken(credential);
    await showLoginLogout();
}

function storeGoogleToken(token: string) {
    const data = {
        token,
        service: 'google'
    } as AuthenticationModel;
    localStorage.setItem('auth', JSON.stringify(data));
}

export async function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('authPlayerArea') as HTMLDivElement;
    if (localStorage.getItem('auth')) {
        loginBtns.classList.add('hide');
        loggedInArea.classList.remove('hide');
        await loadUserData();
    } else {
        loginBtns.classList.remove('hide');
        loggedInArea.classList.add('hide');
        const statsContainer = document.getElementById('statsContainer') as HTMLDivElement;
        statsContainer.innerText = '';
    }
}

export function logout() {
    localStorage.removeItem('auth');
    showLoginLogout();
}

export function getToken(): AuthenticationModel | null {
    const val = localStorage.getItem('auth');
    return val ? JSON.parse(val) as AuthenticationModel : null;
}

async function loadUserData() {
    const auth = getToken();
    const response = await fetch(`${config.httpServer}/auth?token=${auth.token}&service=${auth.service}`);
    const data = await response.json() as PlayerInfo;
    if (data.isTokenValid) {
        const userName = document.getElementById('authPlayerName') as HTMLButtonElement;
        userName.innerText = data.user;
        const authPlayerPicture = document.getElementById('authPlayerPicture') as HTMLImageElement;
        authPlayerPicture.src = data.picUrl;
        const dimensionOption = document.querySelector(`#dimensions option[value='${data.dimensions}']`) as HTMLOptionElement;
        dimensionOption.ariaSelected = 'true';
        dimensionOption.selected = true;
    } else {
        logout();
    }
}

export async function loadStats() {
    const auth = getToken();
    const response = await fetch(`${config.httpServer}/stats?token=${auth.token}&service=${auth.service}`);
    const data = await response.json() as PlayerStats;
    const statsContainer = document.getElementById('statsContainer') as HTMLDivElement;
    statsContainer.innerText = `Wins: ${data.wins} - ${data.winPercent.toFixed(2)}%\nLosses: ${data.losses} - ${data.lossPercent.toFixed(2)}%`;
}

export function initGoogleSSO() {
    window.google.accounts.id.initialize({
        client_id: '966331594657-sjtp3m7ooigjma726j7aa4kcf5qdu2v7.apps.googleusercontent.com',
        callback: handleGoogleSignon
    });
    window.google.accounts.id.prompt();
}

export async function updatePlayerDimensions(dimensions: BoardDimensions) {
    const {token, service} = getToken();
    const params = {
        token,
        service,
        dimensions
    };
    const response = await fetch(`${config.httpServer}/update-dimensions`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    if (response.status === 200) {
        Dialog.notify({
            title: 'Dimensions',
            text: ['Dimensions updated successfully!'],
            id: DialogIds.Saved
        });
    }
}