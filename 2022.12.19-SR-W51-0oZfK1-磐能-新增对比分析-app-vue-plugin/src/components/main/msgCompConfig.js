// 组件可派发事件
export const events = [
  // {
  //   key: "valueChange",
  //   name: "值改变",
  //   payload: [
  //     {
  //       name: "值",
  //       key: "value",
  //       dataType: "string"
  //     }
  //   ]
  // }
];

// 组件可接收事件
export const actions = [
  {
    key: "searchInfoDuiBi",
    name: "新增对比分析",
    isSupportChild: false,
    params: [
      {
        name: "电站",
        key: "charcoalId",
        dataType: "string,number,objectArray",
      },
    ],
  },
];

export default {
  actions,
  events,
};
