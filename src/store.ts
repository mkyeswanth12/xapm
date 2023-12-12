import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./reducers/alertReducer";
import composeReducer from "./reducers/composeReducer";
import containerReducer from "./reducers/containerReducer";
import imageReducer from "./reducers/imageReducer";
import logReducer from "./reducers/logReducer";
import userReducer from "./reducers/userReducer";
import sessionReducer from "./reducers/sessionReducer";
import volumeReducer from "./reducers/volumeReducer";

const store = configureStore({
  reducer: {
    containers: containerReducer,
    images: imageReducer,
    composes: composeReducer,
    sessions: sessionReducer,
    volumes: volumeReducer,
    logs: logReducer,
    users: userReducer,
    alerts: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
