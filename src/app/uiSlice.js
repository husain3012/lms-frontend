import { createSlice } from "@reduxjs/toolkit";

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    backDrop: false,
  },
  reducers: {
    enableBackDrop: (state) => {
      state.backDrop = true;
    },
    disableBackDrop: (state) => {
      state.backDrop = false;
    },
  },
});

export const { enableBackDrop, disableBackDrop } = uiSlice.actions;
export default uiSlice.reducer;