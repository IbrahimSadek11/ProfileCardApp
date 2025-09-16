import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    added: {
      prepare(task) {
        return { payload: { id: nanoid(), ...task } };
      },
      reducer(state, action) {
        state.items.push(action.payload);
      }
    },
    updated(state, action) {
      const { id, changes } = action.payload;
      const t = state.items.find(x => String(x.id) === String(id));
      if (t) Object.assign(t, changes);
    },
    removed(state, action) {
      const id = action.payload;
      state.items = state.items.filter(x => String(x.id) !== String(id));
    },
  },
});

export const { added, updated, removed } = tasksSlice.actions;
export default tasksSlice.reducer;
