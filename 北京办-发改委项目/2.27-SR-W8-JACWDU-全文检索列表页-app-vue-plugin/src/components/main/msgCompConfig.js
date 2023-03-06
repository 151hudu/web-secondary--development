// 组件可派发事件
export const events = [
  {
    key: "wordClick",
    name: "文章点击",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "object"
      }
    ]
  },
  {
    key: "titleClick",
    name: "收藏历史点击",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "object"
      }
    ]
  }
];

// 组件可接收事件
export const actions = [
  // {
  //   key: "setValue",
  //   name: "设值",
  //   params: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string"
  //     }
  //   ],
  //   hasReturn: false,
  //   // hasReturn为false则不用写returns选项
  //   returns: [
  //     {
  //       key: "value",
  //       name: "值",
  //       dataType: "string"
  //     }
  //   ]
  // }
];

export default {
  actions,
  events
};
