import http from "../../http-common";

export const getUsers = (params) => () =>
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

export const getUser = (id) => () =>
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

export const createUser = (params) => () =>
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

export const updateUser = (id, params) => () =>
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

export const activateUser = (id) => () =>
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

export const deactivateUser = (id) => () =>
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

export const deleteUser = (id) => () =>
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

export const getRoles = () => () =>
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

export const getAuthors = () => () =>
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

export const getBrands = (params) => () =>
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
  });
