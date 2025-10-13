import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/task", { params });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch tasks");
      return res.data.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/task", payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to create task");
      return { ...payload, id: res.data.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (payload, thunkAPI) => {
    try {
      const res = await api.put("/task", payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to update task");
      return payload;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/task/${id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to delete task");
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete task"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  meta: {
    priorities: ["Low", "Medium", "High"],
    statuses: ["Pending", "In Progress", "Completed", "Rejected"],
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => String(task.id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (task) => String(task.id) !== String(action.payload)
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default tasksSlice.reducer;
