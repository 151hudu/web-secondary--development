export const dataSource = [
  ["标题一", "标题二", "标题三"],
  ["标题一数据一", "2", "2"],
  ["标题一数据二", "2", "2"],
  ["标题一数据三", "2", "2"]
];


let externalVariables = JSON.parse(localStorage.getItem(process.env.CUSTOM_PLUGIN_ID))?.options?.externalVariables;
let customConfig = JSON.parse(localStorage.getItem(process.env.CUSTOM_PLUGIN_ID))?.customConfig;
export let mockOptions = {
  externalVariables: externalVariables
                     ? externalVariables
                     : {}
};
export let mockCustomConfig = customConfig
                              ? customConfig
                              : {};

export const mockChangeOptions = (options) => {
  const mockData = JSON.parse(localStorage.getItem(process.env.CUSTOM_PLUGIN_ID)) || {};
  mockData.options = options;
  localStorage.setItem(process.env.CUSTOM_PLUGIN_ID, JSON.stringify(mockData));
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData = JSON.parse(localStorage.getItem(process.env.CUSTOM_PLUGIN_ID)) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(process.env.CUSTOM_PLUGIN_ID, JSON.stringify(mockData));
};

export default {
  dataSource, mockCustomConfig, mockOptions, mockChangeOptions, mockChangeCustomConfig
};