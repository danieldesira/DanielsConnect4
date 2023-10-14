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
}

function storeGoogleToken(token: string) {
    const data = {
        token,
        service: 'google'
    } as AuthenticationModel;
    localStorage.setItem('auth', JSON.stringify(data));
}

export function logout() {
    localStorage.removeItem('auth');
}

export function getToken(): AuthenticationModel | null {
    const val = localStorage.getItem('auth');
    return val ? JSON.parse(val) as AuthenticationModel : null;
}

export async function getUserData() {
    return await authGet(`${config.httpServer}/auth`) as PlayerInfo;
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

export function initGoogleSSO(showLoginLogout: Function) {
    window.google.accounts.id.initialize({
        client_id: '966331594657-sjtp3m7ooigjma726j7aa4kcf5qdu2v7.apps.googleusercontent.com',
        callback: (response: any) => {
            handleGoogleSignon(response);
            showLoginLogout();
        }
    });
    window.google.accounts.id.prompt();
}

export async function updateSettings(dimensions: BoardDimensions) {
    try {
        const params = {
            dimensions
        };
        await authPost(`${config.httpServer}/settings`, params);
    } catch {
        Dialog.notify({
            title: 'Settings',
            text: ['Error saving settings!'],
            id: DialogIds.ServerError
        });
    }
}

export async function getSettings(): Promise<PlayerSettings> {
    return await authGet(`${config.httpServer}/settings`);
}

async function authGet(url: string): Promise<any> {
    const auth = getToken();
    if (auth) {
        const {token, service} = auth;
        const res = await fetch(url, {
            headers: {
                'Authorization': token,
                'Service': service
            }
        });
        const data = (res.status >= 200 && res.status < 300 ? await res.json() : null);
        return data;
    } else {
        return null;
    }
}

async function authPost(url: string, data: any) {
    const {token, service} = getToken();
    const res = await fetch(url, {
        method: 'post',
        headers: {
            'Authorization': token,
            'Service': service,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (res.status < 200 || res.status >= 300) {
        throw `HTTP Status Code ${res.status}`;
    }
}