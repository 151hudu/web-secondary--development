import React, { Component } from "react";
import {
  DataConfiguration,
  StyleConfiguration,
  OtherConfiguration,
  DefaultRender,
} from "./components";
import "./app.less";
const componentMap = {
  default: DefaultRender,
  dataConfiguration: DataConfiguration,
  styleConfiguration: StyleConfiguration,
  otherConfiguration: OtherConfiguration,
};
export default class App extends Component {
  divRef = null;

  constructor(props) {
    super(props);
    const { type } = props;
    console.log("type: ", type);
    const Render = componentMap[type || "default"];
    this.state = {
      id: "",
      currentRender: <Render {...props}></Render>,
    };
  }
  fnref = (el) => {
    this.divRef = el;
  };

  componentDidMount() {
    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "选中值",
            dataType: "object",
            key: "selectedValue",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];

    window.componentCenter?.register &&
      window.componentCenter.register(this.props.componentId, "comp", this, {
        events,
        actions,
      });
    this.props?.updateProcess && this.props.updateProcess();

    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }
  componentDidUpdate(prevProps) {
    console.log(
      "May 🏃‍♂️🦸‍♂️🚀🌈🌈🌈 ~ file: AppNew.js ~ line 74 ~ App ~ componentDidUpdate ~ prevProps",
      prevProps
    );
  }
  do_EventCenter_messageSuccess(param) {
    console.log(param);
    alert(`接受的数据为：${JSON.stringify(param)}`);
  }

  render() {
    return (
      <div className="bigscreen_search_component_wrapper">
        {this.state.currentRender}
      </div>
    );
  }
}
