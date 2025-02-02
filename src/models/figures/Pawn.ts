import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/images/min-black-pawn.png";
import yellowLogo from "../../assets/images/min-yellow-pawn.png";

export class Pawn extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.PAWN;
    }

    canMove(target: Cell, checkingForAttack = false): boolean {
        if (!super.canMove(target)) return false;

        const direction = this.cell.figure?.color == Colors.BLACK ? 1 : -1;
        const directionFirstStep = this.cell.figure?.color == Colors.BLACK ? 2 : -2;

        if (
            target.x === this.cell.x &&
            ((this.isFirstStep &&
                target.y === this.cell.y + directionFirstStep &&
                this.cell.isEmptyVertical(target)) ||
                target.y === this.cell.y + direction) &&
            this.cell.board.getCell(target.y, target.x).isEmpty() &&
            !checkingForAttack
        ) {
            return true;
        }

        if (
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
