enum Tile {
    EMPTY = 0,
    RED = 1,
    GREEN = 2
}

export enum GameMode {
    SAME_PC = 1
}

export class Game {

    private static columns: number = 9;
    private static rows: number = 8;

    private canvas: any;
    private context: any;
    private board: Array<Array<Tile>> = new Array(Game.rows);

    private turn: Tile = Tile.RED;

    private playerRed: string;
    private playerGreen: string;

    public mode: GameMode;
    public onGameEnd: Function;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        // Initialise board with empty tiles
        for (let row = 0; row < Game.rows; row++){
            this.board[row] = new Array(Game.columns);
            for (let col = 0; col < Game.columns; col++){
                this.board[row][col] = Tile.EMPTY;
            }
        }
    }

    public start(){
        this.setUpPlayerNames();
        this.paintBoard();
        this.setUserInput();
    }

    private setUpPlayerNames(){
        if (this.mode === GameMode.SAME_PC){
            this.playerRed = prompt('Please enter name for Red Player!');
            this.playerGreen = prompt('Please enter name for Green Player!');
        }
    }

    private paintBoard() {
        let boardGradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
        boardGradient.addColorStop(0, 'blue');
        boardGradient.addColorStop(1, 'aqua');
        this.context.fillStyle = boardGradient;
        this.context.fillRect(0, 70, this.canvas.width, this.canvas.height);

        this.context.fillStyle = 'black';
        for (let col = 0; col < Game.columns; col++) {
            for (let row = 0; row < Game.rows; row++) {
                this.context.beginPath();
                this.context.arc(50 + col * 110, 150 + row * 110, 30, 0, 2 * Math.PI);
                this.context.closePath();
                this.context.fill();
            }
        }
    }

    private getCursorPosition(event): Position {
        var x: number;
        var y: number;
        if (event.pageX !== undefined || event.pageY !== undefined) {
            x = event.pageX;
            y = event.pageY;
        }
        else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= this.canvas.offsetLeft;
        y -= this.canvas.offsetTop;
        return new Position(x, y);
    }

    private setUserInput(){
        this.canvas.addEventListener('mousemove', this.moveDot, false);
        this.canvas.addEventListener('click', this.landDot, false);
    }

    private moveDot = (event) => {
        this.clearUpper();

        let position: Position = this.getCursorPosition(event);
        let column = Math.round(position.x - 50) / 110;
        
        if (this.turn == Tile.RED){
            this.context.fillStyle = 'red';
        }
        else if (this.turn == Tile.GREEN){
            this.context.fillStyle = 'greenyellow';
        }

        this.context.beginPath();
        this.context.arc(50 + column * 120, 35, 35, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }

    private landDot = (event) => {
        let position = this.getCursorPosition(event);
        let column = Math.round((position.x - 50) / 110);
        let row: number;

        if (this.board[0][column] === 0) {

            // Places the circle at the buttom of the column
            for (var r = Game.rows - 1; r > -1; r--) {
                if (this.board[r][column] === 0) {
                    this.board[r][column] = this.turn;
                    row = r;
                    break;
                }
            }
            
            if (this.turn === Tile.RED){
                this.context.fillStyle = 'red';
            }
            else if (this.turn === Tile.GREEN){
                this.context.fillStyle = 'greenyellow';
            }
            
            // Draws the circle at the appropriate position
            this.context.beginPath();
            this.context.arc(50+column*110, 150+r*110, 30, 0, Math.PI*2);
            this.context.closePath();
            this.context.fill();
            
            let dotCount = this.checkTileCount(column, row);

            // Announce winner in case any player completes 4 tiles
            if (dotCount > 3) {
                let winner: string = '';
                if (this.turn === Tile.RED){
                    winner = this.playerRed + ' (Red)';
                } else if (this.turn === Tile.GREEN){
                    winner = this.playerGreen + ' (Green)';
                }

                alert(winner + ' wins!');

                this.cleanUpEvents();

                // Run delegate function to return to main menu, in case it is defined
                if (this.onGameEnd !== undefined && this.onGameEnd !== null){
                    setTimeout(this.onGameEnd, 3000);
                }
            }
            
            // Switches turn
            if (this.turn === Tile.RED){
                this.turn = Tile.GREEN;
            } else if (this.turn === Tile.GREEN){
                this.turn = Tile.RED;
            }

        }
    }

    private clearUpper(){
        this.context.clearRect(0, 0, this.canvas.width, 70);
    }

    private checkTileCount(column: number, row: number): number{
        let count: number = row;
        let dotCount: number = 0;

        // Vertical check
        while (dotCount < 4 && count < Game.rows && this.board[count][column] === this.turn) {
            dotCount++;
            count++;
        }
        
        if (dotCount < 4) {

            // Horizontal check
            dotCount = 0;
            count = column;
            while (count < Game.columns && this.board[row][count] === this.turn) {
                dotCount++;
                count++;
            }
            count = column - 1;
            while (count > -1 && this.board[row][count] === this.turn) {
                dotCount++;
                count--;
            }
        
            // Diagonal checks
            if (dotCount < 4) {
                dotCount = 0;
                let rowCount: number = row - 1;
                let colCount: number = column + 1;
                while (dotCount < 4 && rowCount > -1 &&  colCount < Game.columns && this.board[rowCount][colCount] === this.turn) {
                    dotCount++;
                    colCount++; //right columns
                    rowCount--; //upper rows
                }
                colCount = column;
                rowCount = row;
                while (dotCount < 4 && rowCount < Game.rows && colCount > -1 && this.board[rowCount][colCount] === this.turn) {
                    dotCount++;
                    colCount--; // left columns
                    rowCount++; // lower rows
                }
                
                if (dotCount < 4) {
                    dotCount = 0;
                    rowCount = row - 1;
                    colCount = column - 1;
                    while (dotCount < 4 && rowCount > -1 && colCount > -1 && this.board[rowCount][colCount] === this.turn) {
                        dotCount++;
                        colCount--; // left columns
                        rowCount--; // upper rows
                    }
                    colCount = column;
                    rowCount = row;
                    while (dotCount < 4 && rowCount < Game.rows && colCount < Game.columns && this.board[rowCount][colCount] === this.turn) {
                        dotCount++;
                        colCount++; // right columns
                        rowCount++; // lower rows
                    }
                }
            }
        }

        return dotCount;
    }

    private cleanUpEvents(){
        this.canvas.removeEventListener('mousemove', this.moveDot, false);
        this.canvas.removeEventListener('click', this.landDot, false);
    }

}

class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

