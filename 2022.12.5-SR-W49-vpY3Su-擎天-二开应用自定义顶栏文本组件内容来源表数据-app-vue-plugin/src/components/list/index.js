import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { queryAssetById } from "../../api/asset";
import { Modal } from "antd";
import "./index.less";
import moment from "moment";

import { BellOutlined } from "@ant-design/icons";

const List = ({ configuration }) => {
  let [showInfo, setShowInfo] = useState("");
  let [fontColor, setFontColor] = useState("");
  let [fontSize, setFontSize] = useState("");
  let [textAlign, setTextAlign] = useState("");
  let [verticalAlign, setVerticalAlign] = useState("");
  console.log(configuration);
  useEffect(() => {
    try {
      let conf = JSON.parse(configuration || "{}");
      setShowInfo(conf.showInfo);
      setFontColor(conf.fontColor);
      setFontSize(conf.fontSize);
      setTextAlign(conf.textAlign);
      setVerticalAlign(conf.verticalAlign);
      console.log(conf, 18181818);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, [configuration]);
  useEffect(() => {}, []);
  return (
    <div className="topCustom" style={{ textAlign: textAlign, verticalAlign: verticalAlign, color: fontColor, fontSize: fontSize }}>
      {showInfo}
    </div>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
