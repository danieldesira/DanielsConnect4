import { BoardDimensions } from "@danieldesira/daniels-connect4-common";

export default interface GameOptions {
    canvasId: string;
    exitBtnId: string;
    timerCountdownId: string;
    playerRedId: string;
    playerGreenId: string;
    menuId: string;
    gameIndicatorsId: string;
    logoutBtnId: string;
    dimensions: BoardDimensions;
}