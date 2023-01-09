import React, { useEffect } from "react";
import { Form, InputNumber, Input } from "antd";

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
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="宽度：" name="width" initialValue={520}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="高度：" name="height" initialValue={640}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="校验资产ID：" name="checkAssetsId">
          <Input />
        </Form.Item>
        <Form.Item label="校验变量名：" name="checkKey">
          <Input />
        </Form.Item>
        <Form.Item label="详情页路由：" name="infoUrl">
          <Input />
        </Form.Item>
        <Form.Item label="详情页路由主键变量名：" name="dataId">
          <Input />
        </Form.Item>
        <Form.Item label="资产主键变量名：" name="dataIdKey">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
