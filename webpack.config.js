const webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const rapidocVersion = JSON.stringify(require('./package.json').version).replace(/"/g, '');

const commonPlugins = [
  new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
  new webpack.HotModuleReplacementPlugin(),
  new ESLintPlugin({ extensions: ['js'] }),
  new CleanWebpackPlugin(),
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  new HtmlWebpackPlugin({
    template: 'index.html',
    filename: "index.html",
    chunks: ["index"],
  }),
  new HtmlWebpackPlugin({
    template: 'api-list.html',
    filename: "api-list.html",
    chunks: ["apiList"],
  }),
];

if (process.env.NODE_ENV === 'production') {
  console.log('BUILDING FOR PRODUCTION ... '); // eslint-disable-line no-console
  commonPlugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
  commonPlugins.push(new DuplicatesPlugin({ emitErrors: false, verbose: true }));
  commonPlugins.push(new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [
          { source: './src/assets/**/*', destination: 'dist/', options: {
              flat: false,
            },
         },
        ],
      },
    },
  }));
}

module.exports = {
  mode: 'production',
  entry: {
    index: ['./src/index.js'],
    apiList: ['./src/list.js'],
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].rapidoc-min.js',
    publicPath: '',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          banner: (licenseFile) => `RapiDoc ${rapidocVersion} | Author - Mrinmoy Majumdar | License information can be found in ${licenseFile} `,
        },
      }),
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src/assets'),
    },
    port: 8080,
    hot: 'only',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes in HTML from CommonJS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      },
      {
        test: /\-styles\.js$/,
        loader: 'minify-template-literal-loader',
        options: {
          caseSensitive: true,
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          sortAttributes: true,
          sortClassName: true
        }
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      buffer: require.resolve('buffer'),
    },
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'lit-html/lib/shady-render.js': path.resolve(__dirname, './node_modules/lit-html/lit-html.js'), // removes shady-render.js from the bundle
    },
  },
  plugins: commonPlugins,
};
