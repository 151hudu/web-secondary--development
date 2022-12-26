<template>
  <div class="spread-box">
    <el-button type="primary" @click="ensure">保存</el-button>
    <div id="excel-container" ref="spreadRef" class="spread-content" :style="{ width: '100%', height: '800px'}" />
  </div>
</template>

<script>
import { contentJson } from './utils'
import { templateSave, templateQuery } from '../../api/asset'
let sheetsDesigner = window.GC.Spread.Sheets.Designer;
let workbook;
let designerControl;

export default {
  name: "SpreadJs",
  props: {
    plantList: Array,
  },
  data() {
    return {
      data: '',
    };
  },
  mounted() {
    const GC = window.GC;
    var fontFamilyCmd = sheetsDesigner.getCommand('fontFamily');
    var customCNFont = [
      { value: '宋体', text: '宋体' },
      { value: '微软雅黑', text: '微软雅黑' },
      { value: '黑体', text: '黑体' },
    ];
    fontFamilyCmd.dropdownList = customCNFont.concat(
      fontFamilyCmd.dropdownList
    );

    var ribbonConfig = sheetsDesigner.DefaultConfig;
    var designer = new sheetsDesigner.Designer(this.$refs.spreadRef);
    console.log('designer', designer);
    designer.setConfig(ribbonConfig);
    workbook = designer.getWorkbook();

    workbook.options.scrollbarShowMax = true;
    workbook.options.scrollbarMaxAlign = true;

    designerControl = sheetsDesigner.findControl('excel-container');
    console.log(1111, designerControl);

    console.log('workbook: ', workbook);
    this.init();

    // workbook.fromJSON(contentJson)
  },
  methods: {
    async init() {
      let { data } = await templateQuery("LYC1");
      let { content, header_content } = data[0]
      designerControl.setData('treeNodeFromJson', header_content);
      designerControl.setData('updatedTreeNode', header_content);
      designerControl.setData('oldTreeNodeFromJson', header_content);
      let resultData = JSON.parse(content);
      workbook.fromJSON(resultData);
    },
    async ensure() {
      let designerBindingPathSchema =
      designerControl.getData('treeNodeFromJson') ||
      designerControl.getData('updatedTreeNode') ||
      designerControl.getData('oldTreeNodeFromJson') ||
      '{}';
      let resultData = workbook.toJSON();
      let tabletData = JSON.stringify(resultData);

      await templateSave({
        template_no: "LYC1",
        template_name: "炼油厂",
        header_content: designerBindingPathSchema,
        content: tabletData
      })
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    }
  }
};
</script>

<style lang="less">
.gc-designer-root {
  &.gc-sjsdesigner-dialog {
    z-index: 10000;
  }
}
</style>
