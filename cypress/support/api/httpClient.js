// failOnStatusCode: false pra validar o status nos steps (inclusive nos negativos)
const apiUrl = () => Cypress.expose("apiUrl");

export function request({ method = "GET", path, body, token, headers = {} }) {
  return cy.request({
    method,
    url: `${apiUrl()}${path}`,
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    failOnStatusCode: false,
  });
}
