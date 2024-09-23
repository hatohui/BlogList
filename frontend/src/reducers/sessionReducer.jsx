import { createSlice } from "@reduxjs/toolkit";
import { setNotification } from "./notificationReducer";
import loginService from "../services/login";
import { useSelector } from "react-redux";
import blogService from "../services/blogs.js";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    name: "",
    username: "",
    token: "",
  },
  reducers: {
    logout(state, action) {
      window.localStorage.removeItem("loggedInUser");
      return {
        name: "",
        username: "",
        token: "",
      };
    },
    setUser(state, action) {
      window.localStorage.setItem(
        "loggedInUser",
        JSON.stringify(action.payload)
      );
      blogService.setToken(action.payload.token);
      return action.payload;
    },
  },
});

export const { login, logout, setUser } = sessionSlice.actions;
export default sessionSlice.reducer;

//handle login
export const userLogin = (credentials, navigate) => {
  return async (dispatch) => {
    try {
      const data = await loginService.login(credentials);
      const newToken = "Bearer " + data.token;
      blogService.setToken(newToken);
      dispatch(setUser({ ...data, token: newToken }));
      navigate(-1);
    } catch (exception) {
      const message = exception.response.data.error;
      dispatch(setNotification(message));
    }
  };
};

//log out
export const userLogout = () => {
  blogService.setToken(null);
  return (dispatch) => {
    dispatch(logout());
  };
};

//use login
export const isLoggedIn = () => {
  const loggedInUser = window.localStorage.getItem("loggedInUser");
  if (!loggedInUser) return false;
  return true;
};
