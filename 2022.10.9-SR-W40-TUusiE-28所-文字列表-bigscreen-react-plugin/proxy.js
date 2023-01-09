module.exports = {
  '/api': {
    'target': 'http://10.15.111.6:8088/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}