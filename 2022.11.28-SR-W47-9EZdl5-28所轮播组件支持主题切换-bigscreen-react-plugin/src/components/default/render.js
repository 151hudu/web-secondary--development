import React, { useEffect, useState, useRef } from "react";
import { useRafInterval } from "ahooks";
import { Tabs } from "antd";
import iconImg from "../../Icon/tab.png";
import { queryThemeList } from "../../api/asset";

const StaticData = [
  ["项目一", "", ""],
  ["项目二", "", ""],
  ["项目三", "", ""],
];
const ITEMNUM = 3;

const DefaultRender = (props) => {
  const [id, setId] = useState(props.block.baseConfig.id);
  const [activeKey, setActiveKey] = useState("");
  const [itemNames, setItemNames] = useState(["项目一", "项目二", "项目三"]);
  const [iconItems, setIconItems] = useState([iconImg, iconImg, iconImg]);
  const [iconSize, setIconSize] = useState("40px");
  const [nameSize, setNameSize] = useState("18px");
  const [themeIndex, setThemeIndex] = useState(0);
  const [delay, setDelay] = useState(2000);
  const initFormRef = useRef();
  useEffect(() => {
    initFormRef.current = themeIndex;
  }, [themeIndex]);
  const [nowTheme, setnowTheme] = useState(props?.bigscreen?.theme);
  const [nameColor, setNameColor] = useState("black");
  const [themeList, setThemeList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    /**
     * 可能会存在相同类型组件被删除的情况，因此在每次挂载之后检测blocks中每个组件的id
     * 如果挂载在window.pluginTimer的id在blocks中不存在即表示该id对应的组件已经被删除
     * 这时需要手动清除掉挂载的id
     */
    checkBlockIdTimer();
    if (window?.pluginTimer?.get(id)) {
      const fn = window.pluginTimer.get(id);
      fn && fn();
      window.pluginTimer.set(id, null);
    }
    const {
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    queryThemeListFun(pluginOptions)
  }, []);
  async function queryThemeListFun(pluginOptions) {
    const res = await queryThemeList();
    let message = [];
    res.data.customList.forEach((element) => {
      message.push(element);
    });
    res.data.systemList.forEach((element) => {
      message.push(element);
    });
    setThemeList([...message]);
    let nowIndex = 0;
    message.forEach((item) => {
      if (item.id == nowTheme) {
        pluginOptions?.dispositionList.forEach((itemSon, indexSon) => {
          if (item.name.trim() == itemSon.toppicName.trim()) {
            setThemeIndex(indexSon);
            nowIndex = indexSon;
          }
        });
      }
    });
    let tempDate = handleItemName(nowIndex);
    initComData(nowIndex);
    setsetDelay(nowIndex);
    handleItemIcons(nowIndex);
    if (pluginOptions?.dispositionList[nowIndex]?.canCarousel !== false) {
      let flag = currentIndex >= tempDate.length;
      if (flag) {
        setActiveKey(tempDate[0]);
      } else {
        setActiveKey(tempDate[currentIndex]);
      }
      setContainerContent(flag);
      setCurrentIndex(flag ? 1 : currentIndex + 1);
      if (window?.pluginTimer?.get(id)) {
        const fn = window.pluginTimer.get(id);
        fn && fn();
        window.pluginTimer.set(id, null);
      }
    } else {
      handleTimeChange(tempDate, true);
    }
  }
  //处理手动切换页签
  const handleTabChange = (key) => {
    const {
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    if (window?.pluginTimer?.get(id)) {
      const fn = window?.pluginTimer?.get(id);
      fn();
      window.pluginTimer.set(id, null);
    }
    let tempIndex = getTargetIndex(key, itemNames);
    setActiveKey(key);
    if (pluginOptions?.dispositionList[themeIndex]?.canCarousel === false) {
      let flag = tempIndex >= itemNames.length;
      if (flag) {
        setActiveKey(itemNames[0]);
      } else {
        setActiveKey(itemNames[tempIndex]);
      }
      setContainerContent(flag, tempIndex);
      setCurrentIndex(flag ? 1 : tempIndex + 1);
    } else {
      handleTimeChange(itemNames, true, tempIndex);
    }
  };

  const createTabTimer = useRafInterval(() => {
    console.log('定时器内部');
    console.log(props);
    const data = itemNames.slice();
    const {
      bigscreen: {
        blocks
      }
    } = props;
    //获取所有组件ID的数组
    let exitIds = blocks.map(item => item.baseConfig.id);
    if (!exitIds.includes(id)) {
      const fn = window.pluginTimer.get(id);
      fn && fn();
      window.pluginTimer.delete(id);
      return;
    }
    let flag = currentIndex >= data.length;
    if (flag) {
      setActiveKey(data[0]);
    } else {
      setActiveKey(data[currentIndex]);
    }
    setContainerContent(flag);
    setCurrentIndex(flag ? 1 : currentIndex + 1);
  }, delay);

  //处理定时器
  const handleTimeChange = (data, immediately = false, nIndex = undefined) => {
    if (immediately) {
      // let flag = currentIndex >= data.length;
      let flag = (nIndex ?? currentIndex) >= data.length;
      if (flag) {
        setActiveKey(data[0]);
      } else {
        setActiveKey(data[nIndex ?? currentIndex]);
      }
      setContainerContent(flag, nIndex);
      setCurrentIndex(flag ? 1 : ((nIndex ?? currentIndex) + 1));
    }
    //一个二开插件只有一个定时器，所以只需要最后注册的定时器，所以将之前的定时器都清除掉
    if (window?.pluginTimer?.get(id)) {
      // clearInterval(window.pluginTimer.get(id));
      const fn = window.pluginTimer.get(id);
      fn && fn();
      window.pluginTimer.set(id, null);
    }
    createTabTimer();
    if (!window?.pluginTimer) {
      //因为存在多个同类型组件，因此使用map来记录每个组件自己的定时器id
      window.pluginTimer = new Map();
    }
    window.pluginTimer.set(id, createTabTimer);
  };
  const setsetDelay = (nowIndex) => {
    const {
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    if (pluginOptions?.dispositionList[nowIndex]?.canCarousel === true) {
      console.log(pluginOptions?.dispositionList[nowIndex]?.carouselTime,nowIndex,pluginOptions?.dispositionList[nowIndex]?.carouselTime*1000);
      setDelay(pluginOptions?.dispositionList[nowIndex]?.carouselTime*1000);
    } else {
      setDelay(undefined);
    }
  };
  //获取目标在数组中的索引
  const getTargetIndex = (target, data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === target) return i;
    }
  };

  // //处理配置更新
  // const handleOptionsChange = (pluginOptions) => {
  //   const {
  //     bigscreen: { updateBlockById, pluginDetailMap },
  //     block: {
  //       baseConfig: { id }
  //     }
  //   } = props;
  //   const containerId = pluginOptions.containerId;
  //   if (pluginOptions.containerId) {
  //     updateBlockById(containerId, {
  //       dataConfig: {
  //         configs: [
  //           {
  //             name: "网页",
  //             type: 0,
  //             value: pluginOptions.tabLink1
  //           }
  //         ],
  //         defaultValue: null,
  //         defaultType: 3
  //       }
  //     });
  //   }
  //   updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
  //   //调用加载器的run方法强制更新
  //   pluginDetailMap[`${id}-default`].detail.ref.current.run();
  // };

  //定时器设置容器内容
  const setContainerContent = (flag = false, nIndex) => {
    const {
      bigscreen: { updateBlockById },
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    if (pluginOptions?.dispositionList[initFormRef.current]?.containerId) {
      updateBlockById(pluginOptions.dispositionList[initFormRef.current]?.containerId, {
        dataConfig: {
          configs: [
            {
              name: "网页",
              type: 0,
              value: pluginOptions.dispositionList[initFormRef.current]?.[`tabLink${flag ? 1 : (nIndex ?? currentIndex) + 1}`],
            },
          ],
          defaultValue: null,
          defaultType: 3,
        },
      });
    }
  };
  // //处理需要的变量
  // const handleConfiguration = () => {
  //   const { block } = props;
  //   const { dataConfig } = block;
  //   const { pluginOptions = {} } = dataConfig;
  //   return pluginOptions;
  // };

  //加载通用数据
  const initComData = (nowIndex) => {
    const {
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    if (pluginOptions?.dispositionList[nowIndex]?.iconSize) {
      setIconSize(pluginOptions.dispositionList[nowIndex]?.iconSize);
    }
    if (pluginOptions?.dispositionList[nowIndex]?.nameSize) {
      setNameSize(pluginOptions.dispositionList[nowIndex]?.nameSize);
    }
    if (pluginOptions?.dispositionList[nowIndex]?.nameColor) {
      setNameColor(pluginOptions.dispositionList[nowIndex]?.nameColor);
    }
  };
  const getNowTheme = () => {};
  //获取页签名称数组
  const handleItemName = (nowIndex) => {
    const {
      block: { dataConfig },
    } = props;
    let res = dataConfig?.pluginOptions?.dispositionList[nowIndex]?.tabnames
      ? dataConfig?.pluginOptions?.dispositionList[nowIndex]?.tabnames.split(" ")
      : ["项目一", "项目二", "项目三"];
    setItemNames(res);
    return res;
  };
  //获取图标数组
  const handleItemIcons = (nowIndex) => {
    const {
      block: {
        dataConfig: { pluginOptions = {} },
      },
    } = props;
    let res = iconItems;
    for (let i = 0; i < ITEMNUM; i++) {
      if (pluginOptions.dispositionList[nowIndex]?.[`tabIcon${i + 1}`]) {
        res[i] = pluginOptions.dispositionList[nowIndex]?.[`tabIcon${i + 1}`];
      }
    }
    setIconItems(res);
    return res;
  };

  //遍历获取blocks中的所有组件id，去除window.pluginTimer中多余的组件定时器
  const checkBlockIdTimer = () => {
    const {
      bigscreen: { blocks },
    } = props;
    //获取所有组件ID的数组
    let exitIds = blocks.map((item) => item.baseConfig.id);
    //获取window.pluginTimer对应的所有键
    if (window?.pluginTimer) {
      //获取所有已注册的组件id
      let Ids = Array.from(window.pluginTimer.keys());
      for (let i of Ids) {
        if (exitIds.findIndex((item) => item === i) === -1) {
          const fn = window.pluginTimer.get(i);
          fn();
          window.pluginTimer.delete(i);
        }
      }
    }
  };

  //清除全局定时器数组
  const clearTimerArr = (target) => {
    if (window?.pluginTimer?.length) {
      let index = getTargetIndex(target, window.pluginTimer);
      window.pluginTimer.splice(index, 1);
    }
  };

  // const tabRender = () => {
  //   const { type } = props;
  //   const Comp = renderHashMap[type];
  //   if (Comp) {
  //     const options = {
  //       changeConfiguration: handleOptionsChange,
  //       configuration: handleConfiguration(),
  //       ...props
  //     };
  //     return (<Comp {...options}></Comp>);
  //   } else {
  //     return (
  //       <div style={{ width: '100%', height: '100%' }}>
  //         <Tabs
  //           className="plugin"
  //           style={{ width: '100%', height: '100%' }}
  //           onTabClick={handleTabChange}
  //           activeKey={activeKey}
  //           tabPosition="left"
  //           // destroyInactiveTabPane={true}
  //           items={StaticData.map((_, index) => {
  //             return {
  //               label: (
  //                 <div>
  //                   <div>
  //                     <img style={{ width: iconSize, height: iconSize }} src={iconItems[index]}></img>
  //                   </div>
  //                   <span style={{ color: nameColor, fontSize: nameSize, textShadow: 'none' }}>
  //                     {itemNames[index]}
  //                   </span>
  //                 </div>
  //               ),
  //               key: itemNames[index],
  //               children: (<></>),
  //               // forceRender: true
  //             };
  //           })}>
  //         </Tabs>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Tabs
        className="plugin"
        style={{ width: "100%", height: "100%" }}
        onTabClick={handleTabChange}
        activeKey={activeKey}
        tabPosition="left"
        // destroyInactiveTabPane={true}
        items={StaticData.map((_, index) => {
          return {
            label: (
              <div>
                <div>
                  <img style={{ width: iconSize, height: iconSize }} src={iconItems[index]}></img>
                </div>
                <span style={{ color: nameColor, fontSize: nameSize, textShadow: "none" }}>{itemNames[index]}</span>
              </div>
            ),
            key: itemNames[index],
            children: <></>,
            // forceRender: true
          };
        })}
      ></Tabs>
    </div>
  );
};

export default DefaultRender;
