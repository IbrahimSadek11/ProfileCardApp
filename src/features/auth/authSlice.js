import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

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

const initialState = {
  currentUser: null,
  profiles: [],
  isAuthenticated: false,
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
    },
    updatedProfile(state, action) {
      const { id, changes } = action.payload;
      const profile = state.profiles.find((p) => String(p.id) === String(id));
      if (profile) Object.assign(profile, changes);
    },
    setProfiles(state, action) {
      state.profiles = action.payload || [];
    },
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
        state.isAuthenticated = true;
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
        state.isAuthenticated = true;
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

export const { logout, clearError, updatedProfile, setProfiles } =
  authSlice.actions;
export default authSlice.reducer;
