/* 
开发模式 特有的 webpack 配置文件
https://github.com/GuoBinyong/library-webpack-template
*/


const path = require('path');
const tools = require('./tools');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const createBaseConfig = require('./webpack.base.config');
const multiProjConf = require('../project-config');
const createTsConfig = require("./tsconfig.dev.js");


function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}


/**
 * 生成 Webpack 配置对象
 * @param  projectConfig : ProjecConfig    项目配置对象
 */
function createWebpackConfig(projectConfig) {

  const tsConfig = createTsConfig(projectConfig);
  const base = createBaseConfig(projectConfig);

  const outputPath = projectConfig.dev.outputPath;


  const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
      formatter: require('eslint-formatter-friendly'),
      emitWarning: !projectConfig.dev.showEslintErrorsInOverlay
    }
  });


  if (tsConfig.compilerOptions.declaration) {
    tsConfig.compilerOptions.declarationDir = outputPath;
  }


  const wpConfig = {
    mode: "development",
    devtool: projectConfig.dev.sourceMap ? projectConfig.dev.devtool : false,
    output: {
      path: outputPath,
    },
    module: {
      rules: [
        ...(projectConfig.dev.useEslint ? [createLintingRule()] : []),
        ...tools.styleLoaders({ sourceMap: projectConfig.dev.cssSourceMap, usePostCSS: true }),
        // TypeScript 的 Loader
        tools.createTsParseLoader(projectConfig.tsconfig && projectConfig.tsconfig.loader,{exclude: /node_modules/},tsConfig),
      ],
    },

    plugins: [],
  };


  // 配置插件：开始

  let plugins = wpConfig.plugins || [];


  // Html模板插件
  const htmlTemplate = projectConfig.htmlTemplate
  if (htmlTemplate) {
    // https://github.com/ampedandwired/html-webpack-plugin
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "..", outputPath, projectConfig.htmlOut),
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