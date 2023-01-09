import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
    request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);
export const getAssetsData = (id) =>
    request.post(`asset/data?id=${id}`);

export const queryAssetsData = (id) =>
    request.post(`/ext/bxyAi/queryCustomizeList`, id);


export const saveCustomize = (id) =>
    request.post(`ext/bxyAi/saveCustomize`, id);  