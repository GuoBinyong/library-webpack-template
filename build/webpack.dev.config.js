const path = require('path');
const utils = require('./utils');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const createBaseConfig = require('./webpack.base.config');
const multiProjConf = require('../project-config');
const createTsConfig = require("./tsconfig.dev.js");




/**
 * 生成 Webpack 配置对象
 * @param  projecConfig : ProjecConfig    项目配置对象
 */
function createWebpackConfig(projecConfig) {

  const tsConfig = createTsConfig(projecConfig);
  const base = createBaseConfig(projecConfig);

  const outputPath = projecConfig.dev.outputPath;


  if (tsConfig.compilerOptions.declaration) {
    tsConfig.compilerOptions.declarationDir = outputPath;
  }

  const wpConfig = {
    mode: "development",
    devtool: projecConfig.dev.sourceMap ? projecConfig.dev.devtool : false,
    output: {
      path: outputPath,
    },
    module: {
      rules: [
        ...utils.styleLoaders({ sourceMap: projecConfig.dev.cssSourceMap, usePostCSS: true }),
        // TypeScript 的 Loader
        utils.createTsParseLoader(projecConfig.tsconfig && projecConfig.tsconfig.loader,{exclude: /node_modules/},tsConfig),
      ],
    },

    plugins: [],
  };


  // 配置插件：开始

  let plugins = wpConfig.plugins || [];


  // Html模板插件
  const htmlTemplate = projecConfig.htmlTemplate
  if (htmlTemplate) {
    // https://github.com/ampedandwired/html-webpack-plugin
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "..", outputPath, projecConfig.htmlOut),
      template: htmlTemplate,
      inject: true
    });

    plugins.push(htmlPlugin);
  }




  wpConfig.plugins = plugins;

  // 配置插件：结束




  const webpackConfig = merge.smart(base, wpConfig);


  return webpackConfig;

}




const multipleWebpackConfig = multiProjConf.map(function (projConf) {
  return createWebpackConfig(projConf);
});

module.exports = multipleWebpackConfig;