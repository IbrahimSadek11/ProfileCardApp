import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import { toast } from "react-toastify";

const API_URL = "/profile"; 

export const fetchProfiles = createAsyncThunk(
  "profiles/fetch",
  async (query = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await api.get(`${API_URL}?${params}`);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load profiles.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profiles/update",
  async (profileData, thunkAPI) => {
    try {
      const response = await api.put(`${API_URL}/update`, profileData);
      toast.success(response.data.message || "Profile updated successfully!");
      return profileData;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (!payload) {
          state.profiles = [];
          return;
        }

        if (Array.isArray(payload)) {
          state.profiles = payload;
          state.selectedProfile = null;
        } else {
          state.selectedProfile = payload;
          state.profiles = [];
        }
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.profiles.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.profiles[index] = { ...state.profiles[index], ...updated };
        }

        if (state.selectedProfile?.id === updated.id) {
          state.selectedProfile = { ...state.selectedProfile, ...updated };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
