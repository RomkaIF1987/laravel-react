/* eslint-disable class-methods-use-this */
import { BaseCRUDService } from "../baseCRUDService/baseCRUDService";

class UsersService extends BaseCRUDService {
  constructor(apiUrl = "/users") {
    super(apiUrl);
  }

  /* getUsers = (params) => () =>
    new Promise((resolve, reject) => {
      http
        .get("/users", { params })
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  getUser = (id) => () =>
    new Promise((resolve, reject) => {
      http
        .get(`/users/${id}`)
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  createUser = (params) => () =>
    new Promise((resolve, reject) => {
      http
        .post("/users", params)
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  updateUser = (id, params) => () =>
    new Promise((resolve, reject) => {
      http
        .put(`/users/${id}`, params)
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  activateUser = (id) => () =>
    new Promise((resolve, reject) => {
      http
        .put(`/users/${id}/activate`)
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  deactivateUser = (id) => () =>
    new Promise((resolve, reject) => {
      http
        .put(`/users/${id}/deactivate`)
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  deleteUser = (id) => () =>
    new Promise((resolve, reject) => {
      http
        .delete(`/users/${id}`)
        .then((response) => {
          if (response?.status === 200) {
            resolve();
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  getRoles = () => () =>
    new Promise((resolve, reject) => {
      http
        .get("/roles")
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  getAuthors = () => () =>
    new Promise((resolve, reject) => {
      http
        .get("/authors")
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });

  getBrands = (params) => () =>
    new Promise((resolve, reject) => {
      http
        .get("/brands", { params })
        .then((response) => {
          if (response?.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    }); */
}

export default new UsersService();
export { UsersService };
