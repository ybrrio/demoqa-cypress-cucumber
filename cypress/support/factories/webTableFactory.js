import { fakerPT_BR as faker } from "@faker-js/faker";

const DEPARTMENTS = ["Insurance", "Compliance", "Legal", "QA", "Engineering", "Finance", "Marketing"];

// o e-mail é usado pra achar o registro na tabela
export function buildWebTableRecord(overrides = {}) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `${faker.string.alphanumeric(10).toLowerCase()}@qa-teste.com`,
    age: String(faker.number.int({ min: 18, max: 70 })),
    salary: String(faker.number.int({ min: 1500, max: 25000 })),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    ...overrides,
  };
}

export function buildWebTableRecords(quantity) {
  return Array.from({ length: quantity }, () => buildWebTableRecord());
}
