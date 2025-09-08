import { IBoard, ICell, IFigure, Position } from "../types";
import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { FigureNames } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export class Board implements IBoard {
  cells: ICell[][] = [];
  lostBlackFigures: IFigure[] = [];
  lostWhiteFigures: IFigure[] = [];
  advancedPawnCell: ICell | null = null;
  passingPawn: ICell | null = null;

  public initCells(): void {
    this.cells = Array.from({ length: 8 }, (_, y) =>
      Array.from(
        { length: 8 },
        (_, x) => new Cell(this, x, y, (x + y) % 2 ? Colors.BLACK : Colors.WHITE, null)
      )
    );
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells.map((row) => [...row]);
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.advancedPawnCell = this.advancedPawnCell;
    newBoard.passingPawn = this.passingPawn;
    return newBoard;
  }

  public highlightCells(selectedCell: ICell | null): void {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.available = this.isAvailableHighlight(selectedCell, cell);
      });
    });
  }

  private isAvailableHighlight(selectedCell: ICell | null, target: ICell): boolean {
    if (!selectedCell?.figure) return false;

    if (selectedCell.figure.name === FigureNames.KING) {
      return this.handleKingHighlight(selectedCell, target);
    }

    if (
      selectedCell.figure.name === FigureNames.PAWN &&
      this.passingPawn?.x === target.x &&
      this.passingPawn?.y === target.y
    ) {
      return this.isMoveSafe(selectedCell.figure, target);
    }

    return this.isMoveSafe(selectedCell.figure, target);
  }

  private handleKingHighlight(selectedCell: ICell, target: ICell): boolean {
    return this.isMoveSafe(selectedCell.figure!, target);
  }

  public castling(target: ICell, color: Colors): boolean {
    const isBlack = color === Colors.BLACK;
    const row = isBlack ? 0 : 7;

    if (target.y !== row) return false;

    if (target.x === 2) {
      return this.canCastle(row, color, "left");
    } else if (target.x === 6) {
      return this.canCastle(row, color, "right");
    }

    return false;
  }

  private checkEmptyCellsBetween(startX: number, endX: number, y: number): boolean {
    const step = startX < endX ? 1 : -1;
    for (let x = startX + step; x !== endX; x += step) {
      if (this.getCell(y, x).figure) return false;
    }
    return true;
  }

  private canCastle(row: number, color: Colors, side: "left" | "right"): boolean {
    const kingCell = this.cells[row][4];
    const rookIndex = side === "left" ? 0 : 7;
    const rookCell = this.cells[row][rookIndex];

    if (!kingCell.figure || !rookCell.figure) return false;
    if (kingCell.figure.name !== FigureNames.KING || rookCell.figure.name !== FigureNames.ROOK)
      return false;
    if (kingCell.figure.color !== color || rookCell.figure.color !== color) return false;

    if (!kingCell.figure.hasFirstStep() || !rookCell.figure.hasFirstStep()) {
      return false;
    }

    const startX = side === "left" ? 0 : 4;
    const endX = side === "left" ? 4 : 7;
    if (!this.checkEmptyCellsBetween(startX, endX, row)) return false;

    const passFrom = side === "left" ? 2 : 4;
    const passTo = side === "left" ? 4 : 6;
    for (let x = passFrom; x <= passTo; x++) {
      if (this.isCellUnderAttack(this.getCell(row, x), color)) {
        return false;
      }
    }

    return true;
  }

  public isCellUnderAttack(target: ICell, color: Colors): boolean {
    return this.cells.some((row) =>
      row.some((cell) => {
        const figure = cell.figure;
        return figure?.color !== color && figure?.canMove(target, true);
      })
    );
  }

  public isFigureProtected(figure: IFigure): boolean {
    return this.cells.some((row) =>
      row.some((cell) => {
        const attackingFigure = cell.figure;
        return (
          attackingFigure?.color === figure.color &&
          attackingFigure !== figure &&
          attackingFigure.canMove(figure.cell, true)
        );
      })
    );
  }

  public isKingMoveSafe(king: IFigure, targetCell: ICell): boolean {
    const originalTargetFigure = targetCell.figure;
    const originalKingCell = king.cell;

    targetCell.figure = king;
    king.cell = targetCell;
    originalKingCell.figure = null;

    const isSafe = !this.isCellUnderAttack(targetCell, king.color);

    originalKingCell.figure = king;
    king.cell = originalKingCell;
    targetCell.figure = originalTargetFigure;

    return isSafe;
  }

  public isKingInCheck(color: Colors): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    return this.isCellUnderAttack(king.cell, color);
  }

  public isCheckmate(color: Colors): boolean {
    return this.isKingInCheck(color) && !this.hasValidMoves(color);
  }

  public isStalemate(color: Colors): boolean {
    return !this.isKingInCheck(color) && !this.hasValidMoves(color);
  }

  private findKing(color: Colors): IFigure | null {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.figure?.name === FigureNames.KING && cell.figure.color === color) {
          return cell.figure;
        }
      }
    }
    return null;
  }

  private hasValidMoves(color: Colors): boolean {
    for (const row of this.cells) {
      for (const cell of row) {
        const figure = cell.figure;
        if (!figure || figure.color !== color) continue;
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            const target = this.getCell(y, x);
            if (figure.canMove(target, false)) {
              if (this.isMoveSafe(figure, target)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  public isMoveSafe(figure: IFigure, targetCell: ICell): boolean {
    const originalTargetFigure = targetCell.figure;
    const originalPosition = figure.cell;

    try {
      if (!figure.canMove(targetCell, false, this.passingPawn)) return false;
      targetCell.figure = figure;
      figure.cell = targetCell;
      originalPosition.figure = null;
      return !this.isKingInCheck(figure.color);
    } finally {
      originalPosition.figure = figure;
      figure.cell = originalPosition;
      targetCell.figure = originalTargetFigure;
    }
  }

  public getCell(y: number, x: number): ICell {
    return this.cells[y][x];
  }

  public addLostFigure(figure: IFigure): void {
    if (figure.color === Colors.BLACK) {
      this.lostBlackFigures.push(figure);
    } else {
      this.lostWhiteFigures.push(figure);
    }
  }

  private addFigure(
    figureClass: new (color: Colors, cell: ICell) => IFigure,
    color: Colors,
    position: Position
  ): void {
    const cell = this.getCell(position.y, position.x);
    cell.figure = new figureClass(color, cell);
  }

  public addFigures(): void {
    [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook].forEach((cls, i) => {
      this.addFigure(cls, Colors.BLACK, { y: 0, x: i });
      this.addFigure(cls, Colors.WHITE, { y: 7, x: i });
    });

    for (let i = 0; i < 8; i++) {
      this.addFigure(Pawn, Colors.BLACK, { y: 1, x: i });
      this.addFigure(Pawn, Colors.WHITE, { y: 6, x: i });
    }
  }
}
