var tv4    = require('../../../commonjs/tv4.min')
var data   = require('./data-place')
var schemata = require('./schemata')


//load schemata
for(name in schemata) {
	if(!schemata.hasOwnProperty(name)) continue
	tv4.addSchema(name, schemata[name])
}
	
//validate data against schema
var checkRecursive = false
var banUnknownProperties = true
var result = tv4.validateResult(data, tv4.getSchema('ThingsOnPhotos'), checkRecursive, banUnknownProperties)

console.log(result)