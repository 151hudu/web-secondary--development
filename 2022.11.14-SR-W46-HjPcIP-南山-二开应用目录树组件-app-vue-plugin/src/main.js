import Vue from "vue";
import App from "./App.vue";
import {
  sysVariables,
  appVariables,
  customConfig,
  themeInfo, eventBus
}
  from "@/components/mockData.js";

if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  }
  new Vue({
    render: h => {
      return <App
        customConfig={customConfig}
        themeInfo={themeInfo}
        sysVariables={sysVariables}
        appVariables={appVariables}
        eventBus={eventBus}
      />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props, a, eventBus) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      props.eventBus = eventBus
      new Vue({
        render: h => <App {...{ props }} />,
      }).$mount(div);
    }
  );
}
