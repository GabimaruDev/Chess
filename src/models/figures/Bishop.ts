import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/images/min-black-bishop.png";
import yellowLogo from "../../assets/images/min-yellow-bishop.png";

export class Bishop extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.BISHOP;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false;
        if (this.cell.isEmptyDiagonal(target)) return true;
        return false;
    }
}
