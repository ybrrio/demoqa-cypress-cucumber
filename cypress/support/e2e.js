import "./commands";
import { blockThirdPartyNoise, hideAdsOnLoad, isKnownAppError, isThirdPartyError } from "./utils/adBlocker";

// os anúncios do DemoQA cobrem elementos e geram erros que não são da aplicação
hideAdsOnLoad();

beforeEach(() => {
  blockThirdPartyNoise();
});

Cypress.on("uncaught:exception", (err) => {
  // ignora só erro de terceiros e bug conhecido, o resto quebra o teste
  if (!isThirdPartyError(err) && !isKnownAppError(err)) return true;

  Cypress.log({ name: "uncaught:exception", message: `Ignorado (conhecido): ${err.message}` });
  return false;
});
