import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";
import { AccountService } from "../../api/AccountService";
import { BookStoreService } from "../../api/BookStoreService";
import { buildValidUser, buildUserWithWeakPassword } from "../../factories/userFactory";
import { scenarioContext as ctx } from "../../utils/scenarioContext";

// Dado
Given("que eu possuo os dados de um novo usuário válido", () => {
  ctx.set("user", buildValidUser());
});

Given("que o usuário possui uma senha fraca", () => {
  ctx.set("user", buildUserWithWeakPassword());
});

// Usuário
When("(que )eu crio o usuário", () => {
  AccountService.createUser(ctx.get("user")).then((response) => {
    ctx.set("lastResponse", response);
    if (response.status === 201) {
      ctx.set("userId", response.body.userID);
    }
  });
});

Then("o usuário deve ser criado com sucesso", () => {
  const response = ctx.get("lastResponse");
  expect(response.status).to.eq(201);
  expect(response.body.username).to.eq(ctx.get("user").userName);
  expect(response.body.books).to.be.an("array").that.is.empty;
  cy.wrap(response.body).validateSchema("createUser");
});

// Autenticação
When("eu gero um token de acesso", () => {
  AccountService.generateToken(ctx.get("user")).then((response) => {
    ctx.set("lastResponse", response);
    ctx.set("token", response.body.token);
  });
});

Then("o token deve ser gerado com sucesso", () => {
  const response = ctx.get("lastResponse");
  expect(response.status).to.eq(200);
  expect(response.body.status).to.eq("Success");
  expect(response.body.result).to.eq("User authorized successfully.");
  expect(response.body.token).to.be.a("string").and.not.be.empty;
  cy.wrap(response.body).validateSchema("generateToken");
});

When("eu verifico se o usuário está autorizado", () => {
  AccountService.isAuthorized(ctx.get("user")).then((response) => {
    ctx.set("lastResponse", response);
  });
});

Then("o usuário deve estar autorizado", () => {
  const response = ctx.get("lastResponse");
  expect(response.status).to.eq(200);
  expect(response.body).to.eq(true);
});

// Livros
When("(que )eu listo os livros disponíveis", () => {
  BookStoreService.listBooks().then((response) => {
    ctx.set("lastResponse", response);
    ctx.set("availableBooks", response.body.books);
  });
});

Then("a lista de livros deve ser retornada com sucesso", () => {
  const response = ctx.get("lastResponse");
  expect(response.status).to.eq(200);
  expect(response.body.books).to.be.an("array").and.have.length.greaterThan(1);
  cy.wrap(response.body).validateSchema("books");
});

When("eu alugo {int} livros da lista", (quantity) => {
  const chosenBooks = faker.helpers.arrayElements(ctx.get("availableBooks"), quantity);
  ctx.set("chosenBooks", chosenBooks);
  cy.log(`Livros escolhidos: ${chosenBooks.map((book) => book.title).join(" | ")}`);

  BookStoreService.addBooksToUser({
    userId: ctx.get("userId"),
    isbns: chosenBooks.map((book) => book.isbn),
    token: ctx.get("token"),
  }).then((response) => ctx.set("lastResponse", response));
});

When("eu tento alugar {int} livro(s) sem token de acesso", (quantity) => {
  const chosenBooks = faker.helpers.arrayElements(ctx.get("availableBooks"), quantity);

  BookStoreService.addBooksToUser({
    userId: ctx.get("userId"),
    isbns: chosenBooks.map((book) => book.isbn),
  }).then((response) => ctx.set("lastResponse", response));
});

Then("os livros devem ser adicionados à coleção do usuário", () => {
  const response = ctx.get("lastResponse");
  const expectedIsbns = ctx.get("chosenBooks").map((book) => book.isbn);

  expect(response.status).to.eq(201);
  cy.wrap(response.body).validateSchema("addBooks");
  expect(response.body.books.map((book) => book.isbn)).to.have.members(expectedIsbns);
});

// Detalhes do usuário
When("eu consulto os detalhes do usuário", () => {
  AccountService.getUser(ctx.get("userId"), ctx.get("token")).then((response) => {
    ctx.set("lastResponse", response);
  });
});

Then("os detalhes do usuário devem conter os livros alugados", () => {
  const response = ctx.get("lastResponse");
  const chosenBooks = ctx.get("chosenBooks");

  expect(response.status).to.eq(200);
  cy.wrap(response.body).validateSchema("userDetails");
  expect(response.body.userId).to.eq(ctx.get("userId"));
  expect(response.body.username).to.eq(ctx.get("user").userName);
  expect(response.body.books).to.have.length(chosenBooks.length);
  expect(response.body.books.map((book) => book.isbn)).to.have.members(chosenBooks.map((b) => b.isbn));
  expect(response.body.books.map((book) => book.title)).to.have.members(chosenBooks.map((b) => b.title));
});

// Cenários negativos
Then("a API deve responder com status {int} e código de erro {string}", (status, code) => {
  const response = ctx.get("lastResponse");
  expect(response.status).to.eq(status);
  expect(String(response.body.code)).to.eq(code);
  expect(response.body.message).to.be.a("string").and.not.be.empty;
  cy.wrap(response.body).validateSchema("error");
});
