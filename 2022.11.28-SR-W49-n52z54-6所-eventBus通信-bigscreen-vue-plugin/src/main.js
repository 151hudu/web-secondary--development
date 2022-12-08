import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Collapse, CollapseItem, Radio, RadioGroup } from "element-ui";
import echarts from "echarts";

import "./index.css";
Vue.config.productionTip = false;
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.prototype.$echarts = echarts;

if (process.env.NODE_ENV !== "production") {
  const customConfig = {
    variable: { default_value: "测试的数据", id: "测试的ID" },
    options: {
      externalVariables: {},
    },
    data: [
      [2018, 3.9, "新生儿死亡率"],
      [2018, 6.1, "婴儿死亡率"],
      [2018, 8.4, "5岁以下儿童死亡率"],
    ],
  };

  new Vue({
    render: (h) => {
      return <App style={{ width: "100%", background: "transparent" }} customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props, "main");
    if (dom.childNodes.length == 0) {
      // dom.removeChild(dom.childNodes[0]);
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: (h) => <App {...{ props }} />,
      }).$mount(div);
    }
  });
}
