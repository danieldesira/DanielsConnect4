declare global {
    interface Window {
        google: any;
    }
}

export function handleGoogleSignon(response: any) {
    const {credential} = response;
    storeGoogleToken(credential);
    processGoogleToken(credential);
}

function storeGoogleToken(token: string) {
    sessionStorage.setItem('googleToken', token);
}

function processGoogleToken(token: string) {
    //to-do: send request to server to process google token
    //const response = await fetch()
}