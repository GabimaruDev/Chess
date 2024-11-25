import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/min-black-queen.png";
import yellowLogo from "../../assets/min-yellow-queen.png";

export class Queen extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.QUEEN;
    }

    canMove(target: Cell): boolean {
    }
}
