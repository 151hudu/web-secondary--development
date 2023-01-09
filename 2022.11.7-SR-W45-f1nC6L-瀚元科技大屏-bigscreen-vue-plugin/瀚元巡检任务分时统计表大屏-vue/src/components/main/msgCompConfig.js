// 组件可派发事件
export const events = [];

// 组件可接收事件
export const actions = [
  {
    key: "setValue",
    name: "图表渲染",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string"
      }
    ], Return: false
    // // hasReturn为false则不用写returns选项
    // returns: [
    //   {
    //     key: "value",
    //     name: "值",
    //     dataType: "string"
    //   }
    // ]
  }
];

export default {
  actions,
  events
};
