var path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const utils = require('./utils');
const config = require('../project-config');
const base = require('./webpack.base.config');
const outputPath = config.dev.outputPath;

const tsConfig = require("./tsconfig.dev.js");

if (tsConfig.compilerOptions.declaration){
  tsConfig.compilerOptions.declarationDir = outputPath;
}

const wpConfig = {
  mode: "development",
  devtool: config.dev.sourceMap ? config.dev.devtool : false,
  output: {
    path: outputPath,
  },
  module: {
    rules: [
      ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }),
      // 用 ts-loader 解析 TypeScript
      {
        test: /\.tsx?$/,
        use: {
          loader:'ts-loader',
          options:require("./tsconfig.dev.js")
        },
      },
    
    ],
  },

  plugins: [],
};


// 配置插件：开始

let plugins = wpConfig.plugins || [];


// Html模板插件
const htmlTemplate = config.htmlTemplate
if (htmlTemplate){
  // https://github.com/ampedandwired/html-webpack-plugin
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: path.resolve(__dirname,"..",outputPath,config.htmlOut),
    template: htmlTemplate,
    inject: true
  });

  plugins.push(htmlPlugin);
}




wpConfig.plugins = plugins;

// 配置插件：结束




const webpackConfig = merge.smart(base,wpConfig);
module.exports = webpackConfig;