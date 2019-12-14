'use strict'
const path = require('path')
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


  // jsx 的 babel 的预设
const tsBabelPresets = jsBabelPresets.concat([
  "@babel/preset-typescript"
]);



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
exports.createBabelPresets = function createBabelPresets(type,options){
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



// babel预设：结束





// projec-config 配置处理工具：开始


/**
 * projec-config 配置处理工具
 *
 * @param projecConfig : ProjecConfig   项目配置
 * @returns [ProjecConfig]    返回包含多个目标对应的项目配置的数组
 */
exports.projecConfigMultipleTargetsSeparation = function projecConfigMultipleTargetsSeparation(projecConfig){

  var multipleTargets = projecConfig.multipleTargets;
  var projecConfig = Object.assign({},projecConfig);
  delete projecConfig.multipleTargets;

  var multiProjConf = [projecConfig];

  if (multipleTargets && multipleTargets.length > 0){

    multiProjConf = multipleTargets.map(function(target){

      var targetProjConf = Object.assign({},projecConfig,target);
      targetProjConf.dev = Object.assign({},projecConfig.dev,target.dev);
      targetProjConf.build = Object.assign({},projecConfig.build,target.build);

      return targetProjConf
    });

  }

  return multiProjConf;
}


// projec-config 配置处理工具：结束