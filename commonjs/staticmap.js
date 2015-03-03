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
		, xs = []
		, ys = []

	//calculation of viewport dimensions
	var horizontal = Math.ceil((width/2-tilesize/2)/tilesize)
		,	vertical = Math.ceil((height/2-tilesize/2)/tilesize)

	if (horizontal === 0) {
		xs.push(x)
	} else {
		for (var i = -horizontal; i <= horizontal; i++)
			xs.push(x+i)
	}

	if (vertical === 0) {
		ys.push(y)
	} else {
		for (var k = -vertical; k <= vertical; k++)
			ys.push(y + k)
	}

	// all map tiles
	for (var m = 0, ytile; ytile = ys[m++];) {
		for (var n = 0, xtile; xtile = xs[n++];) {
			tiles.push({
				x: xtile,
				y: ytile,
				zoom: zoom,
				url: baseurl + '/' + zoom + '_' + xtile + '_' + ytile + '/tile.png'
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
	html.push('<div class="sm-maplayer" style="width:' + layerwidth + 'px;margin-left:-' + marginx + 'px;margin-top:-' + marginy + 'px;position:absolute;">')

	var pixeltransparent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII='
	for (var i = 0, tile; tile = tiles[i++];) {
		html.push('<img src="' + pixeltransparent + '" onload="javascript:this.setAttribute(\'src\', this.getAttribute(\'data-src\'))" data-src="' + tile.url + '" style="float:left;width:' + tilesize + 'px;height:' + tilesize + 'px;" />')
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