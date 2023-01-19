import React, { Component } from "react";
import * as echarts from "echarts";
import downImg from "./tab_down.png";
import "./index.css";
export default class Main extends Component {
  state = {
    id: "charts" + (Math.random().toFixed(2) * 100).toString(),
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
    let options = JSON.parse(JSON.stringify(props.options));
    if (props.options?.externalVariables) {
      this.柱体宽度 = options?.externalVariables?.柱体宽度 || 20;
      this.第一柱数值左右位置 = options?.externalVariables?.第一柱数值左右位置 || 5;
      this.第二柱数值左右位置 = options?.externalVariables?.第二柱数值左右位置 || -5;
      this.标题文字 = options?.externalVariables?.标题文字 || "123";
      this.背景颜色 = options?.externalVariables?.背景颜色 || "#000";
      this.第一组名称 = options?.externalVariables?.第一组名称 || "发现障碍物的次数";
      this.第二组名称 = options?.externalVariables?.第二组名称 || "生产安置协议签订率";
      this.是否双Y轴 = options?.externalVariables?.是否双Y轴 || "是";
      this.是否双柱 = options?.externalVariables?.是否双柱 || "是";
      this.柱状图一顶颜色 = options?.externalVariables?.柱状图一顶颜色 || "#4E9CD3";
      this.柱状图二顶颜色 = options?.externalVariables?.柱状图二顶颜色 || "#0DEED4";
      this.柱状图一左百分0颜色 = options?.externalVariables?.柱状图一左百分0颜色 || "#59A6DC";
      this.柱状图一左百分百颜色 = options?.externalVariables?.柱状图一左百分百颜色 || "#2D52D7";
      this.柱状图二左百分0颜色 = options?.externalVariables?.柱状图二左百分0颜色 || "#0DF5D6";
      this.柱状图二左百分百颜色 = options?.externalVariables?.柱状图二左百分百颜色 || "#019ABB";
      this.柱状图一右百分0颜色 = options?.externalVariables?.柱状图一右百分0颜色 || "#4EA4E0";
      this.柱状图一右百分百颜色 = options?.externalVariables?.柱状图一右百分百颜色 || "#2445B8";
      this.柱状图二右百分0颜色 = options?.externalVariables?.柱状图二右百分0颜色 || "#08E8C9";
      this.柱状图二右百分百颜色 = options?.externalVariables?.柱状图二右百分百颜色 || "#008CA9";
      this.左Y轴标签 = options?.externalVariables?.左Y轴标签 || "";
      this.右Y轴标签 = options?.externalVariables?.右Y轴标签 || "";
      this.标签大小 = options?.externalVariables?.标签大小 || 10;
      this.top距离 = options?.externalVariables?.top距离 || "40%";
    }
  }
  componentDidMount() {
    const { dataSource, updateProcess, componentId, type } = this.props;
    const data = dataSource;
    //封装平台方法
    //同时封装外层dom id为需求编号，初始化事件注册，重要勿删
    this.props.mainInit && this.props.mainInit(this);
    this.initComData();
    if (this.是否双柱 == "是") {
      this.initEcharts(data);
    } else {
      this.initEcharts2(data);
    }
  }

  initEcharts = (data) => {
    console.log(this.柱体宽度);
    let echartsData = data;
    let Xdata = [];
    let Ydata1 = [];
    let Ydata2 = [];
    let ids = [];
    echartsData.forEach((item, index) => {
      if (index > 0) {
        item.forEach((item2, index2) => {
          if (index2 == 0) {
            Xdata.push(item2);
          } else if (index2 == 1) {
            Ydata1.push(item2);
          } else if (index2 == 2) {
            Ydata2.push(item2);
          } else {
            ids.push(item2);
          }
        });
      }
    });
    console.log(Xdata, Ydata1, Ydata2);
    let maxValue = Math.ceil(Math.max.apply(null, Ydata1.concat(Ydata2)) / 10) * 10;
    const myChart = echarts.init(this.refs.head3D123, null, { renderer: "svg" });
    const offsetX = Number(this.柱体宽度);
    const offsetY = Number(this.柱体宽度) / 2;
    // 绘制左侧面
    const CubeLeft = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        // 会canvas的应该都能看得懂，shape是从custom传入的
        const xAxisPoint = shape.xAxisPoint;
        // console.log(shape);
        const c0 = [shape.x, shape.y];
        const c1 = [shape.x - offsetX, shape.y - offsetY];
        const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
        const c3 = [xAxisPoint[0], xAxisPoint[1]];
        ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
      },
    });
    // 绘制右侧面
    const CubeRight = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint;
        const c1 = [shape.x, shape.y];
        const c2 = [xAxisPoint[0], xAxisPoint[1]];
        const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
        const c4 = [shape.x + offsetX, shape.y - offsetY];
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
      },
    });
    // 绘制顶面
    const CubeTop = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const c1 = [shape.x, shape.y];
        const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
        const c3 = [shape.x, shape.y - offsetX];
        const c4 = [shape.x - offsetX, shape.y - offsetY];
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
      },
    });
    // 注册三个面图形
    echarts.graphic.registerShape("CubeLeft", CubeLeft);
    echarts.graphic.registerShape("CubeRight", CubeRight);
    echarts.graphic.registerShape("CubeTop", CubeTop);

    let option = {
      backgroundColor: this.背景颜色,
      title: {
        text: this.标题文字,
        textStyle: {
          align: "left",
          color: "#fff",
          fontSize: 22,
        },
        top: "5%",
        left: "left",
      },
      grid: {
        left: "0%",
        right: "0%",
        top: this.top距离,
        bottom: "0%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params, ticket, callback) {
          return "";
        },
      },
      legend: {
        right: "0%",
        top: "5%",
        data: [
          { name: this.第一组名称, itemStyle: { color: this.柱状图一顶颜色 } },
          { name: this.第二组名称, itemStyle: { color: this.柱状图二顶颜色 } },
        ],
        icon: "rect",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: "#b0e8ffd8",
          fontSize: 10,
        },
      },
      xAxis: {
        type: "category",
        data: Xdata,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: "#b9e8ff",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: [
        {
          name: this.左Y轴标签,
          nameTextStyle: {
            color: "#b0e8ffd8",
            fontSize: this.标签大小,
            padding: [0, 0, 0, Ydata1.length>1?35:70],
          },
          type: "value",
          // max: maxValue,
          min: 0,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#b9e8ff",
            },
          },
          emphasis: {
            focus: "series",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#263045",
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
          // boundaryGap: ['20%', '20%'],
        },
        {
          name: this.右Y轴标签,
          nameTextStyle: {
            color: "#b0e8ffd8",
            fontSize: this.标签大小,
            padding: [0, 0, 0,  Ydata2.length>1?-15:-55],
          },
          type: "value",
          // max: maxValue,
          min: 0,
          scale: true,
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: this.是否双Y轴 == "是" ? "#b9e8ff" : "transparent",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      ],
      series: [
        {
          type: "custom",
          name: this.第一组名称,
          renderItem: (params, api) => {
            let cubeLeftStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一左百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图一左百分百颜色,
              },
            ]);
            let cubeRightStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一右百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图一右百分百颜色,
              },
            ]);
            let cubeTopStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一顶颜色,
              },
              {
                offset: 1,
                color: this.柱状图一顶颜色,
              },
            ]);
            var location = api.coord([api.value(0), api.value(1)]);
            location = [location[0] - Number(this.柱体宽度), location[1]];
            var location1 = api.coord([api.value(0), 0]);
            location1 = [location1[0] - Number(this.柱体宽度), location1[1]];
            return {
              type: "group",
              children: [
                {
                  type: "CubeLeft",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeLeftStyle,
                  },
                },
                {
                  type: "CubeRight",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeRightStyle,
                  },
                },
                {
                  type: "CubeTop",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeTopStyle,
                  },
                },
              ],
            };
          },

          data: Ydata1,
        },
        {
          type: "bar",
          barWidth: "40",
          label: {
            emphasis: {
              color: "#fff",
              fontSize: 12,
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "#fff",
                  height: -10,
                  width: 20,
                  padding: [0, 0, 30, 0],
                  align: "center",
                },
              },
            },
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return ["{img|" + params.value + "}"];
              },
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "transparent",
                  height: 0,
                  width: 0,
                  align: "center",
                  fontSize: 12,
                },
              },
              fontSize: 12,
              color: "transparent",
              offset: [Number(this.第一柱数值左右位置), -10],
            },
          },
          itemStyle: {
            color: "transparent",
          },
          tooltip: {},
          data: Ydata1,
        },
        {
          type: "custom",
          yAxisIndex: 1,
          name: this.第二组名称,
          renderItem: (params, api) => {
            let cubeLeftStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图二左百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图二左百分百颜色,
              },
            ]);
            let cubeRightStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图二右百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图二右百分百颜色,
              },
            ]);
            let cubeTopStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图二顶颜色,
              },
              {
                offset: 1,
                color: this.柱状图二顶颜色,
              },
            ]);
            var location = api.coord([api.value(0), api.value(1)]);
            location = [location[0] + Number(this.柱体宽度), location[1]];
            var location1 = api.coord([api.value(0), 0]);
            location1 = [location1[0] + Number(this.柱体宽度), location1[1]];
            return {
              type: "group",
              children: [
                {
                  type: "CubeLeft",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeLeftStyle,
                  },
                },
                {
                  type: "CubeRight",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeRightStyle,
                  },
                },
                {
                  type: "CubeTop",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeTopStyle,
                  },
                },
              ],
            };
          },
          data: Ydata2,
        },
        {
          type: "bar",
          barWidth: "40",
          label: {
            emphasis: {
              color: "#fff",
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "#fff",
                  height: -10,
                  width: 20,
                  padding: [0, 0, 30, 0],
                  align: "center",
                },
              },
            },
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return ["{img|" + params.value + "}"];
              },
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "transparent",
                  height: 0,
                  width: 0,
                  align: "center",
                  fontSize: 12,
                },
              },
              fontSize: 12,
              color: "transparent",
              offset: [Number(this.第二柱数值左右位置), -10],
            },
          },
          itemStyle: {
            color: "transparent",
          },
          tooltip: {},
          data: Ydata2,
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
    let resizeObserver = null;
    resizeObserver = new ResizeObserver(() => {
      // 宽高等变化后需要执行的逻辑
      debounceTask();
    });
    resizeObserver.observe(document.querySelector(`#${this.state.id}`));
    window.addEventListener("resize", debounceTask);
  };
  initEcharts2 = (data) => {
    console.log(this.柱体宽度);
    let echartsData = data;
    let Xdata = [];
    let Ydata1 = [];
    let Ydata2 = [];
    echartsData.forEach((item, index) => {
      if (index > 0) {
        item.forEach((item2, index2) => {
          if (index2 == 0) {
            Xdata.push(item2);
          } else if (index2 == 1) {
            Ydata1.push(item2);
          } else {
            Ydata2.push(item2);
          }
        });
      }
    });
    console.log(Xdata, Ydata1, Ydata2);
    let maxValue = Math.ceil(Math.max.apply(null, Ydata1.concat(Ydata2)) / 10) * 10;
    const myChart = echarts.init(this.refs.head3D123, null, { renderer: "svg" });
    const offsetX = Number(this.柱体宽度);
    const offsetY = Number(this.柱体宽度) / 2;
    // 绘制左侧面
    const CubeLeft = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        // 会canvas的应该都能看得懂，shape是从custom传入的
        const xAxisPoint = shape.xAxisPoint;
        // console.log(shape);
        const c0 = [shape.x, shape.y];
        const c1 = [shape.x - offsetX, shape.y - offsetY];
        const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
        const c3 = [xAxisPoint[0], xAxisPoint[1]];
        ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
      },
    });
    // 绘制右侧面
    const CubeRight = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint;
        const c1 = [shape.x, shape.y];
        const c2 = [xAxisPoint[0], xAxisPoint[1]];
        const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
        const c4 = [shape.x + offsetX, shape.y - offsetY];
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
      },
    });
    // 绘制顶面
    const CubeTop = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const c1 = [shape.x, shape.y];
        const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
        const c3 = [shape.x, shape.y - offsetX];
        const c4 = [shape.x - offsetX, shape.y - offsetY];
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
      },
    });
    // 注册三个面图形
    echarts.graphic.registerShape("CubeLeft", CubeLeft);
    echarts.graphic.registerShape("CubeRight", CubeRight);
    echarts.graphic.registerShape("CubeTop", CubeTop);

    let option = {
      backgroundColor: this.背景颜色,
      title: {
        text: this.标题文字,
        textStyle: {
          align: "left",
          color: "#fff",
          fontSize: 22,
        },
        top: "5%",
        left: "left",
      },
      grid: {
        left: "0%",
        right: "0%",
        top: this.top距离,
        bottom: "0%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params, ticket, callback) {
          return "";
        },
      },
      legend: {
        right: "0%",
        top: "5%",
        data: [
          { name: this.第一组名称, itemStyle: { color: this.柱状图一顶颜色 } },
          { name: this.第二组名称, itemStyle: { color: this.柱状图二顶颜色 } },
        ],
        icon: "rect",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: "#b0e8ffd8",
          fontSize: 10,
        },
      },
      xAxis: {
        type: "category",
        data: Xdata,
        axisLine: {
          interval: 0,
          show: true,
          lineStyle: {
            width: 1,
            color: "#b9e8ff",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: [
        {
          name: this.左Y轴标签,
          nameTextStyle: {
            color: "#b0e8ffd8",
            fontSize: this.标签大小,
            padding: [0, 0, 0, Ydata1.length>1?35:70],
          },
          type: "value",
          // max: maxValue,
          min: 0,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#b9e8ff",
            },
          },
          emphasis: {
            focus: "series",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#263045",
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
          // boundaryGap: ['20%', '20%'],
        },
        {
          name: this.右Y轴标签,
          type: "value",
          nameTextStyle: {
            color: "#b0e8ffd8",
            fontSize: this.标签大小,
            padding: [0, 0, 0,  Ydata2.length>1?-15:-55],
          },
          // max: maxValue,
          min: 0,
          scale: true,
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: this.是否双Y轴 == "是" ? "#b9e8ff" : "transparent",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      ],
      series: [
        {
          type: "custom",
          name: this.第一组名称,
          renderItem: (params, api) => {
            let cubeLeftStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一左百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图一左百分百颜色,
              },
            ]);
            let cubeRightStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一右百分0颜色,
              },
              {
                offset: 1,
                color: this.柱状图一右百分百颜色,
              },
            ]);
            let cubeTopStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.柱状图一顶颜色,
              },
              {
                offset: 1,
                color: this.柱状图一顶颜色,
              },
            ]);
            var location = api.coord([api.value(0), api.value(1)]);
            location = [location[0] - 0, location[1]];
            var location1 = api.coord([api.value(0), 0]);
            location1 = [location1[0] - 0, location1[1]];
            return {
              type: "group",
              children: [
                {
                  type: "CubeLeft",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeLeftStyle,
                  },
                },
                {
                  type: "CubeRight",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeRightStyle,
                  },
                },
                {
                  type: "CubeTop",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: location1,
                  },
                  style: {
                    fill: cubeTopStyle,
                  },
                },
              ],
            };
          },

          data: Ydata1,
        },
        {
          type: "bar",
          barWidth: "1",
          label: {
            emphasis: {
              color: "#fff",
              fontSize: 12,
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "#fff",
                  height: -10,
                  width: 20,
                  padding: [0, 0, 30, 0],
                  align: "center",
                },
              },
            },
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return ["{img|" + params.value + "}"];
              },
              rich: {
                img: {
                  backgroundColor: {
                    image: downImg,
                  },
                  color: "transparent",
                  height: 0,
                  width: 0,
                  align: "center",
                  fontSize: 12,
                },
              },
              fontSize: 12,
              color: "transparent",
              offset: [Number(this.第一柱数值左右位置), -10],
            },
          },
          itemStyle: {
            color: "transparent",
          },
          tooltip: {},
          data: Ydata1,
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
    let resizeObserver = null;
    resizeObserver = new ResizeObserver(() => {
      // 宽高等变化后需要执行的逻辑
      debounceTask();
    });
    resizeObserver.observe(document.querySelector(`#${this.state.id}`));
    window.addEventListener("resize", debounceTask);
  };
  initComData = () => {
    //customConfig为组件式配置项数据
    //dataSource为分析仪左侧拖入的数据源
    const { dataSource, customConfig, options } = this.props;
    //customOptions为传统的输入框形式的配置项
    const customOptions = options?.externalVariables;
    //特别注意，因为配置项区域是懒加载，所以这里要给customConfig一个与配置项(designConfiguration下index.js)那边customConfig一样的默认值，否则由于第一次进去没有执行配置项的代码，customConfig此时其实是会报错，以下为样例
    // const number = customConfig.number  || 1;
    // this.setState({number})
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
  triggerEvent(eventName, payload) {
    this.props.componentId &&
      window.eventCenter?.triggerEvent(
        this.props.componentId,
        eventName,
        //payload需为一个object
        payload
      );
  }

  render() {
    return (
      <div className="analyzer-secondary" style={{ width: this.state.width, height: this.state.height }} id={this.state.id}>
        <div ref="head3D123" style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
}
