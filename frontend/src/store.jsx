import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import sessionReducer from "./reducers/sessionReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    session: sessionReducer,
  },
});

export default store;
