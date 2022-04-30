import { combineReducers } from "@reduxjs/toolkit";
import login from "./loginSlice";
import message from "./messageSlice";
import notification from "./notificationSlice";
import user from "./userSlice";

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    login,
    message,
    notification,
    user,
    ...asyncReducers,
  });

  // Reset the redux store when user logged out
  if (action.type === "auth/user/userLoggedOut") {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
