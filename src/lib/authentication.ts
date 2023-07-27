import { AuthenticationModel } from "./models/authentication-model";

declare global {
    interface Window {
        google: any;
    }
}

export function handleGoogleSignon(response: any) {
    const {credential} = response;
    storeGoogleToken(credential);
    processGoogleToken(credential);
    showLoginLogout();
}

function storeGoogleToken(token: string) {
    const data = {
        token: token,
        service: 'google'
    } as AuthenticationModel;
    sessionStorage.setItem('auth', JSON.stringify(data));
}

function processGoogleToken(token: string) {
    //to-do: send request to server to process google token
    //const response = await fetch()
}

export function showLoginLogout() {
    const loginBtns = document.getElementById('login-btns') as HTMLDivElement;
    const loggedInArea = document.getElementById('logged-in-area') as HTMLDivElement;
    if (sessionStorage.getItem('auth')) {
        loginBtns.classList.add('hide');
        loggedInArea.classList.remove('hide');
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