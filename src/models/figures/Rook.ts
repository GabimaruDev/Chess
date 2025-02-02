import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/images/min-black-rook.png";
import yellowLogo from "../../assets/images/min-yellow-rook.png";

export class Rook extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.ROOK;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false;
        if (this.cell.isEmptyVertical(target)) return true;
        if (this.cell.isEmptyHorizontal(target)) return true;
        return false;
    }

    firstStep(): boolean {
        return this.isFirstStep;
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
