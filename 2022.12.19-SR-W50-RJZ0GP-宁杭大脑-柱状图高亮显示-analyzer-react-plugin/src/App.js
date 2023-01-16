import React, { Component } from "react";
import * as echarts from "echarts";
import "./app.less";

import triangle from "./assets/triangle.png";

export default class App extends Component {
   constructor(props) {
      super(props);

      let external = props.options?.externalVariables ? props.options.externalVariables : {};

      // 背景颜色
      // this.backgroundColor = external["背景颜色"] || "#111";
      this.backgroundColor = external["背景颜色"] || "transparent";

      // 图表边距
      this.gridTop = external["图表上边距"] || "6%";
      this.gridBottom = external["图表下边距"] || "3%";
      this.gridLeft = external["图表左边距"] || "2%";
      this.gridRight = external["图表右边距"] || "2%";

      // 悬浮配置
      this.tooltipBackGround = external["悬浮背景渐变颜色"] || "#33BBFF00-#33BBFF55";

      // 图例配置
      this.legendPosition = external["图例整体位置"] || "3";
      this.legendColor = external["图例文字颜色"] || "#fff";
      this.legendFontSize = external["图例文字字号"] || "14";

      // X轴配置
      this.xAxisLineColor = external["X轴线颜色"] || "#4D6076";
      this.xAxisLineWidth = external["X轴线宽度"] || "2";
      this.xAxisLabelColor = external["X轴文本颜色"] || "#B9E8FF";
      this.xAxisLabelFontSize = external["X轴文本字号"] || "15";

      // Y轴配置
      this.yAxisLineColor = external["Y轴线颜色"] || "#4D6076";
      this.yAxisLineWidth = external["Y轴线宽度"] || "2";
      this.yAxisSplitLineColor = external["Y轴分割线线颜色"] || "#283C4D";
      this.yAxisLabelColor = external["Y轴文本颜色"] || "#B9E8FF";
      this.yAxisLabelFontSize = external["Y轴文本字号"] || "15";

      // 柱体配置
      this.barWidth = external["柱体宽度"] || "70";
      this.barColor = external["柱体颜色"] || "#33BBFF55";
      this.barBorderColor = external["柱体边框颜色"] || "#33BBFF";
      this.barBorderWidth = external["柱体边框宽度"] || "2";
      this.barTooltipColor = external["柱体悬浮颜色"] || "#33BBFF";
      this.barTooltipLabelColor = external["柱体悬浮字体颜色"] || "#fff";
      this.barTooltipLabelFontSize = external["柱体悬浮字体字号"] || "24";
      this.barTooltipLabelFontFamily = external["柱体悬浮字体系列"] || "";

      // 柱体悬浮配置
      this.barTooltipLabelOffset = external["柱体悬浮文字整体偏移位置"] || "0,-10";
      this.barTooltipLabelLineHeight = external["柱体悬浮文字与图标距离"] || "40";
      this.barTooltipImageWidth = external["柱体悬浮图标宽度"] || "27";
      this.barTooltipImageHeight = external["柱体悬浮图标高度"] || "12";
   }

   componentDidMount() {
      this.refs["nhdn_outermost"].parentNode.style.width = "100%";
      this.refs["nhdn_outermost"].parentNode.style.height = "100%";
      this.refs["nhdn_outermost"].parentNode.parentNode.style.minHeight = 0;

      this.handleEchartsData();

      this.Event_Center_getName = () => {
         return "宁杭大脑-柱状图高亮显示";
      };
   }

   handleEchartsData() {
      let propsData = JSON.parse(JSON.stringify(this.props.dataSource));

      let legendData = [];
      let xAxisData = [];
      let seriesData = [];

      propsData.forEach((item, index) => {
         if (index < 1) {
            legendData.push(item[1]);
         } else {
            xAxisData.push(item[0]);
            seriesData.push(item[1]);
         }
      });

      let maxValue = Math.ceil(Math.max.apply(null, seriesData)) * 1.25;

      this.initEcharts(legendData, xAxisData, seriesData, maxValue);
   }

   initEcharts(legendData, xAxisData, seriesData, maxValue) {
      let myChart = echarts.init(this.refs["nhdn_outermost"]);
      let option = {};

      let _offset = this.barTooltipLabelOffset.split(",");
      console.log("offset--->", _offset);

      option = {
         backgroundColor: this.backgroundColor,
         // 图例配置
         legend: {
            show: true,
            icon: "square",
            top: `${this.legendPosition}%`,
            left: "right",
            padding: [0, 40, 0, 0],
            textStyle: {
               color: this.legendColor,
               fontSize: this.legendFontSize,
            },
            data: legendData,
         },
         // 悬浮框样式
         tooltip: {
            trigger: "axis",
            show: true,
            // 背景色
            axisPointer: {
               type: "shadow",
               shadowStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     {
                        offset: 0,
                        color: this.tooltipBackGround.split("-")[0] || "#33BBFF00",
                     },
                     {
                        offset: 1,
                        color: this.tooltipBackGround.split("-")[1] || "#33BBFF55",
                     },
                  ]),
               },
            },
            formatter: function (params) {
               return "";
            },
         },
         // 整体大小
         grid: {
            top: this.gridTop,
            bottom: this.gridBottom,
            left: this.gridLeft,
            right: this.gridRight,
            containLabel: true,
            show: false,
         },
         // X轴
         xAxis: {
            type: "category",
            axisTick: { show: false },
            // 线
            axisLine: {
               show: true,
               lineStyle: {
                  width: this.xAxisLineWidth,
                  color: this.xAxisLineColor,
               },
            },
            // 文字
            axisLabel: {
               show: true,
               textStyle: {
                  color: this.xAxisLabelColor,
                  fontSize: this.xAxisLabelFontSize,
               },
            },
            data: xAxisData,
         },
         // Y轴
         yAxis: {
            type: "value",
            // 最大值
            max: maxValue,
            // 线
            axisLine: {
               show: true,
               lineStyle: {
                  width: this.yAxisLineWidth,
                  color: this.yAxisLineColor,
               },
            },
            // 文字
            axisLabel: {
               show: true,
               textStyle: {
                  color: this.yAxisLabelColor,
                  fontSize: this.yAxisLabelFontSize,
               },
            },
            // 分割线
            splitLine: {
               show: true,
               lineStyle: {
                  color: this.yAxisSplitLineColor,
                  type: "dashed",
               },
            },
         },
         // 数据
         series: [
            {
               name: legendData[0],
               type: "bar",
               barWidth: this.barWidth,
               // 柱样式
               itemStyle: {
                  color: this.barColor,
                  borderColor: this.barBorderColor,
                  borderWidth: this.barBorderWidth,
                  emphasis: {
                     color: this.barTooltipColor,
                  },
               },
               // 高亮文本
               emphasis: {
                  label: {
                     show: true,
                     color: this.barTooltipLabelColor,
                     fontWeight: "bolder",
                     fontSize: this.barTooltipLabelFontSize,
                     fontFamily: this.barTooltipLabelFontFamily,
                     offset: [Number(_offset[0]), Number(_offset[1])],
                     position: "outside",
                     formatter: (params) => {
                        return `{a|${params.value}}\n{b|}`;
                     },
                     rich: {
                        a: {
                           width: Number(this.barTooltipImageWidth),
                           lineHeight: this.barTooltipLabelLineHeight,
                           align: "center",
                        },
                        b: {
                           backgroundColor: { image: triangle },
                           width: Number(this.barTooltipImageWidth),
                           height: Number(this.barTooltipImageHeight),
                        },
                     },
                  },
               },
               data: seriesData,
            },
         ],
      };

      option && myChart.setOption(option);

      function debounce(func, ms = 1000) {
         let timer;
         return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
               func.apply(this, args);
            }, ms);
         };
      }
      const task = () => {
         myChart.resize();
      };
      const debounceTask = debounce(task, 300);
      window.addEventListener("resize", debounceTask);
   }

   render() {
      return <div ref="nhdn_outermost" style={{ width: "100%", height: "100%" }}></div>;
   }
}
