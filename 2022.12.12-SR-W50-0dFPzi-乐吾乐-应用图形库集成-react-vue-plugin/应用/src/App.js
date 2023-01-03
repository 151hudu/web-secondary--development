import React, { Component } from "react";
import qs from "querystringify";
import { queryPluginInfo } from "./api/asset";
import "./app.less";
// import eventActionDefinition from "./components/msgCompConfig";
import sdTopology from "topology-sdata";
import "topology-sdata/dist/style.css";
import "topology-sdata/public/icon/通用图标/iconfont.css";
import "topology-sdata/public/icon/topology2d/iconfont.css";
import "topology-sdata/public/icon/国家电网/iconfont.css";
import "topology-sdata/public/icon/电气工程/iconfont.css";

export default class App extends Component {
   file_prefix = "";

   getUrl = async (id) => {
      const { data } = await queryPluginInfo(id);
      return data.path + "public";
   };
   async componentDidMount() {
      // console.log(this.props, 'props');
      window.jsDiagramNum = 701; //1450
      //电力 749
      //物联网 613
      //其他 88
      //所有 1450
      window.companyName = "sdata";
      document.title = window.companyName + "Topology";
      window.userHome = ""; //用户中心地址
      window.loginUrl = ""; //登录地址
      window.userDefinedDiagram = null;
      let scriptUrl = [
         "/diagram/20313.1 (1).js",
         "/diagram/20313.1 (2).js",
         "/diagram/20313.1.js",
         "/diagram/20313.2.js",
         "/diagram/20313.3.js",
         "/diagram/20313.4.js",
         "/diagram/20313.5.js",
         "/diagram/20313.6.js",
         "/diagram/20313.7.js",
         "/diagram/20313.8.js",
         "/diagram/20313.9.js",
         // "/diagram/测试图形库.js",
         "/js/marked.min.js",
         "/js/echarts.min.js",
         "/js/highcharts.js",
         "/js/highcharts-more.js",
         "/js/lcjs.iife.js",
         "/js/mycharts.js",
         "/js/jquery-1.7.1.min.js",
         "/js/encryption/AES.js",
         "/js/encryption/cryptico.min.js",
         "js/encryption/crypto-3.1.2.min.js",
         "/js/webVideoCtrl.js",
         "/js/rg.js",
         "/js/stomp.min.js"
      ];
      // this.props?.customConfig?.componentId &&
      // window.componentCenter?.register(
      //   this.props?.customConfig?.componentId,
      //   "",
      //   this,
      //   eventActionDefinition
      // );
      let publicUrl;
      if (this.props?.customConfig?.customize?.id) {
         publicUrl = await this.getUrl(this.props?.customConfig?.customize?.id);
      }
      console.log("publicUrl: ", publicUrl, this.props);
      this.file_prefix = process.env.NODE_ENV === "development" ? "topology-sdata/dist" : publicUrl;
      scriptUrl.forEach((el) => {
         const url = process.env.NODE_ENV === "development" ? el : this.file_prefix + el;
         let script = document.createElement("script");
         script.setAttribute("type", "text/javascript");
         script.setAttribute("src", url);
         script.setAttribute("async", "");
         document.getElementsByTagName("body")[0].appendChild(script);
      });
      let viewId = this.props?.customConfig?.viewId || qs.parse(window.location.search).data_id || "f524024f2a8a40c1a66d2fd71cd2737d";
      let name = qs.parse(window.location.search).name;
      let type = qs.parse(window.location.search).viewType || "view";
      // 插入 多个订阅的js, 不涉及多个topic的项目可以去掉
      let urls = '/storage_area/devops/dataflow/secondary_dev/design/' + viewId + '/topic.js'
      let script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", urls);
      script.setAttribute("async", "");
      document.getElementsByTagName("body")[0].appendChild(script);
      setTimeout(() => {
         sdTopology("#hyztest", { type: type, publicUrl: publicUrl, viewId, name: name });
      }, 1000);
   }

   goToStudy = () => {
      this.props?.customConfig?.url && window.open(this.props?.customConfig?.url);
   };

   do_EventCenter_messageSuccess() {
      window.location.reload();
   }

   // 逻辑控制用，不可删
   Event_Center_getName() {
      return "应用二开测试";
   }

   render() {
      //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
      //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
      // const { customConfig, appVariables, sysVariables, themeInfo } = this.props;
      // const { title, desc, url, color, componentId } = customConfig || {};
      return <div id="hyztest"></div>;
   }
}
