/* 可以考虑在发布的代码里移除这个css */
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
  const { detectLogin } = require('./boot/util/detect')
  detectLogin().then(() => {
    // 添加 customConfig 进行测试
    window.currentUser = {
      account_code: '1234567890', id: '1234567890id', loginName: "admin"
    }
    let customConfig = {
      title: "",
      appId: '1111',
      logoUrl: 'https://img2.baidu.com/it/u=3160111605,4265972427&fm=253&fmt=auto&app=138&f=JPEG?w=347&h=499',
      msgLink: "https://www.baidu.com",
      headerImageUrl: 'https://img1.baidu.com/it/u=3009731526,373851691&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
      mainHeight: null,
      buttons: [
        { name: '首页', url: '455454545' },
        { name: '训练管理', url: '455454545', params: [{ key: 'temp', value: 'ssocode' }] },
        { name: '军事教育', url: '455454545' },
        { name: '部队管理', url: '455454545' },
      ],
      placeholderColor: 'red'
    };
    ReactDOM.render(<App customConfig={customConfig} />, document.getElementById("root"));
  })

} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
