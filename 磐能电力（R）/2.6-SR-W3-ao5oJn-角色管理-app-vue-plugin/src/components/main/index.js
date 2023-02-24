import React, {
  useEffect,
  useState
} from "react"
import EventActionDefinitions from "./eventActionDefinitions.js"
import useDelegator from "../../utils/UseDelegator.js"
import Utils from "../../utils/index.js"
import RoleTable from './index_2'
import './index.less';
import './tree_mutiple.css';
const Main = (props) => {
  const [number, setNumber] = useState(1)
  const customConfig = props?.customConfig
  const info = props?.info
  const appVariables = props?.appVariables
  const intlGetKey = props?.intlGetKey
  const history = props?.history
  const sysVariables = props?.sysVariables
  const initComData = () => {
    customConfig.number && setNumber(customConfig.number)
  }
  const Event_Center_getName = () => {
    const requirementNumber = process.env.CUSTOM_PLUGIN_REQUIREMENTNUM
    return customConfig.id || requirementNumber || Utils.generateUUID()
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
  useEffect(() => {
    initComData()
    let heiht = document.querySelector('.develop_role')
    if (heiht.parentNode) heiht.parentNode.style.height = '100%'
  }, [])
  useDelegator(props.customConfig.componentId, { Event_Center_getName, ...actionFunDefinitions }, EventActionDefinitions)
  return (
    <>
      <div className="app-secondary   develop_role">
        {/*以下为样例，正式开发请去除相关代码*/}
        {/* {number}
        <button onClick={handleClick}>测试逻辑控制</button> */}
        <RoleTable intlGetKey={intlGetKey} history={history} />
      </div>

    </>
  )
}

export default Main
