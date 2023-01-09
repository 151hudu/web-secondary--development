import request from "./request";

/**
 * 查询用户
 * @param id 资产ID
 */
export const user = query =>
  request.get(`/system/authority/user`);
