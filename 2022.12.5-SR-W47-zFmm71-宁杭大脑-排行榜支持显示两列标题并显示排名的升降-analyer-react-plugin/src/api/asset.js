import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const roadSectionRank = (params) => request.get(`/ext/ShowRanking/ShowRanking`);
