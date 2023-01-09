import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


export const queryCards = () =>
  request.get(`home/banma/queryCards`,);

  // http://10.15.111.13:9092/sdata/rest/home/banma/queryCards