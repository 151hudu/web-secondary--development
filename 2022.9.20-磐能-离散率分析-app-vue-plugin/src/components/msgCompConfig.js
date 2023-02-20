// 组件可派发事件
export const events = [];

// 组件可接收事件
export const actions = [
  {
    key: "getIds",
    name: "获取树形控件ID",
    params: [
      {
        key: "value",
        name: "ids",
        dataType: "string",
      },
    ],
  },
];

export default {
  actions,
  events,
};
