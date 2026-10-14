import BasePage from "./BasePage";

// busca os registros pelo e-mail, assim não depende da paginação
class WebTablesPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      addButton: "#addNewRecordButton",
      searchBox: "#searchBox",
      row: ".rt-tbody .rt-tr-group, table tbody tr",
      headerCell: ".rt-thead.-header .rt-th, table thead th",
      cell: ".rt-td, td",
      editButton: "[title='Edit'], [id^='edit-record']",
      deleteButton: "[title='Delete'], [id^='delete-record']",
      form: {
        firstName: "#firstName",
        lastName: "#lastName",
        email: "#userEmail",
        age: "#age",
        salary: "#salary",
        department: "#department",
        submit: "#submit",
      },
      modal: ".modal-content",
    };
  }

  // campo -> cabeçalho da coluna
  static COLUMNS = {
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    email: "Email",
    salary: "Salary",
    department: "Department",
  };

  submitRecordForm(record) {
    const { form } = this.selectors;
    Object.entries(record).forEach(([field, value]) => {
      this.fillInput(form[field], value);
    });
    cy.get(form.submit).click();
    return this;
  }

  fillRecordForm(record) {
    this.submitRecordForm(record);
    cy.get(this.selectors.modal).should("not.exist");
    return this;
  }

  addRecord(record) {
    cy.get(this.selectors.addButton).click();
    return this.fillRecordForm(record);
  }

  tryAddRecord(record) {
    cy.get(this.selectors.addButton).click();
    return this.submitRecordForm(record);
  }

  assertRecordFormIsOpen() {
    cy.get(this.selectors.modal).should("be.visible");
    cy.get(this.selectors.form.submit).should("be.visible");
    return this;
  }

  assertRecordFieldIsInvalid(field) {
    return this.assertFieldIsInvalid(this.selectors.form[field], WebTablesPage.COLUMNS[field]);
  }

  search(term) {
    this.fillInput(this.selectors.searchBox, term);
    return this;
  }

  clearSearch() {
    cy.get(this.selectors.searchBox).clear();
    return this;
  }

  rowByEmail(email) {
    this.search(email);
    return cy.contains(this.selectors.row, email);
  }

  editRecord(email, changes) {
    this.rowByEmail(email).find(this.selectors.editButton).click();
    return this.fillRecordForm(changes);
  }

  deleteRecord(email) {
    this.rowByEmail(email).find(this.selectors.deleteButton).click();
    return this;
  }

  // valida coluna por coluna (contains na linha toda dava falso positivo, ex.: 25 dentro de 2500)
  assertRecordIsListed(record) {
    this.search(record.email);
    cy.get(this.selectors.headerCell).then(($headers) => {
      const headers = [...$headers].map((th) => th.innerText.trim());

      cy.contains(this.selectors.row, record.email)
        .find(this.selectors.cell)
        .should(($cells) => {
          Object.entries(record).forEach(([field, value]) => {
            const column = WebTablesPage.COLUMNS[field];
            const index = headers.indexOf(column);
            expect(index, `coluna "${column}" no cabeçalho`).to.be.gte(0);
            expect($cells.eq(index).text().trim(), column).to.eq(String(value));
          });
        });
    });
    return this;
  }

  assertRecordIsNotListed(email) {
    this.search(email);
    cy.contains(this.selectors.row, email).should("not.exist");
    return this;
  }
}

export default new WebTablesPage();
