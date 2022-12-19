import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

  // 根据插件 id 获取插件信息
export const queryPluginInfo = pluginId =>
request.get('/plugin/queryConfigById?id=' + pluginId);
