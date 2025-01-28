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
    id: number;
    isFirstStep: boolean | null = null;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
    }

    public canMove(target: Cell, _checkingForAttack = false): boolean {
        if (target.figure?.color === this.color) return false;
        return true;
    }

    public moveFigure() {}

    public firstStep(): boolean | null {
        return this.isFirstStep;
    }
}
