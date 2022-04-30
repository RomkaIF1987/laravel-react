import axios from "axios";

export const baseURL = process.env.REACT_APP_API_BASE_URL || "";
export const baseApiURL = baseURL ? `${baseURL}/api` : "";

const instance = axios.create({
  baseURL: baseApiURL,
  timeout: process.env.REACT_APP_API_REQUEST_TIMEOUT || 30000,
});

export default instance;
