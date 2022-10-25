import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const user = query =>
  request.get(`/system/authority/user`);
