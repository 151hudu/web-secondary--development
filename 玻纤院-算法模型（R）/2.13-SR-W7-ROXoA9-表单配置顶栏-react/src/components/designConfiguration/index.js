import React from "react";

function DesignConfiguration(props) {
  //此处的customConfig已经封装完毕，可以直接使用
  const { changeCustomConfig, customConfig } = props;
  //此处为最简单的样例
  !customConfig.number && (customConfig.number = 1);
  const handleClick = () => {
    customConfig.number++;
    changeCustomConfig(customConfig);
  };
  return (
    <div>
      <button onClick={handleClick}>配置项与主视图交互样例</button>
    </div>);
}

export default DesignConfiguration;
