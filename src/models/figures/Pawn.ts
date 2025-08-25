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

    canMove(target: Cell, checkingForAttack = false, _passingPawn: null | Cell = null): boolean {
        if (!super.canMove(target)) return false;

        const direction = this.color == Colors.BLACK ? 1 : -1;

        if (
            target.x === this.cell.x &&
            !checkingForAttack &&
            this.cell.board.getCell(target.y, target.x).isEmpty() &&
            (target.y === this.cell.y + direction ||
                (this.isFirstStep &&
                    target.y === this.cell.y + direction * 2 &&
                    this.cell.isEmptyVertical(target)))
        ) {
            return true;
        } else if (
            target.y === this.cell.y + direction &&
            (target.x === this.cell.x - 1 || target.x === this.cell.x + 1) &&
            (this.cell.isEnemy(target) ||
                checkingForAttack ||
                (_passingPawn?.x === target.x && _passingPawn?.y === target.y))
        ) {
            return true;
        }

        return false;
    }

    moveFigure(): void {
        this.isFirstStep = false;
    }
}
