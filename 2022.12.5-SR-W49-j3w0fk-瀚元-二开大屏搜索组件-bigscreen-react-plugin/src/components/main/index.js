import React, { Component } from "react";
import msgCompConfig from "./msgCompConfig";
import Utils from "../../utils";
import "./index.less";
import { getAssets } from "../../api/asset";
import { Select, Button, Checkbox } from "antd";
const { Option } = Select;
export default class Main extends Component {
  state = {
    nameColor: "black",
    id: "",
    disabledProv: false,
    disabledCity: false,
    disabledPoint: false,
    provinceAsset: [],
    cityAsset: [],
    pointAsset: [],
    provinceOption: [],
    cityOption: [],
    pointOption: [],
    provinceInSelect: {
      value: "",
      label: "",
    },
    cityInSelect: { value: "", label: "" },
    alertInSelect: { value: "", label: "" },
    pointInSelect: { value: "", label: "" },
    pluginOptions: {},
    checkoOptions: [
      {
        label: "侦测设备",
        value: "侦测设备",
      },
      {
        label: "巡检设备",
        value: "巡检设备",
      },
    ],
    checkoOptionsed: ["侦测设备", "巡检设备"],
    handleClickBigscreenData: "",
  };

  componentDidMount() {
    this.initComData();
    window.componentCenter?.register && window.componentCenter.register(this.props?.componentId, "searchSelect", this, msgCompConfig);
    this.props?.updateProcess && this.props.updateProcess();
  }
  //获取当前日期
  getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    return targetday_milliseconds;
  }
  //获取当前月份
  doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }
  changeProvince = (value) => {
    this.setState({
      provinceInSelect: value,
      cityInSelect: {
        value: "",
        label: "",
      },
      pointInSelect: {
        value: "",
        label: "",
      },
    });
    let message = [];
    let message2 = [];
    if (this.state.pluginOptions.cityShow) {
      this.state.cityAsset.forEach((item, index) => {
        if (item.parentOne == value.value) {
          message.push(item);
        }
      });
      this.setState({
        cityOption: message,
      });
      this.state.pointAsset.forEach((item, index) => {
        if (item.parentTwo == value.value) {
          message2.push(item);
        }
      });
      this.setState({
        pointOption: message2,
      });
    } else {
      this.state.pointAsset.forEach((item, index) => {
        if (item.parentTwo == value.value) {
          message.push(item);
        }
      });
      this.setState({
        pointOption: message,
      });
    }
    // if (this.state.pluginOptions.pointShow) {

    // }
  };
  changeCity = (value) => {
    this.setState({
      cityInSelect: value,
      pointInSelect: {
        value: "",
        label: "",
      },
    });
    let message = [];
    if (this.state.pluginOptions.pointShow) {
      this.state.pointAsset.forEach((item, index) => {
        if (item.parentOne == value.value) {
          message.push(item);
        }
      });
    }
    this.setState({
      pointOption: message,
    });
  };
  changePoint = (value) => {
    this.setState({
      pointInSelect: value,
    });
  };
  search = () => {
    let data = {};
    if (this.state.pluginOptions.provinceInputSys) {
      data[this.state.pluginOptions.provinceInputSys] = this.state.provinceInSelect.value;
    }
    if (this.state.pluginOptions.cityInputSys) {
      data[this.state.pluginOptions.cityInputSys] = this.state.cityInSelect.value;
    }
    if (this.state.pluginOptions.pointInputSys) {
      data[this.state.pluginOptions.pointInputSys] = this.state.pointInSelect.value;
    }
    if (this.state.checkoOptionsed.indexOf("侦测设备") !== -1) {
      data[this.state.pluginOptions.detectionInputSys] = "1";
    } else {
      data[this.state.pluginOptions.detectionInputSys] = "0";
    }
    if (this.state.checkoOptionsed.indexOf("巡检设备") !== -1) {
      data[this.state.pluginOptions.patrolInputSys] = "1";
    } else {
      data[this.state.pluginOptions.patrolInputSys] = "0";
    }
    this.triggerEvent(data);
    this.handleClickBigscreen(data);
  };
  Event_Center_getName() {
    return this.state.id;
  }
  onChange = (checkedValues) => {
    this.setState({
      checkoOptionsed: checkedValues,
    });
    console.log("checked = ", checkedValues);
  };
  reSelect = () => {
    this.setState({
      cityInSelect: this.state.disabledCity ? this.state.cityInSelect : { value: "", label: "" },
      // cityOption: this.state.cityAsset,
      provinceInSelect: this.state.disabledProv ? this.state.provinceInSelect : { value: "", label: "" },
      // provinceOption: this.state.provinceAsset,
      pointInSelect: this.state.disabledPoint ? this.state.pointInSelect : { value: "", label: "" },
      // pointOption: this.state.pointAsset,
      checkoOptionsed: ["侦测设备", "巡检设备"],
    });
    if (!this.state.disabledProv) {
      this.setState({
        cityOption: this.state.cityAsset,
        provinceOption: this.state.provinceAsset,
        pointOption: this.state.pointAsset,
      });
    }
  };
  handleClickBigscreen = (data) => {
    console.log(JSON.stringify(data) == this.state.handleClickBigscreenData, 184);
    console.log(JSON.stringify(data), this.state.handleClickBigscreenData, 185185185);
    if (JSON.stringify(data) == this.state.handleClickBigscreenData) {
      return;
    }
    let bigscreenData = [];
    for (let k in data) {
      bigscreenData.push({
        id: k,
        value: data[k],
      });
    }
    console.log(bigscreenData, "bigscreenData");
    const { bigscreen = {}, notifyVariable } = this.props;
    // 获取大屏变量数组
    const { variableList = [] } = bigscreen;
    // // 假设我们要修改名为 variableA 的变量
    // const targetVariableName = "variableA";

    const params = [];
    // 在此处找到第一个符合name是variableA的变量
    //也可以根据业务情况查找多个修改多个，
    bigscreenData.forEach((Info, index) => {
      let targetVariableIndex = variableList.findIndex((item) => {
        return item.name === Info.id;
      });
      // 如果找到，构造params参数
      if (targetVariableIndex > -1) {
        params.push({
          id: variableList[targetVariableIndex].id,
          value: Info.value, // 目标值
        });
      }
    });
    this.setState({
      handleClickBigscreenData: JSON.stringify(data),
    });
    // 触发变量改变
    notifyVariable && notifyVariable(params);
  };
  setDefault = () => {
    this.props.pubSub &&
      this.props.pubSub.subscribe("updateChart" + this.props?.componentId, (val) => {
        console.log(val);
        this.setState({
          cityInSelect: { value: "", label: "" },
          cityOption: this.state.cityAsset,
          provinceInSelect: { value: "", label: "" },
          provinceOption: this.state.provinceAsset,
          pointInSelect: { value: "", label: "" },
          pointOption: this.state.pointAsset,
          checkoOptionsed: ["侦测设备", "巡检设备"],
          disabledCity: false,
          disabledPoint: false,
          disabledProv: false,
        });
        let provice =
          (val?.variable?.current_value && JSON.parse(val?.variable?.current_value).province_id) ||
          (val?.variable?.default_value && JSON.parse(val?.variable?.default_value).province_id) ||
          "";
        let city =
          (val?.variable?.current_value && JSON.parse(val?.variable?.current_value).city_id) ||
          (val?.variable?.default_value && JSON.parse(val?.variable?.default_value).city_id) ||
          "";
        let station =
          (val?.variable?.current_value && JSON.parse(val?.variable?.current_value).substation_no) ||
          (val?.variable?.default_value && JSON.parse(val?.variable?.default_value).substation_no) ||
          "";
        if (!provice) {
          this.setState({
            provinceInSelect: {
              label: this.state.provinceAsset[0].name,
              value: this.state.provinceAsset[0].id,
            },
          });
          let message = [];
          this.state.cityAsset.forEach((item) => {
            if (item.parentOne == this.state.provinceAsset[0].id) {
              message.push(item);
            }
          });
          this.setState({
            cityOption: message,
            cityInSelect: {
              label: message[0]?.name,
              value: message[0]?.id,
            },
          });
          let message2 = [];
          this.state.pointAsset.forEach((item) => {
            if (item.parentTwo == this.state.provinceAsset[0].id) {
              message2.push(item);
            }
          });
          this.setState({
            pointOption: message2,
            pointInSelect: {
              label: message2[0].name,
              value: message2[0].id,
            },
          });
        }
        if (provice && !city && !station) {
          this.setState({
            disabledProv: true,
          });
          this.state.provinceAsset.forEach((item) => {
            if (item.id == provice) {
              this.setState({
                provinceInSelect: { label: item.name, value: item.id },
              });
              let message = [];
              this.state.cityAsset.forEach((itemOne) => {
                if (itemOne.parentOne == provice) {
                  message.push(itemOne);
                }
              });
              this.setState({
                cityOption: message,
                cityInSelect: {
                  label: message[0]?.name,
                  value: message[0]?.id,
                },
              });
              let message2 = [];
              this.state.pointAsset.forEach((itemTwo) => {
                if (itemTwo.parentOne == message[0].id) {
                  message2.push(itemTwo);
                }
              });
              this.setState({
                pointOption: message2,
                pointInSelect: {
                  label: message2[0]?.name,
                  value: message2[0]?.id,
                },
              });
            }
          });
        }
        if (provice && city && !station) {
          this.setState({
            disabledProv: true,
            disabledCity: true,
          });
          this.state.provinceAsset.forEach((item) => {
            if (item.id == provice) {
              this.setState({
                provinceInSelect: { label: item.name, value: item.id },
              });
            }
          });
          this.state.cityAsset.forEach((item) => {
            if (item.id == city) {
              this.setState({
                cityInSelect: { label: item.name, value: item.id },
              });
              let message = [];
              this.state.pointAsset.forEach((itemOne) => {
                if (itemOne.parentOne == city) {
                  message.push(itemOne);
                }
              });
              this.setState({
                pointOption: message,
                pointInSelect: {
                  label: message[0]?.name,
                  value: message[0]?.id,
                },
              });
            }
          });
        }
        if (provice && city && station) {
          this.setState({
            disabledProv: true,
            disabledCity: true,
            disabledPoint: true,
          });
          this.state.provinceAsset.forEach((item) => {
            if (item.id == provice) {
              this.setState({
                provinceInSelect: { label: item.name, value: item.id },
              });
            }
          });
          this.state.cityAsset.forEach((item) => {
            if (item.id == city) {
              this.setState({
                cityInSelect: { label: item.name, value: item.id },
              });
            }
          });
          this.state.pointAsset.forEach((item) => {
            if (item.id == station) {
              this.setState({
                pointInSelect: { label: item.name, value: item.id },
              });
            }
          });
        }
        this.search();
      });
  };
  triggerEvent = (data) => {
    window.eventCenter?.triggerEvent &&
      window.eventCenter.triggerEvent(this.props.componentId, "searchSelect", {
        value: data,
      });
  };
  initComData = () => {
    //pluginOptions为组件式配置项数据
    const pluginOptions = JSON.parse(JSON.stringify(this.props?.block?.dataConfig?.pluginOptions));
    this.setState({
      pluginOptions: pluginOptions,
    });
    //options为传统的输入框形式的配置项
    const options = this.props.options?.externalVariables;
    const id = options?.id ? `secondary_bigscreen_${options.id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.setState({ id });
    console.log(this.props, options, "main");
    if (pluginOptions.provinceInput && pluginOptions.provinceShow) {
      getAssets({ id: pluginOptions.provinceInput }).then((res) => {
        this.setState({
          provinceAsset: Utils.translatePlatformDataToJsonArray(res),
          provinceOption: Utils.translatePlatformDataToJsonArray(res),
        });
        if (pluginOptions.cityInput && pluginOptions.cityShow) {
          getAssets({ id: pluginOptions.cityInput }).then((res2) => {
            this.setState({
              cityAsset: Utils.translatePlatformDataToJsonArray(res2),
              cityOption: Utils.translatePlatformDataToJsonArray(res2),
            });
            if (pluginOptions.pointInput && pluginOptions.pointShow) {
              getAssets({ id: pluginOptions.pointInput }).then((res3) => {
                this.setState({
                  pointAsset: Utils.translatePlatformDataToJsonArray(res3),
                  pointOption: Utils.translatePlatformDataToJsonArray(res3),
                });
                this.setDefault();
                this.setState({
                  provinceInSelect: {
                    label: Utils.translatePlatformDataToJsonArray(res)[0].name,
                    value: Utils.translatePlatformDataToJsonArray(res)[0].id,
                  },
                });
                let message = [];
                Utils.translatePlatformDataToJsonArray(res2).forEach((item) => {
                  if (item.parentOne == Utils.translatePlatformDataToJsonArray(res)[0].id) {
                    message.push(item);
                  }
                });
                this.setState({
                  cityOption: message,
                  cityInSelect: {
                    label: message[0]?.name,
                    value: message[0]?.id,
                  },
                });
                let message2 = [];
                Utils.translatePlatformDataToJsonArray(res3).forEach((item) => {
                  if (item.parentTwo == Utils.translatePlatformDataToJsonArray(res3)[0].id && message2.length == 0) {
                    message2.push(item);
                  }
                });
                this.setState({
                  pointOption: message2,
                  pointInSelect: {
                    label: message2[0].name,
                    value: message2[0].id,
                  },
                });
                this.search();
              });
            }
          });
        }
      });
    }
  };

  render() {
    const pluginOptions = JSON.parse(JSON.stringify(this.props?.block?.dataConfig?.pluginOptions));
    const { id } = this.state;
    return (
      <>
        {/*大屏定义外层容器百分百，不可删除*/}
        <div id={id} style={{ width: "100%", height: "100%" }}>
          <div className="HYtop2">
            <div className="selectBox" style={{ display: pluginOptions.provinceShow ? "block" : "none" }}>
              <span>所在省份：</span>
              <Select
                labelInValue
                value={this.state.provinceInSelect}
                placeholder={"请选择"}
                size="large"
                onChange={this.changeProvince}
                style={{ width: 120 }}
                disabled={this.state.disabledProv}
                options={this.state.provinceOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.cityShow ? "block" : "none" }}>
              <span>所在市：</span>
              <Select
                labelInValue
                value={this.state.cityInSelect}
                placeholder={"请选择"}
                onChange={this.changeCity}
                size="large"
                disabled={this.state.disabledCity}
                style={{ width: 120 }}
                options={this.state.cityOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <div className="selectBox" style={{ display: pluginOptions.pointShow ? "block" : "none" }}>
              <span>站点名称：</span>
              <Select
                labelInValue
                value={this.state.pointInSelect}
                placeholder={"请选择"}
                onChange={this.changePoint}
                size="large"
                disabled={this.state.disabledPoint}
                style={{ width: 120 }}
                options={this.state.pointOption.map((item) => ({ label: item.name, value: item.id }))}
              ></Select>
            </div>
            <Checkbox.Group options={this.state.checkoOptions} value={this.state.checkoOptionsed} className="CheckboxGroupTop" onChange={this.onChange} />
            <div className="bottomBox">
              <Button type="primary" onClick={this.search}>
                查询
              </Button>
              <Button type="primary" onClick={this.reSelect}>
                重置
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
