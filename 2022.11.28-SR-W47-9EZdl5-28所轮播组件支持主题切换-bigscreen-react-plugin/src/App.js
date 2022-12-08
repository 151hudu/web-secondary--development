import React, { Component, useState, useEffect, useRef } from "react";
import { Tabs } from 'antd';
import DesignConfiguration from "./components/designConfiguration";
import DefaultRender from "./components/default";
import { useRafInterval } from 'ahooks';
import "./app.css";
import iconImg from './Icon/tab.png';

const StaticData = [
  ['项目一', '', ''],
  ['项目二', '', ''],
  ['项目三', '', '']
];
const ITEMNUM = 3;
const renderHashMap = {
  default: DefaultRender,
  dataConfiguration: DesignConfiguration,
};
// export default class App extends Component {
//   state = {
//     id: this.props.block.baseConfig.id,
//     activeKey: "",
//     itemNames: ['项目一', '项目二', '项目三'],
//     iconItems: [iconImg, iconImg, iconImg],
//     iconSize: '40px',
//     nameSize: '18px',
//     nameColor: 'black'
//   };
//   currentIndex = 0;
//   tabTimer = null;

//   componentDidMount() {
//     const { type } = this.props;
//     if (!renderHashMap[type]) {
//       /**
//        * 可能会存在相同类型组件被删除的情况，因此在每次挂载之后检测blocks中每个组件的id
//        * 如果挂载在window.pluginTimer的id在blocks中不存在即表示该id对应的组件已经被删除
//        * 这时需要手动清除掉挂载的id
//        */
//       this.checkBlockIdTimer();
//       if (this.tabTimer) {
//         clearInterval(this.tabTimer);
//         this.clearTimerArr(this.tabTimer);
//       }
//       let tempDate = this.handleItemName();
//       this.initComData();
//       this.handleItemIcons();
//       const {
//         block: {
//           dataConfig: {
//             pluginOptions = {}
//           }
//         }
//       } = this.props;
//       if (pluginOptions?.canCarousel === false) {
//         if (this.currentIndex >= tempDate.length) this.currentIndex = 0;
//         this.setState({
//           activeKey: tempDate[this.currentIndex]
//         });
//         this.setContainerContent(0);
//         this.currentIndex++;
//         //清除定时器
//         if (window?.pluginTimer?.get(this.state.id)) {
//           clearInterval(window.pluginTimer.get(this.state.id));
//           window.pluginTimer.set(this.state.id, null);
//         }
//       } else {
//         let delay = pluginOptions?.canCarousel ? pluginOptions.carouselTime : 8000;
//         this.handleTimeChange(tempDate, true, delay);
//       }

//       const events = [
//         {
//           key: "onClick",
//           name: "点击",
//           payload: [
//             {
//               name: "名称",
//               dataType: "string",
//               key: "name",
//             },
//           ],
//         },
//       ];

//       const actions = [
//         {
//           key: "messageSuccess",
//           name: "成功提示",
//           params: [
//             {
//               key: "value",
//               name: "值",
//               dataType: "string",
//             },
//           ],
//         },
//       ];

//       window.componentCenter?.register &&
//         window.componentCenter.register(this.props?.componentId, "comp", this, {
//           events,
//           actions,
//         });
//       this.props?.updateProcess && this.props.updateProcess();

//       this.Event_Center_getName = () => {
//         return "轮播页签";
//       };
//     }
//   }
//   componentWillUnmount() {
//     if (this.tabTimer) {
//       clearInterval(this.tabTimer);
//       if (window?.pluginTimer?.get(this.state.id)) {
//         window.pluginTimer.set(this.state.id, null);
//       }
//     }
//   }
//   //处理手动切换页签
//   handleTabChange = key => {
//     const {
//       block: {
//         dataConfig: {
//           pluginOptions = {}
//         }
//       }
//     } = this.props;
//     if (this.tabTimer) {
//       clearInterval(this.tabTimer);
//       if (window?.pluginTimer?.get(this.state.id)) {
//         // let index = this.getTargetIndex(this.tabTimer, window.pluginTimer);
//         // window.pluginTimer.splice(index, 1);
//         window.pluginTimer.set(this.state.id, null);
//       }
//     }
//     this.currentIndex = this.getTargetIndex(key, this.state.itemNames);
//     this.setState({
//       activeKey: key
//     });
//     if (pluginOptions?.canCarousel === false) {
//       if (this.currentIndex >= this.state.itemNames.length) this.currentIndex = 0;
//       this.setState({
//         activeKey: this.state.itemNames[this.currentIndex]
//       });
//       this.setContainerContent();
//       this.currentIndex++;
//     } else {
//       let delay = pluginOptions?.canCarousel ? pluginOptions.carouselTime : 8000;
//       this.handleTimeChange(this.state.itemNames, true, delay);
//     }
//   };

//   //处理定时器
//   handleTimeChange = (data, immediately = false, delay = 8000) => {
//     if (immediately) {
//       if (this.currentIndex >= data.length) this.currentIndex = 0;
//       this.setState({
//         activeKey: data[this.currentIndex]
//       });
//       this.setContainerContent();
//       this.currentIndex++;
//     }
//     //一个二开插件只有一个定时器，所以只需要最后注册的定时器，所以将之前的定时器都清除掉
//     if (window?.pluginTimer?.get(this.state.id)) {
//       clearInterval(window.pluginTimer.get(this.state.id));
//     }
//     this.tabTimer = setInterval(() => {
//       const {
//         bigscreen: {
//           blocks
//         }
//       } = this.props;
//       //获取所有组件ID的数组
//       let exitIds = blocks.map(item => item.baseConfig.id);
//       if (!exitIds.includes(this.state.id)) {
//         clearInterval(window.pluginTimer.get(this.state.id));
//         window.pluginTimer.delete(this.state.id);
//         return;
//       }
//       if (this.currentIndex >= data.length) {
//         this.currentIndex = 0;
//       }
//       this.setState({
//         activeKey: data[this.currentIndex]
//       });
//       this.setContainerContent();
//       this.currentIndex++;

//     }, delay);
//     if (!window?.pluginTimer) {
//       //因为存在多个同类型组件，因此使用map来记录每个组件自己的定时器id
//       window.pluginTimer = new Map();
//     }
//     window.pluginTimer.set(this.state.id, this.tabTimer);
//   };
//   //获取目标在数组中的索引
//   getTargetIndex = (target, data) => {
//     for (let i = 0; i < data.length; i++) {
//       if (data[i] === target) return i;
//     }
//   };

//   //清除全局定时器数组
//   clearTimerArr = target => {
//     if (window?.pluginTimer?.length) {
//       let index = this.getTargetIndex(target, window.pluginTimer);
//       window.pluginTimer.splice(index, 1);
//     }
//   };

//   //遍历获取blocks中的所有组件id，去除window.pluginTimer中多余的组件定时器
//   checkBlockIdTimer = () => {
//     const {
//       bigscreen: {
//         blocks
//       }
//     } = this.props;
//     //获取所有组件ID的数组
//     let exitIds = blocks.map(item => item.baseConfig.id);
//     //获取window.pluginTimer对应的所有键
//     if (window?.pluginTimer) {
//       //获取所有已注册的组件id
//       let Ids = Array.from(window.pluginTimer.keys());
//       for (let i of Ids) {
//         if (exitIds.findIndex(item => item === i) === -1) {
//           clearInterval(window.pluginTimer.get(i));
//           window.pluginTimer.delete(i);
//         }
//       }
//     }
//   };

//   //处理配置更新
//   handleOptionsChange = (pluginOptions) => {
//     const {
//       bigscreen: { updateBlockById, pluginDetailMap },
//       block: {
//         baseConfig: { id }
//       }
//     } = this.props;
//     const containerId = pluginOptions.containerId;
//     if (pluginOptions.containerId) {
//       updateBlockById(containerId, {
//         dataConfig: {
//           configs: [
//             {
//               name: "网页",
//               type: 0,
//               value: pluginOptions.tabLink1
//             }
//           ],
//           defaultValue: null,
//           defaultType: 3
//         }
//       });
//     }
//     updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
//     //调用加载器的run方法强制更新
//     pluginDetailMap[`${id}-default`].detail.ref.current.run();
//   };

//   //定时器设置容器内容
//   setContainerContent = () => {
//     const {
//       bigscreen: {
//         updateBlockById
//       },
//       block: {
//         dataConfig: {
//           pluginOptions = {}
//         }
//       }
//     } = this.props;
//     if (pluginOptions?.containerId) {
//       updateBlockById(pluginOptions.containerId, {
//         dataConfig: {
//           configs: [
//             {
//               name: "网页",
//               type: 0,
//               value: pluginOptions[`tabLink${this.currentIndex + 1}`]
//             }
//           ],
//           defaultValue: null,
//           defaultType: 3
//         }
//       });
//     }
//   };

//   //获取容器ID对应容器配置
//   getContainer = (arr, targetID) => {
//     let tempConfig = {};
//     for (let i of arr) {
//       if (i.baseConfig.id === targetID) {
//         return tempConfig = i.dataConfig;
//       }
//     }
//   };

//   //处理需要的变量
//   handleConfiguration = () => {
//     const { block } = this.props;
//     const { dataConfig } = block;
//     const { pluginOptions = {} } = dataConfig;
//     return pluginOptions;
//   };

//   //加载通用数据
//   initComData = () => {
//     const {
//       block: {
//         dataConfig: {
//           pluginOptions = {}
//         }
//       }
//     } = this.props;
//     if (pluginOptions?.iconSize) {
//       this.setState({
//         iconSize: pluginOptions.iconSize
//       });
//     }
//     if (pluginOptions?.nameSize) {
//       this.setState({
//         nameSize: pluginOptions.nameSize
//       });
//     }
//     if (pluginOptions?.nameColor) {
//       this.setState({
//         nameColor: pluginOptions.nameColor
//       });
//     }
//   };

//   //获取页签名称数组
//   handleItemName = () => {
//     const {
//       block: {
//         dataConfig
//       }
//     } = this.props;
//     let res = dataConfig?.pluginOptions?.tabnames
//       ? dataConfig?.pluginOptions?.tabnames.split(' ')
//       : ['项目一', '项目二', '项目三'];
//     this.setState({
//       itemNames: res
//     });
//     return res;
//   };

//   //获取图标数组
//   handleItemIcons = () => {
//     const {
//       block: {
//         dataConfig: {
//           pluginOptions = {}
//         }
//       }
//     } = this.props;
//     let res = this.state.iconItems;
//     for (let i = 0; i < ITEMNUM; i++) {
//       if (pluginOptions[`tabIcon${i + 1}`]) {
//         res[i] = pluginOptions[`tabIcon${i + 1}`];
//       }
//     }
//     this.setState({
//       iconItems: res
//     });
//     return res;
//   };

//   render() {
//     const { type } = this.props;
//     if (renderHashMap[type]) {
//       const options = {
//         changeConfiguration: this.handleOptionsChange,
//         configuration: this.handleConfiguration(),
//         ...this.props
//       };
//       const Comp = renderHashMap[type];
//       return (<Comp {...options}></Comp>);
//     } else {
//       const { itemNames, activeKey, iconItems, iconSize, nameSize, nameColor } = this.state;
//       return (
//         <>
//           <div style={{ width: '100%', height: '100%' }}>
//             <Tabs
//               className="plugin"
//               style={{ width: '100%', height: '100%' }}
//               onTabClick={this.handleTabChange}
//               activeKey={activeKey}
//               tabPosition="left"
//               // destroyInactiveTabPane={true}
//               items={StaticData.map((_, index) => {
//                 return {
//                   label: (
//                     <div>
//                       <div>
//                         <img style={{ width: iconSize, height: iconSize }} src={iconItems[index]}></img>
//                       </div>
//                       <span style={{ color: nameColor, fontSize: nameSize, textShadow: 'none' }}>
//                         {itemNames[index]}
//                       </span>
//                     </div>
//                   ),
//                   key: itemNames[index],
//                   children: (<></>),
//                   // forceRender: true
//                 };
//               })}>
//             </Tabs>
//           </div>
//         </>
//       );
//     }
//   }
// }

export default class App extends Component {
  constructor(props) {
    super(props);
    const { type } = props;
    console.log('type: ' + type);
    const Render = renderHashMap[type || "default"];
    const options = {
      changeConfiguration: this.handleOptionsChange,
      configuration: this.handleConfiguration(),
      ...this.props
    };
    this.state = {
      id: '',
      currentRender: <Render {...options}></Render>
    };
    console.log('重新加载页面');
  }

  //处理配置更新
  handleOptionsChange = (pluginOptions) => {
    const {
      bigscreen: { updateBlockById, pluginDetailMap },
      block: {
        baseConfig: { id }
      }
    } = this.props;
    const containerId = pluginOptions.containerId;
    if (pluginOptions.containerId) {
      updateBlockById(containerId, {
        dataConfig: {
          configs: [
            {
              name: "网页",
              type: 0,
              value: pluginOptions.tabLink1
            }
          ],
          defaultValue: null,
          defaultType: 3
        }
      });
    }
    updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
    //调用加载器的run方法强制更新
    pluginDetailMap[`${id}-default`].detail.ref.current.run();
    console.log('更新数据-----');
  };

  //处理需要的变量
  handleConfiguration = () => {
    console.log(block);
    const { block } = this.props;
    const { dataConfig } = block;
    const { pluginOptions = {} } = dataConfig;
    return pluginOptions;
  };

  render() {
    return <div style={{ width: '100%', height: '100%' }}>{this.state.currentRender}</div>;
  }
}