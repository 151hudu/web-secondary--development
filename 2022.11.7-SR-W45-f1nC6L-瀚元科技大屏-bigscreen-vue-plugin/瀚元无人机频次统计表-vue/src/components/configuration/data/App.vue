<template>
</template>

<script>
import {
  RadioGroup,
  RadioButton,
  Button
} from "element-ui";
import Vue from "vue";
import configurationMixin from "@/mixins/configuration.js";

Vue.use(Button);
Vue.use(RadioButton);
Vue.use(RadioGroup);
export default {
  name: "DataConfiguration",
  components: {},
  data() {
    return {
    };
  },
  mixins: [configurationMixin],
  mounted() {
  },
  methods: {
    handleValueChange(value) {
      this.newOptions.background = value;
    }
  }
};
</script>

<style scoped>

</style>