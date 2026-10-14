import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../../pages/HomePage";

Given("que eu acesso a página inicial do DemoQA", () => {
  HomePage.visit();
});

When("eu escolho a opção {string} na página inicial", (cardName) => {
  HomePage.chooseCard(cardName);
});

When("eu clico no submenu {string}", (submenu) => {
  HomePage.openSubmenu(submenu).assertPageTitle(submenu);
});
