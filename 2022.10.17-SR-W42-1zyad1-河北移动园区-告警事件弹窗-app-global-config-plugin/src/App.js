import React, { Component } from "react";
import { notification } from "antd";
// import appService from "@njsdata/app-sdk";
import { getWarning } from "./api/asset";
import "./app.less";

export default class App extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
  }
  componentDidMount() {
    notification.config({
      placement: 'bottomRight',
      maxCount: 5,
    });
    this.intervalId = null;
    let intervalTime = this.props.customConfig.intervalTime ? parseInt(this.props.customConfig.intervalTime) * 1000 : 8000;
    this.myFunction();
    this.intervalId = setInterval(() => {
      this.myFunction();
    }, intervalTime);
    const events = [];
    const actions = [];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }
  myStopFunction = () => {
    console.log('this.intervalId', this.intervalId);
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  myFunction = async () => {

    let intervalTime = this.props.customConfig.intervalTime ? parseInt(this.props.customConfig.intervalTime) * 1000 : 8000;
    let list = await getWarning();
    if (list.status === 200) {
      if (list.data.length > 0) {
        this.openNotification(list.data)
      }
    } else {
      this.myStopFunction()
      this.intervalId = setInterval(() => {
        this.myFunction();
      }, intervalTime);
    }
  }

  openNotification = (list) => {
    let duration = parseInt(this.props.customConfig.duration) || 3;
    for (let index = 0; index < list.length; index++) {
      // notification.info({
      //   message: list[index].alarmTypeName,
      //   duration: duration,
      //   placement: "bottomRight",
      //   description: <p>状态：{list[index].alarmStat == "1" ? "报警产生" : "报警消失"}<br />
      //     时间：{list[index].alarmDate}<br />
      //     地点：{list[index].alarmPosition}<br />
      //     编号：{list[index].alarmCode}</p>
      // });

      let jsCode = () => {
        notification.info({
          message: list[index].alarmTypeName,
          duration: duration,
          description: <p>状态：{list[index].alarmStat == "1" ? "报警产生" : "报警消失"}<br />
            时间：{list[index].alarmDate}<br />
            地点：{list[index].alarmPosition}<br />
            编号：{list[index].alarmCode}</p>
        });
      }

      setTimeout(jsCode, (index * 500))
    }
  };

  componentWillUnmount() {
    console.log('8-组件销毁')
    this.myStopFunction()
  }

  do_EventCenter_messageSuccess() {
    window.location.reload();
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "";
  }

  render() {
    return (
      <div></div>
    )
  }
}
