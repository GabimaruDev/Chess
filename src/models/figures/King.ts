import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/images/min-black-king.png";
import yellowLogo from "../../assets/images/min-yellow-king.png";

export class King extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.KING;
    }

    canMove(target: Cell, checkingForAttack = false): boolean {
        if (!super.canMove(target)) {
            return false;
        } else if (this.cell.board.castling(target, this.color)) {
            return true;
        } else if (!checkingForAttack && this.cell.board.isCellUnderAttack(target, this.color)) {
            return false;
        } else {
            const dx = Math.abs(this.cell.x - target.x);
            const dy = Math.abs(this.cell.y - target.y);
            return dx <= 1 && dy <= 1;
        }
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
