const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8080', // 백엔드 서버의 주소
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '' // 요청에서 '/api'를 제거합니다.
  //       }
  //     },
  //     '/highLightTitle.png': {
  //       target: 'http://localhost:8080', // 백엔드 서버의 주소
  //       changeOrigin: true
  //     }
  //   }
  // }
})
