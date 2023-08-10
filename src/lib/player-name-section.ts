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

    public printPlayerNames() {
        const waiting = 'Waiting to connect...';
        if (this.playerGreenSpan) {
            if (!this.playerGreen) {
                this.playerGreenSpan.innerText = waiting;
            } else {
                this.playerGreenSpan.innerText = this.playerGreen;
            }
        }
        if (this.playerRedSpan) {
            if (!this.playerRed) {
                this.playerRedSpan.innerText = waiting;
            } else {
                this.playerRedSpan.innerText = this.playerRed;
            }
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

    public getPlayerRed(): string {
        return this.playerRed;
    }

    public getPlayerGreen(): string {
        return this.playerGreen;
    }

    public areBothPlayersConnected(): boolean {
        return !!this.playerRed && !!this.playerGreen;
    }

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
            this.playerRedSpan.classList.add('currentTurn');
            this.playerGreenSpan.classList.remove('currentTurn');
        } else {
            this.playerGreenSpan.classList.add('currentTurn');
            this.playerRedSpan.classList.remove('currentTurn');
        }
    }

}