import React, { Component } from "react";
import MsgCompConfig from "./msgCompConfig.js";
import * as echarts from "echarts";
import Utils from "../../utils";
import { queryConfigWithoutToken, getDataInfo } from "../../api/asset";
import "./app.css";
export default class Main extends Component {
  state = {
    id: "headTopChart",
    width: "100%",
    height: "100%",
  };
  constructor(props) {
    super(props);
    const { pubSub } = props;
    // pubSub?.subscribe &&
    //   pubSub.subscribe("analyzeDataSource", (data) => {
    //     this.initEcharts && this.initEcharts(data);
    //   });
    let options = JSON.parse(JSON.stringify(props.options || {}));
    this.背景颜色 = options?.externalVariables?.背景颜色 || "#040B20";
    this.左侧字体大小 = options?.externalVariables?.左侧字体大小 || "14px";
    this.top位置 = options?.externalVariables?.top位置 || "200";
    this.柱体宽度 = options?.externalVariables?.柱体宽度 || "14";
    this.柱体文字大小 = options?.externalVariables?.柱体文字大小 || "14px";
    this.roadShow = options?.externalVariables?.roadShow || "true";
    this.road_posShow = options?.externalVariables?.road_posShow || "true";
    console.log(this.背景颜色);
  }
  componentDidMount() {
    //dataSource为分析仪左侧拖入的数据源
    const { dataSource, updateProcess, componentId, options } = this.props;
    this.initComData();
    window?.componentCenter?.register(componentId, "comp", this, MsgCompConfig);
    const customOptions = this.props.options?.externalVariables;
    //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
    const requirementNum = process.env.CUSTOM_PLUGIN_REQUIREMENT_NUMBER === "需求编号" ? "" : process.env.CUSTOM_PLUGIN_REQUIREMENT_NUMBER;
    const id = customOptions?.id ? `analyzer_secondary_${requirementNum}_${customOptions.id}` : `analyzer_secondary_${requirementNum}_${Utils.generateUUID()}`;
    customOptions?.width && this.setState({ width: customOptions.width });
    customOptions?.height && this.setState({ height: customOptions.height });
    this.setState({ id });
    updateProcess && updateProcess();
  }
  compare(key) {
    return function (a, b) {
      var val1 = a[key];
      var val2 = b[key];
      return val1 - val2;
    };
  }
  initEcharts(data) {
    console.log(data);
    data.list.sort(this.compare("rate"));
    let YdataName = [];
    let Xdata = [];
    let Dvalue = [];
    let TopData = [];
    data.list.forEach((item, index) => {
      YdataName.push(item.name);
      Xdata.push(item.rate);
      TopData.unshift("top " + (index + 1));
    });
    if (YdataName.length < 5) {
      let l = YdataName.length
      for (let k = 0; k < 5 - l; k++) {
        YdataName.unshift("");
        Xdata.unshift("");
        Dvalue.unshift("");
        TopData.unshift("");
      }
    }
    const myChart = echarts.init(this.refs.headTopAnalyzer);
    let option = {
      backgroundColor: this.背景颜色,
      grid: {
        left: "5%",
        top: "5%",
        right: "0%",
        bottom: "3%",
      },
      xAxis: [
        {
          show: false,
        },
      ],
      yAxis: [
        {
          splitLine: "none",
          axisTick: "none",
          axisLine: "none",
          axisLabel: {
            align: "left",
            interval: 0,
            verticalAlign: "bottom",
            padding: [0, 0, 10, 50],
            lineHeight: 15,
            fontSize: this.左侧字体大小,
            textStyle: {
              color: "#88A2B5",
            },
          },
          data: YdataName,
        },
        {
          splitLine: "",
          axisTick: "none",
          axisLine: "none",
          position: "left",
          data: TopData,
          axisLabel: {
            show: true,
            align: "left",
            interval: 0,
            verticalAlign: "bottom",
            lineHeight: 35,
            padding: [0, 0, 0, 10],
            fontSize: this.左侧字体大小,
            textStyle: {
              color: function (value) {
                if (value == "top 1" || value == "top 2" || value == "top 3") {
                  return "#FED4A4";
                } else {
                  return "#9DBACC";
                }
              },
            },
          },
        },
        {
          splitLine: "none",
          axisTick: "none",
          axisLine: "none",
          data: [],
        },
      ],
      series: [
        {
          name: "",
          type: "bar",
          yAxisIndex: 0,
          data: Xdata,
          label: {
            normal: {
              show: true,
              color: "#fff",
              fontFamily: "arial",
              formatter: (data) => {
                if (String(data.data).indexOf(".") !== -1) {
                  return Number(data.data).toFixed(1)*100 + "%";
                } else {
                  return data.data*100 + "%";
                }
              },
              position: "left",
              offset: [70, 2],
              fontSize: this.柱体文字大小,
            },
          },
          barWidth: this.柱体宽度,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#226b81",
                },
                {
                  offset: 1,
                  color: "#00a7ff",
                },
              ]),
              barBorderRadius: 5,
            },
          },
          z: 2,
        },
        {
          name: "外框",
          type: "bar",
          yAxisIndex: 2,
          barGap: "-100%",
          data: Xdata,
          barWidth: 12,
          itemStyle: {
            normal: {
              color: "#121e47",
              opacity: 0.2,
              barBorderRadius: 5,
            },
          },
          z: 0,
        },
      ],
    };
    myChart.setOption(option, true);
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
  }
  initComData = () => {
    //customConfig为组件式配置项数据
    const customConfig = this.props?.customConfig || {};
    //customOptions为传统的输入框形式的配置项
    const customOptions = this.props.options?.externalVariables;
    //特别注意，因为配置项区域是懒加载，所以这里要给customConfig一个与配置项(designConfiguration下index.js)那边customConfig一样的默认值，否则由于第一次进去没有执行配置项的代码，customConfig此时其实是会报错，以下为样例
    const name = customConfig.服务编排名称 ? customConfig.服务编排名称 : "removalRescue_fiveMinutesDeparture";
    //!customConfig.number && (customConfig.number =1)
    queryConfigWithoutToken().then((res) => {
      let message = "";
      res.data.result.forEach((item) => {
        if (item.name == name) {
          message = item.value;
          let data = {
            param: {},
          };
          getDataInfo(message, data).then((resp) => {
            this.initEcharts(resp.data?.result?.res?.data);
          });
        }
      });
    });
  };

  Event_Center_getName() {
    return this.state.id;
  }

  render() {
    return (
      <div className="analyzer-secondary" style={{ width: this.state.width, height: this.state.height }} id={this.state.id}>
        <div ref="headTopAnalyzer" style={{ width: "100%", height: "100%" }}></div>;
      </div>
    );
  }
}
