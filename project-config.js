'use strict'


const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // webpack 的 target
  wpTarget: "web",  //node  web
  libraryTarget: "umd",

  entry: "./src/index",
  alias: {
    // '@': resolve('src'),
  },
  externals: {},

  // html模板文件； 
  // htmlTemplate:"index.html",
  // Template for index.html
  htmlOut: 'index.html',


  // 静态资源目录
  // staticDirectory:"static",
  // 静态资源输出目录， 如; static
  staticOutDirectory: 'static',

  


  // TypeScript配置:开始

   // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"。
   tsTarget:"es6",

  /*  
  指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"。
   默认值是： target === "ES6" ? "ES6" : "commonjs"  
   */
    //  module:"",
     // 生成相应的 .d.ts文件。
     declaration:true,


     // TypeScript配置:结束

  
  dev: {
    // 输出目录
    outputPath: resolve("dev"),

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    sourceMap:true,
    cssSourceMap: true,
  },

  build: {
    // 输出目录
    outputPath: resolve("prod"),

    /**
     * Source Maps
     */
    sourceMap:true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  }
}
