<template>
  <div
    class="bigscreen_secondary"
    :style="{
      width: '100%',
      height: '100%',
    }"
    ref="bigscreen_secondary"
    :id="id"
  ></div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import configJson from "../../../pluginTemp/config.json";

export default {
  name: "space6BC",
  components: {},
  data() {
    return {
      id: "",
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    bigscreen: Object,
    componentId: String,
    configuration: Object,
    options: Object,
    updateProcess: Function,
  },
  created() {},
  mounted() {
    this.connectBC();
    this.pubSub &&
      this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
        console.log(data);
      });
    window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `bigscreen_secondary_${configJsonRequireNum}_${id}`;
  },
  methods: {
    connectBC() {
      const bc = new BroadcastChannel(this.options?.externalVariables?.BCname||'DemoNameBC'); //可以接受一个DOMString作为 name，用以标识这个 channel。在其他页面，可以通过传入相同的 name 来使用同一个广播频道。只用同样标识的页面才能收到广播，不同的收不到。
      console.log(bc.name); // 输出构造实例的标识，haorooms。
      bc.onmessage =  (e)=> {
        // 通过onmessage监听事件
        console.log("receive:", e.data);
        this.triggerEvent(e.data)
      };
      bc.addEventListener("message", (e) => {
        // 通过addEventLister监听事件，和上面的onmessage都可以，二选一，我个人倾向addEventlister
        console.log("receivebyaddEventlistener:", e.data);
      });
      bc.onmessageerror = function (e) {
        console.warn("error:", e);
        this.connectBC();
        console.log("尝试重新连接BC");
      };
    },
    triggerEvent(data) {
      console.log(data);
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "receiveBCInfo", {
          value: data,
        });
    },
    Event_Center_getName() {
      return this.id;
    },
  },
};
</script>

<style scoped></style>
