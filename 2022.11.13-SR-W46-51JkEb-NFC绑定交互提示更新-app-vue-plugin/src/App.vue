<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div class="iotNFC" ref="iotNFC" style="width: 100%;height: 100%">
    <div class="btnBox">
      <el-button class="nfcBtn" type="primary" @click="openCode">开启NFC服务</el-button>
    </div>
    <div v-if="dialogVisible" class="zhezhao" @click="diaLogClose">
      <!-- 加载 -->
      <div v-if="dotLoading == 'load'" class="loading">
        <div class="dotBox">
          <div class="greenDot"></div>
          <div class="yellowDot"></div>
          <div class="blueDot"></div>
        </div>
      </div>
      <!-- 绑定 -->
      <div v-if="dotLoading == 'success'" class="dialogBox">
        <div class="dialogBody">
          <b class="nfcTitle">NFC绑定</b>
          <div class="nfcTip" :style="{color: NFCBind == 1 ? '#75d4c4' : '#ff8d8d'}">
            <i :class="NFCBind == 1 ? 'el-icon-success' : 'el-icon-warning'" style="font-size: 20px"></i>
            &nbsp;&nbsp;{{NFCBind == 1 ? messageTip : messageTip}}
          </div>
        </div>
        <div class="lineHr"></div>
        <div class="dialogFoot">
          <div v-if="NFCBind == 0" class="footBtn" @click="footBtnHandel('0')">知道了</div>
          <div v-if="NFCBind == 1" class="footBtn btnClass" @click="setForm">上报记录</div>
          <div v-if="NFCBind == 1" class="footBtn" @click="footBtnHandel('1')">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
// import vConsole from './utils/vconsole.js'
import {
  Button,
  Icon
} from "element-ui";
import Vue from "vue"
import Utils from "./utils";
import { bindPatrolPoint } from "./api/asset"

Vue.use(Button)
Vue.use(Icon)
// Vue.use(vConsole)
export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "iotNFC",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    // allParams: Object,
  },
  data() {
    return {
      dialogVisible: false,
      dotLoading: '',
      phonePower: "",
      NFCBind: 0,
      nfcTaskId: "",
      nfcRouteId: "",
      dataIdKey: "",
      routerUrl: "",
      fromData: null,
      messageTip: ""
    }
  },
  mounted() {
    // this.putNFCResult();
    let { taskId, routeId,dataIdKey,routerUrl } = this.customConfig;
    this.dataIdKey = dataIdKey;
    this.routerUrl = routerUrl;
    this.nfcTaskId = this.getQueryString(taskId);
    this.nfcRouteId = this.getQueryString(routeId);
    // console.log('this.customConfig',this.customConfig);
    // console.log('taskId, routeId',this.nfcTaskId,this.nfcRouteId);
    // 判断当前系统是ios还是安卓
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      console.log('安卓手机')
      this.phonePower = "Android"
    }
    if (isIOS) {
      console.log('苹果手机')
      this.phonePower = "ios"
    }
    if (window.IotJSInterface) {
      window.IotJSInterface.putNFCResult = this.putNFCResult;
    }else {
      window.IotJSInterface = {
        putNFCResult: this.putNFCResult
      }
    }
    //用于注册事件定义，不可删除
    let {componentId} = this.customConfig || {};
    componentId &&
    window.componentCenter?.register(
      componentId,
      "comp",
      this,
      eventActionDefine
    );
  },
  methods: {
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let {componentId, appId} = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return "NFC事件";
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    // do_EventCenter_setEvent(value) {
    //   this.setForm(value)
    // },
    getQueryString(name) {
      const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return r[1];
      return "";
    },
    // 请求接口
    putNFCResult(pointName) {
      console.log('NFCRes',pointName);
      // let params = {
      //   task_id: "XJ_T20221111000290",
      //   patrol_spot_nfc: "BW_PT_20221",
      //   route_id: "XG_L20221027000005",
      // }
      let params = {
        task_id: this.nfcTaskId,
        patrol_spot_nfc: pointName,
        route_id: this.nfcRouteId,
      }
      bindPatrolPoint(params).then(({ data }) => {
        console.log('data',data);
        this.fromData = data;
        this.messageTip = data.msg;
        this.NFCBind = data.successFlag;
        if (data) {
          this.dotLoading = "success";
        }
      }).catch(({data})=>{
        console.log('err',data);
        if (data.status == 500) {
          this.messageTip = data.result.message;
          this.dotLoading = "success";
        }else {
          this.messageTip = "绑定失败！";
          this.dotLoading = "success";
        }
      })
    },
    footBtnHandel(vals){
      this.diaLogClose();
      if (vals == '1') {
        // this.triggerEvent('refreshList',{})
        window.location.reload()
        // console.log('this.allParams',this.allParams);
        // this.allParams.loadRefresh && this.allParams.loadRefresh();
      }
    },
    openCode() {
      switch (this.phonePower) {
        case 'Android':
          FEParksJSInterface.startNFCListening()
          this.dialogVisible = true;
          this.dotLoading = "load";
          break;
        // case 'ios':
        //   window.webkit.messageHandlers.FEParksJSInterface.startNFCListening();
        //   this.dialogVisible = true;
        //   this.dotLoading = "load";
        //   break;
      }
    },
    diaLogClose() {
      switch (this.phonePower) {
        case 'Android':
          this.dotLoading = "";
          this.dialogVisible = false;
          FEParksJSInterface.stopNFCListening()
          break;
        // case 'ios':
        //   this.dotLoading = "";
        //   this.dialogVisible = false;
        //   window.webkit.messageHandlers.FEParksJSInterface.stopNFCListening();
        //   break;
      }
    },
    setForm() {
      let dataId = this.fromData.data_id;
      console.log('dataId',dataId);
      // this.triggerEvent('setForm',dataId)
      let urlA = this.routerUrl.indexOf('?')
      this.diaLogClose();
      if (urlA != "-1") {
        // alert(`${window.location.origin}${this.routerUrl}&${this.dataIdKey}=${dataId}`)
        window.location.href = `${window.location.origin}${this.routerUrl}&${this.dataIdKey}=${dataId}`;
      } else {
        // alert(`${window.location.origin}${this.routerUrl}?${this.dataIdKey}=${dataId}`)
        window.location.href = `${window.location.origin}${this.routerUrl}?${this.dataIdKey}=${dataId}`;
      }
    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>


<style lang="less" scoped>
/* 翻转 */
@keyframes  dotFlip{
  0%{transform-origin:center center; transform:rotate(0deg)}
  100%{transform-origin:center center; transform:rotate(360deg)}
}
.iotNFC {
  user-select: none;
  position: relative;
  .btnBox {
    padding: 10px 20px;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 9;
    border-radius: 10px 10px 0 0;
    box-sizing: border-box;
    .nfcBtn {
      width: 100% !important;
    }
  }
  .zhezhao {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(204, 204, 204, 0.3);
    z-index: 99;

    .loading {
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background: #ffffff;
      border-radius: 15px;
      z-index: 100;
      .dotBox {
        animation: dotFlip 1.2s linear infinite;
        position: relative;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        .greenDot,.yellowDot,.blueDot {
          width: 10px;
          height: 10px;
          background-color: #7cc636;
          border-radius: 50%;
        }
        .greenDot {
          margin: -4px auto;
        }
        .yellowDot {
          position: absolute;
          right: -3px;
          bottom: 3px;
          background-color: #ffa526;
        }
        .blueDot {
          position: absolute;
          left: -3px;
          bottom: 3px;
          background-color: #327df9;
        }
      }
    }
    .dialogBox {
      // height: 200px;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80%;
      border-radius: 15px;
      background: #ffffff;
      .dialogBody {
        padding-top: 44px;
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .nfcTitle {
          margin-bottom: 12px;
          color: #353536;
          font-size: 14px;
        }
        .nfcTip {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
      .lineHr {
        width: 100%;
        border-bottom: 2px solid #f8f8f8;
      }
      .dialogFoot {
        display: flex;
        justify-content: space-around;
        height: 45px;
        width: 100%;

        .footBtn {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          font-size: 14px;
          color: #398cff;
          font-weight: 700;
        }
        .btnClass {
          color: #656565;
          border-right: 2px solid #f8f8f8;
        }
      }
    }
  }
}
</style>