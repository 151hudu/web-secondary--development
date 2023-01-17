import React, { useEffect, useState } from "react";
import { Layout, Form, Button, Input, Row, Col, Select, DatePicker, Table, Tooltip, Pagination, ConfigProvider, Popconfirm, message } from "antd";
import "./module.less";

import { queryAllType, queryMyInitiated, queryMoneyData, eventRevoke, deleteEventRevoke } from "../api/asset";

// 引入antd国际化
import zh_CN from "antd/es/locale/zh_CN";
import moment from "moment";

const { Content } = Layout;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

const MyInitiated = (props) => {
  const { wfqdFolw } = props?.customConfig || {};

  // 默认地址
  const apiContextPath = window.location.origin;
  // 表单数据
  const [form] = Form.useForm();
  // 事件类型数据
  const [flowConstantIdList, setFlowConstantIdList] = useState([]);

  // 表格数据
  const [tableData, setTableData] = useState([]);
  // 表格查询表单
  const [tableForm, setTableForm] = useState({
    orderBy: "last_modify_time",
    orderSort: "DESC",
    pageNum: 1,
    pageSize: 10,
    queryParams: [
      {
        colName: "activiti_type",
        type: 2,
        value: "flow",
      },
    ],
  });

  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);

  // 初始化页面
  useEffect(() => {
    // 事件类型
    queryAllType().then((res) => {
      let selectList = [];
      let resData = res.data;
      for (let i in resData) {
        selectList.push({
          name: i,
          list: resData[i],
        });
      }
      setFlowConstantIdList(selectList);
    });
    // 获取表格数据
    getTabelData();
  }, []);

  // 表格列数据
  const columns = [
    {
      title: "事件类型",
      dataIndex: "flow_definition_name",
      key: "flow_definition_name",
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <>
          <Tooltip placement="topLeft" title={record.flow_definition_name}>
            {record.flow_definition_name}
          </Tooltip>
        </>
      ),
    },
    {
      title: "金额（元）",
      dataIndex: "money",
      key: "money",
      width: 150,
      ellipsis: true,
    },
    {
      title: "摘要",
      dataIndex: "abstract",
      key: "abstract",
      width: 300,
      ellipsis: true,
      render: (_, record) => (
        <>
          <Tooltip placement="topLeft" title={record.digest}>
            {record.digest}
          </Tooltip>
        </>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      width: 150,
      ellipsis: true,
      render: (_, record) => <div>{moment(record.create_time).format("yyyy年MM月DD日")}</div>,
    },
    {
      title: "更新时间",
      dataIndex: "last_modify_time",
      key: "last_modify_time",
      width: 150,
      ellipsis: true,
      render: (_, record) => <div>{moment(record.last_modify_time).format("yyyy年MM月DD日")}</div>,
    },
    {
      title: "创建人",
      dataIndex: "create_member_name",
      key: "create_member_name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "经办人",
      dataIndex: "handleUserNameSexual",
      key: "handleUserNameSexual",
      width: 150,
      ellipsis: true,
      render: (_, record) => (
        <>
          <Tooltip placement="topLeft" title={record.handleUserNameSexual}>
            {record.handleUserNameSexual}
          </Tooltip>
        </>
      ),
    },
    {
      title: "流程状态",
      dataIndex: "process_status",
      key: "process_status",
      width: 200,
      ellipsis: true,
      render: (_, record) => <div>{getFlowStatus(record.process_status)}</div>,
    },
    {
      title: "业务状态",
      dataIndex: "business_status",
      key: "business_status",
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <>
          <Tooltip placement="topLeft" title={record.flow_inst_business_status}>
            {props.intlGetKey(record.flow_inst_business_status)}
            {/* {record.flow_inst_business_status} */}
          </Tooltip>
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      align: "center",
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <div className="table_link_button">
          <Button
            type="link"
            onClick={() => {
              if (record.process_status === "pendingApply") {
                window.open(`${apiContextPath}/event/details?objectid=${record.id}&type=initiate-approval`);
              } else if (record.withPendingHandleTaskFlag === 1) {
                window.open(`${apiContextPath}/data-form/flow-approval/insert?objectid=${record.id}&type=initiate-edit`);
              } else {
                window.open(`${apiContextPath}/event/details/viewV2?objectid=${record.id}&type=initiate-approval`);
              }
            }}
          >
            详情
          </Button>

          {record.process_status === "turnDown" && (
            <Button
              type="link"
              onClick={() => {
                window.open(`${apiContextPath}/event/create?flowid=${record.flow_id}&nodeid=sid-startevent&id=${record.content_id}`);
              }}
            >
              处理
            </Button>
          )}

          {record.process_status === "processing" && (
            <Popconfirm title="你确定要撤销该事件" okText="确定" cancelText="取消" onConfirm={() => onRevoked(record)}>
              <Button type="link">撤销</Button>
            </Popconfirm>
          )}

          {(record.process_status === "revoked" || record.process_status === "beatBack") && (
            <Button
              type="link"
              onClick={() => {
                window.open(`${apiContextPath}/event/create?flowid=${record.flow_id}&nodeid=sid-startevent&id=${record.content_id}`);
              }}
            >
              重新发起
            </Button>
          )}

          {(record.process_status === "revoked" || record.process_status === "beatBack") && (
            <Popconfirm title="你确定要删除该事件" okText="确定" cancelText="取消" onConfirm={() => deleteRevoked(record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  // 获取表格数据
  const getTabelData = (queryForm) => {
    let dataForm = queryForm || tableForm;
    // 表格数据
    queryMyInitiated(dataForm).then(async (res) => {
      let resData = res.data.results;
      setPageTotal(res.data.totalCount);

      for (let i in resData) {
        let arr = [];
        resData[i].money = await getTableMoneyData(resData[i]);
        if (resData[i].handleUserNameSexual) {
          resData[i].handleUserNameSexual.forEach((e) => {
            arr.push(e.name);
          });
          arr = arr.join(",");
          resData[i].handleUserNameSexual = arr;
        } else {
          resData[i].handleUserNameSexual = "无";
        }
      }

      setTableData(resData);
    });
  };

  // 获取金额
  const getTableMoneyData = async (row) => {
    let _wfqdFolw = [];

    if (wfqdFolw) {
      _wfqdFolw = JSON.parse(wfqdFolw);
    }

    let dataForm = {
      flowInstIds: [row.flow_inst_id],
      flowFormColumns: _wfqdFolw,
    };

   //  let { data } = await queryMoneyData(dataForm);

    try {
      let { data } = await queryMoneyData(dataForm);
      return NumFormat(data[0]?.column_data);
    } catch {
      return "";
    }
  };

  // 流程状态映射
  const getFlowStatus = (value) => {
    let type = "";

    switch (value) {
      case "processing":
        type = "处理中";
        break;
      case "suspend":
        type = "挂起";
        break;
      case "termination":
        type = "已终止";
        break;
      case "end":
        type = "结束";
        break;
      case "pendingApply":
        type = "待发起";
        break;
      case "revoked":
        type = "已撤销";
        break;
      case "beatBack":
        type = "打回";
        break;
      case "directFinish":
        type = "直接完成";
        break;
      case "turnDown":
        type = "驳回";
        break;
    }

    return type;
  };

  // 三位分节法
  const NumFormat = (value) => {
    if (!value) return "";
    let intPart = Number(String(value).split(".")[0]);
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    let floatPart = ".00";
    let value2Array = value.toString().split(".");
    if (value2Array.length === 2) {
      floatPart = value2Array[1].toString();
      if (floatPart.length === 1) {
        return intPartFormat + "." + floatPart + "0";
      } else {
        return intPartFormat + "." + floatPart;
      }
    } else {
      return intPartFormat + floatPart;
    }
  };

  // 切换分页
  const onChangePage = (page, pageSize) => {
    let _queryForm = JSON.parse(JSON.stringify(tableForm));
    _queryForm.pageNum = page;
    _queryForm.pageSize = pageSize;

    setPage(page);
    setPageSize(pageSize);
    setTableForm(_queryForm);
    getTabelData(_queryForm);
  };

  // 重置表单
  const resetForm = () => {
    form.resetFields();

    let _queryForm = JSON.parse(JSON.stringify(tableForm));

    _queryForm.queryParams = [
      {
        colName: "activiti_type",
        type: 2,
        value: "flow",
      },
    ];

    setTableForm(_queryForm);
  };

  // 查询表单
  const queryData = () => {
    let _tableForm = JSON.parse(JSON.stringify(tableForm));
    _tableForm.queryParams = [
      {
        colName: "activiti_type",
        type: 2,
        value: "flow",
      },
    ];
    let formData = form.getFieldsValue();

    for (let i in formData) {
      if (formData[i]) {
        if (i == "create_time" && formData[i].length) {
          _tableForm.queryParams.push({
            colName: "create_time",
            min: Date.parse(formData[i][0]),
            max: Date.parse(formData[i][1]),
            type: 119,
          });
        } else if (i == "flow_constant_id" && formData[i].length) {
          _tableForm.queryParams.push({
            colName: "flow_constant_id",
            value: formData[i].join(","),
            type: 1,
          });
        } else if (i == "flow_inst_name" && formData[i]) {
          _tableForm.queryParams.push({
            colName: "flow_inst_name",
            value: formData[i],
            type: 0,
          });
        } else if (i == "flow_inst_process_status" && formData[i].length) {
          _tableForm.queryParams.push({
            colName: "flow_inst_process_status",
            value: formData[i].join(","),
            type: 1,
          });
        } else if (i == "flow_inst_create_member" && formData[i].length) {
          _tableForm.queryParams.push({
            colName: "flow_inst_create_member",
            value: formData[i].join(","),
            type: 1,
          });
        } else if (i == "digest" && formData[i].length) {
          _tableForm.queryParams.push({
            colName: "digest",
            value: formData[i],
            type: 0,
          });
        }
      }
    }

    setTableForm(_tableForm);
    getTabelData(_tableForm);
  };

  // 撤销
  const onRevoked = (row) => {
    eventRevoke(row.id).then((res) => {
      message.success("撤回成功");
      getTabelData();
    });
  };

  // 删除
  const deleteRevoked = (row) => {
    console.log("删除");
    deleteEventRevoke(row.id).then((res) => {
      message.success("删除成功");
      getTabelData();
    });
  };

  // 选择器模糊查询
  const selectFuzzyquery = (input, option) => {
    let filterOptions = false;
    if (option.props.children != undefined) {
      console.log(input, option.props.children);
      filterOptions = option.props.children.indexOf(input) >= 0;
    }
    return filterOptions;
  };

  return (
    <Layout className="table_content">
      {/* 头部区域 */}
      <div className="content_header">
        <div className="content_search">
          <Form labelCol={{ style: { width: 100 } }} form={form}>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item label="事件类型：" name="flow_constant_id">
                  <Select showSearch filterOption={selectFuzzyquery} mode="multiple" maxTagCount={1} popupClassName="table_select" placeholder="请选择 事件类型">
                    {flowConstantIdList.map((item) => {
                      return (
                        <OptGroup label={item.name} key={item.name}>
                          {item.list.map((e) => {
                            return (
                              <Option value={e.flow_constant_id} key={e.id}>
                                {e.name}
                              </Option>
                            );
                          })}
                        </OptGroup>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="节点名称：" name="flow_inst_name">
                  <Input placeholder="请输入 节点名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="流程状态：" name="flow_inst_process_status">
                  <Select
                    showSearch
                    mode="multiple"
                    maxTagCount={1}
                    placeholder="请选择 流程状态"
                    options={[
                      { value: "processing", label: "处理中" },
                      { value: "suspend", label: "挂起" },
                      { value: "termination", label: "已终止" },
                      { value: "end", label: "结束" },
                      { value: "pendingApply", label: "待发起" },
                      { value: "revoked", label: "已撤销" },
                      { value: "beatBack", label: "打回" },
                      { value: "directFinish", label: "直接完成" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <ConfigProvider locale={zh_CN}>
                  <Form.Item label="任务创建时间：" name="create_time">
                    <RangePicker showTime />
                  </Form.Item>
                </ConfigProvider>
              </Col>
              <Col span={12}>
                <Form.Item label="摘要：" name="digest">
                  <Input placeholder="请输入 摘要关键词" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="content_button">
          <Button type="primary" onClick={queryData}>
            查询
          </Button>
          <Button type="primary" onClick={resetForm}>
            重置
          </Button>
        </div>
      </div>
      {/* 内容区域 */}
      <Content className="content_inner">
        <Table
          columns={columns}
          dataSource={tableData}
          bordered
          scroll={{ x: 1600 }}
          rowClassName={(record, index) => {
            return index % 2 !== 0 ? "table_black" : "";
          }}
          pagination={false}
        />
        <ConfigProvider locale={zh_CN}>
          <Pagination
            className="table_pagination"
            showTotal={(total) => `共${total}条`}
            current={page}
            total={pageTotal}
            pageSize={pageSize}
            onChange={onChangePage}
            showSizeChanger
            showQuickJumper
          />
        </ConfigProvider>
      </Content>
    </Layout>
  );
};

export default MyInitiated;
