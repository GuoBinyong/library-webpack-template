var path = require('path');
const utils = require('./utils');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const base = require('./webpack.base.config');
const config = require('../project-config');
const outputPath = config.build.outputPath;

const tsConfig = require("./tsconfig.prod.js");
if (tsConfig.compilerOptions.declaration){
  tsConfig.compilerOptions.declarationDir = outputPath;
}


const wpConfig = {
  mode: "production",
  output: {
    path: config.build.outputPath,
  },
  devtool: config.build.sourceMap ? config.build.devtool : false,

  module: {
    rules: [
      ...utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    }),
    {
      test: /\.tsx?$/,
      use: [
      {
        loader:"babel-loader",
        options:{
          presets: utils.createBabelPresets("js")
        }
      },
        {
        loader:'ts-loader',
        options:tsConfig
      }
    ],
    },
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
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),

  ],


};




// 配置插件：开始

let plugins = wpConfig.plugins || [];



// Html模板插件
const htmlTemplate = config.htmlTemplate;
if (htmlTemplate){

  // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname,"..",config.build.outputPath,config.htmlOut),
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





const webpackConfig = merge.smart(base,wpConfig);





if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


module.exports = webpackConfig;