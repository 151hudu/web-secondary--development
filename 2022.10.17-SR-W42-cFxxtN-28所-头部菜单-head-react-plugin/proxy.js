module.exports = {
  "/api": {
    target: process.env.REACT_APP_SD_PROXY_URL,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
  "/sdata/rest": {
    target: process.env.REACT_APP_SD_PROXY_URL,
    changeOrigin: true,
  },
};
