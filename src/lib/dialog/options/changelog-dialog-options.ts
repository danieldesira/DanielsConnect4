import DialogOptions from "./dialog-options";

export default interface ChangelogDialogOptions extends DialogOptions {
  releases: Array<Release>;
}

interface Release {
  version: string;
  status: "Alpha" | "Beta" | "RC" | "Stable";
  dateTime: string;
  points: Array<ReleasePoint>;
}

interface ReleasePoint {
  text: string;
  subPoints?: Array<string>;
}
