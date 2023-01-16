import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
// export const queryAssetById = id =>
//   request.post(`/form/getAssetData?asset_id=${id}`, []);



//报表环比接口
export const reportModelTwo = params =>
  request.post(`/ext/NKTableReport/reportModelTwo`, params);

//导出接口


export const linkRelativeRatioExport = params =>
  request.post(`ext/NKTableReport/linkRelativeRatioExport`, params, { responseType: 'blob' });