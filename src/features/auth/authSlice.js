import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialUsers = [
  {
    id: "1",
    name: "Ibrahim Sadek",
    email: "ibrahimsadeck1@gmail.com",
    password: "123456",
    role: "admin",
    profileId: 1,
  },
  {
    id: "2",
    name: "Marwan Najmeddine",
    email: "marwannajmeddine1@gmail.com",
    password: "123456",
    role: "user",
    profileId: 2,
  },
  {
    id: "3",
    name: "Muhamad Abdulrahim",
    email: "farhanabdelrahman@gmail.com",
    password: "123456",
    role: "user",
    profileId: 3,
  },
  {
    id: "4",
    name: "Samer Khalil",
    email: "samerkhalil@gmail.com",
    password: "123456",
    role: "user",
    profileId: 4,
  },
  {
    id: "5",
    name: "Ali Hassan",
    email: "alihassan@gmail.com",
    password: "123456",
    role: "user",
    profileId: 5,
  },
  {
    id: "6",
    name: "Laith Mansour",
    email: "laithmansour@gmail.com",
    password: "123456",
    role: "user",
    profileId: 6,
  },
  {
    id: "7",
    name: "Omar Fakhry",
    email: "omarfakhry@gmail.com",
    password: "123456",
    role: "user",
    profileId: 7,
  },
];

const initialState = {
  users: initialUsers,
  currentUser: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: {
      prepare({ confirmPassword, email, ...user }) {
        return {
          payload: {
            id: nanoid(),
            role: "user",
            email: email.toLowerCase(),
            ...user,
          },
        };
      },
      reducer(state, action) {
        const exists = state.users.some((u) => u.email === action.payload.email);

        if (exists) {
          state.error = "Email already taken.";
          state.isAuthenticated = false;
        } else {
          state.users.push(action.payload);
          state.currentUser = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      },
    },

    login: (state, action) => {
      const email = action.payload.email.toLowerCase();
      const { password } = action.payload;

      const foundUser = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        state.currentUser = foundUser;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = "Invalid email or password.";
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { signup, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
