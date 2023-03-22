import { Dot } from "./enums/dot"

export class BoardLogic {

    public static columns: number = 9;
    public static rows: number = 8;

    public static initBoard(board: Array<Array<Dot>>) {
        for (let col = 0; col < BoardLogic.columns; col++) {
            board[col] = new Array(BoardLogic.rows);
            for (let row = 0; row < BoardLogic.rows; row++){
                board[col][row] = Dot.Empty;
            }
        }
    }

    public static countConsecutiveDots(board: Array<Array<Dot>>, column: number, row: number, currentTurn: Dot): number {
        let count: number = row;
        let dotCount: number = 0;

        // Vertical check
        while (dotCount < 4 && count < BoardLogic.rows && board[column][count] === currentTurn) {
            dotCount++;
            count++;
        }
        
        if (dotCount < 4) {

            // Horizontal check
            dotCount = 0;
            count = column;
            while (count < BoardLogic.columns && board[count][row] === currentTurn) {
                dotCount++;
                count++;
            }
            count = column - 1;
            while (count > -1 && board[count][row] === currentTurn) {
                dotCount++;
                count--;
            }
        
            // Diagonal checks
            if (dotCount < 4) {
                dotCount = 0;
                let rowCount: number = row - 1;
                let colCount: number = column + 1;
                while (dotCount < 4 && rowCount > -1 &&  colCount < BoardLogic.columns && board[colCount][rowCount] === currentTurn) {
                    dotCount++;
                    colCount++; //right columns
                    rowCount--; //upper rows
                }
                colCount = column;
                rowCount = row;
                while (dotCount < 4 && rowCount < BoardLogic.rows && colCount > -1 && board[colCount][rowCount] === currentTurn) {
                    dotCount++;
                    colCount--; // left columns
                    rowCount++; // lower rows
                }
                
                if (dotCount < 4) {
                    dotCount = 0;
                    rowCount = row - 1;
                    colCount = column - 1;
                    while (dotCount < 4 && rowCount > -1 && colCount > -1 && board[colCount][rowCount] === currentTurn) {
                        dotCount++;
                        colCount--; // left columns
                        rowCount--; // upper rows
                    }
                    colCount = column;
                    rowCount = row;
                    while (dotCount < 4 && rowCount < BoardLogic.rows && colCount < BoardLogic.columns && board[colCount][rowCount] === currentTurn) {
                        dotCount++;
                        colCount++; // right columns
                        rowCount++; // lower rows
                    }
                }
            }
        }

        return dotCount;
    }

    public static isBoardFull(board: Array<Array<Dot>>): boolean {
        let full: boolean = true;
        for (let col: number = 0; col < BoardLogic.columns; col++) {
            // Check upper row in every column
            if (board[col][0] === Dot.Empty) {
                full = false;
                break;
            }
        }
        return full;
    }
    
}