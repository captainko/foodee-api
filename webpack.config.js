const path = require('path');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('terser-webpack-plugin');
const glob = require('glob');

const
  NODE_ENV = 'production'
  ;

const entry = glob.sync('./src/web/frontend/**/*.tsx', { ignore: './src/**/*.test.ts' }).reduce((acc, file) => {
  acc[file.replace(/^\.\/src\/(.*?)\.js$/, (_, filename) => filename)] = file
  return acc
}, {});
console.log(entry)
module.exports = [
  {
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
  // {
  //   context: __dirname,
  //   entry,
  //   output: {
  //     path: path.resolve(__dirname, 'dist', 'web', 'frontend', 'components'),
  //     filename: '[name].js'
  //   },
  //   resolve: {
  //     modules: ['node_modules']
  //   },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.tsx?/,
  //         exclude: '/node_modules',
  //         use: [
  //           // {
  //           //   loader: 'babel-loader',
  //           // },
  //           {
  //             loader: 'ts-loader',
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }
]