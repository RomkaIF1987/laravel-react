/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import jwtService from "../services/jwtService";
import { setUserData } from "./userSlice";
import { showMessage } from "./messageSlice";

const initialState = {
  success: false,
  message: "",
  errors: [],
  mode: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = initialState.success;
      state.message = initialState.message;
      state.errors = initialState.errors;
      state.mode = initialState.mode;
    },
    loginSuccess: (state) => {
      state.success = true;
      state.message = "";
      state.errors = [];
      state.mode = "login";
    },
    loginError: (state, action) => {
      state.success = false;
      state.message = action.payload?.response?.data?.message || action.payload?.message || "Error";
      state.errors = action.payload.errors;
      state.mode = "login";
    },
    forgotPasswordSuccess: (state, action) => {
      state.success = true;
      state.message = action?.payload?.message || "";
      state.errors = [];
      state.mode = "forgotPassword";
    },
    forgotPasswordError: (state, action) => {
      state.success = false;
      state.message = action.payload?.response?.data?.message || action.payload?.message || "Error";
      state.errors = action.payload.errors;
      state.mode = "forgotPassword";
    },
    resetPasswordSuccess: (state, action) => {
      state.success = true;
      state.message = action?.payload?.message || "";
      state.errors = [];
      state.mode = "resetPassword";
    },
    resetPasswordError: (state, action) => {
      state.success = false;
      state.message = action.payload?.response?.data?.message || action.payload?.message || "Error";
      state.errors = action.payload.errors;
      state.mode = "resetPassword";
    },
    checkResetPasswordTokenSuccess: (state, action) => {
      state.success = true;
      state.message = action?.payload?.message || "";
      state.errors = [];
      state.mode = "checkResetPasswordToken";
    },
    checkResetPasswordTokenError: (state, action) => {
      state.success = false;
      state.message = action.payload?.response?.data?.message || action.payload?.message || "Error";
      state.errors = action.payload.errors;
      state.mode = "checkResetPasswordToken";
    },
  },
  extraReducers: {},
});

export const {
  resetState,
  loginSuccess,
  loginError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
  checkResetPasswordTokenSuccess,
  checkResetPasswordTokenError,
} = loginSlice.actions;

export const submitLogin =
  ({ email, password }) =>
  async (dispatch) =>
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setUserData(user));
        return dispatch(loginSuccess());
      })
      .catch((errors) => {
        dispatch(showMessage({ message: errors.message, variant: "error" }));
        return dispatch(loginError(errors));
      });

export const submitForgotPassword =
  ({ email }) =>
  async (dispatch) =>
    jwtService
      .forgotPassword({ email })
      .then((response) => {
        dispatch(showMessage({ message: response.data.message || "Success", variant: "success" }));
        return dispatch(forgotPasswordSuccess({ message: response.data.message || "Success" }));
      })
      .catch((errors) => {
        dispatch(
          showMessage({
            message: errors?.response?.data?.message || errors?.message || "Error",
            variant: "error",
          })
        );
        return dispatch(forgotPasswordError(errors));
      });

export const submitResetPassword =
  ({ password, passwordConfirm, token = "" }) =>
  async (dispatch) =>
    jwtService
      .resetPassword({ password, password_confirmation: passwordConfirm }, token)
      .then((response) => {
        dispatch(
          showMessage({
            message: response.data?.message || "Success",
            variant: response.data?.status || "success",
          })
        );
        return dispatch(resetPasswordSuccess({ message: response.data.message || "Success" }));
      })
      .catch((errors) => {
        dispatch(
          showMessage({
            message: errors?.response?.data?.message || errors?.message || "Error",
            variant: "error",
          })
        );
        return dispatch(forgotPasswordError(errors));
      });

export const checkResetPasswordToken =
  ({ token = "" }) =>
  async (dispatch) =>
    jwtService
      .checkResetPasswordToken(token)
      .then((response) =>
        dispatch(checkResetPasswordTokenSuccess({ message: response.data.message || "Success" }))
      )
      .catch((errors) => {
        dispatch(
          showMessage({
            message: errors?.response?.data?.message || errors?.message || "Error",
            variant: "error",
          })
        );
        return dispatch(checkResetPasswordTokenError(errors));
      });

export default loginSlice.reducer;
