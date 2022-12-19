/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import mockData from "./mockData.js";
import {
  registerStore
} from "@njsdata/bigscreen-sdk";
/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  require("./development.less");
}

// 是否是生产环境
if (process.env.NODE_ENV !== "production") {
  mockData.mode = "development";
  // 调试的时候使用
  ReactDOM.render(<App {...mockData} />, document.getElementById("root"));
} else {
  // 提供给二开加载器的挂载方式
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    process.env.CUSTOM_PLUGIN_ID,
    (dom, props, context, eventBus) => {
      registerStore(props);
      ReactDOM.render(<App {...props} {...context} />, dom);
      return;
    }
  );
}
