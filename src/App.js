import React, { Component } from "react";
import * as echarts from "echarts";
import "./app.less";
import geoJson from "./region.json";
import chinaMapOutlineData from "./chinaMapOutlineData.json";
import $ from "jquery";
import backImg from "./Frame 33557.png";
export default class App extends Component {
  state = {};

  constructor(props) {
    super(props);
    console.log(props);
    let options = JSON.parse(JSON.stringify(props.options));
    if (props.options.externalVariables) {
      this.外层边界线条颜色 = options.externalVariables.外层边界线条颜色;
      this.外层边边界线条粗细 = options.externalVariables.外层边边界线条粗细;
      this.内层边界线条颜色 = options.externalVariables.内层边界线条颜色;
      this.内层边界线条粗细 = options.externalVariables.内层边界线条粗细;
      this.下层边界线条颜色 = options.externalVariables.下层边界线条颜色;
      this.地图颜色 = options.externalVariables.地图颜色;
      this.汇聚点 = options.externalVariables.汇聚点 ? eval(options.externalVariables.汇聚点) : "";
      this.汇聚点颜色 = options.externalVariables.汇聚点颜色;
      this.飞线颜色 = options.externalVariables.飞线颜色;
      this.toolTip宽度 = options.externalVariables.toolTip宽度;
      this.toolTip高度 = options.externalVariables.toolTip高度;
      this.toolTip文字颜色 = options.externalVariables.toolTip文字颜色;
      this.toolTip文字大小 = options.externalVariables.toolTip文字大小;
      this.地图文字颜色 = options.externalVariables.地图文字颜色;
    }
  }
  initEcharts(dataa) {
    let echartsData = [];
    dataa.forEach((item, index) => {
      if (index > 0) {
        let message = {
          coords: [],
        };
        dataa[0].forEach((sonItem, sonIndex) => {
          message[sonItem] = item[sonIndex];
        });
        echartsData.push(message);
      }
    });
    echartsData.forEach((item, index) => {
      geoJson.features.forEach((itemGeo, indexGeo) => {
        if (itemGeo.properties.name == item.name) {
          item.coords.push(itemGeo.properties.center);
        }
      });
    });
    echartsData.forEach((item, index) => {
      geoJson.features.forEach((itemGeo, indexGeo) => {
        if (itemGeo.properties.name == item.toAddress) {
          item.coords.push(itemGeo.properties.center);
          item.lineStyle = { color: this.飞线颜色 ? this.飞线颜色 : "#FB9825" };
        }
      });
    });
    let showRadio = this.汇聚点 ? this.汇聚点 : ["新疆", "江苏", "广东"];
    let points = [];
    showRadio.forEach((itemRadio, indexRadio) => {
      echartsData.forEach((item, index) => {
        if (item.name == itemRadio) {
          let message = {
            value: item.coords[0],
            itemStyle: {
              color: this.汇聚点颜色 ? this.汇聚点颜色 : "#FB9825",
            },
          };
          points.push(message);
        }
      });
    });
    const myChart = echarts.init(this.refs.watchOD);
    myChart.showLoading();
    let index = -1;
    let chinaMapOutline = chinaMapOutlineData;
    echarts.registerMap("china2", geoJson);
    echarts.registerMap("chinaMapOutline", chinaMapOutline);
    myChart.hideLoading();
    var data = [
      {
        name: "青海",
        value: 110,
      },
    ];
    let option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        borderWidth: 0,
        // position: 'unset',
        padding: 0,
        backgroundColor: "transparent",
        formatter: (params) => {
          var tip = "";
          if (params.data && params.data.toAddress) {
            tip = `<div style="position:relative;width:${this.toolTip宽度 ? this.toolTip宽度 : 100}px;height:${
              this.toolTip高度 ? this.toolTip高度 : 40
            }px;padding:0;display:flex;justify-content:center">
            <div  style='position:absolute;background:url(${backImg});background-size:100% 100%;width:${this.toolTip宽度 ? this.toolTip宽度 : 138}px;height:${
              this.toolTip高度 ? this.toolTip高度 : 40
            }px;display:${params.data.toAddress ? "block" : "none"}'></div>
                      <span style="position:absolute;color:red;line-height:${this.toolTip高度 ? this.toolTip高度 : 40}px;font-size:${
              this.toolTip文字大小 ? this.toolTip文字大小 : 14
            }px;color:${this.toolTip文字颜色 ? this.toolTip文字颜色 : "#ffffff"}">${params.data.showValue ? params.data.showValue : params.data.fromName}${params.value}</span>
                      </div>`;
          }

          return tip;
        },
      },
      geo: [
        {
          silent: true,
          map: "chinaMapOutline",
          zoom: 1.2,
          top: "10%",
          label: {
            normal: {
              show: false,
              textStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                  show: false,
                },
              },
              label: {
                show: false, // 隐藏文字
              },
            },
          ],
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "rgba(0,255,255,.02)",
              borderColor: this.下层边界线条颜色 ? this.下层边界线条颜色 : "#027DE4",
              borderWidth: 3,
              shadowColor: this.下层边界线条颜色 ? this.下层边界线条颜色 : "#027DE4",
              shadowOffsetX: -2,
              shadowOffsetY: 7,
              shadowBlur: 0,
            },
            emphasis: {
              areaColor: "transparent", //悬浮背景
              textStyle: {
                color: "#fff",
              },
            },
          },
        },
        {
          silent: true,
          map: "china2",
          zoom: 1.2,
          top: "10%",
          label: {
            normal: {
              show: false,
              textStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                },
              },
              label: {
                show: false, // 隐藏文字
              },
            },
          ],
          roam: false,
          itemStyle: {
            normal: {
              areaColor: this.地图颜色 ? this.地图颜色 : "tranparent",
              borderColor: this.内层边界线条颜色 ? this.内层边界线条颜色 : "#5DBDF2",
              borderWidth: this.内层边界线条粗细 ? this.内层边界线条粗细 : "3",
              shadowColor: "#00ffff",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 0,
            },
            emphasis: {
              areaColor: "transparent", //悬浮背景
              textStyle: {
                color: "#fff",
              },
            },
          },
        },
        {
          silent: true,
          map: "chinaMapOutline",
          zoom: 1.2,
          top: "10%",
          label: {
            normal: {
              show: false,
              textStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                },
              },
              label: {
                show: false, // 隐藏文字
              },
            },
          ],
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "rgba(0,255,255,.02)",
              borderColor: this.外层边界线条颜色 ? this.外层边界线条颜色 : "#3AFFFF",
              borderWidth: this.外层边边界线条粗细 ? this.外层边边界线条粗细 : "3",
              shadowColor: "#00ffff",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 0,
            },
            emphasis: {
              areaColor: "transparent", //悬浮背景
              textStyle: {
                color: "#fff",
              },
            },
          },
        },
      ],
      series: [
        {
          type: "map",
          roam: false,
          data: echartsData,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: this.地图文字颜色 ? this.地图文字颜色 : "#FFFFFF",
              },
            },
            emphasis: {
              textStyle: {
                color: this.地图文字颜色 ? this.地图文字颜色 : "#FFFFFF",
                fontSize: "16",
              },
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248,0)",
              borderWidth: 1,
              areaColor: "transparent",
              borderWidth: 3,
            },
            emphasis: {
              areaColor: "transparent",
              borderWidth: 0.1,
            },
          },
          zoom: 1.2,
          //     roam: false,
          map: "china2", //使用
          // data: this.difficultData //热力图数据   不同区域 不同的底色
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          showEffectOn: "render",
          zlevel: 1,
          rippleEffect: {
            period: 15,
            scale: 4,
            brushType: "fill",
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              offset: [15, 0],
              color: "#1DE9B6",
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color: "#1DE9B6",
              shadowBlur: 10,
              shadowColor: "#333",
            },
          },
          symbolSize: 12,
          data: points,
        }, //地图线的动画效果
        {
          type: "lines",
          zlevel: 2,
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: "arrow", //箭头图标
            symbolSize: 2.5, //图标大小
          },
          lineStyle: {
            normal: {
              color: "#1DE9B6",
              width: 1, //线条宽度
              opacity: 0.1, //尾迹线条透明度
              curveness: 0.3, //尾迹线条曲直度
            },
          },
          data: echartsData,
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
  componentDidMount() {
    const { dataSource } = this.props;
    const data = JSON.parse(JSON.stringify(dataSource));
    this.refs["watchOD"].parentNode.style.width = "100%";
    this.refs["watchOD"].parentNode.style.height = "100%";
    this.refs["watchOD"].parentNode.parentNode.style.minHeight = 0;
    this.initEcharts(data);
  }

  render() {
    return <div ref="watchOD" style={{ width: "100%", height: "100%" }}></div>;
  }
}
