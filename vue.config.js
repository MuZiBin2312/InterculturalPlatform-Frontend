const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'https://550295mjyq84.vicp.fun', // 代理到后端
    //     changeOrigin: true,
    //     pathRewrite: { '^/api': '' }
    //   }
    // }
  },
  chainWebpack: config =>{
    config.plugin('html')
        .tap(args => {
          args[0].title = "管理系统";
          return args;
        })
  }
})
