import React, { useEffect, useState } from "react";
// const { Form, InputNumber } = window.antd || ;
import { Upload } from "../uplot";

import { Form, Input, Radio, message, Button, Modal, Row, Col } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.less'
const { Dragger } = Upload;
const accept = "image/png, image/jpeg, image/jpg";
const baseURL = `${process.env.REACT_APP_API}/sdata/rest`;


const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  const [formChield] = Form.useForm();
  const [dataImage, setDataImage] = useState({ img: '' })
  const [modalIndex, setModalIndex] = useState(0)
  const [menuArr, setmenuArr] = useState([])
  const [upState, setUpState] = useState('add')

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration || '{}'));
      setmenuArr(JSON.parse(configuration || '{}').menuArr || [])
      setDataImage(JSON.parse(configuration || '{}').img || {})
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    if (allValues) {
      let temp = JSON.parse(JSON.stringify(allValues))
      temp.menuArr = menuArr
      changeConfiguration(JSON.stringify(temp));
    } else {
      if (changedValues) {
        let temp = JSON.parse(JSON.stringify(form.getFieldsValue()))
        temp.menuArr = changedValues
        changeConfiguration(JSON.stringify(temp));
      } else {
        let temp = JSON.parse(JSON.stringify(form.getFieldsValue()))
        temp.menuArr = menuArr
        changeConfiguration(JSON.stringify(temp));
      }

    }

  };
  //处理删除图片
  const handleDeleteIcon = (index) => {
    setDataImage({})
    form.setFieldsValue({
      img: { img: '' }
    })
    onFormLayoutChange()
  };
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
  const onUploadFinished = ({ file }) => {
    const { status, response } = file;
    if (status === 'done') {
      const { result } = response;
      // setImageArr(result);
      let dataType = JSON.parse(JSON.stringify(dataImage))
      dataType.img = result
      dataType.name = file.name
      form.setFieldsValue({
        img: dataType
      })
      setDataImage(dataType)
      onFormLayoutChange()
    } else if (status === 'error') {
      message.error('上传出错，请重试');
    }
  };
  //添加事件
  const addClick = () => {
    formChield.setFieldsValue({ chield_name: '', chield_url: '' })
    setUpState('add')
    setIsModalOpen(true)
  }
  //编辑事件
  const editMenu = (item, i) => {
    setUpState('edit')
    formChield.setFieldsValue(item)
    setModalIndex(i)
    setIsModalOpen(true)
  }
  //删除事件
  const deletMenu = (item, i) => {
    let arr = JSON.parse(JSON.stringify(menuArr))
    arr.splice(i, 1)
    onFormLayoutChange(arr)
    setmenuArr(arr)
  }
  const showModal = () => {
    setIsModalOpen(true);
  };
  //弹窗ok事件
  const handleOk = () => {
    formChield.validateFields().then(res => {
      let arr = JSON.parse(JSON.stringify(menuArr))
      if (upState == 'add') {
        arr[arr.length] = res
      } else {
        arr[modalIndex] = res
      }
      setmenuArr(arr)
      setIsModalOpen(false)
      onFormLayoutChange(arr)
    }).catch(err => {
    })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <div className="label_tow">一级菜单</div>
        <Form.Item label="名称" name="name" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="图标" name="img" initialValue={''}>
          <Dragger
            accept={accept}
            action={`${baseURL}/image/uploadPic?category=4`}
            onChange={e => onUploadFinished(e)}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <Button>上传</Button>
          </Dragger>
          {dataImage.img && <><span className="img_name">{dataImage.name} </span>   <span className="deleteImg" onClick={() => handleDeleteIcon()}> <DeleteOutlined></DeleteOutlined> </span></>}
        </Form.Item>
        <Form.Item label="跳转地址" name="url" initialValue={''}>
          <Input />
        </Form.Item>
        <Form.Item label="打开方式" name="openType" initialValue={''}>
          <Radio.Group >
            <Radio value={1}>新页签</Radio>
            <Radio value={2}>当前页</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="label_tow">下拉菜单</div>
        {menuArr.length > 0 ?
          menuArr.map((x, i) => {
            return (<Row>
              <Col span={5} >
              </Col>
              <Col span={13} >
                <div className="menu_item_two">
                  <span>{x.chield_name}</span>
                  <div className="end_two" >
                    <div className="edit_two" onClick={() => { editMenu(x, i) }} >编辑</div>
                    <span onClick={() => { deletMenu(x, i) }}  >删除</span>
                  </div>
                </div>
              </Col>
            </Row>)
          })
          : ''
        }
        <div className='add_button_tow' >
          <Row>
            <Col span={5} >
            </Col>
            <Col span={13} >
              <div className="button_add_two" onClick={addClick} >添加</div>
            </Col>
          </Row>
        </div>
      </Form>
      <Modal title="下拉菜单编辑" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form    {...formItemLayout}
          form={formChield}>
          <Form.Item label="菜单名称" rules={[{ required: true, message: '必填', },]} required name="chield_name" initialValue={''}>
            <Input />
          </Form.Item>
          <Form.Item label="跳转地址" rules={[{ required: true, message: '必填', },]} required name="chield_url" initialValue={''}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
