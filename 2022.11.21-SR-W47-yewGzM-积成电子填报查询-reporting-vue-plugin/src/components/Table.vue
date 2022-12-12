<template>
  <div class="table-root">{{ dateP }}</div>
</template>

<script>
import moment from "moment";
export default {
  name: "Table",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      dataV: this.customConfig.data,
      dateP: new Date(this.dataV)
    };

  },
  created() {
    this.dateP = moment(new Date(this.dataV)).format('YYYY-MM-DD')
  }
};
</script>

<style lang="less" scoped>
.table-root {
  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  color: #606266;
}
</style>
