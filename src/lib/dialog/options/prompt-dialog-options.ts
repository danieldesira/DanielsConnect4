import DialogOptions from "./dialog-options";
import PromptInput, { PromptSelect } from "./prompt-input";

export default interface PromptDialogOptions extends DialogOptions {
  onOK: Function;
  onCancel: Function;
  inputs: Array<PromptInput>;
  selects: Array<PromptSelect>;
}
