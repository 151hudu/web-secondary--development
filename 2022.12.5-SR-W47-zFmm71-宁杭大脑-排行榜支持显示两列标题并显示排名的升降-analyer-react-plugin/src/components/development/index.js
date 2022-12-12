import React from "react";
import "./development.less";
import {
  DesignConfiguration,
  Main
} from "../index.js";
import { Carousel } from "antd";

const renderMap = [Main, DesignConfiguration];
const Development = () => {
  return (
    <div id="development">
      <Carousel>
        {renderMap.map((item, index) => {
          let Comp = item;
          return (
            <div key={index}>
              <Comp
              />
            </div>);
        })}
      </Carousel>
    </div>
  );
};
Development.propTypes = {};

export default Development;
