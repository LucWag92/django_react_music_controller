const path = require('path');
const webpack = require('webpack');

const isCiBuild = !!process.env.CI;
if (!isCiBuild) {
  require('dotenv').config();
  console.log('Webpack Config: ' + process.env.BASE_URL);
}

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './static/frontend'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      BASE_URL: JSON.stringify(process.env.BASE_URL),
    }),
  ],
};
