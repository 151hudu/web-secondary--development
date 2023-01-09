<template>
  <div class="listSet">
    <el-button type="primary" class="listAdd_btn" size="small">新增</el-button>

    <el-table :data="tableData" style="width: 100%" border stripe header-cell-class-name='listBan'>
      <el-table-column type="index" label="组数" width="180">
      </el-table-column>
      <el-table-column prop="repeatTimes" label="重复次数" width="180">
      </el-table-column>
      <el-table-column prop="shearStrength" label="剪切强度(MPa)">
      </el-table-column>
      <el-table-column prop="shearModulus" label="剪切模量(MPa)">
      </el-table-column>
      <el-table-column prop="shearStrain" label="剪切应变(%)">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">详情</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import myMixin from '../mixin'
export default {
  name: "Set",
  props: {
    customConfig: Object,
  },
  mixins: [myMixin],
  data() {
    return {
      data: this.customConfig.data,
      tableData: []
    };
  },
  methods: {
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name || formConfig?.formName}-${component.columnStyle.title}`;
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
    window?.componentCenter?.register(initId, "comp", this, eventActionDefine);
    this.mixData.id = component.id
    this.mixData.child_id = child_id
    this.mixData.index = index
    this.mixData.eventActionDefine = eventActionDefine
    this.mixData.actions = { Event_Center_getName: this.Event_Center_getName, Event_Center_getParentInfo: this.Event_Center_getParentInfo }
    this.mixData.componentCenter = window?.componentCenter

    try {
      this.configuration = JSON.parse(this.propsConfiguration);

    } catch (error) {
      console.error("configuration解析错误", error);
    }
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
.listSet {

  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /deep/ input[type='number'] {
    -moz-appearance: textfield !important;
  }

  /deep/.el-input-number--small {
    width: 100%;
  }

  /deep/ .listAdd_btn {
    background-color: #0454f2;
    border-color: #0454f2;
  }

  /deep/ .listBan {
    background: #f7f7f7;
  }

  /deep/.my_label {
    background: rgb(247, 247, 247);
    color: rgb(144, 147, 153);
  }

  /deep/ .el-select {
    width: 100%;
  }

  /deep/ .child_end_fill {
    text-align: center;
    // line-height: 65px;
    background: #fafafa;
    padding: 16px;

    .eidt_end_span {
      border: 1px #dedfe0 dashed;
      height: 32px;
      line-height: 32px;
    }

    .end_span {
      cursor: pointer;
      border: 1px #dedfe0 dashed;
      height: 32px;
      line-height: 32px;

      &:hover {
        color: #81befe;
        border-color: #81befe
      }
    }
  }
}
</style>
