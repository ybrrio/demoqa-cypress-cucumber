import BasePage from "./BasePage";

export const NUMBER_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

class SortablePage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      listTab: "#demo-tab-list",
      listItems: "#demo-tabpane-list .list-group-item",
    };
  }

  openListTab() {
    cy.get(this.selectors.listTab).click();
    return this;
  }

  currentOrder() {
    return cy.get(this.selectors.listItems).then(($items) => [...$items].map((el) => el.innerText.trim()));
  }

  // arrasta o item certo pra cada posição, relendo a lista a cada passo
  reorderTo(expected) {
    const placeAt = (index) => {
      if (index >= expected.length) return;

      this.currentOrder().then((current) => {
        const fromIndex = current.indexOf(expected[index]);

        if (fromIndex !== index) {
          cy.get(this.selectors.listItems).then(($items) => {
            cy.wrap($items.eq(fromIndex)).dragTo($items.eq(index));
          });
          cy.get(this.selectors.listItems).eq(index).should("have.text", expected[index]);
        }

        cy.then(() => placeAt(index + 1));
      });
    };

    placeAt(0);
    return this;
  }

  assertOrder(expected) {
    this.currentOrder().should("deep.equal", expected);
    return this;
  }
}

export default new SortablePage();
