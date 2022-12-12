import Vue from "vue";
import App from "./App.vue";
import less from "less";
import { Development } from "@/components/index.js";

Vue.use(less);

if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} has triggered`);
    }
  };
  new Vue({
    render: h => {
      return (<Development model='development' />);
    }
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props, context, eventBus) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    div.style.height = '100%'
    const app = new Vue({
      render: h => <App {...{ props }} />
    });
    app.$mount(div);
    // eventBus.on((newProps) => {
    //   for (const newPropsKey in newProps) {
    //     app[newPropsKey] = newProps[newPropsKey];
    //   }
    //   app.$forceUpdate();
    // });
  });
}
