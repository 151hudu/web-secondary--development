<template>
  <div :id="id" :ref="id" class="
secondary--development_app" :style="{ height: heightDev + 'px' }">
    <iframe id="iframe" ref="iframeHy" class="iframeHy" :src="iframeSrc"></iframe>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import Utils from "@/utils";
import configJson from "../../../pluginTemp/config.json";
import { queryAssetById } from '@/api/asset.js'
import qs from "querystringify";
import request from "@/api/request.js";
import {
  Message

} from "element-ui";
import axios from "axios";
import Vue from "vue";
Vue.prototype.$message = Message;
export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      return {
        themeColor,
        textColor
      };
    }
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      iframeSrc: '',
      heightDev: this.customConfig.height || 600,
      loginApi: '',
      username: '',
      password: ''
    };
  },
  async created() {
    const { 资产Id: assetId, 路由参数名称: routerName, 登录页名称: logWebName } = this.customConfig
    const { valueSrc, iframeIp, iframeDk, iframeLj, valueApi, loginIp, loginDk, loginLj, userFielf, userM } = this.customConfig
    let controller_id = qs.parse(window.location.search)[routerName];

    const res = await queryAssetById(assetId)
    let arr = Utils.translatePlatformDataToJsonArray(res)
    // console.log(arr, this.customConfig, '==============资产数据');
    let item = arr.filter(x => {
      return x.controller_id == controller_id
    })
    if (!item || item.length == 0) {
      console.log('该id暂无数据----------------------');
    } else {
      this.iframeSrc = valueSrc + '://' + item[0][iframeIp] + ':' + item[0][iframeDk] + item[0][iframeLj]
      this.loginApi = valueApi + '://' + item[0][loginIp] + ':' + item[0][loginDk] + item[0][loginLj]

      this.username = item[0][userFielf]
      this.password = item[0][userM]

      // console.log(item[0], item[0][iframeIp], iframeIp, valueSrc, '该id暂无数据----------------------');
    }

  },

  mounted() {
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    //用于id标识，不可删除
    let id = this.customConfig?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `secondary_app_${configJsonRequireNum}_${id}`;

    // this.$nextTick(() => {
    // this.$refs.iframeHy.onreadystatechange = this.showHomeload
    this.$refs.iframeHy.onload = this.showHomeload

    // this.$refs.iframeHy.onDOMContentLoaded = function (e) {
    //   console.log('事件更新');
    // }
    // // })

    // window.onload = this.showHomeload

    // this.showHomeload()


  },
  methods: {

    async showHomeload(e) {


      console.log(e, '响应事件');
      const { 资产Id: assetId, 路由参数名称: routerName, 登录页名称: logWebName } = this.customConfig
      let controller_id = qs.parse(window.location.search)[routerName]
        ;

      const res = await queryAssetById(assetId)
      let arr = Utils.translatePlatformDataToJsonArray(res)
      let item = arr.filter(x => {
        return x.controller_id == controller_id
      })
      // console.log(item, '================数据');
      if (!item || item.length == 0) {
        console.log('该id暂无数据----------------------');


      } else {
        let param = logWebName == '巡检' ? { account: this.username, password: this.password } : { username: this.username, password: this.password }
        // axios
        //   .post(`${loginApi}`, param).then(res => {
        //     console.log(res);
        //   }).catch(err => {
        //     console.log(err);
        //   })

        request.post(`${this.loginApi}`, param).then(res => {

          this.$refs.iframeHy.contentWindow.postMessage({ token: res.data.data.token }, '*')
          console.log(res.data.data.token, res.data, '===========巡检1');
        }).catch(err => {

          if (err.status == 200) {
            console.log(err.data.data.token, err.data, '===========巡检2');
            this.$refs.iframeHy.contentWindow.postMessage({ token: err.data.data.token }, '*')
          }

        })


      }


      // window.removeEventListener('message', this.showHomeload)
    },





    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    }
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_EventCenter前缀
    // do_EventCenter_actionName(value) {
    //   this.selected = value;
    // }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>
<style lang="less" scoped>
.secondary--development_app {
  height: 100%;
}

.iframeHy {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
