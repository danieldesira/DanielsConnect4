import { Dot } from "../enums/dot";

export class GameMessage {
    public gameId: number;
    public opponentName: string;
    public color: Dot;
    public endGameDueToInactivity: boolean;
    public column: number;
    public action: string;
    public skipTurn: boolean;
    public currentTurn: Dot;
}