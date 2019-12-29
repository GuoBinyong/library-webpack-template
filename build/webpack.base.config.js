const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const utils = require('./utils');


function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}


/**
 * 生成 Webpack 配置对象
 * @param  projecConfig : ProjecConfig    项目配置对象
 */
module.exports = function createWebpackConfig(projecConfig) {


  function assetsPath(_path) {
    return path.posix.join(projecConfig.staticOutDirectory, _path)
  }

  var libraryName = projecConfig.library;

  const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
      formatter: require('eslint-formatter-friendly'),
      emitWarning: !projecConfig.dev.showEslintErrorsInOverlay
    }
  });



  const wpConfig = {
    target: projecConfig.target,  //node  web 等等
    context: path.resolve(__dirname, '../'),
    entry: {
      [libraryName]: projecConfig.entry,
    },
    output: {
      filename: projecConfig.filename || '[name].js',
      library: libraryName,
      libraryTarget: projecConfig.libraryTarget,
      libraryExport: projecConfig.libraryExport,
    },
    externals: projecConfig.externals,
    resolve: {
      extensions: projecConfig.extensions,
      alias: projecConfig.alias,
    },
    module: {
      rules: [
        // ...(projecConfig.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: utils.createBabelPresets("js")
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.jsx$/,
          use: {
            loader: "babel-loader",
            options: {
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
            name: assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    plugins: [],
  }


  // 配置插件：开始

  let plugins = wpConfig.plugins || [];



  // 拷贝静态资源插件
  const staticDirectory = projecConfig.staticDirectory;
  if (staticDirectory) {
    // https://github.com/ampedandwired/html-webpack-plugin
    const copyPlugin = new CopyWebpackPlugin([
      {
        from: resolve(staticDirectory),
        to: projecConfig.staticOutDirectory,
        ignore: ['.*']
      }
    ]);

    plugins.push(htmlPlugin);
  }



  wpConfig.plugins = plugins;
  // 配置插件：结束


  return wpConfig;
}