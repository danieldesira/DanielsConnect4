import { BoardDimensions, PlayerInfo, PlayerSettings, PlayerStats } from "@danieldesira/daniels-connect4-common";
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

export function logout() {
    localStorage.removeItem('auth');
    showLoginLogout();
}

export function getToken(): AuthenticationModel | null {
    const val = localStorage.getItem('auth');
    return val ? JSON.parse(val) as AuthenticationModel : null;
}

async function loadUserData() {
    const response = await authGet(`${config.httpServer}/auth`);
    if (response) {
        const data = await response.json() as PlayerInfo;
        const userName = document.getElementById('authPlayerName') as HTMLButtonElement;
        userName.innerText = data.user;
        const authPlayerPicture = document.getElementById('authPlayerPicture') as HTMLImageElement;
        authPlayerPicture.src = data.picUrl;
    } else {
        logout();
    }
}

export async function loadStats() {
    const stats = await authGet(`${config.httpServer}/stats`) as PlayerStats;
    if (stats) {
        Dialog.notify({
            id: DialogIds.PlayerStats,
            title: 'Stats',
            text: [
                    `Wins: ${stats.wins} - ${stats.winPercent.toFixed(2)}%`,
                    `Losses: ${stats.losses} - ${stats.lossPercent.toFixed(2)}%`
                ]
        });
    }
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
    const response = await fetch(`${config.httpServer}/settings`, {
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

export async function getSettings(): Promise<PlayerSettings> {
    return await authGet(`${config.httpServer}/settings`);
}

async function authGet(url: string): Promise<any> {
    const auth = getToken();
    const res = await fetch(url, {
        headers: {
            'Authorization': auth.token,
            'Service': auth.service
        }
    });
    const data = (res.status === 200 ? await res.json() : null);
    return data;
}