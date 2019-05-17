const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'RD.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'RD',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
