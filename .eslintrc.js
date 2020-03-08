/* 
ESLint 的配置文件
http://eslint.cn/docs/user-guide/configuring
*/

module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        // 允许 debugger 运行在 开发 环境中 
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        //提示 没用的变量；默认是 报错 "error"
        "no-unused-vars":"warn",
    }
};