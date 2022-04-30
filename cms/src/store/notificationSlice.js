/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
  options: {
    title: "",
    message: "",
    type: "",
    timeout: 6000,
  },
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
      };
    },
    hideNotification: (state) => {
      state.state = false;
    },
  },
});

export const { hideNotification, showNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
