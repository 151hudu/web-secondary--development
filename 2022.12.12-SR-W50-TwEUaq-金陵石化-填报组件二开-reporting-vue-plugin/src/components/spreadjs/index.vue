<template>
  <div class="spread-box">
    <div ref="spreadRef" class="spread-content" :style="{ width: '100%', height: '600px'}" />
  </div>
</template>

<script>
import { previewData, templateQuery } from '../../api/asset'
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
    window.GC.Spread.Common.CultureManager.culture("zh-cn");
    // workbook = new window.GC.Spread.Sheets.Workbook(this.$refs.spreadRef, {
    //   sheetCount: 1,
    //   tabStripVisible: false,
    //   newTabVisible: false,
    //   scrollbarMaxAlign: true,
    // });

    // // workbookRef.current = workbook;
    // // registerFonts(workbook);

    // // let sheetsDesigner = window.GC.Spread.Sheets.Designer;

    // var fontFamilyCmd = sheetsDesigner.getCommand('fontFamily');
    // var customCNFont = [
    //   { value: '宋体', text: '宋体' },
    //   { value: '微软雅黑', text: '微软雅黑' },
    //   { value: '黑体', text: '黑体' },
    // ];
    // fontFamilyCmd.dropdownList = customCNFont.concat(
    //   fontFamilyCmd.dropdownList
    // );

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

    console.log('workbook: ', workbook);


    this.init();
  },
  methods: {
    async init() {
      let { data } = await templateQuery("LYC1");
      let { content, header_content } = data[0]
      let resultData = JSON.parse(content);

      resultData.tabStripVisible = false;
      resultData.newTabVisible = false;
      resultData.showHorizontalScrollbar = false;
      resultData.scrollbarMaxAlign = true;
      resultData.showVerticalScrollbar = false;
      resultData.highlightInvalidData = false;

      // Object.keys(resultData.sheets || {}).forEach((item) => {
      //   const sheet = resultData.sheets[item];
      //   sheet.rowHeaderVisible = false;
      //   sheet.colHeaderVisible = false;
      // });
      workbook.fromJSON(resultData);
      this.showData();
    },
    async showData() {
      const sheet1 = workbook.getSheet(0);
      const style = new window.GC.Spread.Sheets.Style();
      style.hAlign = window.GC.Spread.Sheets.HorizontalAlign.center;
      style.vAlign = window.GC.Spread.Sheets.VerticalAlign.center;
      sheet1.setDefaultStyle(style, window.GC.Spread.Sheets.SheetArea.viewport);
      let value = {};

      console.log(7777, this.plantList);
      try {
        let resultData =  await previewData(this.plantList)

        if (resultData.data) {
          value = resultData.data || {}
        }
        console.log(88888, resultData);
      } catch(e) {
        console.log(e)
      }
      console.log(9999, value);

      // 设置value值
      // const value = JSON.parse(props.defaultValue);
      sheet1.tables.l$.forEach((table) => {
        const dataRange = table.dataRange();
        const tableJson = table.toJSON();
        const startColumn = table.startColumn();

        if (!value[tableJson.bindingPath]) {
          const data = [];
          for (
            let row = dataRange.row;
            row < dataRange.row + dataRange.rowCount;
            row++
          ) {
            const rowData = {};
            for (
              let col = dataRange.col;
              col < dataRange.col + dataRange.colCount;
              col++
            ) {
              const value = sheet1.getCell(row, col).value();
              if (typeof value !== "object") {
                rowData[tableJson.columns[col - startColumn].dataField] = value;
              }
            }
            data.push(rowData);
          }
          value[tableJson.bindingPath] = data;

          tableJson.columns.forEach((column, index) => {
            if (column.dataAreaFormula) {
              table.setColumnDataFormula(index, column.dataAreaFormula);
            }
          });
        }
      });

      const source = new window.GC.Spread.Sheets.Bindings.CellBindingSource(
        value
      );
      sheet1.setDataSource(source);
      workbook.bind(window.GC.Spread.Sheets.Events.CellChanged, function () {
        const value = sheet1.getDataSource();
        setDocContent(JSON.stringify(value.xf));
      });
    }
  }
};
</script>

<style lang="less" scoped>
.spread-box {
  width: 100%;
  height: 600px;
}
</style>
