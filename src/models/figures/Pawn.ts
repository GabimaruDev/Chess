import blackLogo from "../../assets/images/min-black-pawn.png";
import yellowLogo from "../../assets/images/min-yellow-pawn.png";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";

export class Pawn extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.PAWN;
    }

    canMove(target: Cell, checkingForAttack = false): boolean {
        if (!super.canMove(target)) return false;

        const direction = this.color == Colors.BLACK ? 1 : -1;
        const directionFirstStep = this.color == Colors.BLACK ? 2 : -2;
        const isForward = target.x === this.cell.x;

        if (
            isForward &&
            !checkingForAttack
        ) {
            if (
                target.y === this.cell.y + direction &&
                this.cell.board.getCell(target.y, target.x).isEmpty() &&
                !checkingForAttack) {
                return true;
            } else if (this.isFirstStep &&
                target.y === this.cell.y + directionFirstStep &&
                this.cell.isEmptyVertical(target)) {
                return true;
            }
        } else if (
            (target.x === this.cell.x - 1 || target.x === this.cell.x + 1) &&
            target.y === this.cell.y + direction &&
            (this.cell.isEnemy(target) || checkingForAttack)
        ) {
            return true;
        }

        return false;
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
