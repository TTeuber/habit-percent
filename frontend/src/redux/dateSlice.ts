import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import moment from "moment";

const slice = createSlice({
  name: "date",
  initialState: moment().toDate(),
  reducers: {
    setDate: (state, action: PayloadAction<Date>) => action.payload,
    updateDate: (state, action: PayloadAction<number>) => {
      return moment(state).add(action.payload, "days").toDate();
    },
  },
});

export const { setDate, updateDate } = slice.actions;
export default slice.reducer;
