const path = require('path');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('terser-webpack-plugin');

const 
  NODE_ENV = 'production'
;
module.exports = {
  entry: './src/server.ts',
  mode: NODE_ENV,
  target: 'node',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      }
    })],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js','html', 'css'],
  },
  // externals: [nodeExternals(), ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  }
}