'use strict'

/*
project-config.js 是整个项目的配置文件，是 library-webpack-template 提供的 面向使用者的 对 整个项目的配置入口；

https://github.com/GuoBinyong/library-webpack-template
*/

const path = require('path');
const tools = require('./build/tools');



function resolve(dir) {
  return path.join(__dirname, dir)
}


var projectConfig = {

  /*
  指定 在将 多构建目标 `multipleTargets` 中的选项 与 默认的项目配置 projectConfig 进行合并时 采用覆盖方式进行合并的 key；
    - **类型：** undefined | null | Array<string>
    - **默认值：** `["externals"]`
    - **说明：**
       * 此选项只用于 多构建目标 `multipleTargets` 与 默认的项目配置 projectConfig 的合并；
       * 些选择只能配置在 projectConfig 的顶层（即：projectConfig.overrideKeys），多构建目标 `multipleTargets` 中的 overrideKeys 选项会被忽略；
  */
  // overrideKeys:["externals"],


  /*
  配置多个构建目标；当进行构建时，会对 multipleTargets 数组中的每个项目配置分别构建并生成对应的包；
    - **类型：** undefined | null | Array<ProjecConfig | undefined | null>
    - **默认值：** `undefined`
    - **说明：**
        * 此选项是可选的，如果没有配置，或者配置的是一个长度为 0 的空数组，则会使用 默认的项目配置 projectConfig （默认的项目配置指的是 project-config.js 文件中的 projectConfig 变量保存的配置） ；
        * 如果配置的是一个数组，数组中的每个元素都会被当作一个 项目配置 并覆盖 或 合并 默认的项目配置 projectConfig 中对应的具体选项；当进行构建时，会对数组中的每个项目配置分别构建并生成对应的包；
        * 数组中的 undefined 和 null 会被当作是 默认的项目配置 projectConfig；
        * 如果配置了多个构建目标，则应注意多个构建目标的输出因命名、路径或服务端口重复导致导出相互被覆盖 或者 服务启动失败 的问题；这类问题的解决方案就是：分别为每个构建目标设置相应选项设置一个不同的值；如：
            - 分别为每个构建目标的 `filename` 设置一个不同的值，如 `{target: "node", filename: '[name].node.js' }` ，这样可以防止多个构建目标的构建包相互覆盖 ；`filename` 的默认值已包含了配置变量 `libraryTarget`，所以，如果分别为每个构建目标的 `libraryTarget` 选项显式地指定了不同的值，则也不会出现构建输出文件相互覆盖的问题；
            - 如果以 server 模式（这是默认的模式）开启了 构建分析报告，则应该采用以下任意一种方案来对 `bundleAnalyzerOptions.analyzerPort` 进行设置：
                * 方案1（这是默认的设置）：将 所有构建目标公共的 `projectConfig.bundleAnalyzerOptions.analyzerPort` 设置为 auto ；
                * 方案2：分别给每一个 构建目标的 `bundleAnalyzerOptions.analyzerPort` 设置一个不同的值；
  */
  multipleTargets: [
    //使用默认的配置
    null,  // 目前默认配置是：web环境下的umd方案

     // 通过 script 标签直接引用
     {
      target: "web",  //设置被构建的包的运行环境
      filename: '[name].script.js',  //输出的包名
      // library: "",  //库名
      libraryTarget: "window",  //将包挂载到window中与库名同名的属性上
      externals: {},  //不排除何依赖，即将所有依赖都打包进库
    },

    // 通过 commonjs2 规范引用
    {
      // target: "web",   //设置被构建的包的运行环境
      // filename: '[name].commonjs2.js',  //输出的包名
      // library: "",  //库名
      libraryTarget: "commonjs2",  //将库构建成遵循 commonjs2 规范的包
      externals: undefined,  //排除 node_module 中的所有依赖
    },
    // 通过 commonjs 规范引用
    {
      // target: "web",   //设置被构建的包的运行环境
      // filename: '[name].commonjs2.js',  //输出的包名
      // library: "",  //库名
      libraryTarget: "commonjs",  //将库构建成遵循 commonjs2 规范的包
      externals: undefined,  //排除 node_module 中的所有依赖
    },

    // 通过 amd 规范引用
    {
      // target: "web",   //设置被构建的包的运行环境
      // filename: '[name].amd.js',  //输出的包名
      // library: "",  //库名
      libraryTarget: "amd",  //将库构建成遵循 commonjs2 规范的包
      externals: undefined,  //排除 node_module 中的所有依赖
    },

    // node 环境中的 umd 模块化方案
    /* {
      target: "node",   //设置被构建的包的运行环境
      filename: '[name].umd.node.js',  //输出的包名
      // library: "",  //库名
      libraryTarget: "umd",  //将库构建成遵循 commonjs2 规范的包
      externals: undefined,  //排除 node_module 中的所有依赖
    }, */

  ],




  /*
 webpack 的入口配置 entry；  指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图的开始
    - 类型： string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
    - 详细信息： <https://webpack.docschina.org/configuration/entry-context/#entry>
    - 注意： 如果修改了 entry 的值，你可能需要考虑下是否要同步更改下 package.json 中的 module 属性；
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
    - **默认值：**
       + 当未显式指定 libraryTarget 时，`filename` 的默认值为 `<package.json/name>.js`；
       + 当显式指定 libraryTarget 时，`filename` 的默认值为 `<package.json/name>.<project-config.js/libraryTarget>.js`；
       + **注意：**
          * 其中 `<package.json/name>` 的值为 package.json 文件中 name 的值，`<project-config.js/libraryTarget>` 为 project-config.js 文件中 libraryTarget 的值；
          * 你可以在 filename 中使用 webpack 提供的模板字符串，如 `[name]` ；
          * 其中 `<package.json/name>` 和 `<project-config.js/libraryTarget>` 并不是 webpack 给 filename 字段提供的有效的模板字符串；
    - 详细信息： <https://webpack.docschina.org/configuration/output/#output-filename>
  */
  // filename:'[name].js',

  /*
  库的名字；webpack 的 output.library；
    - 类型： string | object | null | undefined （从 webpack 3.1.0 开始；用于 libraryTarget: 'umd'）；
        * 当值为 undefined 时，会使用默认值；
        * 当值为 null 时，会取消配置 webpack 的 output.library
    - 默认值： tools.stringToCamelFormat(package.name)  即默认值是 package.json 文件中的 name 字段的值的驼峰式名字；函数 `tools.stringToCamelFormat(str)` 的作用是把 字符串 str 从 中划线 或 下划线 分隔的方式 转成 驼峰式
    - **说明：** 某些模块化方案（由 `libraryTarget` 选项指定）（比如：`var`、`assign`、`this`、`window`、`self`、`global` 等等）会在引入库时会在环境中注入特定名字的环境变量，以便引入者能够通过该环境变量来访问库对外暴露的接口，该环境变量的名字就是由该选项 `library` 指定；
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-library>
    - **注意：**
       * 如果更改了 library 的值，你可能需要考虑下是否要同步更改下 package.json 中的 name 属性；
       * 如果库不对外导出（暴露）任何东西里，推荐将该 library 设置为 null
  */
  // library: "",

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
  extensions: ['.tsx', '.ts', '.jsx','.js', '.json'],

  /*
  webpack 的 externals； 排除依赖的模块；防止将某些 import 的包(package)打包到 bundle 中；
    - 类型： string | object | function | regex | array
    - **默认值：** `webpackNodeExternals()` ； 即排除所有 `node_modules` 中的模块； `webpackNodeExternals` 是 webpack-node-externals 包提供的功能，该包的信息详见 <https://github.com/liady/webpack-node-externals> ；
    - 详细信息： <https://webpack.docschina.org/configuration/externals/#externals>
  */
  // externals: {},






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



  /* 
  是否要对 `node_modules` 中的模块进行编译；
    - **类型：** boolean
    - **默认值：** `true`
    - **说明：** 如果设置为 `false`，则 `node_modules` 中的依赖会被直接包含，不会经过 webpack 相应 loader 的处理；
  */
  // parseNodeModules:true,
  




  // TypeScript配置
  tsconfig: {


    /*
    指定TypeScript编译成 ECMAScript 的目标版本；用作 tsconfig.json 的 target 选项；
      - 类型： "ES3" | "ES5" | "ES6"/"ES2015" | "ES2016" | "ES2017" | "ESNext"
      - 默认值： "ES3"
      - 详细信息： <https://www.tslang.cn/docs/handbook/compiler-options.html>
    */
    target: "ESNext",

    /*
    指定生成哪个模块系统代码；用作 tsconfig.json 的 module 选项；
      - 类型： "None" | "CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015"
      - 默认值： target === "ES6" ? "ES6" : "commonjs"
      - 详细信息： <https://www.tslang.cn/docs/handbook/compiler-options.html>
     */
     // module:"ES6",

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
      * "ts-loader" 会忽略TypeScript中默认的导出项 `export default`(TypeScript 3 之后 默认禁用了 `export default`)，这时配置项 ` libraryExport: "default" ` 可能会导到导出的值是 undefined；
      * tsconfig 的相关编译选项： allowSyntheticDefaultImports：允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
      * "babel-loader" 暂未支持生成 声明文件 .d.ts，并且会忽略 项目中关于 TypeScript 的自定配置，如：tsconfig.json、tsconfig.dev.js、tsconfig.prod.js 中的配置
    */
    loader: "ts-loader",

  },




  /*
  是否开启构建分析报告；
    - 类型： boolean
    - 默认值： process.env.npm_config_report； 即：根据执行命令时是否带有 `--report` 选项来决定是否开启 构建分析报告；
  */
  // bundleAnalyzerReport: true,


  /*
  构建分析报告的配置选项； webpack-bundle-analyzer 的 webpack 插件选项对象；
    - 类型： Object
    - 默认值： bundleAnalyzerOptions.analyzerPort 的默认值是 "auto"
    - 详细信息： <https://github.com/webpack-contrib/webpack-bundle-analyzer>
    - 注意： 如果你配置了多个构建目标 multipleTargets ，并且以 server 模式（这是默认的模式）开启了 构建分析报告，则建义采用以下任意一种方案来对 `bundleAnalyzerOptions.analyzerPort` 进行设置，这样可以防止针对每个构建目标启动一个 构建分析报告 时，因服务端口被占用而启动失败：
        * 方案1（这是默认的设置）：将 所有构建目标公共的 `projectConfig.bundleAnalyzerOptions.analyzerPort` 设置为 auto ；
        * 方案2：分别给每一个 构建目标的 `bundleAnalyzerOptions.analyzerPort` 设置一个不同的值；
  */
  /* bundleAnalyzerOptions: {
    // analyzerHost: "127.0.0.1",
    // analyzerPort: "9033",
  }, */


  /*
  开发模式的配置选项对象
    - 类型： Object
  */
  dev: {
    /*
    输出目录，一个绝对路径；webpack 的 output.path；
      - 类型： string
      - 详细信息： <https://webpack.docschina.org/configuration/output/#output-path>
      - **注意：**
        + 如果你使用的是 ESLint，建议你将该处配置的输出目录 增加到 ESLint 的忽略配置文件中一般在项目根目录下的 .eslintignore 文件中）；
        + 如果你使用的是 TypeScript，建议你将该处配置的输出目录 增加到 项目根目录下的 TypeScript 配置选项（一般在配置文件 tsconfig.json 中）的 排除字段 "exclude" 下，如：
        ```
        "exclude":[
          "dist",
          "dev"
        ]
        ```
    */
    outputPath: resolve("dev"),


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
    /*
    输出目录，一个绝对路径；webpack 的 output.path；
      - 类型： string
      - 详细信息： <https://webpack.docschina.org/configuration/output/#output-path>
      - **注意：**
        + 如果你使用的是 ESLint，建议你将该处配置的输出目录 增加到 ESLint 的忽略配置文件中一般在项目根目录下的 .eslintignore 文件中）；
        + 如果你使用的是 TypeScript，建议你将该处配置的输出目录 增加到 项目根目录下的 TypeScript 配置选项（一般在配置文件 tsconfig.json 中）的 排除字段 "exclude" 下，如：
        ```
        "exclude":[
          "dist",
          "dev"
        ]
        ```
    */
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
  }

}





module.exports = tools.projecConfigMultipleTargetsSeparation(projectConfig);
