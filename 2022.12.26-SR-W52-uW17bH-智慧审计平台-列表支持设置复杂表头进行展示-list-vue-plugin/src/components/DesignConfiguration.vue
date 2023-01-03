<template>
  <el-form ref="form" :model="form" inline>
    <!-- 资产ID -->
    <el-form-item label="表头JSON">
      <el-input v-model="form.json" size="small"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DesignConfiguration',

  props: {
    // 平台数据
    customConfig: Object,
    // 本地数据
    platformProps: Object
  },

  data() {
    // 储存配置项数据
    let form = {
      json: ''
    }
    // 赋值平台数据
    if(this.platformProps) {
      form = JSON.parse(this.platformProps.configuration)
    }

    return {
      configForm: {},
      form: form
    }
  },

  mounted() {
    // 配置项数据隔离
    if(this.platformProps) {
      this.configForm = JSON.parse(this.platformProps.configuration)
    } else {
      this.configForm = this.customConfig.configuration
    }
  },

  watch: {
    "form.json": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  methods: {
    onFormLayoutChange() {
      this.platformProps?.changeConfiguration(JSON.stringify(this.form));
    }
  },
};
</script>