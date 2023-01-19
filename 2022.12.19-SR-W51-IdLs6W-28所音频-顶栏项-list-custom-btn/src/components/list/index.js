import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { queryAssetById } from '../../api/asset';
import { Modal, Menu } from "antd";
import Utils from '../../utils/index';

import "./index.less";
import moment from "moment";

import { BellOutlined } from '@ant-design/icons'
// const dataMenu = [
//   { chield_name: '菜单1', chield_url: '111111111' },
//   { chield_name: '菜单2', chield_url: '2222' },
//   { chield_name: '菜单3', chield_url: '333' },
// ]
// const form = {
//   name: '运维菜单', img: '',
//   url: 'https://element.eleme.cn/#/zh-CN/component/',
//   openType: 1,
//   menuArr: dataMenu
// }

const List = ({ configuration, history }) => {
  const headerRef = useRef(null)
  const tempCount = []
  const outBoxRef = useRef(null)
  const [config, setConfig] = useState({});
  // const [asset, setAsset] = useState('85c18452-aced-4647-a387-5eacc7c90071')
  const [assetInfo, setAssetInfo] = useState([])
  const [modelConfig, setModelConfig] = useState({})
  const [donghua, setDonghua] = useState({})
  const [current, setCurrent] = useState('mail');
  const [menu, setMenu] = useState([]);
  const [menuKey, setMenuKey] = useState([]);
  useEffect(() => {
    let keys = { name: 'label', url: 'value', img: 'icon', menuArr: 'children' }
    let childKey = { chield_name: 'label', chield_url: 'value' }
    try {
      setConfig(JSON.parse(configuration || "{}"));
      let form = JSON.parse(configuration || "{}")
      let a = form
      let keyData = []
      let temp = {}
      for (const key in a) {
        if (key == 'menuArr') {
          let arrCh = []
          a[key].forEach((element, i) => {
            let obj = {}
            for (const key in element) {
              obj[childKey[key]] = element[key]
            }
            obj.key = Utils.generateUUID()
            tempCount.push(obj.key)
            arrCh.push(obj)
          });
          temp[keys[key]] = arrCh.length > 0 ? arrCh : undefined

        } else if (key == 'img') {
          temp[keys[key]] = a[key]?.img ? <img style={{ width: '16px', height: '16px' }} src={a[key].img}></img> : ''
        } else {
          temp[keys[key]] = a[key]
        }
      }
      temp.key = Utils.generateUUID()
      tempCount.push(temp.key)
      temp.popupClassName = 'handerMenuChirend'
      temp.popupOffset = [-40, 5]
      setMenu([temp])
      setMenuKey(tempCount)
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    let t = headerRef.current.parentNode
    let b = document.querySelector('.application-customize-header')
    window.addEventListener('click', antMenuFun, false)
    if (b) b.style.backgroundColor = '#fff'
    if (t) t.style.height = '100%'
    return () => {
      window.removeEventListener('click', antMenuFun)
    }
  }, [])

  const antMenuFun = (e) => {
    // console.log(tempCount, '===事件');
    // console.log('--------进入事件', e, e.target.className.indexOf('ant-menu-item') != -1 || e.target.className.indexOf('ant-menu-submenu') != -1, tempCount.includes(window.sessionStorage.two_menu_key));
    if (e.target.className.indexOf('ant-menu-item') != -1 || e.target.className.indexOf('ant-menu-submenu') != -1 || e.target.className.indexOf('ant-menu-title-content') != -1) {
      if (!tempCount.includes(window.sessionStorage.two_menu_key)) {
        setCurrent(null)
      }
    }
  }
  const onClick = (e) => {
    console.log('click ', e.item.props.value);
    if (config.openType == 1) {
      window.open(e.item.props.value)
    } else {
      console.log("window.history: ", window.history);
      history && history.push(e.item.props.value)
    }
    sessionStorage.setItem('two_menu_key', e.key)
    setCurrent(e.key);
  };
  return (
    <>
      <div className="Header_two" ref={headerRef}>
        <Menu className='handerMenu' onClick={onClick} selectedKeys={current ? [current] : []} mode="horizontal" items={menu} triggerSubMenuAction='click' />
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" >
          {
            dataMenu.map((x, i) => {
              return (<Menu.Item key={i} label={x.chield_name} value={x.chield_name}> {x.chield_name}</Menu.Item>)
            })
          }

        </Menu> */}
      </div>
    </>

  )
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
