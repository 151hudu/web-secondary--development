import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import Setting from "./setting";
import "./app.less";

// // 发起流程
import InitiateFlow from "./common/initiate-folw";
// // 待我处理
import PendingHandle from "./common/pending-handle";
// // 我已处理
import AlreadyHandle from "./common/already-handle";
// // 我发起的
import MyInitiated from "./common/my-initiated";
// // 抄送我的
import SendMy from "./common/send-my";

const { Sider } = Layout;

// 页面配置
const Workbench = (props) => {
   const { moduleHeight, menuCheckList } = props?.customConfig || {};

   // 菜单列表
   const [menuList, setMenuList] = useState([]);
   // 菜单选中项
   const [mentChecked, setMentChecked] = useState([]);

   // 生成菜单
   useEffect(() => {
      if (menuCheckList) {
         let menuItemList = [];
         let menuNumberList = JSON.parse(JSON.stringify(menuCheckList));
         menuNumberList = menuNumberList.sort();

         menuNumberList.forEach((item) => {
            if (item === "0") {
               menuItemList.push({
                  key: "0",
                  label: "发起流程",
                  isCheck: false,
                  checkImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAFVBMVEUAAAD///////+Bqfn///////+BqflDTEJzAAAABXRSTlMAIN/ffyKWbv8AAAA8SURBVAjXY0AGzGlpaQZAmikUzApVYGANdQDyWUIDgCwwgLIE4SwGPCwBoF5GBIugDoTJCNuYoCwFhDMBM98heTsiWnEAAAAASUVORK5CYII=",
                  unCheckedImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAFVBMVEUAAAAAAAADVPIAAAAAAAAAAAAEVPLNdGE/AAAABXRSTlMAIN/ffyKWbv8AAAA8SURBVAjXY0AGTGlpaQpAmjkUzAo1YGANdQDyWUIDgCwwgLIE4SwGPCwBoF5GBIugDoTJCNuYoSwDhDMBKa0heaHbRw4AAAAASUVORK5CYII=",
               });
            }
            if (item === "1") {
               menuItemList.push({
                  key: "1",
                  label: "待我处理",
                  isCheck: false,
                  checkImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAElBMVEUAAAD///////////////////8+Uq06AAAABXRSTlMAgCDfcEHaXoYAAAA4SURBVAjXY8AGmENBwADIYgWzAhAsEThLEIUVpKoUpIpgIWQJseC2CcKtFwRhMACxHMEMESTnAQAmRRhSrrYhAwAAAABJRU5ErkJggg==",
                  unCheckedImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAFVBMVEUAAAAIEBAICAgLDQ4DVPIMDQ4EVPII2uthAAAABXRSTlMAICDf30rY+foAAAA4SURBVAjXY8AGmENBwADIYgWzAhCsFDgrDYUVJKoYJIpgIWQJseC2pcGtTwNhMACx3MCMFCTnAQCMcCADzWjT0QAAAABJRU5ErkJggg==",
               });
            }
            if (item === "2") {
               menuItemList.push({
                  key: "2",
                  label: "我已处理",
                  isCheck: false,
                  checkImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAG1BMVEUAAAD////////////////////////////////rTT7CAAAACHRSTlMAgN8gcO+PQB4ey7gAAABQSURBVAjXY0ACGh1A0ARidYABgsXoAGY1FXUwCgBZrR3KbBCWsJKBBIQlYMzYAWE1MkhAWR2CHTBWBxoLZhuQBQUgFqMgGABZLBCWAwMWAABVGyIO3ni6xwAAAABJRU5ErkJggg==",
                  unCheckedImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAIVBMVEUAAAALDQ4MDg4ICwsDVPIMDQ4MDAwMDA4MDAwMDQ4EVPIG9ZcfAAAACXRSTlMA338g3++PgECTWmZlAAAAUklEQVQI12NAApIzgWAiiDUTDBAsLgcwa2LjTK4FQNbUmcJsEFaxoIEmhKVgzDQTwprEoAllzVSaCWPNRGPBbAOyoADE4loFBkAWC4TlwIAFAAATLzQM/qN5CQAAAABJRU5ErkJggg==",
               });
            }
            if (item === "3") {
               menuItemList.push({
                  key: "3",
                  label: "我发起的",
                  isCheck: false,
                  checkImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAG1BMVEUAAAD////////////////////////////////rTT7CAAAACHRSTlMAgN9w75AgEN53Kz4AAABLSURBVAjXY0ACGh1A0ARidYABhNUa0dHBaABiqRcBWQJAVksCmweE1czAYAFhdTRwdBDDAgIQC2YbkAUFIBajIBgAWcwQlgEDFgAAbCciQ4z0mS0AAAAASUVORK5CYII=",
                  unCheckedImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAIVBMVEUAAAALDQ4DVPIMDQ4MDA4LCw4QEBAIEBAICAgMDQ4EVPJOcfkOAAAACXRSTlMA39/vkHAQICAeNQV8AAAATElEQVQI12NAApIzgWAiiDUTDCCsKZ4zZ3IpgFhiiUDWAiBrcgO7JYQ1lYEhEsKaOYFzJjEsIACxYLYBWVAAYnGtAgMgiwnCUmDAAgDaWzOQWD/fiAAAAABJRU5ErkJggg==",
               });
            }
            if (item === "4") {
               menuItemList.push({
                  key: "4",
                  label: "抄送我的",
                  isCheck: false,
                  checkImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAJFBMVEUAAAD///////////////////////////////////////////+0CY3pAAAAC3RSTlMAgM/fn3AQIO9QQHP3vyYAAABNSURBVAjXY8AKrHcDgQGItRsENkBYO7V3bxAFszYV7d4gCJFV1wayICADJqbmDWVtSoGp2+UN17EbyILbIQi3UxBMgACYFQhiiGJ1HQBEoShfDKh3lAAAAABJRU5ErkJggg==",
                  unCheckedImg:
                     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAJ1BMVEUAAAAMDg4LDQ4LDQ4QEBADVfIIEBAMDQ4DU/ENDRAMDAwMDQ4EVPIpd9dTAAAAC3RSTlMAz9+fEN8g799QQKRr+fEAAABOSURBVAjXY8AKtHcDgQKItRsENkBYO6V3bzgKZm1M3L3hDERWTBrIggB3mJiINZS10Rmmbpc1XMduIAtuxxm4nWfABAiAWT0gxlGsrgMASnk24wkufHYAAAAASUVORK5CYII=",
               });
            }
         });
         menuItemList[0].isCheck = true;

         setMenuList(menuItemList);
         setMentChecked(menuItemList[0].key);
         //  setMentChecked("3");
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // 选中菜单
   const changeMenu = (menu) => {
      let _menuList = JSON.parse(JSON.stringify(menuList));
      _menuList.forEach((item) => {
         if (item.key === menu.key) {
            item.isCheck = true;
         } else {
            item.isCheck = false;
         }
      });

      setMenuList(_menuList);
      setMentChecked(menu.key);
   };

   return (
      <Layout className="outermost" style={{ height: moduleHeight ? moduleHeight : "100%" }}>
         {/* 左侧区域 */}
         <Sider trigger={null} collapsible collapsed={false}>
            {/* 标题 */}
            <div className="evevtflow_title">
               <div className="title_text">事件流工作台</div>
            </div>
            {/* 菜单 */}
            <Menu
               mode="inline"
               selectedKeys={mentChecked}
               items={menuList.map((item, index) => {
                  return (
                     item.key && {
                        key: item.key,
                        // label: props.intlGetKey(item.label),
                        label: item.label,
                        icon: <img src={item.isCheck ? item.checkImg : item.unCheckedImg} alt="" key={index} />,
                     }
                  );
               })}
               onSelect={(item) => {
                  changeMenu(item);
               }}
            />
         </Sider>
         {mentChecked == "0" && <InitiateFlow />}
         {mentChecked == "1" && <PendingHandle {...props} />}
         {mentChecked == "2" && <AlreadyHandle {...props} />}
         {mentChecked == "3" && <MyInitiated {...props} />}
         {mentChecked == "4" && <SendMy {...props} />}
      </Layout>
   );
};

// 配置逻辑控制
const App = (props) => {
   const { componentId } = props?.customConfig || {};

   useEffect(() => {
      // 注册事件
      const events = [];
      // 注册动作
      const actions = [];
      // 注册事件中心
      componentId &&
         window.componentCenter?.register(
            componentId,
            "comp",
            {
               Event_Center_getName: () => {
                  return "组件名称";
               },
            },
            {
               events,
               actions,
            }
         );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   if (props.isConfig) {
      return <Setting {...props} />;
   }

   return <Workbench {...props} />;
};

export default App;
