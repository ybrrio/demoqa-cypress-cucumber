import BasePage from "./BasePage";

class HomePage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      card: ".card",
    };
  }

  visit() {
    cy.visit("/");
    cy.get(this.selectors.card).should("have.length.greaterThan", 0);
    return this;
  }

  chooseCard(cardName) {
    cy.contains(this.selectors.card, cardName).scrollIntoView();
    cy.contains(this.selectors.card, cardName).click();
    return this;
  }
}

export default new HomePage();
