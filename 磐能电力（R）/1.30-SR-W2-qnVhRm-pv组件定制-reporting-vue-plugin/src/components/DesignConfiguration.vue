<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="按钮名称">
      <el-input v-model="form.placeholder"></el-input>
    </el-form-item>
    <el-form-item label="绑定资产id">
      <el-input v-model="form.assetId"></el-input>
    </el-form-item>
    <el-form-item label="主键字段">
      <el-input v-model="form.primaryKey"></el-input>
    </el-form-item>
    <el-form-item label="外键字段">
      <el-input v-model="form.foreignKey"></el-input>
    </el-form-item>
    <el-form-item label="唯一字段">
      <el-input v-model="form.onlyKey"></el-input>
    </el-form-item>
    <el-form-item label="PV回路">
      <el-input v-model="form.loopPV"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-input v-model="form.state"></el-input>
    </el-form-item>
    <el-form-item label="容量">
      <el-input v-model="form.capacity"></el-input>
    </el-form-item>
    <el-form-item label="弹框资产名称">
      <el-input v-model="form.assetName"></el-input>
    </el-form-item>
    列名
    <el-form-item label="第一列">
      <el-input v-model="form.column0"></el-input>
    </el-form-item>
    <el-form-item label="第二列">
      <el-input v-model="form.column1"></el-input>
    </el-form-item>
    <el-form-item label="第三列">
      <el-input v-model="form.column2"></el-input>
    </el-form-item>
    <el-form-item label="第四列">
      <el-input v-model="form.column3"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  data() {
    return {
      form: {
        placeholder: "",
        // column: [null, null, null, null]
      },
    };
  },

  watch: {
    "form.assetId": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.placeholder": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.primaryKey": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.foreignKey": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.onlyKey": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.loopPV": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.state": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.capacity": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.assetName": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.column0": {
      handler() {
        this.onFormLayoutChange();
      },
    },
    "form.column1": {
      handler() {
        this.onFormLayoutChange();
      },
    },
    "form.column2": {
      handler() {
        this.onFormLayoutChange();
      },
    },
    "form.column3": {
      handler() {
        this.onFormLayoutChange();
      },
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
