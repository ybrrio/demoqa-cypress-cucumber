export default class BasePage {
  get selectors() {
    return {
      // no <li> o clique caía fora do link em itens de texto curto (ex.: Web Tables)
      sideMenuItem: ".menu-list li a",
      pageTitle: "h1, .main-header",
    };
  }

  openSubmenu(submenu) {
    cy.contains(this.selectors.sideMenuItem, submenu).scrollIntoView();
    cy.contains(this.selectors.sideMenuItem, submenu).click();
    return this;
  }

  fillInput(selector, value) {
    cy.get(selector).clear();
    cy.get(selector).type(value);
    return this;
  }

  // validação nativa do HTML5
  assertFieldIsInvalid(selector, fieldName = selector) {
    cy.get(selector).should(($field) => {
      expect($field[0].checkValidity(), `campo "${fieldName}" válido`).to.be.false;
    });
    return this;
  }

  assertPageTitle(title) {
    cy.get(this.selectors.pageTitle).should("contain.text", title);
    return this;
  }
}
