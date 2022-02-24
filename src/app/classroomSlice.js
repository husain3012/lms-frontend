// Auth slice for redux toolkit
import { makeToast } from "../components/common/Toast";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getClassroomsAction = createAsyncThunk(process.env.REACT_APP_BACKEND + "classrooms/fetchAll", async (_, { getState }) => {
  const { token, type: userType } = getState().auth;

  console.log(userType);
  console.log(token);
  let backend_host;
  if (process.env.NODE_ENV === "development") {
    backend_host = "";
  } else {
    backend_host = "https://lms-backend-jmi.herokuapp.com";
  }

  try {
    const response = await axios.get(`${backend_host}/api/classroom/${userType === "teacher" ? "created" : "joined"}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});



const ClassroomSlice = createSlice({
  name: "classroom",
  initialState: {
    classrooms: [],
    loading: false,
    error: null,
  },
  reducers: {
    reorderClassrooms: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      if (destinationIndex === sourceIndex) {
        return;
      }
      const newClasses = [...state.classrooms];
      const [removed] = newClasses.splice(sourceIndex, 1);
      newClasses.splice(destinationIndex, 0, removed);
      state.classrooms = newClasses;
    },
  },

  extraReducers: {
    [getClassroomsAction.pending]: (state, action) => {
      state.loading = true;
    },
    [getClassroomsAction.fulfilled]: (state, action) => {
      state.classrooms = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getClassroomsAction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      makeToast.error("ERROR", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  },
});

export const { reorderClassrooms } = ClassroomSlice.actions;

export default ClassroomSlice.reducer;


