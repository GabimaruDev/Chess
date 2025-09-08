import blackLogo from "../../assets/images/min-black-queen.png";
import yellowLogo from "../../assets/images/min-yellow-queen.png";
import { ICell } from "../../types";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";

export class Queen extends Figure {
  constructor(color: Colors, cell: ICell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
    this.name = FigureNames.QUEEN;
  }

  canMove(target: ICell): boolean {
    if (!super.canMove(target)) return false;
    if (this.cell.isEmptyHorizontal(target)) return true;
    if (this.cell.isEmptyVertical(target)) return true;
    if (this.cell.isEmptyDiagonal(target)) return true;
    return false;
  }
}
