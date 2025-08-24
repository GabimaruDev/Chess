import blackLogo from "../../assets/images/min-black-king.png";
import yellowLogo from "../../assets/images/min-yellow-king.png";
import { Cell } from "../Cell";
import { Colors } from "../../types";
import { Figure, FigureNames } from "./Figure";

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
        }

        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);
        if (dx > 1 || dy > 1) {
            return false;
        } else if (checkingForAttack) {
            return true;
        } else if (this.cell.board.isCellUnderAttack(target, this.color)) {
            return false;
        } else if (target.figure && this.cell.board.isFigureProtected(target.figure)) {
            return false;
        }

        return this.cell.board.isKingMoveSafe(this, target);
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
