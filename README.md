[交互式可视化树形构建分析报告]: https://i.loli.net/2020/04/08/l1PkSEtv2U3O9Fw.gif




[git仓库]: https://github.com/GuoBinyong/-library-webpack-template
[issues]: https://github.com/GuoBinyong/-library-webpack-template/issues

[码云仓库]: https://gitee.com/guobinyong/library-webpack-template



> 构建过程是复杂的前端项目必不可少的环节；但 业务代码 与 公用代码（如：封装的库、组件、工具等被复用的代码）的构建需求是不一样的；我发现很多 npm 贡献者都没意识到这一点，他们用传统的业务项目的 webpack 配置 去打包 公用代码，虽然能运行，但实际潜藏着许多问题；甚至都不经过编译构建，直接发布单纯的源码到 npm 上；由于本人经常封装一些东西，为了方便构建，就使用 webpack 开发并配置了一套专门用于构建公共代码的配置模板，当需要开发和构建公共代码时，直接克隆本项目即可；




<!-- TOC -->

- [1. 简介](#1-简介)
- [2. 特性](#2-特性)
- [3. 使用](#3-使用)
- [4. 命令](#4-命令)
- [5. 业务代码与公用代码的构建特点](#5-业务代码与公用代码的构建特点)
    - [5.1. 业务代码](#51-业务代码)
    - [5.2. 公用代码](#52-公用代码)
- [6. 构建工具的选择](#6-构建工具的选择)
- [7. 公共代码构建的配置目标](#7-公共代码构建的配置目标)
- [8. 组织结构](#8-组织结构)
- [9. project-config.js](#9-project-configjs)
- [10. npm包管理配置文件](#10-npm包管理配置文件)
- [11. Webpack配置文件](#11-webpack配置文件)
- [12. TypeScript配置文件](#12-typescript配置文件)
- [13. 代码检查](#13-代码检查)

<!-- /TOC -->




**注意：**
为了方便下文描述，我把 **业务代码** 构建出的最终产品称为 **应用程序**；把 **公用代码** 构建的出产品称为 **组件**；



# 1. 简介
library-webpack-template 称为 库构建模板，又称 公共代码构建模板 ，是专门用于构建 公共代码（如：封装的库、工具等） 的 webpack 配置模板，并对 webpack 配置做了二次封装，当需要开发和构建公共代码时，直接克隆本项目，并默认在的 src 目录下开发即可；如需定制化配置，只需更改项目根目录下的 `project-config.js` 配置文件即可，里面的配置字段 传明达意、简单易懂，且有详细的说明，摈弃了 webpack 配置的鱼龙混杂、掩人耳目；

- [主页(GitHub)][git仓库]：<https://github.com/GuoBinyong/-library-webpack-template>
- [主页(码云)][码云仓库]：<https://gitee.com/guobinyong/library-webpack-template>


**如果您在使用的过程中遇到了问题，或者有好的建议和想法，您都可以通过以下方式联系我，期待与您的交流：**
- 给该仓库提交 [issues][]
- 给我 Pull requests
- 邮箱：<guobinyong@qq.com>
- QQ：guobinyong@qq.com
- 微信：keyanzhe


# 2. 特性
- 极易使用，配置极其简单，配置项传明达意、简单易懂；
- 可配置去除 公共代码 的依赖，默认去除了所有 `node_modules` 中的依赖；
- 多个构建目标可同时构建，即：一次构建分别生成多个构建目标的构建包；
- 可快速切换 开发模式 和 生产模式；
- 自动分离 CSS 和 JavaScript 文件；
- 支持 JavaScript、JSX、TypeScript、TSX、CSS、Sass、Less、Stylus、PostCss等等；
- 支持 ESLint；
- 支持 代码压缩；
- 支持 交互式可视化树形构建分析报告，如下图：
    ![交互式可视化树形构建分析报告][]


# 3. 使用
从 [git仓库][] 克隆或者下载本项目到本地，然后默认从 `src/index` 文件开始写代码即可；
通过 项目配置文件 `project-config.js` 可根据自己的需求进行定制；



# 4. 命令
library-webpack-template 项目支持如下构建命令：
- `npm start` : 以开发模式构建项目；
- `npm run dev` : 以开发模式构建项目；
- `npm run build` : 以生产模式构建项目；

在 project-config.js 配置文件中，如果 没有配置 bundleAnalyzerReport 选项，则支持运行构建命令时 携带 `--report` 选项来开启 交互式可视化树形构建分析报告，如：`npm start --report`、`npm run dev --report`、`npm run build --report`，当构建完成时，会自动打开浏览器展示 交互式可视化树形构建分析报告，如下图：

   ![交互式可视化树形构建分析报告][]




如果已经全局安装了 `webpack` 命令，也可以在项目根目录下执行如下命令：
- `webpack` : 以开发模式构建项目；
- `webpack --env.production` : 以生产模式构建项目；





# 5. 业务代码与公用代码的构建特点

## 5.1. 业务代码
- 需要把所有代码及依赖（包括 公用代码）都构建在一块，作为一个整体来运行；
    因为：业务代码的最终呈现效果是应用程序，应用程序是一个完整的代码逻辑，任何依赖的缺失都会导致应用程序崩溃。

- 运行环境单一；
    业务代码构建的应用程序要么是运行在浏览器的，要么是运行在 node 环境的；因为业务产品是最终供大众用户使用的，在开发业务产品（应用程序）之初，就已确定了业务产品的运行环境。

- 构建目标单一；
    在构建业务代码时，往往构建目标是明确的，要么是构建浏览器应用，要么是构建 note 应用，或者其它，总之很少有同时构建多个目标的，比如同时构建浏览器和 note 环境的应用程序。

- 有较强的包体积的限制；
    因为大部分应用程序是运行在浏览器的，较大的包体积会使应用程序加载时间过长，从而影响用户体验，所以，一般应用程序都要求包的体积尽可能的小；

- 业务代码中通常包含 HTML、CSS、JavaScript 文件；
- CSS 和 JavaScript 文件通常都需要在 HTML 文件中引入；
    浏览器端的应用程序都是以HTML文件为入口的，通过HTML加载 CSS 和 JavaScript 文件；


## 5.2. 公用代码
- 需要去除依赖；
    公共代码的依赖往往也是其它公共代码或者业务代码的依赖，当业务代码中引入公共代码时，极有可能也引入了该公共代码的依赖，如果公共代码中不去除其依赖，则会导致业务代码中包含多份公共代码的依赖，造成代码冗余，增大业务代码的体积；

- 运行环境多样；
    公众代码是被应用程序引用的，应用程序的运行环境可能是浏览器，也可能是 node ，或者其它 ，所以公共代码的运行环境是多样性的；

- 构建目标多样；
    因为公共代码的运行环境是多样的，所以在需要对公共代码进行构建时，往往需要针对每个运行环境分别进行构建；

- 对包体积的没有特别强列的要求；
    公共代码最终是要被业务代码引用的，面业务代码构建成应用程序时通常需要做包体积的压缩的，所以，对包体积的压缩通常会在业务代码构建成应用程序时进行，所以，当公共代码构建成组件时，大多数情况下也可不做体积压缩；

- 通常不包含 HTML 文件；
- CSS 和 JavaScript 文件通常分开；
    CSS 和 JavaScript 的组织方式往往是由业务代码组织结构和构建方案决定，所以，在公共代码中，CSS 和 JavaScript 通常是分开的，具体怎么组织，由业务代码决定；



# 6. 构建工具的选择
前端的构建工具有很多，像：Webpack、rollup、Browserify、Parcel、Grunt、Gulp等等；

目前，对于构建公共代码的工具较常用的是 rollup，对于构建业务代码，较常用的工具是 Webpack；不过，Webpack 也是可以用于构建公共代码的。

为了统一性，我选择了用 Webpack 构建 公共代码；所以，就有了本项目————库构建模板，又称 公共代码构建模板：针对Library的Webapck构建配置模板；


# 7. 公共代码构建的配置目标
公共代码构建的配置目标其就是实现上文所述的公共代码的构建特点，总结如下：

- 去除依赖
- 一次构建可分别生成适用于不同环境的码包；
    比如：分别生成用于 node 和 浏览器 环境的包，或者 不同模块化方案的包，如 AMD、CMD、 CommonJS、UMD等等；
- 能在 开发 和 生产 两种模式快速切换；
    开发 模式下地在需要更多的调试信息，如 Source Map ；而生产模式下需求尽可能地压缩包的体积；在开发调试的过程中，需要在开发模式下构建包；当开发完毕，准备发布时，需要在生产模式下构建包；
- 分离 CSS 和 JavaScript 文件；



# 8. 组织结构
模板项目中默认包含了一些文件和目录，它们的组织结构和作用如下所示：
```
library-webpack-template/   # 构建前端库的webpack打包配置模板项目根目录
   ├── .editorconfig           # 编辑器的通用配置文件
   ├── .eslintignore           # ESLint 的忽略配置文件
   ├── .eslintrc.js            # ESLint 的配置文件
   ├── .gitignore              # git 的忽略配置文件
   ├── .npmignore              # npm 上传包时的忽略配置文件
   ├── .postcssrc.js           # PostCSS 的配置文件
   ├── tsconfig.json           # 项目的级的 TypeScript 配置文件；同时也是 开发 和 生产 这两种模式公共的 TypeScript 配置文件；
   ├── webpack.config.js       # webpack 命令默认的配置文件；这个配置文件存在的目的是为了方便能在项目根目录下直接使用 `webpack` 命令 进行构建；它会根据执行 webpack 命令时是否携带含有设置 production 环境变量的选项来决定是加载 生产模式 还是 开发模式 的 构建配置；
   ├── package.json            # npm 的包管理配置文件
   ├── project-config.js       # 项目的配置文件；library-webpack-template 提供的 面向使用者的 对 整个项目的配置入口；
   ├── README.md               # 项目的说明文档
   ├── build/                  # 包含构建相关配置和工具的目录
   │   ├── tsconfig.dev.js          # 开发模式特有的 TypeScript 配置文件
   │   ├── tsconfig.prod.js         # 生产模式特有的 TypeScript 配置文件
   │   ├── tools.js                 # 包含与构建相关的工具函数的 JavaScript 代码文件
   │   ├── webpack.base.config.js   # 开发 和 生产两种模式公共的 webpack 配置文件；
   │   ├── webpack.dev.config.js    # 开发模式 特有的 webpack 配置文件；
   │   └── webpack.prod.config.js   # 生产模式 特有的 webpack 配置文件；
   ├── src/                    # 默认的包含项目源代码的目录
   │   └── index.js                 # 默认的构建入口文件；
   ├── dev/                    # 开发模式下默认的构建输出目录
   └── dist/                   # 生产模式下默认的构建输出目录
```


# 9. project-config.js
project-config.js 是整个项目的配置文件，是 library-webpack-template 提供的 面向使用者的 对 整个项目的配置入口；相对于 webpack 配置文件，该配置文件具有 传明达意、简单易懂 之特点；

该配置文件中的所有配置项都保存在 projectConfig 变量中，可配置的属性如下：

+ entry：webpack 的入口配置 entry；  指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图的开始
    - **类型：** `string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })`
    - **详细信息：** <https://webpack.docschina.org/configuration/entry-context/#entry>
    - **注意：** 如果修改了 entry 的值，你可能需要考虑下是否要同步更改下 package.json 中的 module 属性；




+ haveExports : 用于指示库是否有对外暴露的内容，即：是否有导出的项目；
    - **类型：** `boolean`
       * 当值为 `true` 时，选择 `refName` 才会起作用；
       * 当值为 `false` 时，会忽略 `refName` 选项；
    - **默认值：** `true`




+ refName ：库的引用名字；与 webpack 的 `output.library` 选项相同；某些模块化方案（由 `module` 选项指定）（比如：`var`、`assign`、`this`、`window`、`self`、`global` 等等）会在引入库时会在环境中注入特定名字的环境变量，以便引入者能够通过该环境变量来访问库对外暴露的接口，该环境变量的名字就是由该选项 `refName` 指定；
    - 类型： `string | {root: string, commonjs: string, amd: string} | null | undefined`
        * 当值为 `undefined` | `null` 时，会使用默认值；
        * 从 webpack 3.1.0 开始；对象类型 `{root: string, commonjs: string, amd: string}` 的值可用于 项目配置文件 project-config.js 中的 `module` 选项（即：webpack 中 output.libraryTarget 选项）的值为 `'umd'` 时；
    - **默认值：** `package.name.toCamelFormat()`  即默认值是 package.json 文件中的 name 字段的值的驼峰式名字；字符串的方法 `toCamelFormat()` 是库 `es-expand` 对字符串的扩展方法，作用是把 字符串 从 中划线 或 下划线 分隔的方式 转成 驼峰式
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-library>
    - **注意：**
       * 只有当选项 `haveExports` 的值为 `haveExports` 时，此选项 `refName` 才会有效；
       * 如果更改了 refName 的值，你可能需要考虑下是否要同步更改下 package.json 中的 name 属性；


+ module ：配置库的构建目标（即：被构建（打包）后的包）采用的模块化方案，也可以理解为：对外暴露 库 的方式，即：库将会以哪种方式被使用；与 webpack 的 `output.libraryTarget` 选项相同；
    - **类型：** `"var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"`
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-librarytarget>





+ libraryExport ：库中被导出的项；与 webpack 的 `output.libraryExport` 选项相同；
    - **类型：** `string | string[]`
    - **默认值：** `"default"`
    - **备注：** 如果设置成空字符串 "" ，则会导出包含所有导出的对象；
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-libraryexport>




+ removeDep ：构建库时，是否要移除库依赖的模块；库依赖的模块由 `dependencies` 选项指定；
    - **类型：** `boolean`
       * 当值为 `true` 时，会移除 `dependencies` 选项指定的依赖；
       * 当值为 `false` 时，不会移除任何依赖；
    - **默认值：** `true`


+ dependencies ：配置库的依赖；与 webpack 的 `externals` 选项相同；
    - **类型：** `string | object | function | regex | array`
    - **默认值：** `webpackNodeExternals()` ； 即排除所有 `node_modules` 中的模块； `webpackNodeExternals` 是 webpack-node-externals 包提供的功能，该包的信息详见 <https://github.com/liady/webpack-node-externals> ；
    - **详细信息：** <https://webpack.docschina.org/configuration/externals/#externals>
    - **注意：** 只有 `removeDep` 选项被设置为 `true` 时，该选项 `dependencies` 才会生效；





+ runEnv：指定库被使用时的运行环境；与 webpack 的 `target` 选项相同；因为 服务器 和 浏览器 代码都可以用 JavaScript 编写，所以 webpack 提供了多种部署 target(目标)
    - **类型：** `"web" | "webworker" | "node" | "node-webkit" | "async-node" | "electron-main" | "electron-renderer" | function (compiler)`
    - **默认值：** `"web"`
    - **详细信息：** <https://webpack.docschina.org/configuration/target/#target>


+ outputFile ：设置构建后的输出文件的名字；与 webpack 的 `output.filename` 相同；此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 outputDir 选项指定的目录下
    - **类型：** `string | function`
    - **默认值：**
       + 当未显式指定 `module` 时，`outputFile` 的默认值为 `<package.json/name>.js`；
       + 当显式指定 `module` 时，`outputFile` 的默认值为 `<package.json/name>.<project-config.js/module>.js`；
       + **注意：**
          * 其中 `<package.json/name>` 的值为 package.json 文件中 name 的值，`<project-config.js/module>` 为 project-config.js 文件中 module 的值；
          * 你可以在 `outputFile` 中使用 webpack 提供的模板字符串，如 `[name]` ；
          * 其中 `<package.json/name>` 和 `<project-config.js/module>` 并不是 webpack 给 output.filename 字段提供的有效的模板字符串；
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-filename>


+ extensions ：与 webpack 的 `resolve.extensions` 选项相同，自动解析确定的扩展名，能够使用户在引入模块时不用写文件的扩展名
    - **类型：** `string[]`
    - **详细信息：** <https://webpack.docschina.org/configuration/resolve/#resolve-extensions>



+ alias：与 webpack 的 `resolve.alias` 选项相同，创建 import 或 require 的别名，来使模块引入变得更简单
    - **类型：** `object`
    - **详细信息：** <https://webpack.docschina.org/configuration/resolve/#resolve-alias>




+ useEslint ：是否使用 Eslint Loader；
    - **类型：** `boolean`
    - **默认值：** `false`
    - **详细信息：** <https://github.com/webpack-contrib/eslint-loader>

+ showEslintErrorsInOverlay ：是否在浏览器中显示 Eslint 的错误和警告；
    - **类型：** `boolean`
    - **默认值：** `false`
    - **详细信息：** <https://github.com/webpack-contrib/eslint-loader>


+ htmlTemplate ：html模板文件；html-webpack-plugin
  的 template 选项；
    - **类型：** `string`
    - **详细信息：** <https://github.com/ampedandwired/html-webpack-plugin>

+ htmlOut ：要将 html模板文件 htmlTemplate 写入的文件。您也可以在此处指定子目录；该选项会结合 outputDir 选项 生成 html-webpack-plugin 的 filename 选项 的值；
    - **类型：** `string`
    - **默认值：** `"index.html"`
    - **详细信息：** <https://github.com/ampedandwired/html-webpack-plugin>

+ staticDirectory：静态资源的原目录；该目录下的内容将会被拷贝到构建输出目录中；
    - **类型：** `string`

+ staticOutDirectory：静态资源输出目录；设置将静态资源从原目录拷贝到构建输出目录中时，静态资源目录的名字；
    - **类型：** `string`

+ parseNodeModules ：是否要对 `node_modules` 中的模块进行编译；
    - **类型：** `boolean`
    - **默认值：** `true`
    - **说明：** 如果设置为 `false`，则 `node_modules` 中的依赖会被直接包含，不会经过 webpack 相应 loader 的处理；


+ tsconfig：TypeScript相关的配置选项对象；可配置 TypeScript 的所有 编译选项，即：tsconfig.compilerOptions 中的选项；
    - **类型：** `Object`
    - **详细信息：** <https://www.tslang.cn/docs/handbook/tsconfig-json.html>
    - 除 TypeScript 的所有 编译选项外，还可配置如下属性：
        * loader：配置解析 TypeScript 的 loader
            - **类型：** `"ts-loader" | "babel-loader"`
            - **默认值：** `"ts-loader"`
            - **注意：** 目前发现：
              * "ts-loader" 会忽略TypeScript中默认的导出项 `export default`(TypeScript 3 之后 默认禁用了 `export default`)，这时配置项 ` libraryExport: "default" ` 可能会导致导出的值是 undefined
              * tsconfig 的相关编译选项： allowSyntheticDefaultImports：允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
              * "babel-loader" 暂未支持生成 声明文件 .d.ts，并且会忽略 项目中关于 TypeScript 的自定配置，如：tsconfig.json、tsconfig.dev.js、tsconfig.prod.js 中的配置



+ bundleAnalyzerReport ：是否开启构建分析报告；
    - **类型：** `boolean`
    - **默认值：** `process.env.npm_config_report`； 即：根据执行命令时是否带有 `--report` 选项来决定是否启用 构建分析报告；


+ bundleAnalyzerOptions ：构建分析报告的配置选项； webpack-bundle-analyzer 的 webpack 插件选项对象；
    - **类型：** `Object`
    - **默认值：** `bundleAnalyzerOptions.analyzerPort` 的默认值是 `"auto"`
    - **详细信息：** <https://github.com/webpack-contrib/webpack-bundle-analyzer>
    - **注意：** 如果你配置了多个构建目标 multipleTargets ，并且以 server 模式（这是默认的模式）开启了 构建分析报告，则建义采用以下任意一种方案来对 `bundleAnalyzerOptions.analyzerPort` 进行设置，这样可以防止针对每个构建目标启动一个 构建分析报告 时，因服务端口被占用而启动失败：
        * 方案1（这是默认的设置）：将 所有构建目标公共的 `projectConfig.bundleAnalyzerOptions.analyzerPort` 设置为 auto ；
        * 方案2：分别给每一个 构建目标的 `bundleAnalyzerOptions.analyzerPort` 设置一个不同的值；


+ dev：开发模式的配置选项对象
    - **类型：** `Object`
    - 可配置的属性如下：
        * outputDir ：输出目录，一个绝对路径；与 webpack 的 `output.path` 选项相同；
            - **类型：** `string`
            - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-path>
            - **注意：**
                + 如果你使用的是 ESLint，建议你将该处配置的输出目录 增加到 ESLint 的忽略配置文件中一般在项目根目录下的 .eslintignore 文件中）；
                + 如果你使用的是 TypeScript，建议你将该处配置的输出目录 增加到 项目根目录下的 TypeScript 配置选项（一般在配置文件 tsconfig.json 中）的 排除字段 "exclude" 下，如：
                ```
                "exclude":[
                  "dist",
                  "dev"
                ]
                ```


        * sourceMap ：source map 的开关；用于控制是否生成 source map；
            - **类型：** `boolean`
            - **默认值：** `false`
            - **详细信息：** <https://webpack.docschina.org/configuration/devtool/>

        * devtool ：与 webpack 的 `devtool` 选项相同；用于控制如何生成 source map；
            - **类型：** `string`
            - **默认值：** `false`
            - **详细信息：** <https://webpack.docschina.org/configuration/devtool/>

        * cssSourceMap ：CSS source map 的开关；用于控制是否生成 CSS 的 source map；
            - **类型：** `boolean`
            - **默认值：** `false`




+ build：生产模式的配置选项对象
    - **类型：** `Object`
    - 可配置的属性如下：
        * outputDir ：输出目录，一个绝对路径；与 webpack 的 output.path 选项相同；
            - **类型：** `string`
            - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-path>
            - **注意：**
                + 如果你使用的是 ESLint，建议你将该处配置的输出目录 增加到 ESLint 的忽略配置文件中一般在项目根目录下的 .eslintignore 文件中）；
                + 如果你使用的是 TypeScript，建议你将该处配置的输出目录 增加到 项目根目录下的 TypeScript 配置选项（一般在配置文件 tsconfig.json 中）的 排除字段 "exclude" 下，如：
                ```
                "exclude":[
                  "dist",
                  "dev"
                ]
                ```




        * sourceMap ：source map 的开关；用于控制是否生成 source map；
            - **类型：** `boolean`
            - **默认值：** `false`
            - **详细信息：** <https://webpack.docschina.org/configuration/devtool/>

        * devtool ：与 webpack 的 `devtool` 选项相同；用于控制如何生成 source map；
            - **类型：** string
            - **默认值：** `false`
            - **详细信息：** <https://webpack.docschina.org/configuration/devtool/>






+ multipleTargets ：配置多个构建目标；当进行构建时，会对 multipleTargets 数组中的每个项目配置分别构建并生成对应的包；
    - **类型：** `undefined | null | Array<ProjecConfig | undefined | null>`
    - **默认值：** `undefined`
    - **说明：**
        * 此选项是可选的，如果没有配置，或者配置的是一个长度为 0 的空数组，则会使用 默认的项目配置 projectConfig （默认的项目配置指的是 project-config.js 文件中的 projectConfig 变量保存的配置） ；
        * 如果配置的是一个数组，数组中的每个元素都会被当作一个 项目配置 并覆盖 或 合并 默认的项目配置 projectConfig 中对应的具体选项；当进行构建时，会对数组中的每个项目配置分别构建并生成对应的包；
        * 数组中的 undefined 和 null 会被当作是 默认的项目配置 projectConfig；
        * 如果配置了多个构建目标，则应注意多个构建目标的输出因命名、路径或服务端口重复导致导出相互被覆盖 或者 服务启动失败 的问题；这类问题的解决方案就是：分别为每个构建目标设置相应选项设置一个不同的值；如：
            - 分别为每个构建目标的 `outputFile` 设置一个不同的值，如 `{runEnv: "node", outputFile: '[name].node.js' }` ，这样可以防止多个构建目标的构建包相互覆盖 ；`outputFile` 的默认值已包含了配置变量 `module`，所以，如果分别为每个构建目标的 `module` 选项显式地指定了不同的值，则也不会出现构建输出文件相互覆盖的问题；
            - 如果以 server 模式（这是默认的模式）开启了 构建分析报告，则应该采用以下任意一种方案来对 `bundleAnalyzerOptions.analyzerPort` 进行设置：
                * 方案1（这是默认的设置）：将 所有构建目标公共的 `projectConfig.bundleAnalyzerOptions.analyzerPort` 设置为 auto ；
                * 方案2：分别给每一个 构建目标的 `bundleAnalyzerOptions.analyzerPort` 设置一个不同的值；


+ overrideKeys ：指定 在将 多构建目标 `multipleTargets` 中的选项 与 默认的项目配置 projectConfig 进行合并时 采用覆盖方式进行合并的 key；
    - **类型：** `Array<string> | undefined | null`
    - **默认值：** `undefined`
    - **说明：**
       * 此选项只用于 多构建目标 `multipleTargets` 与 默认的项目配置 projectConfig 的合并；
       * 些选择只能配置在 projectConfig 的顶层（即：projectConfig.overrideKeys），多构建目标 `multipleTargets` 中的 overrideKeys 选项会被忽略；



# 10. npm包管理配置文件
library-webpack-template 中与 npm 包管理相关的配置文件有 2 个：
- `.npmignore` : npm 上传包时的忽略配置文件；默认忽略了 与构建配置文件的所有文件和目录，如：`build/` 等等；也忽略了开发环境默认的输出目录 `dev/`，还有编辑器相关的文件和目录，如：`.idea`、`.vscode`；
- `package.json` : npm 的包管理配置文件；同时也是 通过 npm 上传、发布 包 的 配置模板文件；

**注意：** `package.json` 文件中的如下字段：
- `module` : 该字段是用来指定以标准模块暴露的出口文件；
- `types` | `typings` ： 该字段是用来指定库的类型声明文件；如果库没有类型声明文件，则去除该字段；
- "sideEffects" : boolean | Array<string> ，可以为布尔，表示整个包是否有副作用；也可以是一些有副作用文件的的路径字符串，路径支持 相对路径、绝对路径和 glob 模式； 副作用标记；表明项目中的哪些文件不是 纯的 ES2015 模块，由此不能安全地删除文件中未使用的部分，"side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export；详细内容请见 <https://webpack.docschina.org/guides/tree-shaking/#将文件标记为-side-effect-free-无副作用->

_关于`package.json`文件的详细配置信息请参考<https://docs.npmjs.com/files/package.json>_



# 11. Webpack配置文件
library-webpack-template 中包含了4个 webpack 配置文件：

- `build/webpack.base.config.js` : 这个文件包含提 开发 和 生产这两个模式 公共的 webpack 配置；
- `build/webpack.dev.config.js` : 这个文件仅包含提 开发模式 特有的 webpack 配置；
- `build/webpack.prod.config.js` : 这个文件仅包含提 生产模式 特有的 webpack 配置；
- `webpack.config.js` : 这个配置文件存在的目的是为了方便能在项目根目录下直接使用 `webpack` 命令 进行构建；它会根据执行 webpack 命令时是否携带含有设置 production 环境变量的选项来决定是加载 生产模式 还是 开发模式 的 构建配置；

所以，项目真正的 webpack 构建配置是放在 `build/` 目录下的 3个 webpack 配置文件中的：`build/webpack.base.config.js`、`build/webpack.dev.config.js`、`build/webpack.prod.config.js` ；


_关于 webpack 的详细配置信息请参考<https://webpack.docschina.org/configuration/>_


# 12. TypeScript配置文件
library-webpack-template 中包含了3个 TypeScript 配置文件：
- `tsconfig.json` : 这个文件是项目的级的 TypeScript 配置文件；同时也是 开发 和 生产 这两种模式公共的 TypeScript 配置文件； 并且 该文件的存在，也是为了方便能在项目根目录下直接使用 TypeScript 的编译命令 `tsc`；
- `build/tsconfig.dev.js` : 这个文件仅包含提 开发模式 特有的 TypeScript 配置；并且会覆盖 公共配置 `tsconfig.json` 中相应的具体选项；
- `build/tsconfig.prod.js` : 这个文件仅包含提 生产模式 特有的 TypeScript 配置；并且会覆盖 公共配置 `tsconfig.json` 中相应的具体选项；

其中 `build/` 目录下的 tsconfig 配置文件是供 ts-loader 使用的，并且只会用到 `tsconfig` 中的编译选项 `compilerOptions`，其它选项会被忽略；

_关于 `tsconfig` 的详细配置信息请参考 <https://www.typescriptlang.org/docs/handbook/tsconfig-json.html>_


# 13. 代码检查
本配置模版默认使用 ESLint 作为 JavaScript 和 TypeScript 的代码检查工具；至于为什么 TypeScript 不用 TSLint 作为代码检查工具的原因请参看 <https://github.com/typescript-eslint/typescript-eslint>；

ESLint 相关的配置文件如下：
- `.eslintrc.js` : ESLint 的配置文件，可配置 解析器、解析选项、规则 等等；默认是 TypeScript 代码检查配置；
- `.eslintignore` : ESLint 的忽略文件的配置文件；

_关于 ESLint 的详细配置信息请参考 <http://eslint.cn/docs/user-guide/configuring>_




--------------------

> 有您的支持，我会在开源的道路上，越走越远

![赞赏码](https://i.loli.net/2020/04/08/PGsAEqdJCin1oQL.jpg)
