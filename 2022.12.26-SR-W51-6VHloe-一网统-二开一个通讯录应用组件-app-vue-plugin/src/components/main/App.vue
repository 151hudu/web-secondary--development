<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <el-card class="treeLeft" v-if="!PCflag">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
    </el-card>
    <div class="tableRight" v-if="!PCflag">
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
          <el-table-column align="center" prop="office_id" label="部门">
            <template>
              <span>{{ handleNodeClickInfo.office_id }}</span>
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
    <div v-if="PCflag" class="mobile">
      <el-tree :load="loadNode" lazy :data="treeData" class="mobileTree" :props="defaultProps" @node-click="(data, node) => handleNodeClickMobile(data, node)" icon-class=" ">
        <span class="custom-tree-node" slot-scope="{ node, data }" :style="{ height: data.photo ? '42px' : '26px' }">
          <svg
            v-show="node.level == 1"
            style="margin-right: 4px"
            t="1676972100071"
            class="icon"
            viewBox="0 0 1152 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2769"
            width="16"
            height="16"
          >
            <path
              d="M832.001792 1024 703.931008 1024C686.292864 1024 672.011968 1009.634157 672.011968 991.912992L672.011968 671.992883C672.011968 654.493802 657.818272 639.905875 640.30944 639.905875L511.728864 639.905875C494.456448 639.905875 480.026336 654.271718 480.026336 671.992883L480.026336 991.912992C480.026336 1009.412074 465.73568 1024 448.107296 1024L320.03648 1024C249.63248 1024 192.047872 966.777248 192.047872 896.189408L192.047872 608.117139C192.047872 590.292077 177.64176 575.890189 159.87088 575.890189L65.761664 575.890195C-4.996928 575.890202-21.087904 535.565418 29.396 485.822272L484.57296 37.324086C535.102112-12.463664 616.91216-12.419056 667.40192 37.32409L1122.63168 485.822272C1173.16672 535.610022 1156.844704 575.890202 1086.276608 575.890195L992.167424 575.890189C974.37776 575.890189 959.9904 590.318685 959.9904 608.117139L959.9904 896.189408C959.9904 966.791424 902.687968 1024 832.001792 1024ZM895.986176 895.969789 895.986176 607.968115C895.986176 554.84671 939.01024 511.749059 992.167424 511.749062L1057.764736 511.646176 622.486528 82.909619C596.893024 57.700752 555.086048 57.693706 529.491008 82.907011L93.447264 511.749069 159.87088 511.749062C213.010976 511.749059 256.052128 554.821862 256.052128 607.968115L256.052128 895.969789C256.052128 931.052589 284.83936 959.749062 320.03648 959.749062L416.02208 959.749062 416.02208 671.828208C416.02208 618.943536 458.929344 575.749062 511.728864 575.749062L640.30944 575.749062C693.332064 575.749062 736.016192 619.146765 736.016192 671.828208L736.016192 959.749062 832.001792 959.749062C867.367872 959.749062 895.986176 931.179763 895.986176 895.969789Z"
              fill="#3798F5"
              p-id="2770"
            ></path>
          </svg>
          <svg
            v-show="node.expanded && node.level != 1 && !data.photo"
            t="1676972907637"
            style="margin-right: 4px"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3821"
            width="14"
            height="14"
          >
            <path d="M928 576h-832c-35.2 0-64-28.8-64-64s28.8-64 64-64h832c35.2 0 64 28.8 64 64s-28.8 64-64 64z" fill="#3798F5" p-id="3822"></path>
          </svg>
          <svg
            v-show="!node.expanded && node.level != 1 && !data.photo"
            t="1676973196444"
            style="margin-right: 4px"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4854"
            width="14"
            height="14"
          >
            <path
              d="M928 448H576V96c0-35.2-28.8-64-64-64s-64 28.8-64 64V448H96c-35.2 0-64 28.8-64 64s28.8 64 64 64H448v352c0 35.2 28.8 64 64 64s64-28.8 64-64V576h352c35.2 0 64-28.8 64-64s-28.8-64-64-64z"
              fill="#3798F5"
              p-id="4855"
            ></path>
          </svg>
          <img style="margin-right: 4px" :src="`${nowLoction}/${data.photo}`" v-show="data.photo" width="34px" height="30px" alt="" />
          <span :style="{ verticalAlign: data.photo ? '-1px' : '2px' }">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <van-dialog v-model="dialogShow" class="callDialog" title="人员基本信息" width="90%" style="height: 500px; overflow: hidden" :showCancelButton="false" show-cancel-button>
      <div class="dialogContent">
        <div>
          <span class="spanLeft">单位</span>
          <span>{{ this.handleNodeClickInfo.company_name }}</span>
        </div>
        <div>
          <span class="spanLeft">部门</span>
          <span>{{ this.handleNodeClickInfo.office_id }}12321321323132131231212321312312321312312</span>
        </div>
        <div>
          <span class="spanLeft">姓名</span>
          <span>{{ this.handleNodeClickInfo.name }}</span>
        </div>
        <div>
          <span class="spanLeft">职务</span>
          <span>{{ this.handleNodeClickInfo.duty }}</span>
        </div>
        <div>
          <span class="spanLeft">办公电话</span>
          <span>{{ this.handleNodeClickInfo.phone }}</span>
        </div>
        <div>
          <span class="spanLeft">手机</span>
          <span>{{ this.handleNodeClickInfo.mobile }}</span>
        </div>
        <div>
          <span class="spanLeft">邮箱</span>
          <span>{{ this.handleNodeClickInfo.emal }}</span>
        </div>
      </div>
    </van-dialog>
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
      handleNodeClickInfo: {
        children: [],
      },
      PCflag: true,
      dialogShow: false,
      nowLoction: window.location.origin,
    };
  },
  mounted() {
    this.PCflag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    getOfficeList().then((res) => {
      this.treeData = res.data.children;
      // mock
      // this.treeData[0].children = [
      //   {
      //     children: [
      //       {
      //         children: [],
      //         count: 0,
      //         hasChild: false,
      //         id: "0e1ed254-4b94-11ed-bb09-0050568274c9",
      //         layout: 0,
      //         member_num: 0,
      //         name: "无锡车联网小镇",
      //         officeType: "dept",
      //         origin: 0,
      //         parentId: "2936cbf0-4b9a-11ed-bb09-0050568274c9",
      //         parentIds: "2936cbf0-4b9a-11ed-bb09-0050568274c9,ddf338df39e94395b9d41a90bd50794f,123456789",
      //         sort: 0,
      //         userItems: [],
      //       },
      //     ],
      //     count: 0,
      //     hasChild: false,
      //     id: "4e1e54d0deb742ce985b3ed227556d3b",
      //     layout: 0,
      //     member_num: 0,
      //     name: "111111直属园区",
      //     officeType: "dept",
      //     origin: 0,
      //     parentId: "123456789",
      //     parentIds: "123456789",
      //     userItems: [],
      //   },
      // ];
      console.log(this.treeData);
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
    },
    handleNodeClickMobile(data, node) {
      console.log(data, node);
      this.handleNodeClickInfo = data;
      this.searchTable();
      if (data.photo) {
        this.dialogShow = true;
      }
    },
    loadNode(node, resolve) {
      console.log(node);
      if (node.id == 0) {
        node.data = {
          children: [],
        };
      }
      let params = {
        officeId: node.data.id,
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
      if (!node.data.photo) {
        queryAddressListInfo(params, message).then((res) => {
          return resolve([...new Set(node.data?.children.concat(res.data.results))].reverse());
        });
      } else {
        return resolve([]);
      }
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
  overflow-y: scroll;
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
}
.mobile {
  width: 100%;
}
.mobileTree {
  /deep/.el-tree-node__content {
    height: auto;
    padding-top: 12px;
  }
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
// /deep/.el-tree-node:focus > .el-tree-node__content {
//   .el-tree-node__expand-icon {
//     color: #fff ;
//   }
// }
</style>
<style lang="less">
.callDialog {
  .van-dialog__content {
    height: 100%;
    .dialogContent {
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      div {
        display: flex;
        justify-content: space-between;
        padding: 0 25px;
      }
      .spanLeft {
        white-space: nowrap;
      }
    }
  }
  .van-dialog__header {
    padding-top: 20px !important;
    font-weight: 600 !important;
    line-height: 24px;
    text-align: center;
    font-size: 18px;
  }
  .van-dialog__footer {
    position: fixed !important;
    width: 100% !important;
    bottom: 0 !important;
    .van-button__text {
      color: dodgerblue;
      font-size: 20px;
      letter-spacing: 3px;
    }
    .van-button {
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }
}
</style>
