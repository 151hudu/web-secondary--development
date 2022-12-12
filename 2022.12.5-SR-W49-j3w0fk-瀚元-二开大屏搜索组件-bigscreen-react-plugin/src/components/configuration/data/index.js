import React, { useCallback } from "react";
import { isEqual } from "lodash";

function DataConfiguration(props) {
  const { changeConfiguration, configuration } = props;
  const handleSubmit = useCallback(() => {
    console.log("配置页", props);
    const newOptions = {};
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  });

  return <div>DataConfiguration</div>;
}

DataConfiguration.propTypes = {};

export default DataConfiguration;
