import React, { Component } from "react";
import { Button, Input, Layout, Menu, Anchor, message, Dropdown, Cascader } from "antd";
import Setting from "./setting";
// import classNames from "classnames";
import qs from "querystringify";
import { stringify } from "./qs";
// import ApplicationNotice from "./notice";
import history from "./history";
import utils from "./utils/index.js";
import {
  // PoweroffOutlined,
  BellOutlined,
  SettingOutlined,
  // LaptopOutlined,
  DownOutlined, MailOutlined, AppstoreOutlined
} from "@ant-design/icons";
import { logout, getMenuData, queryAssetById, userQuery, queryConfigSummary } from "./api/asset";
// import appService from "@njsdata/app-sdk";
import head from "./assets/headbg.png";
import user from "./assets/user.png";
import "./app.less";
const { Search } = Input;
// const { SubMenu } = Menu;
// const { Link } = Anchor;
const appid = qs.parse(window.location.search).appid;
const province_id = qs.parse(window.location.search).Province_Id;
const city_id = qs.parse(window.location.search).City_Id;
const substation_no = qs.parse(window.location.search).Substation_No;
const regionalAssets = []
// const office_name = window.currentUser?.office_name || '全国'
const logoutSystem = () => {
  logout()
    .then((res) => {

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

const menu2 = (
  <Menu
    items={[

      {
        key: "2",
        label: <span onClick={logoutSystem}>退出登录</span>,
      },
    ]}
    forceSubMenuRender={true} className='tow_mentParent'
  />
);
// const menu3 = <ApplicationNotice styleStore={{}} />;
/*!TODO:1.菜单接口；2.站内信接口；3.主题改变方法 ；4.用户信息；*/
export default class App extends Component {

  async componentDidMount() {
    let { menuData = '[]', alarmAsset = '0cda0b85-ddf3-42eb-9180-3d08d947b628', substationAsset = 'f54a257e-cb84-40d1-8d35-683e73284532', regionAsset = '33b93646-868b-4ffc-a249-e766b5af9be8', time = 60 } = this.props;


    // const { data } = await getMenuData(appId, menuId);
    // let buttons = data?.menuAndButton?.datappMenus;
    // let menuid = qs.parse(window.location.search)?.menuId;
    // console.log("menuId: ", menuid);

    const events = [
      {
        key: "valueChange",
        name: "值改变",
        payload: [
          {
            name: "值",
            key: "value",
            dataType: "string",
          },
        ],
      },
    ];
    const actions = [
      {
        key: "setValue",
        name: "设值",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
        hasReturn: false,
        // hasReturn为false则不用写returns选项
        returns: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      }
    ]
    this.props?.componentId &&
      window.componentCenter?.register(
        this.props?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    let { data } = await this.userHanfler()
    let office_name = data.office_name
    let loginName = data.loginName
    this.setState({ office_name, loginName })


    let { datappMenus } = await this.queryMenu()

    datappMenus.forEach((x, i) => {
      x.className = 'handerMenu2  handMenu' + i
      x.popupClassName = 'handerMenuChirend' + i
      x.key = 'menu' + i
      x.label = x.name

      if (x.children.length == 0) delete x.children
      x.children && x.children.forEach((item, inx) => {
        item.key = x.key + 'item' + inx
        item.label = item.name

        if (item.children.length == 0) delete item.children
      })
      x.onTitleClick = this.onClick
      x.popupOffset = [-22, 5]
      if (x.label == 'SYSR.APP_MANAGEMENT') datappMenus.splice(i, 1)
    })

    // menuAndButton
    menuData = JSON.parse(menuData)
    menuData.forEach((x, i) => {
      x.className = 'handerMenu2  handMenu' + i
      x.popupClassName = 'handerMenuChirend' + i
      x.key = 'menu' + i
      x.children && x.children.forEach((item, inx) => {
        item.key = x.key + 'item' + inx
      })
      x.onTitleClick = this.onClick
      x.popupOffset = [-22, 5]
    })
    let parName = office_name == '全国' ? '中国' : office_name



    this.setState({
      menuData: datappMenus, regionValue: office_name
    })
    this.metaButton.current?.addEventListener("wheel", this.wrapperWheel.bind(this));

    let res = await queryAssetById(regionAsset) //区域

    let datar = utils.translatePlatformDataToJsonArray(res)
    let tempQy = datar.find((x, i) => {
      return x.province_name == parName || x.city_name == parName || x.nation == parName
    })
    let tempZd

    let res1 = await queryAssetById(substationAsset) //站点
    let datas = utils.translatePlatformDataToJsonArray(res1)
    tempZd = datas.find((x, i) => {
      return x.substation_name == parName
    })
    let res2 = await this.flatHandler(datar, office_name)
    this.flatHandler(datar, office_name).then(res => {
      let tree = this.translateDataToTree(res)
      let statusList
      if (tempZd) {
        statusList = [tempZd.substation_no]
      } else {
        statusList = this.childHanfler(tree)
        statusList.forEach((x, i) => {
          x = x.substr(0, x.length - 1)
          statusList[i] = x
        })
      }
      this.setState({
        treeData: tree, statusList, regionFiled: parName, regionValue: parName == '中国' ? '全国' : parName, statusListAll: statusList
      }, () => {
        this.queryAlterFn()
        let time1 = setInterval(() => {
          this.queryAlterFn()
        }, time * 1000)
        this.setState({ tiemObj: time1 })
      })
    })
    if (substation_no) {
      let tempZd = datas.find((x, i) => {
        return x.substation_no == substation_no
      })
      parName = tempZd.substation_name
      this.flatHandler(datar, parName).then(res => {
        let tree = this.translateDataToTree(res)
        let tree2 = this.translateDataToTree(res2)
        let statusList
        if (tempZd) {
          statusList = [tempZd.substation_no]
        } else {
          statusList = this.childHanfler(tree)
          statusList.forEach((x, i) => {
            x = x.substr(0, x.length - 1)
            statusList[i] = x
          })
        }
        this.setState({
          treeData: tree2, statusList, regionFiled: parName, regionValue: parName == '中国' ? '全国' : parName
        }, () => {
          this.queryAlterFn()
          let time1 = setInterval(() => {
            this.queryAlterFn()
          }, time * 1000)
          this.setState({ tiemObj: time1 })
        })
      })
    } else if (city_id) {
      let tempQy = datar.find((x, i) => {
        return x.city_id
          == city_id
      })
      parName = tempQy.city_name
      this.flatHandler(datar, parName).then(res => {
        let tree = this.translateDataToTree(res)
        let tree2 = this.translateDataToTree(res2)
        let statusList
        if (tempZd) {
          statusList = [tempZd.substation_no]
        } else {
          statusList = this.childHanfler(tree)
          statusList.forEach((x, i) => {
            x = x.substr(0, x.length - 1)
            statusList[i] = x
          })
        }
        this.setState({
          treeData: tree2, statusList, regionFiled: parName, regionValue: parName == '中国' ? '全国' : parName,
        }, () => {
          this.queryAlterFn()
          let time1 = setInterval(() => {
            this.queryAlterFn()
          }, time * 1000)
          this.setState({ tiemObj: time1 })
        })
      })
    } else if (province_id) {
      let tempQy = datar.find((x, i) => {
        return x.province_id
          == province_id
      })
      parName = tempQy.province_name
      this.flatHandler(datar, parName).then(res => {
        let tree = this.translateDataToTree(res)
        let tree2 = this.translateDataToTree(res2)
        let statusList
        if (tempZd) {
          statusList = [tempZd.substation_no]
        } else {
          statusList = this.childHanfler(tree)
          statusList.forEach((x, i) => {
            x = x.substr(0, x.length - 1)
            statusList[i] = x
          })
        }
        this.setState({
          treeData: tree2, statusList, regionFiled: parName, regionValue: parName == '中国' ? '全国' : parName,
        }, () => {
          this.queryAlterFn()
          let time1 = setInterval(() => {
            this.queryAlterFn()
          }, time * 1000)
          this.setState({ tiemObj: time1 })
        })
      })
    }

    if (province_id) {
      let syid = province_id
      let city = city_id
      let substation = substation_no

      this.setState({ city, substation },)
      const { changeAppVariables = '', appVarKey = 'province_id|city_id|substation_no|test' } = this.props
      let AppVariables = {}
      let appArr = appVarKey.split('|')
      AppVariables[appArr[0]] = syid || tempZd?.province
      AppVariables[appArr[1]] = city || tempZd?.city
      AppVariables[appArr[2]] = substation
      let temp = {}
      temp[appArr[0]] = syid || tempZd?.province
      temp[appArr[1]] = city || tempZd?.city
      temp[appArr[2]] = substation
      if (appArr[3]) {
        AppVariables[appArr[3]] = JSON.stringify(temp)

      }
      sessionStorage.setItem('hanYuanTopInfo', JSON.stringify(temp))
      changeAppVariables && changeAppVariables(AppVariables)

    } else if (parName != '中国') {

      let syid = tempQy?.province_id
      let city = tempQy?.city_name == parName && tempQy?.city_name != tempQy?.province_name ? tempQy?.city_id : ''
      let substation = tempZd?.substation_name == parName ? tempZd?.substation_no : ''


      this.setState({ officeno: syid, city, substation },)
      const { changeAppVariables = '', appVarKey = 'province_id|city_id|substation_no|test' } = this.props
      let AppVariables = {}
      let appArr = appVarKey.split('|')
      AppVariables[appArr[0]] = syid || tempZd?.province
      AppVariables[appArr[1]] = city || tempZd?.city
      AppVariables[appArr[2]] = substation
      let temp = {}
      temp[appArr[0]] = syid || tempZd?.province
      temp[appArr[1]] = city || tempZd?.city
      temp[appArr[2]] = substation
      if (appArr[3]) {
        AppVariables[appArr[3]] = JSON.stringify(temp)

      }
      sessionStorage.setItem('hanYuanTopInfo', JSON.stringify(temp))

      changeAppVariables && changeAppVariables(AppVariables)
    }





    // this.queryAlterFn()

    // let ulitem = document.querySelectorAll('ul.ant-menu-vertical')

    // ulitem.forEach(x => {

    //   x.className += ' tow_mentParent'
    //   x.style.border = '1px solid rgba(89, 175, 249, 0.7)'
    // })
    // console.log(ulitem, '====');
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
  do_EventCenter_setValue = ({ value }) => {
    console.log(value, '====设值');
  }
  //菜单查询
  async queryMenu() {
    let { data } = await queryConfigSummary({ datappId: appid })
    return data.menuAndButton
  }

  //获取最后一级的id
  childHanfler(tree, arr = []) {

    tree.map((x, i) => {

      if (x.children) {

        this.childHanfler(x.children, arr)
      } else {
        if (!x.statu) {
          arr.push(x.id)
        }
      }
    })
    return arr

  }
  wrapperWheel(e) {
    e.preventDefault();
    this.metaButton.current.scrollLeft += e.deltaY * 3 + e.deltaX * 3;
  };
  queryAlterFn() {
    let { alarmAsset = '0cda0b85-ddf3-42eb-9180-3d08d947b628', alarmField = 'type3', areaFiled = 'substation_no' } = this.props;
    let { regionFiled, statusList } = this.state
    let dateT = new Date().getTime()
    queryAssetById(alarmAsset, dateT).then(res => {
      let data = utils.translatePlatformDataToJsonArray(res)
      if (regionFiled != '全国') {
        let temp = []
        statusList.forEach(item => {
          data.forEach(x => {
            if (x[areaFiled] == item && x.clear_time == null) temp.push(x)
          })
        })
        data = temp
      }
      const arrOptions = this.props?.optiFieldValueR || ['1', '2', '3', '4']
      let a = {}
      let b = []
      data.forEach(x => {
        let key = x[alarmField]
        if (a[key]) {
          a[key]++
        } else {
          a[key] = 1
        }
      })

      let temp = [{ 紧急: 0, }, { 高: 0, }, { 中: 0, }, { 低: 0 }]
      temp.forEach((x, i) => {
        x.type = arrOptions[i]
        x.value = 0
      })
      temp.forEach((x, i) => {
        for (const keya in a) {
          if (keya == x.type) {
            x.value = a[keya] > 99 ? '99+' : a[keya]
          }
        }
      })
      this.setState({
        warningAlter: temp
      })
    }).catch(err => {

    })
  }

  componentWillUnmount() {
    clearInterval(this.state.tiemObj)
    this.metaButton.current?.removeEventListener("wheel", this.wrapperWheel.bind(this));
    this.setState({
      tiemObj: null
    })
  }
  metaButton = React.createRef();
  state = {
    selectButton: "",
    buttons: [],
    counting: 0,
    current: 'SubMenu', clickStatus: false, officeno: null, statusList: [], office_name: '全国', ctiy: '', substation: '',
    menuData: [], treeData: [], warningAlter: [], regionValue: '全国', tiemObj: null, regionFiled: '全国', statusListAll: [], loginName: ''
  };
  //将城市结构的数据转成扁平数据
  flatHandler = async (data, office_name) => {
    const { substationAsset } = this.props
    let parName = office_name == '全国' ? '中国' : office_name

    let provinceArr = []
    let cityArr = []
    let countryArr = []
    data.forEach((x, i) => {
      if (x.nation == parName || x.province_name == parName || x.city_name == parName || x.country_name == parName || x.nation == '全国') {
        let strL = String(x.city_id).length
        let strl = String(x.country_id).length
        let proBoolean = true
        let cityBoolean = true
        provinceArr.forEach((pr,) => {
          proBoolean = !(pr.id == x.province_id)
        })
        if (proBoolean && (x.province_name == parName || office_name == '全国')) provinceArr.push({ id: String(x.province_id), name: x.province_name, parentid: office_name == '全国' ? '0' : null, statu: true })
        cityArr.forEach((cit, i) => {
          cityBoolean = !(cit.id == x.city_id)
        })
        let nameId = x.province_name == parName || office_name == '全国' ? String(x.city_id).substr(0, strL - 2) : null
        if (cityBoolean && x.city_name && (x.city_name != x.province_name || x.country_name)) cityArr.push({ id: String(x.city_id), name: x.city_name, parentid: nameId, statu: true })
        if (x.country_name) countryArr.push({ id: String(x.country_id), name: x.country_name, parentid: String(x.country_id).substr(0, strl - 2) })
      }
    })
    let res = await queryAssetById(substationAsset);
    let zhandian = utils.translatePlatformDataToJsonArray(res)
    let zuidiji = []
    zhandian.forEach((x, i) => {
      zuidiji.push({ id: x.substation_no + 'x', name: x.substation_name, parentid: String(x.city) })
    })

    if (office_name == '全国') {
      let nationArr = [{ id: '0', name: '全国', parentid: null, statu: true }]
      return [...cityArr, ...zuidiji, ...provinceArr, ...nationArr]
    } else {
      return [...cityArr, ...zuidiji, ...provinceArr]
    }

  }


  translateDataToTree(data) {
    let parents = data.filter(value => value.parentid == 'undefined' || value.parentid == null)
    let children = data.filter(value => value.parentid !== 'undefined' && value.parentid != null)
    let translator = (parents, children) => {
      parents.forEach((parent) => {
        children.forEach((current, index) => {
          if (current.parentid === parent.id) {
            let temp = JSON.parse(JSON.stringify(children))
            temp.splice(index, 1)
            translator([current], temp)
            typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
          }
        }
        )
      }
      )
    }

    translator(parents, children)

    return parents
  }
  GetTreeData = (data) => {
    let TreeData = [];
    let map = new Map(); //存在id,对应所在的内存地址
    let outputObj, parentid;
    for (let i = 0; i < data.length; i++) {
      parentid = data[i].parentid;
      // console.log(map, '======1');
      if (map.has(parentid)) {

        //存在，将些信息，加入到对应id=pid的对象上的children
        if (!map.get(parentid).childrens)
          map.get(parentid).childrens = [];
        let obj = new Object(data[i]);
        map.get(parentid).childrens.push(obj);
        //通过pid在Map中查找，并将当前对象，加入到对应的childres属性
        map.set(data[i].id, obj);
        //重点(必须也加入Map)：将当前id及对应的对象，存入Map对象中
      } else if (!map.has(parentid) && (parentid == 0 || parentid == null || parentid == undefined)) {
        //这里处理pid不存在，且pid 为0的处理，pid不存在，且不为0的，程序不考虑这种情况
        outputObj = new Object(data[i]);

        //加入到要返回的数组中
        TreeData.push(outputObj);
        //将id添加到Map中
        map.set(data[i].id, outputObj);


      }
    }
    return TreeData;
  }
  // onMenuButtonClick = (e) => {
  //   this.setState({ selectButton: e });
  // };
  onSearch = (value) => {
    const { searchUrl = "" } = this.props;
    let a = searchUrl;
    let b = a + value;
    window.open(b);
  };
  onGongzuotaiClick = () => {
    const { workbenchUrl = "" } = this.props;

    window.open(workbenchUrl);
  };
  userHanfler = async () => {
    let res = await userQuery()
    return res
  }


  /*
   * url 目标url
   * arg 需要替换的参数名称
   * arg_val 替换后的参数的值
   * return url 参数替换后的url
   */

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
  //区域选择
  onChangeC = (_, arrsel) => {
    const { changeAppVariables, appVarKey = 'province_id|city_id|substation_no|test', } = this.props
    const { officeno, city, office_name, statusListAll } = this.state
    if (office_name == '全国') {
      if (_.length == 1) {
        let AppVariables = {}
        let appArr = appVarKey.split('|')
        appArr.forEach(item => {
          AppVariables[item] = ''
        })
        this.setState({ regionValue: '全国', regionFiled: '', statusList: statusListAll, clickStatus: true }, () => {
          this.queryAlterFn()
        })

        sessionStorage.setItem('hanYuanTopInfo', '{"province_id":"","city_id":"","substation_no":""}')
        changeAppVariables && changeAppVariables(AppVariables)
        document.querySelector('.resetBtn') && document.querySelector('.resetBtn').click()
      } else {
        let _2 = _.slice(1)
        let leng = _2.length
        let leng2 = arrsel.length
        let regionFiled = _2.length == 3 ? _2[leng - 1].replace('x', '') : _2[leng - 1]
        let regionValue = arrsel[leng2 - 1].name
        let arrList = leng == 3 ? _2[leng - 1].replace('x', '') : arrsel[leng2 - 1]
        let statusList = []
        if (arrList.children && arrList.statu) {
          statusList = this.childHanfler(arrList.children)
          statusList.forEach((x, i) => {
            x = x.substr(0, x.length - 1)
            statusList[i] = x
          })
        } else {
          statusList = arrList.statu ? [] : [arrList]
        }
        this.setState({ regionValue, regionFiled: regionFiled, statusList, clickStatus: true }, () => {
          this.queryAlterFn()
        })
        let AppVariables = {}
        let appArr = appVarKey.split('|')
        let temp = {}
        if (_2[0].length > 2) {

          AppVariables[appArr[0]] = officeno
          temp[appArr[0]] = officeno
          for (let i = 1; i < 3; i++) {
            let x = appArr[i]
            AppVariables[x] = i == 2 && _2.length == 2 ? _2[i - 1].substr(0, _2[leng - 1].length - 1) : _2[i - 1]
            temp[x] = AppVariables[x]
          }

        } else if (appArr.length == 1) {

          AppVariables[appVarKey] = _2[leng - 1].substr(0, _2[leng - 1].length - 1)
          temp = JSON.stringify(AppVariables[appVarKey])
        } else {

          for (let i = 0; i < 3; i++) {
            let x = appArr[i]
            AppVariables[x] = i == 2 && _2.length == 3 ? _2[i].substr(0, _2[leng - 1].length - 1) : _2[i]
            temp[x] = AppVariables[x]
          }

        }
        if (appArr[3]) AppVariables[appArr[3]] = JSON.stringify(temp)
        sessionStorage.setItem('hanYuanTopInfo', JSON.stringify(temp))
        changeAppVariables && changeAppVariables(AppVariables)
      }

    } else {
      let leng = arrsel.length
      let regionFiled = _.length == 3 ? _[leng - 1].replace('x', '') : _[leng - 1]
      let regionValue = arrsel[leng - 1].name
      let arrList = leng == 3 ? _[leng - 1].replace('x', '') : arrsel[leng - 1]
      let statusList = []
      if (arrList.children && arrList.statu) {
        statusList = this.childHanfler(arrList.children)
        statusList.forEach((x, i) => {
          x = x.substr(0, x.length - 1)
          statusList[i] = x
        })
      } else {
        statusList = arrList.statu ? [] : [arrList]
      }
      this.setState({ regionValue, regionFiled: regionFiled, statusList, clickStatus: true }, () => {
        this.queryAlterFn()
      })
      let AppVariables = {}
      let appArr = appVarKey.split('|')
      let temp = {}
      if (_[0].length > 2) {

        AppVariables[appArr[0]] = officeno
        temp[appArr[0]] = officeno
        for (let i = 1; i < 3; i++) {
          let x = appArr[i]
          AppVariables[x] = i == 2 && _.length == 2 ? _[i - 1].substr(0, _[leng - 1].length - 1) : _[i - 1]
          temp[x] = AppVariables[x]
        }

      } else if (appArr.length == 1) {

        AppVariables[appVarKey] = _[leng - 1].substr(0, _[leng - 1].length - 1)
        temp = JSON.stringify(AppVariables[appVarKey])
      } else {

        for (let i = 0; i < 3; i++) {
          let x = appArr[i]
          AppVariables[x] = i == 2 && _.length == 3 ? _[i].substr(0, _[leng - 1].length - 1) : _[i]
          temp[x] = AppVariables[x]
        }

      }
      if (appArr[3]) AppVariables[appArr[3]] = JSON.stringify(temp)
      sessionStorage.setItem('hanYuanTopInfo', JSON.stringify(temp))
      changeAppVariables && changeAppVariables(AppVariables)
    }

    window.eventCenter?.triggerEvent(this.props?.componentId, "valueChange", {
      value: this.props?.componentId
    })
  };
  onMenuButtonClick = (item, index) => {
    // if (item.name === "SYSR.APP_MANAGEMENT") {
    //   this.onClickMenu({ key: "system#" + item.type, isSubMenu: false });
    // } else {
    //   this.onClickMenu({ key: item.id, isSubMenu: false });

    // }
    let params = []
    let url = item.url
    if (item?.params?.length > 0) {
      item.params.forEach(x => {
        let item = x.key + '=' + x.value
        params.push(item)
      })
      params = params.join('&')
      url = url + '?' + params
    }

    if (index > 0) {
      this.setState({ selectButton: item.name }, () => window.open(url));
    } else {
      this.setState({ selectButton: item.name }, window.location.reload());
    }
  };

  itmeOnClick = ({ item, key, keyPath, domEven }) => {
    let pid = item.props.id
    let address = item.props.url
    let { appId, history } = this.props;

    if (pid) {
      window?.pluginCesiumMap?.viewer?.destroy && window.pluginCesiumMap.viewer.destroy()
      let url = `applicationview/content/view?appid=${appId}&type=view&themed=be604992-edae-4002-b362-586742e36d4e&menuId=${pid}`
      history.push(url)
      // setTimeout(() => {
      // for (const key in sessionStorage) {
      //   if (key.indexOf('currentQueryParams') != -1) {
      //     let a = JSON.parse(sessionStorage[key])
      //     a.forEach(x => {
      //       x.value = ''
      //     })
      //     sessionStorage.setItem(key, JSON.stringify(a))
      //   }
      //   if (key.indexOf('queryList') != -1) {
      //     let a = JSON.parse(sessionStorage[key])
      //     a.forEach(x => {
      //       x.filterValue = []
      //       x.list = []
      //       x.defaultValue_value = ''
      //       x.defaultValue = ''
      //     })
      //     sessionStorage.setItem(key, JSON.stringify(a))
      //   }
      // }
      // document.querySelector('.resetBtn') && document.querySelector('.resetBtn').click()
      // }, 200)

      // console.log(statusListAll, '========结果');
      const { statusList, statusListAll, regionValue } = this.state
      // statusList.length ==statusListAll.length
      // if (regionValue == '全国') {
      setTimeout(() => {
        document.querySelector('.resetBtn') && document.querySelector('.resetBtn').click()
      }, 600)
      // }

    } else {
      window.location.href = address
    }
    this.setState({
      current: key
    })

  }
  querySel = (e) => {
    const { menuData } = this.state

    let value = e[0]
    let index = menuData?.findIndex((x, i) => {
      return x.key == value
    })
    if (value) {
      let item = document.querySelector('.handMenu' + index)
      let obpq = document.querySelector(`.handerMenuChirend${index} .ant-menu-sub`)
      obpq.style.minWidth = item.clientWidth + 4 + 'px'

    }

    if (this.state.counting) return
    let ulitem = document.querySelectorAll('ul.ant-menu-vertical')

    ulitem.forEach(x => {

      x.className += ' tow_mentParent'
      x.style.border = '1px solid rgba(89, 175, 249, 0.7)'
    })

    this.setState({ counting: 1 })
  }
  warningClick = (type) => {
    const { alarmUrl, alarmField, history, alarmAppKey, changeAppVariables } = this.props



    if (alarmUrl.indexOf('applicationview/content/view') != -1) {
      let obej = {}
      obej[alarmAppKey] = type
      obej.now_state = '0'
      changeAppVariables && changeAppVariables(obej)
      document.querySelector('.resetBtn') && document.querySelector('.resetBtn').click()
      history.push(`${alarmUrl}`)
    } else {
      let obej = {}
      obej[alarmAppKey] = type
      obej.now_state = '0'
      changeAppVariables && changeAppVariables(obej)
      window.open(`${alarmUrl}`)

    }
  }
  onDropdownChange = (value) => {
    setTimeout(() => {
      let statusList
      const { treeData, officeno, office_name, city, substation } = this.state


      if (!value) {

        if (!this.state.clickStatus) {
          statusList = this.childHanfler(treeData)
          statusList.forEach((x, i) => {
            x = x.substr(0, x.length - 1)
            statusList[i] = x
          })

          window.location.reload()


          this.setState({ statusList, regionValue: office_name }, () => {
            this.queryAlterFn()
          })
        }


        this.setState({ clickStatus: false, })
      }
    })


  }
  Event_Center_getName = () => {
    return "应用头部二开测试";
  }

  render() {


    // const warningAlter = [1, 2, 3, 4]
    const {

      title,

      // 菜单高度

      //被选中菜单文字颜色

      // 搜索框地址
      // searchUrl = "",
      // 工作台地址
      // workbenchUrl = "",

    } = this.props || {};

    const { selectButton, loginName, current, menuData, treeData, warningAlter, regionValue } = this.state;
    if (this.props.isConfig) {
      return <Setting {...this.props} />;
    }
    return (
      <div
        className="herder"
        style={

          { backgroundSize: "cover", }
        }
      >
        <div
          className="mainTop"
          style={{ background: ` url(${head}) `, backgroundSize: "100%  100%" }}
        >
          <div className="leftInfo">

            <img
              alt="logo2"
              src={require("./assets/log.svg").default}
              style={{ display: "block" }}
              className="logo"
            />
            <div className="title">{title ? title : "变电站(换流站)无人机运防一体系统"}</div>
          </div>

          <div className='metaButton' ref={this.metaButton} >

            <div
              className="secondLine"
              style={{ height: "64px" }}
            >
              <div className="allButtons">
                <Menu
                  className='handerMenu'
                  items={
                    menuData
                  }
                  mode='horizontal' forceSubMenuRender={true} selectedKeys={[current]}
                  triggerSubMenuAction='click' onClick={(e) => { this.itmeOnClick(e) }} onOpenChange={(e) => { this.querySel(e) }}
                >
                </Menu>
              </div>
            </div>

          </div>

          <div className="lineRight">
            <Cascader options={treeData} popupClassName='tow_Cascader' fieldNames={{ children: 'children', value: 'id', label: 'name' }}
              changeOnSelect={true}
              className='dddd' onChange={this.onChangeC}>
              <div className='aTag'><a href="#">{regionValue}   </a><DownOutlined /></div>
            </Cascader>


            <div className='warningAlter' >
              {warningAlter.map((x, i) => {
                return (<div className={`warningItem Item${i}`} onClick={() => { this.warningClick(x.type) }}>{x.value}</div>)
              })

              }
            </div>




            {/* <Button
              icon={<LaptopOutlined />}
              className="gongzuotai"
              onClick={this.onGongzuotaiClick}
            >
              工作台
            </Button> */}
            <div className="user_info">

              <img src={user} style={{ marginRight: '5px' }} ></img>
              {/* 默认用户登录趋向于 */}
              <Dropdown overlay={menu2}>
                <span
                  className="zuzhi"
                  style={{
                    minWidth: 40,
                    marginRight: 15,
                    whiteSpace: "nowrap",
                    color: '#fff'
                  }}
                >
                  {loginName || "默认"}
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div>
        </div>


        {/* {菜单按钮} */}

      </div>
    );
  }
}
