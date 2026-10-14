import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

// schemas usados via $ref
const SHARED_SCHEMAS = ["book"];

const registerSharedSchemas = () =>
  cy.wrap(SHARED_SCHEMAS, { log: false }).each((name) =>
    cy.fixture(`schemas/${name}.json`, { log: false }).then((schema) => {
      if (!ajv.getSchema(schema.$id)) ajv.addSchema(schema);
    }),
  );

// cy.wrap(response.body).validateSchema("createUser")
Cypress.Commands.add("validateSchema", { prevSubject: true }, (body, schemaName) => {
  registerSharedSchemas();
  return cy.fixture(`schemas/${schemaName}.json`).then((schema) => {
    const validate = ajv.compile(schema);
    const valid = validate(body);
    expect(valid, `Contrato "${schemaName}": ${ajv.errorsText(validate.errors)}`).to.be.true;
    return cy.wrap(body, { log: false });
  });
});

// o Sortable usa react-dnd (drag and drop nativo do HTML5), eventos de mouse não funcionam
Cypress.Commands.add("dragTo", { prevSubject: "element" }, (subject, target) => {
  cy.wrap(subject).scrollIntoView();

  return cy.window().then((win) => {
    const $target = Cypress.$(target);
    const from = subject[0].getBoundingClientRect();
    const to = $target[0].getBoundingClientRect();

    // precisa passar do meio do destino pro item trocar de lugar
    const movingDown = to.top > from.top;
    const point = {
      clientX: to.left + to.width / 2,
      clientY: movingDown ? to.top + to.height * 0.75 : to.top + to.height * 0.25,
    };
    const event = { dataTransfer: new win.DataTransfer() };

    // o react-dnd só processa o dragover no próximo frame
    const nextFrame = () => cy.then(() => new Cypress.Promise((resolve) => win.requestAnimationFrame(resolve)));

    cy.wrap(subject).trigger("dragstart", event);
    cy.wrap($target).trigger("dragenter", { ...event, ...point });
    cy.wrap($target).trigger("dragover", { ...event, ...point });
    nextFrame();
    cy.wrap($target).trigger("drop", { ...event, ...point });
    cy.wrap(subject).trigger("dragend", event);
  });
});
