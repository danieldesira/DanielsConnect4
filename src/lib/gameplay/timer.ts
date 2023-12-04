export default class Timer {
  private secondsRunning: number;
  private interval: number;
  private timerSpan: HTMLSpanElement;

  public constructor(timerId: string) {
    this.timerSpan = document.getElementById(timerId) as HTMLSpanElement;
    this.secondsRunning = 0;
  }

  private timerCallback = () => {
    this.secondsRunning++;
    const minutes: number = Math.floor(this.secondsRunning / 60);
    const seconds: number = this.secondsRunning % 60;
    this.timerSpan.innerText = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (this.timerSpan.classList.contains("hidden")) {
      clearInterval(this.interval);
    }
  };

  public set() {
    if (this.timerSpan) {
      this.timerSpan.classList.remove("hidden");
      this.interval = window.setInterval(this.timerCallback, 1000);
    }
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.timerSpan.innerText = "";
      this.timerSpan.classList.add("hidden");
    }
  }

  public pauseWhenDocumentHidden() {
    if (document.hidden) {
      clearInterval(this.interval);
    } else {
      this.interval = window.setInterval(this.timerCallback, 1000);
    }
  }

  public getTimeInStringFormat(): string {
    if (this.timerSpan) {
      return this.timerSpan.innerText;
    } else {
      return "";
    }
  }

  public setSecondsRunning(secondsRunning: number) {
    this.secondsRunning = secondsRunning;
  }

  public getSecondsRunning = () => this.secondsRunning;

  public reset() {
    this.secondsRunning = 0;
  }
}
