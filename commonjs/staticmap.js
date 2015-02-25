exports.getTileCoords = function (lng, lat , zoom, width, height, tilesize, baseurl) {

	var width = width || 1024
		, height = height || 1024
		,	tilesize = tilesize || 256
		, tiles = []

	if (!lng || isNaN(lng) || !lat || isNaN(lat) || !zoom || isNaN(zoom) || isNaN(width) || isNaN(height) || isNaN(tilesize)) 
		return tiles

	// center map tile coords
	var x = lng2tile(lng,zoom)
		,	y = lat2tile(lat,zoom)

	//calculation of viewport dimensions
	var horizontal = Math.round((width/2-tilesize/2)/tilesize)
		,	vertical = Math.round((height/2-tilesize/2)/tilesize)

	// all map tiles
	for (var i = -horizontal; i <= horizontal; i++) {
		for (var k = -vertical; k <= vertical; k++) {
			tiles.push({
				x: x + k,
				y: y + i,
				zoom: zoom,
				url: baseurl + '/' + zoom + '_' + (x + k) + '_' + (y + i) + '/tile.png'
			})
		}
	}

	return tiles
}

exports.getStaticMap = function (lng, lat , zoom, width, height, tilesize, baseurl) {
	var width = width || 1024
		, height = height || 1024
		,	tilesize = tilesize || 256
		, tiles = [], html = []

	if (!lng || isNaN(lng) || !lat || isNaN(lat) || !zoom || isNaN(zoom) || isNaN(width) || isNaN(height) || isNaN(tilesize)) 
		return tiles

	// center map tile coords
	var x = lng2tile(lng,zoom)
		,	y = lat2tile(lat,zoom)

	//calculation of viewport dimensions
	var horizontal = Math.round((width/2-tilesize/2)/tilesize)
		,	vertical = Math.round((height/2-tilesize/2)/tilesize)

	// all map tiles
	for (var i = -horizontal; i <= horizontal; i++) {
		for (var k = -vertical; k <= vertical; k++) {
			tiles.push({
				x: x + k,
				y: y + i,
				zoom: zoom,
				url: baseurl + '/' + zoom + '_' + (x + k) + '_' + (y + i) + '/tile.png'
			})
		}
	}

	//container begin (crop frame)
	html.push('<div class="sm-container" style="width:' + width + 'px;height:' + height + 'px;overflow:hidden;position:relative;">')
	//map layer begin (tiles)
	var layerwidth = tilesize * (horizontal * 2 + 1)
		, layerheight = tilesize * (vertical * 2 + 1)
		, marginx = (layerwidth - width) / 2
		,	marginy = (layerheight - height) / 2
	html.push('<div class="sm-maplayer" style="width:' + layerwidth + ';margin-left:-' + marginx + 'px;margin-top:-' + marginy + 'px;position:absolute;">')

	for (var i = 0, tile; tile = tiles[i++];) {
		html.push('<img src="' + tile.url + '" style="float:left;" />')
	}

	//container and map layer end (crop frame)
	html.push('</div></div>')

	return html.join('')
}


function lng2tile(lon,zoom1) { 
	var tt = Number(lon);
	return (Math.floor((tt+180)/360*Math.pow(2,zoom1)));
}

function lat2tile(lat,zoom2)  { 
	return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom2))); 
}