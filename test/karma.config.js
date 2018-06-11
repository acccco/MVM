var webpack = require('webpack')

var webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: '#source-map'
}

// shared config for all unit tests
module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    reporters: ['progress'],
    singleRun: true,
    frameworks: ['jasmine'],
    files: [
      'spec/options.spec.js'
    ],
    preprocessors: {
      './spec/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    plugins: [
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-chrome-launcher'
    ]
  })
}
