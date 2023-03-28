import { Dialog } from "./dialog/dialog";
import { Dot } from "./enums/dot";

export class PlayerNameSection {
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

    public setUpPlayerNames() {
        if (!localStorage.getItem('playerRed') || !localStorage.getItem('playerGreen')) {
            Dialog.prompt('Please enter player names!', {
                onOK: this.onPromptOK,
                inputs: [
                    {
                        name: 'red',
                        type: 'text'
                    },
                    {
                        name: 'green',
                        type: 'text'
                    }
                ]
            });
        }
    }

    private onPromptOK = (): string => {
        let redInput = document.getElementById('red') as HTMLInputElement;
        let greenInput = document.getElementById('green') as HTMLInputElement;
        if (redInput && greenInput) {
            if (redInput.value && greenInput.value && redInput.value.trim() && greenInput.value.trim()) {
                this.playerRed = redInput.value;
                this.playerGreen = greenInput.value;
                this.printPlayerNames();
                return null;
            } else {
                return 'No empty fields allowed!';
            }
        }
    };

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

    public indicateTurn(turn: Dot) {
        if (turn === Dot.Red) {
            this.playerRedSpan.classList.add('currentTurn');
            this.playerGreenSpan.classList.remove('currentTurn');
        } else if (turn === Dot.Green) {
            this.playerGreenSpan.classList.add('currentTurn');
            this.playerRedSpan.classList.remove('currentTurn');
        }
    }

}