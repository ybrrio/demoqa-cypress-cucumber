const js = require("@eslint/js");
const globals = require("globals");
const pluginCypress = require("eslint-plugin-cypress");

module.exports = [
  { ignores: ["node_modules/", "reports/", "cypress/screenshots/", "cypress/downloads/"] },
  js.configs.recommended,
  {
    files: ["*.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["cypress/**/*.js"],
    ...pluginCypress.configs.recommended,
    languageOptions: {
      ...pluginCypress.configs.recommended.languageOptions,
      sourceType: "module",
      ecmaVersion: "latest",
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      "cypress/no-unnecessary-waiting": "error",
      // force esconde elemento coberto ou invisível
      "cypress/no-force": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", ignoreRestSiblings: true }],
    },
  },
];
