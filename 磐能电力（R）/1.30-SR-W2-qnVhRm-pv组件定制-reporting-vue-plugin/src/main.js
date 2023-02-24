import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Input,
  InputNumber,
  Select,
  Option,
  Form, Button,
  Table,
  TableColumn,
  FormItem,
  RadioGroup,
  RadioButton,
  Dialog,
  Loading,
  Switch
} from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(Loading.directive);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
// Vue.prototype.$loading = Loading.service;
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

  const customConfig = {
    componentId: "111",
    data: "111",
    saveValue: [],
    component: {
      columnStyle: {
        title: "二开测试title"
      }
    },
    formConfig: {
      form_name: "二开数据"
    }, detailInfo: {
      dataId: '20736839-3bd7-11ed-a476-fa163ef64e5f'
    },
    onChange: values => {
      console.log(values);
    },
    changeConfiguration: values => {
      console.log(values);
    },
    // configuration: JSON.stringify({})
    //pv
    configuration: JSON.stringify({
      "assetId": "7a09dcfd-8b35-5387-f742-f9bbbfee1274", "placeholder": "pv设置", column0: '逆变器id', column1: 'PV回路', column2: '状态', column3: '容量',
      primaryKey: 'data_id', foreignKey: 'parent_id', onlyKey: 'equipment_id', loopPV: 'PV', state: 'status',
      capacity: 'capacity', assetName: 'f16ef14c-890f-4764-a6c3-f9f1daf824c7'
    })
    //mppt
    // configuration: JSON.stringify({
    //   "assetId": "a3a4c473-eadf-4aeb-b16d-43cb79f8136e", "placeholder": "pv设置", column0: '逆变器id', column1: 'PV回路', column2: '状态', column3: '容量',
    //   primaryKey: 'data_id', foreignKey: 'parent_id', onlyKey: 'equipment_id', loopPV: 'MPPT', state: 'status',
    //   capacity: 'capacity', assetName: '286feae8-cdb4-4e5d-ada0-271d5ac78d20'
    // })
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          {appArr.map((item, index) => {
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
          })}
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
    (dom, props) => {
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

