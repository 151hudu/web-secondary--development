<template>
  <div id="development">
    <el-carousel arrow="always" :autoplay="false">
      <el-carousel-item v-for="item in renderMap" :key="item">
        <component :is="item" v-bind="mockData" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {
  Carousel,
  CarouselItem
} from "element-ui";
import Vue from "vue";
import {
  Main,
  Configuration
} from "@/components";
import mockData from "@/components/development/mockData.js";

Vue.use(Carousel);
Vue.use(CarouselItem);
export default {
  name: "Development",
  components: { Main, Configuration },
  data() {
    return {
      renderMap: ["Main", "Configuration"],
      mockData
    };
  },
  created() {
  },
  props: {},
  mounted() {
  },
  methods: {}
};
</script>

<style lang="less" scoped>
#development {
  height: 100%;

  .el-carousel {
    height: 100%;

    ::v-deep .el-carousel__container {
      height: 100%;
    }
  }
}
</style>