import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserData = {
  id: string;
  name: string;
  target: number;
  value: number;
};

const slice = createSlice({
  name: "user",
  initialState: [] as UserData[],
  reducers: {
    setUserData: (state, action: PayloadAction<UserData[]>) => action.payload,
  },
});

export const { setUserData } = slice.actions;
export default slice.reducer;
