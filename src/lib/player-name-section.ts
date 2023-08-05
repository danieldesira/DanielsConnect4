import { Coin } from "@danieldesira/daniels-connect4-common";
import Dialog from "./dialog/dialog";
import { DialogIds } from "./enums/dialog-ids";

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

    public setUpPlayerNames(okAction: Function, cancelAction: Function) {
        if (!localStorage.getItem('gameData')) {
            Dialog.prompt({
                id: DialogIds.PlayerNames,
                title: 'Input Players',
                text: ['Please enter player names! (10 characters or less.)'],
                onOK: () => this.onPromptOK(okAction),
                onCancel: () => this.onPromptCancel(cancelAction),
                inputs: [
                    {
                        label: 'Player Red',
                        name: 'red',
                        type: 'text',
                        limit: 10,
                        required: true
                    },
                    {
                        label: 'Player Green',
                        name: 'green',
                        type: 'text',
                        limit: 10,
                        required: true
                    }
                ]
            });
        }
    }

    private onPromptOK = (action: Function): string => {
        const redInput = document.getElementById('dialog-input-red') as HTMLInputElement;
        const greenInput = document.getElementById('dialog-input-green') as HTMLInputElement;
        if (redInput.value && greenInput.value && redInput.value.trim() && greenInput.value.trim()) {
            this.playerRed = redInput.value;
            this.playerGreen = greenInput.value;
            this.printPlayerNames();
            action();
            return null;
        }
    };

    private onPromptCancel = (action: Function) => {
        action();
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