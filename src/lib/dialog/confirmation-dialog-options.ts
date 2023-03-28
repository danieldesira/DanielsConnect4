import { DialogOptions } from "./dialog-options";

export class ConfirmationDialogOptions extends DialogOptions {
    public yesCallback: Function;
    public noCallback: Function;
}