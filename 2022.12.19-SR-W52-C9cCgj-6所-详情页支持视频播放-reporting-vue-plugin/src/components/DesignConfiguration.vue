<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="宽度">
      <el-input v-model="form.width"></el-input>
    </el-form-item>
    <el-form-item label="高度">
      <el-input v-model="form.height"></el-input>
    </el-form-item>
    <el-form-item label="formID">
      <el-input v-model="form.formID"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        width: "",
        height: "",
      },
    };
  },

  watch: {
    "form.width": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.height": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.formID": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  props: {
    customConfig: Object,
  },
  methods: {
    onFormLayoutChange() {
      console.log(this.customConfig,37);
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
      console.log(this.customConfig,39);
    },
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || "{}");
  },
};
</script>
