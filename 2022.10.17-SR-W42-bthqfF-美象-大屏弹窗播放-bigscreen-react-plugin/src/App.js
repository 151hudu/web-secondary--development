import React, { Component } from "react";
import DesignConfiguration from "./components/designConfiguration";

import { Button, Modal, message } from "antd";

import "./app.css";

import ReactPlayer from "react-player";

const renderHashMap = {
   dataConfigration: DesignConfiguration,
};

export default class App extends Component {
   state = {
      id: this.props.block?.baseConfig.id || "1",
      isModalOpen: false,
      liveUrl: "",
      modalSize: "55%",
      buttonIsShow: true,
      actionLiveUrl: "",
   };

   componentDidMount() {
      const { type } = this.props;
      if (!renderHashMap[type]) {
         this.initComData();
         const {
            block: {
               dataConfig: { pluginOptions = {} },
            },
         } = this.props;
         const events = [];

         const actions = [
            {
               key: "modalPlay",
               name: "弹窗播放",
               params: [
                  {
                     key: "value",
                     name: "setmodalPlay",
                     dataType: "string",
                  },
               ],
            },
            {
               key: "setActionLiveUrl",
               name: "设值",
               params: [
                  {
                     key: "value",
                     name: "actionLiveUrl",
                     dataType: "string",
                  },
               ],
            },
         ];

         window.componentCenter?.register &&
            window.componentCenter.register(this.props?.componentId, "comp", this, {
               events,
               actions,
            });
         this.props?.updateProcess && this.props.updateProcess();

         // 弹窗播放
         this.do_EventCenter_modalPlay = ({ value }) => {
            this.setState({
               isModalOpen: true,
            });
         };

         // 设置动作
         this.do_EventCenter_setActionLiveUrl = ({ value }) => {
            this.setState({
               actionLiveUrl: value,
            });
         };

         this.Event_Center_getName = () => {
            let name = this.props.block.baseConfig;
            if (name) {
               name = JSON.parse(JSON.stringify(name));
            }
            return name.name || "美象-监控弹窗";
         };
      }
   }

   //处理配置更新
   handleOptionsChange = (pluginOptions) => {
      const {
         bigscreen: { updateBlockById, pluginDetailMap },
         block: {
            baseConfig: { id },
         },
      } = this.props;
      updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
      pluginDetailMap[`${id}-default`].detail.ref.current.run();
   };

   //处理需要的变量
   handleConfiguration = () => {
      const { block } = this.props;
      const { dataConfig } = block;
      const { pluginOptions = {}, columns } = dataConfig;
      pluginOptions.columns = columns;
      return pluginOptions;
   };

   //加载配置数据
   initComData = async () => {
      const {
         block: {
            dataConfig: { pluginOptions = {} },
         },
      } = this.props;
      if (pluginOptions?.liveUrl) {
         this.setState({
            liveUrl: pluginOptions.liveUrl,
         });
      }
      if (pluginOptions?.modalSize) {
         this.setState({
            modalSize: pluginOptions.modalSize,
         });
      }
      this.setState({
         buttonIsShow: pluginOptions?.buttonIsShow,
      });
   };

   // 开启弹窗
   showModal = () => {
      if (!this.state.liveUrl) {
         return message.warning("未获取到播放地址");
      }
      this.setState({
         isModalOpen: true,
      });
   };

   // 关闭弹窗
   closeModal = () => {
      this.setState({
         isModalOpen: false,
      });
   };

   render() {
      const { type } = this.props;
      if (renderHashMap[type]) {
         const options = {
            changeConfiguration: this.handleOptionsChange,
            configuration: this.handleConfiguration(),
            ...this.props,
         };
         const Comp = renderHashMap[type];
         return <Comp {...options}></Comp>;
      } else {
         const { isModalOpen, liveUrl, buttonIsShow, actionLiveUrl, modalSize } = this.state;
         return (
            <>
               <div className="textList" style={{ width: "100%", height: "100%" }}>
                  {/* 播放按钮 */}
                  {buttonIsShow && <Button onClick={this.showModal}>点击播放</Button>}
                  {/* 弹窗 */}
                  <Modal
                     visible={isModalOpen}
                     mask={false}
                     closable={false}
                     centered={true}
                     footer={false}
                     maskClosable={false}
                     keyboard={false}
                     width={modalSize}
                     className="live_vedio"
                     destroyOnClose={true}
                  >
                     {/* 直播视频  https://hls.zcitc.net/live/cameraid/1002184%243/substream/1.m3u8 */}
                     <div class="container" style={{ width: "100%", height: "100%" }}>
                        <ReactPlayer
                           className="react-player"
                           url={actionLiveUrl ? actionLiveUrl : liveUrl}
                           playing
                           width="100%"
                           controls
                           config={{
                              file: {
                                 forceHLS: true,
                              },
                           }}
                        />
                     </div>
                     {/* 关闭按钮 */}
                     <svg
                        onClick={this.closeModal}
                        style={{ cursor: "pointer" }}
                        t="1666168751998"
                        class="icon live_vedio_close"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2530"
                        data-spm-anchor-id="a313x.7781069.0.i1"
                        width="38"
                        height="38"
                     >
                        <path
                           d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-572.330667L300.629333 240.213333a42.538667 42.538667 0 0 0-60.16 0.213334 42.410667 42.410667 0 0 0-0.213333 60.16L451.669333 512 240.213333 723.370667a42.538667 42.538667 0 0 0 0.213334 60.16 42.410667 42.410667 0 0 0 60.16 0.213333L512 572.330667l211.370667 211.413333a42.538667 42.538667 0 0 0 60.16-0.213333 42.410667 42.410667 0 0 0 0.213333-60.16L572.330667 512l211.413333-211.370667a42.538667 42.538667 0 0 0-0.213333-60.16 42.410667 42.410667 0 0 0-60.16-0.213333L512 451.669333z"
                           fill="#B8B6B5"
                           p-id="2531"
                           data-spm-anchor-id="a313x.7781069.0.i0"
                           class="selected"
                        ></path>
                     </svg>
                  </Modal>
               </div>
            </>
         );
      }
   }
}
