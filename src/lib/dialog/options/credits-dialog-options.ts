import DialogOptions from "./dialog-options";

export default interface CreditsDialogOptions extends DialogOptions {
  sections: Array<CreditsSection>;
}

interface CreditsSection {
  title: string;
  contributors: Array<string>;
}
