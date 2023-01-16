export default {
  // variable: { default_value: undefined, id: "测试的ID" },
  // variable: { current_value: '{"province_id":"99","city_id":"1101"}', id: "测试的ID" },
  options: {
    // auto: true,
    // showToolbar: false,
    // columns: ["年份", "数值", "指标名称"],
    // showColumns: ["指标名称", "数值"],
    // dataSourceType: 2,
    // customCss: "",
    externalVariables: {}
  },
  data: [
    ["项目一", "", ""],
    ["项目二", "", ""],
    ["项目三", "", ""]
  ],
  configuration: {
    background: "red"
  },
  changeConfiguration(newValue) {
    console.log("configuration has changed");
  }
};