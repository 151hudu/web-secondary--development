<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="资产id">
      <el-input v-model="form.assetId"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        assetId: "",
      },
    };
  },

  watch: {
    "form.size": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.assetId": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.allowClear": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  props: {
    customConfig: Object,
  },
  methods: {
    onFormLayoutChange() {
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
    },
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || "{}");
  },
};
</script>
