import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

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
      return initialState;
    },
    setUser(state, action) {
      console.log("here", action.payload);
      return action.payload;
    },
  },
});

export const { login, logout, setUser } = sessionSlice.actions;
export default sessionSlice.reducer;

export const userLogin = async (credentials) => {
  return async (dispatch) => {
    try {
      const data = await loginService.login(credentials);
      console.log("the data", data);

      // window.localStorage.setItem("loggedInUser", JSON.stringify(data));
      // dispatch(setUser(data));
    } catch (exception) {
      console.log(exception);
    }
  };
};

export const userLogout = () => {
  return (dispatch) => {
    dispatch(logout);
  };
};
