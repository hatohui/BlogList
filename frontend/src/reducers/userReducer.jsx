import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (exception) {
      const message = exception.response.data.error;
      dispatch(setNotification(message));
    }
  };
};
