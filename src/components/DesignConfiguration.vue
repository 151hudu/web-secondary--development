<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="td_conference_room_maintenance">
      <el-input v-model="form.td_conference_room_maintenance"></el-input>
    </el-form-item>
    <el-form-item label="td_screen_distribution_template">
      <el-input v-model="form.td_screen_distribution_template"></el-input>
    </el-form-item>
    <el-form-item label="td_conference_room_maintenance_child">
      <el-input v-model="form.td_conference_room_maintenance_child"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        td_conference_room_maintenance: "",
        td_screen_distribution_template: "",
        td_event_plans_parameter_child: "",
        td_event_plans_equipment_child: "",
        td_conference_room_maintenance_child: "",
      },
    };
  },

  watch: {
    "form.td_conference_room_maintenance": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.td_screen_distribution_template": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.td_event_plans_parameter_child": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.td_event_plans_equipment_child": function (value, oldValue) {
      this.onFormLayoutChange();
    },
    "form.td_conference_room_maintenance_child": function (value, oldValue) {
      this.onFormLayoutChange();
    },
  },

  props: {
    customConfig: Object,
    changeConfiguration: Function,
    configuration: Object,
  },
  methods: {
    onFormLayoutChange() {
      this.customConfig.changeConfiguration(JSON.stringify(this.form));
    },
  },
  mounted() {
    this.form = JSON.parse(this.customConfig.configuration || "{}");
  },
};
</script>
