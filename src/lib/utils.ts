export default class Utils {
    public static isLocal(): boolean {
        return location.protocol === 'file:'
            || location.hostname === 'localhost';
    }

    public static playSound(path: string) {
        const audio = new Audio(path);
        audio.play();
    }
}