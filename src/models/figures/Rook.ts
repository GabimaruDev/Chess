import blackLogo from "../../assets/images/min-black-rook.png";
import yellowLogo from "../../assets/images/min-yellow-rook.png";
import { ICell } from "../../types";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";

export class Rook extends Figure {
  constructor(color: Colors, cell: ICell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
    this.name = FigureNames.ROOK;
    this.isFirstStep = true;
  }

  canMove(target: ICell): boolean {
    if (!super.canMove(target)) return false;
    if (this.cell.isEmptyVertical(target)) return true;
    if (this.cell.isEmptyHorizontal(target)) return true;
    return false;
  }

  moveFigure(): void {
    this.isFirstStep = false;
  }
}
