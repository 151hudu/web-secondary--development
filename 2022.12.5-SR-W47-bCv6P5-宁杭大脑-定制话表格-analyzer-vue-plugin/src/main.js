import Vue from "vue";
import App from "./App.vue";
import './index.css'
import { Table, TableColumn, Message } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);
Vue.prototype.$message = Message;

import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["袜子1","袜子_1_豆豆鞋","袜子2_3_4","袜子_1_6","袜子_7_8","袜子_9_0"],["中文1",10,10,17,36,20],["合计",60,30,47,26,10],["中文2",10,10,17,36,20],["中文3",10,10,17,36,20]]'
    );
    const options = {
      externalVariables: {
        background: "",
        headerFontSize: '24',
        headerColor: 'red',
        headerFontFamily: '楷体',
        headerFontWeight: 'false',
        bodyFontSize: '20',
        titleWidth: '32',
        bodyColor: '',
        dataWidth: '70',
        bodyFontFamily: '',
        barDataOrder: '南京端,南京器,南京,南京二',
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({

      render: h => <App {...{ props }} />,
    }).$mount("#app");
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
      process.env.VUE_APP_CUSTOM_PLUGIN_ID,
      (dom, props) => {
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App {...{ props }} />,
        }).$mount(div);
      }
    );
  }
}
