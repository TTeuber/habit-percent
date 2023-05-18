import { configureStore } from "@reduxjs/toolkit";
import entryReducer from "./entrySlice";

const store = configureStore({
  reducer: {
    entries: entryReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
