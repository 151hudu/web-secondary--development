import Vue from "vue";
import App from "./App.vue";
import Video from "video.js";
import "video.js/dist/video-js.css";
import "videojs-flash"; // 要播放rtmp流, 就必须引入videojs-flash
import SWF_URL from "videojs-swf/dist/video-js.swf";
// Video.options.flash.swf = SWF_URL;
Vue.prototype.$video = Video;
import VueDND from 'awe-dnd'
Vue.use(VueDND)
console.log(Video.options);
// Video.addLanguage('zh-CN', video_zhCN)
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Input,
  Select,
  Option,
  Button,
  Switch,
  Avatar,
  RadioGroup,
  Radio,
  Tabs,
  TabPane,
  Icon,
  TableColumn,
  Checkbox,
  Table,
  Carousel,
  CarouselItem,
  CheckboxGroup,
  Dialog,
  Message,
  RadioButton,
  Row,
  Col,
} from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Icon);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Row);
Vue.use(Col);
Vue.prototype.$message = Message;
// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "http://baidu.com",
    imgUrl: "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
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
