/* 
生产模式 特有的 webpack 配置文件
https://github.com/GuoBinyong/library-webpack-template
*/


const path = require('path');
const tools = require('./tools');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const createBaseConfig = require('./webpack.base.config');
const multiProjConf = require('../project-config');
const createTsConfig = require("./tsconfig.prod.js");




/**
 * 生成 Webpack 配置对象
 * @param  projectConfig : ProjecConfig    项目配置对象
 */
function createWebpackConfig(projectConfig) {

  const tsConfig = createTsConfig(projectConfig);
  const base = createBaseConfig(projectConfig);

  const outputPath = projectConfig.build.outputPath;


  if (tsConfig.compilerOptions.declaration) {
    tsConfig.compilerOptions.declarationDir = outputPath;
  }


  const wpConfig = {
    mode: "production",
    output: {
      path: projectConfig.build.outputPath,
    },
    devtool: projectConfig.build.sourceMap ? projectConfig.build.devtool : false,

    module: {
      rules: [
        ...tools.styleLoaders({
          sourceMap: projectConfig.build.productionSourceMap,
          extract: true,
          usePostCSS: true
        }),
        // TypeScript 的 Loader
        tools.createTsParseLoader(projectConfig.tsconfig && projectConfig.tsconfig.loader,{exclude: /node_modules/},tsConfig),
      ]
    },


    plugins: [

      // extract css into its own file
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: projectConfig.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      }),

    ],


  };




  // 配置插件：开始

  let plugins = wpConfig.plugins || [];



  // Html模板插件
  const htmlTemplate = projectConfig.htmlTemplate;
  if (htmlTemplate) {

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "..", projectConfig.build.outputPath, projectConfig.htmlOut),
      template: htmlTemplate,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
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