/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import axios from "axios";
import Helper from "../../utils/helper";
import http, { baseApiURL, baseURL } from "../../http-common";
import LocalStorage from "../../utils/localStorage";

class JwtService extends Helper.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    http.interceptors.request.use(
      (config) => {
        config.headers["Content-Type"] = "application/json";
        const session = this.getSession();
        if (session && session.expires) {
          if (session.expires > Math.floor(Date.now() / 1000) || config.__isRetryRequest) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
            return config;
          }
          const originRequest = config;
          const user = this.getUserInfo();
          return this.refreshToken(user.id, session.refresh_token)
            .then((response) => {
              originRequest.headers.Authorization = `Bearer ${response.access_token}`;
              return Promise.resolve(originRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    http.interceptors.response.use(
      (response) => response,
      (error) =>
        new Promise(() => {
          if (
            error.response &&
            error.response.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid Access Token");
            this.setSession(null);
          }
          console.log("error", error);
          throw error;
        })
    );
  };

  handleAuthentication = () => {
    const accessToken = this.getAccessToken();
    if (this.isAuthTokenValid(accessToken)) {
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "accessToken expired");
    }
  };

  signInWithEmailAndPassword = (email, password) => {
    const grantType = process.env.REACT_APP_AUTH_LOGIN_GRANT_TYPE;
    const clientId = process.env.REACT_APP_AUTH_LOGIN_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_AUTH_LOGIN_CLIENT_SECRET;
    return new Promise((resolve, reject) => {
      http
        .post(`${baseURL}/oauth/token`, {
          username: email,
          password,
          grant_type: grantType,
          client_id: clientId,
          client_secret: clientSecret,
        })
        .then(async (response) => {
          if (response.data && response.data.access_token) {
            const user = await this.getLoggedInUser(response.data.access_token);
            let responseData = {
              token: response.data,
            };
            if (user.data && user.data.role_id) {
              if (
                user.data.role_id > 2 &&
                (user.data.permissions === "undefined" || user.data.permissions.length === 0)
              ) {
                this.setSession(null);
                this.emit("onAutoLogout", "Insufficient permissions");
                reject(new Error("Insufficient permissions"));
              } else {
                responseData = {
                  token: response.data,
                  user: user.data,
                };
                this.setSession(responseData);
                resolve(responseData.user);
              }
            } else {
              this.setSession(null);
              this.emit("onAutoLogout", "Insufficient permissions");
              reject(new Error("Insufficient permissions"));
            }
          } else if (response?.data?.error) {
            reject(response.data.error);
          } else {
            reject(new Error("Error"));
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  };

  getAuthUserData = (token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      http
        .get("/user", {
          headers,
        })
        .then((response) => {
          if (response.data) {
            this.setSession(response.data);
            resolve(response.data);
          } else if (response?.data?.error) {
            reject(response.data.error);
          } else {
            reject(new Error("Error"));
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  };

  getLoggedInUser = (token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      http
        .get("/logged_in", {
          headers,
        })
        .then((response) => {
          if (response.data) {
            this.setSession(response.data);
            resolve(response.data);
          } else if (response?.data?.error) {
            reject(response.data.error);
          } else {
            reject(new Error("Error"));
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  };

  refreshToken = (user, token) => {
    const grantType = process.env.REACT_APP_AUTH_REFRESH_GRANT_TYPE;
    const clientId = process.env.REACT_APP_AUTH_REFRESH_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_AUTH_REFRESH_CLIENT_SECRET;
    const request = axios.create({
      baseURL: baseApiURL,
      timeout: process.env.VUE_APP_API_REQUEST_TIMEOUT || 30000,
    });
    return new Promise((resolve, reject) => {
      request
        .post(`${baseURL}/oauth/token`, {
          refresh_token: token,
          grant_type: grantType,
          client_id: clientId,
          client_secret: clientSecret,
        })
        .then((response) => {
          if (response.data) {
            const responseData = {
              token: response.data,
            };
            this.setSession(responseData);
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  };

  forgotPassword = (data) =>
    new Promise((resolve, reject) => {
      http
        .post("/password/forgot", data)
        .then((response) => {
          if (response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  resetPassword = (data, token) =>
    new Promise((resolve, reject) => {
      http
        .post(`/password/reset?token=${token}`, data)
        .then((response) => {
          if (response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  checkResetPasswordToken = (token) =>
    new Promise((resolve, reject) => {
      http
        .get(`/password/reset/${token}`)
        .then((response) => {
          if (response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  setSession = (jwt) => {
    if (jwt) {
      if (jwt.token) {
        LocalStorage.setItem("NpgJWT", {
          access_token: jwt.token.access_token,
          refresh_token: jwt.token.refresh_token,
          expires: Date.now() + jwt.token.expires_in * 1000,
        });
      }
      if (jwt.user) {
        LocalStorage.setItem("NpgUser", jwt.user);
      }
    } else {
      LocalStorage.removeItem("NpgJWT");
      LocalStorage.removeItem("NpgUser");
    }
  };

  logout = () => {
    const session = this.getSession();
    if (session?.access_token) {
      const headers = {
        Authorization: `Bearer ${session.access_token}`,
      };
      return new Promise((resolve, reject) => {
        http
          .get("/logout", { headers })
          .then((response) => {
            if (response?.data?.message) {
              resolve(response.data.message);
              this.setSession(null);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              reject(error.response.data);
            } else {
              reject(error);
            }
          });
      });
    }
    return this.setSession(null);
  };

  isAuthTokenValid = (accessToken) => accessToken;

  getAccessToken = () => {
    const NpgJWT = LocalStorage.getItem("NpgJWT") || {};
    return NpgJWT && NpgJWT.access_token ? NpgJWT.access_token : "";
  };

  getSession = () => {
    const NpgJWT = LocalStorage.getItem("NpgJWT") || {};
    return NpgJWT || null;
  };

  getUserInfo = () => {
    const NpgUser = LocalStorage.getItem("NpgUser") || {};
    return NpgUser || null;
  };

  hasUserInfo = () => LocalStorage.hasItem("NpgUser");
}

const instance = new JwtService();

export default instance;
