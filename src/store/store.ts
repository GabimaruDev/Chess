import { configureStore } from "@reduxjs/toolkit";
import slice from "./slices";

const store = configureStore({
  reducer: {
    chess: slice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;