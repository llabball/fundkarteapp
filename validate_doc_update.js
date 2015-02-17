function (newDoc, oldDoc, userCtx, secObj) {
  
  if(newDoc._deleted === true)
    return

  var tv4 = require('commonjs/tv4.min')
  var schemata = this.schemata
  if(!tv4 || !schemata) {
    throw({forbidden : 'Internal error: the initialization of the schema validaton has failed'});
  }

  try {
    //load schemata into tv4
    for(name in schemata) {
      if(!schemata.hasOwnProperty(name)) continue
      tv4.addSchema(name, schemata[name])
    }
  
    //validate data against schema
    var checkRecursive = false
    var banUnknownProperties = true
    var result = tv4.validateResult(newDoc, tv4.getSchema('ThingsOnPhotos'), checkRecursive, banUnknownProperties)
  } catch (ex) {
    throw({forbidden : 'Internal error: ' + ex})
  }

  if(result.valid !== true)
    throw({forbidden : JSON.stringify(result)})

}