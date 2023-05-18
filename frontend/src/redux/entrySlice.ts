import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type EntryData = {
  id: string;
  date: Date;
  data: {
    category: string;
    activities: {
      name: string;
      completed: boolean;
    }[];
  }[];
};

interface EntryState {
  data: EntryData[];
}

const initialState: EntryState = { data: [] };

const slice = createSlice({
  name: "entry",
  initialState: initialState.data,
  reducers: {
    setEntries: (state, action: PayloadAction<EntryData[]>) => action.payload,
    addEntry: (state, action: PayloadAction<EntryData>) => [
      ...state,
      action.payload,
    ],
    updateEntry: (state, action: PayloadAction<EntryData>) => {
      const index = state.findIndex(
        (entry) => entry.date === action.payload.date
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setEntries, updateEntry, addEntry } = slice.actions;
export default slice.reducer;
