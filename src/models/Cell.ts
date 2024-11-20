import { Board } from "./Board";
import { Figure } from "./figures/Figure";
import { Colors } from "./Colors";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    avaliable: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.avaliable = false;
        this.id = x;
    }
}
