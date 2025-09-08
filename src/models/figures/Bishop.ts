import blackLogo from "../../assets/images/min-black-bishop.png";
import yellowLogo from "../../assets/images/min-yellow-bishop.png";
import { ICell } from "../../types";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";

export class Bishop extends Figure {
  constructor(color: Colors, cell: ICell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
    this.name = FigureNames.BISHOP;
  }

  canMove(target: ICell): boolean {
    if (!super.canMove(target)) return false;
    if (this.cell.isEmptyDiagonal(target)) return true;
    return false;
  }
}
