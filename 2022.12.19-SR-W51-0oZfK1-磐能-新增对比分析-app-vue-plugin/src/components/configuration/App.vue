<template>
  <div>configuration</div>
</template>

<script>
export default {
  name: "Configuration",
  components: {},
  data() {
    return {};
  },
  props: {
    funcRef: Object,
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    onConfigChange: Function,
    customConfig: Object
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style scoped>

</style>