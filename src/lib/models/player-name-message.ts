import { GameMessage } from "./game-message";

export class PlayerNameMessage extends GameMessage {
    public constructor(name: string) {
        super();
        this.name = name;
    }

    public name: string;
}