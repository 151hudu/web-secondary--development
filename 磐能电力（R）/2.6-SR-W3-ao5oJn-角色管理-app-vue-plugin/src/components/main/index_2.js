import React, { Component, createRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import request from '../../api/request';
import {
  Button,
  Table,
  Tree,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  message,
  Breadcrumb,
  TreeSelect,
  Tooltip,
  // Input,
} from 'antd';
import TreeSelectAll from '@sd-ui/tree-select-all';
import {
  queryOfficeByOfficeId,
  queryUserByOfficeId,
  queryAllRoles,
  queryUserByName,
  queryOfficeByOfficeName,
  queryAllRoleByName,
  updateUserRoles,
  getLowerOffice,
  downloadRoleTemp,
  downloadRoleTempEn,
  // importRole,
} from '../../api/system';
import RoleSider from './sider';
// import Scrollbars from 'react-custom-scrollbars';

import { queryOfficeAll } from '../../api/officeFetch';
import { queryUserAll } from '../../api/userFetch.js';
import {
  queryUsersByRole,
  getAllUser,
  insertUserRole,
  deleteUserRole,
} from '../../api/system';
import { identifyPermission } from '../../api/user';
// import { this.intlGetKey } from '@/micro-common/utils';


import intl from 'react-intl-universal';
// import UumTips from '../componenets/uum-modal';
// import UploadSuccessModel from './../account-list/upload-success-modal';

// eslint-disable-next-line no-unused-vars
const { TreeNode } = Tree;

const identityText =
  window.configuration?.USER_CONFIGURATION_INFO?.current_value ||
  window.configuration?.USER_CONFIGURATION_INFO?.default_value ||
  'PLAT.IDENTITY';

class RoleTable extends Component {
  state = {
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    totalCount: 0,
    page: {
      pageSize: 10,
      pageNum: 1,
      queryParams: [],
    },
    visible: false,
    // visible: true,
    organizationData: [],
    office: [],
    userList: [],
    selectedItem: {
      id: '',
      name: '',
    },
    department: [],
    checkedKeys: [],
    defaultExpandedKeys: [],
    autoExpandParent: true,

    Permission: [],
    searchValue: '',

    action: undefined,

    roleTree: [],
    moveToRole: false,
    moveRole: undefined,
    file: createRef(),
    roleKey: 1,
    uploadSuccessModalVisible: false,
    uploadSuccessModalMessage: {},
    successCount: 0,
  };
  constructor(props) {
    super(props);

    this.intlGetKey = this.props?.intlGetKey;

  }
  componentDidMount() {
    this.loadData();
    this.loadDepartment();
    this.loadPermission();
  }

  loadDepartment = async () => {
    const { data } = await getAllUser();
    data[1].push({
      id: '',
      name: this.intlGetKey('APP.ALL'),
    });
    this.setState({
      department: data[1],
    });
  };

  loadPermission = async () => {
    let code = 'c7e9352b67f4e44e';
    try {
      const { data } = await identifyPermission(code);
      this.setState({
        Permission: data,
      });
    } catch (err) {
      message.error(err.data.message);

      // history.push('/');
      console.log(err);
    }
  };

  loadData = () => {
    let _that = this;
    queryUserAll(function (data) {
      _that.setState({ userList: data });
      queryOfficeAll(async function (data) {
        _that.transform(data.children);
        let defaultExpandedKeys = await _that.loadChildren(data.children, []);
        _that.setState({
          organizationData: data.children,
          defaultExpandedKeys,
        });
      });
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      defaultExpandedKeys: expandedKeys,
      autoExpandParent: false,
    });
  };

  loadChildren = (data, defaultExpandedKeys) => {
    data.map(item => {
      if (item.children && item.children.length > 0) {
        this.loadChildren(item.children, defaultExpandedKeys);
      }
      defaultExpandedKeys.push(item.id);
    });
    return defaultExpandedKeys;
  };

  loadDataSource = async () => {
    const { selectedItem } = this.state;
    if (selectedItem.name !== '') {
      try {
        const { data } = await queryUsersByRole(
          selectedItem.id,
          this.state.page
        );
        let source = [];
        if (data && data.results && data.results.length > 0) {
          data.results.map((item, index) => {
            item.key = index;
            source.push(item);
          });
        }

        this.setState({
          dataSource: source,
          totalCount: data.totalCount || 0,
        });
      } catch (err) { }
    }
  };

  setSelectedItem = item => {
    this.setState(
      {
        selectedItem: item,
        selectedRowKeys: [],
        selectedRows: [],
      },
      () => {
        this.loadDataSource();
      }
    );
  };

  transform = data => {
    let _that = this;
    data.forEach(function (item) {
      if ('loginName' in item) {
        item.title = item.name;
        item.key = item.id;
      } else {
        item.title = item.name;
        item.key = item.id;
      }
      // eslint-disable-next-line no-unused-expressions
      _that.state.userList[0]?.map(res => {
        if (item.key === res.officeId && res.id !== _that.state.userId) {
          if (item.children !== undefined) {
            item.children.push(res);
          }
        }
      });

      if (item.children) {
        _that.transform(item.children);
      }
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  pageOnChange = pageNum => {
    let { page } = this.state;
    page.pageNum = pageNum;
    this.setState(
      {
        page: page,
      },
      () => {
        this.loadDatasource();
      }
    );
  };

  changeVisible = () => {
    this.setState({
      visible: true,
      searchValue: '',
    });
  };

  onSelect = selectedKeys => {
    // fix BUG-20210801-036R
    // const { userList } = this.state;
    // let keys = [];
    // if (userList[0]) {
    //   selectedKeys.map(key => {
    //     userList[0].map(item => {
    //       if (key?.id === item.id) {
    //         keys.push(key);
    //       }
    //     });
    //   });
    // }
    this.setState({
      checkedKeys: selectedKeys,
    });
  };

  onCheck = checkedKeys => {
    const { userList } = this.state;
    let keys = [];
    if (userList[0]) {
      checkedKeys.map(key => {
        userList[0].map(item => {
          if (key === item.id) {
            keys.push(key);
          }
        });
      });
    }
    this.setState({
      checkedKeys: keys,
    });
  };

  addRoleItem = async () => {
    const { checkedKeys, selectedItem } = this.state;
    let ids = [];
    checkedKeys.map(key => ids.push(key.id));
    if (checkedKeys.length > 0) {
      let params = {
        role_id: selectedItem.id,
        userIds: ids,
      };
      try {
        await insertUserRole(params);
        message.success(this.intlGetKey('system.roleNew.insertSuccess').d('添加成功'));
        this.setState({
          visible: false,
        });
        this.loadDataSource();
      } catch (err) {
        message.error(err.data?.message);
      }
    } else {
      message.error(this.intlGetKey('COMM.PSAM'));
    }
  };
  haneldSearchValue = e => {
    this.setState({ searchValue: e.target.value });
  };
  initAddMember = () => {
    const { searchValue } = this.state;
    const loop = data => {
      const result = [];
      data.forEach(item => {
        if (item.children && item.children.length > 0) {
          result.push(
            <TreeNode
              key={item.id}
              className={
                item.officeId
                  ? `personalbig`
                  : item.officeIds
                    ? `lookbig`
                    : `organizebig`
              }
              title={
                !item.officeId && !item.officeIds
                  ? item.name + '(' + item.member_num + '人)'
                  : item.name
              }
            >
              {loop(item.children)}
            </TreeNode>
          );
        } else if (
          searchValue === '' ||
          (item.name && item.name.indexOf(searchValue) > -1)
        ) {
          result.push(
            <TreeNode
              className={
                item.officeId
                  ? `personalbig`
                  : item.officeIds
                    ? `lookbig`
                    : `organizebig`
              }
              key={item.id}
              title={item.name}
            />
          );
        }
      });
      return result;
    };
    return (
      // this.state.visible && 
      (
        <Modal
          className="system-role-add-member_two"
          visible={this.state.visible}
          cancelText='取消'
          okText='确认'
          title={this.intlGetKey('APP.ADD_MEMBER')}
          width={688}
          onOk={this.addRoleItem}
          onCancel={() => this.setState({ visible: false })}
        >
          {/* <Input
            value={searchValue}
            onChange={this.haneldSearchValue}
            style={{ width: '200px' }}
          />
          <Scrollbars
            style={{
              height: '400px',
            }}
          >
            <Tree
              height={400}
              checkable
              onSelect={this.onSelect}
              onCheck={this.onCheck}
              onExpand={this.onExpand}
              showLine
              autoExpandParent={this.state.autoExpandParent}
              expandedKeys={this.state.defaultExpandedKeys}
            >
              {loop(this.state.organizationData)}
            </Tree>
          </Scrollbars> */}
          <TreeSelectAll
            type="user"
            fetchOffice={queryOfficeByOfficeId}
            fetchUser={queryUserByOfficeId}
            fetchRoles={queryAllRoles}
            fetchUserByName={queryUserByName}
            fetchOfficeByName={queryOfficeByOfficeName}
            fetchRolesByName={queryAllRoleByName}
            fetchOfficeById={getLowerOffice}
            onSelect={this.onSelect}
          />
        </Modal>
      )
    );
  };

  handleMenuClick = async () => {
    const { selectedRows, selectedItem } = this.state;

    // if (e.key === '1') {
    let userIds = [];
    selectedRows.map(item => {
      userIds.push(item.id);
    });
    // if (
    //   (selectedItem.id === '100000000002' ||
    //     selectedItem.id === '100000000001') &&
    //   totalCount - userIds.length < 1
    // ) {
    //   message.error('当前角色下至少保留一个用户');
    //   return;
    // }
    let params = {
      role_id: selectedItem.id,
      userIds,
    };
    try {
      await deleteUserRole(params);
      message.success(this.intlGetKey('eventflow.deletesuccess').d('删除成功'));
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
      this.loadDataSource();
    } catch (err) {
      const { data: { code } = {} } = err || {};
      message.error(
        this.intlGetKey(`ERROR.${code}`) || this.intlGetKey('COMM.OPERATION_FAILED!')
      );
      console.log(err);
    }
    // }
  };

  deletePeople = async record => {
    const { selectedItem } = this.state;
    // if (
    //   (selectedItem.id === '100000000002' ||
    //     selectedItem.id === '100000000001') &&
    //   totalCount < 2
    // ) {
    //   message.error('当前角色下至少保留一个用户');
    //   return;
    // }
    let userIds = [];
    userIds.push(record.id);
    let params = {
      role_id: selectedItem.id,
      userIds,
    };
    try {
      await deleteUserRole(params);
      message.success(this.intlGetKey('system.roleNew.removeSuccess').d('移除成功'));
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
      this.loadDataSource();
    } catch (err) {
      console.log(err);
    }
  };

  clearAllSelect = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  editMenuClick = () => {
    const { selectedItem } = this.state;
    console.log(selectedItem, '------>文件');
    this.child.editMenuClick(selectedItem.id);
  };

  pageChange = pagination => {
    let { page } = this.state;
    page.pageNum = pagination.current;
    this.setState(
      {
        page,
      },
      () => {
        this.loadDataSource();
      }
    );
  };

  updateRoles = roles => {
    const format = list => {
      return list.map(item => {
        const { id, name, roleItemList, group_id } = item;
        let res = {
          // title: this.intlGetKey(name),
          title: name,
          value: id,
          disabled: group_id === undefined,
        };
        if (roleItemList?.length) {
          res.children = format(roleItemList);
        }
        return res;
      });
    };
    const roleTree = format(roles);
    // console.log('roleTree', roleTree);
    this.setState({ roleTree });
  };

  handleRoleChange = roleId => {
    this.setState({ moveRole: roleId });
  };

  handleMoveCancle = () => {
    this.setState({ moveToRole: false });
  };

  handleAction = ({ key }) => {
    switch (key) {
      case '2':
        this.setState({ moveToRole: true });
        break;
    }
  };

  handleUserMove = async () => {
    const { selectedItem, selectedRows, moveRole } = this.state;
    let userIds = [];
    selectedRows.map(item => {
      userIds.push(item.id);
    });
    if (!moveRole) {
      message.warn('请选择角色！');
      return;
    }
    // TODO {this.intlGetKey('COMM.MOBILE_INTERFACE')}
    try {
      await updateUserRoles({
        oldRoleId: selectedItem.id,
        roleId: moveRole,
        userIds,
      });
      this.loadDataSource();
      this.handleMoveCancle();
      message.success('移动成功！');
    } catch (error) {
      console.log(error);
      message.error(error?.data?.message || '移动失败！');
    }
  };

  getCookieLang = () => {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf('lang=');
      if (start !== -1) {
        start = start + 5;
        let end = document.cookie.indexOf(';', start);
        if (end === -1) end = document.cookie.length;
        return document.cookie.substring(start, end);
      }
    }
    return '';
  };

  handleInput = () => {
    const { file } = this.state;
    file.current.click();
  };
  handleDownLoad = async () => {
    try {
      let lang = this.getCookieLang();
      const res =
        lang === 'zh-cn'
          ? await downloadRoleTemp()
          : await downloadRoleTempEn();
      console.log('handleDownLoad', res);
    } catch (error) {
      console.log(error);
    }
  };
  handleFileChange = async e => {
    e.persist();
    // console.log('handleFileChange', e);
    const file = e.target.files[0];
    if (file.size > 5242880) {
      message.error(this.intlGetKey('SYS.EXCEED_FILE'));
      return;
    }
    const param = new FormData(); // 创建form对象
    param.append('file', file); // 通过append向form对象添加数据
    this.state.file.current.value = '';
    try {
      await this.importRole(param);
      // const { roleKey } = this.state;
    } catch (error) {
      console.log(error);
    }
  };

  importRole = param => {
    request({
      url: `/system/excelImport/importRole`,
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: param,
    })
      .then(response => {
        const { data } = response;
        const message = {
          title: intl
            .get('SYS.IMPORT_ROLE_MODEL_TITLE' || 'common.empty')
            .d('角色导入'),
          descriptionText: [
            intl
              .get('SYS.IMPORT_ROLE_MODEL_DES_ONE' || 'common.empty')
              .d('1.角色id已被其他组织使用的数据为失败数据'),
            intl
              .get('SYS.IMPORT_ROLE_MODEL_DES_TWO' || 'common.empty')
              .d('2.不会导入角色id为空的数据'),
            intl
              .get('SYS.IMPORT_ROLE_MODEL_DES_THREE' || 'common.empty')
              .d('3.角色名称为空的数据为失败数据'),
            intl
              .get('SYS.IMPORT_ROLE_MODEL_DES_FOUR' || 'common.empty')
              .d('4.角色id已经存在于本组织的会覆盖原来的角色名称'),
          ],
          statusText: `${intl
            .get('SYS.IMPORT_MODEL_SEVEN' || 'common.empty')
            .d('导入成功')}${data?.successCount}${intl
              .get('SYS.IMPORT_MODEL_EIGHT' || 'common.empty')
              .d('条')}
          ${data?.errorRole
              ? intl
                .get('SYS.IMPORT_ROLE_MODEL_STATUS_ONE' || 'common.empty')
                .d('，请重新导入下列失败数据，角色id为：') + data?.errorRole
              : intl
                .get('SYS.IMPORT_MODEL_TEN' || 'common.empty')
                .d('无失败数据')
            }`,
        };
        this.setState({ uploadSuccessModalVisible: true });
        this.setState({
          uploadSuccessModalMessage: message,
          successCount: data?.successCount,
        });
        this.setState({ roleKey: Math.random() });
      })
      .catch(err => {
        message.error(
          this.intlGetKey('REPO.IMPORT_FAILED') + '，' + err?.data?.message
        );
        console.log(err);
      });
  };

  render() {
    const {
      selectedRowKeys,
      totalCount,
      selectedItem,
      page,
      action,
      moveToRole,
      roleTree,
      visible,
      file,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    let columns = [
      {
        title: this.intlGetKey('APP.FULL_NAME'),
        dataIndex: 'photo',
        width: '20%',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          return (
            <>
              <img
                style={{ width: '32px', height: '32px', margin: '0 5px 0 0 ' }}
                src={text}
              />
              <Tooltip placement="topLeft" title={record.name}>
                {record.name}
              </Tooltip>
            </>
          );
        },
      },
      {
        title: this.intlGetKey(identityText || 'common.empty').d(identityText),
        dataIndex: 'userName',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          return (
            <Tooltip
              placement="topLeft"
              title={this.intlGetKey(text || 'common.empty').d(text)}
            >
              {this.intlGetKey(text || 'common.empty').d(text)}
            </Tooltip>
          );
        },
      },
      {
        title: this.intlGetKey('APP.JOB_NUMBER'),
        dataIndex: 'no',
      },
      {
        title: this.intlGetKey('APP.ORGANIZATION'),
        dataIndex: 'officeId',
        ellipsis: {
          showTitle: false,
        },
        render: text => {
          let value = '';
          this.state.department.map(item => {
            if (item.id === text) {
              value = item.name;
            }
          });
          return (
            <Tooltip
              placement="topLeft"
              title={this.intlGetKey(value || 'common.empty').d(value)}
            >
              {this.intlGetKey(value || 'common.empty').d(value)}
            </Tooltip>
          );
        },
      },
    ];
    if (this.state.Permission.includes('e')) {
      columns.push({
        title: this.intlGetKey('ANAL.OPERATION'),
        render: (text, record) => {
          return (
            <Popconfirm
              title={this.intlGetKey('COMM.AYSYWTR')}
              onConfirm={() =>
                this.setState({ action: () => this.deletePeople(record) })
              }
              okText={this.intlGetKey('ANAL.DETERMINE')}
              cancelText={this.intlGetKey('ANAL.CANCEL')}
            >
              <a>{this.intlGetKey('ANAL.REMOVE')}</a>
            </Popconfirm>
          );
        },
      });
    }

    const menu = (
      <Menu onClick={this.handleAction}>
        <Menu.Item key="1">
          <Popconfirm
            title={this.intlGetKey('SYS.AYSYWTRIB')}
            onConfirm={() =>
              this.setState({ action: () => this.handleMenuClick() })
            }
          >
            {this.intlGetKey('APP.BATCH_REMOVE')}
          </Popconfirm>
        </Menu.Item>
        <Menu.Item key="2">{this.intlGetKey('COMM.BATCH_MOVE')}</Menu.Item>
      </Menu>
    );

    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          margin: '20px',
          flex: 1,
        }}
      >
        {
          this.initAddMember()
          // <Modal
          //   className="system-role-add-member_two"
          //   visible={visible}
          //   title={this.intlGetKey('APP.ADD_MEMBER')}
          //   width={688}
          //   onOk={this.addRoleItem}
          //   onCancel={() => this.setState({ visible: false })}
          // >
          //   <TreeSelectAll
          //     type="user"
          //     fetchOffice={queryOfficeByOfficeId}
          //     fetchUser={queryUserByOfficeId}
          //     fetchRoles={queryAllRoles}
          //     fetchUserByName={queryUserByName}
          //     fetchOfficeByName={queryOfficeByOfficeName}
          //     fetchRolesByName={queryAllRoleByName}
          //     fetchOfficeById={getLowerOffice}
          //     onSelect={this.onSelect}
          //   />
          // </Modal>
        }
        <RoleSider
          key={this.state.roleKey}
          intlGetKey={this.intlGetKey}
          Permission={this.state.Permission || []}
          setSelectedItem={this.setSelectedItem}
          onRef={this.onRef}
          updateRoles={this.updateRoles}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <div className="role-table_two">
            <div
              style={{
                height: '25px',
                lineHeight: '25px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {selectedItem.name}
              <Button className="edit-button_two" onClick={this.editMenuClick}>
                {selectedItem.parent_id === 'default'
                  ? this.intlGetKey('COMM.SEE')
                  : this.intlGetKey('COMM.EDIT')}
              </Button>
            </div>
            <Breadcrumb style={{ margin: '15px 0 30px 0' }}>
              <Breadcrumb.Item style={{ color: '#5182E4' }}>
                {this.intlGetKey(selectedItem?.parent_name || 'common.empty')}
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: '#999999' }}>
                {selectedItem.name}
              </Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                display: 'flex',
                margin: '10px 0',
              }}
            >
              <div>
                {selectedItem.name && this.state.Permission.includes('e') && (
                  <>
                    <Button
                      // style={{ margin: '0 10px 0 0 ' }}
                      onClick={() =>
                        this.setState({ action: this.changeVisible(), })
                      }
                      type="primary"
                    >
                      {this.intlGetKey('APP.ADD_MEMBER').d('添加成员')}
                    </Button>
                    {/* <input
                      style={{ width: 10, opacity: 0 }}
                      ref={file}
                      name="fileupload"
                      type="file"
                      onChange={this.handleFileChange}
                    />
                    <Button
                      style={{ margin: '0 10px 0 0 ' }}
                      onClick={this.handleDownLoad}
                      type="primary"
                    >
                      {this.intlGetKey('ASS.DOWNLOAD_TEMPLATE').d('下载模板')}
                    </Button>
                    <Button
                      style={{ margin: '0 10px 0 0 ' }}
                      onClick={this.handleInput}
                      type="primary"
                    >
                      {this.intlGetKey('SYS.IMPORT_ROLE').d('导入角色')}
                    </Button> */}
                  </>
                )}
                {hasSelected && (
                  <Dropdown overlay={menu}>
                    <Button className="adjust-next-office_two">
                      {this.intlGetKey('DISP.BATCH_OPERATION').d('批量操作')} <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              </div>
            </div>
            {hasSelected && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '0 0 10px 0',
                  background: '#e6f7ff',
                  border: ' 1px solid #91d5ff',
                  padding: ' 0 20px',
                  alignItems: 'center',
                  height: '35px',
                }}
              >
                <span>
                  {this.intlGetKey('QUA.SELECTED')} {selectedRowKeys.length} 项,总计{' '}
                  {totalCount} 项
                </span>
                <a onClick={this.clearAllSelect}>
                  {this.intlGetKey('APP.CLEAR_SELECTION')}
                </a>
              </div>
            )}
            <div
              style={{
                overflowY: 'auto',
                height: '80%',
              }}
            >
              <Table
                dataSource={this.state.dataSource}
                columns={columns}
                rowSelection={rowSelection}
                onChange={this.pageChange}
                pagination={{
                  total: totalCount,
                  pageSize: page.pageSize,
                  showSizeChanger: false,
                }}
              />
            </div>
          </div>
        </div>

        {/* {action && (
          <UumTips
            action={action}
            clear={() => this.setState({ action: undefined })}
          />
        )} */}

        {moveToRole && (
          <Modal
            visible
            title={this.intlGetKey('COMM.MOVE_MEMBER')}
            cancelText='取消'
            okText='确认'
            onCancel={this.handleMoveCancle}
            onOk={this.handleUserMove}
          >
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={roleTree}
              placeholder={this.intlGetKey('APP.PSAR')}
              treeDefaultExpandAll
              onChange={this.handleRoleChange}
            />
          </Modal>
        )}
        {/* <UploadSuccessModel
          uploadSuccessModalVisible={this.state.uploadSuccessModalVisible}
          uploadSuccessModalMessage={this.state.uploadSuccessModalMessage}
          successCount={this.state.successCount}
          setModalClose={() => {
            this.setState({ uploadSuccessModalVisible: false });
          }}
        /> */}
      </div>
    );
  }
}

export default Form.create()(RoleTable);
