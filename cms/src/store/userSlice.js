import { createSlice } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import _ from "../utils/lodash";
import { showNotification } from "./notificationSlice";
import jwtService from "../services/jwtService";

const history = createBrowserHistory();
const initialState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: () => initialState,
  },
  extraReducers: {},
});

export const { setUser, userLoggedOut } = userSlice.actions;

export const setUserData = (user) => async (dispatch) => {
  history.location.state = {
    redirectUrl: user.redirectUrl,
  };
  dispatch(setUser(user));
};

export const updateUserData = (user) => async (dispatch) => {
  if (!user.role || user.role.length === 0) {
    return;
  }
  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showNotification({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showNotification({ message: error.message }));
    });
};

export const updateUserSettings = (settings) => async (dispatch, getState) => {
  const oldUser = getState().auth.user;
  const user = _.merge({}, oldUser, { data: { settings } });

  dispatch(updateUserData(user));

  return dispatch(setUserData(user));
};

export const logoutUser = () => async (dispatch) => {
  jwtService.logout();
  return dispatch(userLoggedOut());
};

export default userSlice.reducer;

export const isAuthenticated = (state) => Object.keys(state.user).length > 0;
