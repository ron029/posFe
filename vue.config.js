const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 8080,
    host: '127.0.0.1', // Allow access from any host
    hot: true,
    liveReload: true,
  },
})
