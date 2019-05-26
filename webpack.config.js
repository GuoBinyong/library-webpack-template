var dev = require('./build/webpack.dev.config');
var prod = require('./build/webpack.prod.config');

module.exports = function(env,argv){
    return env && env.production ? prod : dev ;
}