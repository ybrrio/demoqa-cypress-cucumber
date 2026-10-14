import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import SortablePage, { NUMBER_WORDS } from "../../pages/SortablePage";
import { scenarioContext as ctx } from "../../utils/scenarioContext";

const byNumericValue = (a, b) => NUMBER_WORDS.indexOf(a) - NUMBER_WORDS.indexOf(b);

Given("que os itens da lista estão em ordem decrescente", () => {
  SortablePage.openListTab();
  SortablePage.currentOrder().then((items) => {
    const ascending = [...items].sort(byNumericValue);
    ctx.set("ascendingOrder", ascending);

    const descending = [...ascending].reverse();
    SortablePage.reorderTo(descending).assertOrder(descending);
  });
});

When("eu ordeno os itens da lista em ordem crescente usando drag and drop", () => {
  SortablePage.reorderTo(ctx.get("ascendingOrder"));
});

Then("os itens da lista devem estar em ordem crescente", () => {
  SortablePage.assertOrder(ctx.get("ascendingOrder"));
});
