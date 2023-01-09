import React from "react";
import { Input, Form } from "antd";

const App = (props) => {
  console.log("App", props);
  const { data = {}, changeData } = props;

  const [form] = Form.useForm();

  const onChange = (e, key) => {
    console.log("onChange", e, key);
    data[key] = e.target.value;
    console.log(data);
    changeData && changeData(data);
  };

  // form表单边距
  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <Form form={form} {...formItemLayout} style={{ width: '90%', margin: '16px 0 0 16px'}}>
      <Form.Item label="用户名">
        <Input placeholder="请输入用户名" value={data.userId} onChange={(val) => onChange(val, "userId")}/>
      </Form.Item>
      <Form.Item label="用户密码">
        <Input.Password placeholder="请输入用户密码" value={data.password} onChange={(val) => onChange(val, "password")}/>
      </Form.Item>
      <Form.Item label="secretkey">
        <Input placeholder="请输入secretkey" value={data.secretkey} onChange={(val) => onChange(val, "secretkey")}/>
      </Form.Item>
      <Form.Item label="模板id">
        <Input placeholder="请输入模板id" value={data.template} onChange={(val) => onChange(val, "template")}/>
      </Form.Item>
      <Form.Item label="参数列表">
        <Input placeholder="请输入参数列表(JSON)" value={data.msgContent} onChange={(val) => onChange(val, "msgContent")}/>
      </Form.Item>
    </Form>
  );
};

export default App;
