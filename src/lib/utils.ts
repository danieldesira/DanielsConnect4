export default class Utils {
  public static isLocal(): boolean {
    return location.protocol === "file:" || location.hostname === "localhost";
  }

  public static playSound(path: string) {
    const audio = new Audio(path);
    audio.play();
  }

  public static enableProgressCursor = () =>
    document.body.classList.add("cursor-progress");

  public static disableProgressCursor = () =>
    document.body.classList.remove("cursor-progress");
}
