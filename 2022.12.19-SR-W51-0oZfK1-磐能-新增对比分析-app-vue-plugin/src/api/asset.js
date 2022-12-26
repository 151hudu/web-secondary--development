import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const compareAnalyse = (data) => request.post(`/pn/data/compareAnalyse`, data);
