/*
 * @Author: caoxingxing123 1104190972@qq.com
 * @Date: 2022-08-23 19:13:21
 * @LastEditors: caoxingxing123 1104190972@qq.com
 * @LastEditTime: 2022-08-24 12:23:21
 * @FilePath: /s28_navi_secondary/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState, useRef } from 'react';
import { Image, message, Card, Popconfirm, List, Col, Row, Divider, Modal, Input, Select, Switch, Button, Spin } from "antd";
import Setting from './setting';
import objImg from './svgPlugin';
import { EditOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons';
import "./app.less";

import { puginImport, queryList, exportPlugin, deletePlugin, puginUpdate, iconUpload } from './api/asset'
import backImg from './back.png';
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;
const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  },
  {
    title: 'Title 6',
  },
]
const objParams = { name: '', "id": "", active: true, type: 100, catalog_id: 'defaultTeam', file_name: '', file_back_name: '' }


const NavigateBar = props => {
  const { customConfig = {}, history = {}, funcRef } = props;
  const { componentId, title, iconUrl, btnName, assetInfo, linkedInfo, appId } = customConfig;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadParams, setUploadParams] = useState(objParams);
  const [loading, setLoading] = useState(false)
  const [upDateState, setupDateState] = useState(false)
  const [files, setFiles] = useState()
  const [filesBlack, setFilesBlack] = useState()
  const [iconFiles, setIconFile] = useState()
  const [titleModal, setTitleModal] = useState('新增插件')
  const [pluginData, setPluginData] = useState([{ name: '新增' }])
  const selectData = [
    { label: "应用", value: 100 },
    { label: "数据流", value: 1 },
    { label: "分析仪", value: 3 },
    { label: "填报组件", value: 9 },
    { label: "大屏", value: 4 },
    { label: "数据源", value: 103 },
    { label: "通用后台", value: 11 },
    { label: "填报列表", value: 91 },
    { label: "列表自定义按钮", value: 911 },
    { label: "应用页面标签组件", value: 915 },
    { label: "消息中心列表页", value: 916 },
    { label: "业务流短信平台", value: 917 },
    { label: "大屏系统插件", value: 666 },
    { label: "应用顶部自定义组件", value: 912 },
    { label: "应用顶部自定义组件", value: 912 },
    { label: "系统列表", value: 913 },
    { label: "表单自定义按钮响应方式", value: 914 },
  ]
  let arrObj = {}
  selectData.forEach((item, i) => {
    arrObj[item.value] = item.label
  });
  const [icontI, setIconI] = useState({
    "url": "/storage_area/icon/1234567890/0ba3345cee7b49fdabfb3da30815d250.png",
    "color": "rgba(0,0,0,1)",
    "type": "custom",
    "html": "\n    <span role=\"img\" class=\"anticon  /storage_area/icon/1234567890/0ba3345cee7b49fdabfb3da30815d250.png\" style=\"font-size: 18px; color: rgba(0,0,0,1); background-color: rgba(255,255,255,0);\">\n      <img src=\"/storage_area/icon/1234567890/0ba3345cee7b49fdabfb3da30815d250.png\" style=\"max-width: 144px; display: block; margin: 60px auto; max-height: 80px;\">\n    </span>\n    ",
    "size": "18px",
    "bgColor": "rgba(255,255,255,0)"
  })
  const fileS = useRef(null)
  const fileBlack = useRef(null)
  const iconFile = useRef(null)
  let btnStyle = {};
  try {
    btnStyle = JSON.parse(customConfig.btnStyle || '{}');
  } catch (error) {
    btnStyle = {};
  }

  useEffect(() => {
    if (funcRef) {
      funcRef.onCustomClick = () => {
        window.open('https://www.baidu.com');
      };
    }
    queryListPlugin()
    // queryList().then(res => {
    //   let tempPluginData = res.data.results
    //   let PluginData = JSON.parse(JSON.stringify(pluginData))
    //   setPluginData([...PluginData, ...tempPluginData])


    // }).catch(err => {

    // })

  }, []);

  const generateUUID = () => {
    let d = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }


  // 返回列表
  const backList = () => {
    const { history = {} } = this.props;
    if (history?.length > 1) {
      history?.goBack();
    }
  };

  const queryListPlugin = (params = {
    "colName": "catalog_id",
    "type": 1,
    "value": "defaultTeam"
  }) => {
    queryList(params).then(res => {
      let tempPluginData = res.data.results
      let PluginData = [{ name: '新增' }]
      setPluginData([...PluginData, ...tempPluginData])


    }).catch(err => {
      message.error('网络加加载失败')
    })
  }


  const handleOk = () => {  //确定按钮事件




    let formObj = JSON.parse(JSON.stringify(uploadParams))
    formObj.active = formObj.active ? 1 : 0

    if (titleModal == '新增插件' || upDateState) {

      if (!formObj.name) return message.error('请输入插件名称')
      if ((formObj.type == 1 || formObj.type == 103 || formObj.type == 917 || formObj.type == 11) && !formObj.file_back_name) return message.error('请选择后端包')
      if ((uploadParams.type != 11) && !formObj.file_name) return message.error('请选择前端包')
      setLoading(true)
      let formData = new FormData()
      formData.append('data', JSON.stringify(formObj))
      if (files) formData.append('key', files)
      if (filesBlack) formData.append('back_key', filesBlack)
      puginImport(formData).then(res => {
        setUploadParams(objParams)
        message.success('上传成功')
        setIsModalOpen(false);
        setLoading(false)
        setFiles(null)
        setFilesBlack(null)
        setupDateState(false)

        queryListPlugin()
      }).catch(err => {

        message.error('上传失败')
        setupDateState(false)
        setLoading(false)
      })
    } else {
      setLoading(true)
      puginUpdate(formObj).then(res => {
        message.success('更新成功')
        setIsModalOpen(false);
        setUploadParams(objParams)
        setLoading(false);
        queryListPlugin()
      }).catch(err => {
        message.error('更新失败')
        setLoading(false);
      })
    }

  }

  const editPluginFn = (data) => { // 编辑插件事件


    let editData = JSON.parse(JSON.stringify(uploadParams))
    if (data) {
      for (const key in editData) {
        editData[key] = data[key]
      }
      if (data.icon) editData.icon = data.icon
    }
    let a = data ? '编辑插件' : '新增插件'
    setTitleModal(a)
    setIsModalOpen(true);
    setUploadParams(editData)
  };

  const handleCancel = () => {  // 取消按钮事件
    setIsModalOpen(false);
    setUploadParams(objParams)
    setFiles(null)
    setFilesBlack(null)
  };

  const typeSelectFn = (e, type) => {

    // console.log(e, e?.target?.value, '=====');
    let formObj = JSON.parse(JSON.stringify(uploadParams))
    formObj[type] = type == 'name' ? e.target.value : e
    // type == 'name' ? e.target : e     
    setUploadParams(formObj)
  }
  const exportFn = (i, name) => { //下载事件

    exportPlugin(i).then(res => {
      var blob = res.data;
      //  FileReader主要用于将文件内容读入内存
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      // onload当读取操作成功完成时调用
      reader.onload = function (e) {
        var a = document.createElement("a");
        // 获取文件名fileName
        var fileName = name + '(解压后使用).zip'
        a.download = fileName;
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
      }
    }).catch(err => {

    })
  }
  const deleteFn = (i) => { //删除插件
    deletePlugin(i).then(res => {
      message.success('删除成功')
      queryListPlugin()
    }).catch(err => {
      message.error('删除失败')
    })
  }
  const triggerEvent = () => {
    window.eventCenter?.triggerEvent(componentId, "rightButtonClick", {})
  }

  const onBtnClick = () => {
    message.info(assetInfo?.asset_name ? `已选中资产: ${assetInfo.asset_name}` : '当前未选择资产');
  };

  const onLinkClick = () => {
    const { componentType, id, name } = linkedInfo;
    switch (componentType) {
      case 'appPage':
        window.open(`${window.location.origin}/applicationview/content/view?appid=${appId}&type=view&pId=${id}&breadcrumb=${name}`);
        break;
      case 'data-form-design':
        window.open(`${window.location.origin}/applicationview/content/data-form/${id}/insert?type=view&breadcrumb=${name}&appId=${appId}`);
        break;
      case 'data-form-list':
        window.open(`${window.location.origin}/applicationview/content/form/list?view_id=${id}&appid=${appId}`);
        break;
      case 'data-form-detail':
        message.info(`已选中详情组件: ${name}, 缺少dataId, 无法跳转`);
        break;
      default:
        message.info('当前无跳转目标或无法跳转');
        break;
    }
  }
  const changeOpne = (type) => {
    console.log(type);
    switch (type) {
      case 'fileS':
        fileS.current.click()
        break;
      case 'fileBlack':
        fileBlack.current.click()
        break;
      case 'iconFile':

        iconFile.current.click()
        break;

    }

  }
  const fileChange = (e) => {

    let files = e.target.files[0]
    let formObj = JSON.parse(JSON.stringify(uploadParams))
    formObj.file_name = files.name
    formObj.id = formObj.id ? formObj.id : generateUUID()
    setFiles(files)
    setupDateState(true)
    setUploadParams(formObj)
  }
  const fileBlackChange = (e) => {

    let files = e.target.files[0]
    let formObj = JSON.parse(JSON.stringify(uploadParams))
    formObj.file_back_name = files.name
    formObj.id = formObj.id ? formObj.id : generateUUID()
    setFilesBlack(files)
    setupDateState(true)

    setUploadParams(formObj)
  }
  const icontChange = (e) => {

    let files = e.target.files[0]
    if (files?.length <= 0) return
    let formData = new FormData()
    setIconFile(files)
    let formObj = JSON.parse(JSON.stringify(uploadParams))
    let icontTmpe = JSON.parse(JSON.stringify(icontI))

    formData.append('file', files)

    iconUpload(formData).then(res => {

      icontTmpe.html = icontTmpe.html.replaceAll(icontTmpe.url, res.data[0])
      icontTmpe.url = res.data[0]
      formObj.icon = JSON.stringify(icontTmpe)

      setUploadParams(formObj)
      setIconI(icontTmpe)
      setIconFile(null)
    }).catch(err => {
      message.error('图片上传失败')
    })
  }

  const onSearch = (e) => {

    queryListPlugin({
      "colName": "name",
      "type": 0,
      "value": e
    })
  }
  return (
    <div className='development_openplatform'>
      <div className='develoep_search' >  <Search
        placeholder=""
        allowClear
        onSearch={onSearch}
        style={{
          width: 250,
        }}
      /></div>

      <List
        grid={{
          gutter: 24,
          xs: 4,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 6,
        }}
        dataSource={pluginData}
        renderItem={(item, i) => (
          i == 0 ? <List.Item style={{ height: '215px' }}>
            <Card
              onClick={() => { editPluginFn() }}
              className='newplugin_development'
            >
              <PlusOutlined className='two_plugin' />
              <p className='two_newtitle' > 新增插件</p>
            </Card>
          </List.Item> :
            <List.Item style={{ height: '215px' }}>
              <Card

                cover={
                  <div class="picture">
                    {item.icon ? <div dangerouslySetInnerHTML={{ __html: JSON.parse(item.icon).html }} /> : <img src={objImg[arrObj[item.type]] ? objImg[arrObj[item.type]] : objImg.应用} />}


                  </div>
                }
                actions={[
                  <div class="cardAction">
                    <div class="cardType">
                      <span>{arrObj[item.type]}</span></div>
                    <Divider type="vertical" />
                    <div class="cardIcon">
                      <DownloadOutlined onClick={() => { exportFn(item.id, item.name) }} />
                      <EditOutlined onClick={() => { editPluginFn(item) }} />
                      <Popconfirm title="确定要删除吗？" onConfirm={() => { deleteFn(item.id) }} okText="是" cancelText="否">
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                  </div>
                ]}
              >
                <Meta

                  title={item.name}

                />
              </Card>

              {item.active ? <div class="selectTag"><svg width="22" height="46" viewBox="0 0 22 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H22V42.0725C22 43.707 20.1456 44.6513 18.8237 43.6899L12.1763 38.8555C11.475 38.3455 10.525 38.3455 9.82366 38.8555L3.17634 43.6899C1.8544 44.6513 0 43.707 0 42.0725V0Z" fill="#FFBB33" fill-opacity="0.9"></path><path d="M15.476 11.628H8.516V16.248H9.356V15.624H14.636V16.248H15.476V11.628ZM9.356 14.808V12.444H14.636V14.808H9.356ZM14.756 7.308V9.192H7.736V7.308H14.756ZM7.736 9.996H15.608V6.492H11.756C11.564 5.964 11.384 5.496 11.204 5.088L10.304 5.232C10.52 5.616 10.712 6.036 10.88 6.492H6.884V10.512C6.872 12.6 6.404 14.292 5.468 15.612L6.14 16.212C7.196 14.628 7.724 12.72 7.736 10.512V9.996ZM7.556 25.384H10.604V27.484H7.556V25.384ZM7.508 28.276H10.604V31.792H11.492V28.276H14.756V30.364C14.756 30.868 14.528 31.12 14.096 31.12C13.688 31.12 13.244 31.096 12.764 31.072L12.992 31.924H14.372C15.212 31.924 15.632 31.504 15.632 30.664V21.676H6.692V27.436C6.668 29.08 6.272 30.436 5.504 31.504L6.164 32.092C6.932 31.084 7.376 29.812 7.508 28.276ZM14.756 27.484H11.492V25.384H14.756V27.484ZM14.756 24.58H11.492V22.516H14.756V24.58ZM10.604 22.516V24.58H7.556V22.516H10.604Z" fill="white"></path></svg></div> : null}
            </List.Item>
        )}
      />


      <Modal Modal title={titleModal} className='development_modal'
        open={isModalOpen} bodyStyle={{ padding: '20px 50px', fontSize: '16px' }} width='800px'
        onOk={handleOk} onCancel={handleCancel}
        footer={
          [
            <Button type="primary" size='large' className='submitBtn' onClick={handleOk}>
              确定
            </Button>,
            <Button size='large' className='backBtn' onClick={handleCancel}>
              取消
            </Button>
          ]}
      >
        <Spin spinning={loading}>
          <Row className='modal_row'>
            <Col span={4}>插件名称:</Col>
            <Col span={20}><Input placeholder="请选择插件名称" onChange={(e) => { typeSelectFn(e, 'name') }} value={uploadParams.name} /></Col>
          </Row>
          <Row className='modal_row'>
            <Col span={4}>插件类型:</Col>
            <Col span={20}>  <Select
              placeholder="请选择插件类型"
              optionFilterProp="children"
              options={selectData}

              value={uploadParams.type}
              onChange={(e) => { typeSelectFn(e, 'type') }}
            >

            </Select></Col>
          </Row>
          <Row className='modal_row'>
            <Col span={4}>是否启用:</Col>
            <Col span={20}><Switch onChange={(e) => { typeSelectFn(e, 'active') }} checked={uploadParams.active} /></Col>
          </Row>
          {uploadParams.type != 11 &&
            <Row className='modal_row'>
              <Col span={4} className='item_start' >前端插件包:</Col>
              <Col span={20}><Input disabled={true} value={uploadParams.file_name} placeholder="请选择前端的插件包" suffix={<FolderOpenOutlined onClick={() => { changeOpne('fileS') }} />} />
                {files && <div style={{ color: '#ff4d4f' }} >提示:上传插件更换后，该插件使用处只有手动更新才可正常显示。</div>}   </Col>
            </Row>
          }

          {uploadParams.type == 1 || uploadParams.type == 103 || uploadParams.type == 917 || uploadParams.type == 11 ?
            <Row className='modal_row'>
              <Col span={4} className='item_start' >后端插件包:</Col>
              <Col span={20}><Input disabled={true} value={uploadParams.file_back_name} placeholder="请选择后端的插件包" suffix={<FolderOpenOutlined onClick={() => { changeOpne('fileBlack') }} />} />
                {filesBlack && <div style={{ color: '#ff4d4f' }} >提示:上传插件更换后，该插件使用处只有手动更新才可正常显示。</div>}
              </Col>
            </Row> : null
          }

          <Row className='modal_row'>
            <Col span={4}>选择图标:</Col>
            <Col span={20}><div className='button_parent'> <Button onClick={() => { changeOpne('iconFile') }} >选择图标</Button>{uploadParams.icon && <div dangerouslySetInnerHTML={{ __html: JSON.parse(uploadParams.icon).html }} />}   </div>  </Col>
          </Row>
        </Spin>
      </Modal >
      <input type='file' ref={fileS} onChange={fileChange} value='' style={{ display: 'none' }} ></input>
      <input type='file' ref={fileBlack} onChange={fileBlackChange} value='' style={{ display: 'none' }} ></input>
      <input type='file' ref={iconFile} onChange={icontChange} value='' style={{ display: 'none' }} ></input>
    </div >
  );
}


const App = props => {
  const { componentId } = props?.customConfig || {};

  const do_EventCenter_messageSuccess = () => {
    console.log('导航栏二开执行成功！');
  };

  // 逻辑控制用，不可删
  const Event_Center_getName = () => {
    return "应用组件二开";
  }


  useEffect(() => {
    const events = [
      {
        key: "rightButtonClick",
        name: "点击右侧按钮操作",
        payload: [],
      },
    ];
    const actions = [
      {
        key: "messageSuccess",
        name: "收到消息成功",
      },
    ];
    const refers = {
      do_EventCenter_messageSuccess: do_EventCenter_messageSuccess,
      Event_Center_getName: Event_Center_getName,
    }
    componentId &&
      window.componentCenter?.register(
        componentId,
        'comp',
        refers,
        {
          events,
          actions,
        }
      );
  }, []);

  if (props.isConfig) {
    return (
      <Setting {...props} />
    );
  }

  return (
    <NavigateBar {...props} />
  );
};

export default App;
