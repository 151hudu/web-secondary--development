<template>
  <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="左右间距">
      <el-input v-model="form.margin"></el-input>
    </el-form-item>
    <el-form-item label="组件高度">
      <el-input v-model="form.height"></el-input>
    </el-form-item>
    <el-form-item label="美篇">
      <el-radio-group v-model="meipian" @change="handlerFn">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>

      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        url: "",
        margin: '',
        meipian: true
      },
      meipian: true
    };
  },

  watch: {
    "form.height": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.margin": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.meipian": function (value, oldValue) {

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
    handlerFn() {
      this.form.meipian = this.meipian
    }
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || "{}");

    this.meipian = this.form.meipian == undefined ? true : this.form?.meipian
  },
};
</script>
