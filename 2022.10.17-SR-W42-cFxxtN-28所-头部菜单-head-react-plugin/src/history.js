import { createBrowserHistory } from "history";

let history = new createBrowserHistory({});

history.oldPush = history.push;
history.oldReplace = history.replace;

history.push = function (...args) {
  if (Object.prototype.toString.call(args[0]) === "[object Object]") {
    let [config, ...otherArgs] = args;
    if (config.pathname) {
      let pathname = addDiagonal(config.pathname);
      history.oldPush(
        {
          ...config,
          pathname: pathname,
        },
        ...otherArgs
      );
    } else {
      history.oldPush(
        {
          ...config,
        },
        ...otherArgs
      );
    }
  } else {
    let [url, ...otherArgs] = args;
    let newUrl = addDiagonal(url);
    history.oldPush(newUrl, ...otherArgs);
  }
};

history.replace = function (...args) {
  if (Object.prototype.toString.call(args[0]) === "[object Object]") {
    let [config, ...otherArgs] = args;
    let pathname = addDiagonal(config.pathname);
    history.oldReplace(
      {
        ...config,
        pathname: pathname,
      },
      ...otherArgs
    );
  } else {
    let [url, ...otherArgs] = args;
    let newUrl = addDiagonal(url);
    history.oldReplace(newUrl, ...otherArgs);
  }
};

// 为了push的路由最前没加入斜杠补充斜杠
function addDiagonal(url) {
  return url.startsWith("/") ? url : `/${url}`;
}

export default history;
