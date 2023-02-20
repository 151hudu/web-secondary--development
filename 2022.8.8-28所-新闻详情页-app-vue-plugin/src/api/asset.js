import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.get(`ext/news/queryNewsById?dataId=${id}`, []);
// 查询评论
export const queryComments = (id) => request.get(`ext/news/queryComments?objectId=${id}`, []);
// 点赞
export const addLike = (data) => request.post(`news/addLike`, data);
// 收藏
export const addNewsCollect = (data) => request.post(`news/addNewsCollect`, data);
// 取消喜欢
export const deleteLike = (data) => request.post(`news/deleteLike`, data);
// 取消收藏
export const deleteNewsCollect = (data) => request.post(`news/deleteNewsCollect`, data);
// 新增评论
export const addNewsComments = (data) => request.post(`news/addNewsComments`, data);
// 分享
export const share = (data) => request.post(`ext/news/share`, data);
// 查询组织架构
export const queryOfficeUser = (data) => request.post(`system/office/queryOfficeUser`, {});
// 查询右侧信息
export const queryRightSideDetail = (data) => request.post(`ext/secondary-rightside/queryRightSideDetail`, data);
