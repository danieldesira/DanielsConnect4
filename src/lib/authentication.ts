import config from "./config";
import { AuthenticationModel } from "./models/authentication-model";

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
    sessionStorage.setItem('auth', JSON.stringify(data));
}

export async function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('slidebar') as HTMLDivElement;
    if (sessionStorage.getItem('auth')) {
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
    sessionStorage.removeItem('auth');
    showLoginLogout();
}

export function getToken(): AuthenticationModel | null {
    const val = sessionStorage.getItem('auth');
    return val ? JSON.parse(val) as AuthenticationModel : null;
}

async function loadUserData() {
    const auth = getToken();
    const response = await fetch(`${config.httpServer}/auth?token=${auth.token}&service=${auth.service}`);
    const data = await response.json();
    const userName = document.getElementById('authPlayerName') as HTMLButtonElement;
    userName.innerText = data.user;
    const authPlayerPicture = document.getElementById('authPlayerPicture') as HTMLImageElement;
    authPlayerPicture.src = data.picUrl;
}

export async function loadStats() {
    const auth = getToken();
    const response = await fetch(`${config.httpServer}/stats?token=${auth.token}&service=${auth.service}`);
    const data = await response.json();
    const statsContainer = document.getElementById('statsContainer') as HTMLDivElement;
    statsContainer.innerText = `Wins: ${data.wins} - ${data.winPercent.toFixed(2)}%\nLosses: ${data.losses} - ${data.lossPercent.toFixed(2)}%`;
}