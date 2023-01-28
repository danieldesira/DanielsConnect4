import { Dot } from "./enums/dot";
import { Utils } from "./utils";

export class Socket {
    private webSocket: WebSocket;
    private playerColor: Dot;
    private playerName: string;
    private gameId: number;
    public onMessageCallback: Function;

    public constructor() {
        let url: string;
        if (Utils.isLocal()) {
            url = 'ws://localhost:443/';
        } else {
            //to set url to deployed location
        }

        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onerror = this.onError;
    }

    public send(data: object) {
        this.webSocket.send(JSON.stringify(data));
    }

    public close() {
        this.webSocket.close();
        this.webSocket = null;
    }

    public getPlayerColor(): Dot {
        return this.playerColor;
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    private onMessage = (event) => {
        let messageData = JSON.parse(event.data);

        if (!this.gameId && messageData.gameId) {
            this.gameId = messageData.gameId;
        }

        if (messageData.message) {
            alert(messageData.message);
        }

        if (!this.playerColor && messageData.color) {
            this.playerColor = messageData.color;

            this.playerName = prompt('You are ' + this.playerColor + '. Please enter your name.');
            
            let data = {
                name: this.playerName
            };
            this.send(data);
        }

        if (this.onMessageCallback) {
            this.onMessageCallback(messageData);
        }
    };

    private onError = () => {
        alert('Problem connecting to server!');
    };
}