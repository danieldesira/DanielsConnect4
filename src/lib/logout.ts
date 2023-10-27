import Authentication from "./authentication";
import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

export default function logout(canvasId: string, countdownId: string, showLoginLogout: Function) {
    const canvas = document.getElementById(canvasId);
    const countdown = document.getElementById(countdownId);
    const isNetworkPlay = !canvas.classList.contains('hide') && !countdown.classList.contains('hide');
    if (!isNetworkPlay) {
        Authentication.logout();
        showLoginLogout();
        Dialog.closeAllOpenDialogs();
    } else {
        Dialog.notify({
            id: DialogIds.LogoutDisabled,
            title: 'Logout Disabled',
            text: ['You may not logout while Network Game is in progress.']
        });
    }
}