<template>
  <div :id="id" :ref="id" style="width: 100%">
    <el-date-picker
      v-model="dataPicker"
      type="daterange"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="dateChange"
      :picker-options="pickerOptions"
    >
    </el-date-picker>
    <p class="chartsTitle">等效时数对比图</p>
    <div style="height: 500px; width: 100%" id="contrastCharts"></div>
    <span>
      {{ this.dataPicker[0] }}至 {{ this.dataPicker[1] }}时间段内
      <br />
      总等效时数最大的为【{{ this.allData.max_equivalent_hours_name }}】，总等效时数最大为【{{ this.allData.max_equivalent_hours }}】，
      <br />
      总等效时数最小的为【{{ this.allData.min_equivalent_hours_name }}】，总等效时数最大为【{{ this.allData.min_equivalent_hours }}】，
      <br />
      所有电站的平均等效时数最大为【{{ this.allData.maxAvg }}】
    </span>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import Utils from "@/utils";
import * as echarts from "echarts";
import { DatePicker } from "element-ui";
import configJson from "../../../pluginTemp/config.json";
import Vue from "vue";
import { compareAnalyse } from "../../api/asset";
Vue.use(DatePicker);
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
    history: Object,
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
      xData: [],
      name: [],
      yData: [],
      allData: {},
      ids: "1,10,100",
      dataPicker: "",
      pickerOptions: {
        disabledDate(time) {
          let now = new Date(); //获取此时的时间
          let nowData = new Date( //获取此时年月日的后一天
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1 //获取明天
          );
          let oneMonthAgo = new Date( //获取一个月之前的时间
            now.getFullYear(),
            now.getMonth() - 1, //获取上一个月
            now.getDate() + 1 //将多算的一天减掉
          );

          return (
            time.getTime() > nowData.getTime() - 1000 || //可以选择到今天的xxx:xxx:xxx:23:59:59，只有的全部disabled
            time.getTime() < oneMonthAgo.getTime() //小于一个月的全部disabled掉
          );
        },
      },
    };
  },
  mounted() {
    const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 6);
    const startTime =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    const date2 = new Date();
    const endTime =
      date2.getFullYear() +
      "-" +
      (date2.getMonth() + 1 < 10 ? "0" + (date2.getMonth() + 1) : date2.getMonth() + 1) +
      "-" +
      (date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate());

    this.dataPicker = [startTime, endTime];
    this.initData();
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    //用于id标识，不可删除
    let id = this.customConfig?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `app_secondary_${configJsonRequireNum}_${id}`;
  },
  methods: {
    dateChange(val) {
      this.initData();
    },
    initData() {
      let message = {
        type: this.customConfig.type || 0,
        startTime: this.dataPicker[0],
        endTime: this.dataPicker[1],
        ids: this.ids,
      };
      compareAnalyse(message).then((res) => {
        this.allData = res.data;
        let message = res.data.data.sort();
        message[message.length - 1].forEach((element) => {
          this.xData.push(element.time);
        });
        res.data.data.forEach((item) => {
          let info = [];
          item.forEach((item2, index2) => {
            if (this.xData[index2] == item2.time) {
              info.push(item2.equivalent_hours_d);
            } else {
              info.push(0);
            }
          });
          this.name.push(item[0]?.name);
          this.yData.push(info);
        });
        this.initEcharts(this.xData, this.name, this.yData);
      });
    },
    initEcharts(xData, name, Ydata) {
      const myChart = echarts.init(document.getElementById("contrastCharts"));
      let xLabel = xData;
      let serise = [];
      console.log(xData, name, Ydata);
      Ydata.forEach((item, index) => {
        serise.push({
          name: name[index],
          type: "line",
          symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbolSize: 0,
          smooth: true,
          tooltip: {
            show: true,
          },
          data: item,
        });
      });
      let options = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            console.log(params);
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += "<div>" + params[i].marker + params[i].seriesName + "&nbsp;&nbsp;&nbsp;" + "<span style='float:right'>" + params[i].value + "h" + "</span>" + "</div>";
            }
            return relVal;
          },
        },
        grid: {
          left: "3%",
          right: "2%",
          top: "10%",
          bottom: "8%",
        },
        legend: {
          align: "left",
          top: "10px",
          textStyle: {
            color: "#000",
            fontSize: 20,
          },
          itemGap: 25,
          itemWidth: 50,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: "#000",
                padding: 10,
                fontSize: 12,
              },
              formatter: function (data) {
                return data;
              },
            },

            axisTick: {
              show: false,
            },
            data: xLabel,
          },
        ],
        yAxis: [
          {
            name: "h",
            nameTextStyle: {
              color: "#000",
              fontSize: 12,
              padding: 10,
            },
            splitLine: {
              show: false,
            },
            min: 0,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#000",
                padding: 10,
              },
              formatter: function (value) {
                if (value === 0) {
                  return value;
                }
                return value;
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: serise,
      };
      // 绘制图表
      myChart.setOption(options, true);
      function debounce(func, ms = 1000) {
        let timer;
        return function (...args) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            func.apply(this, args);
          }, ms);
        };
      }
      const task = () => {
        console.log("resize");
        myChart.resize();
      };
      const debounceTask = debounce(task, 1000);
      window.addEventListener("resize", debounceTask);
    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    do_EventCenter_searchInfoDuiBi(value) {
      console.log(value, 290);
      var idsStr = value.charcoalId
        .map(function (obj, index) {
          return obj.id;
        })
        .join(",");
      this.ids = idsStr;
      this.initData();
    },
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName(value) {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_EventCenter前缀
    // do_EventCenter_actionName(value) {
    //   this.selected = value;
    // }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.chartsTitle {
  font-size: 22px;
  font-weight: 700;
  margin-top: 50px;
}
/deep/.el-range-separator {
  padding: 0;
}
</style>
