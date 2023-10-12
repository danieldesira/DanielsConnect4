import ConfirmationDialogOptions from "./confirmation-dialog-options";
import CreditsDialogOptions from "./credits-dialog-options";
import DialogOptions from "./dialog-options";
import { DialogType } from "./enums/dialog-type";
import MenuDialogOptions from "./menu-dialog-options";
import PromptDialogOptions from "./prompt-dialog-options";
import PromptInput, { PromptSelect } from "./prompt-input";

export default class Dialog {
    
    private static modal(type: DialogType, options: DialogOptions) {
        if (!document.getElementById(options.id)) {
            const modal = document.createElement('div') as HTMLDivElement;
            modal.tabIndex = 1;
            modal.id = options.id;
            modal.classList.add('dialog');

            if (options.title) {
                const h1 = document.createElement('h1') as HTMLHeadingElement;
                h1.innerText = options.title;
                h1.classList.add('dialog-title');
                modal.appendChild(h1);
                modal.appendChild(document.createElement('hr'));
            }

            const textContainer = document.createElement('div') as HTMLDivElement;
            this.appendText(options.text, textContainer);
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
                    this.appendOKButton(modal);
                    this.listenKeyboard(modal);
                    break;
                }
                case DialogType.Prompt: {
                    const o = options as PromptDialogOptions;
                    this.appendForm(modal, o);
                    break;
                }
                case DialogType.Credits: {
                    const o = options as CreditsDialogOptions;
                    this.appendCredits(textContainer, o);
                    this.appendOKButton(modal);
                    this.listenKeyboard(modal);
                    break;
                }
                case DialogType.Menu: {
                    const o = options as MenuDialogOptions;
                    this.appendMenu(modal, o);
                    this.appendOKButton(modal);
                    this.listenKeyboard(modal);
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
        form.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            if (options.onOK) {
                options.onOK();
            }
            this.closeModal(modal);
        });

        this.appendInputs(form, options.inputs);
        this.appendSelects(form, options.selects);

        const btnContainer = document.createElement('div') as HTMLDivElement;
        btnContainer.classList.add('dialog-btn-container');
        form.appendChild(btnContainer);

        this.appendBtn(btnContainer, 'OK', null, 'green', 'submit');
        this.appendBtn(btnContainer, 'Cancel', () => {
            if (options.onCancel) {
                options.onCancel();
            }
            this.closeModal(modal);
        }, 'red', 'button');
    }

    private static appendInputs(form: HTMLFormElement, inputs: Array<PromptInput>) {
        for (let i: number = 0; i < inputs.length; i++) {
            const input = document.createElement('input');
            input.type = inputs[i].type;
            input.id = `dialog-input-${inputs[i].name}`;
            input.name = `dialog-input-${inputs[i].name}`;
            input.ariaPlaceholder = `Enter ${inputs[i].label}`;
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

    private static appendSelects(form: HTMLFormElement, selects: Array<PromptSelect>) {
        for (let i: number = 0; i < selects.length; i++) {
            const select = document.createElement('select');
            select.id = `dialog-select-${selects[i].name}`;
            select.name = `dialog-select-${selects[i].name}`;
            select.ariaPlaceholder = selects[i].label;
            select.classList.add('dialog-input');
            select.required = selects[i].required;
            select.ariaRequired = selects[i].required.toString();
            form.appendChild(select);

            for (let j = 0; j < selects[i].options.length; j++) {
                const option = document.createElement('option');
                option.innerText = selects[i].options[j].text;
                option.value = selects[i].options[j].value;
                if (selects[i].default === parseInt(selects[i].options[j].value)) {
                    option.selected = true;
                    option.ariaSelected = "true";
                }
                select.appendChild(option);
            }

            const handleChange = selects[i].onChange;
            if (handleChange) {
                handleChange(select.selectedOptions[0].value);
                select.addEventListener('change', () => handleChange(select.selectedOptions[0].value));
            }

            this.appendBrElement(form);
            this.appendBrElement(form);
        }
    }

    private static appendBrElement(container: HTMLDivElement | HTMLFormElement) {
        const br = document.createElement('br') as HTMLBRElement;
        container.appendChild(br);
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

    private static appendCredits(container: HTMLDivElement, options: CreditsDialogOptions) {
        for (let i: number = 0; i < options.sections.length; i++) {
            const h2 = document.createElement('h2');
            h2.innerText = options.sections[i].title;
            container.appendChild(h2);
            const ul = document.createElement('ul');
            for (let j: number = 0; j < options.sections[i].contributors.length; j++) {
                const li = document.createElement('li');
                li.innerText = options.sections[i].contributors[j];
                ul.appendChild(li);
            }
            container.appendChild(ul);
        }
    }

    private static appendOKButton(modal: HTMLDivElement) {
        const btnContainer = document.createElement('div') as HTMLDivElement;
        btnContainer.classList.add('dialog-btn-container');
        modal.appendChild(btnContainer);

        this.appendBtn(btnContainer, 'OK', () => {
            this.closeModal(modal);
        }, 'green', 'button');
    }

    private static listenKeyboard(modal: HTMLDivElement) {
        modal.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === 'Enter') {
                this.closeModal(modal);
            }
        });
    }

    private static appendMenu(modal: HTMLDivElement, options: MenuDialogOptions) {
        const container = document.createElement('div');
        container.classList.add('dialog-menu-container');
        modal.appendChild(container);
        for (let i = 0; i < options.buttons.length; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerText = options.buttons[i].text;
            button.classList.add('dialog-btn');
            button.classList.add(`dialog-btn-${options.buttons[i].color}`)
            button.classList.add('text');
            button.addEventListener('click', options.buttons[i].callback);
            container.appendChild(button);
        }
    }

    private static closeModal(modal: HTMLDivElement) {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }

    public static confirm(options: ConfirmationDialogOptions) {
        Dialog.modal(DialogType.Confirmation, options);
    }

    public static notify(options: DialogOptions) {
        Dialog.modal(DialogType.Notification, options);
    }

    public static prompt(options: PromptDialogOptions) {
        Dialog.modal(DialogType.Prompt, options);
    }

    public static credit(options: CreditsDialogOptions) {
        Dialog.modal(DialogType.Credits, options);
    }

    public static menu(options: MenuDialogOptions) {
        Dialog.modal(DialogType.Menu, options);
    }

    public static closeAllOpenDialogs() {
        const dialogs = document.getElementsByClassName('dialog') as HTMLCollectionOf<HTMLDivElement>;
        for (let i: number = 0; i < dialogs.length; i++) {
            this.closeModal(dialogs[i]);
        }
    }

}