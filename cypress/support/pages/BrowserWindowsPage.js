import BasePage from "./BasePage";

// o Cypress não controla nova janela: faz stub do window.open e abre a URL na mesma aba
class BrowserWindowsPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      newWindowButton: "#windowButton",
      sampleHeading: "#sampleHeading",
    };
  }

  stubWindowOpen() {
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    return this;
  }

  clickNewWindow() {
    cy.get(this.selectors.newWindowButton).click();
    return this;
  }

  assertNewWindowWasOpened() {
    cy.get("@windowOpen")
      .should("have.been.calledOnce")
      .its("firstCall.args.0")
      .should("include", "/sample");
    return this;
  }

  visitOpenedWindow() {
    cy.get("@windowOpen")
      .its("firstCall.args.0")
      .then((url) => cy.visit(url));
    return this;
  }

  assertSampleMessage(message) {
    cy.get(this.selectors.sampleHeading).should("have.text", message);
    return this;
  }

  closeOpenedWindow() {
    cy.go("back");
    return this;
  }

  assertIsOnBrowserWindowsPage() {
    cy.location("pathname").should("eq", "/browser-windows");
    cy.get(this.selectors.newWindowButton).should("be.visible");
    return this;
  }
}

export default new BrowserWindowsPage();
