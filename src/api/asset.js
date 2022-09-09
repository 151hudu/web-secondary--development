import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 创建会议
export const create = (data) => request.post(`/customize/conference/create?data_id=${data.data_id}&type=${data.type}`);
// 临时资源添加
export const add_resources = (data,message) => request.post(`/customize/conference/add_resources?conference_id=${data}`, message);
// 会议录制
export const record = (data) => request.post(`/customize/conference/record`, data);
// 线路切换
export const change_ipv = (data) => request.post(`/customize/conference/change_ipv`, data);
// 主席切换
export const change_main = (data) => request.post(`/customize/conference/change_main`, data);
// 快速发言
export const say = (data) => request.post(`/customize/conference/say`, data);
// 重呼
export const recall = (data) => request.post(`/customize/conference/recall`, data);
// 预监(提前检测会场画面)
export const preview = (data) => request.post(`/customize/conference/preview`, data);
// 麦克风切换
export const mic_all = (data) => request.post(`/customize/conference/mic_all`, data);
// 查询视频资源列表
export const video_list = (data) => request.post(`/customize/conference/video_list`, data);
// 扬声器控制
export const change_all_loudspeaker = (data) => request.post(`/customize/conference/change_all_loudspeaker`, data);
// 切换上屏
export const up_screen = (data) => request.post(`/customize/conference/up_screen`, data);
// 窗口布局
export const window_layout = (data) => request.post(`/customize/conference/window_layout`, data);
// 结束会议
export const finish = (data) => request.post(`/customize/conference/finish`, data);
// 挂断资源（踢出会议）
export const hangup = (data) => request.post(`/customize/conference/hangup`, data);
// 屏幕模板布局
export const screen_template_layout = (data) => request.post(`/customize/conference/screen_template_layout`, data);
// 屏幕模板切换
export const change_screen_template = (data) => request.post(`/customize/conference/change_screen_template`, data);
