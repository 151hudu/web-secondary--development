<template>
  <div class="preview-root" :style="{height:`${ifarmeHeight}px`,padding:`0 ${ifarmePadding}px`}">
    <iframe :src="completeUrl" frameborder="0" name="outerPage" id="outerPage"></iframe>
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
      dataPr: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      ifarmeHeight: '',
      ifarmePadding: '20',
      iframeHeight2: '',
      completeUrl: '',
      meipian: true
    };
  },
  mounted() {

    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.ifarmeHeight = this.configuration.height
      this.ifarmePadding = this.configuration.margin
      this.meipian = this.configuration.meipian
      console.log(this.configuration, ' this.configuration ');
    } catch (error) {
      console.log(err);
    }

    if (this.dataPr) {
      this.completeUrl = this.dataPr
      let iframe = document.querySelector("#outerPage")
      this.meipian ? iframe.style.transform = 'translateY(-60px)' : null


    }

  },

};
</script>

<style lang="less" scoped>
.preview-root {

  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  color: #606266;
  min-height: 300px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%
  }


}
</style>
