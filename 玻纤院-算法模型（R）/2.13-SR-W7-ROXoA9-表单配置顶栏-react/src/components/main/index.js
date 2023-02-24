import React, {
  useEffect,
  useState
} from "react"
import { Col, Popover, Row, Input, Button } from 'antd';
import Icon, { EditOutlined, AudioOutlined, SearchOutlined } from '@ant-design/icons';
import EventActionDefinitions from "./eventActionDefinitions.js"
import useDelegator from "../../utils/handlePlatform/UseDelegator.js"
import Utils from "../../utils/index.js"
import './index.less'
const { Search } = Input;
const tempFunction = {
  handleDesignSave: () => { },//保存配置页面方法
  changeFormName: () => { }, //修改表单名称放啊
  close: window.close,//关闭配置页面方法
  getDesignValues: () => { },//获取表单全量配置数据
  modelFieldInsertAll: () => { }//一键插入
}
const insert_name = ['输入', '选择', '上传', '布局', '表格', '系统', '地理信息', '高级', '自定义组件',]
const Main = (props) => {
  const [number, setNumber] = useState(1)
  const [editName, setEditName] = useState(false)
  const [formName, setformName] = useState('表单页面')
  const customConfig = props?.customConfig
  const initComData = () => {
    customConfig.number && setNumber(customConfig.number)
  }
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CONFIG_JSON_REQUIREMENTNUM
    return customConfig.id || requirementNumber || Utils.tools.generateUUID()
  }

  const do_EventCenter_message = ({ value }) => {
    alert(value)
  }
  const actionFunDefinitions = {
    do_EventCenter_message
  }
  /**
   * 用于触发事件的方法，window.eventCenter?.triggerEvent封装了一层，
   * @param {String} eventName 事件名
   * @param {Object} payload 事件传参
   * @example triggerEvent("click",{value:"123"})
   *
   */
  const triggerEvent = (eventName, payload) => {
    const componentId = props.componentId || props?.customConfig.componentId
    componentId && window.eventCenter?.triggerEvent(
      componentId,
      eventName,
      payload
    )
  }

  const handleClick = () => {
    triggerEvent("click", { value: "123" })
  }
  //失焦事件
  const handleEditName = (e) => {
    tempFunction.changeFormName(formName)
    setEditName(false)
  }
  //搜索事件
  const onSearch = (value) => console.log(value)
  //保存方法
  const handleSaveConfiguration = () => {
    tempFunction.handleDesignSave(tempFunction.getDesignValues())
  }
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  )
  useEffect(() => {
    initComData()
  }, [])
  useDelegator(props.customConfig.componentId, { Event_Center_getName, ...actionFunDefinitions }, EventActionDefinitions)
  return (
    <>
      <div className="app-secondary">
        {/*以下为样例，正式开发请去除相关代码*/}
        <div className='two_reporting_top' >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <div ></div>
            </Col>
            <Col className="gutter-row" span={8}>
              {
                editName ?
                  <div className="edit_name" > <input id='formName' autofocus="autofocus" onBlur={(e) => { handleEditName(e) }} onChange={(e) => { setformName(e.target.value) }} value={formName}></input>  <EditOutlined /></div> :
                  <div className="not_edit" onClick={() => { setEditName(true); window.setTimeout("document.getElementById('formName').focus();", 200); }} > <span className="hover_span">{formName}</span>  <EditOutlined /></div>
              }

            </Col>
            <Col className="gutter-row" span={8}>
              <div className="tool_overview" >
                <Input
                  className="two_input"
                  style={{ width: '200px' }}
                  placeholder=""
                  suffix={
                    <SearchOutlined />
                  }
                />
                <span>  </span>
                <Button className='close two_button' >关闭</Button>
                <span>  </span>
                <Button onClick={() => { handleSaveConfiguration() }} className='save_button two_button' type="primary">保存</Button>
              </div>
            </Col>
          </Row>
          <div className="insert_menu" >
            {
              insert_name.map((item, i) => {
                return <Popover content={content} title="Title" trigger="click">
                  <Button>{item}</Button>
                </Popover>
              })
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default Main
