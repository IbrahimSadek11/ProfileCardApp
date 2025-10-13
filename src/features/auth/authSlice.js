import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    const exp = payload.exp * 1000; 
    return Date.now() < exp; 
  } catch {
    return false;
  }
};

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again.";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log(res);
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password.";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const savedToken = localStorage.getItem("token");
const validToken = isTokenValid(savedToken);

const initialState = {
  currentUser: validToken ? { token: savedToken } : null,
  isAuthenticated: validToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem("token");
      } catch {}
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = isTokenValid(action.payload?.token);
        try {
          if (action.payload?.token)
            localStorage.setItem("token", action.payload.token);
        } catch {}
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = isTokenValid(action.payload?.token);
        try {
          if (action.payload?.token)
            localStorage.setItem("token", action.payload.token);
        } catch {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError} = authSlice.actions;

export default authSlice.reducer;
