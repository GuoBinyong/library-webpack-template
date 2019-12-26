'use strict'


const path = require('path');
const utils = require('./build/utils');
const npmConfig = require("./package.json");



function resolve(dir) {
  return path.join(__dirname, dir)
}


var projecConfig = {

  /* 
  webpack 的入口文件
   */
  entry: "./src/index",

  /* 
  webpack 的 target，用来告知 webpack   bundles 的运行环境。
  因为 服务器 和 浏览器 代码都可以用 JavaScript 编写，所以 webpack 提供了多种部署 target(目标)
  */
  target: "web",  //node  web 等等

  /* 
  webpack 的 输出文件的名字； 默认值：'[name].js'
  */
  // filename:'[name].js',

  /* 
  库的名字
  https://webpack.docschina.org/configuration/output/#output-library
  */
  library: npmConfig.name,

  /* 
  配置对外暴露 库 的方式
  即：库将会以哪种方式被使用

  libraryTarget : "var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"

  https://webpack.docschina.org/configuration/output/#output-librarytarget
  */
  libraryTarget: "umd",

  /* 
  库中被导出的项；
  默认值是："default"
  https://webpack.docschina.org/configuration/output/#output-libraryexport
  */
  libraryExport: "default",

  /* 
  创建 import 或 require 的别名，来使模块引入变得更简单
  https://webpack.docschina.org/configuration/resolve/#resolve-alias
  */
  alias: {
    // '@': resolve('src'),
  },

  /* 
  排除依赖的模块
  https://webpack.docschina.org/configuration/externals/#src/components/Sidebar/Sidebar.jsx
  */
  externals: {},

  /* 
  html模板文件；
  */
  // htmlTemplate:"index.html",

  /* 
  Template for index.html
  */
  htmlOut: 'index.html',


  /* 
  静态资源目录
  */
  // staticDirectory:"static",

  /* 
  静态资源输出目录， 如; static
  */
  staticOutDirectory: 'static',




  // TypeScript配置:开始


  /*
  指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"。
  */
  tsTarget: "es5",

  /*
  指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"。
  默认值是： target === "ES6" ? "ES6" : "commonjs"
   */
  //  module:"",

  /* 
  生成相应的 .d.ts文件。
  */
  declaration: true,


  // TypeScript配置:结束


  dev: {
    /* 
    输出目录
    */
    outputPath: resolve("dev"),


    /* 
     Use Eslint Loader?
     If true, your code will be linted during bundling and
     linting errors and warnings will be shown in the console.
    */
    useEslint: true,

    /* 
     If true, eslint errors and warnings will also be shown in the error overlay
     in the browser.
     */
    showEslintErrorsInOverlay: false,

    /*
     Source Maps
     https://webpack.js.org/configuration/devtool/#development
     */
    devtool: 'cheap-module-eval-source-map',
    sourceMap: true,
    cssSourceMap: true,
  },

  build: {
    // 输出目录
    outputPath: resolve("dist"),

    /* 
    Source Maps
    https://webpack.js.org/configuration/devtool/#production 
    */
    devtool: '#source-map',
    sourceMap: true,


    /* 
    Run the build command with an extra argument to
    View the bundle analyzer report after build finishes:
    `npm run build --report`
    Set to `true` or `false` to always turn it on or off
    */
    bundleAnalyzerReport: process.env.npm_config_report,
  },


  /* 
  配置多个构建目标
  multipleTargets : undefined | null | Array<ProjecConfig>
  些选项是可选的，如果没有配置，或者配置的是一个长度为 0 的空数组，则会使用 默认的配置 projecConfig
  */
  multipleTargets: [
    //使用默认的配置
    {},

    // node
    {
      target:"node",
      filename:'[name].node.js'
    }
  ]

}





module.exports = utils.projecConfigMultipleTargetsSeparation(projecConfig);