export class Timer {

    private secondsRunning: number;
    private timeout: any;
    private timerSpan: any;
    private runnable: boolean;

    public constructor(timerId: string) {
        this.timerSpan = document.getElementById(timerId);
    }

    private timerCallback = () => {
        if (this.runnable) {
            this.secondsRunning++;
            let minutes: number = Math.floor(this.secondsRunning / 60);
            let seconds: number = this.secondsRunning % 60;
            this.timerSpan.innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }
        
        if (!this.timerSpan.classList.contains('hide')) {
            this.timeout = setTimeout(this.timerCallback, 1000);
        } else {
            clearTimeout(this.timeout);
        }
    };

    public set() {
        if (this.timerSpan) {
            this.timerSpan.classList.remove('hide');
            this.timerCallback();
        }
    }

    public stop() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timerSpan.innerText = '';
            this.timerSpan.classList.add('hide');
        }
    }

    public pauseWhenDocumentHidden() {
        if (document.hidden) {
            clearTimeout(this.timeout);
        } else {
            this.timeout = setTimeout(this.timerCallback, 1000);
        }
    }

    public getTimeInStringFormat(): string {
        if (this.timerSpan) {
            return this.timerSpan.innerText;
        } else {
            return '';
        }
    }

    public saveSecondsRunningToLocalStorage() {
        localStorage.setItem('secondsRunning', this.secondsRunning.toString());
    }

    public setSecondsRunningFromLocalStorage() {
        this.secondsRunning = parseInt(localStorage.getItem('secondsRunning'));
    }

    public reset() {
        this.secondsRunning = 0;
        this.runnable = false;
    }

    public setRunnable(runnable: boolean) {
        this.runnable = runnable;
    }

}