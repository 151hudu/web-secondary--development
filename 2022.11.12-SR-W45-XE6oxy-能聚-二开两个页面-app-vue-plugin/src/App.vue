<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <!-- -->
    <div class="topSearch">
      <el-select v-model="nowDep" value-key="id" style="width: 350px; margin-right: 20px" filterable @change="changeDep" clearable placeholder="请选择">
        <el-option v-for="item in depOptions" :key="item.id" :label="item.name" :value="item"> </el-option>
      </el-select>
      <el-date-picker
        clearable
        v-model="timeValue"
        @change="changeDate()"
        value-format="timestamp"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-date-picker clearable v-model="yearValue" placeholder="选择年" style="width: 120px; margin-left: 20px" @change="changeYear()" value-format="timestamp" type="year">
      </el-date-picker>
    </div>
    <div class="topCard">
      <div class="topCard_Div" v-for="(item, index) of topCardData" :class="{ focus: item.focus }" :key="index" @click="focusCardInfo(item)">
        <div class="topCard_Div_Title">
          <img class="topCard_Div_Title_Img" :src="item.src" width="16px" height="16px" alt="" />
          <span class="topCard_Div_Title_Span">{{ item.early_warning_type_name }}</span>
        </div>
        <span class="topCard_Div_Info">{{ item.num }} </span>
      </div>
    </div>
    <hr />
    <div class="bottomInfoList">
      <div class="bottomInfo" v-for="(item, index) of bottomInfoData.childList" :key="index">
        <div class="bottomInfoTitle">{{ item.early_warning_type_name }}</div>
        <div class="bottomInfoItem">
          <div class="bottomInfoItemItem" v-for="(itemSon, indexSon) of item.childList" :key="indexSon" @click="goDetial(itemSon, item)">
            <div class="bottomInfoItemItemLeft">
              <img src="../pluginTemp/images/上下布局/信息.png" width="14px" height="14px" alt="" />
              <span>{{ itemSon.early_warning_type_name }}</span>
            </div>
            <div class="bottomInfoItemItemRight">
              <span>{{ itemSon.childList?.num ? itemSon.childList.num : 0 }}</span>
              <img src="../pluginTemp/images/上下布局/箭头.png" width="16px" height="16px" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { queryWarningType, queryCountByOfficeId, user, queryConfigJumpUrl, queryAssetById } from "./api/asset";
import "./index.css";
import { RadioButton, RadioGroup, Cascader, DatePicker, Select, Option } from "element-ui";
import Vue from "vue";
import Utils from "./utils";
import moment from "moment";
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Cascader);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);

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
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.id]) {
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
      id: "",
      //业务代码
      topCardData: [],
      depOptions: [],
      timeValue: [],
      bottomInfoData: {},
      messageFlag: "",
      depInfo: {
        name: "",
        id: "",
      },
      nowDep: {
        name: "",
        id: "",
      },
      yearValue: "",
      props: {
        lazy: true,
        label: "name",
        value: "id",
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.data) {
            queryCountByOfficeId(node.data.id).then((res) => {
              // console.log(res);
              var nodes = res.data.map((item, idnex) => {
                return {
                  name: item.office.name,
                  leaf: !item.office.hasChild,
                  id: item.office.id,
                };
              });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          } else {
            var nodes = [];
            resolve(nodes);
          }
        },
      },
    };
  },
  mounted() {
    let message = this.customConfig.系统表资产ID || "76b8e795-65da-aca4-ccc3-25aa048a8f09";
    queryAssetById(message).then((res) => {
      this.depOptions = Utils.translatePlatformDataToJsonArray(res).map((item) => {
        return {
          name: item.name,
          id: item.id,
        };
      });
    });
    user().then((res) => {
      this.depInfo.name = res.data.office_name;
      this.depInfo.id = "";
      this.nowDep.name = res.data.office_name;
      this.searInfo();
    });
    console.log(this.customConfig, "customConfig");
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
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
    searInfo() {
      if (this.customConfig.是否派发 && this.customConfig.是否派发 == "已派发") {
        this.messageFlag = true;
      } else if (this.customConfig.是否派发 && this.customConfig.是否派发 == "未派发") {
        this.messageFlag = false;
      }
      let message = {
        flag: this.messageFlag,
        time1: this.timeValue ? this.timeValue[0] || "" : "",
        time2: this.timeValue ? this.timeValue[1] || "" : "",
        companyId: this.depInfo.id || "",
      };
      if (this.yearValue) {
        message.time1 = moment(this.yearValue).startOf("year").format("x");
        message.time2 = moment(this.yearValue).endOf("year").format("x");
      }
      let message2 = [];
      queryWarningType(message).then((res) => {
        res.data.forEach((item) => {
          switch (item.early_warning_type_name) {
            case "财务规范":
              item.src = require("../pluginTemp/images/上下布局/小图标/财务规范.png");
              message2[0] = item;
              break;
            case "墓葬领域":
              item.src = require("../pluginTemp/images/上下布局/小图标/墓葬领域.png");
              message2[9] = item;
              break;
            case "校园小微工程":
              item.src = require("../pluginTemp/images/上下布局/小图标/校园小微工程.png");
              message2[10] = item;
              break;
            case "农村土地发包":
              item.src = require("../pluginTemp/images/上下布局/小图标/农村土地发包.png");
              message2[11] = item;
              break;
            case "退役军人优抚":
              item.src = require("../pluginTemp/images/上下布局/小图标/退役军人优抚.png");
              message2[12] = item;
              break;
            case "农村集体资产":
              item.src = require("../pluginTemp/images/上下布局/小图标/农村土地发包.png");
              message2[13] = item;
              break;
            case "公务接待":
              item.src = require("../pluginTemp/images/上下布局/小图标/公务接待.png");
              message2[1] = item;
              break;
            case "会议、培训、差旅":
              item.src = require("../pluginTemp/images/上下布局/小图标/会议、培训、差旅.png");
              message2[2] = item;
              break;
            case "津补贴和奖金福利发放":
              item.src = require("../pluginTemp/images/上下布局/小图标/津补贴和奖金.png");
              message2[3] = item;
              break;
            case "公务用车配备":
              item.src = require("../pluginTemp/images/上下布局/小图标/公务用车配备.png");
              message2[4] = item;
              break;
            case "楼堂馆所、办公用房建设":
              item.src = require("../pluginTemp/images/上下布局/小图标/楼堂馆所.png");
              message2[5] = item;
              break;
            case "项目及工程结算":
              item.src = require("../pluginTemp/images/上下布局/小图标/项目及工程结算.png");
              message2[6] = item;
              break;
            case "工程项目监督":
              item.src = require("../pluginTemp/images/上下布局/小图标/工程项目监督.png");
              message2[7] = item;
              break;
            case "区块链预警":
              item.src = require("../pluginTemp/images/上下布局/小图标/区块链预警.png");
              message2[8] = item;
              break;
          }
        });

        this.topCardData = message2;
        this.topCardData[0].focus = true;
        this.bottomInfoData = this.topCardData[0];
      });
    },
    changeDep(val) {
      if (val == "") {
        this.nowDep.name = this.depInfo.name;
      }
      this.searInfo();
    },
    changeDate() {
      this.searInfo();
    },
    changeYear() {
      this.timeValue = [];
      this.timeValue.push(Number(moment(this.yearValue).startOf("year").format("x")))
      this.timeValue.push(Number(moment(this.yearValue).endOf("year").format("x")))
      this.searInfo();
    },
    focusCardInfo(item) {
      this.topCardData.forEach((item, index) => {
        delete item.focus;
      });
      item.focus = true;
      this.bottomInfoData = item;
      this.$forceUpdate();
    },
    goDetial(itemSon, item) {
      let message = {
        flag: this.messageFlag,
        id: itemSon.id,
      };
      console.log(this.depInfo, this.nowDep);
      queryConfigJumpUrl(message).then((res) => {
        let url = `${window.location.origin}${res.data[0].jump_url}&setName=${this.depInfo.name == this.nowDep.name ? "" : this.nowDep.name || ""}&time1=${
          this.timeValue ? this.timeValue[0] || "" : ""
        }&time2=${this.timeValue ? this.timeValue[1] || "" : ""}&data_type=${res.data[0].early_warning_type_id}&title=${itemSon.early_warning_type_name}`;
        window.open(url, "_blank");
      });
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
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
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
.topSearch {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-right: 20px;
}
.topCard {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.topCard_Div {
  height: 100px;
  width: 248px;
  padding: 20px 25px;
  border-radius: 4px;
  background: #f6f7fa;
  margin-right: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  &:hover {
    border: 1px solid #0454f2;
    height: 100px;
    width: 248px;
  }
}
.topCard_Div_Title {
  display: flex;
  margin-bottom: 15px;
}
.topCard_Div_Title_Img {
  margin-top: 4px;
  margin-right: 3px;
}
.topCard_Div_Title_Span {
  color: #000000;
  font-family: PingFang TC;
  font-weight: 700;
  font-size: 16px;
}
.topCard_Div_Info {
  font-size: 24px;
  color: #0454f2;
  font-family: D-DIN-PRO;
  font-weight: 700;
}
.bottomInfoTitle {
  margin-bottom: 20px;
  color: #0c0d0e;
  font-family: PingFang TC;
  font-weight: 700;
  font-size: 16px;
  line-height: normal;
  letter-spacing: 0px;
}
.bottomInfo {
  margin-bottom: 15px;
}
.bottomInfoItem {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.bottomInfoItemItem {
  height: 48px;
  width: 375px;
  background: #f6f7fa;
  display: flex;
  justify-content: space-between;
  margin-right: 24px;
  cursor: pointer;
  margin-bottom: 20px;
}
.bottomInfoItemItemLeft {
  img {
    margin-top: -40px;
    margin-left: 17px;
    margin-right: 10px;
  }
  span {
    line-height: 48px;
    width: 210px;
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*超出部分省略号表示*/
    white-space: nowrap; /*强制单行显示*/
    display: inline-block; /*转换为行内块元素*/
  }
}
.bottomInfoItemItemRight {
  span {
    color: #0c0d0e;
    font-family: D-DIN-PRO;
    font-weight: 700;
    font-size: 24px;
    line-height: 48px;
    letter-spacing: 0px;
    text-align: center;
  }
  img {
    margin-top: -11px;
    margin-left: 15px;
    margin-right: 18px;
  }
}
.focus {
  border: 1px solid #0454f2;
  width: 248px;
  height: 98px;
  background: #dee7f9;
}
/deep/.el-date-editor .el-range-separator {
  padding: 0px;
}
</style>
