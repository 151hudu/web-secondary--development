import Vue from "vue";
import App from "./App.vue";
import { Tree } from "element-ui";
import { sysVariables, appVariables, customConfig, themeInfo } from "@/components/mockData.js";
Vue.use(Tree);
if (process.env.NODE_ENV !== "production") {
  let customConfig = {
    assetId: "e0bd2afd-add6-297c-c950-90def1905716",
    show_name: "name",
    multi_storey: "true",
    father_node: "parent_id",
    iframe_URL: "http://www.baidu.com1?a=1",
    unit_height: "100%",
    multiple_choice: "true",
    data_filed: "data_id",
    icon_URL: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg",
    title: "行业类型",
    permissions_flag: "true",
  };
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  };
  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} themeInfo={themeInfo} sysVariables={sysVariables} appVariables={appVariables} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(div);
  });
}
