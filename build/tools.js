'use strict'

/* 
包含与构建相关的工具函数的 JavaScript 代码文件
https://github.com/GuoBinyong/library-webpack-template
*/

const path = require('path')
const merge = require('webpack-merge');
const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      const miniCssLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it uses publicPath in webpackOptions.output
          // publicPath: '../',
          // hmr: process.env.NODE_ENV === 'development',
          hmr:false,
        },
      };

      loaders.unshift(miniCssLoader);

    } 


    return loaders;
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}






// babel预设：开始

// js 的 babel 的预设
const jsBabelPresets = [
  ["@babel/preset-env", {
    "useBuiltIns":"entry",
    "corejs":3
  }],
  "@babel/preset-flow"
];


  // jsx 的 babel 的预设
  const jsxBabelPresets = [
    "@babel/preset-react"
  ];


  // TypeScript 的 babel 的预设
const tsBabelPresets = [
  "@babel/preset-typescript"
];



/**
 * createBabelPresets(type,options)
 * @param  type ? : string   要创建的预设的类型
 * @param options ? : Object   要创建预设的参数
 * 
 * type 可表示的类型及有效值如下
 * jsx类型 : jsx、react
 * typescript类型 : ts、tsx、typescript
 * 其它类型 : 除上述之外的所有值
 */
function createBabelPresets(type,options){
  type = type.toLowerCase();
  // let babelPresets = jsBabelPresets.slice();
  let babelPresets = [];
  switch (type){
    case "jsx":
    case "react":{
      babelPresets = babelPresets.concat(jsxBabelPresets);
      break;
    }

    case "ts":
    case "tsx":
    case "typescript":{
      babelPresets = babelPresets.concat(tsBabelPresets);
      break;
    }

  }


  if (babelPresets.length>0 && options){
    babelPresets.push(options);
  }

  
  return jsBabelPresets.concat(babelPresets);
}

exports.createBabelPresets = createBabelPresets



// babel预设：结束


// TypeScript的Loader：开始

/* 
创建
*/

/**
 * 创建 TypeScript 的 Loader
 *
 * @param loader : "ts-loader" | "babel-loader"  默认值："ts-loader" ； 解析 TypeScript 的 loader
 * @param options : Object      配置 loader 的额外选项
 * @param tsConfig : Object     TypeScript 的配置选项，与 tsconfig.json 的配置相同
 * @returns Loader
 */
exports.createTsParseLoader = function createTsParseLoader(loader,options,tsConfig){

  var tsLoader = {
    test: /\.tsx?$/
  }; 

  Object.assign(tsLoader,options);

  switch (loader){
    
    // 用 babel-loader 解析 TypeScript
    case "babel-loader":{
      tsLoader.use = {
        loader:"babel-loader",
        options:{
          presets: createBabelPresets("ts")
        }
      };
      break;
    }

    // 用 ts-loader 解析 TypeScript
    default:{
      tsLoader.use = [
        {
          loader: "babel-loader",
          options: {
            presets: createBabelPresets("js")
          }
        },
        {
          loader: 'ts-loader',
          options: tsConfig
        }
      ];

    }
  }


  return tsLoader;
}



/**
 * 将一个 TypeScript的配置对象 和 一个 ts-loader 的配置对象 合并成 一个 ts-loader 的配置对象，并会对数组类型的配置项去重；
 * 
 * tsLoaderConfigMerge(tsconfg,tsloaderConfig)
 * @param tsconfg TypeScript的配置对象
 * @param tsloaderConfig ts-loader 的配置对象 
 * 
 * @returns  返回 ts-loader 的配置对象
 */
exports.tsLoaderConfigMerge = function tsLoaderConfigMerge(tsconfg,tsloaderConfig){
  return uniqMerge({compilerOptions:tsconfg.compilerOptions},tsloaderConfig);
};

// TypeScript的Loader：结束





// 配置处理工具：开始



/**
 * 将多个配置对象合并一个配置对象，并会对数组类型的配置项去重；
 * @returns  Configuration  返回合并后的配置对象
 * 
 * 
 * 接口1:
 * uniqMerge(...configuration)
 * 接收任意多个参数，每个参数都是一个配置对象；
 * 
 * 
 * 
 * 接口2:
 * uniqMerge(configurationArray: Configuration[])
 * 接收一个包含所有配置对象的数组
 * @param configurationArray : Configuration[]    配置对象的数组；
 */
const uniqMerge = merge({
  customizeArray:function(a, b, key) {
    return _.uniqWith([...a, ...b], _.isEqual);
  }
});

exports.uniqMerge = uniqMerge;



/**
 * projec-config 配置处理工具
 *
 * @param projectConfig : ProjecConfig   项目配置
 * @returns [ProjecConfig]    返回包含多个目标对应的项目配置的数组
 */
exports.projecConfigMultipleTargetsSeparation = function projecConfigMultipleTargetsSeparation(projectConfig){

  var multipleTargets = projectConfig.multipleTargets;
  var projectConfig = Object.assign({},projectConfig);
  delete projectConfig.multipleTargets;

  var multiProjConf = [projectConfig];

  if (multipleTargets && multipleTargets.length > 0){

    multiProjConf = multipleTargets.map(function(target){
      return uniqMerge(projectConfig,target);
    });

  }

  return multiProjConf;
}


// 配置处理工具：结束




/**
 * 将按指定分隔符分隔的字符串转换成驼峰格式
 *
 * @param  str : string    被转换的字符串
 * @param separators ?: string | Array<string>   可选；默认值：["-","_"]；  分隔符 或 分隔符好数组
 * @returns string  返回驼峰格式的字符串
 */
exports.stringToCamelFormat = function stringToCamelFormat(str,separators) {

  if (separators == undefined)  {
    separators = ["-","_"] ;
  }else if(!Array.isArray(separators)){
    separators = [separators];
  }

  var separatorRexStr = "(" + separators.join("|") + ")" + "+([A-Za-z]?)" ;
  var separatorRex = new RegExp(separatorRexStr,"g");

  var targetStr = str.replace(separatorRex,function (match,p1,p2) {
    return p2.toUpperCase() ;
  });

  return targetStr;
};

