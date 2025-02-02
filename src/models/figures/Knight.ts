import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/images/min-black-knight.png";
import yellowLogo from "../../assets/images/min-yellow-knight.png";

export class Knight extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.KNIGHT;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false;

        const dy = Math.abs(this.cell.y - target.y);
        const dx = Math.abs(this.cell.x - target.x);

        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }
}
