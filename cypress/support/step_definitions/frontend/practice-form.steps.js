import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import PracticeFormPage from "../../pages/PracticeFormPage";
import { buildStudent, formatBirthDate } from "../../factories/studentFactory";
import { scenarioContext as ctx } from "../../utils/scenarioContext";

const UPLOAD_FOLDER = "cypress/fixtures/upload";

const fillWithRandomStudent = () => {
  const student = buildStudent();
  ctx.set("student", student);
  cy.log(`Aluno gerado: ${JSON.stringify(student)}`);
  PracticeFormPage.fillForm(student);
};

Given("que eu submeti o formulário preenchido com valores aleatórios", () => {
  fillWithRandomStudent();
  PracticeFormPage.submit().assertModalIsVisible();
});

When("eu preencho todo o formulário com valores aleatórios", () => {
  fillWithRandomStudent();
});

When("eu faço o upload do arquivo {string}", (fileName) => {
  ctx.set("uploadedFile", fileName);
  PracticeFormPage.uploadFile(`${UPLOAD_FOLDER}/${fileName}`);
});

When("eu submeto o formulário", () => {
  PracticeFormPage.submit();
});

Then("um popup de confirmação deve ser aberto", () => {
  PracticeFormPage.assertModalIsVisible();
});

Then("o popup deve exibir os dados informados", () => {
  const student = ctx.get("student");
  const expected = {
    "Student Name": `${student.firstName} ${student.lastName}`,
    "Student Email": student.email,
    Gender: student.gender,
    Mobile: student.mobile,
    "Date of Birth": formatBirthDate(student.birthDate),
    Subjects: student.subjects.join(", "),
    Hobbies: student.hobbies.join(", "),
    Picture: ctx.get("uploadedFile"),
    Address: student.address,
    "State and City": `${student.state} ${student.city}`,
  };

  Object.entries(expected).forEach(([label, value]) => {
    PracticeFormPage.assertModalValue(label, value);
  });
});

When("eu informo o celular {string}", (mobile) => {
  PracticeFormPage.fillMobile(mobile);
});

Then("o popup de confirmação não deve ser aberto", () => {
  PracticeFormPage.assertSubmissionWasBlocked();
});

Then("os campos obrigatórios devem ser sinalizados como inválidos", () => {
  PracticeFormPage.assertRequiredFieldsAreInvalid();
});

Then("o campo de celular deve ser sinalizado como inválido", () => {
  PracticeFormPage.assertFieldIsInvalid(PracticeFormPage.selectors.mobile, "Mobile");
});

When("eu fecho o popup", () => {
  PracticeFormPage.closeModal();
});

Then("o popup não deve mais ser exibido", () => {
  PracticeFormPage.assertModalIsClosed();
});
