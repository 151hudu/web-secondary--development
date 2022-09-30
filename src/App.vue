<template>
  <div :style="{ width: '100%', height: '100%' }">
    <div class="topInfo">
      <span
        >{{ this.options?.externalVariables.topTitle ? this.options?.externalVariables.topTitle : ""
        }}<span style="font-size: 18px; font-weight: 700">{{ this.topInfoFiled }}</span></span
      >
      <el-radio-group v-model="radio" class="radioGroup" @change="changeRadio">
        <el-radio :label="0">效果优先</el-radio>
        <el-radio :label="1">速度优先</el-radio>
        <el-radio :label="2">综合推荐</el-radio>
      </el-radio-group>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :name="index" v-for="(item, index) in panelData" :key="index">
        <template slot="title">
          <div class="collapseTitle">
            <img
              v-if="index == 0"
              class="titleImg"
              :src="options?.externalVariables.firstImg"
              alt=""
            />
            <img
              v-if="index == 1"
              :src="options?.externalVariables.secondImg"
              class="titleImg"
              alt=""
            />
            <img
              v-if="index == 2"
              :src="options?.externalVariables.thirdImg"
              class="titleImg"
              alt=""
            />
            <img
              v-if="index == 3"
              :src="options?.externalVariables.fourthImg"
              class="titleImg"
              alt=""
            />
            <span style="flex: 0.5">{{ item[options?.externalVariables.itemTitle] }}</span>
            <span style="flex: 1"
              >综合推荐指数：<span v-if="index == 0" style="color: red; font-weight: 700">{{ item[options?.externalVariables.itemAllNum] }}% </span>
              <span v-if="index == 1" style="color: #f89629; font-weight: 700">{{ item[options?.externalVariables.itemAllNum] }}% </span>
              <span v-if="index == 2" style="color: #03e8b3; font-weight: 700">{{ item[options?.externalVariables.itemAllNum] }}% </span>
              <span v-if="index == 3" style="color: #12bff4; font-weight: 700">{{ item[options?.externalVariables.itemAllNum] }}% </span>
              <span>丨{{ item[options?.externalVariables.itemTime] }}</span></span
            >
            <div style="flex: 0.2">
              <!-- <span>详情</span>
              <span>上图</span> -->
            </div>
          </div>
        </template>
        <img :src="item[options?.externalVariables?.itemImg]" alt="" />
        <div class="contentInfo">
          <div class="contentInfoLeft">
            <span style="color: #fff; font-weight: 500; font-size: 18px"
              >{{ options?.externalVariables?.content1KeyName ? options?.externalVariables?.content1KeyName : ""
              }}<span style="color: #00ffc8; font-weight: 700">{{
                item[options?.externalVariables?.content1KeyValue] ? item[options?.externalVariables?.content1KeyValue] : ""
              }}</span></span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content2KeyName ? options?.externalVariables?.content2KeyName : "" }}
              {{ item[options?.externalVariables?.content2KeyValue] ? item[options?.externalVariables?.content2KeyValue] : "" }}</span
            >
            <span style="color: #fff; font-size: 16px"
              >{{ options?.externalVariables?.content3KeyName ? options?.externalVariables?.content3KeyName : "" }}
              {{ item[options?.externalVariables?.content3KeyValue] ? item[options?.externalVariables?.content3KeyValue] : "" }}</span
            >
            <span style="color: #fff; font-size: 16px"
              >{{ options?.externalVariables?.content4KeyName ? options?.externalVariables?.content4KeyName : "" }}
              {{ item[options?.externalVariables?.content4KeyValue] ? item[options?.externalVariables?.content4KeyValue] : "" }}</span
            >
            <span style="color: #fff; font-size: 16px"
              >{{ options?.externalVariables?.content5KeyName ? options?.externalVariables?.content5KeyName : "" }}
              {{ item[options?.externalVariables?.content5KeyValue] ? item[options?.externalVariables?.content5KeyValue] : "" }}</span
            >
            <span style="color: #fff; font-size: 16px"
              >{{ options?.externalVariables?.content6KeyName ? options?.externalVariables?.content6KeyName : "" }}
              {{ item[options?.externalVariables?.content6KeyValue] ? item[options?.externalVariables?.content6KeyValue] : "" }}</span
            >
          </div>
          <div class="contentInfoRight">
            <span style="color: #fff; font-size: 18px"
              >{{ options?.externalVariables?.content7KeyName ? options?.externalVariables?.content7KeyName : ""
              }}<span style="color: #00ffc8; font-weight: 700">{{
                item[options?.externalVariables?.content7KeyValue] ? item[options?.externalVariables?.content7KeyValue] : ""
              }}</span></span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content8KeyName ? options?.externalVariables?.content8KeyName : "" }}
              {{ item[options?.externalVariables?.content8KeyValue] ? item[options?.externalVariables?.content8KeyValue] : "" }}</span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content9KeyName ? options?.externalVariables?.content9KeyName : "" }}
              {{ item[options?.externalVariables?.content9KeyValue] ? item[options?.externalVariables?.content9KeyValue] : "" }}</span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content9KeyName ? options?.externalVariables?.content10KeyName : "" }}
              {{ item[options?.externalVariables?.content9KeyValue] ? item[options?.externalVariables?.content10KeyValue] : "" }}</span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content11KeyName ? options?.externalVariables?.content11KeyName : "" }}
              {{ item[options?.externalVariables?.content11KeyValue] ? item[options?.externalVariables?.content11KeyValue] : "" }}</span
            >
            <span style="color: #409EFF; font-size: 16px"
              >{{ options?.externalVariables?.content12KeyName ? options?.externalVariables?.content12KeyName : "" }}
              {{ item[options?.externalVariables?.content12KeyValue] ? item[options?.externalVariables?.content12KeyValue] : "" }}</span
            >
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import echarts from "echarts";
import { normalizeData } from "./normalizeData";
import { queryAssetById } from "./api/asset";
export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object,
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
    };
  },
  computed: {
    // data: function () {
    //   return this.data || [];
    // },
    // options: function () {
    //   return this.options || [];
    // },
    // variable: function () {
    //   return this.variable || [];
    // },
    // customConfigClone: function () {
    //   return JSON.stringify(this.customConfig);
    // },
  },
  watch: {
    // customConfigClone: (newval) => {
    //   console.log("customConfigChange", customConfigClone);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // data: (newvalue) => {
    //   console.log("dataChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // variable: (newvalue) => {
    //   console.log("variableChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // options: (newvalue) => {
    //   console.log("optionsChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
  },
  created() {},
  mounted() {
    // console.log(this.options, 1555);
    // this.options = this.customConfig.options;
    this.topInfoFiled = this.GetQueryString(this.options?.externalVariables?.topFiled ? this.options?.externalVariables?.topFiled : "");
    let message = this.options?.externalVariables?.assetsId ? this.options?.externalVariables?.assetsId : "";
    queryAssetById(message).then((res) => {
      this.panelAllData = this.translatePlatformDataToJsonArray(res);
      this.panelAllData.forEach((item, index) => {
        item[this.options?.externalVariables?.itemTime] = this.formatDate(item[this.options?.externalVariables?.itemTime]);
      });
      // console.log(this.translatePlatformDataToJsonArray(res));
      this.sort(this.options?.externalVariables?.content1KeyValue);
      this.panelData[0] = this.panelAllData[0];
      this.panelData[1] = this.panelAllData[1];
      this.panelData[2] = this.panelAllData[2];
      this.panelData[3] = this.panelAllData[3];
      this.$forceUpdate();
    });
    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];
  },

  methods: {
    sort(type) {
      this.panelAllData.sort(this.compare(type));
    },
    compare(key) {
      return function (b, a) {
        var val1 = a[key].toString();
        var val2 = b[key].toString();
        console.log(val1, val2);
        return val1.replace(/\D/g, "") - val2.replace(/\D/g, "");
      };
    },
    changeRadio(val) {
      console.log(val);
      this.panelData = [];
      if (val == 0) {
        this.sort(this.options?.externalVariables?.content1KeyValue);
        this.panelData[0] = this.panelAllData[0];
        this.panelData[1] = this.panelAllData[1];
        this.panelData[2] = this.panelAllData[2];
        this.panelData[3] = this.panelAllData[3];
        this.$forceUpdate();
      } else if (val == 1) {
        this.sort(this.options?.externalVariables?.content9KeyValue);
        this.panelData[0] = this.panelAllData[0];
        this.panelData[1] = this.panelAllData[1];
        this.panelData[2] = this.panelAllData[2];
        this.panelData[3] = this.panelAllData[3];
        this.$forceUpdate();
      } else {
        this.sort(this.options?.externalVariables?.itemAllNum);
        this.panelData[0] = this.panelAllData[0];
        this.panelData[1] = this.panelAllData[1];
        this.panelData[2] = this.panelAllData[2];
        this.panelData[3] = this.panelAllData[3];
        this.$forceUpdate();
      }
      console.log(this.panelData);
    },
    formatDate(d) {
      var now = new Date(parseFloat(d));
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (date >= 0 && date <= 9) {
        date = "0" + date;
      }
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
      }
      if (second >= 0 && second <= 9) {
        second = "0" + second;
      }
      return year + "-" + month + "-" + date;
    },
    // 获取URL参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
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
    Event_Center_getName: () => {
      return "Demo实例";
    },
    do_EventCenter_messageSuccess: function (param) {
      console.log(param);
      alert("动作执行成功！");
    },
    clickbt: function () {
      console.log("clickbt");
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.customConfig.componentId, "onClick", {
          name: "二开插件",
        });
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
  background-color: rgba(14,61,113,0.9);
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
