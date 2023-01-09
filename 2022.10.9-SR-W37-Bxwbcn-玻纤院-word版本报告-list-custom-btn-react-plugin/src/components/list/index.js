import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { exportListTmplDetailData } from "./../../api/asset";

import "./index.less";

const List = (props) => {
  const { selectedRows = [], customParams, allParams: { propsParams: { id: modelId } = {} } = {}, customParams: { fileTemplate = [] } = {} } = props || {};
  const dataIds = selectedRows.map(({ dataId } = {}) => dataId);
  const { response: { result = [] } = {} } = fileTemplate[0] || {};
  const templetePath = result[0] || "";
  const defaultParam = { ...customParams };
  delete defaultParam.fileTemplate;

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    let error = false;
    if (!templetePath) {
      error = "请配置模板文件";
    } else if (!defaultParam.componentId) {
      error = "请配置文件名";
    } else if (!dataIds.length) {
      error = "请选择要导出的数据";
    } else if (!defaultParam.subTableEquipment) {
      error = "请配置仪器设备资产Id";
    }
    if (!error && !defaultParam["secondevTableId"]) {
      error = "请配置子表资产Id";
    }
    if (error) {
      message.error(error);
      return;
    }
    try {
      const params = {
        ...defaultParam,
        dataIds,
        modelId,
        templetePath,
      };

      const { data } = await exportListTmplDetailData(params);

      const nameArr = data.split("/") || [];
      const nameStr = nameArr[nameArr.length - 1] || "";
      const ext = nameStr.substring(nameStr.lastIndexOf(".") + 1) || "";
      const fileName = ext === "zip" ? "不确定度评定报告.zip" : nameStr;
      downloadEvt(fileName, data);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadEvt = (fileName, url) => {
    const Link = document.createElement("a");
    Link.download = fileName;
    Link.style.display = "none";
    // 字符内容转变成blob地址
    // const blob = new Blob([JsonContent]);
    // Link.href = URL.createObjectURL(blob);
    Link.href = url;
    // 触发点击
    document.body.appendChild(Link);
    Link.click();
    // 然后移除
    document.body.removeChild(Link);
  };

  return <></>;
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
