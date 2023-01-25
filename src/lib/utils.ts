export class Utils {
    public static isLocal(): boolean {
        return location.protocol === 'file:'
            || location.hostname === 'localhost';
    }

    public static clearAllIntervals(interval: number) {
        for (let count = 1; count <= interval; count++) {
            clearInterval(count);
        }console.log('cleared until interval ' + interval);
    }
}