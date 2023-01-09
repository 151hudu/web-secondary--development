import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Option,
  RadioGroup,
  RadioButton,
  Switch,
  Menu, MenuItem, Submenu, Drawer, Form, FormItem, Button, MessageBox,
  Message, Pagination, DatePicker, Dropdown, DropdownMenu, DropdownItem,
  Dialog, Descriptions, DescriptionsItem, Table, TableColumn, Input, Row, Col,
  InputNumber, Select, Upload, Tooltip, Popconfirm, Popover
} from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Switch);
Vue.use(Popconfirm);
Vue.use(Row);
Vue.use(Col);
Vue.use(Popover);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(DatePicker);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(InputNumber);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Tooltip);
Vue.prototype.$message = Message;
// Vue.use(Element);

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "设计页组件", type: "set" },
    { title: "设计页属性组件", type: "designConfiguration" },
    { title: "新增/编辑 主表组件", type: "add" },
    { title: "新增/编辑 主表多字段组件", type: "addMultiple" },
    { title: "新增/编辑 子表组件", type: "child" },
    { title: "列表页组件", type: "table" },
    { title: "详情页组件", type: "preview" }
  ];
  let temp = [{
    "data_id": "",
    "plan_name": "计划计划",
    "plan_number": "2022-301W01",
    "plan_type": "月度",
    "applicant": "1234567890",
    "applicant_unit": "123456789",
    "subunit": "",
    "applicant_date": "2022-12-23",
    "quality_record_number": "AWF323434",
    "mode_type": "Plan",
    "whether_signature": '0',
    "person_of_signature": [],
    "tasks": [{
      "data_id": "",
      "project_name": "任务aaa",
      "project_type": "A",
      "parent_id": "",
      "function_area": "区域1",
      "associated_devices": "设备1",
      "requirement_for_construction": "标准11",
      "remark": "备注",
      "file": "/stopere/werere/sd.pdf",
      "mode_type": "Task",
      "procedures": [{
        "data_id": "",
        "process_name": "工序1vbbb",
        "remark": "",
        "parent_id": "",
        "mode_type": "Procedure",
        "steps": [{
          "data_id": "",
          "process_desc": "步骤1awd",
          "parent_id": "",
          "unit_engineering_quantity": "小时",
          "quantity_engineering_quantity": "3",
          "mode_type": "Step"
        }],
        "materials": [{
          "data_id": "",
          "parent_id": "",
          "material_name": "物料A1ad",
          "material_code": "ASF334",
          "standard_materials": "标准AB",
          "additional_note": "备注",
          "main_unit": "个",
          "auxiliary_unit": "个",
          "material_demand": "3",
          "material_purchase_main": "",
          "material_purchase_auxiliary": "",
          "whether_workshop_supply": "",
          "mode_type": "Material",
          "demand_state":
            "{\"purchase_auxiliary_state\":true,\"demand_state\":true,\"purchase_main_state\":true}"
        }, {
          "data_id": "",
          "parent_id": "",
          "material_name": "物料A2ad",
          "material_code": "ASF334",
          "standard_materials": "标准AB",
          "additional_note": "备注",
          "main_unit": "个",
          "auxiliary_unit": "个",
          "material_demand": "3",
          "material_purchase_main": "",
          "material_purchase_auxiliary": "",
          "whether_workshop_supply": "",
          "mode_type": "Material",
          "demand_state":
            "{\"purchase_auxiliary_state\":true,\"demand_state\":true,\"purchase_main_state\":true}"
        },
        {
          "data_id": "",
          "parent_id": "",
          "material_name": "物料A3ad",
          "material_code": "ASF334",
          "standard_materials": "标准AB",
          "additional_note": "备注",
          "main_unit": "个",
          "auxiliary_unit": "个",
          "material_demand": "3",
          "material_purchase_main": "",
          "material_purchase_auxiliary": "",
          "whether_workshop_supply": "",
          "mode_type": "Material",
          "demand_state":
            "{\"purchase_auxiliary_state\":true,\"demand_state\":true,\"purchase_main_state\":true}"
        }
        ]
      }
      ]
    }]
  }]
  const customConfig = {
    componentId: "111",
    data: JSON.stringify(temp),
    // data: '',
    saveValue: [],
    component: {
      columnStyle: {
        title: "二开测试title"
      }
    },

    formConfig: {
      form_name: "二开数据"
    },
    onChange: values => {
      console.log(values);
    },
    changeConfiguration: values => {
      console.log(values);
    },
    configuration: "{\"allowClear\":true,\"size\":\"大\",\"placeholder\":\"444\"}"
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          <App
            style={{ width: "100%" }}
            customConfig={customConfig}
            type='add'
          />
          {/* {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}：</span>
                <App
                  style={{ width: "calc(100% - 220px)" }}
                  customConfig={customConfig}
                  type={item.type}
                />
              </div>
            );
          })} */}
        </div>
      );
    }
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props, _, eventBus) => {
      eventBus.on((props) => {
        console.log(props, '====a');
        const component = new Vue({
          render: (h) => <App type={props.type} customConfig={props} />,
        }).$mount();
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        dom.appendChild(component.$el);
      });
      if (dom.childNodes.length == 0) {
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App type={props.type} customConfig={props || {}} />
        }).$mount(div);
      }


    }
  );
}




