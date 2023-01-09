import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });
/**
 * 查询直播流
 * @param id 资产ID
 *
 */
export const queryLiveing = id =>
  request.get(`iot/video/queryLiveStreaming?deviceId=${id}&scheme=hls`)
