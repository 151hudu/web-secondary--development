import React, { useState } from "react"
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

const Development = () => {
  const [customConfig, setCustomConfig] = useState(mockCustomConfig)
  let [mainKey, setMainKey] = useState(Utils.generateUUID)
  const changeCustomConfig = (customConfig) => {
    setCustomConfig(customConfig)
    setMainKey(Utils.generateUUID())
    mockChangeCustomConfig(customConfig)
  }
  let props = {
    customConfig,
    sysVariables,
    appVariables,
    intlGetKey,
    themeInfo,
    history
  }
  return (
    <div id="development">
      <div id="main">
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
