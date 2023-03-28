import { ConfirmationDialogOptions } from "./confirmation-dialog-options";
import { DialogOptions } from "./dialog-options";
import { DialogType } from "./enums/dialog-type";

export class Dialog {
    
    private static modal(text: string, type: DialogType, options: DialogOptions = null) {
        let modal = document.createElement('div') as HTMLDivElement;
        modal.classList.add('dialog');

        let textContainer = document.createElement('div') as HTMLDivElement;
        textContainer.classList.add('text');
        textContainer.classList.add('dialog-text');
        textContainer.innerText = text;
        modal.appendChild(textContainer);

        let btnContainer = document.createElement('div') as HTMLDivElement;
        btnContainer.classList.add('dialog-btns');
        modal.appendChild(btnContainer);

        switch (type) {
            case DialogType.Confirmation: {
                let o = options as ConfirmationDialogOptions;
                this.appendBtn(btnContainer, 'Yes', () => {
                    o.yesCallback();
                    this.closeModal(modal);
                });
                this.appendBtn(btnContainer, 'No', () => {
                    o.noCallback();
                    this.closeModal(modal);
                });
                break;
            }
            case DialogType.Notification: {
                this.appendBtn(btnContainer, 'OK', () => {
                    this.closeModal(modal);
                });
                break;
            }
        }
        document.body.appendChild(modal);
    }

    private static appendBtn(container: HTMLDivElement, text: string, callback: any) {
        let btn = document.createElement('button') as HTMLButtonElement;
        btn.type = 'button';
        btn.innerText = text;
        btn.classList.add('text');
        btn.addEventListener('click', callback);
        container.appendChild(btn);
    }

    private static closeModal(modal) {
        document.body.removeChild(modal);
    }

    public static confirm(text: string, options: ConfirmationDialogOptions) {
        Dialog.modal(text, DialogType.Confirmation, options);
    }

    public static notify(text: string) {
        Dialog.modal(text, DialogType.Notification);
    }

}