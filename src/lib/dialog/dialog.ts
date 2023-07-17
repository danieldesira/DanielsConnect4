import ConfirmationDialogOptions from "./confirmation-dialog-options";
import DialogOptions from "./dialog-options";
import { DialogType } from "./enums/dialog-type";
import PromptDialogOptions from "./prompt-dialog-options";
import PromptInput from "./prompt-input";

export default class Dialog {
    
    private static modal(id: string, text: Array<string>, type: DialogType, options: DialogOptions = null) {
        if (!document.getElementById(id)) {
            const modal = document.createElement('div') as HTMLDivElement;
            modal.id = id;
            modal.classList.add('dialog');

            const textContainer = document.createElement('div') as HTMLDivElement;
            this.appendText(text, textContainer);
            modal.appendChild(textContainer);

            switch (type) {
                case DialogType.Confirmation: {
                    const o = options as ConfirmationDialogOptions;
                    const btnContainer = document.createElement('div') as HTMLDivElement;
                    btnContainer.classList.add('dialog-btn-container');
                    modal.appendChild(btnContainer);

                    this.appendBtn(btnContainer, 'Yes', () => {
                        o.yesCallback();
                        this.closeModal(modal);
                    }, o.yesColor, 'button');
                    this.appendBtn(btnContainer, 'No', () => {
                        o.noCallback();
                        this.closeModal(modal);
                    }, o.noColor, 'button');
                    break;
                }
                case DialogType.Notification: {
                    const btnContainer = document.createElement('div') as HTMLDivElement;
                    btnContainer.classList.add('dialog-btn-container');
                    modal.appendChild(btnContainer);

                    this.appendBtn(btnContainer, 'OK', () => {
                        this.closeModal(modal);
                    }, 'green', 'button');
                    break;
                }
                case DialogType.Prompt: {
                    const o = options as PromptDialogOptions;
                    this.appendForm(modal, o);
                    break;
                }
            }
            
            document.body.appendChild(modal);
        }
    }

    private static appendBtn(container: HTMLDivElement | HTMLFormElement,
                text: string,
                callback: any,
                bgColor: string,
                btnType: 'submit' | 'button' | 'reset') {
        const btn = document.createElement('button') as HTMLButtonElement;
        btn.type = btnType;
        btn.innerText = text;
        btn.classList.add('text');
        btn.classList.add('dialog-btn');
        btn.classList.add(`dialog-btn-${bgColor}`);
        if (btnType === 'button') {
            btn.addEventListener('click', callback);
        }
        container.appendChild(btn);
    }

    private static appendForm(modal: HTMLDivElement, options: PromptDialogOptions) {
        const inputContainer = document.createElement('div') as HTMLDivElement;
        inputContainer.classList.add('dialog-input-container');
        modal.appendChild(inputContainer);

        const form = document.createElement('form') as HTMLFormElement;
        inputContainer.appendChild(form);
        form.addEventListener('submit', () => {
            const error: string = options.onOK();
            if (error) {
                this.appendError(modal, error);
            } else {
                this.closeModal(modal);
            }
        });

        this.appendInputs(form, options.inputs);

        const btnContainer = document.createElement('div') as HTMLDivElement;
        btnContainer.classList.add('dialog-btn-container');
        form.appendChild(btnContainer);

        this.appendBtn(btnContainer, 'OK', null, 'green', 'submit');
        this.appendBtn(btnContainer, 'Cancel', () => {
            options.onCancel();
            this.closeModal(modal);
        }, 'red', 'button');
    }

    private static appendInputs(form: HTMLFormElement, inputs: Array<PromptInput>) {
        for (let i: number = 0; i < inputs.length; i++) {
            const input = document.createElement('input') as HTMLInputElement;
            input.type = inputs[i].type;
            input.id = inputs[i].name;
            input.name = inputs[i].name;
            input.placeholder = `Enter ${inputs[i].label}`;
            input.maxLength = inputs[i].limit;
            input.classList.add('dialog-input');
            input.classList.add('text');
            input.required = inputs[i].required;
            input.ariaRequired = inputs[i].required.toString();
            form.appendChild(input);

            this.appendBrElement(form);
            this.appendBrElement(form);
        }
    }

    private static appendBrElement(container: HTMLDivElement | HTMLFormElement) {
        const br = document.createElement('br') as HTMLBRElement;
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
            const p = document.createElement('p') as HTMLParagraphElement;
            p.innerText = text[i];
            container.appendChild(p);
        }
    }

    private static closeModal(modal: HTMLDivElement) {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }

    public static confirm(id: string, text: Array<string>, options: ConfirmationDialogOptions) {
        Dialog.modal(id, text, DialogType.Confirmation, options);
    }

    public static notify(id: string, text: Array<string>) {
        Dialog.modal(id, text, DialogType.Notification);
    }

    public static prompt(id: string, text: Array<string>, options: PromptDialogOptions) {
        Dialog.modal(id, text, DialogType.Prompt, options);
    }

    public static closeAllOpenDialogs() {
        const dialogs = document.getElementsByClassName('dialog') as HTMLCollectionOf<HTMLDivElement>;
        for (let i: number = 0; i < dialogs.length; i++) {
            this.closeModal(dialogs[i]);
        }
    }

}