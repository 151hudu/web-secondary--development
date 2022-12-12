// 组件可派发事件
export const events = [
  {
    key: "leftMenuClick",
    name: "菜单点击",
    payload: [
      {
        name: "菜单信息",
        dataType: "object",
        key: "value",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "showMenu",
    name: "菜单显示隐藏",
    isSupportChild: false,
    // params: [
    //   {
    //     name: "trueOrFalse",
    //     key: "trueOrFalse",
    //     dataType: "string",
    //   },
    // ],
  },
];

export default {
  actions,
  events,
};
