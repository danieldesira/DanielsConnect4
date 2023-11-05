import Authentication from "../authentication";
import Dialog from "../dialog/dialog";
import { DialogIds } from "../enums/dialog-ids";
import logout from "../logout";
import openSettings from "./settings-dialog";

export default function openUserMenu(playerName: string, showLoginLogout: Function) {
    Dialog.menu({
        id: DialogIds.AccountMenu,
        title: playerName,
        text: [],
        buttons: [
            {
                text: 'Load Stats',
                callback: async () => await Authentication.loadStats()
            },
            {
                text: 'Settings',
                callback: openSettings
            },
            {
                text: 'Logout',
                callback: () => logout('board', 'countdown', showLoginLogout),
                isDanger: true
            }
        ]
    });
}