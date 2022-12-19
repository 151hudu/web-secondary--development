import React, { Component } from "react";
import msgCompConfig from "./msgCompConfig";
import Utils from "../../utils";
import jsonp from 'jsonp';
import { Dropdown } from "antd";
import { CheckCircleFilled } from '@ant-design/icons';
import { queryUserByAccount, loginByUserAndCreateCookie } from "../../api/asset";
import "./index.less";

const syncToken = token => {
  const baseUrl = `/sdata/rest`;
  jsonp(
    `${window.location.origin}${baseUrl}/system/authority/setCookie?token=${token}`
  );
};
const cachePrefix = 'Smartdata::Request::'
function clearCache() {
  for (const key in sessionStorage) {
    if (key.startsWith(cachePrefix)) {
      sessionStorage.removeItem(key);
    }
  }
}

export default class Main extends Component {
  state = {
    id: "",
    adminInfo: {},
    items: [],
    dataList: []
  };

  componentDidMount() {
    this.initComData();
    window.componentCenter?.register &&
    window.componentCenter.register(this.props?.componentId, "comp", this, msgCompConfig);
    this.props?.updateProcess && this.props.updateProcess();
  }

  initComData = () => {
    //configuration为组件式配置项数据
    const configuration = this.props?.configuration;
    //options为传统的输入框形式的配置项
    const options = this.props.options?.externalVariables;
    const id = options?.id ? `secondary_bigscreen_${options.id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.setState({ id });
    let adminInfo = window?.currentUser;
    this.setState({ adminInfo });
    // console.log(configuration, options);
    this.getUserRole(adminInfo?.account_code || "1234567890")
  };

  Event_Center_getName() {
    return this.state.id;
  }

  getUserRole = async (account_code) => {
    let { data } = await queryUserByAccount(account_code);
    this.setState({dataList: data})
    let adminId = window?.currentUser?.id;
    // console.log('adminId', adminId);
    let group = {
      key: '1',
      type: 'group',
      label: '身份切换',
      children: [],
    }
    data.forEach(x=>{
      let obj = {
        key: x.id,
        label: x.userName,
        icon: x.id == adminId ? <CheckCircleFilled style={{ size: '14px', color: '#b6dee6' }} /> : <>&nbsp;&nbsp;&nbsp;&nbsp;</>,
      }
      group.children.push(obj)
    })
    this.setState({ items: [group] })
  }

  onClick = ({ key }) => {
    console.log(key);
    let {dataList} = this.state
    let item = {}
    dataList.forEach(x=>{
      if (x.id == key) {
        item = x
      }
    })
    // console.log(item);
    this.selectIdentity(item)
  };

  selectIdentity = async (item) => {
    let adminId = window?.currentUser?.id;
    if (item.id !== adminId) {
      clearCache();
      const { data } = await loginByUserAndCreateCookie({
        id: item.id,
        account_code: item.account_code,
      });
      syncToken(data);
      window.location.reload();
    }
  };

  render() {
    const { id, adminInfo, items } = this.state;
    const onClick = this.onClick;
    // let img = 'data:image/png;base64,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'
    return (
      <>
        {/*大屏定义外层容器百分百，不可删除*/}
        <div id={id} style={{ width: "100%", height: "100%" }} ref="bigscreen">
          <Dropdown menu={{ items, onClick }} overlayClassName="dropdownBox">
            <div className="adminRole">
              <img className="adminImg" src={adminInfo?.photo}></img>
              <div className="user_name">
                <div className="name-text">{adminInfo?.name}</div>
                <div className="identity-text">{adminInfo?.userName}</div>
              </div>
            </div>
          </Dropdown>
        </div>
      </>
    );
  }
}
