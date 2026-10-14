import { request } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const BookStoreService = {
  listBooks() {
    return request({ path: ENDPOINTS.books });
  },

  addBooksToUser({ userId, isbns, token }) {
    return request({
      method: "POST",
      path: ENDPOINTS.books,
      token,
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
    });
  },
};
