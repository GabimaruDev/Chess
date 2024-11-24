import { Colors } from "../Colors";
import logo from "../../assets/black-bishop.png";
import { Cell } from "../Cell";

export enum FigureNames {
    "FIGURE" = "Фигура",
    "KING" = "Король",
    "QUEEN" = "Ферзь",
    "BISHOP" = "Слон",
    "KNIGHT" = "Конь",
    "ROOK" = "Ладья",
    "PAWN" = "Пешка",
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: Number;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = cell.x;
    }

    canMove(cell: Cell): boolean {
        return true;
    }

    moveFigure(target: Cell) {}
}
