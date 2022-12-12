import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 99999) => request.post(`/asset/data?id=${id}`);
