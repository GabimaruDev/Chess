import { Figure, FigureNames } from "./Figure";
import { Colors } from "../Colors";
import { Cell } from "../Cell";
import blackLogo from "../../assets/min-black-rook.png";
import yellowLogo from "../../assets/min-yellow-rook.png";

export class Rook extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
        this.name = FigureNames.ROOK;
    }

    canMove(target: Cell): boolean {
    }
}
