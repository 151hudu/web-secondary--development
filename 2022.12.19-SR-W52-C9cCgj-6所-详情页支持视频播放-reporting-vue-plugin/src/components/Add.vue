<template>
  <el-upload
    class="reportUpload"
    :action="uploadUrl"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="success"
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
import { file, queryByMenu } from "../api/asset";
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      fileList: [],
      uploadUrl: "",
    };
  },
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
    window?.componentCenter?.register(this.customConfig.componentId, "comp", this, eventActionDefine);
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    success(response, file, fileList) {
      let { formConfig, component, onChange } = this.customConfig;
      console.log(response, file, fileList);
      onChange(JSON.stringify(fileList[0].response.result));
    },
    handleExceed(files, fileList) {
      this.fileList = [];
    },
    beforeRemove(file, fileList) {
      this.fileList = [];
      let { formConfig, component, onChange } = this.customConfig;
      onChange(JSON.stringify(fileList));
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
    async inputChange(e) {
      this.data = e;
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: e,
        },
      });
      onChange(e);
    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    do_EventCenter_setValue({ value }) {
      this.data = value;
    },
    Event_Center_getName() {
      return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
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
