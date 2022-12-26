<template>
   <div :style="{ width: '100%', height: '100%' }" class="outermost">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
         <el-form-item label="站点名称：" prop="inputData">
            <el-input v-model="ruleForm.inputData" type="textarea" :rows="5" placeholder="请选择" readonly></el-input>
            <el-button class="add_button" @click="openTableDialog">+ 选择</el-button>
         </el-form-item>
      </el-form>

      <!-- 弹窗 -->
      <el-dialog
         title="选择站点"
         :visible.sync="tableDialogVisible"
         :append-to-body="true"
         custom-class="table_dialog"
         width="85%"
         :show-close="false"
         :close-on-press-escape="false"
         :close-on-click-modal="false"
      >
         <!-- 表格 -->
         <el-table :data="tableDialogData" ref="multipleTable" :row-class-name="tableRowClassName" height="405px" :row-key="saveField" @selection-change="selectTabel">
            <el-table-column type="selection" width="55" align="center" reserve-selection></el-table-column>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column property="substation_no" label="站点编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="province" label="所在省份" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="substation_level" label="重点目标等级" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="substation_name" label="站点名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="voltage_level" label="电压等级" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="organization" label="所属行政机构" width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="principal_id" label="负责人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="square" label="占地面积" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="longitude" label="经度" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="latitude" label="纬度" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="altitude" label="海拔" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="is_inspect" label="是否巡检" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="is_defense" label="是否反无" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="is_video" label="是否电光" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="address" label="地址" align="center" show-overflow-tooltip></el-table-column>
         </el-table>
         <!-- 分页 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
         >
         </el-pagination>
         <!-- 弹窗按钮 -->
         <span slot="footer" class="dialog-footer">
            <el-button @click="clearTableSelect" size="small">取 消</el-button>
            <el-button type="primary" @click="saveTableSelect" size="small">确 定</el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import { getAssetData } from "../api/asset";

export default {
   name: "Add",

   props: {
      customConfig: Object,
   },

   data() {
      return {
         propsConfiguration: this.customConfig.configuration || "{}",
         // 回填值
         data: this.customConfig.data,
         // 配置项
         configuration: {},
         // 资产Id
         assetId: "",
         // 显示字段
         showField: "",
         // 储存字段
         saveField: "",

         ruleForm: {
            inputData: "",
         },
         rules: {
            inputData: [{ required: true, message: "必填!" }],
         },

         // 接口保存的数据
         interfaceData: [],
         // 表格弹窗开关
         tableDialogVisible: false,
         // 表格弹窗数据
         tableDialogData: [],
         // 表格选中数组
         tableSelectList: [],

         // 分页页码
         page: 1,
         // 分页器
         pageSize: 10,
         // 分页总条数
         pageTotal: 0,

         flag: false,
      };
   },

   created() {
      if (process.env.NODE_ENV !== "development") {
         let columnStyle = JSON.parse(this.propsConfiguration);
         // 资产ID
         this.assetId = columnStyle.assetId;
         // 拼接字段
         this.showField = columnStyle.showField;
         // 拼接规则
         this.saveField = columnStyle.saveField;
      } else {
         this.assetId = "ea7c9900-0652-a5a0-2f11-194074ec2957";
         this.showField = "substation_name";
         this.saveField = "substation_no";
      }
   },

   mounted() {
      window?.componentCenter?.register(this.customConfig.componentId, "comp", this, eventActionDefine);
      try {
         this.configuration = JSON.parse(this.propsConfiguration);
      } catch (error) {
         console.error("configuration解析错误", error);
      }
   },

   methods: {
      // 数据转换
      translatePlatformDataToJsonArray(originTableData) {
         let originTableHeader = originTableData.data[0];
         let tableHeader = [];
         originTableHeader.forEach((item) => {
            tableHeader.push(item.col_name);
         });
         let tableBody = originTableData.data[1];
         let tableData = [];
         tableBody.forEach((tableItem) => {
            let temp = {};
            tableItem.forEach((item, index) => {
               temp[tableHeader[index]] = item;
            });
            tableData.push(temp);
         });
         return tableData;
      },

      // 打开表格弹窗
      openTableDialog() {
         this.tableDialogVisible = true;
         this.flag = true;
         this.getTableData();
      },

      // 获取表格数据
      getTableData() {
         getAssetData(this.assetId, this.page, this.pageSize).then((res) => {
            this.tableDialogData = res.data.data;
            this.pageTotal = res.data.count;

            this.$nextTick(() => {
               if (this.interfaceData.length) {
                  this.interfaceData.forEach((key) => {
                     this.tableDialogData.forEach((row) => {
                        if (row[this.saveField] == key) {
                           this.$refs.multipleTable.toggleRowSelection(row, true);
                        }
                     });
                  });
               }
            });
         });
      },

      // 表格隔行变色
      tableRowClassName({ row, rowIndex }) {
         if (rowIndex % 2 === 0) {
            return "row_single";
         } else {
            return "row_double";
         }
      },

      // 切换页码
      handleCurrentChange(val) {
         this.page = val;
         this.getTableData();
      },
      // 改变分页器
      handleSizeChange(val) {
         this.pageSize = val;
         this.getTableData();
      },

      // 表格选中
      selectTabel(value) {
         this.tableSelectList = value;
      },

      // 保存选中的值
      saveTableSelect() {
         this.$refs["ruleForm"].validate((valid) => {
            if (!valid) {
               return false;
            }
         });
         let showStr = [];
         let saveArr = [];

         this.tableSelectList.forEach((item) => {
            showStr.push(item[this.showField]);
            saveArr.push(item[this.saveField]);
         });
         // 保存接口数据
         this.interfaceData = saveArr;
         // 输入框回显
         let _str = showStr.join(",");
         this.ruleForm.inputData = _str;
         // 关闭弹窗
         this.tableDialogVisible = false;
      },

      // 清除选中值
      clearTableSelect() {
         this.tableDialogVisible = false;
      },

      // 触发动作
      do_EventCenter_getValue() {
         let value = this.interfaceData;
         return { value };
      },

      // 校验动作
      do_EventCenter_ruleFormData() {
         this.$refs["ruleForm"].validate((valid) => {
            if (!valid) {
               return false;
            }
         });
      },

      Event_Center_getName() {
         return "瀚元科技-弹窗选择列表";
      },
   },

   destroyed() {
      window?.componentCenter?.removeInstance(this.customConfig.componentId);
   },
};
</script>

<style lang="less">
.outermost {
   // 输入框样式
   .el-textarea__inner {
      color: #fff;
      border: 1px solid rgb(65, 146, 217);
      background: linear-gradient(rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%) !important;
   }
   // 选择按钮
   .add_button {
      width: 100%;
      color: #fff;
      margin-top: 20px;
      background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
      border-image: linear-gradient(135.84deg, #2cdfe8 0%, #1a9ad9 101.5%) 1;
      letter-spacing: 5px;
   }

   .el-form-item__label {
      color: #fff;
      height: 177px;
      line-height: 177px;
      padding: 0;
   }

   .el-form-item__error {
      margin-top: -62px;
   }
}

// 弹窗样式
.table_dialog {
   // 弹窗头部
   .el-dialog__header {
      background: rgb(9, 26, 42);
      border-bottom: 1px solid;
      border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00fff7 100%) 1;
      // 弹窗标题
      .el-dialog__title {
         color: #fff;
      }
   }
   // 弹窗内容
   .el-dialog__body {
      background: rgb(9, 26, 42);
      padding-bottom: 0;
      // 表格整体
      .el-table {
         background: rgb(9, 26, 42);
      }
      // 表格头样式
      .el-table__header {
         th {
            color: #fff;
            border: none;
            height: 35px;
            padding: 0;
            font-size: 12px;
            font-weight: 600;
            background: linear-gradient(0deg, rgb(35, 91, 128) 0%, rgb(39, 83, 111) 100%) !important;
         }
      }
      // 表格行样式
      .el-table__row {
         td {
            color: #fff;
            height: 35px;
            padding: 0;
            border: none;
         }
      }
      // 表格hover行样式
      .el-table tbody tr:hover > td {
         background: linear-gradient(270deg, #578c8f 100% -7.2%, #578c8f 100%) !important;
      }
   }
   // 弹窗底部
   .el-dialog__footer {
      background: rgb(9, 26, 42);
      // 底部按钮
      .el-button {
         color: #fff;
         margin-top: 20px;
         background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
         border-image: linear-gradient(135.84deg, #2cdfe8 0%, #1a9ad9 101.5%) 1;
         letter-spacing: 5px;
      }
   }
   // 去除弹窗底部边框
   .el-table::before {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0px;
   }
   // 分页样式
   .el-pagination {
      text-align: right;
      margin-top: 25px;
      // 分页总数
      .el-pagination__total {
         color: #fff;
      }
      // 分页器
      .el-input__inner {
         color: #fff;
         background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
         border-image: linear-gradient(135.84deg, #2cdfe8 0%, #1a9ad9 101.5%) 1;
      }
      // 上一页下一页按钮
      .btn-prev,
      .btn-next {
         color: #fff;
         border: 1px solid;
         background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
         border-image: linear-gradient(135.84deg, #2cdfe8 0%, #1a9ad9 101.5%) 1;
      }
      // 上一页
      .btn-prev {
         padding-top: 1px;
         padding-right: 7px;
      }
      // 下一页
      .btn-next {
         padding-top: 1px;
         padding-left: 7px;
      }
      // 页码
      .el-pager {
         li {
            color: #fff;
            background-color: transparent;
         }
         .number.active {
            color: #409eff;
            cursor: default;
         }
      }
      // 跳转
      .el-pagination__jump {
         color: #fff;
      }
   }
   // 单行颜色
   .row_single {
      background: rgb(9, 26, 42);
   }
   // 双行颜色
   .row_double {
      background: rgb(27, 56, 65);
   }
}
</style>
