import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
* 查询资产
* 
*/
export const selectUserQueryData = () =>
  request.get(`/CommonStatements/queryData`);

/**
 * 统计报表导出
 * @param id 资产ID
 * @param date 时间
 */
export const exportReports = () =>
  request.get(`/CommonStatements/exportExcel`, { responseType: 'blob' });