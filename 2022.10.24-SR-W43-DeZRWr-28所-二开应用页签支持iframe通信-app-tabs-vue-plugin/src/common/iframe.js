import React from "react";
import { Button } from "antd";

const Iframejs = (props) => {
  const addTbas = (id, key, value) => {
    console.log("iframe传递消息");
    window.parent.postMessage(
      {
        id: id,
        key: key,
        value: value,
      },
      "*"
    );
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          addTbas("60f301bd-fb16-c0d0-7865-5b82b285727d#3", "页面二参数", "222");
        }}
      >
        新增二页签
      </Button>
      <Button
        type="primary"
        onClick={() => {
          addTbas("b1e0b04f-c85a-869e-f57b-b852643d3d5d#3", "页面三参数", "333");
        }}
      >
        新增三页签
      </Button>
      <Button
        type="primary"
        onClick={() => {
          addTbas("60f301bd-fb16-c0d0-7865-5b82b285727d#3", "页面四参数", "444");
        }}
      >
        改变二页签参数
      </Button>
      ;
    </>
  );
};

export default Iframejs;
