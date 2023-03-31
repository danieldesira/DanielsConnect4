import { Dot } from "../enums/dot";
import { GameMessage } from "./game-message";

export class SkipTurnMessage extends GameMessage {
    public constructor(skipTurn: boolean, currentTurn: Dot) {
        super();
        this.skipTurn = skipTurn;
        this.currentTurn = currentTurn;
    }

    public skipTurn: boolean;
    public currentTurn: Dot;
}