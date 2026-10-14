export const THIRD_PARTY_HOSTS =
  /googlesyndication|doubleclick|googletagservices|googletagmanager|google-analytics|adservice|adsystem|adplus|pagead|ezoic|criteo|taboola/;

const AD_SELECTORS = [
  "#fixedban",
  "#adplus-anchor",
  "footer",
  ".adsbygoogle",
  "iframe[id^='google_ads']",
  "[id^='Ad.Plus']",
];

export function blockThirdPartyNoise() {
  cy.intercept({ url: THIRD_PARTY_HOSTS }, { statusCode: 204, body: "" }).as("thirdParty");
}

// bugs do próprio DemoQA (findDOMNode não existe mais no React 19)
const KNOWN_APP_ERRORS = [/findDOMNode is not a function/];

export function isKnownAppError(err) {
  return KNOWN_APP_ERRORS.some((pattern) => pattern.test(err.message));
}

// "Script error." é como o browser reporta erro de script de outro domínio
export function isThirdPartyError(err) {
  const origin = `${err.message}\n${err.stack || ""}`;
  return err.message.includes("Script error.") || THIRD_PARTY_HOSTS.test(origin);
}

export function hideAdsOnLoad() {
  Cypress.on("window:load", (win) => {
    const style = win.document.createElement("style");
    style.setAttribute("data-qa", "hide-ads");
    style.innerHTML = `${AD_SELECTORS.join(", ")} { display: none !important; }`;
    win.document.head.appendChild(style);
  });
}
