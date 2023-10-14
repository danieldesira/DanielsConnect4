import CreditsDialogOptions from "./dialog/options/credits-dialog-options";
import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

export default function openCredits() {
    const options: CreditsDialogOptions = {
        id: DialogIds.Credits,
        title: 'Contributors',
        text: [],
        sections: [
            {
                title: 'Development',
                contributors: ['Daniel Desira']
            },
            {
                title: 'Code Review',
                contributors: ['Sergiu Nimat']
            },
            {
                title: 'UI/UX Advice',
                contributors: ['Pierre Borġ', 'Martina Sultana', 'Jorge Montalbán', 'Abigail Magro']
            },
            {
                title: 'Testing',
                contributors: ['George Zaharia']
            }
        ]
    };
    Dialog.credit(options);
}