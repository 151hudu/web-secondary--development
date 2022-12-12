import React from "react";
import "./development.css";
import {
  DesignConfiguration,
  Main
} from "../index.js";
import { dataSource, options } from './mockData'
import { Carousel } from "antd";

const renderMap = [Main, DesignConfiguration];
const Development = () => {
  return (
    <div style={{ height: '100%' }}>
      <Carousel style={{ height: '100%' }}>
        {renderMap.map((item, index) => {
          let Comp = item;
          return (
            <div key={index} style={{ height: '100%' }}  >
              <Comp dataSource={dataSource} options={options}
              />
            </div>);
        })}
      </Carousel>
    </div>
  );
};
Development.propTypes = {};

export default Development;
