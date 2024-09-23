import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import sessionReducer from "./reducers/sessionReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    session: sessionReducer,
    blogs: blogReducer,
    users: userReducer,
  },
});

export default store;
