import React, { Component } from "react";
import { Button, Input, Menu, message, Dropdown, Empty } from "antd";
import Setting from "./setting";
import qs from "querystringify";
import { css } from 'emotion';
import { stringify } from "./qs";
import ApplicationNotice from "./notice";
import history from "./history";
import {
  // PoweroffOutlined,
  BellOutlined,
  SettingOutlined,
  // LaptopOutlined,

  DownOutlined,
} from "@ant-design/icons";
import { logout, getMenuData, userQuery, getCode } from "./api/asset";
// import appService from "@njsdata/app-sdk";


import "./app.less";
const { Search } = Input;
// const { SubMenu } = Menu;
// const { Link } = Anchor;
const appid = qs.parse(window.location.search).appid;

const logoutSystem = () => {
  logout()
    .then((res) => {
      console.log("res", res);
      if (res.status === 200) {
        if (res.data) {
          console.log("res.data", res.data);
          let href = `/application/login/${appid}`;
          window.location.href = href;
        } else {
          console.log("Nores.data");
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: "默认主题",
      },
      {
        key: "2",
        label: "蓝绿主题",
      },
      {
        key: "3",
        label: "蓝灰主题",
      },
      {
        key: "4",
        label: "香槟金主题",
      },
    ]}
  />
);
const emptyDiv = (
  <div className='empty_two'>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>

)
const menu2 = (
  <Menu
    items={[
      {
        key: '1',
        label: <span>个人工作台</span>
      },
      {
        key: "2",
        label: <span onClick={logoutSystem}>退出登录</span>,
      },
    ]}
  />
);
// const menu3 = <ApplicationNotice styleStore={{}} />;
/*!TODO:1.菜单接口；2.站内信接口；3.主题改变方法 ；4.用户信息；*/
const prefix =
  process.env.NODE_ENV === "development"
    ? "../pluginTemp/public"
    : `/storage_area/devops/dataflow/secondary_dev/123456789/2e914b98-bfb2-4ef3-a51b-2500aae4c279/public`;
export default class App extends Component {
  async componentDidMount() {
    const { customConfig } = this.props;
    const {
      // appId = "72136134-f4a1-47b6-8f9c-e3871a092456",
      // menuId = "ce5261f2-fdea-4a1b-b805-26ba686ab467",
      buttons = [],
    } = customConfig || {};
    const themeInfo = this.props?.themeInfo || this.props?.customConfig.themeInfo
    let menuTheme = []
    themeInfo?.themeLists.forEach(x => {
      menuTheme.push({ key: x.value, label: x.name })
    })
    this.setState({ themeList: menuTheme })
    // const { data } = await getMenuData(appId, menuId);
    // let buttons = data?.menuAndButton?.datappMenus;
    // let menuid = qs.parse(window.location.search)?.menuId;
    // console.log("menuId: ", menuid);
    this.setState({
      buttons,
      selectButton: buttons?.[0]?.name || "",
    });

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

    let domInput = document.querySelector('.two_search_input .ant-input')
    // domInput.placeholderStyle.color = 'red'
    try {
      let { data } = await this.userHanfler()
      let ssocode = await this.queryCode()
      data.ssocode = ssocode
      this.setState({ currentUser: data })
    } catch (error) {
      this.setState({ currentUser: {} })
    }

  }
  state = {
    selectButton: "",
    buttons: [],
    themeList: [], current: '', currentUser: {}
  };
  inputRef = React.createRef()
  // onMenuButtonClick = (e) => {
  //   this.setState({ selectButton: e });
  // };
  onSearch = (value) => {
    const { customConfig } = this.props;
    const { searchUrl = "" } = customConfig || {};
    let a = searchUrl;
    let b = a + value;
    window.open(b);
  };
  onGongzuotaiClick = () => {
    const { customConfig } = this.props;
    const { workbenchUrl = "" } = customConfig || {};
    window.open(workbenchUrl);
  };
  /*
   * url 目标url
   * arg 需要替换的参数名称
   * arg_val 替换后的参数的值
   * return url 参数替换后的url
   */

  userHanfler = async () => {
    let res = await userQuery()
    return res
  }
  //用户sscode
  queryCode = async () => {
    let res = await getCode()
    return res.data
  }


  onClickMenu = async ({ key, isSubMenu }) => {
    let menuAnchor = "";
    if (key?.split("#")[0]) {
      let menu = this.state.buttons.find((el) => el.id === key.split("#")[0]);
      menuAnchor = menu?.mapping_id;
    }

    if (key.split("#")[1] === "2" || key.split("#")[1] === "4") {
      if (!isSubMenu && key.split("#")[1] !== "4") {
        message.info("该菜单没有绑定页面！");
      }
      return false;
    }
    this.setState({ selectButton: key });

    this.goSearch(
      { ...qs.parse(window.location.search), menuId: key },
      menuAnchor
    );
  };
  goSearch(query, menuAnchor) {
    if (query.breadcrumb) {
      delete query.breadcrumb;
    }
    if (query.pId) {
      delete query.pId;
    }
    console.log("window.history: ", window.history);

    history.push({
      pathname: "/applicationview/content/view",
      search: stringify({
        ...query,
      }),
    });
    // {intl.get('APP.JTA')}
    if (menuAnchor) {
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        document.getElementById(menuAnchor)?.scrollIntoView(true);
      }, 3000);
    }
  }
  onMenuButtonClick = (item, index) => {
    // if (item.name === "SYSR.APP_MANAGEMENT") {
    //   this.onClickMenu({ key: "system#" + item.type, isSubMenu: false });
    // } else {
    //   this.onClickMenu({ key: item.id, isSubMenu: false });

    // }
    let data = this.state?.currentUser
    let params = []
    let url = item.url


    if (item.params?.length > 0) {
      item.params.forEach(x => {
        let item = x.key + '=' + data[x.value]
        params.push(item)
      })
      params = params.join('&')
      url += url.includes('?')
        ? '&' + params
        : '?' + params
    }

    if (index > 0) {
      this.setState({ selectButton: item.name }, () => window.open(url));
    } else {
      this.setState({ selectButton: item.name }, window.location.reload());
    }
  };
  //切换主题色
  themeColorClik = ({ item, key, keyPath, domEven }) => {
    const onThemeChange = this.props?.customConfig?.themeInfo?.onThemeChange || this.props?.themeInfo?.onThemeChange
    console.log(onThemeChange, '====8088');

    this.setState({ current: key })
    onThemeChange(key)
    // const appId = this.props?.customConfig?.appId || this.props?.appId

    // localStorage['themeColors-' + appId] = key
  }

  renderUserMenu = () => {
    const { customConfig } = this.props

    const {
      workbenchName = "个人工作台",
    } = customConfig || {}

    return (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <span onClick={this.onGongzuotaiClick}>
                {workbenchName}
              </span>
            )
          },
          {
            key: "2",
            label: (
              <span onClick={logoutSystem}>
                退出登录
              </span>
            ),
          },
        ]}
      />
    )
  }

  render() {
    const { customConfig } = this.props;
    const {
      logoUrl,
      title,
      mainHeight,
      //头部背景图片
      headerImageUrl,
      // 菜单高度
      selectHeight,
      //被选中菜单文字颜色
      selectTextColor = "#ffffff",
      // 选中背景颜色
      selectBackgroundColor = "#313a52",
      // 正常地址颜色
      menuTextColor = "rgba(0, 0, 0, 0.85)",
      // 搜索框地址
      // searchUrl = "",
      // 工作台地址
      // workbenchUrl = "",

      buttons = [],
      msgLink = ""
    } = customConfig || {};

    const placeholderColor = this.props?.customConfig?.placeholderColor || this.props?.placeholderColor || '#fff'
    const inputStyle = css`
      .ant-input::-webkit-input-placeholder{
        color:${placeholderColor}
      } ;
     
  `;
    const inputStyle2 = css`
    .ant-input{
    color:${placeholderColor}
  } ;
`;


    const { selectButton, themeList, current, currentUser } = this.state;
    if (this.props.isConfig) {
      return <Setting {...this.props} />;
    }

    return (
      <div
        className={`herder`}
        style={
          headerImageUrl?.length > 0
            ? {
              background: `url(${headerImageUrl})`,
              backgroundSize: "cover",
            }
            : { background: `url(${prefix}/head.300a6aef.webp)`, backgroundSize: "cover" }
        }
      >

        <div
          className="mainTop"
          style={{ height: mainHeight ? mainHeight : "64px", color: "#ffffff" }}
        >
          <div className="leftInfo">
            <img
              alt="logo"
              src={logoUrl}
              style={{ display: logoUrl ? "block" : "none" }}
              className="logo"
            />

            <div className="title">{title ? title : ""}</div>
          </div>

          <div className={`lineRight ${inputStyle} ${inputStyle2}`}>
            <Search
              placeholder="请输入关键词"
              onSearch={this.onSearch}
              ref={this.inputRef}
              className={`two_search_input`}
              style={{ borderRadius: "15px 0px 0px 15px", color: "#fff" }}
            />
            <ApplicationNotice msgLink={msgLink} styleStore={{}}>
              <BellOutlined
                className="BellOutlined"
                style={{
                  margin: "0px 5px 0px 10px",
                }}
              />
            </ApplicationNotice>
            <Dropdown overlay={themeList.length > 0 ? <Menu
              items={themeList}
              onClick={(e) => { this.themeColorClik(e) }} selectedKeys={[current]}
            /> : emptyDiv}>
              <SettingOutlined
                style={{ margin: "0px 15px 0px 10px" }}
                className="setting"
              />
            </Dropdown>

            <div className="user_info">
              <span
                className="zuzhi"
                style={{
                  minWidth: 40,
                  marginRight: 15,
                  whiteSpace: "nowrap",
                }}
              >
                {currentUser?.office_name || "默认"}
              </span>

              <span
                className="shenfen"
                style={{ minWidth: 40, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {currentUser?.userName || "默认"}
              </span>

              <Dropdown overlay={this.renderUserMenu()}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    alt="touxiang"
                    src={currentUser?.photo || "https://images.chinatimes.com/newsphoto/2021-04-13/656/20210413004121.jpg"}
                    style={{ marginRight: "10px ", width: 24, height: 24, borderRadius: 15, objectFit: 'cover' }}
                  />
                  <span
                    className="user_name"
                    style={{ marginRight: 15, whiteSpace: "nowrap" }}
                  >
                    {currentUser?.name || "默认"}
                  </span>
                  <DownOutlined />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        <div
          className="secondLine"
          style={{ height: selectHeight ? selectHeight : "64px" }}
        >
          <div className="allButtons">
            {buttons.map((item, index) => {
              return (
                <Button
                  key={JSON.stringify(item)}
                  className={
                    selectButton === item.name ? "selectButton" : "menubuttons"
                  }
                  style={
                    selectButton === item.name
                      ? {
                        color: selectTextColor,
                        background: selectBackgroundColor,
                      }
                      : { color: menuTextColor }
                  }
                  onClick={() => {
                    // this.changeURLArg(window.location.href, "menuId", item.id)
                    this.onMenuButtonClick(item, index);
                  }}
                >
                  {item.name === "SYSR.APP_MANAGEMENT" ? "应用管理" : item.name}
                </Button>
              );
            })}
          </div>
          {/* <div className="lineRight">
            <Search
              placeholder="请输入关键词"
              onSearch={this.onSearch}
              style={{ borderRadius: "15px 0px 0px 15px" }}
            />
            <Dropdown overlay={menu3}>
              <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
            </Dropdown>
            <ApplicationNotice styleStore={{}}>
              <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
            </ApplicationNotice>
            <Dropdown overlay={menu}>
              <SettingOutlined
                style={{ margin: "0px 15px 0px 10px" }}
                className="setting"
              />
            </Dropdown>

            <Button
              icon={<LaptopOutlined />}
              className="gongzuotai"
              onClick={this.onGongzuotaiClick}
            >
              工作台
            </Button>
            <div className="user_info">
              <img
                alt="touxiang"
                src={window?.currentUser?.photo}
                style={{ marginRight: "10px ", width: 24 }}
              />
              <span
                className="user_name"
                style={{ minWidth: 50, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.name || "默认"}
              </span>
              <span
                className="shenfen"
                style={{ minWidth: 40, marginRight: 15, whiteSpace: "nowrap" }}
              >
                {window?.currentUser?.userName || "默认"}
              </span>

              <Dropdown overlay={menu2}>
                <span
                  className="zuzhi"
                  style={{
                    minWidth: 40,
                    marginRight: 15,
                    whiteSpace: "nowrap",
                  }}
                >
                  {window?.currentUser?.office_name || "默认"}
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div> */}
        </div>

      </div>
    );
  }
}
