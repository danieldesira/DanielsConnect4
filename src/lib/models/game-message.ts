export class GameMessage {

    public static isInitialMessage(msg: GameMessage): boolean {
        return (!isNaN(msg['gameId']) && msg['color']) || msg['opponentName'];
    }

    public static isInactivityMessage(msg: GameMessage): boolean {
        return msg['endGameDueToInactivity'] && msg['currentTurn'];
    }

    public static isActionMessage(msg: GameMessage): boolean {
        return msg['action'] && !isNaN(msg['column']);
    }

    public static isSkipTurnMessage(msg: GameMessage): boolean {
        return msg['skipTurn'] && msg['currentTurn'];
    }
    
}