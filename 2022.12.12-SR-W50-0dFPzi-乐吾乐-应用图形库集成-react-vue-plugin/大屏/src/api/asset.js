import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
export const queryAssetById = (id) =>
  request.get("asset", { params: { asset_id: id } });
// 获取资产数据
export const queryDataByAssetId = (id, params) =>
  request.post(
    `/asset/getAssetData?asset_id=${id}&pageNum=${params.pageNum}&pageSize=${params.pageSize}&count=${params.pageSize}`,
    params.queryParams
  );
  // 根据插件 id 获取插件信息
  export const queryPluginInfo = pluginId =>
  request.get('/plugin/queryConfigById?id=' + pluginId);