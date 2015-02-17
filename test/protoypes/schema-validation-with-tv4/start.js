var tv4    = require('../../../commonjs/tv4.min')
var data   = require('./data-place')
var schema = require('./schema')


var checkRecursive = false
var banUnknownProperties = true
var result = tv4.validateResult(data, schema, checkRecursive, banUnknownProperties)

console.log(result)