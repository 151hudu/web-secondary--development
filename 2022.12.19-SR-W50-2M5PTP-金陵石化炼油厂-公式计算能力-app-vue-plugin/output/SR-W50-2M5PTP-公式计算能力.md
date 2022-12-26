<h1 align="center">组件名称</h1>

## 案例配置：

- ##### 案例地址

  > http://10.15.111.16:9094/app/edit?cid=undefined&appid=965041e8-05bc-e1b2-6329-6e8ad31484f5&pId=3c738ede-a690-f8bb-9f7e-256fd6508f42

------

## 配置项

- ##### 无

------

## 逻辑控制

- ##### 事件(events)

  > 事件名称：`传递行数据`

  > 传出参数类型：`对象`

  > 事件传出参数(`4个字段`)：
  
  ```javascript
  {
     material_demand: "27.4387",
         
     material_purchase_auxiliary: "30.1826",
         
     material_purchase_main: "0.0302",
         
     // 以下数据为JSON格式
     formulas:[
         {
           id:"65cf6d4f-e604-4771-887b-33c0fe940649",
           formulaType:"A类",
           formulaName:"公式AAA",
           formulaTemplate:"3.1415926*${D}*${L}*0.001*0.4367",
           formulaContent:"3.1415926*100*200*0.001*0.4367",
           stuffCoefficient:"1.1000",
           stuffDemand:"27.4387",
           stuffPurchase:"30.1826",
           formulaParamsList:[
               {label:"${D}",value:"100"},
               {label:"${L}",value:"200"}
            ],
           formulaRemarks:"备注112"
     		}
     ],
  }
  ```
  
- ##### 动作(actions)

  > 动作名称：`获取行数据`
  
  > 所需参数类型：`对象`
  
  > 动作所需入参：
  
  ```js
  {
      main_unit: "吨",
      auxiliary_unit: "kg",
      material_demand: "27.4387",
      material_purchase_auxiliary: "32.9264",
      material_purchase_main: "0.0329",
      coefficient_transformation: "1",
      parameter_transformation: "1000",
      formulas: [
         {
            id: "65cf6d4f-e604-4771-887b-33c0fe940649",
            formulaType: "A类",
            formulaName: "公式AAA",
            formulaTemplate: "3.1415926*${D}*${L}*0.001*0.4367",
            formulaContent: "3.1415926*100*200*0.001*0.4367",
            stuffCoefficient: "1.1000",
            stuffDemand: "27.4387",
            stuffPurchase: "30.1826",
            formulaParamsList: [
               { label: "${D}", value: "100" },
               { label: "${L}", value: "200" },
            ],
            formulaRemarks: "备注112",
         },
      ],
   }
  ```
  
  