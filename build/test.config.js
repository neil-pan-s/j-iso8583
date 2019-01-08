const config = require('./webpack.config')

const webpackConfig = Object.assign({
  mode: 'development',
  devtool: 'source-map',
}, config)

delete webpackConfig.entry
delete webpackConfig.output

module.exports = webpackConfig