import { Colors, Position } from "../types";
import { Cell } from "./Cell";
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

    public initCells(): void {
        this.cells = Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) =>
                new Cell(this, x, y, (x + y) % 2 ? Colors.BLACK : Colors.WHITE, null)
            )
        );
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        return newBoard;
    }

    public highlightCells(selectedCell: Cell | null, color: Colors): void {
        this.cells.forEach((row) => {
            row.forEach((cell) => {
                cell.available = this.isAvailableHighlight(selectedCell, cell, color);
            });
        });
    }

    private isAvailableHighlight(selectedCell: Cell | null, target: Cell, color: Colors): boolean {
        if (!selectedCell?.figure) return false;

        if (!selectedCell.figure.canMove(target)) {
            return false;
        }

        if (selectedCell.figure.name === FigureNames.KING) {
            return this.handleKingHighlight(selectedCell, target, color);
        }

        if (this.isKingInCheck(color)) {
            return this.isMoveSafe(selectedCell.figure, target);
        }

        return this.isMoveSafe(selectedCell.figure, target);
    }

    private handleKingHighlight(selectedCell: Cell, target: Cell, color: Colors): boolean {
        if (this.isCastlingMove(selectedCell, target, color)) {
            return this.castling(target, color);
        }

        return this.isMoveSafe(selectedCell.figure!, target);
    }

    private isCastlingMove(selectedCell: Cell, target: Cell, color: Colors): boolean {
        if (!selectedCell.figure?.hasFirstStep()) return false;

        const castlingPositions =
            color === Colors.BLACK
                ? [
                    { x: 2, y: 0 },
                    { x: 6, y: 0 },
                ]
                : [
                    { x: 2, y: 7 },
                    { x: 6, y: 7 },
                ];

        return castlingPositions.some((pos) => pos.x === target.x && pos.y === target.y);
    }

    public castling(target: Cell, color: Colors): boolean {
        const isBlack = color === Colors.BLACK;
        const row = isBlack ? 0 : 7;

        if (target.y !== row) return false;

        if (target.x === 2) {
            return this.canCastleLeft(row, color);
        } else if (target.x === 6) {
            return this.canCastleRight(row, color);
        }

        return false;
    }

    private checkEmptyCellsBetween(startX: number, endX: number, y: number): boolean {
        const step = startX < endX ? 1 : -1;
        for (let x = startX + step; x !== endX; x += step) {
            if (this.getCell(y, x).figure) return false;
        }
        return true;
    }

    private canCastleLeft(row: number, color: Colors): boolean {
        const cells = this.cells[row];
        const kingCell = cells[4];
        const rookCell = cells[0];

        if (!kingCell.figure?.hasFirstStep() || !rookCell.figure?.hasFirstStep()) {
            return false;
        } else if (!this.checkEmptyCellsBetween(0, 4, row)) return false;

        for (let i = 2; i <= 4; i++) {
            if (this.isCellUnderAttack(this.getCell(row, i), color)) {
                return false;
            }
        }

        return true;
    }

    private canCastleRight(row: number, color: Colors): boolean {
        const kingCell = this.cells[row][4];
        const rookCell = this.cells[row][7];

        if (!kingCell.figure?.hasFirstStep() || !rookCell.figure?.hasFirstStep()) {
            return false;
        }

        if (!this.checkEmptyCellsBetween(4, 7, row)) return false;

        for (let i = 4; i <= 6; i++) {
            if (this.isCellUnderAttack(this.getCell(row, i), color)) {
                return false;
            }
        }

        return true;
    }

    public isCellUnderAttack(target: Cell, color: Colors): boolean {
        return this.cells.some((row) =>
            row.some((cell) => {
                const figure = cell.figure;
                return figure?.color !== color && figure?.canMove(target, true);
            })
        );
    }

    public isFigureProtected(figure: Figure): boolean {
        return this.cells.some((row) =>
            row.some((cell) => {
                const attackingFigure = cell.figure;
                return (
                    attackingFigure?.color === figure.color &&
                    attackingFigure !== figure &&
                    attackingFigure.canMove(figure.cell, true)
                );
            })
        );
    }

    public isKingMoveSafe(king: Figure, targetCell: Cell): boolean {
        const originalTargetFigure = targetCell.figure;
        const originalKingCell = king.cell;

        targetCell.figure = king;
        king.cell = targetCell;
        originalKingCell.figure = null;

        const isSafe = !this.isCellUnderAttack(targetCell, king.color);

        originalKingCell.figure = king;
        king.cell = originalKingCell;
        targetCell.figure = originalTargetFigure;

        return isSafe;
    }

    public isKingInCheck(color: Colors): boolean {
        const king = this.findKing(color);
        if (!king) return false;

        return this.isCellUnderAttack(king.cell, color);
    }

    public isCheckmate(color: Colors): boolean {
        if (!this.isKingInCheck(color)) {
            return false;
        }

        return !this.hasValidMoves(color);
    }

    public isStalemate(color: Colors): boolean {
        if (this.isKingInCheck(color)) {
            return false;
        }

        return !this.hasValidMoves(color);
    }

    private findKing(color: Colors): Figure | null {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.figure?.name === FigureNames.KING && cell.figure.color === color) {
                    return cell.figure;
                }
            }
        }
        return null;
    }

    private hasValidMoves(color: Colors): boolean {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.figure?.color === color) {
                    for (const targetRow of this.cells) {
                        for (const targetCell of targetRow) {
                            if (this.isValidMove(cell.figure!, targetCell)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    private isValidMove(figure: Figure, targetCell: Cell): boolean {
        if (!figure.canMove(targetCell)) {
            return false;
        }

        return this.isMoveSafe(figure, targetCell);
    }

    private isMoveSafe(figure: Figure, targetCell: Cell): boolean {
        const originalTargetFigure = targetCell.figure;
        const originalPosition = figure.cell;

        try {
            targetCell.figure = figure;
            figure.cell = targetCell;
            originalPosition.figure = null;

            return !this.isKingInCheck(figure.color);
        } finally {
            originalPosition.figure = figure;
            figure.cell = originalPosition;
            targetCell.figure = originalTargetFigure;
        }
    }

    public getCell(y: number, x: number): Cell {
        return this.cells[y][x];
    }

    public addLostFigure(figure: Figure): void {
        if (figure.color === Colors.BLACK) {
            this.lostBlackFigures.push(figure);
        } else {
            this.lostWhiteFigures.push(figure);
        }
    }

    private addFigure(
        figureClass: new (color: Colors, cell: Cell) => Figure,
        color: Colors,
        position: Position
    ): void {
        const cell = this.getCell(position.y, position.x);
        cell.figure = new figureClass(color, cell);
    }

    private addPawns(): void {
        for (let i = 0; i < 8; i++) {
            this.addFigure(Pawn, Colors.BLACK, { y: 1, x: i });
            this.addFigure(Pawn, Colors.WHITE, { y: 6, x: i });
        }
    }

    private addQueens(): void {
        this.addFigure(Queen, Colors.BLACK, { y: 0, x: 3 });
        this.addFigure(Queen, Colors.WHITE, { y: 7, x: 3 });
    }

    private addKings(): void {
        this.addFigure(King, Colors.BLACK, { y: 0, x: 4 });
        this.addFigure(King, Colors.WHITE, { y: 7, x: 4 });
    }

    private addBishops(): void {
        this.addFigure(Bishop, Colors.BLACK, { y: 0, x: 2 });
        this.addFigure(Bishop, Colors.BLACK, { y: 0, x: 5 });
        this.addFigure(Bishop, Colors.WHITE, { y: 7, x: 2 });
        this.addFigure(Bishop, Colors.WHITE, { y: 7, x: 5 });
    }

    private addKnights(): void {
        this.addFigure(Knight, Colors.BLACK, { y: 0, x: 1 });
        this.addFigure(Knight, Colors.BLACK, { y: 0, x: 6 });
        this.addFigure(Knight, Colors.WHITE, { y: 7, x: 1 });
        this.addFigure(Knight, Colors.WHITE, { y: 7, x: 6 });
    }

    private addRooks(): void {
        this.addFigure(Rook, Colors.BLACK, { y: 0, x: 0 });
        this.addFigure(Rook, Colors.BLACK, { y: 0, x: 7 });
        this.addFigure(Rook, Colors.WHITE, { y: 7, x: 0 });
        this.addFigure(Rook, Colors.WHITE, { y: 7, x: 7 });
    }

    public addFigures(): void {
        this.addKings();
        this.addPawns();
        this.addRooks();
        this.addQueens();
        this.addBishops();
        this.addKnights();
    }
}
