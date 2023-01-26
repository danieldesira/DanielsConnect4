export class Utils {
    public static isLocal(): boolean {
        return location.protocol === 'file:'
            || location.hostname === 'localhost';
    }

    public static clearTimeouts(timeouts: Array<any>) {
        for (let count: number = 0; count < timeouts.length; count++) {
            clearTimeout(timeouts[count]);
        }
    }
}