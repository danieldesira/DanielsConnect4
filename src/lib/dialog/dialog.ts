import ConfirmationDialogOptions from "./options/confirmation-dialog-options";
import CreditsDialogOptions from "./options/credits-dialog-options";
import DialogOptions from "./options/dialog-options";
import { DialogType } from "./enums/dialog-type";
import MenuDialogOptions from "./options/menu-dialog-options";
import PromptDialogOptions from "./options/prompt-dialog-options";
import PromptInput, { PromptSelect } from "./options/prompt-input";
import ChangelogDialogOptions from "./options/changelog-dialog-options";

export default class Dialog {
    
    private static modal(type: DialogType, options: DialogOptions) {
        if (!document.getElementById(options.id)) {
            const modal = document.createElement('div');
            modal.tabIndex = 1;
            modal.id = options.id;
            modal.classList.add('dialog');

            if (options.title) {
                const h1 = document.createElement('h1');
                h1.innerText = options.title;
                h1.classList.add('dialog-title');
                h1.classList.add('text-xl');
                modal.appendChild(h1);
                modal.appendChild(document.createElement('hr'));
            }

            const textContainer = document.createElement('div');
            this.appendText(options.text, textContainer);
            modal.appendChild(textContainer);

            switch (type) {
                case DialogType.Confirmation: {
                    const o = options as ConfirmationDialogOptions;
                    const btnContainer = document.createElement('div');
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
                case DialogType.Changelog: {
                    const o = options as ChangelogDialogOptions;
                    this.appendChangelog(modal, o);
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
        const btn = document.createElement('button');
        btn.type = btnType;
        btn.classList.add('dialog-btn');
        btn.classList.add(`dialog-btn-${bgColor}`);
        const span = document.createElement('span');
        span.classList.add('text');
        span.classList.add('text-xl');
        span.classList.add('ml-1');
        span.classList.add('mr-1');
        span.innerText = text;
        btn.appendChild(span);
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
        for (const i of inputs) {
            const input = document.createElement('input');
            input.type = i.type;
            input.id = `dialog-input-${i.name}`;
            input.name = `dialog-input-${i.name}`;
            input.ariaPlaceholder = `Enter ${i.label}`;
            input.placeholder = `Enter ${i.label}`;
            input.maxLength = i.limit;
            input.classList.add('dialog-input');
            input.classList.add('text');
            input.required = i.required;
            input.ariaRequired = i.required.toString();
            form.appendChild(input);

            this.appendBrElement(form);
            this.appendBrElement(form);
        }
    }

    private static appendSelects(form: HTMLFormElement, selects: Array<PromptSelect>) {
        for (const s of selects) {
            const select = document.createElement('select');
            select.id = `dialog-select-${s.name}`;
            select.name = `dialog-select-${s.name}`;
            select.ariaPlaceholder = s.label;
            select.classList.add('dialog-input');
            select.required = s.required;
            select.ariaRequired = s.required.toString();
            form.appendChild(select);

            for (const o of s.options) {
                const option = document.createElement('option');
                option.innerText = o.text;
                option.value = o.value;
                if (s.default === parseInt(o.value)) {
                    option.selected = true;
                    option.ariaSelected = "true";
                }
                select.appendChild(option);
            }

            const handleChange = s.onChange;
            if (handleChange) {
                handleChange(select.selectedOptions[0].value);
                select.addEventListener('change', () => handleChange(select.selectedOptions[0].value));
            }

            this.appendBrElement(form);
            this.appendBrElement(form);
        }
    }

    private static appendBrElement(container: HTMLDivElement | HTMLFormElement) {
        const br = document.createElement('br');
        container.appendChild(br);
    }

    private static appendText(text: Array<string>|undefined, container: HTMLDivElement) {
        container.classList.add('text');
        container.classList.add('dialog-text');
        if (text) {
            for (const t of text) {
                const p = document.createElement('p');
                p.innerText = t;
                container.appendChild(p);
            }
        }
    }

    private static appendCredits(container: HTMLDivElement, options: CreditsDialogOptions) {
        for (const section of options.sections) {
            const h2 = document.createElement('h2');
            h2.classList.add('text-xl');
            h2.innerText = section.title;
            container.appendChild(h2);
            const ul = document.createElement('ul');
            for (const contributor of section.contributors) {
                const li = document.createElement('li');
                li.innerText = contributor;
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
        for (const b of options.buttons) {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerText = b.text;
            button.classList.add('dialog-btn');
            button.classList.add(`dialog-btn-${b.color}`);
            button.classList.add('text');
            button.addEventListener('click', b.callback);
            container.appendChild(button);
        }
    }

    private static appendChangelog(modal: HTMLDivElement, options: ChangelogDialogOptions) {
        const container = document.createElement('div');
        container.classList.add('text');
        container.classList.add('dialog-text');
        modal.appendChild(container);
        for (const release of options.releases) {
            const h2 = document.createElement('h2');
            h2.classList.add('text-xl');
            h2.innerText = `${release.version} (${release.status} release - ${release.dateTime})`;
            container.appendChild(h2);
            const ul = document.createElement('ul');
            container.appendChild(ul);
            for (const point of release.points) {
                const outerLi = document.createElement('li');
                outerLi.innerText = point.text;
                ul.appendChild(outerLi);
                if (point.subPoints && point.subPoints.length > 0) {
                    const ol = document.createElement('ol');
                    outerLi.appendChild(ol);
                    for (const subPoint of point.subPoints) {
                        const innerLi = document.createElement('li');
                        innerLi.innerText = subPoint;
                        ol.appendChild(innerLi);
                    }
                }
            }
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

    public static changelog(options: ChangelogDialogOptions) {
        Dialog.modal(DialogType.Changelog, options);
    }

    public static closeAllOpenDialogs() {
        const dialogs = document.getElementsByClassName('dialog') as HTMLCollectionOf<HTMLDivElement>;
        for (let i: number = 0; i < dialogs.length; i++) {
            this.closeModal(dialogs[i]);
        }
    }

}