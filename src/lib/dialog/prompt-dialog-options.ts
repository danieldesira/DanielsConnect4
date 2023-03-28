import { DialogOptions } from "./dialog-options";
import { PromptInput } from "./PromptInput";

export class PromptDialogOptions extends DialogOptions {
    public onOK: Function;
    public inputs: Array<PromptInput>;
}