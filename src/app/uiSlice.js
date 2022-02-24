import { createSlice } from "@reduxjs/toolkit";

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    backDrop: false,
    modal: false,
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
  },
});

export const { showModal, hideModal } = uiSlice.actions;
export default uiSlice.reducer;
