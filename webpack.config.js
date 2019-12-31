/* 
webpack 命令默认的配置文件；这个配置文件存在的目的是为了方便能在项目根目录下直接使用 `webpack` 命令 进行构建；它会根据执行 webpack 命令时是否携带含有设置 production 环境变量的选项来决定是加载 生产模式 还是 开发模式 的 构建配置；
https://github.com/GuoBinyong/library-webpack-template
*/
module.exports = function(env,argv){
    return env && env.production ? require('./build/webpack.prod.config') : require('./build/webpack.dev.config') ;
}