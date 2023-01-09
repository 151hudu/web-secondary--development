import React, { useEffect } from "react";
import { Form, Select, Input, Button, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const NAME_OBJ = {
  "TSFCC.PRIMARY_KEY": "主键",
  "TSFCC.FOREIGN_KEY": "外键",
  "TSFCC.DEPARTMENT": "部门",
  "TSFCC.LMB": "最后修改人",
  "TSFCC.LMT": "最后修改时间",
  "TSFCC.CREATION_TIME": "创建时间",
  "TSFCC.CREATOR": "创建人",
  "TSFCC.LMIA": "最后修改人IP地址",
  "TSFCC.CIA": "创建人IP地址",
  "TSFCC.CMDEPARTMENT": "创建人部门",
};

const DesignConfiguration = (props) => {
  const { changeConfiguration, configuration, componentList = [] } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      const parsedConfiguration = JSON.parse(configuration);
      form.setFieldsValue(parsedConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  return (
    <>
      <Form {...formItemLayout} labelAlign="left" form={form} onValuesChange={onFormLayoutChange}>
        <Form.Item label="文件名">
          <div style={{ display: "flex" }}>
            <Form.Item noStyle name="componentId">
              <Select style={{ width: 200 }} placeholder="请选择组件">
                {componentList.map((component = {}) => {
                  const { title, id } = component;
                  return <Option value={id}>{NAME_OBJ[title] || title}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item noStyle name="customName">
              <Input placeholder="请输入..." style={{ marginLeft: 10 }} />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item
          label="文件模板"
          name="fileTemplate"
          valuePropName="fileList"
          getValueFromEvent={(data) => {
            if (Array.isArray(data)) return data;
            return data && data.fileList;
          }}
        >
          <Upload maxCount={1} accept=".doc,.docx" action="/sdata/rest/image/upload">
            <Button icon={<UploadOutlined />}>点击上传</Button>
            <span style={{ color: "#ccc", paddingLeft: "10px" }}>.doc, .docx</span>
          </Upload>
        </Form.Item>

        <Form.Item label="列表ID" name="secondevTableId">
          <Input placeholder="请输入列表资产ID" />
        </Form.Item>

        <Form.Item label="设备仪器表ID" name="subTableEquipment">
          <Input placeholder="请输入设备仪器资产ID" />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
