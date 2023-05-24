import { configureStore } from "@reduxjs/toolkit";
import entryReducer from "./entrySlice";
import userReducer from "./userSlice";
import dateReducer from "./dateSlice";

const store = configureStore({
  reducer: {
    entries: entryReducer,
    user: userReducer,
    date: dateReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
