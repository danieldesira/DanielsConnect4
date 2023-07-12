import Dialog from "./dialog/dialog";
import Utils from "./utils";
import { Coin, GameMessage, InitialMessage, PlayerNameMessage } from "@danieldesira/daniels-connect4-common";

export default class Socket {
    private webSocket: WebSocket;
    private playerColor: Coin;
    private playerName: string;
    private gameId: number;
    public onMessageCallback: Function;
    public onErrorCallback: Function;
    public onInputPlayerNameInDialog: Function;

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
            url += `?playerColor=${this.playerColor}&gameId=${this.gameId}&playerName=${this.playerName}`;
        }

        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onerror = this.onError;
        this.webSocket.onclose = this.onClose;
    }

    public send(data: GameMessage) {
        this.webSocket.send(JSON.stringify(data));
    }

    public close() {
        this.webSocket.onclose = null;
        this.webSocket.onmessage = null;
        this.webSocket.onerror = null;
        this.webSocket.close();
    }

    public getPlayerColor(): Coin {
        return this.playerColor;
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    private onMessage = (event: MessageEvent) => {
        let messageData: GameMessage = JSON.parse(event.data);

        if (GameMessage.isInitialMessage(messageData)) {
            let data = messageData as InitialMessage;

            if (!this.gameId) {
                this.gameId = data.gameId;
            }
            
            if (!this.playerColor) {
                this.playerColor = data.color;
    
                let color: string;
                if (this.playerColor === Coin.Red) {
                    color = 'red';
                } else {
                    color = 'green';
                }
    
                Dialog.prompt([`You are ${color}. Please enter your name. (Max length is 10 characters.)`], {
                    onOK: () => this.onPlayerNameInput(color),
                    inputs: [{
                        name: color,
                        type: 'text',
                        limit: 10
                    }]
                });
            }
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
                this.onInputPlayerNameInDialog(this.playerName);
                let data = new PlayerNameMessage(this.playerName);
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
        Dialog.notify(['Problem connecting to server!']);
    };

    private onClose = () => {
        this.connect();
    };
}