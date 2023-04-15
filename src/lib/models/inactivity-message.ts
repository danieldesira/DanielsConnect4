import { Dot } from "@danieldesira/daniels-connect4-common/lib/enums/dot";
import { GameMessage } from "./game-message";

export class InactivityMessage extends GameMessage {
    public constructor(endGame: boolean, currentTurn: Dot) {
        super();
        this.endGameDueToInactivity = endGame;
        this.currentTurn = currentTurn;
    }

    public endGameDueToInactivity: boolean;
    public currentTurn: Dot;
}