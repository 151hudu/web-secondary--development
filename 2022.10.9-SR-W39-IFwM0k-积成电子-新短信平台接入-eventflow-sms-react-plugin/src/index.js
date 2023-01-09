import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App.jsx";

// import "antd/dist/antd.css";

// 是否是生产环境
if (process.env.NODE_ENV !== "production") {
  // 调试的时候使用
  ReactDOM.render(<App />, document.getElementById("root"));
} else {
  // 提供给二开加载器的挂载方式
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
