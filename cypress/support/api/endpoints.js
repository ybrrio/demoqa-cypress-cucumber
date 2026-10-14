export const ENDPOINTS = {
  user: "/Account/v1/User",
  userById: (userId) => `/Account/v1/User/${userId}`,
  generateToken: "/Account/v1/GenerateToken",
  authorized: "/Account/v1/Authorized",
  books: "/BookStore/v1/Books",
};
