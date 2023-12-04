import DialogOptions from "./dialog-options";

export default interface ConfirmationDialogOptions extends DialogOptions {
  yesCallback: Function;
  noCallback: Function;
}
