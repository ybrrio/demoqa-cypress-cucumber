import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import WebTablesPage from "../../pages/WebTablesPage";
import { buildWebTableRecord, buildWebTableRecords } from "../../factories/webTableFactory";
import { scenarioContext as ctx } from "../../utils/scenarioContext";

// Registro único (CRUD)
When("eu crio um novo registro com dados aleatórios", () => {
  const record = buildWebTableRecord();
  ctx.set("record", record);
  WebTablesPage.addRecord(record);
});

Then("o registro criado deve ser exibido na tabela", () => {
  WebTablesPage.assertRecordIsListed(ctx.get("record"));
});

When("eu edito o registro criado", () => {
  const original = ctx.get("record");
  // mantém o e-mail original pra continuar achando o registro
  const { email, ...changes } = buildWebTableRecord();
  ctx.set("record", { ...original, ...changes });
  WebTablesPage.editRecord(original.email, changes);
});

Then("o registro deve ser exibido com os dados atualizados", () => {
  WebTablesPage.assertRecordIsListed(ctx.get("record"));
});

When("eu deleto o registro criado", () => {
  WebTablesPage.deleteRecord(ctx.get("record").email);
});

Then("o registro não deve mais ser exibido na tabela", () => {
  WebTablesPage.assertRecordIsNotListed(ctx.get("record").email);
});

// Cenários negativos
When("eu tento criar um registro com o e-mail {string}", (email) => {
  WebTablesPage.tryAddRecord(buildWebTableRecord({ email }));
});

Then("o formulário de registro deve continuar aberto", () => {
  WebTablesPage.assertRecordFormIsOpen();
});

Then("o campo de e-mail do registro deve ser sinalizado como inválido", () => {
  WebTablesPage.assertRecordFieldIsInvalid("email");
});

// Bônus: vários registros
const createRecords = (records) => {
  ctx.set("records", records);
  records.forEach((record) => WebTablesPage.addRecord(record));
};

When("eu crio {int} novos registros com dados aleatórios", (quantity) => {
  createRecords(buildWebTableRecords(quantity));
});

When("eu crio os seguintes registros:", (dataTable) => {
  createRecords(dataTable.hashes());
});

Then("os {int} registros criados devem ser exibidos na tabela", (quantity) => {
  const records = ctx.get("records");
  expect(records, "registros criados no cenário").to.have.length(quantity);
  records.forEach((record) => WebTablesPage.assertRecordIsListed(record));
  WebTablesPage.clearSearch();
});

When("eu deleto todos os registros criados", () => {
  ctx.get("records").forEach(({ email }) => WebTablesPage.deleteRecord(email));
});

Then("nenhum dos registros criados deve ser exibido na tabela", () => {
  ctx.get("records").forEach(({ email }) => WebTablesPage.assertRecordIsNotListed(email));
});
