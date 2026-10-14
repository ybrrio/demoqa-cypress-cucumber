import { Before, After } from "@badeball/cypress-cucumber-preprocessor";
import { scenarioContext } from "../utils/scenarioContext";
import { AccountService } from "../api/AccountService";

Before(() => {
  scenarioContext.reset();
});

// apaga o usuário criado nos cenários de API
After({ tags: "@api" }, () => {
  const user = scenarioContext.get("user");
  const userId = scenarioContext.get("userId");
  if (!user || !userId) return;

  AccountService.generateToken(user).then(({ body }) => {
    if (body && body.token) {
      AccountService.deleteUser(userId, body.token);
    }
  });
});
