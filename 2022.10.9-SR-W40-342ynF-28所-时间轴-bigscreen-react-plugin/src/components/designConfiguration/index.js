import React, { useEffect } from "react";
import { Form, Input, Switch, Radio, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
function Configuration({ changeConfiguration, configuration }) {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(configuration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    changeConfiguration({ ...configuration, ...allValues });
  };

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="控件大小" name="size" de>
          <Radio.Group>
            <Radio.Button value="small">小</Radio.Button>
            <Radio.Button value="middle">中 </Radio.Button>
            <Radio.Button value="large">大</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="占位符" name="placeholder">
          <Input />
        </Form.Item>
        <Form.Item
          label="显示工具条"
          name="showToolbar"
          valuePropName="checked"
        >
          <Switch></Switch>
        </Form.Item>
        <Form.Item
          label="应用传入的图表标题"
          name="applyTitleOption"
          valuePropName="checked"
        >
          <Switch></Switch>
        </Form.Item>
      </Form>
    </>
  );
};

Configuration.propTypes = {};

export default Configuration;
