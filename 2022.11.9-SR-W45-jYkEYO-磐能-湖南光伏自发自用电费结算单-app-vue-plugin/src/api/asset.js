import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
// 查询报表
export const queryDataDetail = (params) => request.post(`/ext/bill/queryDataDetail?form_id=${params.form_id}&id=${params.id}`);
// 更新报表
export const saveData = (params, data) => request.post(`/ext/bill/saveData?form_id=${params.form_id}&id=${params.id}`, data);
// 导出模板查询
export const queryViewTableInfo = (params) => request.get(`/formView/queryViewTableInfo?view_id=${params.view_id}`);
// 导出模板查询
export const queryAll = (params) => request.get(`/system/property/queryAll`);
// 导出模板查询
export const exportTempleDetailData = (params, data) =>
  request.post(`/form/exportTempleDetailData?form_id=${params.form_id}&view_id=${params.view_id}&template_id=${params.template_id}&export_type=${params.export_type}`, data);
export const uploadPic = (data) => request.post(`/image/uploadPic?category=4`, data);
export const img2pdf = (data) => request.post(`/bill/img2pdf`, data);
