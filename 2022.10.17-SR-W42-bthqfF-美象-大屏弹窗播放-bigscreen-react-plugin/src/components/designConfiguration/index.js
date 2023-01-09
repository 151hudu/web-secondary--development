import React, { useState, useCallback } from "react";
import { Input, Row, Col, Switch } from "antd";
import { isEqual } from "lodash";

const DesignConfiguration = (props) => {
  const { changeConfiguration, configuration } = props;

  const [liveUrl, setLiveUrl] = useState(configuration?.liveUrl || "");
  const [buttonIsShow, setButtonIsShow] = useState(configuration?.buttonIsShow);
  const [modalSize, setModalSize] = useState(configuration?.modalSize || "");

  const handleSubmit = useCallback(() => {
    const newOptions = {
      liveUrl,
      buttonIsShow,
      modalSize,
    };
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });

  // 视频播放地址
  const handleLiveUrl = (e) => {
    setLiveUrl(e.target.value);
  };

  // 按钮是否显示
  const handleButtonIsShow = (checked) => {
    setButtonIsShow(checked);
  };

  // 弹窗大小
  const handleModalSize = (e) => {
    setModalSize(e.target.value);
  };

  return (
    <div>
      <Row>
        <Col span={24}>视频播放地址</Col>
        <Input value={liveUrl} onChange={handleLiveUrl} />
      </Row>

      <Row>
        <Col span={24}>弹窗大小</Col>
        <Input value={modalSize} onChange={handleModalSize}></Input>
      </Row>

      <Row>
        <Col span={24}>按钮是否显示</Col>
        <Switch checked={buttonIsShow} onChange={handleButtonIsShow}></Switch>
      </Row>

      <Row>
        <div className="detail-btn" onClick={handleSubmit}>
          执行
        </div>
      </Row>
    </div>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
