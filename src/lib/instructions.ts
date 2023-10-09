import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

export default function showInstructions() {
    const text = [
        'The principle behind Connect4 is simple:',
        'The player who first places 4 coins next to each other, wins. You may ' +
            'match horizontally, vertically or diagonally.',
        'Furthermore, in Network Play, you must place your coin within 60 seconds. ' +
            'If you fail to do so, you pass the turn to your opponent.',
        'Further note that exiting in Same Device Play, saves game progress. You ' +
            'will be presented with the option to continue the same game the next ' +
            'time. This does not work for Network Play because your opponent might ' +
            'not be available the next time and you might not even know him/her/them.',
        'Good luck and have fun playing!'
    ];
    Dialog.notify({
        id: DialogIds.Instructions,
        text,
        title: 'Instructions'
    });
}