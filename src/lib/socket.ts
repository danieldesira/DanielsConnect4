import { Dialog } from "./dialog/dialog";
import { Dot } from "./enums/dot";
import { GameMessage } from "./models/game-message";
import { Utils } from "./utils";

export class Socket {
    private webSocket: WebSocket;
    private playerColor: Dot;
    private playerName: string;
    private gameId: number;
    public onMessageCallback: Function;
    public onErrorCallback: Function;

    public constructor() {
        this.connect();
    }

    private connect() {
        let url: string;
        if (Utils.isLocal()) {
            url = 'ws://localhost:3000/';
        } else {
            url = 'wss://daniels-connect4-server.adaptable.app/';
        }

        if (this.playerColor && !isNaN(this.gameId)) {
            url += '?playerColor=' + this.playerColor + '&gameId=' + this.gameId + '&playerName=' + this.playerName;
        }

        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onerror = this.onError;
        this.webSocket.onclose = this.onClose;
    }

    public send(data: object) {
        this.webSocket.send(JSON.stringify(data));
    }

    public close() {
        this.webSocket.onclose = null;
        this.webSocket.onmessage = null;
        this.webSocket.onerror = null;
        this.webSocket.close();
    }

    public getPlayerColor(): Dot {
        return this.playerColor;
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    private onMessage = (event: MessageEvent) => {
        let messageData: GameMessage = JSON.parse(event.data);

        if (!this.gameId && !isNaN(messageData.gameId)) {
            this.gameId = messageData.gameId;
        }
        
        if (!this.playerColor && messageData.color) {
            this.playerColor = messageData.color;

            let color: string;
            if (this.playerColor === Dot.Red) {
                color = 'red';
            } else {
                color = 'green';
            }

            Dialog.prompt('You are ' + color + '. Please enter your name.', {
                onOK: () => this.onPlayerNameInput(color),
                inputs: [{
                    name: color,
                    type: 'text'
                }]
            });
        }

        if (this.onMessageCallback) {
            this.onMessageCallback(messageData);
        }
    };

    private onPlayerNameInput = (color: string): string => {
        let playerNameField = document.getElementById(color) as HTMLInputElement;

        if (playerNameField) {
            if (playerNameField.value && playerNameField.value.trim()) {
                this.playerName = playerNameField.value;
                let data = {
                    name: this.playerName
                };
                this.send(data);
                return null;
            } else {
                return 'Field may not be empty!';
            }
        } else {
            return 'Field not implemented! Please fix this stupid bug!';
        }
    };

    private onError = () => {
        this.onErrorCallback();
        Dialog.notify('Problem connecting to server!');
    };

    private onClose = () => {
        this.connect();
    };
}