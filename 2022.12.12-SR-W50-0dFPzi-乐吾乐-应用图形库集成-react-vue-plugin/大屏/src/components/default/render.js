/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Select, message } from "antd";
// import uuid from "uuid/v4";
// import { useRequest } from "ahooks";
import sdTopology from "topology-sdata";
import "topology-sdata/dist/style.css";
import "topology-sdata/public/icon/通用图标/iconfont.css";
import "topology-sdata/public/icon/topology2d/iconfont.css";
import "topology-sdata/public/icon/国家电网/iconfont.css";
import "topology-sdata/public/icon/电气工程/iconfont.css";
import qs from "querystringify";
import { queryPluginInfo } from "../../api/asset";
// import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

// const mock = [
//   [
//     "6",
//     "计算机",
//     "cce05808691fb42caa7986f1a922f057b",
//     "1数睿数据-smardaten—大型软件企业都在用的无代码平台1",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机2",
//     "cce0580869fb42ca2a7986f1a922f057b",
//     "2数睿数据-smardaten—大型软件企业都在用的无代码平台2",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa79836f1a922f057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机2",
//     "cce0580869fb42caa7986f14a922f057b",
//     "2数睿数据-smardaten—大型软件企业都在用的无代码平台2",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa7986f1a9225f057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机2",
//     "cce0580869fb42caa7986f1ad9622f057b",
//     "2数睿数据-smardaten—大型软件企业都在用的无代码平台2",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa7986f1a922ff7f057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa7986f1a9282f057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机2",
//     "cce0580869fb42caa7986f1a9229f057b",
//     "2数睿数据-smardaten—大型软件企业都在用的无代码平台2",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa7986f1a922f1057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机2",
//     "cce0580869fb42caa7986f1ad92222f057b",
//     "2数睿数据-smardaten—大型软件企业都在用的无代码平台2",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
//   [
//     "6",
//     "计算机3",
//     "cce0580869fb42caa7986f1a93322fff057b",
//     "3数睿数据-smardaten—大型软件企业都在用的无代码平台",
//     "document",
//     "数睿数据作为定义软件开发新模式的无代码头部企业,荣获“年度最佳无代码产品奖”、“年度领军人物奖”。 了解详情 数睿数据入选甲子引力“2021最具商业潜力的数据智能Cool Vendor” 数睿数据的核...",
//     null,
//   ],
// ];
function DefaultRender(props) {
   const [publicUrl, setPublicUrl] = useState("");
   console.log("props: ", props);
   const { bigscreen = {}, block, baseConfig = {}, componentId } = props;
   const { dataConfig = {}, pluginConfig } = block;
   const { id } = baseConfig;
   const {
      // assetId,
      // columns = [],
      // publicUrl,
      viewId,
      // filterColumns = [],
      // limitNumber = 10,
   } = dataConfig;
   const { updateBlockById } = bigscreen;
   // const [searchValue, setSearchValue] = useState(null);
   // const [selectedValue, setSelectedValue] = useState("");
   // const [selectList, setSelectList] = useState([]);
   const getUrl = async (id) => {
      const { data } = await queryPluginInfo(id);
      return data.path + "public";
   };

   useEffect(() => {
      const events = [
         {
            key: "boxOnload",
            name: "容器加载完成",
            payload: [
               {
                  name: "名称",
                  dataType: "object",
                  key: "name",
               },
            ],
         },
      ];
      const actions = [
         {
            key: "randerBox",
            name: "重新渲染容器",
            params: [
               {
                  key: "value",
                  name: "值",
                  dataType: "string",
               },
            ],
         },
      ];
      window.componentCenter?.register && window.componentCenter.register(props.componentId, "comp", { Event_Center_getName, do_EventCenter_randerBox }, { events, actions });
      props?.updateProcess && props.updateProcess();
   }, []);

   useEffect(async () => {
      let urls = "";
      // getUrl()
      if (pluginConfig?.id) {
         urls = await getUrl(pluginConfig.id);
         setPublicUrl(urls);
      }
      // if(!window.jsDiagramNum) {
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
         "/js/stomp.min.js",
      ];
      const file_prefix = process.env.NODE_ENV === "development" ? "" : urls;
      scriptUrl.forEach((el) => {
         const url = process.env.NODE_ENV === "development" ? el : file_prefix + el;
         let script = document.createElement("script");
         script.setAttribute("type", "text/javascript");
         script.setAttribute("src", url);
         document.getElementsByTagName("body")[0].appendChild(script);
      });
      let viewIds = viewId || qs.parse(window.location.search).data_id;
      let name = qs.parse(window.location.search).name;
      // 插入 多个订阅的js, 不涉及多个topic的项目可以去掉
      let newUrls = "/storage_area/devops/dataflow/secondary_dev/design/" + viewIds + "/topic.js";
      let script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", newUrls);
      script.setAttribute("async", "");
      document.getElementsByTagName("body")[0].appendChild(script);
      setTimeout(() => {
         sdTopology("#" + componentId + "bigScreen-topology", { type: "view", publicUrl: publicUrl, viewId: viewIds, name: name });
         randerOnload();
      }, 1000);
   }, []);

   const Event_Center_getName = () => {
      let name = props.bigscreen.name || "乐吾乐图形库集成";
      return name;
   };

   // 重新渲染动作
   const do_EventCenter_randerBox = ({ value }) => {
      console.log("重新渲染容器动作--->", value);
      let name = qs.parse(window.location.search).name;
      sdTopology("#" + componentId + "bigScreen-topology", { type: "view", publicUrl: publicUrl, viewId: value, name: name });
      randerOnload();
   };

   // 容器渲染完成
   const randerOnload = () => {
      console.log("容器渲染完成");
      setTimeout(() => {
         window.eventCenter.triggerEvent(componentId, "boxOnload", {});
      }, 1500);
   };

   return <div id={componentId + "bigScreen-topology"} style={{ height: "100%" }}></div>;
}

DefaultRender.propTypes = {};

export default DefaultRender;
