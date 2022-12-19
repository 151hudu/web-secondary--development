import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

/**
* 查询用户权限资产
* @param id 资产ID
*
*/
export const queryUserByAccount = (id) =>
  request.get(`system/account/queryUserByAccount?account_code=${id}`);

/**  
* 切换权限
* @param id 资产ID
*
*/
export const loginByUserAndCreateCookie = params =>
  request.post(`system/authority/loginByUserAndCreateCookie`, params);