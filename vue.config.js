const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './', // Ensures assets are loaded using "./js/" instead of "js/"
  outputDir: 'dist', // Keeps the built files in "dist"
  assetsDir: 'assets', // Moves JS/CSS inside "dist/assets"
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
