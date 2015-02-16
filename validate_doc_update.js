function (newDoc, oldDoc, userCtx, secObj) {
  
  if(newDoc._deleted === true)
    return

  var tv4 = require('commonjs/tv4.min')
  var schema = require('schemata/ThingOnPhoto')
  if(!tv4 || !schema) {
    throw({forbidden : 'Internal error: the initialization of the schema validaton has failed'});
  }

  try {
    var checkRecursive = false
    var banUnknownProperties = true
    var result = tv4.validateResult(newDoc, schema, checkRecursive, banUnknownProperties)
  } catch (ex) {
    throw({forbidden : 'Internal error: ' + ex})
  }

  if(result.valid !== true)
    throw({forbidden : JSON.stringify(newDoc)})

}