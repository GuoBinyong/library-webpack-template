> 构建过程是复杂前端项目必不可少的环节；但 业务代码 与 公用代码（如：封装的库、组件、工具等被复用的代码）的构建需求是不一样的；我发现很多 npm 贡献者都没意识到这一点，他们用传统的业务项目的 webpack 配置 去打包 公用代码，虽然能运行，但实际潜藏着许多问题；甚至都不经过编译构建，直接发布单纯的源码到 npm 上；

**注意：**  
为了方便下文描述，我把 **业务代码** 构建出的最终产品称为 **应用程序**；把 **公用代码** 构建的出产品称为 **组件**；

# 业务代码与公用代码的构建特点

## 业务代码
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


## 公用代码
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



# 构建工具的选择
前端的构建工具有很多，像：Webpack、rollup、Browserify、Parcel、Grunt、Gulp等等；

目前，对于构建公共代码的工具较常用的是 rollup，对于构建业务代码，较常用的工具是 Webpack；不过，Webpack 也是可以用于构建公共代码的。

为了统一性，我选择了用 Webpack 构建 公共代码；所以，就有了本项目————Webapck针对Library的构建配置模板；


# 公共代码构建的配置目标
公共代码构建的配置目标其就是实现上文所述的公共代码的构建特点，总结如下：

- 去除依赖
- 一次构建可分别生成适用于不同环境的码包；  
    比如：分别生成用于 node 和 浏览器 环境的包，或者 不同模块化方案的包，如 AMD、CMD、 CommonJS、UMD等等；
- 能在 开发 和 生产 两种模式快速切换；  
    开发 模式下地在需要更多的调试信息，如 Source Map ；而生产模式下需求尽可能地压缩包的体积；在开发调试的过程中，需要在开发模式下构建包；当开发完毕，准备发布时，需要在生产模式下构建包；
- 分离 CSS 和 JavaScript 文件；


# 目录结构


# project-config.js
project-config.js 是整个项目的配置文件，是该模块暴露给使用者的配置文件；

该配置文件中的所有配置项都保存在 projecConfig 变量中，可配置的属性如下：

+ entry：webpack 的入口配置 entry；  指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图的开始
    - **类型：** string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
    - **详细信息：** <https://webpack.docschina.org/configuration/entry-context/#entry>  
    

+ target：webpack 的 target，用来告知 webpack   bundles 的运行环境。因为 服务器 和 浏览器 代码都可以用 JavaScript 编写，所以 webpack 提供了多种部署 target(目标)
    - **类型：** string | function (compiler)
    - **详细信息：** <https://webpack.docschina.org/configuration/target/#target>  


+ filename ：webpack 的 output.filename；此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下
    - **类型：** string | function
    - **默认值：** "[name].js"
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-filename> 



+ library ：库的名字；webpack 的 output.library；
    - **类型：** string 或 object（从 webpack 3.1.0 开始；用于 libraryTarget: 'umd'）
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-library> 
    - `utils.stringToCamelFormat(npmConfig.name)` 的作用是把 package.json 中的 name 字段的值 从 中划线 或 下划线 分隔的方式 转成 驼峰式


+ libraryTarget ：配置对外暴露 库 的方式，即：库将会以哪种方式被使用；webpack 的 output.libraryTarget；
    - **类型：** "var" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-librarytarget> 


+ libraryExport ：库中被导出的项；webpack 的 output.libraryExport ；
    - **类型：** string | string[]
    - **默认值：** "default"
    - **备注：** 如果设置成空字符串 "" ，则会导出包含所有导出的对象；
    - **详细信息：** <https://webpack.docschina.org/configuration/output/#output-libraryexport> 
  


  - alias：webpack 的 resolve.alias，创建 import 或 require 的别名，来使模块引入变得更简单
    - **类型：** object
    - **详细信息：** <https://webpack.docschina.org/configuration/resolve/#resolve-alias> 
  

- extensions ：webpack 的 resolve.extensions，自动解析确定的扩展名，能够使用户在引入模块时不用写文件的扩展名
    - **类型：** string[]
    - **详细信息：** <https://webpack.docschina.org/configuration/resolve/#resolve-extensions> 
  
- externals ：webpack 的 externals； 排除依赖的模块；防止将某些 import 的包(package)打包到 bundle 中；
    - **类型：** string | object | function | regex | array 
    - **详细信息：** <https://webpack.docschina.org/configuration/externals/#externals> 
  

- htmlTemplate ：html模板文件；html-webpack-plugin
  的 template 选项；
    - **类型：** string
    - **详细信息：** <https://github.com/ampedandwired/html-webpack-plugin>

- htmlOut ：要将 html模板文件 htmlTemplate 写入的文件。您也可以在此处指定子目录；该选项会结合 outputPath 选项 生成 html-webpack-plugin
 的 filename 选项 的值；
    - **类型：** string
    - **默认值：** "index.html"
    - **详细信息：** <https://github.com/ampedandwired/html-webpack-plugin>  
  
- staticDirectory：静态资源的原目录；该目录下的内容将会被拷贝到构建输出目录中；
    - **类型：** string

- staticOutDirectory：静态资源输出目录；设置将静态资源从原目录拷贝到构建输出目录中时，静态资源目录的名字；
    - **类型：** string


- tsTarget：指定TypeScript编译成 ECMAScript 的目标版本；用作 tsconfig 的 target 选项；
    - **类型：** "ES3" | "ES5" | "ES6"/"ES2015" | "ES2016" | "ES2017" | "ESNext"
    - **默认值：** "ES3"
    - **详细信息：** <https://www.tslang.cn/docs/handbook/compiler-options.html>  

- module：指定生成哪个模块系统代码；用作 tsconfig 的 module 选项；
    - **类型：** "None" | "CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015"
    - **默认值：** tsTarget === "ES6" ? "ES6" : "commonjs"
    - **详细信息：** <https://www.tslang.cn/docs/handbook/compiler-options.html>  


- declaration：指定是否生成相应的 .d.ts 文件。用作 tsconfig 的 declaration 选项
    - **类型：** boolean
    - **默认值：** false 
    - **详细信息：** <https://www.tslang.cn/docs/handbook/compiler-options.html> 


+ tsParseLoader：配置解析 TypeScript 的 loader
    - **类型：** "ts-loader" | "babel-loader" 
    - **默认值：** "ts-loader" 
    - **注意：** 目前发现：
      * "ts-loader" 会忽略TypeScript中默认的导出项 `export default`，这时配置项 ` libraryExport: "default" ` 可能会导到导出的值是 undefined
      * "babel-loader" 暂未支持生成 声明文件 .d.ts，并且会忽略 项目中关于 TypeScript 的自定配置，如：tsconfig.json、tsconfig.dev.js、tsconfig.prod.js 中的配置