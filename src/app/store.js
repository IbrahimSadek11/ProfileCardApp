import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import authReducer from "../features/auth/authSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

/**
 * Persist only what you need.
 * We persist auth (so token/currentUser survive refresh) and tasks.
 */
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["currentUser", "isAuthenticated", "profiles"], // keep token via currentUser.token
};

const tasksPersistConfig = {
  key: "tasks",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: persistReducer(tasksPersistConfig, tasksReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
