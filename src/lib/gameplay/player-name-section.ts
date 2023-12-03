import { Coin } from "@danieldesira/daniels-connect4-common";

export default class PlayerNameSection {
    private playerRedText: HTMLSpanElement;
    private playerGreenText: HTMLSpanElement;
    private playerRedImage: HTMLImageElement;
    private playerGreenImage: HTMLImageElement;
    private playerRed: string;
    private playerGreen: string;

    public constructor(playerRedId: string, playerGreenId: string) {
        if (playerRedId) {
            const playerRedContainer = document.getElementById(playerRedId);
            this.playerRedText = playerRedContainer.getElementsByTagName('strong')[0];
            this.playerRedImage = playerRedContainer.getElementsByTagName('img')[0];
        }

        if (playerGreenId) {
            const playerGreenContainer = document.getElementById(playerGreenId);
            this.playerGreenText = playerGreenContainer.getElementsByTagName('strong')[0];
            this.playerGreenImage = playerGreenContainer.getElementsByTagName('img')[0];
        }
    }

    public initPlayerNames() {
        const waiting = 'Waiting to connect...';
        if (this.playerGreenText && !this.playerGreen) {
            this.playerGreenText.innerText = waiting;
        }
        if (this.playerRedText && !this.playerRed) {
            this.playerRedText.innerText = waiting;
        }
    }

    public clear() {
        if (this.playerGreenText) {
            this.playerGreenText.innerText = '';
        }
        if (this.playerRedText) {
            this.playerRedText.innerText = '';
        }
        const defaultImage = '/images/default-icon.webp';
        if (this.playerGreenImage) {
            this.playerGreenImage.src = defaultImage;
        }
        if (this.playerRedImage) {
            this.playerRedImage.src = defaultImage;
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
        if (this.playerRedText) {
            this.playerRedText.innerText = this.playerRed;
        }
    }

    public setPlayerGreen(playerName: string) {
        this.playerGreen = playerName;
        if (this.playerGreenText) {
            this.playerGreenText.innerText = this.playerGreen;
        }
    }

    public setPlayerRedPic(pic: string) {
        if (this.playerRedImage) {
            this.playerRedImage.src = pic;
        }
    }

    public setPlayerGreenPic(pic: string) {
        if (this.playerGreenImage) {
            this.playerGreenImage.src = pic;
        }
    }

    public indicateTurn(turn: Coin) {
        if (turn === Coin.Red) {
            this.playerRedText.classList.add('italic');
            this.playerRedText.classList.add('underline');
            this.playerGreenText.classList.remove('italic');
            this.playerGreenText.classList.remove('underline');
        } else {
            this.playerGreenText.classList.add('italic');
            this.playerGreenText.classList.add('underline');
            this.playerRedText.classList.remove('italic');
            this.playerRedText.classList.remove('underline');
        }
    }

}