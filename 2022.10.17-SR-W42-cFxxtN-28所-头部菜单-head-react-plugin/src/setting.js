import React, { useState, useEffect } from "react";
import { Input, Select, message, } from "antd";
// import SdataIcon from "./SdataIcon";
import "./app.less";
import { userQuery, getCode } from "./api/asset";
const { Option } = Select;


// const options = [
//   { key: "appPage", value: "appPage", label: "页面" },
//   { key: "data-form-design", value: "data-form-design", label: "表单" },
//   { key: "data-form-detail", value: "data-form-detail", label: "详情" },
//   { key: "data-form-list", value: "data-form-list", label: "列表" },
// ];
// let btnPos = 0;
// const { currentUser = {} } = window

const Setting = (props) => {
  const { funcRef, onConfigChange } = props;



  const [customConfig, setCustomConfig] = useState(props.customConfig || {});
  const { buttons = [] } = customConfig;
  const [currentUser, setCurrentUser] = useState({})

  const [buttonsP, setButtonP] = useState(buttons)
  useEffect(() => {
    async function mounted(params) {

      try {
        let { data } = await userHanfler()
        console.log("props: ", data, props);
        setCurrentUser(data)
      } catch (error) {
        setCurrentUser({})
      }
    }
    mounted()
  }, [])
  //   const changeName = (e) => {
  //     let config = { ...customConfig };
  //     if (e.target.value) {
  //       config.subTitle = e.target.value;
  //       setCustomConfig(config);
  //       onConfigChange && onConfigChange(config);
  //     } else {
  //       message.warn("按钮名称不能为空");
  //     }
  //   };

  const onAddBtn = () => {

    let config = { ...customConfig };

    config.buttons = [...buttons, {}];
    setCustomConfig(config);
    setButtonP(config.buttons)
    onConfigChange && onConfigChange(config);
  };

  const userHanfler = async () => {
    let res = await userQuery()
    return res
  }


  const onDeleteBtn = (pos) => {
    let config = { ...customConfig };
    let temp = [...buttons];
    temp.splice(pos, 1);
    config.buttons = temp;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  };

  //   const changeBtnType = (e, pos) => {
  //     let config = { ...customConfig };
  //     let temp = [...buttons];
  //     temp[pos].type = e;
  //     temp[pos].linkedInfo = undefined;
  //     config.buttons = temp;
  //     setCustomConfig(config);
  //     onConfigChange && onConfigChange(config);
  //   };
  const onChangeUrl = (e, pos) => {
    let config = { ...customConfig };
    let temp = [...buttons];
    temp[pos].url = e.target.value;
    config.buttons = temp;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  };

  const changeBtnName = (e, pos) => {

    let config = { ...customConfig };
    let temp = [...buttons];
    temp[pos].name = e.target.value;
    config.buttons = temp;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  };
  // 参数添加
  const onAddBtnParams = (e, i) => {

    let buttons = JSON.parse(JSON.stringify(buttonsP))
    buttons[i].params = buttons[i].params || []
    buttons[i].params.push({})

    setButtonP(buttons)
    let config = { ...customConfig };
    config.buttons = buttons;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  }
  //参数删除
  const onDeleteBtnParams = (i, childI) => {
    let buttons = JSON.parse(JSON.stringify(buttonsP))
    buttons[i].params.splice(childI, 1)

    setButtonP(buttons)
    let config = { ...customConfig };


    config.buttons = buttons;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  }
  const changeBtnNameParam = (e, i, childI) => {

    let buttons = JSON.parse(JSON.stringify(buttonsP))
    buttons[i].params[childI].key = e.target.value
    setButtonP(buttons)
    let config = { ...customConfig };


    config.buttons = buttons;
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
  }


  const handleChange = (e, i, childI) => {
    let buttons = JSON.parse(JSON.stringify(buttonsP))
    buttons[i].params[childI].value = e
    setButtonP(buttons)
    let config = { ...customConfig };


    config.buttons = buttons;
    console.log(e, i, childI, '================值');
    setCustomConfig(config);
    onConfigChange && onConfigChange(config);
    console.log(`selected ${e}`, buttons);
  }
  //   const changeBtnIcon = (icon) => {
  //     let config = { ...customConfig };
  //     let temp = [...buttons];
  //     temp[btnPos].icon = icon;
  //     config.buttons = temp;
  //     setCustomConfig(config);
  //     onConfigChange && onConfigChange(config);
  //   };

  //   const changeBtnTarget = (linkedInfo) => {
  //     let config = { ...customConfig };
  //     let temp = [...buttons];
  //     temp[btnPos].linkedInfo = linkedInfo;
  //     config.buttons = temp;
  //     setCustomConfig(config);
  //     onConfigChange && onConfigChange(config);
  //   };

  //   const onChooseIcon = (pos) => {
  //     btnPos = pos;
  //     funcRef?.showIconModal && funcRef.showIconModal(changeBtnIcon);
  //   };

  //   const onChoosePage = (btn, pos) => {
  //     btnPos = pos;
  //     funcRef?.showLinkedModal &&
  //       funcRef.showLinkedModal(
  //         {
  //           selectType: btn.type === "appPage" ? btn.type : undefined,
  //           listType: btn.type !== "appPage" ? [btn.type] : undefined,
  //         },
  //         changeBtnTarget
  //       );
  //   };

  return (
    <>
      {/* <div className="custom-config-title">副标题</div>
      <div className="custom-config-line">
        <Input
          style={{ with: "100%" }}
          placeholder={"副标题"}
          defaultValue={subTitle}
          onChange={changeName}
        />
      </div> */}
      <div className="custom-config-title-H">
        <span>右侧按钮</span>
        <span className="add" onClick={onAddBtn}>
          +
        </span>
      </div>
      <div className="button-line">
        <div className="type">名称</div>
        <div className="target">URL</div>
        <div className="delete" />
      </div>
      {buttons.map((btn, i) => {
        let { name, url, params = [] } = btn;
        return (<div key={i}>
          <div key={i} className="button-line">

            <div className="name">
              <Input
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => changeBtnName(e, i)}
              />
            </div>
            <div className="url" style={{ paddingLeft: 8 }}>
              <Input
                style={{ width: "100%" }}
                value={url}
                onChange={(e) => onChangeUrl(e, i)}
              />
            </div>
            <div className="delete" onClick={() => onDeleteBtn(i)}>
              -
            </div>


          </div>
          <div className="custom-config-params-H">
            <span>参数</span>
            <span className="add" onClick={(e) => { onAddBtnParams(e, i) }}>
              +
            </span>
          </div>
          {params.map((btn, iparams) => {
            let { key, value } = btn;
            return (
              <div key={iparams} className="button-line-params">

                <div className="name">
                  <Input
                    style={{ width: "100%", minWidth: '50px' }}
                    value={key}
                    onChange={(e) => changeBtnNameParam(e, i, iparams)}
                  />
                </div>
                <div className="url" style={{ paddingLeft: 8 }}>

                  <Select
                    placeholder='请选择一个选项'
                    defaultValue={value}
                    style={{
                      width: "100%",
                    }}
                    onChange={(e) => { handleChange(e, i, iparams) }}
                  >
                    <Option key='id' value='id'   >用户ID</Option>
                    <Option key='loginName' value='loginName'  >用户登录账号</Option>

                    <Option key='ssocode' value='ssocode' >用户ssocode</Option>
                  </Select>
                </div>
                <div className="delete" onClick={() => onDeleteBtnParams(i, iparams)}>
                  -
                </div>


              </div>

            );
          })}
        </div>

        );
      })}
    </>
  );
};

export default Setting;
