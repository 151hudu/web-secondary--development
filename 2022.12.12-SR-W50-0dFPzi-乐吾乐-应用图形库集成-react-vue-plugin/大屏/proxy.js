module.exports = {
  "/api": {
    target: "http://10.15.111.9:13096",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
