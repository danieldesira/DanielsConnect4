import { Dot } from "../enums/dot";
import { GameMessage } from "./game-message";

export class InitialMessage extends GameMessage {
    public constructor(gameId: number, opponentName: string, color: Dot) {
        super();
        this.gameId = gameId;
        this.opponentName = opponentName;
        this.color = color;
    }

    public gameId: number;
    public opponentName: string;
    public color: Dot;
}