/*
 * @Author: wangchengyuan
 * @Email: wangchengyuan@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-04-06 09:58:34
 * @LastEditTime: 2021-10-19 17:43:29
 * @FilePath: \om-app-plugin-react-boilerplate\src\index.js
 * @Description: 请描述文件作用
 */
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

   // 资产数据
   const dataSource = [
      ["时间", "发现障碍物的次数"],
      ["1-2", "6"],
      ["3-4", "80"],
      ["5-6", "25"],
      ["7-8", "21"],
      ["9-10", "78"],
      ["11-12", "46"],
      ["13-14", "42"],
      ["15-16", "76"],
      ["17-18", "110"],
      ["19-20", "1102"],
      ["21-22", "62"],
      ["23-24", "67"],
   ];
   // 配置项
   const options = {
      externalVariables: {},
   };

   ReactDOM.render(<App dataSource={dataSource} options={options} />, document.getElementById("root"));
} else {
   if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
   }
   window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
      ReactDOM.render(<App {...props} />, dom);
   });
}
