import { ICell, IFigure } from "../../types";
import { Colors } from "../Colors";

export const enum FigureNames {
  "FIGURE" = "Фигура",
  "KING" = "Король",
  "QUEEN" = "Ферзь",
  "BISHOP" = "Слон",
  "KNIGHT" = "Конь",
  "ROOK" = "Ладья",
  "PAWN" = "Пешка",
}

export class Figure implements IFigure {
  color: Colors;
  logo: string | null;
  cell: ICell;
  name: FigureNames;
  id: number;
  isFirstStep: boolean = true;

  constructor(color: Colors, cell: ICell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
  }

  public canMove(
    target: ICell,
    _checkingForAttack = false,
    _passingPawn: null | ICell = null
  ): boolean {
    if (target.figure?.color === this.color) return false;
    return true;
  }

  public moveFigure() {}

  public hasFirstStep(): boolean | null {
    return this.isFirstStep;
  }
}
