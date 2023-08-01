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
    const loggedInArea = document.getElementById('logged-in-area') as HTMLDivElement;
    if (sessionStorage.getItem('auth')) {
        loginBtns.classList.add('hide');
        loggedInArea.classList.remove('hide');
        await loadUserName();
    } else {
        loginBtns.classList.remove('hide');
        loggedInArea.classList.add('hide');
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

async function loadUserName() {
    const auth = getToken();
    const response = await fetch(`${config.httpServer}/auth?token=${auth.token}&service=${auth.service}`);
    const data = await response.json();
    const userMenu = document.getElementById('userMenu') as HTMLButtonElement;
    userMenu.innerText = data.user;
}