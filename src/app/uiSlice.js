import { createSlice } from "@reduxjs/toolkit";
import { getDarkerColor } from "../utils/colors";

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    backDrop: false,
    modal: false,
    themeColor: null,
    themeColorDark: null,
  },
  reducers: {
    showModal: (state, action) => {
      state.modal = true;
      state.backDrop = true;
    },
    hideModal: (state) => {
      state.modal = false;
      state.backDrop = false;
    },
    setColorTheme: (state, action) => {
      state.themeColor = action.payload;
      state.themeColorDark = getDarkerColor(action.payload);
    },
  },
});

export const { showModal, hideModal, setColorTheme } = uiSlice.actions;
export default uiSlice.reducer;
