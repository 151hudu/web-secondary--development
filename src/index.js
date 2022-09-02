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
  const dataSource = JSON.parse(
    '[["name","showValue","toAddress","value","toolTipImg"],["北京","北京","江苏","11","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["四川","四川","江苏","11","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["浙江","浙江","江苏","22","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["山东","山东","江苏","22","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["福建","福建","江苏","33","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["上海","上海","江苏","33","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["重庆","重庆","江苏","44","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["云南","云南","江苏","44","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["江西","江西","江苏","55","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["广东","广东","江苏","55","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["山西","山西","江苏","66","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["黑龙江","黑龙江","江苏","66","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["陕西","陕西","江苏","77","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["辽宁","辽宁","江苏","77","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["海南","海南","江苏","88","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["湖南","湖南","江苏","99","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["宁夏","宁夏","江苏","99","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["河北","河北","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["湖北","湖北","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["内蒙古","内蒙古","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["天津","天津","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["贵州","贵州","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["甘肃","甘肃","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["江苏","江苏","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["吉林","吉林","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["河南","河南","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["青海","青海","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["广西","广西","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["安徽","安徽","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["新疆","新疆","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["西藏","西藏","江苏","111","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["香港","香港","江苏","123","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["台湾","台湾","江苏","23123","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"],["澳门","澳门","江苏","123","https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720d976d5b5947c187b8f7039126c10e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?"]]'
  );
  const options = {
    externalVariables: {
      外层边界线条颜色: "#3AFFFF",
      外层边边界线条粗细: "3",
      内层边界线条颜色: "#5DBDF2",
      内层边界线条粗细: "3",
      下层边界线条颜色: "#027DE4",
      地图颜色: "transparent",
      汇聚点: ["新疆", "江苏", "广东"],
      汇聚点颜色: "#FB9825",
      飞线颜色: "#FB9825",
      toolTip宽度: "138",
      toolTip高度: "40",
      toolTip文字颜色: "#FFFFFF",
      toolTip文字大小: "14",
      地图文字颜色: "red",
    },
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
