export default {
  variable: { default_value: "测试的数据", id: "测试的ID" },
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
  configuration: {},
  changeConfiguration() {
    console.log("configuration has changed");
  }
};