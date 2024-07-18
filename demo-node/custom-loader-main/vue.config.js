const { defineConfig } = require('@vue/cli-service')
const path = require('path')
// const { VueLoaderPlugin } = require('vue-loader')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
   
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('my-loader')
      .loader(path.resolve(__dirname, './my-loader.js'))
      .before('vue-loader')
      .end()
  }
})
