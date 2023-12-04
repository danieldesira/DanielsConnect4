import DialogOptions from "./dialog-options";

export default interface MenuDialogOptions extends DialogOptions {
  buttons: Array<MenuButton>;
}

interface MenuButton {
  text: string;
  callback: { (event: MouseEvent): void };
  isDanger?: boolean;
}
