<template>
  <el-upload
    class="reportUpload"
    :action="uploadUrl"
    :on-success="success"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="1"
    :on-exceed="handleExceed"
    :file-list="fileList"
  >
    <el-button icon="el-icon-upload" class="uploadMP4">点击上传</el-button>
  </el-upload>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import { queryByMenu } from "../api/asset";
export default {
  name: "Set",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      fileList: [],
      uploadUrl: "",
    };
  },
  methods: {},
  mounted() {
    let message = {
      id: this.GetQueryString("menuId").split("%")[0],
      opt_type: "view",
    };
    queryByMenu(message).then((res) => {
      console.log(JSON.parse(this.customConfig?.configuration || "{}"));
      let id = JSON.parse(this.customConfig?.configuration || "{}")?.formID || res.data.datapp_page_web_mappings[0].object_id;
      this.uploadUrl = window.location.origin + "/sdata/rest/form/upload/file?formId=" + id;
    });
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.register(initId, "comp", this, eventActionDefine);
  },
  methods: {
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    success(file) {
      let { formConfig, component, onChange } = this.customConfig;
      console.log(this.fileList);
      onChange(JSON.stringify(this.fileList));
    },
    handleExceed(files, fileList) {
      this.fileList = [];
    },
    beforeRemove(file, fileList) {
      this.fileList = [];
      let { formConfig, component, onChange } = this.customConfig;
      onChange(JSON.stringify(this.fileList));
    },
    // 获取URL参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
    },
  },
  destroyed() {
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.removeInstance(initId);
  },
};
</script>
<style lang="less" scoped>
.uploadMP4 {
  border-style: dashed;
}
.reportUpload {
  width: 200px !important;
}
/deep/.el-upload__input {
  display: none !important;
}
/deep/.el-icon-close-tip {
  display: none;
}
</style>
