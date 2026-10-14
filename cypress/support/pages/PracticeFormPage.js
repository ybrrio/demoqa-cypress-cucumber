import BasePage from "./BasePage";

class PracticeFormPage extends BasePage {
  get selectors() {
    return {
      ...super.selectors,
      form: "#userForm",
      firstName: "#firstName",
      lastName: "#lastName",
      email: "#userEmail",
      genderInput: "#gender-radio-1",
      genderLabel: (index) => `label[for="gender-radio-${index}"]`,
      mobile: "#userNumber",
      birthDateInput: "#dateOfBirthInput",
      monthSelect: ".react-datepicker__month-select",
      yearSelect: ".react-datepicker__year-select",
      day: (day) =>
        `.react-datepicker__day--0${String(day).padStart(2, "0")}:not(.react-datepicker__day--outside-month)`,
      subjectsInput: "#subjectsInput",
      hobbyLabel: (index) => `label[for="hobbies-checkbox-${index}"]`,
      uploadPicture: "#uploadPicture",
      currentAddress: "#currentAddress",
      stateInput: "#state input",
      cityInput: "#city input",
      submit: "#submit",
      modal: ".modal-content",
      modalTitle: "#example-modal-sizes-title-lg",
      modalRows: ".modal-content tbody tr",
      closeModal: "#closeLargeModal",
    };
  }

  // índice usado no "for" dos labels
  static GENDER_INDEX = { Male: 1, Female: 2, Other: 3 };
  static HOBBY_INDEX = { Sports: 1, Reading: 2, Music: 3 };

  fillName(firstName, lastName) {
    this.fillInput(this.selectors.firstName, firstName);
    this.fillInput(this.selectors.lastName, lastName);
    return this;
  }

  fillEmail(email) {
    this.fillInput(this.selectors.email, email);
    return this;
  }

  selectGender(gender) {
    cy.get(this.selectors.genderLabel(PracticeFormPage.GENDER_INDEX[gender])).click();
    return this;
  }

  fillMobile(mobile) {
    this.fillInput(this.selectors.mobile, mobile);
    return this;
  }

  selectBirthDate({ day, monthIndex, year }) {
    cy.get(this.selectors.birthDateInput).click();
    cy.get(this.selectors.yearSelect).select(String(year));
    cy.get(this.selectors.monthSelect).select(String(monthIndex));
    cy.get(this.selectors.day(day)).click();
    return this;
  }

  addSubjects(subjects) {
    subjects.forEach((subject) => {
      cy.get(this.selectors.subjectsInput).type(`${subject}{enter}`);
    });
    return this;
  }

  selectHobbies(hobbies) {
    hobbies.forEach((hobby) => {
      cy.get(this.selectors.hobbyLabel(PracticeFormPage.HOBBY_INDEX[hobby])).click();
    });
    return this;
  }

  uploadFile(filePath) {
    cy.get(this.selectors.uploadPicture).selectFile(filePath);
    return this;
  }

  fillAddress(address) {
    this.fillInput(this.selectors.currentAddress, address);
    return this;
  }

  selectStateAndCity(state, city) {
    cy.get(this.selectors.stateInput).type(`${state}{enter}`);
    cy.get(this.selectors.cityInput).type(`${city}{enter}`);
    return this;
  }

  fillForm(student) {
    return this.fillName(student.firstName, student.lastName)
      .fillEmail(student.email)
      .selectGender(student.gender)
      .fillMobile(student.mobile)
      .selectBirthDate(student.birthDate)
      .addSubjects(student.subjects)
      .selectHobbies(student.hobbies)
      .fillAddress(student.address)
      .selectStateAndCity(student.state, student.city);
  }

  submit() {
    cy.get(this.selectors.submit).scrollIntoView();
    cy.get(this.selectors.submit).click();
    return this;
  }

  assertModalIsVisible() {
    cy.get(this.selectors.modal).should("be.visible");
    cy.get(this.selectors.modalTitle).should("have.text", "Thanks for submitting the form");
    return this;
  }

  assertModalValue(label, expectedValue) {
    cy.contains(this.selectors.modalRows, label)
      .find("td")
      .eq(1)
      .should("have.text", expectedValue);
    return this;
  }

  closeModal() {
    cy.get(this.selectors.closeModal).click();
    return this;
  }

  assertModalIsClosed() {
    cy.get(this.selectors.modal).should("not.exist");
    return this;
  }

  // was-validated garante que o submit aconteceu antes de checar que o modal não abriu
  assertSubmissionWasBlocked() {
    cy.get(this.selectors.form).should("have.class", "was-validated");
    cy.get(this.selectors.modal).should("not.exist");
    return this;
  }

  assertRequiredFieldsAreInvalid() {
    this.assertFieldIsInvalid(this.selectors.firstName, "First Name");
    this.assertFieldIsInvalid(this.selectors.lastName, "Last Name");
    this.assertFieldIsInvalid(this.selectors.genderInput, "Gender");
    this.assertFieldIsInvalid(this.selectors.mobile, "Mobile");
    return this;
  }
}

export default new PracticeFormPage();
