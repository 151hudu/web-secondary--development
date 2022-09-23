/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";
import "./index.css";
import { Table, TableColumn } from "element-ui";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);

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
    render: (h) => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["区域","上网电量","自发自用电量","消纳率"],["南白营业所","610","200","100"],["荀江营业所","50","400","210"],["南黑营业所","300","100","400"],["北白营业所","400","300","50"],["南白营业所","610","200","100"],["荀江营业所","50","400","210"],["南黑营业所","300.69","100","400"],["北白营业所","400.3","300","50"]]'
    );
    const options = {
      externalVariables: {
        渐变色1: "red,blue",
        渐变色2: "",
        头部文字颜色: "#DD7F80",
        头部字体大小: "12",
        头部字体类型: "Microsoft YaHei",
        单位: "万kMh",
        y单位: "单位 万kWh",
        倍数: "",
        柱宽: "",
        小数位: "0",
        距顶部距离: "",
        距右侧距离: "",
        距底部距离: "",
        距左侧距离: "",
        y轴坐标字体大小: "12",
        y轴坐标字体颜色: "black",
        x坐标轴颜色: "",
        y坐标轴分割线颜色: "green",
        次轴: "1",
        次轴单位: "单位 %",
        图例字体颜色: "",
        图例字体大小: "12",
        图例图形宽: "20",
        图例图形高: 6,
        图例之间的间距:'50',
        遮罩体显示: "false",
        x坐标标题度数: "",
        遮罩体颜色: "#0e2a43",
        y轴坐标字体类型: "Microsoft YaHei",
        是否开启百分号: "false",
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({
      render: (h) => <App {...{ props }} />,
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
}
