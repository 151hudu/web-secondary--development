<template>
  <div class="preview-root">
    <div class="table_enclosure">
      <el-table :data="dataTable" header-row-class-name="tbale_header_two" max-height="630" v-loading="loading">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="文件名称" prop="FileName" align="center" min-width="200px"></el-table-column>
        <el-table-column label="时间" prop="AddDate" align="center">
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.AddDate) }}</span>
          </template></el-table-column
        >
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="onLinePreview(scope.row, dataTable)" type="text" size="small"> 在线预览 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      >
      </el-pagination>
    </div>

    <viewer :images="imgData">
      <img v-for="src in imgData" class="timeImg" :key="src" :src="src" />
    </viewer>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import { RadioButton, RadioGroup, Tree, Table, TableColumn, Pagination, Button, Dialog, Upload ,Loading} from "element-ui";
import Vue from "vue";
import utils from "@/utils";
import tempData from "../utils/tree.js";
import qs from "querystringify";
import { queryAssetById, queryMenuTree, queryAccessoryData, getFileStream, userQuery } from "../api/asset";
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Tree);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Upload);
Vue.use(VueViewer);
Vue.use(Loading);
export default {
  name: "Preview",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      //业务代码
      defaultValue: "",
      styleEle: null,
      currentPage4: 1,
      dialogVisible: false,
      dataTable: [],
      dataALLTemp: [],
      dataTableTemp: [],
      pageSize: 5,
      dataAll: [],
      pageTotal: 0,
      imgSrc: "",
      imgData: [],
      loading: false,
    };
  },
  mounted() {
    console.log(this.customConfig);
    let message = JSON.parse(this.customConfig?.configuration)?.asset;
    let info = [
      {
        column: "GroupGuid",
        datatype: 0,
        type: 10,
        compareObj: this.customConfig.detailInfo?.dataId,
      },
    ];
    this.loading = true;
    queryAssetById(message, info)
      .then((res) => {
        this.loading = false;
        this.dataAll = utils.translatePlatformDataToJsonArray(res);
        this.dataTable = this.dataAll.slice(0, this.currentPage4 * this.pageSize);
        this.pageTotal = this.dataAll.length;
        this.dataTable.forEach((x, i) => {
          x.dom_index = i + 0;
        });
        this.imgData = [];
        let promiseArr = [];
        this.dataAll.forEach((item, index) => {
          item.dom_index = index + 0;
          this.imgData.push(item.new_path);
        });
      })
      .catch((err) => {
        this.loading = false;
      });
  },
  methods: {
    handleSizeChange(val) {
      this.dataTable = this.dataAll.slice((this.currentPage4 - 1) * val, (this.currentPage4 - 1) * val + val);
      this.dataTable.forEach((x, i) => {
        x.dom_index = i + (this.currentPage4 - 1) * val;
      });
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.dataTable = this.dataAll.slice((val - 1) * this.pageSize, (val - 1) * this.pageSize + this.pageSize);
      this.dataTable.forEach((x, i) => {
        x.dom_index = i + (val - 1) * this.pageSize;
      });
      this.currentPage4 = val;
    },
    formatDate(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + ".";
      const M = date.getMonth() + 1 + ".";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D + h + m + s;
    },
    onLinePreview(i, data) {
      let imgPrievw = document.querySelectorAll(".timeImg")[i.dom_index];
      imgPrievw.click();
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
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
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue({ value }) {},
    setValue(value) {
      this.selected = value;
    },
  },
};
</script>

<style lang="less" scoped>
.preview-root {
  box-sizing: border-box;
  max-height: 670px;
  line-height: 32px;
  font-size: 13px;
  color: #606266;
}
  .table_enclosure {
    width: 78%;

    /deep/.el-table th.el-table__cell {
      background-color: transparent;
    }

    /deep/.tbale_header_two {
      background-color: #3196f7;
      color: white;
    }

    /deep/.el-button--text {
      color: #1b8b17;
    }
  }

/deep/.el-dialog__body {
  height: 620px;
  padding: 10px;
}

.prievw_img {
  width: 100%;
  height: 100%;
}

.timeImg {
  display: none;
}

.err_Url {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
</style>
