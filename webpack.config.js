const path = require('path')
const src = __dirname + "/src"
const dist = __dirname + "/docs"
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyFilePlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = (env, argv = {}) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
  devServer: {    allowedHosts: 'all',
    static: {
      directory: dist
    }
  },
  context: src,
  entry: {
    'modeler': './js/modeler/index.js'
  },
  output: {
		globalObject: 'self',
    filename: './[name].bundle.js',    chunkFilename: './chunk/[id].[contenthash].chunk.js',
    hotUpdateChunkFilename: './hot/[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: './hot/[runtime].[fullhash].hot-update.json',
    path: dist,
    publicPath:""
  },
  resolve: {
    alias: {
      '@': path.resolve(src, '/js/')
        },
    fallback: {
      buffer: require.resolve('buffer/')
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      use: ['file-loader']
    }
  ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Buffer: ['buffer', 'Buffer']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['modeler'],
      template: './html/index.html',
      filename: './index.html'
    }),
    new CopyFilePlugin({
      patterns: [
        {
          context: 'assets/',
          from: '*.json',
          to: dist
        },
        {
          context: 'assets/',
          from: '_locales/**/*.*',
          to: dist
        },
        {
          context: 'assets/',
          from: 'icons/*.*',
          to: dist
        },
        {
          from: 'css/*.css',
          to: dist
        },
        {
          from: 'assets/*/*.*',
          to: dist
        },
        {
          from: 'assets/*.*',
          to: dist
        }
      ]
    }),
    new WriteFilePlugin()
  ]
})