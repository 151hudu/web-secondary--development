import React from "react";
import {
  DesignConfiguration,
  Main
} from "./components";

const App = ({ isConfig, ...props }) => {
  if (isConfig) {
    props.changeCustomConfig = props.onConfigChange;
    return <DesignConfiguration {...props} />;
  } else {
    return <Main {...props} />;
  }
};
App.propTypes = {};

export default App;
