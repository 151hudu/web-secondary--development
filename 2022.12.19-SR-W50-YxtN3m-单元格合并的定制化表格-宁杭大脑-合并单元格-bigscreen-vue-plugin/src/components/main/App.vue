<template>
  <div
    class="bigscreen_secondary"
    :style="{
      width: '100%',
      height: '100%',
    }"
    ref="bigscreen_secondary"
    :id="id"
  >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="accident" label="事件"> </el-table-column>
      <el-table-column align="center" prop="location" label="位置"> </el-table-column>
      <el-table-column align="center" prop="status" label="事件状态"> </el-table-column>
      <el-table-column align="center" label="情报板名称">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.eventList" :key="index" class="listDiv">
            {{ item.name }}
            <hr v-if="index !== scope.row.eventList.length - 1" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.eventList" :key="index" class="listDiv">
            {{ item.content }}
            <hr v-if="index !== scope.row.eventList.length - 1" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from "vue";
import { Table, TableColumn } from "element-ui";
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import { event } from "../../api/asset";
import configJson from "../../../pluginTemp/config.json";
Vue.use(Table);
Vue.use(TableColumn);
export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      tableData: [],
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    bigscreen: Object,
    componentId: String,
    configuration: Object,
    options: Object,
    updateProcess: Function,
  },
  created() {},
  mounted() {
    event().then((res) => {
      this.tableData = res.data;
    });
    this.pubSub &&
      this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
        console.log(data);
      });
    window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `bigscreen_secondary_${configJsonRequireNum}_${id}`;
  },
  methods: {
    Event_Center_getName() {
      return this.id;
    },
  },
};
</script>

<style lang="less" scoped>
.listDiv {
  height: 35px;
  line-height: 35px;
}
/deep/.el-table,
/deep/.el-table__expanded-cell {
  background-color: transparent !important;
  color: #fff;
  font-size: 18px;
}
/deep/.cell {
  padding: 0;
}
/deep/.el-table th,
/deep/.el-table tr,
/deep/.el-table td {
  background-color: transparent !important;
  color: #fff;
  font-size: 18px;
}
</style>
