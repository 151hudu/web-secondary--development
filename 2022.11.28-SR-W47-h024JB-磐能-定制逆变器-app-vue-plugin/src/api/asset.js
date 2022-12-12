import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取表格资产
export const queryAssetByTime = (ids, page, pageSize, startTime, endTime) =>
   request.post(`ext/pndl/getFormData?ids=${ids}&page=${page}&pageSize=${pageSize}&startTime=${startTime}&endTime=${endTime}`);

// 获取图表资产
export const getEcharts = (ids, startTime, endTime) => request.post(`ext/pndl/getEchartData?ids=${ids}&startTime=${startTime}&endTime=${endTime}`);

// 导出图表
export const exportEchartsExcel = (dataForm) => request.post(`ext/pndl/getExportData`, dataForm, { responseType: "blob" });

// 获取提示数据
export const queryRemindInfo = (ids, startTime, endTime) => request.post(`ext/pndl/getYellowData?ids=${ids}&startTime=${startTime}&endTime=${endTime}`);
