export class Utils {
    public static isLocal(): boolean {
        return location.protocol === 'file:'
            || location.hostname === 'localhost';
    }
}