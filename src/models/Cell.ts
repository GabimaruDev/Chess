import { Board } from "./Board";
import { Figure, FigureNames } from "./figures/Figure";
import { Colors } from "./Colors";
import { Rook } from "./figures/Rook";

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
        if (this.board.getCell(y, x).figure?.firstStep()) {
            return true;
        }
        return false;
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

    private setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }

    public moveFigure(target: Cell) {
        if (this.figure && this.figure.canMove(target)) {
            this.figure.moveFigure();
            if (target.figure) {
                this.board.addLostFigure(target.figure);
            }
            target.setFigure(this.figure);
            this.figure = null;
        } else if (this.figure?.name === FigureNames.KING) {
            if (this.figure?.color === Colors.BLACK) {
                if (
                    target === this.board.cells[0][2]
                ) {
                    target.setFigure(this.figure);
                    this.figure = null;
                    this.board.cells[0][0].figure = null;
                    new Rook(Colors.BLACK, this.board.cells[0][3]);
                } else if (
                    target === this.board.cells[0][6]
                ) {
                    target.setFigure(this.figure);
                    this.figure = null;
                    this.board.cells[0][7].figure = null;
                    new Rook(Colors.BLACK, this.board.cells[0][5]);
                } else {
                    this.figure.moveFigure();
                    if (target.figure) {
                        this.board.addLostFigure(target.figure);
                    }
                    target.setFigure(this.figure);
                    this.figure = null;
                }
            } else if (this.figure?.color === Colors.WHITE) {
                if (
                    target === this.board.cells[7][2]
                ) {
                    target.setFigure(this.figure);
                    this.figure = null;
                    this.board.cells[7][0].figure = null;
                    new Rook(Colors.WHITE, this.board.cells[7][3]);
                } else if (
                    target === this.board.cells[7][6]
                ) {
                    target.setFigure(this.figure);
                    this.figure = null;
                    this.board.cells[7][7].figure = null;
                    new Rook(Colors.WHITE, this.board.cells[7][5]);
                } else {
                    this.figure.moveFigure();
                    if (target.figure) {
                        this.board.addLostFigure(target.figure);
                    }
                    target.setFigure(this.figure);
                    this.figure = null;
                }
            }
        }
    }
}
