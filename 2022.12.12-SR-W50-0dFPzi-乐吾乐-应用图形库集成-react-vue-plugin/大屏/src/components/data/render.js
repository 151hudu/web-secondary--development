/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { observer } from "mobx-react-lite";
import {toJS} from 'mobx'

function DataConfiguration(props) {
  const { bigscreen = {}, block } = props;
  console.log('props: ', props);
  const { dataConfig = {}, baseConfig = {} } = toJS(block);
  // console.log('block: ', block);
  const { id } = baseConfig;
  const { publicUrl, viewId } = toJS(dataConfig);
  const { updateBlockById } = toJS(bigscreen);
  return (

    <div>
       {/* <div className="row-title">资源路径</div>
      <Input
        className="style-input black-input"
        value={publicUrl}
        onChange={(e) => {

          updateBlockById &&
            updateBlockById(id, { dataConfig: { publicUrl: e.target.value } });
        }}
      /> */}
      <div className="row-title">预览ID</div>
      <Input
        className="style-input black-input"
        value={viewId}
        onChange={(e) => {
          updateBlockById &&
            updateBlockById(id, { dataConfig: { viewId: e.target.value } });
        }}
      />
    </div>
  );
}

DataConfiguration.propTypes = {};

export default observer(DataConfiguration);
