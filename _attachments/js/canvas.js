var Canvas = (function() {
  var canvas, canvasCtx, canvasOffset, canvasWidth, canvasHeight, canvasRatio, offsetX, offsetY, ratioDiff
    , maxMegaPix, maxScaleFactor
    , img, imgHeight, imgWidth, imgRatio, imgScale, canvasImageHeight, canvasImageWidth
    , isDragging, dragStartX, dragStartY, centerX, centerY, moveX, moveY, degree, pinch
    , Lat, Lng, DateTime

  function init(canvasId) {
    canvas = document.getElementById(canvasId)
    var clientWidth = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"])
    var clientHeight = Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"])
    if (clientWidth > 640 || clientHeight > 960) {
        canvas.height = (clientHeight > 960) ? 960 : clientHeight
        canvas.width = clientHeight / 1.33333333333333333333333
    } else {
        canvas.width = clientWidth // ratio-aware import
    if (degree / 90 % 2 === 0) {
      if (imgWidth > imgHeight) {
        canvasImageWidth = canvasHeight * imgRatio
        canvasImageHeight = canvasHeight
      } else {
        if (imgRatio > canvasRatio) {
          canvasImageWidth = canvasWidth
          canvasImageHeight = canvasWidth * imgRatio
        } else {
          canvasImageWidth = canvasWidth * imgRatio
          canvasImageHeight = canvasHeight
        }
      }
    } else {
      if (imgWidth > imgHeight) {
        canvasImageWidth = canvasHeight * imgRatio
        canvasImageHeight = canvasHeight
      } else {
        canvasImageWidth = canvasHeight
        canvasImageHeight = canvasHeight * imgRatio
      }
    }

    centerX = (canvasWidth - canvasImageWidth * imgScale) / 2
    centerY = (canvasHeight - canvasImageHeight * imgScale) / 2

    if (degree / 90 % 2 === 0) {
      // 0 deg and 180 deg 
      if (moveX + centerX > 0) moveX = -centerX //left
      if (moveX - centerX < 0) moveX = centerX //right
      if (moveY + centerY > 0) moveY = -centerY //top
      if (moveY - centerY < 0) moveY = centerY //bottom
    } else {
      // 90 deg and 270 deg
      if (moveX - centerY < 0) moveX = centerY //left (former bottom)
      if (moveX + centerY > 0) moveX = -centerY //right (former top)
      if (moveY + centerX + ratioDiff > 0) moveY = -centerX - ratioDiff //top (former left)
      if (moveY - centerX - ratioDiff < 0) moveY = centerX + ratioDiff //bottom (former right)
    }

    if (degree === 0)
      canvasCtx.drawImage(img, centerX + moveX, centerY + moveY, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 90)
      canvasCtx.drawImage(img, centerX + moveY, centerY - moveX, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 180)
      canvasCtx.drawImage(img, centerX - moveX, centerY - moveY, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 270)
      canvasCtx.drawImage(img, centerX - moveY, centerY + moveX, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
        canvas.height = clientHeight
    }
    canvasCtx = canvas.getContext('2d')
    canvasWidth = canvas.style.width || canvas.width
    canvasHeight = canvas.style.height || canvas.height
    canvasRatio = (canvas.height > canvasWidth) ? canvas.height / canvasWidth : canvasWidth / canvas.height
    offsetX = canvas.offsetLeft
    offsetY = canvas.offsetTop
    ratioDiff = (canvasHeight - canvasWidth) / 2
    maxMegaPix = 3 * 1024 * 1024
    maxScaleFactor = 2

    resetVars()
  }

  function resetVars() {
    isDragging = false
    degree = 0
    pinch = undefined
    moveX = 0
    moveY = 0
    imgHeight = undefined
    imgWidth = undefined
    imgRatio = undefined
    imgScale = 1
    canvasImageHeight = undefined
    canvasImageWidth = undefined
    dragStartX = undefined
    dragStartY = undefined
    centerX = undefined
    centerY = undefined
    Lat = undefined
    Lng = undefined
    DateTime = undefined
  }

  function loadImage(imgsrc) {
    if (imgsrc instanceof File) {
      shrinkImage(imgsrc)
      return
    }

    var urlpattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!imgsrc || typeof imgsrc !== 'string' || !urlpattern.test(imgsrc)) return

    img = new Image()

    img.onload = function() {
      if (img.naturalHeight > canvasHeight && img.naturalWidth > canvasWidth) {        
        if (imgWidth * imgHeight > maxMegaPix) {
          shrinkImage(img)
        } else {
          resetVars()
          imgWidth = img.naturalWidth
          imgHeight = img.naturalHeight
          imgRatio = (imgHeight > imgWidth) ? imgHeight / imgWidth : imgWidth / imgHeight
          drawImage()
        }
      }
    }

    img.src = imgsrc
  }

  function saveImage() {
    // var tmpCanvas = document.createElement('canvas')
    // tmpCanvas.width = 640
    // tmpCanvas.height = 960
    // var tmpCtx = tmpCanvas.getContext('2d')
    // //rotate
    // if(degree > 0) {
    //   tmpCtx.translate(tmpCanvas.width / 2, tmpCanvas.height / 2)
    //   tmpCtx.rotate(degree * Math.PI / 180)
    //   tmpCtx.translate(-tmpCanvas.width / 2, -tmpCanvas.height / 2)
    // }
    // // ratio-aware import
    // var tmpCanvasImageWidth, tmpCanvasImageHeight
    // if (degree / 90 % 2 === 0) {
    //   if (imgWidth > imgHeight) {
    //     tmpCanvasImageWidth = tmpCanvas.height * imgRatio
    //     tmpCanvasImageHeight = tmpCanvas.height
    //   } else {
    //     if (imgRatio > canvasRatio) {
    //       tmpCanvasImageWidth = tmpCanvas.width
    //       tmpCanvasImageHeight = tmpCanvas.width * imgRatio
    //     } else {
    //       tmpCanvasImageWidth = tmpCanvas.width * imgRatio
    //       tmpCanvasImageHeight = tmpCanvas.height
    //     }
    //   }
    // } else {
    //   if (imgWidth > imgHeight) {
    //     tmpCanvasImageWidth = tmpCanvas.height * imgRatio
    //     tmpCanvasImageHeight = tmpCanvas.height
    //   } else {
    //     tmpCanvasImageWidth = tmpCanvas.height
    //     tmpCanvasImageHeight = tmpCanvas.height * imgRatio
    //   }
    // }

    // var tmpCenterX = (tmpCanvas.width - tmpCanvasImageWidth * imgScale) / 2
    //   , tmpCenterY = (tmpCanvas.height - tmpCanvasImageHeight * imgScale) / 2
    //   , canvasRatioDiff = tmpCanvas.height / tmpCanvas.width - canvasRatio
    //   , tmpRatioDiff = (tmpCanvas.height - tmpCanvas.width) / 2

    // if (degree / 90 % 2 === 0) {
    //   var tmpMoveX = moveX
    //     , tmpMoveY = moveY
    //   // 0 deg and 180 deg 
    //   if (tmpMoveX * canvasRatioDiff + tmpCenterX > 0) tmpMoveX  = -tmpCenterX //left
    //   if (tmpMoveX * canvasRatioDiff - tmpCenterX < 0) tmpMoveX = tmpCenterX //right
    //   if (tmpMoveY * canvasRatioDiff + tmpCenterY > 0) tmpMoveY = -tmpCenterY //top
    //   if (tmpMoveY * canvasRatioDiff - tmpCenterY < 0) tmpMoveY = tmpCenterY //bottom
    // } else {
    //   // 90 deg and 270 deg
    //   if (tmpMoveX * canvasRatioDiff - tmpCenterY < 0) tmpMoveX = tmpCenterY //left (former bottom)
    //   if (tmpMoveX * canvasRatioDiff + tmpCenterY > 0) tmpMoveX = -tmpCenterY //right (former top)
    //   if (tmpMoveY * canvasRatioDiff + tmpCenterX + tmpRatioDiff > 0) tmpMoveY = -tmpCenterX - tmpRatioDiff //top (former left)
    //   if (tmpMoveY * canvasRatioDiff - tmpCenterX - tmpRatioDiff < 0) tmpMoveY = tmpCenterX + tmpRatioDiff //bottom (former right)
    // }

    // if (degree === 0)
    //   tmpCtx.drawImage(img, tmpCenterX + tmpMoveX, tmpCenterY + tmpMoveY, tmpCanvasImageWidth * imgScale, tmpCanvasImageHeight * imgScale)
    // if (degree === 90)
    //   tmpCtx.drawImage(img, tmpCenterX + tmpMoveY, tmpCenterY - tmpMoveX, tmpCanvasImageWidth * imgScale, tmpCanvasImageHeight * imgScale)
    // if (degree === 180)
    //   tmpCtx.drawImage(img, tmpCenterX - tmpMoveX, tmpCenterY - tmpMoveY, tmpCanvasImageWidth * imgScale, tmpCanvasImageHeight * imgScale)
    // if (degree === 270)
    //   tmpCtx.drawImage(img, tmpCenterX - tmpMoveY, tmpCenterY + tmpMoveX, tmpCanvasImageWidth * imgScale, tmpCanvasImageHeight * imgScale)
      
    
    var imgjson = {
      width: canvasWidth,
      height: canvasHeight,
      created_at: DateTime,
      data: canvas.toDataURL('image/jpeg')
    }
    if (Lat && Lng)
      imgjson.geo = {
        type: 'Point',
        coords: {
          latitude: Lat,
          longitude: Lng
        }
      }
    if (DateTime && DateTime !== 'invalid Date')
      imgjson.created_at = DateTime
    
    // tmpCanvas = tmpCtx = null
    return imgjson
  }

  function shrinkImage(file) {
    EXIF.getData(file, function() {
      //read geo data
      var aLat = EXIF.getTag(this, 'GPSLatitude')
        , aLng = EXIF.getTag(this, 'GPSLongitude')

      if (aLat && aLng) {
        var latref = EXIF.getTag(this, 'GPSLatitudeRef') || 'N'
        var lngref = EXIF.getTag(this, 'GPSLongitudeRef') || 'W'
        Lat = (aLat[0] + aLat[1] / 60 + aLat[2] / 3600) * (latref === 'N' ? 1 : -1)
        Lng = (aLng[0] + aLng[1] / 60 + aLng[2] / 3600) * (lngref === 'W' ? -1 : 1)
      }

      //render image data into hidden canvas to downsize the image size to 1024x1024
      //that solves the iOS bug of too large images in the drawImage() function
      var imgData = new MegaPixImage(file)

      //read DateTime
      DateTime = imgData.blob.lastModifiedDate

      img = new Image();
      img.onload = function() {
        imgWidth = img.width
        imgHeight = img.height
        imgRatio = (imgHeight > imgWidth) ? imgHeight / imgWidth : imgWidth / imgHeight
        rotateImage(0)
      }
      //https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html#//apple_ref/doc/uid/TP40006482-SW15
      //"ensure that width * height ≤ 3 * 1024 * 1024 for devices with less than 256 MB RAM"
      var confRatio = 1 / 1.5 // portrait y/x = 1.5
        , maxHeight = imgData.srcImage.naturalHeight
        , maxWidth = imgData.srcImage.naturalWidth

      if (!maxWidth || !maxHeight || maxWidth * maxHeight > maxMegaPix) {
        maxHeight = Math.round(Math.sqrt(maxMegaPix / confRatio))
        maxWidth = maxHeight * confRatio
      }

      imgData.render(img, {
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        orientation: EXIF.getTag(this, 'Orientation') || 0
      })
    })
  }

  function drawImage() {
    // ratio-aware import
    if (degree / 90 % 2 === 0) {
      if (imgWidth > imgHeight) {
        canvasImageWidth = canvasHeight * imgRatio
        canvasImageHeight = canvasHeight
      } else {
        if (imgRatio > canvasRatio) {
          canvasImageWidth = canvasWidth
          canvasImageHeight = canvasWidth * imgRatio
        } else {
          canvasImageWidth = canvasWidth * imgRatio
          canvasImageHeight = canvasHeight
        }
      }
    } else {
      if (imgWidth > imgHeight) {
        canvasImageWidth = canvasHeight * imgRatio
        canvasImageHeight = canvasHeight
      } else {
        canvasImageWidth = canvasHeight
        canvasImageHeight = canvasHeight * imgRatio
      }
    }

    centerX = (canvasWidth - canvasImageWidth * imgScale) / 2
    centerY = (canvasHeight - canvasImageHeight * imgScale) / 2

    if (degree / 90 % 2 === 0) {
      // 0 deg and 180 deg 
      if (moveX + centerX > 0) moveX = -centerX //left
      if (moveX - centerX < 0) moveX = centerX //right
      if (moveY + centerY > 0) moveY = -centerY //top
      if (moveY - centerY < 0) moveY = centerY //bottom
    } else {
      // 90 deg and 270 deg
      if (moveX - centerY < 0) moveX = centerY //left (former bottom)
      if (moveX + centerY > 0) moveX = -centerY //right (former top)
      if (moveY + centerX + ratioDiff > 0) moveY = -centerX - ratioDiff //top (former left)
      if (moveY - centerX - ratioDiff < 0) moveY = centerX + ratioDiff //bottom (former right)
    }

    if (degree === 0)
      canvasCtx.drawImage(img, centerX + moveX, centerY + moveY, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 90)
      canvasCtx.drawImage(img, centerX + moveY, centerY - moveX, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 180)
      canvasCtx.drawImage(img, centerX - moveX, centerY - moveY, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
    if (degree === 270)
      canvasCtx.drawImage(img, centerX - moveY, centerY + moveX, canvasImageWidth * imgScale, canvasImageHeight * imgScale)
  }

  function scaleImage(factor) {
    var scaleby = (imgScale + factor <= maxScaleFactor) ? factor : maxScaleFactor - imgScale
     ,  scaleby = (imgScale + scaleby >= 1) ? scaleby : 1 - imgScale

    if (scaleby !== 0) {
      moveX    = moveX / imgScale
      moveY    = moveY / imgScale
      centerX  = centerX / imgScale
      centerY  = centerY / imgScale
      imgScale = Math.round((imgScale + scaleby) * 100) / 100
      moveX    = moveX * imgScale
      moveY    = moveY * imgScale
      centerX  = centerX * imgScale
      centerY  = centerY * imgScale
      
      drawImage()
    }
  }

  function rotateImage(deg) {
    if (deg === undefined || deg * 90 % 1 !== 0) return
    deg = (deg + degree < 360) ? deg + degree : 0
    var rotateby = (deg > degree) ? deg - degree : 360 - degree + deg
    degree = deg

    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)

    if (rotateby > 0) {
      canvasCtx.translate(canvasWidth / 2, canvasHeight / 2)
      canvasCtx.rotate(rotateby * Math.PI / 180)
      canvasCtx.translate(-canvasWidth / 2, -canvasHeight / 2)
    }

    imgScale = 1
    moveX = 0
    moveY = 0

    drawImage()
  }

  function handleDrag(e) {
    moveX = moveX || 0
    moveY = moveY || 0
    dragStartX = (e.clientX || e.originalEvent.touches[0].clientX) - offsetX - moveX
    dragStartY = (e.clientY || e.originalEvent.touches[0].clientY) - offsetY - moveY
    isDragging = true
  }

  function handleDrop(e) {
    isDragging = false;
  }

  function handleMove(e) {
    if(e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length >= 2 ) {
        var zoom = false
          , p1 = e.originalEvent.touches[0]
          , p2 = e.originalEvent.touches[1]
          , zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2))
        
        if(pinch) zoom = zoomScale - pinch
        
        pinch = zoomScale
        
        if (zoom) scaleImage(zoom > 0 ? 0.03 : -0.03)
        
        return
    }
      
    var clientX = e.clientX || e.originalEvent.touches[0].clientX
      , clientY = e.clientY || e.originalEvent.touches[0].clientY

    canMouseX = parseInt(clientX - offsetX)
    canMouseY = parseInt(clientY - offsetY)

    // if the drag flag is set, clear the canvas and draw the image
    if (isDragging) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      moveX = canMouseX - dragStartX
      moveY = canMouseY - dragStartY

      drawImage()
    }
  }

  return {
           init: init,
      loadImage: loadImage,
      saveImage: saveImage,
     scaleImage: scaleImage,
    rotateImage: rotateImage,
     handleDrag: handleDrag,
     handleMove: handleMove,
     handleDrop: handleDrop
  }
})()