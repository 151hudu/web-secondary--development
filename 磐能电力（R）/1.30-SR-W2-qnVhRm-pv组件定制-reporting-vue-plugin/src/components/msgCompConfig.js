// 组件可派发事件
export const events = [
  {
    key: "preservation",
    name: "保存事件",
    payload: [
      {
        name: "保存",
        key: "value",
        dataType: "object",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "setValue",
    name: "保存数据",
    isSupportChild: true, // 是否支持子表
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "object",
      },
    ],
  },
  {
    key: "getValue",
    name: "容量求和",
    isSupportChild: true, // 是否支持子表
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "number",
      },
    ],
  },
  {
    key: "getSum",
    name: "开启总计",
    isSupportChild: true, // 是否支持子表
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "number",
      },
    ],
  },
];

export default {
  actions,
  events,
};
