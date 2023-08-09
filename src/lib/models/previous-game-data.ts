import { Coin } from "@danieldesira/daniels-connect4-common";

export default interface PreviousGameData {
    board: Array<Array<Coin>>;
    nextTurn: Coin;
    secondsRunning: number;
    playerRed: string;
    playerGreen: string;
}

export interface MainGameDataModel {
    small: PreviousGameData;
    medium: PreviousGameData;
    large: PreviousGameData;
}