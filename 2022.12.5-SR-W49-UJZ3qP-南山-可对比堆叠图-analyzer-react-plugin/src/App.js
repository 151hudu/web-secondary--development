import React from "react";
import {
  DesignConfiguration,
  Main
} from "./components";
import './app.less'
const renderHashMap = {
  main: Main,
  designConfiguration: DesignConfiguration
};
const App = ({ type, ...props }) => {
  type = type || "main";
  if (type === "designConfiguration") {
    !props.configuration.analyzer_secondary_configuration && (props.configuration.analyzer_secondary_configuration = {});
    props.customConfig = props.configuration.analyzer_secondary_configuration;
    props.changeCustomConfig = (customConfig) => {
      props.configuration.analyzer_secondary_configuration = customConfig;
      props.changeConfiguration(props.configuration);
    };
  } else {
    !props.options.analyzer_secondary_configuration && (props.options.analyzer_secondary_configuration = {});
    props.customConfig = props.options.analyzer_secondary_configuration;
  }
  let Comp = () => <div sytle={{ height: '100%' }}></div>;
  if (renderHashMap[type]) Comp = renderHashMap[type];
  return <Comp style={{ height: '100%' }}  {...props} />;
};
App.propTypes = {};

export default App;
