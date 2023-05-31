import DialogOptions from "./dialog-options";
import PromptInput from "./prompt-input";

export default interface PromptDialogOptions extends DialogOptions {
    onOK: Function;
    inputs: Array<PromptInput>;
}