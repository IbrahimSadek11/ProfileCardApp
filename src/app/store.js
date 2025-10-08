import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profiles/profileSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["currentUser", "isAuthenticated"], 
};

const tasksPersistConfig = {
  key: "tasks",
  storage,
};

const profilesPersistConfig = {
  key: "profiles",
  storage,
  blacklist: ["loading", "error"], 
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: persistReducer(tasksPersistConfig, tasksReducer),
  profiles: persistReducer(profilesPersistConfig, profileReducer), 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
