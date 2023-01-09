import React, { Component } from "react";
import Setting from "./setting";
import { user } from "./api/asset";
import "./app.less";
import banner from "./assets/banner.png";
import socialSrc from "./assets/snipaste.png";

export default class App extends Component {
  async componentDidMount() {
    user().then((res) => {
      if (res.status == 200) {
        this.setState({
          uesrName: res.data.name,
        });
      }
    });

    this.refs["qingtianDingLan"].parentNode.parentNode.parentNode.style.height = "unset";
    const { customConfig } = this.props;
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

  state = {
    uesrName: "",
  };

  goIn = () => {
    const { customConfig } = this.props;
    const { socialSrc } = customConfig || {};
    window.location.href = socialSrc;
  }
  goHome = () => {
    const { customConfig } = this.props;
    const { homeSrc } = customConfig || {};
    window.location.href = homeSrc;
  }
  render() {
    const { customConfig } = this.props;
    const { bannerSrc } = customConfig || "";
    const { uesrName } = this.state;

    if (this.props.isConfig) {
      return <Setting {...this.props} />;
    }
    return (
      <div id="qingtianDingLan" ref="qingtianDingLan" style={{width: '100%', height: '100%'}}>
        <div className="topOperation">
          <span>{ uesrName }，欢迎您！</span>
        </div>
        <img className="banner" src={bannerSrc !== "" ? bannerSrc : banner} alt="" />
        <div className="mianView">
          <span onClick={() => { this.goHome() }}>首页</span>
          <div>
            <img onClick={() => { this.goIn() }} src={socialSrc} alt="" />
          </div>
        </div>
      </div >
    );
  }
}
