/**
 * 编号规则(任务编号-流水号)
 * @param year 年份
 * @param unitNo 单元编号
 * @param planType 计划类型
 * @param serialNumber 任务数量
 * @param planNumber 计划数量
 */
export const get_NumberingRules = (year, unitNo, planType, serialNumber, planNumber) => {
   // 工程类别
   let projectCategory = "";
   // 月份
   let number = "";
   // 根据计划类型区分
   if (planType == "大修单项") {
      projectCategory = "D";
      planNumber <= 0 ? (number = "01") : planNumber > 0 && planNumber < 10 ? (number = "0" + planNumber) : (number = planNumber);
   } else {
      projectCategory = "W";
      let month = String(new Date().getMonth() + 1);
      month.length < 1 ? (number = "0" + month) : (number = month);
   }

   return `${year}-${unitNo}${projectCategory}${number}`;
}
