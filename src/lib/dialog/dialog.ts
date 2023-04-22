import { ConfirmationDialogOptions } from "./confirmation-dialog-options";
import { DialogOptions } from "./dialog-options";
import { DialogType } from "./enums/dialog-type";
import { PromptDialogOptions } from "./prompt-dialog-options";
import { PromptInput } from "./prompt-input";

export class Dialog {
    
    private static modal(text: Array<string>, type: DialogType, options: DialogOptions = null) {
        let modal = document.createElement('div') as HTMLDivElement;
        modal.classList.add('dialog');

        let textContainer = document.createElement('div') as HTMLDivElement;
        this.appendText(text, textContainer);
        modal.appendChild(textContainer);

        let btnContainer = document.createElement('div') as HTMLDivElement;
        btnContainer.classList.add('dialog-btn-container');
        
        switch (type) {
            case DialogType.Confirmation: {
                let o = options as ConfirmationDialogOptions;
                this.appendBtn(btnContainer, 'Yes', () => {
                    o.yesCallback();
                    this.closeModal(modal);
                }, 'green');
                this.appendBtn(btnContainer, 'No', () => {
                    o.noCallback();
                    this.closeModal(modal);
                }, 'red');
                break;
            }
            case DialogType.Notification: {
                this.appendBtn(btnContainer, 'OK', () => {
                    this.closeModal(modal);
                }, 'green');
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
                }, 'green');
                break;
            }
        }
        modal.appendChild(btnContainer);
        document.body.appendChild(modal);
    }

    private static appendBtn(container: HTMLDivElement, text: string, callback: any, bgColor: string) {
        let btn = document.createElement('button') as HTMLButtonElement;
        btn.type = 'button';
        btn.innerText = text;
        btn.classList.add('text');
        btn.classList.add('dialog-btn');
        btn.classList.add('dialog-btn-' + bgColor);
        btn.addEventListener('click', callback);
        container.appendChild(btn);
    }

    private static appendInputs(modal: HTMLDivElement, inputs: Array<PromptInput>) {
        let inputContainer = document.createElement('div') as HTMLDivElement;
        inputContainer.classList.add('dialog-input-container');
        for (let i: number = 0; i < inputs.length; i++) {
            let label = document.createElement('label') as HTMLLabelElement;
            label.innerText = inputs[i].name + ': ';
            label.htmlFor = inputs[i].name;
            label.classList.add('text');
            inputContainer.appendChild(label);

            let input = document.createElement('input') as HTMLInputElement;
            input.type = inputs[i].type;
            input.id = inputs[i].name;
            input.name = inputs[i].name;
            input.placeholder = 'Enter name for ' + inputs[i].name;
            input.classList.add('dialog-input');
            input.classList.add('text');
            inputContainer.appendChild(input);

            this.appendBrElement(inputContainer);
            this.appendBrElement(inputContainer);
        }
        modal.appendChild(inputContainer);
    }

    private static appendBrElement(container: HTMLDivElement) {
        let br = document.createElement('br') as HTMLBRElement;
        container.appendChild(br);
    }

    private static appendError(container: HTMLDivElement, text: string) {
        let errorDiv = document.getElementById('dialogError') as HTMLDivElement;
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'dialogError';
            errorDiv.classList.add('red-text');
            errorDiv.classList.add('text');
            errorDiv.classList.add('dialog-error');
            container.appendChild(errorDiv);
        }
        errorDiv.innerText = text;
    }

    private static appendText(text: Array<string>, container: HTMLDivElement) {
        container.classList.add('text');
        container.classList.add('dialog-text');
        for (let i: number = 0; i < text.length; i++) {
            let p = document.createElement('p') as HTMLParagraphElement;
            p.innerText = text[i];
            container.appendChild(p);
        }
    }

    private static closeModal(modal: HTMLDivElement) {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }

    public static confirm(text: Array<string>, options: ConfirmationDialogOptions) {
        Dialog.modal(text, DialogType.Confirmation, options);
    }

    public static notify(text: Array<string>) {
        Dialog.modal(text, DialogType.Notification);
    }

    public static prompt(text: Array<string>, options: PromptDialogOptions) {
        Dialog.modal(text, DialogType.Prompt, options);
    }

    public static closeAllOpenDialogs() {
        let dialogs = document.getElementsByClassName('dialog') as HTMLCollectionOf<HTMLDivElement>;
        for (let i: number = 0; i < dialogs.length; i++) {
            this.closeModal(dialogs[i]);
        }
    }

}