<template>
  <div :style="{ width: '100%', height: '100%' }">
  </div>
</template>

<script>
import echarts from "echarts";
import { normalizeData } from "./normalizeData";
import { queryAssetById } from "./api/asset";
import Utils from "../utils/index";
export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object,
    componentId: String,
    updateProcess: Function,
  },
  data() {
    return {
      dataSource: [],
      rowId: "",
      default_value: "",
      id: "",
      activeName: 0,
      radio: 0,
      panelAllData: [],
      panelData: [],
      topInfoFiled: "",
      // options: "",
    };
  },
  created() {},
  mounted() {
    this.$forceUpdate();
    const events = [
      {
        key: "assetChangeTip",
        name: "资产变更",
        payload: [
          {
            name: "变更信息",
            dataType: "string",
            key: "value",
          },
        ],
      },
    ];
    const actions = [];
    console.log(this.componentId);
    window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "topPic", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
    this.connectWS()

  },

  methods: {
    connectWS() {
      let websocket;
      try {
        let url = `ws://${this.options?.externalVariables?.监听地址}`;
        console.log("-----前端开始连接websocket-----", url);
        websocket = new WebSocket(url);
        websocket.onerror = (e) => {
          console.log(e);
        };
        websocket.onopen = () => {
          console.log("连接成功");
          let ping = {
            commandType: "ASSET_DML_SUBSCRIBE",
            commandBody: { assetId: this.options?.externalVariables?.资产ID },
          };
          websocket.send(JSON.stringify(ping));
        };
        websocket.onmessage = (event) => {
          console.log("onmessage", event);
          console.log(JSON.parse(event.data)?.result?.data);
          JSON.parse(event.data)?.result?.data&&this.triggerEvent(JSON.parse(event.data)?.result);
        };
        window.onbeforeunload = () => {
          closeWebSocket();
        };
        websocket.onclose = (e) => {
          console.log("连接关闭");
          console.log("websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean);
          if (e.code * 1 === 1000 || e.code * 1 === 1006) {
            console.log("尝试重连");
            this.connectWS();
          }
        };
        function closeWebSocket() {
          websocket.close();
          websocket = null;
        }
      } catch (error) {
        console.log("e", error);
      }
    },
    triggerEvent(data) {
      console.log(data);
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "assetChangeTip", {
          value: data,
        });
    },
    Event_Center_getName: () => {
      return "Demo实例";
    },
    do_EventCenter_messageSuccess: function (param) {
      console.log(param);
      alert("动作执行成功！");
    },
  },
};
</script>
<style lang="less" scoped>
.topInfo {
  width: 100%;
  height: 50px;
  background-color: #02c198;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    line-height: 50px;
    color: #fff;
  }
  .radioGroup {
    margin-right: 20px;
    /deep/.el-radio__label {
      color: #fff;
    }
  }
}
.collapseTitle {
  display: flex;
  width: 100%;
}
.titleImg {
  width: 40px;
  height: 40px;
  margin-top: 5px;
  margin-right: 5px;
}
.contentInfo {
  width: 70%;
  height: 100%;
  display: flex;
}
.contentInfoLeft {
  width: 50%;
  padding-left: 20px;
  height: 100%;
  border-right: 1px solid #125b86;
  display: flex;
  flex-direction: column;
}
.contentInfoRight {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

/deep/.el-collapse {
  border-top: 0px;
  border-bottom: 0px;
}
/deep/.el-collapse-item__wrap {
  border-bottom: 0px;
}
/deep/.el-collapse-item__header {
  background-color: rgba(12, 79, 149, 0.9);
  color: #fff;
  font-size: 18px;
  padding-left: 20px;
  border-bottom: 0px;
}
/deep/.el-collapse-item__content {
  height: 210px;
  background-color: rgba(14, 61, 113, 0.9);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  img {
    height: 180px;
    width: 300px;
    min-width: 300px;
  }
}
/deep/.el-collapse-item {
  margin-bottom: 5px;
}
</style>
