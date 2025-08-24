import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Colors } from "../models/Colors";
import { GameState } from "../types";

const initialState: GameState = {
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
    setGameStatus: (
      state,
      action: PayloadAction<{
        gameOver: boolean;
        winner: { color: Colors } | null;
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
  setGameStatus,
} = slice.actions;

export default slice.reducer;