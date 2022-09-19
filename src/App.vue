<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%" :ref="identification">
    <!-- -->
    <div class="main_unit" :style="{ height: this.customConfig.unit_height ? this.customConfig.unit_height : '800px' }">
      <div class="menu_tree">
        <div class="icon_title">
          <img :src="this.customConfig.icon_URL" alt="" />
          <span>{{ this.customConfig.title }}</span>
        </div>
        <el-tree
          :data="treeData"
          :highlight-current="true"
          :props="defaultProps"
          ref="tree"
          @node-click="handleNodeClick"
          :check-strictly="true"
          :show-checkbox="this.customConfig.multiple_choice == 'true' ? true : false"
          @check-change="handleCheckChange"
        ></el-tree>
      </div>

      <iframe class="right_iframe" :src="this.iframe_URL" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { RadioButton, RadioGroup } from "element-ui";
import { queryAssetById, queryMenuByAssetId } from "./api/asset.js";
import Vue from "vue";
import utils from "@/utils";
import $ from "jquery";
import "./index.css";
Vue.use(RadioGroup);
Vue.use(RadioButton);

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.identification]) {
          this.styleEle = document.createElement("style");
          document.head.appendChild(this.styleEle);
          this.styleEle.innerText = style;
        }
      });
      return {
        themeColor,
        textColor,
      };
    },
  },
  data() {
    return {
      //必需，不可删除
      identification: "",
      //业务代码
      treeData: [],
      defaultProps: {
        children: "childList",
        label: "name",
      },
      iframe_URL: "",
    };
  },
  mounted() {
    let message = {
      assetId: this.customConfig.assetId,
      parentId: this.customConfig.father_node,
      flag: this.customConfig.permissions_flag,
    };
    queryMenuByAssetId(message).then((res) => {
      if (res.status == 200) {
        if (this.customConfig.multi_storey == "true") {
          this.treeData = res.data;
        } else {
          this.recursion(res.data);
        }
        console.log(this.treeData);
      }
    });
    this.iframe_URL = this.customConfig.iframe_URL;
    this.defaultProps.label = this.customConfig.show_name ? this.customConfig.show_name : "name";
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.identification = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`;
    //用于定义接收用户输入
    this.buttons = JSON.parse(buttons).data;
    this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue;
      this.triggerEvent("valueChange", {
        value: this.defaultValue,
      });
    }
  },
  methods: {
    handleCheckChange() {
      let nodeArr = this.$refs.tree.getCheckedNodes();
      let params = "";
      nodeArr.forEach((item, index) => {
        console.log(this.customConfig.data_filed, item[this.customConfig.data_filed]);
        if (index == 0) {
          params = `${this.customConfig.data_filed}=${item[this.customConfig.data_filed]}`;
        } else {
          params += `,${item[this.customConfig.data_filed]}`;
        }
      });
      let message = "";
      if (this.customConfig.iframe_URL.indexOf("?") != -1) {
        message = "&" + params;
      } else {
        message = "?" + params;
      }
      this.iframe_URL = this.customConfig.iframe_URL + message;
      console.log("当前iframeURL:", this.iframe_URL);
    },
    handleNodeClick(data) {
      if (this.customConfig.multiple_choice == "true") {
        return;
      } else {
        let params = `${this.customConfig.data_filed}=${data[this.customConfig.data_filed]}`;
        let message = "";
        if (this.customConfig.iframe_URL.indexOf("?") != -1) {
          message = "&" + params;
        } else {
          message = "?" + params;
        }
        this.iframe_URL = this.customConfig.iframe_URL + message;
        console.log("当前iframeURL:", this.iframe_URL);
      }
    },
    recursion(data) {
      data.forEach((item, index) => {
        this.treeData.push(item);
        if (item.childList.length > 0) {
          this.recursion(item.childList);
          item.childList = [];
        }
      });
    },
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
      this.setValue(value);
    },
    setValue(value) {
      this.selected = value;
    },
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.main_unit {
  width: 100%;
  overflow: hidden;
  display: flex;
  .menu_tree {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .icon_title {
      width: 100%;
      height: 40px;
      display: flex;
      img {
        height: 40px;
        width: 40px;
      }
      span {
        line-height: 40px;
        font-size: 18px;
      }
    }
  }
  .right_iframe {
    width: 85%;
    height: 100%;
  }
  /deep/.el-tree-node__content {
    height: 40px;
    .el-tree-node__label {
      font-size: 16px;
    }
  }
  /deep/.el-tree {
    background: transparent;
  }
    /deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: #e6f2ff !important;
    }
}
</style>
