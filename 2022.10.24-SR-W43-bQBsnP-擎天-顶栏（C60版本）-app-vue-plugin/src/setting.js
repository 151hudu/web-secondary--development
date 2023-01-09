import React, { useState } from "react";
import { Row, Col, message } from "antd";
import { Upload } from "src/components/Upload";
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import "./setting.css";

const { Dragger } = Upload;
const accept = "image/png, image/jpeg, image/jpg";
const baseURL = `${process.env.REACT_APP_API}/sdata/rest`;

const Setting = (props) => {
  const { funcRef, onConfigChange } = props;
  const [customConfig, setCustomConfig] = useState(props.customConfig || {});
  const [tabIcon1, setTabIcon1] = useState(props.customConfig.bannerSrc || "");

  //上传图片之前进行验证
  const beforeUpload = file => {
    let name = file.name;
    let suffix = name.substring(name.lastIndexOf('.') + 1);
    return new Promise((resolve, reject) => {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type) || suffix === 'jfif') {
        message.error('请选择png、jpg、jpeg图片');
        reject(file);
      } else {
        resolve(file);
      }
    });
  };
  
  //上传图片之后
  const onUploadFinished = ( { file} ) => {
    const { status, response } = file;
    if (status === 'done') {
      const { result } = response;
      setTabIcon1(result);
      let config = { ...customConfig };
      config.bannerSrc = result;
      onConfigChange && onConfigChange(config);
    } else if (status === 'error') {
      message.error('上传出错，请重试');
    }
  };

  //处理删除图片
  const handleDeleteIcon = () => {
    setTabIcon1('');
  };

  return (
    <>
      <Row>
        <Col span={24} className="rowtitle">顶栏背景图</Col>
        <div className="upload-picture">
          <Dragger
            accept={accept}
            action={`${baseURL}/image/uploadPic?category=4`}
            onChange={e => onUploadFinished(e)}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <div className="upload-wrapper">
              <div className="ant-upload-drag-icon">
                {tabIcon1 ? (
                  <img src={tabIcon1} className="backgroundImg" />
                ) : (
                  <InboxOutlined />
                )}
              </div>
              {
                tabIcon1 && (
                  <span className="plugin_deleteIcon">
                    <DeleteOutlined className="removeIcon" onClick={() => handleDeleteIcon()} />
                  </span>
                )
              }
              {
                !tabIcon1 && (
                  <div className="ant-upload-text">上传图片</div>
                )
              }
            </div>
          </Dragger>
        </div>
      </Row>
    </>
  );
};

export default Setting;
