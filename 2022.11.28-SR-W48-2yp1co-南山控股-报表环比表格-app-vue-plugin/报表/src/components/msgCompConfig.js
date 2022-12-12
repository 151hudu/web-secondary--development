// 组件可派发事件
export const events = [
  {
    key: "valueChange",
    name: "加载完成",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "array",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "setValue",
    name: "更新数据(无查询)",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "array",
      },
    ],

    // hasReturn为false则不用写returns选项

  },
  {
    key: "secharFn",
    name: "更新数据(查询)",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "array",
      },
    ],

    // hasReturn为false则不用写returns选项

  }


];

export default {
  actions,
  events,
};
