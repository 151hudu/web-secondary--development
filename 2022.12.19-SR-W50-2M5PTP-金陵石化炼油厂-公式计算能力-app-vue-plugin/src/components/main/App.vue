<template>
   <div :id="id" ref="app-secondary" class="outermost">
      <!-- <el-button type="primary" @click="do_EventCenter_getRowData">计算</el-button> -->
      <!-- 外层整体 -->
      <el-dialog :visible.sync="outDialogIsShow" append-to-body :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog_outer">
         <!-- 表格 -->
         <div class="outer_table">
            <el-table :data="outDialogTableData" stripe border :header-cell-style="{ color: '#000' }">
               <el-table-column prop="formulaType" label="公式类型" align="center"></el-table-column>
               <el-table-column prop="formulaName" label="公式名称" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
               <el-table-column label="公式模板" align="center" width="150" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                     {{ fiflterParams(scope.row.formulaTemplate) }}
                  </template>
               </el-table-column>
               <el-table-column prop="formulaContent" label="公式内容" align="center" width="150" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                     {{ fiflterParams(scope.row.formulaContent) }}
                  </template>
               </el-table-column>
               <el-table-column prop="stuffCoefficient" label="材料消耗系数" align="center"></el-table-column>
               <el-table-column prop="stuffDemand" label="材料需求量" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
               <el-table-column prop="stuffPurchase" label="材料采购量(副单位)" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
               <el-table-column label="操作" width="100" align="center" fixed="right">
                  <template slot-scope="scope">
                     <el-button type="text" @click="openInnerDialog(scope.row)">编辑</el-button>
                     <el-button type="text" @click="deleteInnerData(scope.row)">删除</el-button>
                  </template>
               </el-table-column>
            </el-table>
            <!-- 表格新增按钮 -->
            <el-button class="outer_addbutton" type="primary" @click="openInnerDialog">新增公式</el-button>
         </div>
         <!-- 单位转换 & 转换关系 -->
         <div class="outer_conversion_box">
            <!-- 单位转换 -->
            <el-row :gutter="20">
               <el-col :span="3" class="box_unit_title">
                  <div>单位转换</div>
               </el-col>
               <el-col :span="10" class="box_unit_row">
                  <div>主单位：</div>
                  <el-input v-model="rowData.main_unit" placeholder="主单位" readonly></el-input>
               </el-col>
               <el-col :span="10" class="box_unit_row">
                  <div>副单位：</div>
                  <el-input v-model="rowData.auxiliary_unit" placeholder="副单位" readonly></el-input>
               </el-col>
            </el-row>
            <!-- 转换关系 -->
            <el-row :gutter="20">
               <el-col :span="3" class="box_unit_title">
                  <div>转换关系</div>
               </el-col>
               <el-col :span="7" class="box_unit_row">
                  <div>{{ rowData.coefficient_transformation }}</div>
                  <el-input v-model="rowData.main_unit" placeholder="主单位名称" readonly></el-input>
               </el-col>
               <el-col :span="1" class="box_unit_row">
                  <div>=</div>
               </el-col>
               <el-col :span="6" class="box_unit_row">
                  <el-input v-model="rowData.parameter_transformation" placeholder="转换参数" readonly></el-input>
               </el-col>
               <el-col :span="6" class="box_unit_row">
                  <el-input v-model="rowData.auxiliary_unit" placeholder="副单位名称" readonly></el-input>
               </el-col>
            </el-row>
         </div>
         <!-- 汇总计算 -->
         <div class="outer_summy_button">
            <el-button type="primary" size="small" @click="summyAll">汇总计算</el-button>
         </div>
         <!-- 计算输入框 -->
         <div class="outer_summy_box">
            <div class="outer_input">
               <div>材料需求量：</div>
               <el-input v-model="stuffDemandAll" placeholder="材料需求量" readonly></el-input>
            </div>
            <div class="outer_input">
               <div>材料采购量(副单位)：</div>
               <el-input v-model="stuffPurchaseAll" placeholder="材料采购量(副单位)" readonly></el-input>
            </div>
            <div class="outer_input">
               <div>材料采购量(主单位)：</div>
               <el-input v-model="stuffPurchaseMainAll" placeholder="材料采购量(主单位)" readonly></el-input>
            </div>
         </div>
         <!-- 外层弹窗底部按钮 -->
         <div slot="footer" class="outer_button">
            <el-button size="small" type="primary" @click="saveOuterDialogData">确 定</el-button>
            <el-button size="small" @click="clearOuterDialogData">取 消</el-button>
         </div>
         <!-- 内层弹窗 -->
         <el-dialog :visible.sync="innerDialogIsShow" append-to-body :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog_inner">
            <!-- 下拉选择 -->
            <el-row :gutter="20">
               <el-col :span="3" class="inner_select_title">
                  <div>公式类型</div>
               </el-col>
               <el-col :span="9" class="inner_select">
                  <el-select v-model="formulaTypeSelect" placeholder="请选择" @change="formulaTypeChange" clearable>
                     <el-option v-for="(item, index) in formulaTypeData" :key="index" :label="item.type_of_formula" :value="item.type_of_formula"> </el-option>
                  </el-select>
               </el-col>
               <el-col :span="3" class="inner_select_title">
                  <div>公式名称</div>
               </el-col>
               <el-col :span="9" class="inner_select">
                  <el-select v-model="formulaNameSelect" placeholder="请选择" @change="formulaNameChange" clearable @clear="clearInnerDialogData">
                     <el-option v-for="(item, index) in formulaNameData" :key="index" :label="item.formula_name" :value="item.formula_name"> </el-option>
                  </el-select>
               </el-col>
            </el-row>
            <!-- 公式模板 -->
            <el-row :gutter="20" class="inner_template">
               <el-col :span="3">公式模板</el-col>
               <el-col :span="9">{{ formulaShowTemplate }}</el-col>
            </el-row>
            <!-- 参数 -->
            <el-row :gutter="20" class="inner_params">
               <el-col :span="3" class="title">参数：</el-col>
               <div class="row_box">
                  <el-col :span="24" class="params_content" v-for="(item, index) in formulaParamsList" :key="index">
                     <div class="content_title">{{ fiflterParams(item.label) }} ：</div>
                     <el-input v-model="item.value"></el-input>
                  </el-col>
               </div>
            </el-row>
            <!-- 备注 -->
            <el-row :gutter="20" class="inner_remarks">
               <el-col :span="3" class="title">备注：</el-col>
               <el-col :span="24" class="row_box">{{ formulaRemarks }}</el-col>
            </el-row>
            <!-- 底部按钮 -->
            <div slot="footer" class="outer_button">
               <el-button size="small" type="primary" @click="saveInnerDialogData">确 定</el-button>
               <el-button size="small" @click="clearInnerDialogData(true)">取 消</el-button>
            </div>
         </el-dialog>
      </el-dialog>
   </div>
</template>

<script>
// 引入接口文件
import { getFormulaType, getFormulaName } from "../../api/asset";
// 引入CSS文件
import "./index.less";

export default {
   name: "Main",

   props: {
      customConfig: Object,
      info: Object,
      appVariables: Array,
      sysVariables: Array,
      themeInfo: Object,
      intlGetKey: Function,
      history: Object,
      mainInit: Function,
   },

   data() {
      return {
         id: "",

         // 物料
         rowData: {},

         // 外层弹窗开关
         outDialogIsShow: false,
         // 内层弹窗开关
         innerDialogIsShow: false,

         // 外层表格数据
         outDialogTableData: [],

         // 公式类型
         formulaTypeSelect: "",
         // 公式类型选项数据
         formulaTypeData: [],
         // 公式名称
         formulaNameSelect: "",
         // 公式名称选项数据
         formulaNameData: [],
         // 公式模板
         formulaTemplate: "",
         // 公式模板展示
         formulaShowTemplate: "",
         // 公式模板列表
         formulaParamsList: [],
         // 备注
         formulaRemarks: "",

         // 材料需求量总量
         stuffDemandAll: "",
         // 材料采购量(副单位)总量
         stuffPurchaseAll: "",
         // 材料采购量(主单位)总量
         stuffPurchaseMainAll: "",

         // 当前消耗系数
         nowStuffCoefficient: "",
         // 当前编辑行数据
         nowHandleRowData: null,
      };
   },

   mounted() {
      //此方法封装了事件注册，不可删除
      this.mainInit(this);
   },

   methods: {
      // 获取UUID
      get_UUID() {
         return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(16);
         });
      },

      // 获取公式类型选择器数据
      getFormulaTypeData() {
         getFormulaType().then((res) => {
            this.formulaTypeData = res.data;
         });
      },

      // 编辑内层弹窗数据
      openInnerDialog(row) {
         // 如果是编辑页
         if (row.formulaTemplate) {
            this.nowHandleRowData = row;
            this.formulaTypeSelect = row.formulaType;
            this.formulaNameSelect = row.formulaName;
            this.formulaTemplate = row.formulaTemplate;
            this.formulaShowTemplate = this.fiflterParams(row.formulaTemplate);
            this.formulaRemarks = row.formulaRemarks;
            this.formulaParamsList = row.formulaParamsList;
            this.nowStuffCoefficient = row.stuffCoefficient;

            getFormulaName(row.formulaType).then((res) => {
               this.formulaNameData = res.data;
            });
         } else {
            this.nowHandleRowData = null;
         }
         this.innerDialogIsShow = true;
      },

      // 删除内层弹窗数据
      deleteInnerData(row) {
         this.outDialogTableData.forEach((item, index) => {
            if (item.id == row.id) {
               this.outDialogTableData.splice(index, 1);
            }
         });
      },

      // 公式类型选中
      formulaTypeChange(value) {
         getFormulaName(value).then((res) => {
            this.formulaNameData = res.data;

            this.formulaNameSelect = "";
            this.formulaTemplate = "";
            this.formulaShowTemplate = "";
            this.formulaParamsList = [];
            this.formulaRemarks = "";
         });
      },

      // 公式名称选中
      formulaNameChange(value) {
         this.formulaNameData.forEach((item) => {
            if (item.formula_name == value) {
               let template = item.formula;
               this.formulaTemplate = template;
               this.formulaShowTemplate = this.fiflterParams(template);
               this.nowStuffCoefficient = item.material_consumption_oefficient;
               // 生成参数列表
               this.analysisParamsList();
               // 获取备注
               this.formulaRemarks = item.note;
            }
         });
      },

      // 清除内层弹窗数据
      clearInnerDialogData(type) {
         this.formulaNameSelect = "";
         this.formulaNameData = [];
         this.formulaTemplate = "";
         this.formulaShowTemplate = "";
         this.formulaParamsList = [];
         this.formulaRemarks = "";
         this.nowHandleRowData = null;
         // 点击取消
         if (type) {
            this.formulaTypeSelect = "";
            this.innerDialogIsShow = false;
         }
      },

      // 清除外层弹窗数据
      clearOuterDialogData() {
         this.stuffDemandAll = "";
         this.stuffPurchaseAll = "";
         this.stuffPurchaseMainAll = "";
         this.nowHandleRowData = null;

         this.outDialogTableData = [];

         this.outDialogIsShow = false;
      },

      // 保存内层弹窗数据
      saveInnerDialogData() {
         if (this.innnerDialogRules()) {
            let contentStr = this.formulaTemplate;
            // 替换模板中参数
            this.formulaParamsList.forEach((item) => {
               contentStr = contentStr.replace(item.label, `${item.value}`);
            });

            // 添加数据
            let formulaData = {
               id: this.get_UUID(),
               // 公式类型
               formulaType: this.formulaTypeSelect,
               // 公式名称
               formulaName: this.formulaNameSelect,
               // 公式模板
               formulaTemplate: this.formulaTemplate,
               // 公式内容
               formulaContent: contentStr,
               // 材料消耗系数
               stuffCoefficient: this.nowStuffCoefficient,
               // 材料需求量
               stuffDemand: eval(contentStr).toFixed(4),
               // 材料采购量
               stuffPurchase: "",
               // 参数列表
               formulaParamsList: this.formulaParamsList,
               // 备注
               formulaRemarks: this.formulaRemarks,
            };
            // 计算材料采购量
            formulaData.stuffPurchase = Number(formulaData.stuffCoefficient) * Number(formulaData.stuffDemand);
            formulaData.stuffPurchase = formulaData.stuffPurchase.toFixed(4);

            if (this.nowHandleRowData) {
               this.outDialogTableData.forEach((item) => {
                  if (item.id == this.nowHandleRowData.id) {
                     item.formulaType = formulaData.formulaType;
                     item.formulaName = formulaData.formulaName;
                     item.formulaTemplate = formulaData.formulaTemplate;
                     item.formulaContent = formulaData.formulaContent;
                     item.stuffCoefficient = formulaData.stuffCoefficient;
                     item.stuffDemand = formulaData.stuffDemand;
                     item.stuffPurchase = formulaData.stuffPurchase;
                     item.formulaParamsList = formulaData.formulaParamsList;
                     item.formulaRemarks = formulaData.formulaRemarks;
                  }
               });
            } else {
               this.outDialogTableData.push(formulaData);
            }

            // 关闭弹窗
            this.innerDialogIsShow = false;
            // 清空弹窗数据
            this.clearInnerDialogData(true);
         }
      },

      // 保存外层弹窗数据
      saveOuterDialogData() {
         if (!this.stuffPurchaseMainAll) {
            this.$message.warning("请先进行汇总计算");
            return;
         }
         // 判断是否可以进行汇总计算
         if (!this.outDialogTableData.length) {
            this.stuffDemandAll = "";
            this.stuffPurchaseAll = "";
            this.stuffPurchaseMainAll = "";
            this.nowHandleRowData = null;
            this.$message.warning("请先新增公式");
            return;
         }
         this.summyAll();

         let eventParams = {
            material_demand: this.stuffDemandAll,
            material_purchase_auxiliary: this.stuffPurchaseAll,
            material_purchase_main: this.stuffPurchaseMainAll,
            formulas: this.outDialogTableData,
         };

         let { componentId } = this.customConfig || {};
         window?.eventCenter?.triggerEvent(componentId, "passRowData", {
            value: eventParams,
         });

         this.outDialogIsShow = false;
      },

      // 解析参数列表
      analysisParamsList() {
         // 获取公式模板中参数
         let templateField = this.formulaTemplate.match(/\$\{[a-zA-Z]+\}/g);
         // 生成参数列表数据
         this.formulaParamsList = templateField.map((item) => {
            return { label: item, value: "" };
         });
      },

      // 过滤参数
      fiflterParams(str) {
         str = str.replace(/\$\{/g, "");
         str = str.replace(/\}/g, "");
         return str;
      },

      // 汇总计算
      summyAll() {
         // 判断是否可以进行汇总计算
         if (!this.outDialogTableData.length) {
            this.$message.warning("请先新增公式");
            return;
         }
         let _stuffDemand = 0;
         let _stuffPurchase = 0;
         let _stuffPurchaseMain = 0;
         this.outDialogTableData.forEach((item) => {
            _stuffDemand += Number(item.stuffDemand);
            _stuffPurchase += Number(item.stuffPurchase);
         });
         // 计算采购需求量汇总
         this.stuffDemandAll = _stuffDemand.toFixed(4);
         // 计算采购量(副单位)汇总
         this.stuffPurchaseAll = _stuffPurchase.toFixed(4);
         // 计算采购量(主单位)汇总
         _stuffPurchaseMain = Number(this.stuffPurchaseAll) / Number(this.rowData.parameter_transformation);
         this.stuffPurchaseMainAll = _stuffPurchaseMain.toFixed(4);
      },

      // 内层弹窗校验
      innnerDialogRules() {
         // 校验公式类型
         if (!this.formulaTypeSelect) {
            this.$message.error("请选择公式类型");
            return false;
         }
         // 校验公式模板
         if (!this.formulaNameSelect) {
            this.$message.error("请选择公式名称");
            return false;
         }
         // 校验模板
         for (let i in this.formulaParamsList) {
            if (!this.formulaParamsList[i].value) {
               this.$message.error(`请输入 ${this.formulaParamsList[i].label} 参数`);
               return;
            }
         }
         return true;
      },

      // 注册逻辑控制
      triggerEvent(eventName, payload) {
         let { componentId, appId } = this.customConfig || {};
         componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
      },

      // 触发动作
      do_EventCenter_getRowData(value) {
         // 清除外层弹窗遗留数据
         this.clearOuterDialogData();

         console.log("value--->", value);
         this.rowData = value.value;

         // this.rowData = {
         //    main_unit: "吨",
         //    auxiliary_unit: "kg",
         //    material_demand: "27.4387",
         //    material_purchase_auxiliary: "32.9264",
         //    material_purchase_main: "0.0329",
         //    coefficient_transformation: "1",
         //    parameter_transformation: "1000",
         //    formulas: [
         //       {
         //          id: "65cf6d4f-e604-4771-887b-33c0fe940649",
         //          formulaType: "A类",
         //          formulaName: "公式AAA",
         //          formulaTemplate: "3.1415926*${D}*${L}*0.001*0.4367",
         //          formulaContent: "3.1415926*100*200*0.001*0.4367",
         //          stuffCoefficient: "1.1000",
         //          stuffDemand: "27.4387",
         //          stuffPurchase: "30.1826",
         //          formulaParamsList: [
         //             { label: "${D}", value: "100" },
         //             { label: "${L}", value: "200" },
         //          ],
         //          formulaRemarks: "备注112",
         //       },
         //    ],
         // };

         // 外层弹窗数据回显
         if (this.rowData.formulas) {
            this.outDialogTableData = this.rowData.formulas;
         }
         this.stuffDemandAll = this.rowData.material_demand;
         this.stuffPurchaseAll = this.rowData.material_purchase_auxiliary;
         this.stuffPurchaseMainAll = this.rowData.material_purchase_main;

         // 获取公式类型选择器数据
         this.getFormulaTypeData();

         // 打开外层弹窗
         this.outDialogIsShow = true;
      },

      //必需，不可删除
      Event_Center_getName() {
         return this.id;
      },
   },

   beforeDestroy() {
      window.componentCenter?.removeInstance(this.customConfig?.componentId);
   },
};
</script>
