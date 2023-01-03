module.exports = {
   "/api": {
      target: "http://14.21.43.41:18080/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
   },
};
