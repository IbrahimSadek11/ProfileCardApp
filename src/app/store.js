import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import authReducer from "../features/auth/authSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
};

const tasksPersistConfig = {
  key: "tasks",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: persistReducer(tasksPersistConfig, tasksReducer),
});

const persistedReducer = rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
