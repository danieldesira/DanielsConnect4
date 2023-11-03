import { Coin } from "@danieldesira/daniels-connect4-common";

export default class PlayerNameSection {
    private playerRedSpan: HTMLSpanElement;
    private playerGreenSpan: HTMLSpanElement;
    private playerRed: string;
    private playerGreen: string;

    public constructor(playerRedId: string, playerGreenId: string) {
        if (playerRedId) {
            this.playerRedSpan = document.getElementById(playerRedId);
        }

        if (playerGreenId) {
            this.playerGreenSpan = document.getElementById(playerGreenId);
        }
    }

    public initPlayerNames() {
        const waiting = 'Waiting to connect...';
        if (this.playerGreenSpan && !this.playerGreen) {
            this.playerGreenSpan.innerText = waiting;
        }
        if (this.playerRedSpan && !this.playerRed) {
            this.playerRedSpan.innerText = waiting;
        }
    }

    public clear() {
        if (this.playerGreenSpan) {
            this.playerGreenSpan.innerText = '';
        }
        if (this.playerRedSpan) {
            this.playerRedSpan.innerText = '';
        }
    }

    public reset() {
        this.playerRed = null;
        this.playerGreen = null;
    }

    public getPlayerRed = (): string => this.playerRed;
    public getPlayerGreen = (): string => this.playerGreen;
    public areBothPlayersConnected = (): boolean => !!this.playerRed && !!this.playerGreen;

    public setPlayerRed(playerName: string) {
        this.playerRed = playerName;
        if (this.playerRedSpan) {
            this.playerRedSpan.innerText = this.playerRed;
        }
    }

    public setPlayerGreen(playerName: string) {
        this.playerGreen = playerName;
        if (this.playerGreenSpan) {
            this.playerGreenSpan.innerText = this.playerGreen;
        }
    }

    public indicateTurn(turn: Coin) {
        if (turn === Coin.Red) {
            this.playerRedSpan.classList.add('italic');
            this.playerRedSpan.classList.add('underline');
            this.playerGreenSpan.classList.remove('italic');
            this.playerGreenSpan.classList.remove('underline');
        } else {
            this.playerGreenSpan.classList.add('italic');
            this.playerGreenSpan.classList.add('underline');
            this.playerRedSpan.classList.remove('italic');
            this.playerRedSpan.classList.remove('underline');
        }
    }

}