import { GameMode } from "./enums/game-mode";

export class PlayerNameArea {
    private playerRedSpan: any;
    private playerGreenSpan: any;
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

    public setUpPlayerNames() {
        if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
            this.playerRed = prompt('Please enter name for Red Player!');
            this.playerGreen = prompt('Please enter name for Green Player!');
        }
    }

    public printPlayerNames(mode: GameMode) {
        const waiting = 'Waiting to connect...';
        if (this.playerGreenSpan) {
            if (mode === GameMode.Network && !this.playerGreen) {
                this.playerGreenSpan.innerText = waiting;
            } else {
                this.playerGreenSpan.innerText = this.playerGreen;
            }
        }
        if (this.playerRedSpan) {
            if (mode === GameMode.Network && !this.playerRed) {
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

    public bothPlayersConnected(): boolean {
        return !!this.playerRed && !!this.playerGreen;
    }

    public saveIntoLocalStorage() {
        localStorage.setItem('playerRed', this.playerRed);
        localStorage.setItem('playerGreen', this.playerGreen);
    }

    public setFromLocalStorage() {
        this.playerRed = localStorage.getItem('playerRed');
        this.playerGreen = localStorage.getItem('playerGreen');
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

}