import { createSlice } from "@reduxjs/toolkit";
import initialProfiles from "../../data/Profile";

const initialUsers = [
  {
    id: "1",
    email: "ibrahimsadeck1@gmail.com",
    password: "Hakuna&123",
    role: "admin",
  },
  {
    id: "2",
    email: "marwannajmeddine1@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
  {
    id: "3",
    email: "farhanabdelrahman@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
  {
    id: "4",
    email: "samerkhalil@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
  {
    id: "5",
    email: "alihassan@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
  {
    id: "6",
    email: "laithmansour@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
  {
    id: "7",
    email: "omarfakhry@gmail.com",
    password: "Hakuna&123",
    role: "user",
  },
];

const initialState = {
  users: initialUsers,      
  profiles: initialProfiles,
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
            email: email.toLowerCase(),
            userData: user,
          },
        };
      },
      reducer(state, action) {
        const { email, userData } = action.payload;

        const exists = state.users.some((u) => u.email === email);
        if (exists) {
          state.error = "Email already taken.";
          state.isAuthenticated = false;
          return;
        }

        const newId = String(state.users.length + 1);

        const newUser = {
          id: newId,
          role: "user",
          email,
          password: userData.password,
        };

        const newProfile = {
          id: newId,
          name: userData.name,
          job: userData.job || "unknown position",
          phone: userData.phone || "unknown number",
          email,
          image: require("../../assets/default.png"),
        };

        state.users.push(newUser);
        state.profiles.push(newProfile);

        state.currentUser = newUser;
        state.isAuthenticated = true;
        state.error = null;
      },
    },

    login: (state, action) => {
      const email = action.payload.email.toLowerCase();
      const { password } = action.payload;

      const foundUser = state.users.find((u) => u.email === email && u.password === password);

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
    updatedProfile: (state, action) => {
      const { id, changes } = action.payload;
      const profile = state.profiles.find((p) => String(p.id) === String(id));
      if (profile) {
        Object.assign(profile, changes);
      }
    },
  },
});

export const { signup, login, logout, clearError, updatedProfile } = authSlice.actions;
export default authSlice.reducer;
