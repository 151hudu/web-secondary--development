import React, { useState } from "react";
import "./development.less";
import {
  DesignConfiguration,
  Main
} from "../index.js";
import {
  Carousel
} from "antd";
import Options from "./options.js";
import {
  dataSource,
  mockCustomConfig,
  mockOptions,
  mockChangeOptions,
  mockChangeCustomConfig
} from "./mockData.js";
import { cloneDeep } from "lodash";
import Utils from "../../utils";
import { mainInit } from "../../App.js";

const renderMap = [Main, DesignConfiguration];

const Development = () => {
  const [options, setOptions] = useState(mockOptions);
  const [customConfig, setCustomConfig] = useState(mockCustomConfig);
  const changeOptions = () => {
    setOptions(cloneDeep(options));
    mockChangeOptions(options);
  };
  const changeCustomConfig = () => {
    setCustomConfig(cloneDeep(customConfig));
    mockChangeCustomConfig(customConfig);
  };
  return (
    <div id="development">
      <Carousel>
        {
          renderMap.map((item, index) => {
            let props;
            if (item == DesignConfiguration) {
              props = {
                customConfig,
                dataSource,
                changeCustomConfig
              };
            } else {
              props = {
                customConfig,
                dataSource,
                options,
                mainInit
              };
            }
            let Comp = item;
            return (
              <div key={index} className="carousel-item">
                {(item == DesignConfiguration) ?
                 (<>
                   <Options
                     options={options}
                     setOptions={setOptions}
                     changeOptions={changeOptions}
                   />
                   <Comp {...props} />
                 </>) :
                 (<Comp {...props} key={Utils.generateUUID()} />)}
              </div>);
          })
        }
      </Carousel>
    </div>
  );
};


Development.propTypes = {};

export default Development;
