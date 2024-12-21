const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    hot: false,
    liveReload: true,
  },
})
