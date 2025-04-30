import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { Figure, FigureNames } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];
    advancedPawnCell: Cell | null = null;

    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null));
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null));
                }
            }
            this.cells.push(row);
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.advancedPawnCell = this.advancedPawnCell;
        return newBoard;
    }

    public highlightCells(selectedCell: Cell | null, color: Colors) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = this.isAvailableHighlight(selectedCell, target, color);
            }
        }
    }

    private isAvailableHighlight(selectedCell: Cell | null, target: Cell, color: Colors): boolean {
        if (selectedCell?.figure?.name === FigureNames.KING) {
            if (
                selectedCell?.figure?.hasFirstStep() &&
                (target === this.cells[0][2] ||
                    target === this.cells[0][6] ||
                    target === this.cells[7][2] ||
                    target === this.cells[7][6])
            ) {
                return !!this.castling(target, color);
            } else if (this.isCellUnderAttack(target, color)) {
                return false;
            } else {
                return !!selectedCell?.figure?.canMove(target);
            }
        } else {
            return !!selectedCell?.figure?.canMove(target);
        }
    }

    public castling(target: Cell, color: Colors): boolean {
        if (color === Colors.BLACK && target.y === 0) {
            if (
                target.x === 2 &&
                !this.cells[0][1].figure &&
                !this.cells[0][2].figure &&
                !this.cells[0][3].figure &&
                this.cells[0][0].figure?.isFirstStep &&
                this.cells[0][4].figure?.isFirstStep &&
                !this.isCellUnderAttack(this.getCell(0, 2), color) &&
                !this.isCellUnderAttack(this.getCell(0, 3), color) &&
                !this.isCellUnderAttack(this.getCell(0, 4), color)
            ) {
                return true;
            } else if (
                target.x === 6 &&
                !this.cells[0][5].figure &&
                !this.cells[0][6].figure &&
                this.cells[0][4].figure?.isFirstStep &&
                this.cells[0][7].figure?.isFirstStep &&
                !this.isCellUnderAttack(this.getCell(0, 4), color) &&
                !this.isCellUnderAttack(this.getCell(0, 5), color) &&
                !this.isCellUnderAttack(this.getCell(0, 6), color)
            ) {
                return true;
            }
        } else if (color === Colors.WHITE && target.y === 7) {
            if (
                target.x === 2 &&
                !this.cells[7][1].figure &&
                !this.cells[7][2].figure &&
                !this.cells[7][3].figure &&
                this.cells[7][0].figure?.isFirstStep &&
                this.cells[7][4].figure?.isFirstStep &&
                !this.isCellUnderAttack(this.getCell(7, 2), color) &&
                !this.isCellUnderAttack(this.getCell(7, 3), color) &&
                !this.isCellUnderAttack(this.getCell(7, 4), color)
            ) {
                return true;
            } else if (
                target.x === 6 &&
                !this.cells[7][5].figure &&
                !this.cells[7][6].figure &&
                this.cells[7][7].figure?.isFirstStep &&
                this.cells[7][4].figure?.isFirstStep &&
                !this.isCellUnderAttack(this.getCell(7, 4), color) &&
                !this.isCellUnderAttack(this.getCell(7, 5), color) &&
                !this.isCellUnderAttack(this.getCell(7, 6), color)
            ) {
                return true;
            }
        }
        return false;
    }

    public isCellUnderAttack(target: Cell, color: Colors): boolean {
        for (let row = 0; row < 8; row++) {
            for (let cell = 0; cell < 8; cell++) {
                const figure = this.cells[row][cell].figure;
                if (figure?.color !== color && figure?.canMove(target, true)) {
                    return true;
                }
            }
        }
        return false;
    }

    public getCell(y: number, x: number) {
        return this.cells[y][x];
    }

    public addLostFigure(figure: Figure) {
        if (figure.color === Colors.BLACK) {
            this.lostBlackFigures.push(figure);
        } else {
            this.lostWhiteFigures.push(figure);
        }
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(1, i));
            new Pawn(Colors.WHITE, this.getCell(6, i));
        }
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(0, 3));
        new Queen(Colors.WHITE, this.getCell(7, 3));
    }

    private addKings() {
        new King(Colors.BLACK, this.getCell(0, 4));
        new King(Colors.WHITE, this.getCell(7, 4));
    }

    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(0, 2));
        new Bishop(Colors.BLACK, this.getCell(0, 5));
        new Bishop(Colors.WHITE, this.getCell(7, 2));
        new Bishop(Colors.WHITE, this.getCell(7, 5));
    }

    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(0, 1));
        new Knight(Colors.BLACK, this.getCell(0, 6));
        new Knight(Colors.WHITE, this.getCell(7, 1));
        new Knight(Colors.WHITE, this.getCell(7, 6));
    }

    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0, 0));
        new Rook(Colors.BLACK, this.getCell(0, 7));
        new Rook(Colors.WHITE, this.getCell(7, 0));
        new Rook(Colors.WHITE, this.getCell(7, 7));
    }

    public addFigures() {
        this.addPawns();
        this.addQueens();
        this.addKings();
        this.addBishops();
        this.addKnights();
        this.addRooks();
    }
}
