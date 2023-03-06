module.exports = {
  '/api': {
    'target': 'http://10.15.111.11:18087',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}