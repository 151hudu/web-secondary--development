import React, { useEffect, useState, useCallback } from "react";
import { Input, Select, Row, Col } from "antd";
import { getAssetData } from "../../api/asset";
import { isEqual } from 'lodash';
const { Option } = Select;
const DesignConfiguration = (props) => {
  const { changeConfiguration, configuration } = props;
  const [columns, setColumns] = useState(configuration?.columns || []);
  const [assetId, setAssetId] = useState(configuration?.assetId || '825165b5-c0a4-46e3-a0c1-1c9de7fdb43b');
  const [selectKey, setSelectKey] = useState(configuration?.selectKey || '');
  const [fontColorConfig, setFontColorConfig] = useState(configuration?.fontColorConfig || '');
  const [fontSizeConfig, setFontSizeConfig] = useState(configuration?.fontSizeConfig || '');
  const [lineHeightConfig, setLineHeight] = useState(configuration?.lineHeightConfig || '');
  const [fontFamilyConfig, setFontFamilyConfig] = useState(configuration?.fontFamilyConfig || '');

  // useEffect(() => {}, []);

  const handleSubmit = useCallback(() => {
    console.log('配置页', props);
    const newOptions = {
      selectKey,
      fontColorConfig,
      fontSizeConfig,
      lineHeightConfig,
      fontFamilyConfig,
      // assetId
    };
    if (!isEqual(newOptions, configuration)) {
      changeConfiguration({ ...configuration, ...newOptions });
    }
  },);

  //处理资产id输入
  const handleAssetId = async (e) => {
    setAssetId(e.target.value);
    let { data } = await getAssetData(e.target.value)
    let lists = []
    lists = data[0].map(x=>{
      return x.col_name
    });
    console.log('lists', lists);
    setColumns(lists)
  };

  //处理selectKey输入
  const handleNameInput = value => {
    setSelectKey(value);
  };

  //处理颜色
  const handleColor = e => {
    setFontColorConfig(e.target.value);
  };

  //处理文字大小
  const handleNameSize = e => {
    setFontSizeConfig(e.target.value);
  };

  //处理文字行高
  const handleIconSize = e => {
    setLineHeight(e.target.value);
  };

  //处理字体
  const handleIconFam = e => {
    setFontFamilyConfig(e.target.value);
  };

  return (
    <div>
      {/* <Row>
        <Col span={24} className="rowtitle">资产id</Col>
        <Input value={assetId} onBlur={handleAssetId} />
      </Row> */}
      <Row>
        <Col span={24} className="rowtitle">选择解析字段</Col>
        {/* <Input value={selectKey} onChange={handleNameInput} />*/}
        <Select
          style={{
            width: '100%'
          }}
          defaultValue={selectKey}
          onChange={handleNameInput}
        >
          {
            columns.map((x,i)=>{
              return <Option key={i} value={x}>{x}</Option>
            })
          }
        </Select>
      </Row>
      <Row>
        <Col span={24} className="rowtitle">文字颜色</Col>
        <Input value={fontColorConfig} onChange={handleColor} />
      </Row>
      <Row>
        <Col span={24} className="rowtitle">文字大小</Col>
        <Input value={fontSizeConfig} onChange={handleNameSize} />
      </Row>
      <Row>
        <Col span={24} className="rowtitle">行高</Col>
        <Input value={lineHeightConfig} onChange={handleIconSize} />
      </Row>
      <Row>
        <Col span={24} className="rowtitle">字体</Col>
        <Input value={fontFamilyConfig} onChange={handleIconFam} />
      </Row>
      <Row>
        <div className="detail-btn" onClick={handleSubmit}>
          执行
        </div>
      </Row>
    </div>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
