const path = require('path');
const utils = require('./utils');
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
 * @param  projecConfig : ProjecConfig    项目配置对象
 */
function createWebpackConfig(projecConfig) {

  const tsConfig = createTsConfig(projecConfig);
  const base = createBaseConfig(projecConfig);

  const outputPath = projecConfig.build.outputPath;


  if (tsConfig.compilerOptions.declaration) {
    tsConfig.compilerOptions.declarationDir = outputPath;
  }


  const wpConfig = {
    mode: "production",
    output: {
      path: projecConfig.build.outputPath,
    },
    devtool: projecConfig.build.sourceMap ? projecConfig.build.devtool : false,

    module: {
      rules: [
        ...utils.styleLoaders({
          sourceMap: projecConfig.build.productionSourceMap,
          extract: true,
          usePostCSS: true
        }),
        // TypeScript 的 Loader
        utils.createTsParseLoader(projecConfig.tsconfig && projecConfig.tsconfig.loader,{exclude: /node_modules/},tsConfig),
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
        cssProcessorOptions: projecConfig.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      }),

    ],


  };




  // 配置插件：开始

  let plugins = wpConfig.plugins || [];



  // Html模板插件
  const htmlTemplate = projecConfig.htmlTemplate;
  if (htmlTemplate) {

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "..", projecConfig.build.outputPath, projecConfig.htmlOut),
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





  if (projecConfig.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  return webpackConfig;

}







const multipleWebpackConfig = multiProjConf.map(function (projConf) {
  return createWebpackConfig(projConf);
});

module.exports = multipleWebpackConfig;