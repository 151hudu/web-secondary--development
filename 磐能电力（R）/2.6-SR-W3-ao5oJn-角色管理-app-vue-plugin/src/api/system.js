import intl from 'react-intl-universal';
import request from './request';
import axios from 'axios';
// import { apiContextPath } from '@/micro-common/utils';
const apiContextPath = ''
export const getAllUser = () => request.get('system/user');

export const getOfficeAllUser = () => request.get('system/user/getAllUser');

/**
 * intl.get('COMM.NEW_USER')
 * @param {*} params
 */
export const addNewUser = params => request.post('system/user', params);

/**
 * intl.get('COMM.AAUTDWTUSIC')
 * @param {*} params
 */
export const querySignPic = () => request.get('/system/property/querySignPic');

/**
 * intl.get('COMM.NEW_USER')(运营)
 * @param {*} params
 */
export const createIndependentUser = params =>
  request.post('/system/user/operation/createIndependentUser', params);
/**
 * intl.get('OPER.ATU')(运营)
 * @param {*} params
 */
export const saveTemporaryUser = params =>
  request.post('/system/user/saveTemporaryUser', params);

/**
 * intl.get('OPER.ATU')(运营)的部门下拉框内容
 * @param {*} params
 */
export const queryDefaultOffice = () =>
  request.get('/system/office/queryDefaultOffice');

/**
 * intl.get('COMM.QIU')
 * @param {*} params
 */
export const queryUserOne = user_id =>
  request.get(`system/user?user_id=${user_id}`);
/**
 * intl.get('COMM.QAU')
 * @param {*} params
 */
export const queryUser = params =>
  request.post('system/user/queryUser ', params);

/**
 * intl.get('COMM.MUI')
 * @param {*} params
 */
export const updateUsers = params =>
  request.post('system/user/updateUsers', params);

/**
 * intl.get('COMM.MUP')
 * @param {*} params
 */
export const modifyUserPassword = params =>
  request.post('system/user/modifyUserPassword', params);

/**
 * intl.get('COMM.GAR')
 * @param {*} params
 */
export const getRole = () => request.get('system/role');

export const queryAllRole = config =>
  request.get('system/role/queryAllRole', config);

/**
 *
 * @param {*} params
 */
export const updateUserInfo = (user_id, no) =>
  request.get(`system/user/updateUserInfo?user_id=${user_id}&no=${no}`);

/**
 *intl.get('COMM.ATR')id数组查询用户
 * @param {*} params
 */
export const queryUsersByRoles = params =>
  request.post(`system/user/queryUsersByRoles`, params);

/**
 *
 */
export const queryUsersByRole = (id, params) =>
  request.post(`system/user/queryUsersByRole?role_id=${id}`, params);

/**
 * intl.get('COMM.ADD')/修改角色组名称
 * params :{
 *  id,
 *  name
 * }
 * @param {*} params
 */

export const insertRoleGroup = params =>
  request.post('system/role/insertRoleGroup', params);

/**
 *  intl.get('COMM.DRG')
 * @param {*} group_id
 */
export const deleteRoleGroup = group_id =>
  request.get(`system/role/deleteRoleGroup?group_id=${group_id}`);

/**
 * intl.get('COMM.ADD')/修改角色名称
 * params :{
 *  id,
 *  name，
 *  roleMenuItemList:[]
 * }
 * @param {*} params
 */

export const insertRole = params =>
  request.post('system/role/insertRole', params);

/**
 *  intl.get('COMM.DELETE_ROLE')
 * @param {*} role_id
 */
export const deleteRole = role_id =>
  request.get(`system/role/deleteRole?role_id=${role_id}`);

/**
 *  intl.get('COMM.QRBG')
 * @param {*} role_id
 */
export const queryRolesByGroupId = id =>
  request.get(`/system/role/queryRolesByGroupId?groupId=${id}`);

/**
 * intl.get('APP.BATCH_REMOVE')/移除成员
 * {
 *  role_id
 *  userIds:[]
 * }
 * @param {*} params
 */
export const deleteUserRole = params =>
  request.post('system/role/deleteUserRole', params);

/**
 * intl.get('APP.ADD_MEMBER')
 * {
 *  role_id
 *  userIds:[]
 * }
 * @param {*} params
 */
export const insertUserRole = params =>
  request.post('system/role/insertUserRole', params);

export const queryAllMenu = () => request.get('system/menu/queryAll');

export const queryExtMenus = () => request.get('system/menu/queryExtMenus');

export const queryList4Role = () => request.get('system/menu/queryList4Role');

export const queryOneLowOfficeWithUserByOfficeId = OfficeId =>
  request.get(
    `system/office/queryOneLowOfficeWithUserByOfficeId?OfficeId=${OfficeId}`
  );

/**
 * intl.get('APP.ADD_MEMBER')
 * {
 *  role_id
 *  userIds:[]
 * }
 * @param {*} params
 */
export const addSubOffice = params =>
  request.post('system/office/addSubOffice', params);

export const removePersonFromOffice = param =>
  request.post(`system/office/removePersonFromOffice`, param);

export const updateOfficeSort = params =>
  request.post('system/office/updateOfficeSort', params);

/**
 * intl.get('COMM.PERMISSION_VERIFICATION')
 */
export const identifyPermission = (code, menuId) =>
  request.get(
    `system/user/identifyPermission?identifyCode=${code}${menuId ? '&menuId=' + menuId : ''
    }`
  );

/**
 * intl.get('COMM.RESIGNATION_HANDOVER')
 */
export const deleteUser = (id, handover_person) =>
  request.get(`system/user/remove?id=${id}&handover_person=${handover_person}`);

/**
 * intl.get('COMM.BRH')
 */
export const batchRemove = (params, handover_person) =>
  request.post(
    `system/user/batchRemove?handover_person=${handover_person}`,
    params
  );

/**
 * intl.get('COMM.QPM')
 */
export const queryMenuByUser = () => request.get(`system/menu/queryMenuByUser`);

/**
 * 顶部菜单
 */
export const queryHeaderTabsByUser = () =>
  request.get('/system/menu/queryHeaderMenuByUser');

export const queryNextionBIHeaderTabsByUser = () =>
  request.get('/system/menu/queryNextionBIHeaderMenu');
/**
 * intl.get('COMM.QHPS')
 */
export const queryList = type =>
  request.get(`system/shortcut/queryList${type ? `?type=${type}` : ''}`);

/**
 * intl.get('COMM.AHPS')
 */
export const insertShortcut = params =>
  request.post(`system/shortcut/insert`, params);

/**
 * intl.get('COMM.DHPS')
 */
export const deleteShortcut = (id, shortcut_add_type) =>
  request.get(
    `system/shortcut/delete?${shortcut_add_type === 0 ? 'shortcut_object_id=' : 'id='
    }${id}&shortcut_add_type=${shortcut_add_type}`
  );

/**
 * intl.get('COMM.EHPS')
 */
export const updateShortcut = params =>
  request.post(`/system/shortcut/update`, params);

// intl.get('COMM.OUM')
export const operationQueryUserById = id =>
  request.get(`system/user/operationQueryUserById?user_id=${id}`);

export const operationChangeUser = params =>
  request.post('system/user/operationChangeUser', params);

export const operationChangeUserPassword = params =>
  request.post('system/user/operationChangeUserPassword', params);

export const operationUpdateUser = params =>
  request.post('system/user/operationUpdateUser', params);

export const operationRemoveUser = (id, handover_person) =>
  request.get(
    `system/user/operationRemoveUser?id=${id}&handover_person=${handover_person}`
  );

export const operationQueryUser = params =>
  request.post('system/user/operation/queryUser', params);

export const queryByCompanyId = (type, params) =>
  request.post(
    `system/user/operation/queryByCompanyId${type ? `?type=${type}` : ''}`,
    params
  );

// {"data_app_id":"xxx",    //{intl.get('APP.APPLICATION')}id
// "menu_id":"xxx",  //{intl.get('COMM.APPLIED_MENU')}id
// "browse_type":"1",  //1{intl.get('REPO.BY')}web访问标志
// "menu_type":"2"}  //{intl.get('COMM.AMT')} 2为应用的菜单

export const buryingPoint = params =>
  request.post('buryingPoint/browseMenu', params);

export const queryByProperty = property =>
  request.get(`system/property/queryByProperty?property=${property}`);

export const login4Datapp = id =>
  request.get(`/system/authority/login4Datapp?datappId=${id}`);

export const queryConfigByType = type =>
  request.get(`system/config/queryConfigByType?type=${type}`);

export const batchUpdateConfig = params =>
  request.post(`/system/config/batchUpdateConfig`, params);

export const querySearchOfficeTree = params =>
  request.post(`system/office/queryPartlyOfficeTree`, params);

const fileDownLoad = (url, name, data) => {
  request({
    url,
    method: 'post',
    responseType: 'blob',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    data,
  })
    .then(function (response) {
      const blob = new Blob([response.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const aEle = document.createElement('a'); // 创建a标签
      const href = window.URL.createObjectURL(blob); // 创建下载的链接
      aEle.href = href;
      aEle.download = name + '.xlsx'; // 下载后文件名
      document.body.appendChild(aEle);
      aEle.click(); // 点击下载
      document.body.removeChild(aEle); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    })
    .catch(err => {
      var reader = new FileReader();
      reader.readAsText(err.data);
    });
};

const fileDownLoadNew = (url, name, data) => {
  axios({
    url,
    method: 'get',
    responseType: 'blob',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    data,
  })
    .then(function (response) {
      const blob = new Blob([response.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const aEle = document.createElement('a'); // 创建a标签
      const href = window.URL.createObjectURL(blob); // 创建下载的链接
      aEle.href = href;
      aEle.download = name + '.xlsx'; // 下载后文件名
      document.body.appendChild(aEle);
      aEle.click(); // 点击下载
      document.body.removeChild(aEle); // 下载完成移除元素
      window.URL.revokeObjectURL(href); // 释放掉blob对象
    })
    .catch(err => {
      var reader = new FileReader();
      reader.readAsText(err.data);
    });
};

// 下载模板
export const downloadAccountTemp = () => {
  fileDownLoad(
    `/system/excelImport/downloadAccountTemp`,
    intl.get('SYS.ACCOUNT_TEMPLATE_NAME'),
    '{}'
  );
};
// 下载组织模板(中文)
export const downloadOrgTemp = () => {
  fileDownLoadNew(
    `${apiContextPath}/storage_area/preset/import_template/cn_office_template.xlsx`,
    '导入组织模板',
    '{}'
  );
};
// 下载组织模板(英文)
export const downloadOrgTempEn = () => {
  fileDownLoadNew(
    `${apiContextPath}/storage_area/preset/import_template/office_template.xlsx`,
    'office_template',
    '{}'
  );
};
// 下载角色模板(中文)
export const downloadRoleTemp = () => {
  fileDownLoadNew(
    `${apiContextPath}/storage_area/preset/import_template/cn_role_template.xlsx`,
    '导入角色模板',
    '{}'
  );
};
// 下载角色模板(英文)
export const downloadRoleTempEn = () => {
  fileDownLoadNew(
    `${apiContextPath}/storage_area/preset/import_template/role_template.xlsx`,
    'role_template',
    '{}'
  );
};

// intl.get('COMM.QAO')(以列表的形式展示)
export const queryAllOffice = params =>
  request.post(`system/office/queryAllOffice`, params);

// http://192.168.1.240:43227/sdata/rest/system/user/queryUsersByName?userName={intl.get('COMM.LI_CHENG')}
export const searchUser = username =>
  request.get(`system/user/queryUsersByName?userName=${username}`);
// intl.get('COMM.FRA')
export const queryRecentUseApp = () =>
  request.get(`homePage/queryRecentUseApp`);
// intl.get('COMM.QSARUBU')
export const queryRecentUsedApp = () =>
  request.get(`/homePage/queryRecentUsedApp`);

// intl.get('COMM.QOD')
export const queryOfficeById = id =>
  request.get(`/system/office/queryTotalByOfficeId?OfficeId=${id}`);

export const queryOfficeTableById = (id, params) =>
  request.post(`/system/office/queryStaffByOfficeId?OfficeId=${id}`, params);

// intl.get('COMM.QAUOTUC')
export const queryUsersByCompanyId = () =>
  request.get(`system/user/queryUsersByCompanyId`);

export const querySystemVersion = () => request.get(`system/config/getVersion`);
// intl.get('COMM.ROPQI')
export const queryOfficeByOfficeId = officeId =>
  request.get(
    `system/office/queryCountByOfficeId${officeId ? `?OfficeId=${officeId}` : ''
    }`
  );

export const queryUserByOfficeId = officeId =>
  request.get(
    `/system/office/queryStaff${officeId ? `?OfficeId=${officeId}` : ''}`
  );
export const queryStaffV2OfficeId = (officeId, userId) =>
  request.get(
    `/system/office/queryStaffV2${officeId
      ? `?OfficeId=${officeId} ${userId ? '&accountCode=' + userId : ''}`
      : userId
        ? '?accountCode=' + userId
        : ''
    }`
  );
export const queryAllRoles = () => request.get('system/role/queryAllRole');

export const queryUserByName = userName =>
  request.get(`system/user/getUserLikeName?userName=${userName}`);

export const queryOfficeByOfficeName = officeName =>
  request.get(`system/office/queryByOfficeName?officeName=${officeName}`);

export const queryAllRoleByName = role_name =>
  request.get(`system/role/queryAllRoleByName?role_name=${role_name}`);

// intl.get('COMM.ACCOUNT_NUMBER')
export const queryAllAccount = params =>
  request.post(`/system/account/queryAll`, params);
export const queryAccountByCode = account_code =>
  request.get(
    `/system/account/queryAccountByCode?account_code=${account_code}`
  );
export const queryUserByAccount = account_code =>
  request.get(
    `/system/account/queryUserByAccount?account_code=${account_code}`
  );
export const addAccount = params =>
  request.post(`/system/account/create`, params);
export const batchRemoveAccount = (code, handover_person) =>
  request.post(
    `/system/account/batchDeleteAccount?handover_person=${handover_person}`,
    code
  );

export const modifyAccountPassword = params =>
  request.post(`/system/account/modifyAccountPassword`, params);

export const updateLoginFlag = params =>
  request.post(`/system/account/updateLoginFlag`, params);

export const loginByUser = params =>
  request.post(`/system/authority/loginByUserAndCreateCookie`, params);

// intl.get('COMM.BMUUR')
export const updateUserRoles = params =>
  request.post(`/system/user/updateUserRoles`, params);

// intl.get('COMM.GACNUTCO')
export const getLowerOffice = officeId =>
  request.get(`system/office/getLowerOffice?officeId=${officeId}`);

// 全局css列表查询
export const cssConfigQueryList = params =>
  request.post(`/cssConfig/queryList`, params);

// 全局css新增一项
export const cssConfigAdd = params => request.post(`/cssConfig/add`, params);

// 全局css更新
export const cssConfigUpdate = params =>
  request.post(`/cssConfig/update`, params);

// 全局css删除某一项
export const cssConfigDelete = id => request.get(`/cssConfig/delete?id=${id}`);

// 查询授权码及是否为用户订阅模式和运行态
export const queryLicenseMode = () => request.get(`/license/queryLicenseMode`);

// 同意隐私声明
export const insertPrivacyApprove = version =>
  request.post(`/homePage/insertPrivacyApprove?version=${version}`);

// 查询是否同意隐私声明
export const queryPrivacyApprove = version =>
  request.get(`/homePage/queryPrivacyApprove?version=${version}`);

// license账户管理列表查询
export const queryAllAuthAccount = params =>
  request.post(`/system/account/queryAllAuthAccount`, params);
// license帐户管理解绑
export const unbindAuthCode = params =>
  request.post(`/system/account/unbindAuthCode`, params);
// license帐户管理绑定
export const bindAuthCode = params =>
  request.post(
    `/system/account/bindAuthCode?accountCode=${params?.accountCode}`
  );
/**
 * 新版sso相关接口
 */

// 查询sso信息
export const querySsoInfo = params =>
  request.post(`/sso/server/queryAll`, params);

// 新增sso信息
export const createSsoInfo = params =>
  request.post(`/sso/server/create`, params);

// 转换启用状态
export const changeSsoStatus = params =>
  request.post(`/sso/server/changeStatus`, params);

// 删除sso
export const deleteSso = id => request.get(`/sso/server/delete?id=${id}`);

// 获取sso配置
export const isSso = ssoType =>
  request.get(`/sso/server/isSso?ssoType=${ssoType}`);

// 单点登录
export const ssoLoginNew = params =>
  request.post(
    `/sso/server/login?ssoType=${params?.ssoType}&token=${params?.token
    }&tenant=${params?.tenant}&appId=${params?.appid}`
  );

// 埋点
export const behaviorLog = params => request.post(`/ext/behavior/log`, params);
// export const behaviorLog = params => {
//   console.log(params);
// };
