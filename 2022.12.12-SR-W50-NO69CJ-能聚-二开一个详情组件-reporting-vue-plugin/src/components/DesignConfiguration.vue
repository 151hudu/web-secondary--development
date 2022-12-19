<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="子表ID">
      <el-input v-model="form.asset"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        placeholder: "",
      },
    };
  },

  watch: {
    "form.asset": function (value, oldValue) {
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
