export function storeGoogleToken(token: string) {
    sessionStorage.setItem('googleToken', token);
}

export function processGoogleToken(token: string) {
    //to-do: send request to server to process google token
    //const response = await fetch()
}