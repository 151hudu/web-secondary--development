import Vue from "vue";
import App from "./App.vue";
import less from "less";
import { Development } from "@/components/index.js";

Vue.use(less);
Number.prototype.toFixed = function (n) {
  // n为期望保留的位数，超过限定，报错！
  if (n > 20 || n < 0) {
    throw new RangeError("toFixed() digits argument must be between 0 and 20");
  }
  // 获取数字
  const number = this;
  // 如果是NaN,或者数字过大，直接返回'NaN'或者类似'1e+21'的科学计数法字符串
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  // 默认保留整数
  if (typeof n == "undefined" || n == 0) {
    return Math.round(number).toString();
  }

  // 先获取字符串
  let result = number.toString();
  // 获取小数部分
  const arr = result.split(".");

  // 整数的情况，直接在后面加上对应个数的0即可
  if (arr.length < 2) {
    result += ".";
    for (let i = 0; i < n; i += 1) {
      result += "0";
    }
    return result;
  }

  // 整数和小数
  const integer = arr[0];
  const decimal = arr[1];
  // 如果已经符合要求位数，直接返回
  if (decimal.length == n) {
    return result;
  }
  // 如果小于指定的位数，补上
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += "0";
    }
    return result;
  }
  // 如果到这里还没结束，说明原有小数位多于指定的n位
  // 先直接截取对应的位数
  result = integer + "." + decimal.substr(0, n);
  // 获取后面的一位
  let last = decimal.substr(n, 1);
  if (/^\d(9){5,}[89]$/.test(decimal.substr(n))) {
    last += last + 1;
  }
  // 大于等于5统一进一位
  if (parseInt(last, 10) >= 5) {
    // 转换倍数，转换为整数后，再进行四舍五入
    const x = Math.pow(10, n);
    // 进一位后，转化还原为小数
    result = (Math.round(parseFloat(result) * x) + 1) / x;
    // 再确认一遍
    result = result.toFixed(n);
  }

  return result;
};
if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} has triggered`);
    },
  };
  new Vue({
    render: (h) => {
      return <Development />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props, context, eventBus) => {
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    const app = new Vue({
      render: (h) => <App {...{ props }} />,
    });
    app.$mount(div);
    // eventBus.on((newProps) => {
    //   for (const newPropsKey in newProps) {
    //     app[newPropsKey] = newProps[newPropsKey];
    //   }
    //   app.$forceUpdate();
    // });
  });
}
