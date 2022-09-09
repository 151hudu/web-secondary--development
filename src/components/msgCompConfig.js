// 组件可派发事件
export const events = [
  {
    key: "change",
    name: "内容改变",
    payload: [
      {
        name: "内容",
        key: "value",
        dataType: "string",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  // {
  //   key: "setEvent_name",
  //   name: "设置预案名称",
  //   isSupportChild: true, // 是否支持子表
  //   params: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string",
  //     },
  //   ],
  // },
  {
    key: "setMeeting_room",
    name: "选择会议室",
    params: [
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
