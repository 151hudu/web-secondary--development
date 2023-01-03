import React, { Component } from "react";
import * as echarts from "echarts";
import "./index.less";
export default class Main extends Component {
  state = {
    id: "",
    width: "100%",
    height: "100%",
    number: 1,
  };
  constructor(props) {
    super(props);
    let options = JSON.parse(JSON.stringify(props.options));
    if (props.options?.externalVariables) {
      this.大环颜色 = options?.externalVariables?.大环颜色 || "#187AFE";
      this.小环颜色 = options?.externalVariables?.小环颜色 || "#B5C1CD";
      this.大环圆角角度 = options?.externalVariables?.大环圆角角度 || "20";
      this.数值文字大小 = options?.externalVariables?.数值文字大小 || "60px";
      this.数值文字颜色 = options?.externalVariables?.数值文字颜色 || "black";
      this.数值文字字体 = options?.externalVariables?.数值文字字体 || "";
      this.副标题文字大小 = options?.externalVariables?.副标题文字大小 || "30px";
      this.副标题文字颜色 = options?.externalVariables?.副标题文字颜色 || "#444444";
      this.副标题文字字体 = options?.externalVariables?.副标题文字字体 || "";
      this.图例一颜色 = options?.externalVariables?.图例一颜色 || "#B5C1CD";
      this.图例二颜色 = options?.externalVariables?.图例二颜色 || "red";
      this.图例一文字颜色 = options?.externalVariables?.图例一文字颜色 || "#B5C1CD";
      this.图例二文字颜色 = options?.externalVariables?.图例二文字颜色 || "#B5C1CD";
      this.图例一文字 = options?.externalVariables?.图例一文字 || "已完成";
      this.图例二文字 = options?.externalVariables?.图例二文字 || "未完成";
      this.图例一文字大小 = options?.externalVariables?.图例一文字大小 || "30px";
      this.图例二文字大小 = options?.externalVariables?.图例二文字大小 || "30px";
      this.图例一数值文字大小 = options?.externalVariables?.图例一数值文字大小 || "40px";
      this.图例二数值文字大小 = options?.externalVariables?.图例二数值文字大小 || "40px";
      this.图例一数值文字颜色 = options?.externalVariables?.图例一数值文字颜色 || "black";
      this.图例二数值文字颜色 = options?.externalVariables?.图例二数值文字颜色 || "black";
      this.图例一高度 = options?.externalVariables?.图例一高度 || "22%";
      this.图例二高度 = options?.externalVariables?.图例二高度 || "22%";
      this.图例一宽度 = options?.externalVariables?.图例一宽度 || "95%";
      this.图例二宽度 = options?.externalVariables?.图例二宽度 || "95%";
      this.图例背景颜色 = options?.externalVariables?.图例背景颜色 || "#F7F8FA";
      this.图表背景颜色 = options?.externalVariables?.图表背景颜色 || "transparent";
    }
  }
  componentDidMount() {
    //封装平台方法
    //同时封装外层dom id为需求编号，初始化事件注册，重要勿删
    this.props.mainInit && this.props.mainInit(this);
    const { dataSource } = this.props;
    const data = JSON.parse(JSON.stringify(dataSource));
    this.initComData();
    this.initEcharts(data);
    this.图例一数值 = Number(data[1][0]);
    this.图例二数值 = Number(data[1][1]);
  }
  initEcharts(data) {
    console.log(data);
    const myChart = echarts.init(this.refs.nanshanhuanxingtu);
    let result = {
      total: Number(data[1][0]) + Number(data[1][1]),
      value: Number(data[1][0]),
      color: this.大环颜色,
    };
    result.rate = result.value / result.total.toFixed(4);
    let echartData = [
      {
        name: "",
        value: result.value,
        itemStyle: {
          normal: {
            color: result.color,
          },
        },
      },
      {
        name: "",
        value: result.total - result.value,
        itemStyle: {
          normal: {
            color: "rgba(31, 110, 255, 0)",
          },
        },
      },
    ];
    let echartData2 = [
      {
        name: "",
        value: 1202132131231,
        itemStyle: {
          normal: {
            color: this.小环颜色,
          },
        },
      },
      {
        name: "",
        value: 0,
        itemStyle: {
          normal: {
            color: "rgba(31, 110, 255, 0)",
          },
        },
      },
    ];
    let option = {
      backgroundColor: this.图表背景颜色,
      title: [
        {
          text: result.total,
          subtext: "总计",
          textStyle: {
            color: this.数值文字颜色,
            fontSize: this.数值文字大小,
            fontWeight: "bold",
            fontFamily: this.数值文字字体,
          },
          subtextStyle: {
            color: this.副标题文字颜色,
            fontSize: this.副标题文字大小,
            fontFamily: this.副标题文字字体,
            top: "center",
          },
          itemGap: 20,
          left: "center",
          top: "30%",
        },
      ],
      // legend: {
      //   formatter: function (name) {
      //     return "<div>1231231</div>";
      //   },
      // },
      polar: {
        radius: ["44%", "50%"],
        center: ["50%", "50%"],
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      radiusAxis: {
        type: "category",
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: "pie",
          startAngle: 90,
          radius: ["60%", "80%"],
          center: ["50%", "38%"],
          data: echartData,
          hoverAnimation: false,
          z: 13,
          label: {
            show: false,
          },
          itemStyle: {
            normal: {
              borderRadius: this.大环圆角角度,
              borderCap: "round",
            },
          },
        },
        {
          type: "pie",
          z: 2,
          startAngle: 90 + (1 - result.rate) * 360,
          radius: ["63.5%", "76.5%"],
          center: ["50%", "38%"],
          data: echartData2,
          hoverAnimation: false,
          label: {
            show: false,
          },
        },
      ],
    };
    myChart.setOption(option, true);
    myChart.setOption(option);
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
    //dataSource为分析仪左侧拖入的数据源
    const { dataSource, customConfig, options } = this.props;
    //customOptions为传统的输入框形式的配置项
    const customOptions = options?.externalVariables || {};
    //特别注意，因为配置项区域是懒加载，所以这里要给customConfig一个与配置项(designConfiguration下index.js)那边customConfig一样的默认值，否则由于第一次进去没有执行配置项的代码，customConfig此时其实是会报错，以下为样例
    customConfig.number && this.setState({ number: customConfig.number });
  };

  Event_Center_getName() {
    return this.state.id;
  }

  /**
   * 用于触发事件方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Array} payload 事件传参
   *
   */
  triggerEvent = (eventName, payload) => {
    this.props.componentId &&
      window.eventCenter?.triggerEvent(
        this.props.componentId,
        eventName,
        //payload需为一个object
        payload
      );
  };
  handleClick = () => {
    console.log(this);
    this.triggerEvent("click", { value: "123" });
  };

  render() {
    return (
      <div className="analyzer-secondary" style={{ width: this.state.width, height: this.state.height, display: "flex", background: this.图表背景颜色 }} id={this.state.id}>
        <div ref="nanshanhuanxingtu" style={{ width: "45%", height: "100%" }}></div>
        <div className="echartsInfo" style={{ width: "53%", height: "75%" }}>
          <div style={{ height: this.图例一高度, width: this.图例一宽度, background: this.图例背景颜色 }}>
            <div className="colorBox">
              <div style={{ background: this.图例一颜色 }}></div>
              <span style={{ fontSize: this.图例一文字大小, color: this.图例一文字颜色 }}>{this.图例一文字}</span>
            </div>
            <div className="numBox">
              <span style={{ fontSize: this.图例一数值文字大小, color: this.图例一数值文字颜色 }}>{this.图例一数值}</span>
            </div>
          </div>
          <div style={{ height: this.图例二高度, width: this.图例二宽度, background: this.图例背景颜色 }}>
            <div className="colorBox">
              <div style={{ background: this.图例二颜色 }}></div>
              <span style={{ fontSize: this.图例二文字大小, color: this.图例二文字颜色 }}>{this.图例二文字}</span>
            </div>
            <div className="numBox">
              <span style={{ fontSize: this.图例二数值文字大小, color: this.图例二数值文字颜色 }}>{this.图例二数值}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
