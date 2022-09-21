<template>
  <div :style="{ width: '100%', height: '100%', position: 'relative' }">
    <svg
      t="1663574598890"
      class="icon helpTips"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="14904"
      :width="this.option?.tip图标大小 ? this.option?.tip图标大小 : '24'"
      :height="this.option?.tip图标大小 ? this.option?.tip图标大小 : '24'"
    >
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m84 343.1l-87 301.4c-4.8 17.2-7.2 28.6-7.2 33.9 0 3.1 1.3 6 3.8 8.7s5.2 4 8.1 4c4.8 0 9.6-2.1 14.4-6.4 12.7-10.5 28-29.4 45.8-56.8l14.4 8.5c-42.7 74.4-88 111.6-136.1 111.6-18.4 0-33-5.2-43.9-15.5-10.9-10.3-16.3-23.4-16.3-39.2 0-10.5 2.4-23.7 7.2-39.9l58.9-202.7c5.7-19.5 8.5-34.2 8.5-44.1 0-6.2-2.7-11.7-8.1-16.5-5.4-4.8-12.7-7.2-22-7.2-4.2 0-9.3 0.1-15.3 0.4l5.5-17L570.4 407H596v0.1z m17.8-88.7c-12.2 12.2-26.9 18.2-44.1 18.2-17 0-31.5-6.1-43.7-18.2-12.2-12.2-18.2-26.9-18.2-44.1s6-31.9 18-44.1c12-12.1 26.6-18.2 43.9-18.2 17.5 0 32.3 6.1 44.3 18.2 12 12.2 18 26.9 18 44.1s-6.1 31.9-18.2 44.1z"
        p-id="14905"
        :fill="this.option?.tip图标颜色 ? this.option?.tip图标颜色 : '#44A3F4'"
      ></path>
    </svg>
    <div class="tips_Content" :style="tips_Content">
      <span class="tips_Content_Title" :style="tips_Content_Title" v-show="this.option?.tip标题">{{ this.option?.tip标题 }}</span>
      <div :style="tips_Content_Value" v-html="tip" ></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { normalizeData } from "./normalizeData";
import { Info } from "@icon-park/vue";
import { relative } from "path";
import { registerStore, getBlockData, getBlockVariables } from "@njsdata/bigscreen-sdk";
export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object,
    data: Array,
  },
  components: {
    Info,
  },
  data() {
    return {
      tipShow: false,
      tip: "<span style=color:red>21321321<span/>",
      option: {},
      tips_Content: { backgroundColor: "rgba(255,255,255,0.7)", width: "120px", height: "60px" },
      tips_Content_Title: { color: "red" },
      tips_Content_Value: {},
    };
  },
  created() {
    console.log(this.options, this.customConfig);
    console.log(this.data);
    let message = {
      data: [this.options.columns, this.data],
    };
    this.options.externalVariables = this.translatePlatformDataToJsonArray(message)[0];
    this.option = this.options?.externalVariables;
    // this.tip = this.options?.externalVariables.tip内容;
    this.tips_Content_Title = eval("(" + this.options?.externalVariables.tips_Content_Title + ")");
    this.tips_Content_Value = eval("(" + this.options?.externalVariables.tips_Content_Value + ")");
    this.tips_Content = eval("(" + this.options?.externalVariables.tips_Content + ")");
    console.log(this.tips_Content);
    this.tips_Content.top = this.options?.tip图标大小 ? +this.options?.tip图标大小 / 2 + "px" : "12px";
    this.tips_Content.left = this.options?.tip图标大小 ? this.options?.tip图标大小 + "px" : "24px";
    this.tips_Content.backgroundColor = this.tips_Content.backgroundColor ? this.tips_Content.backgroundColor : "rgba(255,255,255,0.7)";
    this.tips_Content.borderRadius = this.tips_Content.borderRadius ? this.tips_Content.borderRadius : "7px";
    if (this.option?.tip图标大小) {
      if (Number.isNaN(+this.option?.tip图标大小)) {
        this.option.tip图标大小 = 24;
      }
    }
    const pubSub = this.customConfig.pubSub;
    pubSub &&
      pubSub.subscribe("updateChart" + this.customConfig.componentId, (data) => {
        console.log("updateChart");
        this.initChart(data.variable, data.option, data.data);
      });
  },
  mounted() {
    const events = [];

    const actions = [];
    window.componentCenter?.register &&
      window.componentCenter.register(this.customConfig.componentId, "comp", this, {
        events,
        actions,
      });
    this.customConfig?.updateProcess && this.customConfig.updateProcess();
  },

  methods: {
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },
  },
};
</script>
<style lang="less" scoped>
.helpTips {
  cursor: pointer;
  &:hover + .tips_Content {
    display: block;
  }
}
.tips_Content {
  display: none;
  position: absolute;
}
.tips_Content_Title {
  font-size: 19px;
  line-height: 22px;
  font-weight: 700;
  color: #ffffff;
}
</style>
