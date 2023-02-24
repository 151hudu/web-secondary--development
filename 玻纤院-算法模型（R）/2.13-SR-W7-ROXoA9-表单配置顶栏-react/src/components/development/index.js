import React, {
  useEffect,
  useRef,
  useState
} from "react"
import "./development.less"
import {
  DesignConfiguration,
  Main
} from "../index.js"
import Options from "./options.js"
import {
  mockCustomConfig,
  mockChangeCustomConfig,
  sysVariables,
  appVariables,
  intlGetKey,
  themeInfo,
  history
} from "./mockData.js"
import Utils from "../../utils"
import setAttributes from "../../utils/handlePlatform/setAttributes.js"

const Development = () => {
  const [customConfig, setCustomConfig] = useState(mockCustomConfig)
  let [mainKey, setMainKey] = useState(Utils.generateUUID)
  let props = {
    customConfig,
    sysVariables,
    appVariables,
    intlGetKey,
    themeInfo,
    history
  }
  const main = useRef()
  useEffect(() => {
    setAttributes(main.current, props)
  }, [])
  const changeCustomConfig = (customConfig) => {
    setCustomConfig(customConfig)
    setMainKey(Utils.tools.generateUUID())
    setAttributes(main.current, {...props,customConfig})
    mockChangeCustomConfig(customConfig)
  }
  return (
    <div id="development">
      <div className="main" ref={main}>
        <Main {...props} key={mainKey} />
      </div>
      <div id="configuration">
        <Options
          options={customConfig}
          changeOptions={changeCustomConfig}
        />
        <DesignConfiguration
          customConfig={customConfig}
          changeCustomConfig={changeCustomConfig}
        />
      </div>
    </div>
  )
}


Development.propTypes = {}

export default Development
