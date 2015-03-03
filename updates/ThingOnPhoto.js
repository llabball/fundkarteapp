function (doc, req) {
	var resp = {}
		, newDoc

	try { 
		newDoc = JSON.parse(req.body) 
	} catch (e) { 
		resp.code = 400
		resp.body = {error: 'missing_json_payload', reason: 'Could not parse payload to JSON: ' + e.message}
	}

	if(newDoc) {

		newDoc._id = (doc) ? doc._id : req.uuid

		if (!doc) {
			var now = new Date(),
	        tzo = -now.getTimezoneOffset(),
	        dif = tzo >= 0 ? '+' : '-',
	        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
	        };
			newDoc.created_at = now.toISOString().replace(/\.[\d]{3}Z$/,dif + pad(tzo / 60) + ':' + pad(tzo % 60))
		}

		newDoc._attachments = newDoc._attachments || {}
		var template = this.templates.html.static_app_skeleton

		var mustache = require('commonjs/mustache.min')
		var map = require('commonjs/staticmap')
		var html = mustache.render(template, {
			'_id': newDoc._id,
			'title': newDoc.title,
			'desc': newDoc.desc,
			'datetime': newDoc.created_at,
			'address': newDoc.adr['street-address'] + ', ' + newDoc.adr['postal-code'] + ' ' + newDoc.adr.locality,
			'latlng': newDoc.geo.latitude + ',' + newDoc.geo.longitude,
			'css': this.templates.css.static_app_skeleton,
			'map': map.getStaticMap(13.425508,52.5280897,15, 640, 960, 256, 'http://178.77.76.245/fundkarte_maptiles')

		})

		var couch64 = require('commonjs/couch64')
		var UTF8html = couch64.strToUTF8Arr(html)
		var html64 = couch64.base64EncArr(UTF8html)
		newDoc._attachments['index.html'] = {
			'content_type': 'text/html',
			'data': html64
		}

		resp.code = (doc) ? 202 : 201
		resp.body = {stat: 'ok', message: '/f/' + newDoc._id}
	}
	
	resp.body = JSON.stringify(resp.body)

	return [newDoc, resp]
}