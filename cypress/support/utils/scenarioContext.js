// estado compartilhado entre os steps do cenário (limpo no Before)
let store = {};

export const scenarioContext = {
  set(key, value) {
    store[key] = value;
  },
  get(key) {
    return store[key];
  },
  reset() {
    store = {};
  },
};
