import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const notifSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    warning(state, action) {
      toast(action.payload);
    },
    success(state, action) {
      toast(action.payload);
    },
  },
});

export const { warning, remove } = notifSlice.actions;
export default notifSlice.reducer;

export const setNotification = (message) => {
  return (dispatch) => {
    dispatch(warning(message));
    setTimeout(() => {
      dispatch(remove());
    }, 5000);
  };
};
