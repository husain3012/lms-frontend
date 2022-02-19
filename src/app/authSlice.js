// Auth slice for redux toolkit

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginAction = createAsyncThunk("users/fetchByIdStatus", async (userData, thunkAPI) => {
  try {
    const { email, password, userType } = userData;

    const response = await axios.post(`/api/${userType}/login`, { email, password });
    console.log(response);
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
    },
    [loginAction.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {logout} = AuthSlice.actions;

export default AuthSlice.reducer;
