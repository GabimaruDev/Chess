import { Colors } from "../Colors";
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
    logo: string | null;
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

    canMove(target: Cell): boolean {
        if (target.figure?.color === this.color || target.figure?.name == FigureNames.KING) return false;
        return true;
    }
}
