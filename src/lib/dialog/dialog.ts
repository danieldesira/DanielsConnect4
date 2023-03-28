import { ConfirmationDialogOptions } from "./confirmation-dialog-options";
import { DialogOptions } from "./dialog-options";
import { DialogType } from "./enums/dialog-type";
import { PromptDialogOptions } from "./prompt-dialog-options";
import { PromptInput } from "./PromptInput";

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
            case DialogType.Prompt: {
                let o = options as PromptDialogOptions;
                this.appendInputs(modal, o.inputs);
                this.appendBtn(btnContainer, 'OK', () => {
                    let error: string = o.onOK();
                    if (error) {
                        this.appendError(modal, error);
                    } else {
                        this.closeModal(modal);
                    }
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

    private static appendInputs(modal: HTMLDivElement, inputs: Array<PromptInput>) {
        let inputContainer = document.createElement('div') as HTMLDivElement;
        for (let i: number = 0; i < inputs.length; i++) {
            let label = document.createElement('label') as HTMLLabelElement;
            label.innerText = inputs[i].name;
            label.classList.add('text');
            inputContainer.appendChild(label);

            let input = document.createElement('input') as HTMLInputElement;
            input.type = inputs[i].type;
            input.id = inputs[i].name;
            input.name = inputs[i].name;
            inputContainer.appendChild(input);

            let br = document.createElement('br') as HTMLBRElement;
            inputContainer.appendChild(br);
        }
        modal.appendChild(inputContainer);
    }

    private static appendError(container: HTMLDivElement, text: string) {
        let errorSpan = document.createElement('span') as HTMLSpanElement;
        errorSpan.classList.add('red-text');
        errorSpan.classList.add('text');
        errorSpan.innerText = text;
        container.appendChild(errorSpan);
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

    public static prompt(text: string, options: PromptDialogOptions) {
        Dialog.modal(text, DialogType.Prompt, options);
    }

}