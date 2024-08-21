import { createSlice, current } from "@reduxjs/toolkit";

const notifSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    set(state, action) {
      return action.payload;
    },
    remove(state, action) {
      return "";
    },
  },
});

export const { set, remove } = notifSlice.actions;
export default notifSlice.reducer;

export const setNotification = (message) => {
  console.log("Hello");

  return (dispatch) => {
    dispatch(set(message));
    setTimeout(() => {
      dispatch(remove());
    }, 5000);
  };
};
