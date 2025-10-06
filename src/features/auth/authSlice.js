import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api"; // axios instance with baseURL & interceptor (see file below)

/**
 * Auth thunks
 */
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      return res.data; // { id, email, role, token }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
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
      return res.data; // { id, email, role, token }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password.";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const initialState = {
  currentUser: null,      // { id, email, role, token }
  profiles: [],           // will be filled client-side or after fetch
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
      // also remove token from storage
      try {
        localStorage.removeItem("token");
      } catch {}
    },
    clearError(state) {
      state.error = null;
    },
    /**
     * Keep this for your EditProfileModal
     */
    updatedProfile(state, action) {
      const { id, changes } = action.payload;
      const profile = state.profiles.find((p) => String(p.id) === String(id));
      if (profile) Object.assign(profile, changes);
    },
    /**
     * Seed/replace profiles (optional helper if you load them elsewhere)
     */
    setProfiles(state, action) {
      state.profiles = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        try {
          if (action.payload?.token) {
            localStorage.setItem("token", action.payload.token);
          }
        } catch {}
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        try {
          if (action.payload?.token) {
            localStorage.setItem("token", action.payload.token);
          }
        } catch {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updatedProfile, setProfiles } = authSlice.actions;
export default authSlice.reducer;
