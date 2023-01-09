import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration(allValues);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Form {...formItemLayout} form={form} onValuesChange={onFormLayoutChange}>
        {/* 跳转所需参数 */}
        <Form.Item label="参数字段" name="params">
          <Input />
        </Form.Item>
        {/* 跳转地址 */}
        <Form.Item label="跳转地址" name="jumpUrl">
          <Input />
        </Form.Item>
        <Form.Item label="资产Id" name="assetId">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
