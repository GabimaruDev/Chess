import blackLogo from "../../assets/images/min-black-knight.png";
import yellowLogo from "../../assets/images/min-yellow-knight.png";
import { ICell } from "../../types";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";

export class Knight extends Figure {
  constructor(color: Colors, cell: ICell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : yellowLogo;
    this.name = FigureNames.KNIGHT;
  }

  canMove(target: ICell): boolean {
    if (!super.canMove(target)) {
      return false;
    } else {
      const dy = Math.abs(this.cell.y - target.y);
      const dx = Math.abs(this.cell.x - target.x);
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }
  }
}
