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
      externalVariables: {
        topTitle: "最新航班：",
        topFiled: "",
        assetsId: "2a789aea-c297-4ec3-bae3-f5ee43ee1a29",
        itemTitle: "name",
        itemTime: "time",
        itemImg: "img",
        itemAllNum: "zonghe",
        firstImg:"",
        secondImg:"",
        thirdImg:"",
        fourthImg:"",
        content1KeyName: "周边风景：",
        content1KeyValue: "value1",
        content2KeyName: "满意度：",
        content2KeyValue: "value2",
        content3KeyName: "游玩周期：",
        content3KeyValue: "value3",
        content4KeyName: "金钱消耗：",
        content4KeyValue: "value4",
        content5KeyName: "太空牌钓鱼竿",
        content5KeyValue: "value5",
        content6KeyName: "水下潜行",
        content6KeyValue: "value6",
        content7KeyName: "情景相似度：",
        content7KeyValue: "value7",
        content8KeyName: "游玩目标：",
        content8KeyValue: "value8",
        content9KeyName: "完成时限：",
        content9KeyValue: "value9",
        content10KeyName: "周边区域：",
        content10KeyValue: "value10",
        content11KeyName: "目标状态：",
        content11KeyValue: "value11",
        content12KeyName: "昼夜区分：",
        content12KeyValue: "value12",
      },
    },
    data: [
      [2018, 3.9, "新生儿死亡率"],
      [2018, 6.1, "婴儿死亡率"],
      [2018, 8.4, "5岁以下儿童死亡率"],
    ],
  };

  new Vue({
    render: (h) => {
      return <App style={{ width: "100%",background:'transparent' }} customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props,'main');
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
