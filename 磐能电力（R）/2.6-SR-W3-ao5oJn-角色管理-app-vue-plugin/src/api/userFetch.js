import intl from 'react-intl-universal';
import request from "./request";
/**
 * Created by magic on 2017/8/8.
 * intl.get('COMM.URI')
 */
// import { FetchApi } from '@/micro-common/Transform';
// import PopupTips from '@/micro-common/PopupTips';
export const queryUserAll = () => request.get(`system/user`,);
export const postUser = (params) => request.post(`system/user`,);
export const deleteUser = (use_id) => request.post(`system/user/delete`, use_id);
export const searchUser = (user_name) => request.get(`system/user/queryUsersByName?userName=${user_name}`,);


// export const queryUserAll = function(callback) {
//   let param = {
//     url: `system/user`,
//     method: {
//       method: 'GET',
//       cache: 'reload',
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.result);
//     } else {
//       PopupTips('error', intl.get('COMM.AUQ'), data.message);
//     }
//   });
// };

// export const postUser = function(data, callback) {
//   let url = `system/user`;
//   if ('code' in data) {
//     if ('type' in data && data.type === 'weixinyanzheng') {
//       url = `system/user/mobile?code=${data.code}&type=${data.type}`;
//     }
//   }
//   let param = {
//     url: url,
//     method: {
//       method: 'POST',
//       cache: 'reload',
//       body: JSON.stringify(data),
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.message);
//     } else {
//       PopupTips('error', intl.get('COMM.UMU'), data.message);
//     }
//   });
// };

// export const deleteUser = function(use_id, callback) {
//   let param = {
//     url: 'system/user/delete',
//     method: {
//       method: 'POST',
//       cache: 'reload',
//       body: use_id,
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.message);
//     } else {
//       PopupTips('error', intl.get('COMM.UMD'), data.message);
//     }
//   });
// };

// intl.get('COMM.FUNS')
// export const searchUser = function(user_name, callback) {
//   let param = {
//     url: `system/user/queryUsersByName?userName=${user_name}`,
//     method: {
//       method: 'GET',
//       cache: 'reload',
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.result);
//     } else {
//       PopupTips('error', intl.get('COMM.NOWF'));
//     }
//   });
// };
