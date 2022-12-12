export default {
    // variable: { default_value: '{"province_id":"12"}', id: "测试的ID" },
    variable: { default_value: undefined, id: "测试的ID" },
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
        background: "red",
        iframeSrc: "https://element.eleme.cn/#/zh-CN/component/table",
        资产Id: "5d47ac1c-c352-93cd-28e7-6c23c390cc5f",
        路由参数名称: "controller_id",
        登录接口: "external/system/login",//巡检
        // 登录接口: "api/vl/user/login",//反无
    },
    changeConfiguration(newValue) {
        console.log("configuration has changed");
    }
};