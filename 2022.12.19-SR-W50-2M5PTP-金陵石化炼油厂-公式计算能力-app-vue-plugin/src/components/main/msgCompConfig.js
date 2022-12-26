// 组件可派发事件
export const events = [
   {
      key: "passRowData",
      name: "传递行数据",
      payload: [
         {
            name: "值",
            key: "value",
            dataType: "object",
         },
      ],
   },
];

// 组件可接收事件
export const actions = [
   {
      key: "getRowData",
      name: "获取行数据",
      params: [
         {
            key: "value",
            name: "行数据",
            dataType: "object",
         },
      ],
   },
];

export default {
   actions,
   events,
};
