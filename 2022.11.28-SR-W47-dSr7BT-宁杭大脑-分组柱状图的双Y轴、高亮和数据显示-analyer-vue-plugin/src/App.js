import React, { Component } from "react";
import { Table, Button, message } from "antd";
import * as echarts from "echarts";
import "./app.less";
import Configuration from "./components/configuration";
import downImg from "./tab_down.png";
const componentMap = {
  designConfiguration: Configuration,
};
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
export default class App extends Component {
  state = {
    dataSource: [],
    rowId: "",
    columns: [],
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
    }
  }
  initEcharts(data) {
    let echartsData = [];
    echartsData[0]=data.dims[0].data
    echartsData[1]=data.vals[0].data
    echartsData[2]=data.vals[1].data
    let Xdata = [];
    let Ydata1 = [];
    let Ydata2 = [];
    echartsData.forEach((item, index) => {
        Xdata.push(item[0]);
        Ydata1.push(item[1]);
        Ydata2.push(item[2]);
    });
    let maxValue = Math.ceil(Math.max.apply(null, Ydata1.concat(Ydata2)) / 10) * 10;
    const myChart = echarts.init(this.refs.head3D);
    const offsetX = this.柱体宽度;
    const offsetY = this.柱体宽度 / 2;
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

    const VALUE = [100, 200, 300, 400, 300, 200, 100];

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
        data: [this.第一组名称, this.第二组名称],
        icon: "circle",
        textStyle: {
          color: "#fff",
        },
      },
      grid: {
        left: "0%",
        right: "0%",
        top: "20%",
        bottom: "0%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: Xdata,
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: "#7A92A7",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
        },
      },
      yAxis: [
        {
          type: "value",
          max: maxValue,
          min: 0,
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              color: "#7A92A7",
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
            fontSize: 14,
          },
          // boundaryGap: ['20%', '20%'],
        },
        {
          type: "value",
          nameTextStyle: {
            color: "#d2d2d2",
          },
          max: maxValue,
          min: 0,
          scale: true,
          position: "right",
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              color: "#7A92A7",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 14,
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
                color: "#59A6DC",
              },
              {
                offset: 1,
                color: "#2D52D7",
              },
            ]);
            let cubeRightStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#4EA4E0",
              },
              {
                offset: 1,
                color: "#2445B8",
              },
            ]);
            let cubeTopStyle = {
              color: "#4E9CD3",
            };
            var location = api.coord([api.value(0), api.value(1)]);
            location = [location[0] - this.柱体宽度, location[1]];
            var location1 = api.coord([api.value(0), 0]);
            location1 = [location1[0] - this.柱体宽度, location1[1]];
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
              fontSize: 16,
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
                  fontSize: 15,
                },
              },
              fontSize: 16,
              color: "transparent",
              offset: [this.第一柱数值左右位置, -25],
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
                color: "#0DF5D6",
              },
              {
                offset: 1,
                color: "#019ABB ",
              },
            ]);
            let cubeRightStyle = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#08E8C9",
              },
              {
                offset: 1,
                color: "#008CA9",
              },
            ]);
            let cubeTopStyle = {
              color: "#0DEED4",
            };
            var location = api.coord([api.value(0), api.value(1)]);
            location = [location[0] + this.柱体宽度, location[1]];
            var location1 = api.coord([api.value(0), 0]);
            location1 = [location1[0] + this.柱体宽度, location1[1]];
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
                  fontSize: 15,
                },
              },
              fontSize: 16,
              color: "transparent",
              offset: [this.第二柱数值左右位置, -25],
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
    myChart.on("mouseover", (params) => {
      console.log(params);
    });
    myChart.setOption(option, true);
  }

  componentDidMount() {
    const { dataSource, updateProcess, componentId, type } = this.props;
    const data = dataSource;
    type !== "designConfiguration" && this.initEcharts(data);

    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();
    this.initEcharts(data);
    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }

  render() {
    const { dataSource, rowId, columns } = this.state;
    const { componentId, options = {}, type } = this.props;
    const { externalVariables = {} } = options;
    const { headerBGColor = "#0f2437" } = externalVariables;
    const RenderComponent = componentMap[type];
    if (RenderComponent) {
      return <RenderComponent {...this.props} />;
    }
    return <div ref="head3D" style={{ width: "100%", height: "100%" }}></div>;
  }
}
