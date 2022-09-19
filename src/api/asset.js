import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const powerCellQuery = (data) => request.post(`/electricitySettlement/powerCell/query`, data);
export const powerCellExport = (data) => request.post(`/electricitySettlement/powerCell/export`, data, { responseType: "blob" });
