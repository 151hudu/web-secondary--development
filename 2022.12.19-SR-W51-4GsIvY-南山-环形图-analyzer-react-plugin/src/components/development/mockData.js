export const dataSource = [
  ["标题一", "标题二"],
  ["100", "50"],
];

const CUSTOM_PLUGIN_ID = process.env.CUSTOM_PLUGIN_ID;
let externalVariables = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))?.options?.externalVariables || {};
let customConfig = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))?.customConfig || {};
export let mockOptions = {
  externalVariables,
};
export let mockCustomConfig = customConfig;

export const mockChangeOptions = (options) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)) || {};
  mockData.options = options;
  localStorage.setItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`, JSON.stringify(mockData));
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`, JSON.stringify(mockData));
};

export default {
  dataSource,
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig,
};
