import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tabs } from "antd";
import qs from "querystringify";
// import appService from "@njsdata/app-sdk";
import "./app.less";

import Iframejs from "./common/iframe";

const { TabPane } = Tabs;

const App = (props) => {
  const { pageTabs = [], menuDatas = [], onChange, onRemove, getMenuName } = props;

  const [tabsData, setTabsData] = useState([]);

  const [removeKye, setRemoveKye] = useState(null);

  useEffect(() => {
    // 合并去重
    let newTabsData = pageTabs.concat(tabsData);
    for (let i = 0; i < newTabsData.length; i++) {
      for (let j = i + 1; j < newTabsData.length; j++) {
        if (newTabsData[i].id == newTabsData[j].id) {
          newTabsData.splice(j, 1);
          j--;
        }
      }
    }
    // 删除
    if (removeKye) {
      newTabsData.forEach((item, index) => {
        if (item.id === removeKye) {
          newTabsData.splice(index, 1);
        }
      });
      setRemoveKye(null);
    }

    setTabsData(newTabsData);
  }, [pageTabs]);

  useEffect(() => {
    window.addEventListener("message", previewAddEvent);

    return () => {
      window.removeEventListener("message", previewAddEvent);
    };
  }, [tabsData, previewAddEvent]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // 触发iframe监听
  const previewAddEvent = (e) => {
    let id = e?.data?.id;
    if (id) {
      let _tabsData = JSON.parse(JSON.stringify(tabsData));
      if (_tabsData.findIndex((target) => target.id === id) == -1) {
        _tabsData.push({ id: id });
      }
      setTabsData(_tabsData);

      let sessionValue = sessionStorage.getItem("iframe_sessionData");

      if (sessionValue) {
        let sessionValue = JSON.parse(sessionStorage.getItem("iframe_sessionData"));

        let index = sessionValue.findIndex((item) => item.id == e?.data?.id);

        if (index > -1) {
          sessionValue[index] = e?.data;
        } else {
          sessionValue.push(e?.data);
        }

        sessionStorage.setItem("iframe_sessionData", JSON.stringify(sessionValue));
      } else {
        let sessionValue = [];
        sessionValue.push(e?.data);
        sessionStorage.setItem("iframe_sessionData", JSON.stringify(sessionValue));
      }
      onChange(id);
    }
  };

  // 移除Tabs
  const removeTabs = (key) => {
    setRemoveKye(key);
    onRemove(key);
  };

  return (
    <Tabs className="tabsAll" type="editable-card" onChange={onChange} hideAdd={true} onEdit={removeTabs} activeKey={qs.parse(window.location.search).menuId}>
      {tabsData.map((pane) => (
        <TabPane tab={getMenuName(pane.id)} key={pane.id} closable={tabsData.length !== 1}>
          {/* <Iframejs /> */}
        </TabPane>
      ))}
    </Tabs>
  );
};

App.propTypes = {
  pageTabs: PropTypes.array, // 应用页签集合
  menuDatas: PropTypes.array, // 应用页签菜单数据
  onChange: PropTypes.func, // 应用页签的change方法
  onRemove: PropTypes.func, // 应用页签的删除方法
  getMenuName: PropTypes.func, // 获取应用页签的名称
};

export default App;
