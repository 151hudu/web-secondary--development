<template>
  <el-table :data="tableData" border :header-cell-style="{ borderColor: '#cecece' }" :cell-style="{ borderColor: '#cecece' }">
    <template v-for="item in tableHeader">
      <table-column v-if="item.children && item.children.length" :key="item.id" :coloumn-header="item"></table-column>
      <el-table-column align="center" v-else :key="item.id" :label="item.label" :prop="item.prop"> </el-table-column>
    </template>
  </el-table>
</template>

<script>
import TableColumn from "./tableColumn.vue";
export default {
  props: {
    // 表格的数据
    tableData: {
      type: Array,
      required: true,
    },
    // 多级表头的数据
    tableHeader: {
      type: Array,
      required: true,
    },
  },
  components: {
    TableColumn,
  },
};
</script>

<style scoped>
.el-button {
  border: none;
  padding: 0;
  color: #606266;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #cecece;
}

.el-table--border,
.el-table--group {
  border-color: #cecece;
}

.el-table td,
.el-table th.is-leaf {
  border-color: #cecece;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-color: #cecece;
}

.el-table--border td,
.el-table--border th {
  border-color: #cecece;
}
</style>
