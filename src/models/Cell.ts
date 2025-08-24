import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./figures/Figure";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.available = false;
        this.id = x;
    }

    public isFirstStep(y: Cell["y"], x: Cell["x"]): boolean {
        return this.board.getCell(y, x).figure?.hasFirstStep() || false;
    }

    public isEmpty(): boolean {
        return this.figure === null;
    }

    public isEnemy(target: Cell): boolean {
        return !!target.figure;
    }

    public isEmptyVertical(target: Cell): boolean {
        if (this.x !== target.x) {
            return false;
        }

        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if (!this.board.getCell(y, this.x).isEmpty()) {
                return false;
            }
        }

        return true;
    }

    public isEmptyHorizontal(target: Cell): boolean {
        if (this.y !== target.y) {
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++) {
            if (!this.board.getCell(this.y, x).isEmpty()) {
                return false;
            }
        }

        return true;
    }

    public isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        if (absX !== absY) return false;

        const dx = this.x < target.x ? 1 : -1;
        const dy = this.y < target.y ? 1 : -1;
        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.y + dy * i, this.x + dx * i).isEmpty()) return false;
        }

        return true;
    }

    private setFigure(figure: Figure): void {
        this.figure = figure;
        this.figure.cell = this;
    }

    public moveFigure(target: Cell): void {
        if (!this.figure) return;

        if (this.figure.name === FigureNames.KING) {
            this.handleKingMove(target);
        } else if (target.available) {
            this.executeMove(target);
        }
    }

    private handleKingMove(target: Cell): void {
        if (!this.figure) return;

        const isCastling = this.isCastlingMove(target);

        if (isCastling) {
            this.executeCastling(target);
        } else {
            this.executeMove(target);
        }
    }

    private isCastlingMove(target: Cell): boolean {
        if (!this.figure || this.figure.name !== FigureNames.KING) return false;

        const castlingPositions =
            this.figure.color === Colors.BLACK
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

    private executeCastling(target: Cell): void {
        if (!this.figure) return;

        const isBlack = this.figure.color === Colors.BLACK;
        const row = isBlack ? 0 : 7;

        if (target.x === 2) {
            this.executeLeftCastling(row);
        } else if (target.x === 6) {
            this.executeRightCastling(row);
        }
    }

    private executeLeftCastling(row: number): void {
        if (!this.figure) return;

        const cells = this.board.cells[row];
        const rookCell = cells[0];
        const rookTargetCell = cells[3];
        const kingTargetCell = cells[2];

        kingTargetCell.setFigure(this.figure);
        this.figure = null;

        if (rookCell.figure) {
            rookTargetCell.setFigure(rookCell.figure);
            rookCell.figure = null;
        }
    }

    private executeRightCastling(row: number): void {
        if (!this.figure) return;

        const cells = this.board.cells[row];
        const rookCell = cells[7];
        const rookTargetCell = cells[5];
        const kingTargetCell = cells[6];

        kingTargetCell.setFigure(this.figure);
        this.figure = null;

        if (rookCell.figure) {
            rookTargetCell.setFigure(rookCell.figure);
            rookCell.figure = null;
        }
    }

    private executeMove(target: Cell): void {
        if (!this.figure) return;

        this.figure.moveFigure();
        if (target.figure) this.board.addLostFigure(target.figure);
        target.setFigure(this.figure);
        this.figure = null;
    }
}
