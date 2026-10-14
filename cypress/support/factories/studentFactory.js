import { fakerPT_BR as faker } from "@faker-js/faker";

const GENDERS = ["Male", "Female", "Other"];
const HOBBIES = ["Sports", "Reading", "Music"];
const SUBJECTS = ["Maths", "English", "Physics", "Chemistry", "Computer Science", "History", "Biology"];
const STATES_AND_CITIES = {
  NCR: ["Delhi", "Gurgaon", "Noida"],
  "Uttar Pradesh": ["Agra", "Lucknow", "Merrut"],
  Haryana: ["Karnal", "Panipat"],
  Rajasthan: ["Jaipur", "Jaiselmer"],
};
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function buildStudent() {
  const state = faker.helpers.objectKey(STATES_AND_CITIES);
  // dia 10-28 pra não cair em mês curto nem ter zero à esquerda
  const birthDate = {
    day: faker.number.int({ min: 10, max: 28 }),
    monthIndex: faker.number.int({ min: 0, max: 11 }),
    year: faker.number.int({ min: 1960, max: 2005 }),
  };

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `${faker.string.alphanumeric(10).toLowerCase()}@qa-teste.com`,
    gender: faker.helpers.arrayElement(GENDERS),
    mobile: `9${faker.string.numeric(9)}`,
    birthDate,
    subjects: faker.helpers.arrayElements(SUBJECTS, { min: 1, max: 3 }),
    // mesma ordem que aparece no modal
    hobbies: faker.helpers
      .arrayElements(HOBBIES, { min: 1, max: 3 })
      .sort((a, b) => HOBBIES.indexOf(a) - HOBBIES.indexOf(b)),
    address: `${faker.location.streetAddress()} - ${faker.location.city()}`,
    state,
    city: faker.helpers.arrayElement(STATES_AND_CITIES[state]),
  };
}

// formato do modal: "15 March,1990"
export function formatBirthDate({ day, monthIndex, year }) {
  return `${String(day).padStart(2, "0")} ${MONTHS[monthIndex]},${year}`;
}

export { GENDERS, HOBBIES };
