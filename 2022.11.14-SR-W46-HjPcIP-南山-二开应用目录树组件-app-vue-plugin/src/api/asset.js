import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryData = (data) => request.post(`/form/list/model/data/queryData?modelId=${data.params.modelId}`, data.data);
export const queryById = (data) => request.get(`/form/list/model/queryById?modelId=${data.params.modelId}`);
export const queryMenuByOfficeID = (param) => request.get(`/ext/NKTableReport/queryMenuByOfficeID?${param ? 'parkName=' + param : 'parkName'} `);

