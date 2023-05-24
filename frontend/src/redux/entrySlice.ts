import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type EntryData = {
  id: string;
  date: string;
  data: {
    category: string;
    activities: {
      name: string;
      completed: boolean;
    }[];
  }[];
};

type Entry = {
  id: string;
  date: string;
  activityId: string;
  userId: string;
  completed: boolean;
};

const slice = createSlice({
  name: "entry",
  initialState: [] as Entry[],
  reducers: {
    setEntries: (state, action: PayloadAction<Entry[]>) => action.payload,

    addEntry: (state, action: PayloadAction<Entry>) => [
      ...state,
      action.payload,
    ],

    updateEntry: (state, action: PayloadAction<Entry>) => {
      const { id, date, completed } = action.payload;
      if (state.find((entry) => entry.id === id)) {
        state.find(
          (entry) => entry.id === id && entry.date === date
        )!.completed = completed;
      }
      return state;
    },
  },
});

export const { setEntries, updateEntry, addEntry } = slice.actions;
export default slice.reducer;
