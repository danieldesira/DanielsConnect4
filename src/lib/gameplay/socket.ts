import Authentication from "../authentication";
import config from "../config";
import Dialog from "../dialog/dialog";
import { DialogIds } from "../enums/dialog-ids";
import { AuthenticationModel } from "../models/authentication-model";
import { Coin, GameMessage, InitialMessage } from "@danieldesira/daniels-connect4-common";

export default class Socket {
    private webSocket: WebSocket;
    private playerColor: Coin;
    private playerName: string;
    private gameId: number;
    public onMessageCallback: Function;
    public onErrorCallback: Function;
    public onGameCancel: Function;

    public constructor(auth: AuthenticationModel) {
        this.connect(auth);
    }

    private connect(auth: AuthenticationModel) {
        let url: string = `${config.connections.wsServer}?token=${auth.token}&service=${auth.service}`;

        if (this.playerColor && !isNaN(this.gameId)) {
            url += `&playerColor=${this.playerColor}&gameId=${this.gameId}`;
        }

        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = this.onMessage;
        this.webSocket.onerror = this.onError;
        this.webSocket.onclose = this.onClose;
    }

    public send = (data: GameMessage) => this.webSocket.send(JSON.stringify(data));

    public close() {
        this.webSocket.onclose = null;
        this.webSocket.onmessage = null;
        this.webSocket.onerror = null;
        this.webSocket.close();
    }

    public getPlayerColor = (): Coin => this.playerColor;
    public getPlayerName = (): string => this.playerName;

    private onMessage = (event: MessageEvent) => {
        const messageData: GameMessage = JSON.parse(event.data);

        if (GameMessage.isInitialMessage(messageData)) {
            const data = messageData as InitialMessage;

            if (!this.gameId) {
                this.gameId = data.gameId;
            }

            if (!this.playerName) {
                this.playerName = data.playerName;
            }
            
            if (!this.playerColor) {
                this.playerColor = data.color;
            }
        }

        if (this.onMessageCallback) {
            this.onMessageCallback(messageData);
        }
    };

    private onError = () => {
        this.onErrorCallback();
        Dialog.closeAllOpenDialogs();
        Dialog.notify({
            id: DialogIds.ServerError,
            text: ['Problem connecting to server!'],
            title: 'Error'
        });

        document.body.classList.remove('cursor-progress');
    };

    private onClose = () => {
        const auth = Authentication.getToken();
        if (auth) {
            this.connect(auth);
        }
    };
}