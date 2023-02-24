import request from './request';

/**
 * intl.get('COMM.QUL')
 *
 * @param {}} params
 */
export const queryUsers = params => request.get('system/user', { params });

/**
 * intl.get('COMM.ATU')Id删除用户
 *
 * @param {*} id
 */
export const deleteUserById = id => request.post('system/user/delete', id);

/**
 * intl.get('COMM.ADD_USER')
 *
 * @param {*} params
 */
export const addUser = params => request.post('system/user', params);

/**
 * intl.get('COMM.UPDATE_USER')
 *
 * @param {*} params
 */
export const updateUser = params => request.post('system/user', params);

/**
 * intl.get('COMM.QCLUI')
 */
export const queryUser = params =>
  request.get('/system/authority/user', {
    params,
    useCache: true,
    cacheDuration: 3000,
  });

/**
 * intl.get('COMM.QOGRC')
 */
export const getInviteCode = () =>
  request.get('system/user/generateInviteCode');

/**
 * intl.get('COMM.URCV')
 */
export const updateInviteCode = () => request.post('recommend/update');

/**
 * intl.get('COMM.BRC')
 */
export const bindInviteCode = params =>
  request.post('system/user/bindInviteCode', params);

/**
 * intl.get('COMM.QTRATTRC')
 */
export const queryRecommendUserByCode = code =>
  request.get(`recommend/query?recommend_code=${code}`);

/**
 * intl.get('COMM.IRPIEFTC')
 */
export const insertBrowserRecord = channel =>
  request.post(
    `/system/authority/register/insertBrowserRecord?channel=${channel}`
  );

/**
 * system/user/identifyPermission?menuId=xxx
 */
export const identifyPermission = (identifyCode, menuId) =>
  request.get(
    `system/user/identifyPermission?identifyCode=${identifyCode}${menuId ? '&menuId=' + menuId : ''
    }`
  );
