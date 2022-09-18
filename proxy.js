module.exports = {
  "/api": {
    target: "http://10.15.110 .22:18580/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
