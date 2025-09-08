import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";

export interface BoardComponentProps {
  board: IBoard;
  setBoard: (board: IBoard) => void;
  currentPlayer: Player;
  swapPlayer: () => void;
  selectedCell: ICell | null;
  setSelectedCell: (cell: ICell | null) => void;
}

export interface CellComponentProps {
  cell: ICell;
  selected: boolean;
  click: (cell: ICell) => void;
  currentPlayer: Player;
  isCurrentKingInCheck?: boolean;
}

export interface IBoard {
  getCell(y: number, x: number): ICell;
  addLostFigure(figure: IFigure): void;
  isCellUnderAttack(target: ICell, color: Colors): boolean;
  isKingInCheck(color: Colors): boolean;
  isMoveSafe(figure: IFigure, targetCell: ICell): boolean;
  isFigureProtected(figure: IFigure): boolean;
  isKingMoveSafe(king: IFigure, targetCell: ICell): boolean;
  castling(target: ICell, color: Colors): boolean;
  getCopyBoard(): IBoard;
  highlightCells(selectedCell: ICell | null, color: Colors): void;
  isCheckmate(color: Colors): boolean;
  isStalemate(color: Colors): boolean;
  cells: ICell[][];
  lostBlackFigures: IFigure[];
  lostWhiteFigures: IFigure[];
  advancedPawnCell: ICell | null;
  passingPawn: ICell | null;
}

export interface ICell {
  readonly x: number;
  readonly y: number;
  readonly color: Colors;
  figure: IFigure | null;
  available: boolean;
  id: number;
  board: IBoard;
  isEmpty(): boolean;
  isEmptyVertical(target: ICell): boolean;
  isEmptyHorizontal(target: ICell): boolean;
  isEmptyDiagonal(target: ICell): boolean;
  moveFigure(target: ICell): void;
  setFigure(figure: IFigure): void;
}

export interface IFigure {
  color: Colors;
  logo: string | null;
  name: FigureNames;
  id: number;
  isFirstStep: boolean | null;
  cell: ICell;
  canMove(target: ICell, checkingForAttack?: boolean, passingPawn?: ICell | null): boolean;
  moveFigure(): void;
  hasFirstStep(): boolean | null;
}

export interface GameInfoProps {
  currentPlayer: Player;
  restart: () => void;
  initGame: () => void;
  isStartGame: boolean;
  hasAdvancedPawn: boolean;
  figuresArray: [IFigure[], IFigure[]];
}

export interface GameState {
  gameOver: boolean;
  winner: { color: Colors } | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export type Position = {
  y: number;
  x: number;
};

export type MoveResult = {
  success: boolean;
  message?: string;
  check?: boolean;
  checkmate?: boolean;
};

export type GameStatus = {
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: Player | null;
};
