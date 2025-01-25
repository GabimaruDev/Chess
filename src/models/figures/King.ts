import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/min-black-king.png";
import yellowLogo from "../../assets/min-yellow-king.png";

export class King extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.KING;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false;
        if (this.cell.board.castling(target, this.color)) return true;
        if (this.cell.board.isCellUnderAttack(target, this.color)) return false;

        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);
        return dx <= 1 && dy <= 1;
    }

    firstStep(): boolean {
        return this.isFirstStep;
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
