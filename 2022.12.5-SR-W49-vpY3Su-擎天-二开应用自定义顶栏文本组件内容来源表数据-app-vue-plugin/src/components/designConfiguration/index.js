import React, { useEffect } from "react";
// const { Form, InputNumber } = window.antd || ;
import { Form, Input, Radio } from "antd";
import { user, queryAssetById } from "../../api/asset";
const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration || "{}"));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);
  const translatePlatformDataToJsonArray = (originTableData) => {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  };
  const onFormLayoutChange = (changedValues, allValues) => {
    // console.log('allValues==',allValues);
    // if(allValues.fontFamily){
    //   allValues.fontFamily=allValues.fontFamily +' '+ '!important'
    // }
    if (allValues.assetId && allValues.filterFiled && allValues.showFiled) {
      user().then((res) => {
        let userInfo = res.data;
        queryAssetById(allValues.assetId).then((resp) => {
          translatePlatformDataToJsonArray(resp).forEach((element) => {
            if (element[allValues.filterFiled] == userInfo.account_code) {
              allValues.showInfo = element[allValues.showFiled];
              changeConfiguration(JSON.stringify(allValues));
            }
          });
        });
      });
    }
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  return (
    <>
      <Form {...formItemLayout} form={form} onValuesChange={onFormLayoutChange}>
        <Form.Item label="资产ID" name="assetId" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item label="过滤字段" name="filterFiled" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item label="展示字段" name="showFiled" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item label="样式配置" colon={false} initialValue={""}></Form.Item>
        <Form.Item label="颜色" name="fontColor" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item label="字号" name="fontSize" initialValue={""}>
          <Input />
        </Form.Item>
        <Form.Item label="水平对齐" name="textAlign" initialValue={""}>
          <Radio.Group>
            <Radio value="left">居左</Radio>
            <Radio value="center">居中</Radio>
            <Radio value="right">居右</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="垂直对齐" name="verticalAlign" initialValue={""}>
          <Radio.Group>
            <Radio value="top">居上</Radio>
            <Radio value="inherit">居中</Radio>
            <Radio value="bottom">居下</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
