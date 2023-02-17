import Vue from "vue";
import App from "./App.vue";
import MsgCompConfig from "./components/main/msgCompConfig.js";
import { Development } from "@/components/index.js";
import Utils from "@/utils/index.js";
const configJson = require("../pluginTemp/config.json");


const mainInit = (Main) => {
  const { componentId } = Main.customConfig;
  componentId && window?.componentCenter?.register(componentId, "comp", Main, MsgCompConfig);
  const customConfig = Main.customConfig;
  //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
  const requirementNum = configJson["requirement-number"] === "需求编号"
                         ? ""
                         : `${configJson["requirement-number"]}-`;
  const id = customConfig?.id
             ? `app-secondary-${requirementNum}${customConfig.id}`
             : `app-secondary-${requirementNum}${Utils.generateUUID()}`;
  Main.id = id;
};
if (process.env.NODE_ENV !== "production") {
  new Vue({
    render: h => <Development mainInit={mainInit} />
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    configJson.id,
    (dom, props, context, eventBus) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      props.eventBus = eventBus;
      props.mainInit = mainInit;
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />
      }).$mount(div);
    }
  );
}