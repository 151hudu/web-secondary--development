import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
export const logout = (id) => request.get(`/system/authority/logout`);
export const getMenuData = (appId, menuId) =>
  request.get(
    "/datapp/queryConfigSummary?datappId=" + appId + "&menuId=" + menuId
  );
export const queryApplyInfoList = (id, params) =>
  request.post(`/sysInfo/queryApplyInfoList?apply_id=${id}`, params);
export const externalConfirm = (id, agree) =>
  request.get(`external/confirm?id=${id}&agree=${agree}`);
export const setRead = (id) => request.get(`sysInfo/read?id=${id}`);


export const userQuery = () => request.get(`system/authority/user`);

export const queryNotification = (params) => request.post('/sysInfo/queryList', params)


export const getCode = () => request.get('systhirdapp/user/getCode')
