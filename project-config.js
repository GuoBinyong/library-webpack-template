'use strict'


const path = require('path');
const utils = require('./build/utils');
const npmConfig = require("./package.json");



function resolve(dir) {
  return path.join(__dirname, dir)
}


var projectConfig = {


  /* 
  配置多个构建目标；当进行构建时，会对 multipleTargets 数组中的每个项目配置分别构建并生成对应的包；
    - 类型： undefined | null | Array<ProjecConfig | undefined | null>
    - 默认值： undefined
    - 说明： 
        * 此选项是可选的，如果没有配置，或者配置的是一个长度为 0 的空数组，则会使用 默认的项目配置 projectConfig （默认的项目配置指的是 project-config.js 文件中的 projectConfig 变量保存的配置） ； 
        * 如果配置的是一个数组，数组中的每个元素都会被当作一个 项目配置 并覆盖 默认的项目配置 projectConfig 中对应的具体选项；当进行构建时，会对数组中的每个项目配置分别构建并生成对应的包；
        * 数组中的 undefined 和 null 会被当作是 默认的项目配置 projectConfig
  */
  multipleTargets: [
    //使用默认的配置
    null,

    // node
    {
      target: "node",
      filename: '[name].node.js'
    }
  ],




  /* 
 webpack 的入口配置 entry；  指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图的开始
  - 类型: string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
  - 详细信息： <https://webpack.docschina.org/configuration/entry-context/#entry>  
   */
  entry: "./src/index",

  /* 
  webpack 的 target，用来告知 webpack   bundles 的运行环境。因为 服务器 和 浏览器 代码都可以用 JavaScript 编写，所以 webpack 提供了多种部署 target(目标)
    - 类型： string | function (compiler)
    - 详细信息： <https://webpack.docschina.org/configuration/target/#target> 
  */
  target: "web",  //node  web 等等

  /* 
  webpack 的 filename；此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下
    - 类型： string | function
    - 默认值："[name].js"
    - 详细信息： <https://webpack.docschina.org/configuration/output/#output-filename> 
  */
  // filename:'[name].js',

  /* 
  库的名字；webpack 的 output.library；
    - 类型： string 或 object（从 webpack 3.1.0 开始；用于 libraryTarget: 'umd'）
    - 详细信息： <https://webpack.docschina.org/configuration/output/#output-library> 
    - `utils.stringToCamelFormat(npmConfig.name)` 的作用是把 package.json 中的 name 字段的值 从 中划线 或 下划线 分隔的方式 转成 驼峰式
  */
  library: utils.stringToCamelFormat(npmConfig.name),

  /* 
  配置对外暴露 库 的方式，即：库将会以哪种方式被使用；webpack 的 output.libraryTarget；
    - 类型： "var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"
    - 详细信息： <https://webpack.docschina.org/configuration/output/#output-librarytarget> 
  */
  libraryTarget: "umd",

  /* 
  库中被导出的项；webpack 的 output.libraryExport ；
    - 类型： string | string[]
    - 默认值： "default"
    - 备注： 如果设置成空字符串 "" ，则会导出包含所有导出的对象；
    - 详细信息： <https://webpack.docschina.org/configuration/output/#output-libraryexport> 
  */
  libraryExport: "default",

  /* 
  webpack 的 resolve.alias，创建 import 或 require 的别名，来使模块引入变得更简单
    - 类型： object
    - 详细信息： <https://webpack.docschina.org/configuration/resolve/#resolve-alias> 
  */
  alias: {
    // '@': resolve('src'),
  },


  /* 
  webpack 的 resolve.extensions，自动解析确定的扩展名，能够使用户在引入模块时不用写文件的扩展名
    - 类型： string[]
    - 详细信息： <https://webpack.docschina.org/configuration/resolve/#resolve-extensions> 
  */
  extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],

  /* 
  webpack 的 externals； 排除依赖的模块；防止将某些 import 的包(package)打包到 bundle 中；
    - 类型： string | object | function | regex | array 
    - 详细信息： <https://webpack.docschina.org/configuration/externals/#externals> 
  */
  externals: {},

  /* 
  html模板文件；html-webpack-plugin
 template 的 template 选项；
    - 类型： string
    - 详细信息： <https://github.com/ampedandwired/html-webpack-plugin> 
  */
  // htmlTemplate:"index.html",


  /* 
  要将 html模板文件 htmlTemplate 写入的文件。您也可以在此处指定子目录；该选项会结合 outputPath 选项 生成 html-webpack-plugin
 的 filename 选项 的值；
    - 类型： string
    - 默认值： "index.html"
    - 详细信息： <https://github.com/ampedandwired/html-webpack-plugin>  
  */
  htmlOut: 'index.html',


  /* 
  静态资源的原目录；该目录下的内容将会被拷贝到构建输出目录中；
    - 类型： string
  */
  // staticDirectory:"static",

  /* 
  静态资源输出目录；设置将静态资源从原目录拷贝到构建输出目录中时，静态资源目录的名字；
    - 类型： string
  */
  staticOutDirectory: 'static',




  // TypeScript配置
  tsconfig: {


    /*
    指定TypeScript编译成 ECMAScript 的目标版本；用作 tsconfig.json 的 target 选项；
      - 类型： "ES3" | "ES5" | "ES6"/"ES2015" | "ES2016" | "ES2017" | "ESNext"
      - 默认值： "ES3"
      - 详细信息： <https://www.tslang.cn/docs/handbook/compiler-options.html>  
    */
    target: "es5",

    /*
    指定生成哪个模块系统代码；用作 tsconfig.json 的 module 选项；
      - 类型： "None" | "CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015"
      - 默认值： target === "ES6" ? "ES6" : "commonjs"
      - 详细信息： <https://www.tslang.cn/docs/handbook/compiler-options.html>  
     */
    //  module:"",

    /* 
    指定是否生成相应的 .d.ts 文件。用作 tsconfig.json 的 declaration 选项
      - 类型： boolean
      - 默认值： false 
      - 详细信息： <https://www.tslang.cn/docs/handbook/compiler-options.html> 
    */
    declaration: true,





    /* 
    配置解析 TypeScript 的 loader
    - 类型： "ts-loader" | "babel-loader" 
    - 默认值： "ts-loader" 
    - 注意： 目前发现：
      * "ts-loader" 会忽略TypeScript中默认的导出项 `export default`，这时配置项 ` libraryExport: "default" ` 可能会导到导出的值是 undefined
      * "babel-loader" 暂未支持生成 声明文件 .d.ts，并且会忽略 项目中关于 TypeScript 的自定配置，如：tsconfig.json、tsconfig.dev.js、tsconfig.prod.js 中的配置
    */
    loader: "ts-loader",

  },


  /* 
  开发模式的配置选项对象
    - 类型： Object
  */
  dev: {
    /* 
    输出目录，一个绝对路径；webpack 的 output.path；
      - 类型： string
      - 详细信息： <https://webpack.docschina.org/configuration/output/#output-path>
    */
    outputPath: resolve("dev"),


    /* 
     是否使用 Eslint Loader；
      - 类型： boolean
      - 默认值： false
      - 详细信息： <https://github.com/webpack-contrib/eslint-loader>
      
     If true, your code will be linted during bundling and
     linting errors and warnings will be shown in the console.
    */
    useEslint: true,

    /* 
    是否在浏览器中显示 Eslint 的错误和警告；
      - 类型： boolean
      - 默认值： false
      - 详细信息： <https://github.com/webpack-contrib/eslint-loader>

     If true, eslint errors and warnings will also be shown in the error overlay
     in the browser.
     */
    showEslintErrorsInOverlay: true,

    /* 
    source map 的开关；用于控制是否生成 source map；
      - 类型： boolean
      - 默认值： false
      - 详细信息： <https://webpack.docschina.org/configuration/devtool/>
    */
    sourceMap: true,
    /*
     webpack 的 devtool 选项；用于控制如何生成 source map；
      - 类型： string
      - 默认值： false
      - 详细信息： <https://webpack.docschina.org/configuration/devtool/>
     */
    devtool: 'cheap-module-eval-source-map',

    /* 
    CSS source map 的开关；用于控制是否生成 CSS 的 source map；
      - 类型： boolean
      - 默认值： false
    */
    cssSourceMap: true,
  },


  /* 
  生产模式的配置选项对象
    - 类型： Object
  */
  build: {
    // 输出目录
    outputPath: resolve("dist"),


    /* 
source map 的开关；用于控制是否生成 source map；
  - 类型： boolean
  - 默认值： false
  - 详细信息： <https://webpack.docschina.org/configuration/devtool/>
*/
    sourceMap: true,


    /*
     webpack 的 devtool 选项；用于控制如何生成 source map；
      - 类型： string
      - 默认值： false
      - 详细信息： <https://webpack.docschina.org/configuration/devtool/>
     */
    devtool: '#source-map',


    /* 
    是否启用包分析报告；
      - 类型： boolean
      - 默认值： false
      - `process.env.npm_config_report` 表示运行命令时是否带有 `--report` 选项；如果给 `bundleAnalyzerReport` 设置 `process.env.npm_config_report` ，则会根据 运行 build 命令 `npm run build` 时是否带有 `--report` 选项来决定是否启用 包的分析报告；

    Run the build command with an extra argument to
    View the bundle analyzer report after build finishes:
    `npm run build --report`
    Set to `true` or `false` to always turn it on or off
    */
    bundleAnalyzerReport: process.env.npm_config_report,
  }

}





module.exports = utils.projecConfigMultipleTargetsSeparation(projectConfig);