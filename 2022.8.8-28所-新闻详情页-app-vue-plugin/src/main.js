import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Dialog, Divider, Tag, Tabs, CarouselItem, TabPane, Carousel, Tree,  MessageBox,
  Message, } from "element-ui";
import "@icon-park/vue/styles/index.css";
import '../pluginTemp/font/font.css'

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Divider);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Dialog);
Vue.use(Tree);

// import * as appService from "@njsdata/app-sdk";
Vue.prototype.$message = Message;
if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    分享名称: "2222",
    相关推荐高度:'432',
    相关推荐条数:'15',
    热点排行高度:'432',
    热点排行条数:'15',
    查询相关推荐资产ID:'7df581bc-395e-82eb-5c2d-0aff497ef10e',
    查询热点排行资产ID:'98c2418d-9459-112f-ec13-ca240eb887a0',
  };

  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props);
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
