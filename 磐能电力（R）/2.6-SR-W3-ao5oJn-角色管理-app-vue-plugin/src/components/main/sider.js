import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
// import { this.intlGetKeyGetKey } from '@/micro-common/utils';
import {
  Menu,
  Dropdown,
  Button,
  Modal,
  Input,
  Select,
  Tree,
  message,
  Tooltip,
} from 'antd';
import { Icon } from 'sdata-ui';
import Scrollbars from 'react-custom-scrollbars';
import {
  queryAllRole,
  insertRoleGroup,
  deleteRoleGroup,
  insertRole,
  deleteRole,
  queryList4Role,
  queryHeaderTabsByUser,
} from '../../api/system';
import qs from 'querystringify';
// import { queryMenus } from 'common/service/menu';
import './index.less';
import PropTypes from 'prop-types';
// import this.intlGetKey from 'react-this.intlGetKey-universal';
// import UumTips from '../componenets/uum-modal';

const { SubMenu } = Menu;
const { Option } = Select;
const { TreeNode } = Tree;
const FormItem = Form.Item;

class RoleSider extends Component {
  static propTypes = {
    form: PropTypes.object,
    setSelectedItem: PropTypes.func,
    Permission: PropTypes.array,
    onRef: PropTypes.func,
    updateRoles: PropTypes.func,
    key: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.query = qs.parse(window.location.search);
    this.intlGetKey = this.props?.intlGetKey
  }

  state = {
    catalogData: [],
    visible: false,
    title: '',
    type: '',
    name: '',
    id: '',
    roleVisible: false,
    roleTitle: '',
    roleType: '',
    roleId: '',
    roleName: '',
    menuData: [],
    selectMenu: [],
    checkedKeys: [],
    page: {
      pageSize: 10,
      pageNum: 1,
    },

    action: undefined,
  };

  async componentDidMount() {
    this.props.onRef(this);
    await this.loadData();
    this.loadMenuData();
    this.handleClick({
      key: '100000000001',
      keyPath: [this.intlGetKey('default')],
      // keyPath: ['default'],
      item: { props: { title: this.intlGetKey('ROLE.SYSTEM_ADMINISTRATOR') } },
    });
  }

  transformData(data) {
    let names = {
      e: this.intlGetKey('ANAL.EDITABLE'),
      s: this.intlGetKey('ANAL.SHAREABLE'),
      t: this.intlGetKey('ANAL.ENJOYABLE'),
      b: this.intlGetKey('ANAL.AFP'),
      r: this.intlGetKey('ANAL.VIEWABLE_DATA'),
      // {this.intlGetKey.get('COMM.HISTORICAL_VERSION')}
      f: this.intlGetKey('COMM.BACK_OFF'),
      u: this.intlGetKey('COMM.UPGRADE'),
      p: this.intlGetKey('COMM.PACK'),
      i: this.intlGetKey('COMM.INSTALL'),
      d: this.intlGetKey('COMM.UNINSTALL'),
      a: this.intlGetKey('COMM.FILE'),
    };
    let content = [];
    data.map(item => {
      if (item.children && item.children.length > 0) {
        content.push({ ...item, children: this.transformData(item.children) });
      } else if (item.permission) {
        let permission = item.permission.split(',');
        let children = [];
        permission.map(value => {
          children.push({
            id: item.id + '-' + value,
            name: names[value],
            children: [],
          });
        });
        item.children = children;
        content.push(item);
      } else {
        content.push(item);
      }
    });
    return content;
  }

  transformMenuData(data) {
    data.forEach(element => {
      element.id = element.groupId;
      element.name = element.label;
      element.children = this.transformData(element.menuItems);
    });
    return data;
  }

  loadMenuData = async () => {
    // let names = {
    // };
    try {
      const { data } = await queryList4Role();
      const { data: headerData } = await queryHeaderTabsByUser();
      const menuData = this.transformMenuData(data.concat(headerData));
      this.setState({
        menuData,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleClick = e => {

    let openKeys = e.keyPath[e.keyPath.length - 1];
    let { catalogData } = this.state;
    catalogData = catalogData.length != 0 ? catalogData : [{ id: "default", name: "SRG.DEFAULT" }]
    let parent_name = '';
    let parent_id = '';
    catalogData.map(item => {
      if (item.id === openKeys) {
        parent_name = item.name;
        parent_id = item.id;
      }
    });
    this.props.setSelectedItem({
      id: e.key,
      name: e.item.props.title,
      parent_name,
      parent_id,
    });
  };

  loadData = async () => {
    try {
      const { data } = await queryAllRole();
      this.setState({
        catalogData: data,
      });
      this.props.updateRoles(data);
    } catch (err) {
      console.log(err);
    }
  };
  openAddRoleGroupModal = () => {
    this.setState({
      visible: true,
      title: this.intlGetKey('SYS.ARG'),
      type: 'add',
      name: '',
    });
  };

  openAddRoleModal = () => {
    this.setState({
      roleVisible: true,
      roleTitle: this.intlGetKey('ROLE.NEW_ROLE'),
      roleType: 'add',
      roleName: '',
      flag: true,
      checkedKeys: [],
    });
  };

  addNewRoleGroup = async () => {
    const { type, id } = this.state;
    const { getFieldValue } = this.props.form;
    const name = getFieldValue('name');
    if (!name) {
      message.error(this.intlGetKey('COMM.PETRGN').d('请输入角色组名称！'));
      return;
    }
    if (type === 'add') {
      try {
        await insertRoleGroup({ name });
        this.loadData();
      } catch (err) {
        console.log(err);
      }
    }
    if (type === 'edit') {
      try {
        await insertRoleGroup({ name, id });
        this.loadData();
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({
      visible: false,
      title: '',
      type: '',
      name: '',
      id: '',
    });
  };

  addNewRole = () => {
    this.props.form.validateFields(async err => {
      if (!err) {
        let { roleType, selectMenu, roleName, menuData } = this.state;
        const { } = this.state;
        let roleMenuItemList = []
        menuData.forEach((item, i) => {
          item.children.forEach((x, index) => {
            let params = {
              menu_id: x.id,
              privs: x.permission
            };
            roleMenuItemList.push(params)
          })
        })
        // this.setState({
        //   selectMenu,
        // });
        // const roleMenuItemList = selectMenu
        // const roleMenuItemList = selectMenu.map(item => {
        //   if (typeof item.privs === 'object') {
        //     item.privs = item.privs.join(',');
        //   }
        //   return item;
        // });
        if (roleType === 'add') {
          const values = this.props.form.getFieldsValue();
          if (!values.group_id) {
            message.error(this.intlGetKey('COMM.RGCBE').d('角色组不能为空！'));
            return;
          }
          // if (!this.query.hiddenAuth && !roleMenuItemList.length) {
          //   message.error(this.intlGetKey.get('COMM.MPCBE').d('菜单权限不能为空！'));
          //   return;
          // }
          let params = {
            group_id: values.group_id,
            name: values.role_name,
            roleMenuItemList,
          };
          try {
            await insertRole(params);
            message.success(this.intlGetKey('system.roleNew.insertSuccess'));
            this.setState({
              roleTitle: '',
              roleVisible: false,
              roleType: '',
              roleId: '',
              selectMenu: [],
              checkedKeys: [],
            });
            this.loadData();
          } catch (err) {
            message.error(
              err?.data?.message ||
              this.intlGetKey('common.addRoleError').d('添加角色失败')
            );
          }
        }
        if (roleType === 'edit') {
          const { getFieldsValue } = this.props.form;
          const values = getFieldsValue();
          let params = {
            id: roleName.id,
            group_id: values.group_id,
            name: values.role_name,
            roleMenuItemList,
          };
          try {
            await insertRole(params);
            message.success(
              this.state.roleTitle === this.intlGetKey('ROLE.NEW_ROLE')
                ? this.intlGetKey('system.roleNew.insertSuccess')
                : this.intlGetKey('REPO.EDIT_SUCCEEDED')
            );
            this.setState({
              roleTitle: '',
              roleVisible: false,
              roleType: '',
              roleId: '',
              selectMenu: [],
              checkedKeys: [],
            });
            this.loadData();
          } catch (err) {
            message.error(
              err?.data?.message ||
              this.intlGetKey('common.addRoleError').d('添加角色失败')
            );
          }
        }
        this.setState({
          roleVisible: false,
          roleType: '',
          roleTitle: '',
        });
      }
    });
  };

  onSelect = () => { };

  onCheck = (checkedKey, { checked, node }) => {
    checkedKey = checkedKey.checked;
    let set = new Set(checkedKey);
    const { menuData } = this.state;
    console.log(menuData, '<---------tree');
    const eventKey = node.props.eventKey;
    if (checked) {
      if (eventKey.indexOf('-') === -1) {
        menuData.map(i => {
          i.children.map(s => {
            if (s.id === eventKey) {
              let privs = s.permission ? s.permission.split(',') : [];
              set.add(eventKey);
              privs.map(v => set.add(eventKey + '-' + v));
            }
          });
        });
      } else {
        set.add(eventKey.split('-')[0]);
      }
    } else {
      if (eventKey.indexOf('-') === -1) {
        menuData.map(i => {
          i.children.map(s => {
            if (s.id === eventKey) {
              let privs = s.permission ? s.permission.split(',') : [];
              set.add(eventKey);
              privs.map(v => set.delete(eventKey + '-' + v));
            }
          });
        });
        set.delete(eventKey.split('-')[0]);
      }
    }

    let selectMenu = [];
    let temp = [];
    const setValue = new Set();

    set.forEach(value => {
      if (value.indexOf('-') !== -1) {
        temp.push(value);
      } else {
        setValue.add(value);
      }
    });

    for (let item of setValue.keys()) {
      let params = {
        menu_id: item,
        privs: [],
      };
      temp.map(k => {
        let value = k.split('-');
        if (value[0] === item) {
          params.privs.push(value[1]);
        }
      });
      selectMenu.push(params);
    }
    this.setState({
      selectMenu,
      checkedKeys: [...set],
    });
  };

  initAddRoleModal = () => {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              key={item.id}
              title={this.intlGetKey(item.name || 'common.empty').d(item.name)}
              checkable={!item.groupId}
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.id}
            title={this.intlGetKey(item.name || 'common.empty').d(item.name)}
          />
        );
      });

    return (
      this.state.roleVisible && (
        <Modal
          visible={this.state.roleVisible}
          title={this.state.flag ? this.state.roleTitle : this.intlGetKey('APIT.SEE')}
          closable={false}
          footer={
            this.state.flag ? (
              <>
                <Button type="primary" onClick={() => { this.addNewRole(); }}>
                  {this.intlGetKey('ANAL.CONFIRM').d('确认')}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({
                      roleVisible: false,
                      roleType: '',
                      roleTitle: '',
                    });
                  }}
                >
                  {this.intlGetKey('ANAL.CANCEL').d('取消')}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  this.setState({
                    roleVisible: false,
                    roleType: '',
                    roleTitle: '',
                  });
                }}
              >
                {this.intlGetKey('ANAL.CLOSE').d('关闭')}
              </Button>
            )
          }
        >
          <Form {...formItemLayout}>
            <FormItem label={this.intlGetKey('APP.ROLE_NAME')}>
              {getFieldDecorator('role_name', {
                rules: [
                  {
                    required: true,
                    message: this.intlGetKey('COMM.RNCBE').d('角色名不能为空！'),
                  },
                ],
                // initialValue: this.intlGetKeyGetKey(this.state.roleName.name),
                initialValue: this.intlGetKey(this.state.roleName.name),
              })(<Input disabled={!this.state.flag} maxLength={60} />)}
            </FormItem>
            <FormItem label={this.intlGetKey('SYS.ROLE_GROUP')}>
              {getFieldDecorator('group_id', {
                rules: [
                  {
                    required: true,
                    message: this.intlGetKey('COMM.RGCBE').d('角色组不能为空！'),
                  },
                ],
                initialValue: this.intlGetKey(this.state.roleName.parent),
              })(
                <Select disabled={!this.state.flag}>
                  {this.state.catalogData.map((item, index) => {
                    if (item.id === 'default' && !this.state.flag) {
                      return (
                        <Option key={index} value={item.id}>
                          {/* {this.intlGetKeyGetKey(item.name)} */}
                          {this.intlGetKey(item.name)}
                        </Option>
                      );
                    }
                    if (item.id !== 'default') {
                      return (
                        <Option key={index} value={item.id}>
                          {/* {this.intlGetKeyGetKey(item.name)} */}
                          {item.name}
                        </Option>
                      );
                    }
                  })}
                </Select>
              )}
            </FormItem>
            {/* {!this.query.hiddenAuth && (
              <FormItem label={this.intlGetKey.get('SYS.MENU_PERMISSIONS')}>
                {getFieldDecorator('menu_id', {
                   rules: [
                    {
                      required: true,
                      message: this.intlGetKey.get('COMM.MPCBE').d('菜单权限不能为空！'),
                    },
                  ], 
                })
                (
                  <Scrollbars
                    style={{
                      height: '400px',
                    }}
                  >
                    <Tree
                      disabled={!this.state.flag}
                      checkable
                      onSelect={this.onSelect}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                      checkStrictly={true}
                      showLine
                      defaultExpandedKeys={['00']}
                    >
                      {loop(this.state.menuData)}
                    </Tree>
                  </Scrollbars>
                )}
              </FormItem>
            )} */}
          </Form>
        </Modal>
      )
    );
  };

  changeRoleGroupInput = e => {
    this.setState({
      name: e.target.value,
    });
  };
  initAddRoleGroupModal = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      this.state.visible && (
        <Modal
          visible={this.state.visible}
          title={this.state.title}
          closable={false}
          onCancel={() => {
            this.setState({
              visible: false,
              title: '',
              type: '',
            });
          }}
          onOk={this.addNewRoleGroup}
          okText={this.intlGetKey('ANAL.DETERMINE')}
          cancelText={this.intlGetKey('ANAL.CANCEL')}
        >
          <FormItem>
            {getFieldDecorator('name', {
              // initialValue: this.intlGetKeyGetKey(this.state.name),
              initialValue: this.state.name,
            })(
              <Input
                style={{ height: '40px' }}
                placeholder={this.intlGetKey('COMM.PETRGN').d('请输入角色组名称！')}
              />
            )}
          </FormItem>
        </Modal>
      )
    );
  };

  editMenuClick = async id => {
    const { catalogData } = this.state;
    let item = {};
    let flag = true;
    catalogData.map(k => {
      if (k.roleItemList.length) {
        k.roleItemList.map(value => {
          if (value.id === id) {
            if (k.id === 'default') {
              flag = false;
            }
            item = value;
          }
        });
      }
    });
    item.parent = item.group_id;
    let roleMenuItemList = item.roleMenuItemList;
    let checkedKeys = [];
    roleMenuItemList.map(item => {
      checkedKeys.push(item.menu_id);

      if (item.privs) {
        let privs = item.privs.split(',');
        privs.map(k => {
          checkedKeys.push(item.menu_id + '-' + k);
        });
      }
    });
    this.setState({
      roleVisible: true,
      roleTitle: this.intlGetKey('SYS.EDIT_ROLE'),
      roleType: 'edit',
      roleName: item,
      checkedKeys,
      flag,
    });
  };

  moreMenuClick = async (key, item, flag) => {
    item.parent = item.group_id;
    let roleMenuItemList = item.roleMenuItemList;
    if (key === 'edit') {
      let checkedKeys = [];
      roleMenuItemList.map(item => {
        checkedKeys.push(item.menu_id);
        if (item.privs) {
          let privs = item.privs.split(',');
          privs.map(k => {
            checkedKeys.push(item.menu_id + '-' + k);
          });
        }
      });
      this.setState({
        roleVisible: true,
        roleTitle: this.intlGetKey('SYS.EDIT_ROLE'),
        roleType: 'edit',
        roleName: item,
        checkedKeys,
        flag,
        selectMenu: roleMenuItemList,
      });
    }
    if (key === 'delete') {
      try {
        await deleteRole(item.id);
        message.success(this.intlGetKey('COMM.DELETE_SUCCEEDED!').d('删除成功！'));
        this.loadData();
      } catch (e) {
        console.log(e);
        message.error(e.data.message);
      }
    }
  };

  moreSubMenuClick = async (event, item) => {
    if (event.key === 'edit') {
      this.setState({
        visible: true,
        title: this.intlGetKey('SYS.ERG'),
        type: 'edit',
        id: item.id,
        name: item.name,
      });
    }
    if (event.key === 'delete') {
      try {
        if (!item.roleItemList.length) {
          await deleteRoleGroup(item.id);
          message.success(this.intlGetKey('COMM.RGDS').d('删除角色组成功！'));
          this.loadData();
        } else {
          message.error(
            this.intlGetKey('COMM.TARUTCRGWCBD').d('当前角色组下存在角色，不可删除！')
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { catalogData, action } = this.state;
    return (
      <div
        style={{
          width: '256px',
        }}
        className="role-sider_two"
      >
        {this.initAddRoleGroupModal()}
        {this.initAddRoleModal()}
        <div
          style={{
            display: 'flex',
            height: '8%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderWidth: '0 1px 1px 0 ',
            borderStyle: 'solid',
            borderColor: '#E6E6E6',
          }}
        >
          {this.props.Permission.includes('e') && (
            <>
              <Button
                style={{ margin: '0 10px 0 0' }}
                onClick={() =>
                  this.setState({
                    action: this.openAddRoleGroupModal(),
                  })
                }
                className="add-new-button"
              >
                {this.intlGetKey('SYS.ARG').d('新增角色组')}
              </Button>
              <Button
                disabled={this.state.catalogData.length <= 1}
                onClick={() =>
                  this.setState({
                    action: this.openAddRoleModal(),
                  })
                }
                className="add-new-button"
              >
                {this.intlGetKey('ROLE.NEW_ROLE').d('新增角色')}
              </Button>
            </>
          )}
        </div>
        <div
          style={{
            width: 256,
            height: '92%',
            overflow: 'auto',
          }}
        >
          <Menu
            onClick={this.handleClick}
            defaultOpenKeys={['default']}
            defaultSelectedKeys={['100000000001']}
            mode="inline"
          >
            {catalogData &&
              catalogData.map(item => {
                return (
                  <SubMenu
                    key={item.id}
                    title={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Icon
                            style={{ fontSize: '30px', color: '#5182E4' }}
                            type="icon-morenjiaosezu"
                          />
                          <Tooltip
                            title={this.intlGetKey(item.name || 'common.empty').d(item.name)}
                          >
                            <div className="role-new-name_two">
                              {this.intlGetKey(item.name || 'common.empty').d(item.name)}
                            </div>
                          </Tooltip>
                        </div>
                        {item.id !== 'default' &&
                          this.props.Permission.includes('e') && (
                            <>
                              <Dropdown
                                overlay={
                                  <Menu
                                    onClick={event => {
                                      if (event.key === 'delete') {
                                        this.setState({
                                          action: () =>
                                            this.moreSubMenuClick(event, item),
                                        });
                                      } else {
                                        this.moreSubMenuClick(event, item);
                                      }
                                    }}
                                  >
                                    <Menu.Item key="edit">
                                      {this.intlGetKey('ANAL.EDIT')}
                                    </Menu.Item>
                                    <Menu.Item key="delete">
                                      {this.intlGetKey('ANAL.DELETE')}
                                    </Menu.Item>
                                  </Menu>
                                }
                                placement="bottomCenter"
                              >
                                <Icon size={16} type="icon-gengduo" />
                              </Dropdown>
                            </>
                          )}
                      </div>
                    }
                  >
                    {item.roleItemList.map(value => {
                      let flag = true;
                      if (item.id === 'default') {
                        flag = false;
                      }
                      return (
                        <Menu.Item
                          key={value.id}
                          title={this.intlGetKey(value?.name || 'common.empty')
                            .d(value?.name)}
                        >
                          <div
                            style={{
                              padding: '0 10px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span className="sub-content">
                              {this.intlGetKey(value?.name || 'common.empty')
                                .d(value?.name)}
                            </span>
                            {
                              <Dropdown
                                overlay={
                                  <Menu
                                    onClick={({ key }) => {
                                      if (key === 'delete') {
                                        this.setState({
                                          action: () =>
                                            this.moreMenuClick(
                                              key,
                                              value,
                                              flag
                                            ),
                                        });
                                      } else {
                                        this.moreMenuClick(key, value, flag);
                                      }
                                    }}
                                  >
                                    <Menu.Item key="edit">
                                      {flag
                                        ? this.intlGetKey('ANAL.EDIT')
                                        : this.intlGetKey('APIT.SEE')}
                                    </Menu.Item>
                                    {flag && (
                                      <Menu.Item key="delete">
                                        {this.intlGetKey('ANAL.DELETE')}
                                      </Menu.Item>
                                    )}
                                  </Menu>
                                }
                                placement="bottomCenter"
                              >
                                <Icon size={16} type="icon-gengduo" />
                              </Dropdown>
                            }
                          </div>
                        </Menu.Item>
                      );
                    })}
                  </SubMenu>
                );
              })}
          </Menu>
        </div>

        {/* {action && (
          <UumTips
            action={action}
            clear={() => this.setState({ action: undefined })}
          />
        )} */}
      </div>
    );
  }
}

export default Form.create()(RoleSider);
