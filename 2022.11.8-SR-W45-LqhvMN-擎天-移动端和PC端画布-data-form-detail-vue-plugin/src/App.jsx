import React, {useState} from "react";
import PropTypes from "prop-types";

import detail from "./components/detail";
import DesignConfiguration from "./components/designConfiguration";

const renderHashMap = {
  detail: detail,
  designConfiguration: DesignConfiguration,
};

const App = ({ type, ...props }) => {
  let Comp = () => <></>;
  const {
  isDesign,
  pluginId,
  setSetPluginProps, ...restProps} = props;
  if (renderHashMap[type]) Comp = renderHashMap[type];
  return <Comp {...props} />;
};

App.propTypes = {
  type: PropTypes.string,
};

export default App;
