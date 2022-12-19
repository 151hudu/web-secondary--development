import request from "./request";

/**
 * 登录
 */
export const fetchLogin = (params = {}) =>
    request.get(`sdata/rest/ext/zebraWisdom/oneCheckLogin?openId=${params.openid}`)

export const fetchUser = () =>
    request.get(`sdata/rest/system/authority/user`);