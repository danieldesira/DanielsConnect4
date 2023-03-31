import { DialogOptions } from "./dialog-options";
import { PromptInput } from "./prompt-input";

export class PromptDialogOptions extends DialogOptions {
    public onOK: Function;
    public inputs: Array<PromptInput>;
}