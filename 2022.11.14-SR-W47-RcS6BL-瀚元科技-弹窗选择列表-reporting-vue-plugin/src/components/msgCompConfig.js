// 组件可派发事件
export const events = [];

// 组件可接收事件
export const actions = [
   {
      key: "getValue",
      name: "取值",
      hasReturn: true,
      returns: [
         {
            key: "value",
            name: "返回值",
            dataType: "array",
         },
      ],
   },
   {
      key: "ruleFormData",
      name: "校验",
      params: [],
   },
];

export default {
   actions,
   events,
};
