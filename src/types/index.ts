import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";

export interface CellComponentProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
}

export interface TimerProps {
    isPaused: boolean;
    isStartGame: boolean;
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

export interface GameState {
    board: Board;
    advancedPawnCell: Cell | null,
    currentPlayer: Player;
    selectedCell: Cell | null;
    gameOver: boolean;
    winner: Player | null;
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
}