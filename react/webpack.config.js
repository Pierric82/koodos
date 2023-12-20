const path = require('path');
var webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'  // from the web, not helping
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
  },
  plugins: [
    new webpack.DefinePlugin({
      POCKETBASE_URL: JSON.stringify(process.env.POCKETBASE_URL),
      GIPHY_API_KEY: JSON.stringify(process.env.GIPHY_API_KEY),
    }),
  ],
};
