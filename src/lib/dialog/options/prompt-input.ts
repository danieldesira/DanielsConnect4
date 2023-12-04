interface PromptEntry {
  name: string;
  label: string;
  required: boolean;
}

export default interface PromptInput extends PromptEntry {
  type: string;
  limit: number;
}

export interface PromptSelect extends PromptEntry {
  options: Array<PromptSelectOption>;
  default: number;
  onChange: Function;
}

interface PromptSelectOption {
  text: string;
  value: string;
}
