import BasePage from "./BasePage";

class ProgressBarPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      startStopButton: "#startStopButton",
      resetButton: "#resetButton",
      progressBar: "#progressBar [role='progressbar']",
    };
  }

  progressValue() {
    return cy
      .get(this.selectors.progressBar, { log: false })
      .invoke({ log: false }, "attr", "aria-valuenow")
      .then(Number);
  }

  // cy.spy no clearInterval, registrado no Before da feature
  start() {
    cy.get("@clearInterval").invoke("resetHistory");
    cy.get(this.selectors.startStopButton).should("have.text", "Start").click();
    return this;
  }

  // espera chegar perto do limite e para (sem cy.wait)
  stopBefore(limit, margin = 10) {
    const minimum = limit - margin;
    cy.get(this.selectors.progressBar).should(($bar) => {
      const value = Number($bar.attr("aria-valuenow"));
      expect(value, "progresso").to.be.gte(minimum);
    });
    cy.get(this.selectors.startStopButton).should("have.text", "Stop").click();
    cy.get(this.selectors.startStopButton).should("have.text", "Start");
    return this;
  }

  assertValueAtMost(limit) {
    this.progressValue().should("be.lte", limit);
    return this;
  }

  waitUntilComplete() {
    cy.get(this.selectors.progressBar, { timeout: 30000 }).should("have.attr", "aria-valuenow", "100");
    // o timer só para uns ms depois de chegar em 100; resetar antes disso era sobrescrito (falhava no CI)
    cy.get("@clearInterval").should("have.been.called");
    return this;
  }

  reset() {
    cy.get(this.selectors.resetButton).should("be.visible").click();
    return this;
  }

  assertWasReset() {
    cy.get(this.selectors.progressBar).should("have.attr", "aria-valuenow", "0");
    cy.get(this.selectors.startStopButton).should("have.text", "Start");
    return this;
  }
}

export default new ProgressBarPage();
