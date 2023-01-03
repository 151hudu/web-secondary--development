import request from "./request";

// 查询资产
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 查询用户列表
export const queryUserList = () => request.get(`system/user`);

// 发起流程-列表数据
export const queryListGroupByType = (dataForm) => request.post(`flow/v2/queryListGroupByType`, dataForm);

// 创建人
export const querySystemOffice = (id) => request.get(`system/office?createMember=${id}`);
// 查询金额接口
export const queryMoneyData = (dataForm) => request.post(`flow/custom/queryFormColumn`, dataForm);
// 撤回接口
export const eventRevoke = (id) => request.get(`flow/v2/instance/revoke?id=${id}`);
// 删除接口
export const deleteEventRevoke = (id) => request.get(`flow/v2/instance/revoke/delete?id=${id}`);
// 同意
export const handleAndModify = (dataForm) => request.post(`flow/v2/instance/handleAndModify`, dataForm);
// 下拉按钮
export const handleDropButton = (dataForm) => request.post(`/flow/custom/instance/handleAndModify`, dataForm);
// 事件类型
export const queryAllType = () => request.get(`flow/v2/queryAllType`);

// 待我处理-列表数据
export const queryPendingHandleTasks = (dataForm) => request.post(`flow/v2/instance/queryAccountPendingHandleTasks`, dataForm);
// 我已处理-列表数据
export const queryAlreadyHandle = (dataForm) => request.post(`flow/v2/instance/queryHandledTasks`, dataForm);
// 我发起的-列表数据
export const queryMyInitiated = (dataForm) => request.post(`flow/v2/instance/queryApplyFlowInstances`, dataForm);
// 抄送我的-列表数据
export const querySendMy = (dataForm) => request.post(`flow/v2/instance/queryNotifyFlowInstances`, dataForm);
