import Vue from "vue";
import App from "./App.vue";
import { Table, TableColumn, Input, Button, Message, Descriptions, DescriptionsItem,Loading } from "element-ui";

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Button);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Loading);
Vue.component(Message);
Vue.prototype.$message = Message;

if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  };
  require("./index.css");
  const { sysVariables, appVariables, customConfig, themeInfo } = require("@/components/mockData.js");
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
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount(dom);
  });
}
