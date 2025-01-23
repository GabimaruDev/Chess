import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { Figure } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];

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
        return newBoard;
    }

    public highlightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.avaliable = !!selectedCell?.figure?.canMove(target);
            }
        }
    }

    public getCell(y: number, x: number) {
        return this.cells[y][x];
    }

    public addLostFigure(figure: Figure) {
        figure.color === Colors.BLACK
            ? this.lostBlackFigures.push(figure)
            : this.lostWhiteFigures.push(figure);
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
