/*
 * @Author: wangchengyuan
 * @Email: wangchengyuan@njsdata.com
 * @LastEditors: wangcong
 * @Date: 2021-04-06 09:58:34
 * @LastEditTime: 2022-09-15 17:13:50
 * @FilePath: \om-app-plugin-react-boilerplate\src\index.js
 * @Description: 请描述文件作用
 */
/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("./index.css");
  require("antd/dist/antd.css");
  const dataSource = [
    ["时间", "信息", "类别"],
    ["2019-08-30 13:30", "3架次P-8A位于永暑礁周边开展密集侦查", "中国"],
    ["2019-08-30 12:14", "1架次P-8A赴黄岩岛和南沙空域实施大范围侦查", "中国"],
    ["2019-09-04 10:47", "1架U-2型机经黄岩岛附近空域南下", "中国"],
    [
      "2019-09-02 09:30",
      "1架次P-8A型机赴西沙以南空域侦查1架次P-8A型机赴西沙以南空域侦查",
      "美国",
    ],
    ["2019-09-03 12:30", "1架U-2型机经黄岩岛附近空域南下", "美国"],
    ["2019-09-04 09:30", "1架次P-8A型机赴西沙以南空域侦查", "中国"],
    [
      "2019-09-04 19:30",
      "src/bigscreenv3/player/core/model/bigscreen.js",
      "中国",
    ],
    ["2019-08-30 13:30", "3架次P-8A位于永暑礁周边开展密集侦查", "中国"],
    ["2019-08-30 12:14", "1架次P-8A赴黄岩岛和南沙空域实施大范围侦查", "中国"],
    ["2019-09-04 10:47", "1架U-2型机经黄岩岛附近空域南下", "中国"],
    [
      "2019-09-02 09:30",
      "1架次P-8A型机赴西沙以南空域侦查1架次P-8A型机赴西沙以南空域侦查",
      "美国",
    ],
    ["2019-09-03 12:30", "1架U-2型机经黄岩岛附近空域南下", "美国"],
    ["2019-09-04 09:30", "1架次P-8A型机赴西沙以南空域侦查", "中国"],
    [
      "2019-09-04 19:30",
      "src/bigscreenv3/player/core/model/bigscreen.js",
      "中国",
    ],
    ["2019-08-30 13:30", "3架次P-8A位于永暑礁周边开展密集侦查", "中国"],
    ["2019-08-30 12:14", "1架次P-8A赴黄岩岛和南沙空域实施大范围侦查", "中国"],
    ["2019-09-04 10:47", "1架U-2型机经黄岩岛附近空域南下", "中国"],
    [
      "2019-09-02 09:30",
      "1架次P-8A型机赴西沙以南空域侦查1架次P-8A型机赴西沙以南空域侦查",
      "美国",
    ],
    ["2019-09-03 12:30", "1架U-2型机经黄岩岛附近空域南下", "美国"],
    ["2019-09-04 09:30", "1架次P-8A型机赴西沙以南空域侦查", "中国"],
    [
      "2019-09-04 19:30",
      "src/bigscreenv3/player/core/model/bigscreen.js",
      "中国",
    ],
    ["2019-08-30 13:30", "3架次P-8A位于永暑礁周边开展密集侦查", "中国"],
    ["2019-08-30 12:14", "1架次P-8A赴黄岩岛和南沙空域实施大范围侦查", "中国"],
    ["2019-09-04 10:47", "1架U-2型机经黄岩岛附近空域南下", "中国"],
    [
      "2019-09-02 09:30",
      "1架次P-8A型机赴西沙以南空域侦查1架次P-8A型机赴西沙以南空域侦查",
      "美国",
    ],
    ["2019-09-03 12:30", "1架U-2型机经黄岩岛附近空域南下", "美国"],
    ["2019-09-04 09:30", "1架次P-8A型机赴西沙以南空域侦查", "中国"],
    [
      "2019-09-04 19:30",
      "src/bigscreenv3/player/core/model/bigscreen.js",
      "中国",
    ],
  ];
  const options = {
    externalVariables: {
      时间字段: "时间",
      信息字段: "信息",
      分类字段: "类别",
      上方: "美国",
      卡片背景色: "#c4e2e2",
      卡片边框色: "#333",
      卡片字体: "Microsoft YaHei",
      卡片字号: "16px",
      卡片文字颜色: "#333",
      时间字体: "Microsoft YaHei",
      时间字号: "12px",
      时间文字颜色: "#3ca6a6",
      时间格式: "YYYY.M.D HH:mm",
      消息框宽度: "",
      时间点间距: "",
    },
  };
  ReactDOM.render(
    <App dataSource={dataSource} options={options} />,
    document.getElementById("root")
  );
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
