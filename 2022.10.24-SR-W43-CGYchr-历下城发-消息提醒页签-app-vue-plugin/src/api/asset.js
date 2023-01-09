import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = params =>
  request.post(`/asset/getAssetData?asset_id=${params.asset_id}&count=${params.count}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
export const queryRoleAssetById = id =>
  request.post(`/form/getAssetData?asset_id=${id}`, []);

/**
* 消息中心
* @param pageNum 10
* @param pageSize 1
* @param orderBy "last_modify_time"
* @param orderSort "DESC"
* @param queryParams []
*/
export const querySysInfo = params =>
  request.post(`/sysInfo/queryList`, params);