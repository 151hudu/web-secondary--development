module.exports = {
  '/api': {
    'target': 'http://10.15.111.16:43238/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}