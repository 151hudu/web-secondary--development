import React from "react";

function DesignConfiguration(props) {
  //此处的customConfig已经封装完毕，可以直接使用
  const customConfig = props.customConfig;
  const changeCustomConfig = props.changeCustomConfig;
  //此处也需要判断第一次进去是否有值
  // !customConfig.number && (customConfig.number = 1);


  return (
    <div className="configuration">
      designConfiguration
    </div>
  );
}

export default DesignConfiguration;
