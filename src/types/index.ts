import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";

export interface BoardComponentProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player;
    swapPlayer: () => void;
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
}

export interface CellComponentProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    currentPlayer: Player;
}

export interface TimerProps {
    currentPlayer: Player;
    restart: () => void;
    isPaused: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    winner: Player | null;
    initGame: () => void;
    isStartGame: boolean;
}

export interface GameState {
    board: Board;
    currentPlayer: Player;
    selectedCell: Cell | null;
    gameOver: boolean;
    winner: Player | null;
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
