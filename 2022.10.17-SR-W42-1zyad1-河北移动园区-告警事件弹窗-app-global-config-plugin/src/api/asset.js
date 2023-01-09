import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);


/**
 * 查询信息
 * @param id 资产ID
 */
export const queryMessage = id =>
request.get(`/remind/queryRemindData?userId=${id}`);

/**
 * 查询信息
 * @param id 资产ID
 */
export const getWarning = id =>
  request.get(`/yidong/getWarning`);