import { BoardDimensions, PlayerInfo, PlayerSettings, PlayerStats } from "@danieldesira/daniels-connect4-common";
import config from "./config";
import { AuthenticationModel } from "./models/authentication-model";
import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";
import Utils from "./utils";

declare global {
    interface Window {
        google: any;
    }
}

export default class Authentication {
    public static async handleGoogleSignon(response: any) {
        const {credential} = response;
        Authentication.storeGoogleToken(credential);
    }

    private static storeGoogleToken(token: string) {
        const data = {
            token,
            service: 'google'
        } as AuthenticationModel;
        localStorage.setItem('auth', JSON.stringify(data));
    }

    public static logout = () => localStorage.removeItem('auth');

    public static getToken(): AuthenticationModel | null {
        const val = localStorage.getItem('auth');
        return val ? JSON.parse(val) as AuthenticationModel : null;
    }

    public static getUserData = async () => await Authentication.authGet(`${config.connections.httpServer}/auth`) as PlayerInfo;

    public static async loadStats() {
        Utils.enableProgressCursor();
        const stats = await Authentication.authGet(`${config.connections.httpServer}/stats`) as PlayerStats;
        Utils.disableProgressCursor();
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

    public static initGoogleSSO(callback: Function) {
        window?.google?.accounts?.id?.initialize({
            client_id: '966331594657-sjtp3m7ooigjma726j7aa4kcf5qdu2v7.apps.googleusercontent.com',
            callback: (response: any) => {
                Authentication.handleGoogleSignon(response);
                callback();
            }
        });
        window?.google?.accounts?.id?.prompt();
    }

    public static renderGoogleBtn(containerId: string) {
        const container = document.getElementById(containerId);
        window?.google?.accounts?.id?.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large'
        });
    }

    public static async updateSettings(data: PlayerSettings) {
        try {
            Utils.enableProgressCursor();
            await Authentication.authPost(`${config.connections.httpServer}/settings`, data);
        } catch {
            Dialog.notify({
                title: 'Settings',
                text: ['Error saving settings!'],
                id: DialogIds.ServerError
            });
        } finally {
            Utils.disableProgressCursor();
        }
    }

    public static getSettings = async (): Promise<PlayerSettings> => await Authentication.authGet(`${config.connections.httpServer}/settings`);
    
    private static async authGet(url: string): Promise<any> {
        const auth = Authentication.getToken();
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

    private static async authPost(url: string, data: any) {
        const {token, service} = Authentication.getToken();
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

    public static isLoggedIn = (): boolean => !!localStorage.getItem('auth');
}