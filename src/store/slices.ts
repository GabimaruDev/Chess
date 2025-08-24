import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";
import { GameState } from "../types";

const initialState: GameState = {
  board: new Board(),
  advancedPawnCell: null,
  currentPlayer: new Player(Colors.WHITE),
  selectedCell: null,
  gameOver: false,
  winner: null,
  isCheck: false,
  isCheckmate: false,
  isStalemate: false,
};

const slice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
    },
    swapPlayer: (state, action: PayloadAction<Player>) => {
      state.currentPlayer = action.payload;
    },
    setSelectedCell: (state, action: PayloadAction<Cell | null>) => {
      state.selectedCell = action.payload;
    },
    setGameStatus: (
      state,
      action: PayloadAction<{
        gameOver: boolean;
        winner: Player | null;
        isCheck: boolean;
        isCheckmate: boolean;
        isStalemate: boolean;
      }>
    ) => {
      state.gameOver = action.payload.gameOver;
      state.winner = action.payload.winner;
      state.isCheck = action.payload.isCheck;
      state.isCheckmate = action.payload.isCheckmate;
      state.isStalemate = action.payload.isStalemate;
    },
  }
});

export const {
  setBoard,
  swapPlayer,
  setSelectedCell,
  setGameStatus,
} = slice.actions;

export default slice.reducer;