import React, {
  useEffect,
  useState
} from "react";

const Main = (props) => {
  const [id, setId] = useState("");
  const [width, setWdith] = useState("100%");
  const [height, setHeight] = useState("100%");

  const [number, setNumber] = useState(1);
  const initComData = () => {
    const customConfig = props?.customConfig;
    //customOptions为传统的输入框形式的配置项
    const customOptions = props.options?.externalVariables || {};
    customOptions?.width && setWdith(customOptions.width)
    customOptions?.height && setHeight(customOptions.height)


    customConfig.number && setNumber(customConfig.number)
  };
  const actionDefinitions = {
    // do_EventCenter_
  };
  const triggerEvent = (eventName, payload) => {
    props.componentId && window.eventCenter?.triggerEvent(
      props.componentId,
      eventName,
      //payload需为一个object
      payload
    );
  };
  const handleClick = () => {
    triggerEvent("click", { value: "123" });
  };
  useEffect(() => {
    props.mainInit && props.mainInit(props, setId , { ...actionDefinitions });
    initComData();
  }, []);

  return (
    <>
      {/*大屏定义外层容器百分百，不可删除*/}
      <div id={id} style={{ width, height }} className="bigscreen-secondary">
        {/*以下为测试，正式开发请去除相关代码*/}
        {number}
        <button onClick={handleClick}>测试逻辑控制</button>
      </div>
    </>
  );
};

export default Main;
