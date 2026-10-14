import { faker } from "@faker-js/faker";

// senha: mín. 8 caracteres, com maiúscula, minúscula, número e especial
// timestamp no username pra não repetir entre execuções
export function buildValidUser() {
  return {
    userName: `qa_${faker.string.alphanumeric(6).toLowerCase()}_${Date.now()}`,
    password: `Qa@${faker.string.alphanumeric(8)}9z`,
  };
}

export function buildUserWithWeakPassword() {
  return {
    ...buildValidUser(),
    password: "senha123",
  };
}
