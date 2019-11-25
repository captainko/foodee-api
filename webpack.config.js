const path = require('path');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('terser-webpack-plugin');

const
  NODE_ENV = 'production'
  ;
module.exports = [{
  entry: './src/server.ts',
  mode: NODE_ENV,
  target: 'node',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    })],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', 'html', 'css'],
  },
  externals: [nodeExternals(),],
  // externals: [{buffer: 'root Buffer'}],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ["ts-loader"]
      }

    ]
  }
},
{
  entry: './src/admin-src/components/ImageInShow.tsx',
  mode: NODE_ENV,
  optimization: {
    minimizer: [new UglifyJsPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    })]
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'src-admin', 'components/'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ["ts-loader"]
      }

    ]
  }
}]