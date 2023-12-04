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
      const modal = document.createElement("div");
      modal.tabIndex = 1;
      modal.id = options.id;
      modal.classList.add("dialog");
      modal.classList.add("fixed");
      modal.classList.add("text-white");
      modal.classList.add("w-4/5");
      modal.classList.add("opacity-80");
      modal.classList.add("focus:opacity-95");
      modal.classList.add("bg-amber-500");
      modal.classList.add("dark:bg-gray-900");
      modal.classList.add("pt-5");
      modal.classList.add("pb-5");
      modal.classList.add("rounded-3xl");
      modal.classList.add("max-w-xl");

      if (options.title) {
        const h1 = document.createElement("h1");
        h1.innerText = options.title;
        h1.classList.add("text-center");
        h1.classList.add("text-xl");
        modal.appendChild(h1);
        modal.appendChild(document.createElement("hr"));
      }

      const textContainer = document.createElement("div");
      this.appendText(options.text, textContainer);
      modal.appendChild(textContainer);

      switch (type) {
        case DialogType.Confirmation: {
          const o = options as ConfirmationDialogOptions;
          const btnContainer = document.createElement("div");
          btnContainer.classList.add("w-fit");
          btnContainer.classList.add("m-auto");
          modal.appendChild(btnContainer);

          this.appendBtn(
            btnContainer,
            "Yes",
            () => {
              o.yesCallback();
              this.closeModal(modal);
            },
            false,
            "button"
          );
          this.appendBtn(
            btnContainer,
            "No",
            () => {
              o.noCallback();
              this.closeModal(modal);
            },
            true,
            "button"
          );
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

  private static appendBtn(
    container: HTMLDivElement | HTMLFormElement,
    text: string,
    callback: any,
    isDanger: boolean,
    btnType: "submit" | "button" | "reset"
  ) {
    const btn = document.createElement("button");
    btn.type = btnType;
    btn.classList.add("rounded-3xl");
    btn.classList.add("m-1");
    btn.classList.add("cursor-pointer");
    this.assignButtonColor(btn, isDanger);
    const span = document.createElement("span");
    span.classList.add("text-xl");
    span.classList.add("ml-2");
    span.classList.add("mr-2");
    span.innerText = text;
    btn.appendChild(span);
    if (btnType === "button") {
      btn.addEventListener("click", callback);
    }
    container.appendChild(btn);
  }

  private static appendForm(
    modal: HTMLDivElement,
    options: PromptDialogOptions
  ) {
    const inputContainer = document.createElement("div") as HTMLDivElement;
    inputContainer.classList.add("m-auto");
    inputContainer.classList.add("w-3/4");
    modal.appendChild(inputContainer);

    const form = document.createElement("form") as HTMLFormElement;
    inputContainer.appendChild(form);
    form.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      if (options.onOK) {
        options.onOK();
      }
      this.closeModal(modal);
    });

    this.appendInputs(form, options.inputs);
    this.appendSelects(form, options.selects);

    const btnContainer = document.createElement("div") as HTMLDivElement;
    btnContainer.classList.add("w-fit");
    btnContainer.classList.add("m-auto");
    form.appendChild(btnContainer);

    this.appendBtn(btnContainer, "OK", null, false, "submit");
    this.appendBtn(
      btnContainer,
      "Cancel",
      () => {
        if (options.onCancel) {
          options.onCancel();
        }
        this.closeModal(modal);
      },
      true,
      "button"
    );
  }

  private static appendInputs(
    form: HTMLFormElement,
    inputs: Array<PromptInput>
  ) {
    for (const i of inputs) {
      const input = document.createElement("input");
      input.type = i.type;
      input.id = `dialog-input-${i.name}`;
      input.name = `dialog-input-${i.name}`;
      input.ariaPlaceholder = `Enter ${i.label}`;
      input.placeholder = `Enter ${i.label}`;
      input.maxLength = i.limit;
      this.assignInputClassNames(input);
      input.required = i.required;
      input.ariaRequired = i.required.toString();
      form.appendChild(input);

      this.appendBrElement(form);
      this.appendBrElement(form);
    }
  }

  private static assignInputClassNames(input: HTMLElement) {
    input.classList.add("text-center");
    input.classList.add("w-full");
    input.classList.add("rounded-3xl");
    input.classList.add("h-9");
    input.classList.add("text-lg");
    input.classList.add("text-gray-700");
  }

  private static appendSelects(
    form: HTMLFormElement,
    selects: Array<PromptSelect>
  ) {
    for (const s of selects) {
      const select = document.createElement("select");
      select.id = `dialog-select-${s.name}`;
      select.name = `dialog-select-${s.name}`;
      select.ariaPlaceholder = s.label;
      this.assignInputClassNames(select);
      select.required = s.required;
      select.ariaRequired = s.required.toString();
      form.appendChild(select);

      for (const o of s.options) {
        const option = document.createElement("option");
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
        select.addEventListener("change", () =>
          handleChange(select.selectedOptions[0].value)
        );
      }

      this.appendBrElement(form);
      this.appendBrElement(form);
    }
  }

  private static appendBrElement(container: HTMLDivElement | HTMLFormElement) {
    const br = document.createElement("br");
    container.appendChild(br);
  }

  private static appendText(
    text: Array<string> | undefined,
    container: HTMLDivElement
  ) {
    this.assignTextClassNames(container);
    if (text) {
      for (const t of text) {
        const p = document.createElement("p");
        p.innerText = t;
        container.appendChild(p);
      }
    }
  }

  private static appendCredits(
    container: HTMLDivElement,
    options: CreditsDialogOptions
  ) {
    for (const section of options.sections) {
      const h2 = document.createElement("h2");
      h2.classList.add("text-xl");
      h2.innerText = section.title;
      container.appendChild(h2);
      const ul = document.createElement("ul");
      ul.classList.add("ml-5");
      for (const contributor of section.contributors) {
        const li = document.createElement("li");
        li.innerText = contributor;
        ul.appendChild(li);
      }
      container.appendChild(ul);
    }
  }

  private static appendOKButton(modal: HTMLDivElement) {
    const btnContainer = document.createElement("div") as HTMLDivElement;
    btnContainer.classList.add("w-fit");
    btnContainer.classList.add("m-auto");
    modal.appendChild(btnContainer);

    this.appendBtn(
      btnContainer,
      "OK",
      () => {
        this.closeModal(modal);
      },
      false,
      "button"
    );
  }

  private static listenKeyboard(modal: HTMLDivElement) {
    modal.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        this.closeModal(modal);
      }
    });
  }

  private static appendMenu(modal: HTMLDivElement, options: MenuDialogOptions) {
    const container = document.createElement("div");
    container.classList.add("w-1/3");
    container.classList.add("m-auto");
    modal.appendChild(container);
    for (const b of options.buttons) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerText = b.text;
      button.classList.add("w-full");
      button.classList.add("h-12");
      button.classList.add("rounded-3xl");
      button.classList.add("mt-3");
      button.classList.add("mb-3");
      this.assignButtonColor(button, b.isDanger);
      button.addEventListener("click", b.callback);
      container.appendChild(button);
    }
  }

  private static appendChangelog(
    modal: HTMLDivElement,
    options: ChangelogDialogOptions
  ) {
    const container = document.createElement("div");
    this.assignTextClassNames(container);
    modal.appendChild(container);
    for (const release of options.releases) {
      const h2 = document.createElement("h2");
      h2.classList.add("text-xl");
      h2.innerText = `${release.version} (${release.status} release - ${release.dateTime})`;
      container.appendChild(h2);
      const ul = document.createElement("ul");
      ul.classList.add("ml-5");
      container.appendChild(ul);
      for (const point of release.points) {
        const outerLi = document.createElement("li");
        outerLi.innerText = point.text;
        ul.appendChild(outerLi);
        if (point.subPoints && point.subPoints.length > 0) {
          const ol = document.createElement("ol");
          ol.classList.add("list-decimal");
          ol.classList.add("ml-5");
          outerLi.appendChild(ol);
          for (const subPoint of point.subPoints) {
            const innerLi = document.createElement("li");
            innerLi.innerText = subPoint;
            ol.appendChild(innerLi);
          }
        }
      }
    }
  }

  private static assignTextClassNames(container: HTMLDivElement) {
    container.classList.add("w-11/12");
    container.classList.add("m-auto");
    container.classList.add("mt-3");
    container.classList.add("mb-3");
    container.classList.add("grid");
    container.classList.add("gap-3");
    container.classList.add("max-h-screen-1/4");
    container.classList.add("overflow-y-auto");
  }

  private static assignButtonColor(
    button: HTMLButtonElement,
    isDanger: boolean
  ) {
    if (isDanger) {
      button.classList.add("bg-red-600");
    } else {
      button.classList.add("bg-theme-color");
      button.classList.add("dark:bg-dark-theme-color");
    }
  }

  private static closeModal(modal: HTMLDivElement) {
    if (document.body.contains(modal)) {
      document.body.removeChild(modal);
    }
  }

  public static confirm = (options: ConfirmationDialogOptions) =>
    Dialog.modal(DialogType.Confirmation, options);
  public static notify = (options: DialogOptions) =>
    Dialog.modal(DialogType.Notification, options);
  public static prompt = (options: PromptDialogOptions) =>
    Dialog.modal(DialogType.Prompt, options);
  public static credit = (options: CreditsDialogOptions) =>
    Dialog.modal(DialogType.Credits, options);
  public static menu = (options: MenuDialogOptions) =>
    Dialog.modal(DialogType.Menu, options);
  public static changelog = (options: ChangelogDialogOptions) =>
    Dialog.modal(DialogType.Changelog, options);

  public static closeAllOpenDialogs() {
    const dialogs = document.getElementsByClassName(
      "dialog"
    ) as HTMLCollectionOf<HTMLDivElement>;
    for (let i: number = 0; i < dialogs.length; i++) {
      this.closeModal(dialogs[i]);
    }
  }
}
