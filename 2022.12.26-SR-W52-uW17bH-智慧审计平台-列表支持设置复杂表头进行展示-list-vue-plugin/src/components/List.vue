<template>
  <div>
    <!-- 资产ID -->
    <dynamic-table :table-data="tableData" :table-header="tableConfig"></dynamic-table>
  </div>
</template>

<script>
// 引入接口
import { queryAssetById } from "../api/asset";
import DynamicTable from "./tableColumn2.vue";
export default {
  name: "List",
  props: {
    // 平台数据
    platformProps: Object,
    // 本地数据
    customConfig: Object,
  },
  components: {
    DynamicTable,
  },
  data() {
    return {
      // 配置项数据
      form: {
        assetId: "",
      },
      tableData: [],
      // 表头数据
      tableConfig: [],
    };
  },
  mounted() {
    this.tableConfig = eval(this.platformProps.pluginConfig?.json || "[]");
    let data = this.platformProps?.data || [];
    data.forEach((item) => {
      let message = {};
      item.forEach((item2) => {
        message[item2["label"]] = item2["value"].value || "";
      });
      this.tableData.push(message);
    });
    console.log(this.platformProps, this.tableData, this.tableConfig);
    // 配置项数据隔离
    if (this.platformProps) {
      this.configForm = this.platformProps.pluginConfig;
    } else {
      this.configForm = this.customConfig.configuration;
    }
  },
  methods: {},
};
</script>
