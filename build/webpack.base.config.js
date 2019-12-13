var path = require('path');
const utils = require('./utils');

const config = require('../project-config');
var libraryName = config.library;


function resolve(dir) {
  return path.resolve(__dirname,'..', dir)
}


const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-formatter-friendly'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});



const wpConfig = {
  target: config.target,  //node  web 等等
  context:path.resolve(__dirname, '../'),
  entry: {
    [libraryName]: config.entry,
  },
  output: {
    filename: config.filename || '[name].js',
    library: libraryName,
    libraryTarget: config.libraryTarget,
    libraryExport: config.libraryExport,
  },
  externals: config.externals,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: config.alias,
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      // 用 babel-loader 解析 TypeScript
      /* {
        test: /\.ts$/,
        use: {
          loader:"babel-loader",
          options:{
            presets: utils.createBabelPresets("ts")
          }
        },
        exclude: /node_modules/
      }, */
      {
        test: /\.js$/,
        use: {
          loader:"babel-loader",
          options:{
            presets: utils.createBabelPresets("js")
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        use: {
          loader:"babel-loader",
          options:{
            presets: utils.createBabelPresets("jsx")
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:[],
}


// 配置插件：开始

let plugins = wpConfig.plugins || [];



// 拷贝静态资源插件
const staticDirectory =  config.staticDirectory;
if (staticDirectory){
  // https://github.com/ampedandwired/html-webpack-plugin
  const copyPlugin =  new CopyWebpackPlugin([
    {
      from: resolve(staticDirectory),
      to: config.staticOutDirectory,
      ignore: ['.*']
    }
  ]);

  plugins.push(htmlPlugin);
}



wpConfig.plugins = plugins;
// 配置插件：结束


module.exports = wpConfig;