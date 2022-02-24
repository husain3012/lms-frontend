import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import classroomReducer from "./classroomSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classroom: classroomReducer,
    ui: uiReducer,
  },
});
