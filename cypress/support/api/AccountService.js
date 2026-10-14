import { request } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const AccountService = {
  createUser({ userName, password }) {
    return request({ method: "POST", path: ENDPOINTS.user, body: { userName, password } });
  },

  generateToken({ userName, password }) {
    return request({ method: "POST", path: ENDPOINTS.generateToken, body: { userName, password } });
  },

  isAuthorized({ userName, password }) {
    return request({ method: "POST", path: ENDPOINTS.authorized, body: { userName, password } });
  },

  getUser(userId, token) {
    return request({ path: ENDPOINTS.userById(userId), token });
  },

  deleteUser(userId, token) {
    return request({ method: "DELETE", path: ENDPOINTS.userById(userId), token });
  },
};
