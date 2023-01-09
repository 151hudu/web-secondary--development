<template>
  <div>

  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
export default {
  name: "Set",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      ifarmeHeight: '',
      ifarmePadding: '20',
      iframeHeight2: '',
      completeUrl: '',

    };
  },
  methods: {
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
  },
  mounted() {
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.ifarmeHeight = this.configuration.height
      this.ifarmePadding = this.configuration.margin

    } catch (error) {
      console.log(err);
    }
    window?.componentCenter?.register(initId, "comp", this, eventActionDefine);
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
