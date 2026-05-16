'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
    API_ROOT: '"//localhost:4000"'
    // API_ROOT: '"//114.116.245.61:4000"'
})
