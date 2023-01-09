<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <el-card class="treeLeft">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
    </el-card>
    <div class="tableRight">
      <el-card class="topSearch">
        <div>
          <span class="searchText">姓名：</span>
          <el-input style="width: 180px; margin-right: 10px" size="small" v-model="name" placeholder="姓名"></el-input>
          <span class="searchText">单位名称：</span>
          <el-input style="width: 180px; margin-right: 10px" size="small" v-model="department" placeholder="单位名称"></el-input>
          <span class="searchText">手机：</span>
          <el-input style="width: 180px; margin-right: 10px" size="small" v-model="phone" placeholder="手机"></el-input>
          <span class="searchText">办公电话：</span>
          <el-input style="width: 180px; margin-right: 10px" size="small" v-model="call" placeholder="办公电话"></el-input>
        </div>
        <div class="buttonArray">
          <el-button size="small" type="primary" @click="searchTable" round class="buttonOperation" style="background: #1b79ff">搜索</el-button>
          <el-button size="small" @click="clearSearh" round class="buttonOperation">重置</el-button>
        </div>
      </el-card>
      <el-card>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :header-cell-style="{
            textAlign: 'center',
            padding: '6px 0',
          }"
        >
          <el-table-column align="center" prop="company_name" label="单位"> </el-table-column>
          <el-table-column align="center" prop="duty" label="部门">
            <template>
              <span>{{ handleNodeClickInfo.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名"> </el-table-column>
          <el-table-column align="center" prop="duty" label="职务"> </el-table-column>
          <el-table-column align="center" prop="phone" label="办公电话"> </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机"> </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"> </el-table-column>
        </el-table>
        <span class="total">共{{ total }}条</span>
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout=" prev, pager, next, sizes"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getOfficeList, queryAddressListInfo } from "../../api/asset";
export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object,
    mainInit: Function,
  },
  computed: {},
  data() {
    return {
      //必需，不可删除
      id: "",
      treeData: [],
      department: "",
      phone: "",
      call: "",
      name: "",
      tableData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      handleNodeClickInfo: {},
    };
  },
  mounted() {
    getOfficeList().then((res) => {
      this.treeData = res.data.children;
      console.log(res);
    });
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
  },
  methods: {
    searchTable() {
      let params = {
        officeId: this.handleNodeClickInfo.id,
        asset_id: this.customConfig.asset_id || "09793d83-ebc1-549e-b83b-3364fb51d2ea",
      };
      let message = {
        queryParams: [],
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        orderBy: "",
        orderSort: "",
      };
      if (this.name) {
        let info = {
          colName: "name",
          datatype: 0,
          type: 0,
          value: this.name,
        };
        message.queryParams.push(info);
      }
      if (this.department) {
        let info = {
          colName: "company_name",
          datatype: 0,
          type: 0,
          value: this.department,
        };
        message.queryParams.push(info);
      }
      if (this.phone) {
        let info = {
          colName: "mobile",
          datatype: 0,
          type: 0,
          value: this.phone,
        };
        message.queryParams.push(info);
      }
      if (this.call) {
        let info = {
          colName: "phone",
          datatype: 0,
          type: 0,
          value: this.call,
        };
        message.queryParams.push(info);
      }
      queryAddressListInfo(params, message).then((res) => {
        this.tableData = res.data.results;
        this.total = res.data.totalCount;
        console.log(res);
      });
    },
    clearSearh() {
      this.name = "";
      this.department = "";
      this.phone = "";
      this.call = "";
    },
    handleSizeChange(val) {
      this.searchTable();
    },
    handleCurrentChange(val) {
      this.searchTable();
    },
    handleNodeClick(data) {
      this.handleNodeClickInfo = data;
      this.searchTable();
      console.log(data);
    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
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
<style lang="less" scoped>
.app-secondary {
  display: flex;
  justify-content: space-between;
}
.treeLeft {
  width: 18%;
  height: 900px;
  margin-right: 10px;
  margin-left: 10px;
}
.tableRight {
  width: 80%;
  height: 100%;
  .topSearch {
    width: 100%;
    /deep/.el-card__body {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    margin-bottom: 20px;
    .buttonArray {
      margin-right: 20px;
    }
  }
}
.buttonOperation {
  height: 28px;
  width: 82px;
  padding: 6px 15px !important;
  margin-top: 2px;
}
.searchText {
  font-size: 14px;
  color: #606266;
}
.total {
  font-size: 14px;
  color: #606266;
}
/deep/.btn-prev,
/deep/.btn-next {
  height: 33px !important;
  width: 30px !important;
  border: 1px solid;
  border-radius: 30px;
  padding: 0 0px !important;
}
/deep/.el-pager li {
  height: 33px;
  line-height: 33px;
}
/deep/.el-pagination .el-select .el-input .el-input__inner {
  border-radius: 15px;
  height: 32px;
  line-height: 32px;
}
/deep/.el-tree-node__content {
  border-radius: 4px;
  height: 36px;
  &:hover {
    background: #0454f1;
    color: #fff;
  }
}
/deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: #0454f1;
  color: #fff;
}
/deep/.el-tree-node:focus > .el-tree-node__content {
  background: #0454f1;
  color: #fff;
}
/deep/.el-tree-node__expand-icon {
  font-size: 14px;
}
// /deep/.el-tree-node:focus > .el-tree-node__content {
//   .el-tree-node__expand-icon {
//     color: #fff ;
//   }
// }
</style>
