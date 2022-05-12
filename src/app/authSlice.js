// Auth slice for redux toolkit
import { makeToast } from "../components/common/Toast";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAction = createAsyncThunk(process.env.REACT_APP_BACKEND + "users/fetchByIdStatus", async (userData, thunkAPI) => {
  const { email, password, userType } = userData;

  try {
    const response = await axios.post(`/api/${userType}/login`, { email, password });
    console.log(response);
    console.log("triggering login");

    // save user data to local storage
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
    loading: false,
    type: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      state.type = null;
      localStorage.removeItem("user");
    },
    loginExistingUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
      state.type = action.payload.type;
    },
  },
  extraReducers: {
    [loginAction.pending]: (state, action) => {
      state.loading = true;
    },
    [loginAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.type = action.payload.type;
      makeToast.success("Login Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    [loginAction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;

      makeToast.error(action.payload.message, {
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

export const { logout, loginExistingUser } = AuthSlice.actions;

export default AuthSlice.reducer;
