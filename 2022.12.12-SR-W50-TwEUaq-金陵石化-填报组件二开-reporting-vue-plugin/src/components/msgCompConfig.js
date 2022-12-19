// 组件可派发事件
export const events = [
  {
    key: "calculation",
    name: "金额计算事件",
    payload: [
      {
        name: "金额计算",
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
    name: "金额设值",
    isSupportChild: true, // 是否支持子表
    params: [
      {
        key: "value",
        name: "值",
        dataType: "object",
      },
    ],
  },
  {
    key: "getValue",
    name: "取值",
    isSupportChild: true, // 是否支持子表
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "string",
      },
    ],
  },
];

export default {
  actions,
  events,
};
