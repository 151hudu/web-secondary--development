// 组件可派发事件
export const events = [
  {
    key: "searchSelect",
    name: "下拉查询值",
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

];

export default {
  actions,
  events
};
