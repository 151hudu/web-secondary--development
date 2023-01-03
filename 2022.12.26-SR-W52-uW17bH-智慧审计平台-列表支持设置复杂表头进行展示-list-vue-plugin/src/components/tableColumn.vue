<template>
  <el-table-column align="center"  :label="coloumnHeader.label" :prop="coloumnHeader.label">
    <template v-for="item in coloumnHeader.children">
      <tableColumn  align="center" v-if="item.children && item.children.length" :key="item.id" :coloumn-header="item"></tableColumn>
      <el-table-column  align="center" v-else :key="item.name" :label="item.label" :prop="item.prop">
        <template slot-scope="scope">
          {{ scope.row[scope.column.property] }}
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "tableColumn",
  props: {
    coloumnHeader: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
