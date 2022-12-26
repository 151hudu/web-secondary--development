<template>
  <div class="preview-root">
    <video :src="this.data" :width="this.videoWidth" :height="this.videoHeight" controls></video>
  </div>
</template>

<script>
export default {
  name: "Preview",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: "",
      videoWidth: "500px",
      videoHeight: "300px",
    };
  },
  mounted() {
    console.log(this.customConfig);
    this.data = window.location.origin + JSON.parse(this.customConfig?.data).url || "";
    this.videoHeight = JSON.parse(this.customConfig.configuration).height || "300px";
    this.videoWidth = JSON.parse(this.customConfig.configuration).width||"500px";
  },
};
</script>

<style lang="less" scoped>
.preview-root {
  box-sizing: border-box;
  height: auto;
  line-height: 32px;
  font-size: 13px;
  color: #606266;
}
</style>
