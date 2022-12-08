import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  const dataSource = [
    ["标题3", "标题1", "标题2"],
    ["标题3数据一", "1111", "4444"],
    ["标题3数据二", "2222", "5555"],
    ["标题3数据三", "3333", "6666"],
  ];
  const options = {
    externalVariables: {
      headerBGColor: "#000",
    },
  };
  ReactDOM.render(<App dataSource={dataSource} options={options} />, document.getElementById("root"));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props);
    ReactDOM.render(<App {...props} />, dom);
  });
}
