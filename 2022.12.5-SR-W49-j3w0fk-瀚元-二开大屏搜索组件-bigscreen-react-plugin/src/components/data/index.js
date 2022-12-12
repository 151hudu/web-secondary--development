import React, { useCallback, useState } from "react";
import { isEqual } from "lodash";
import { Checkbox, Input, Button, Select } from "antd";
import "./index.css";
function DataConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  console.log(configuration);
  const pluginOptions = JSON.parse(JSON.stringify(configuration ? configuration : {}));
  let [provinceShow, setProvinceShow] = useState(pluginOptions ? pluginOptions.provinceShow : false);
  let [cityShow, setCityShow] = useState(pluginOptions ? pluginOptions.cityShow : false);
  let [pointShow, setPointShow] = useState(pluginOptions ? pluginOptions.pointShow : false);
  let [provinceInput, setProvinceInput] = useState(pluginOptions ? pluginOptions.provinceInput : "");
  let [cityInput, setCityInput] = useState(pluginOptions ? pluginOptions.cityInput : "");
  let [pointInput, setPointInput] = useState(pluginOptions ? pluginOptions.pointInput : "");
  let [provinceInputSys, setProvinceInputSys] = useState(pluginOptions ? pluginOptions.provinceInputSys : "");
  let [cityInputSys, setCityInputSys] = useState(pluginOptions ? pluginOptions.cityInputSys : "");
  let [pointInputSys, setPointInputSys] = useState(pluginOptions ? pluginOptions.pointInputSys : "");
  let [detectionInputSys, setDetectionInputSys] = useState(pluginOptions ? pluginOptions.detectionInputSys : "");
  let [patrolInputSys, setPatrolInputSys] = useState(pluginOptions ? pluginOptions.patrolInputSys : "");
  const handleSubmit = useCallback(() => {
    console.log("配置页", props);
    const newOptions = {
      provinceShow: provinceShow,
      cityShow: cityShow,
      pointShow: pointShow,
      provinceInput: provinceInput,
      cityInput: cityInput,
      pointInput: pointInput,
      provinceInputSys: provinceInputSys,
      cityInputSys: cityInputSys,
      pointInputSys: pointInputSys,
      detectionInputSys: detectionInputSys,
      patrolInputSys: patrolInputSys,
    };
    console.log(newOptions);
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });
  let message = [];
  if (pluginOptions) {
    if (provinceShow) {
      message.push("所在省份");
    }
    if (cityShow) {
      message.push("所在市");
    }
    if (pointShow) {
      message.push("站点名称");
    }
  }
  let [showCheck, setShowCheck] = useState(message);
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    let provinceFlag = false;
    let cityFlag = false;
    let pointFlag = false;
    checkedValues.forEach((item, index) => {
      item === "所在市" ? (cityFlag = true) : (cityFlag = cityFlag);
      item === "站点名称" ? (pointFlag = true) : (pointFlag = pointFlag);
      item === "所在省份" ? (provinceFlag = true) : (provinceFlag = provinceFlag);
    });
    setProvinceShow(provinceFlag);
    setCityShow(cityFlag);
    setPointShow(pointFlag);
  };
  const inputSys = (type, e) => {
    switch (type) {
      case "所在省份sys":
        setProvinceInputSys(e.target.value);
        break;
      case "所在市sys":
        setCityInputSys(e.target.value);
        break;
      case "站点名称sys":
        setPointInputSys(e.target.value);
        break;
      case "侦测设备sys":
        setDetectionInputSys(e.target.value);
        break;
      case "巡检设备sys":
        setPatrolInputSys(e.target.value);
        break;
      case "所在省份":
        setProvinceInput(e.target.value);
        break;
      case "所在市":
        setCityInput(e.target.value);
        break;
      case "站点名称":
        setPointInput(e.target.value);
        break;
      default:
    }
  };
  const plainOptions = ["所在省份", "所在市", "站点名称"];
  return (
    <div>
      <span>筛选项</span>
      <br />
      <Checkbox.Group className="CheckboxGroup" options={plainOptions} defaultValue={showCheck} onChange={onChange} />
      <br />
      <br />
      <span>变量绑定</span>
      <br />
      <span>所在省份</span>
      <Input
        onChange={inputSys.bind(this, "所在省份sys")}
        value={provinceInputSys}
        placeholder="输入省份变量名称"
        style={{ display: provinceShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>所在市</span>
      <Input
        onChange={inputSys.bind(this, "所在市sys")}
        value={cityInputSys}
        placeholder="输入市变量名称"
        style={{ display: cityShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>站点名称</span>
      <Input
        onChange={inputSys.bind(this, "站点名称sys")}
        value={pointInputSys}
        placeholder="输入站点变量名称"
        style={{ display: pointShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>侦测设备</span>
      <Input onChange={inputSys.bind(this, "侦测设备sys")} value={detectionInputSys} placeholder="输入侦测设备变量名称" className="selectInput" />
      <span>巡检设备</span>
      <Input onChange={inputSys.bind(this, "巡检设备sys")} value={patrolInputSys} placeholder="输入巡检设备变量名称" className="selectInput" />
      <br />
      <span>数据绑定</span>
      <br />
      <span>所在省份</span>
      <Input
        onChange={inputSys.bind(this, "所在省份")}
        value={provinceInput}
        placeholder="所在省份资产"
        style={{ display: provinceShow ? "block" : "none" }}
        className="selectInput"
      />
      <span>所在市</span>
      <Input onChange={inputSys.bind(this, "所在市")} value={cityInput} placeholder="所在市资产" style={{ display: cityShow ? "block" : "none" }} className="selectInput" />
      <span>站点名称</span>
      <Input onChange={inputSys.bind(this, "站点名称")} value={pointInput} placeholder="站点名称资产" style={{ display: pointShow ? "block" : "none" }} className="selectInput" />
      <Button type="primary" onClick={handleSubmit}>
        执行
      </Button>
    </div>
  );
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
