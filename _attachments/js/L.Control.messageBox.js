L.Control.messageBox = L.Control.extend({

    includes: L.Mixin.Events,

    options: {},

    initialize: function (placeholder, options) {
      L.setOptions(this, options)

      // Find content container
      var content = this._contentContainer = L.DomUtil.get(placeholder)

      // Remove the content container from its original parent
      content.parentNode.removeChild(content)

      var l = 'leaflet-'

      // Create container
      var container = this._container =
        L.DomUtil.create('div', l + 'messageBox')

      // Style and attach content container
      L.DomUtil.addClass(content, l + 'control')
      container.appendChild(content)
    },

    addTo: function (map) {
      var container = this._container
      var content = this._contentContainer

      L.DomEvent
        .on(container, 'transitionend',
            this._handleTransitionEvent, this)
        .on(container, 'webkitTransitionEnd',
            this._handleTransitionEvent, this)

      // Attach horizontal container to controls container
      var controlContainer = map._controlContainer
      controlContainer.insertBefore(container, controlContainer.firstChild)

      this._map = map

      // Make sure we don't drag the map when we interact with the content
      var stop = L.DomEvent.stopPropagation
      L.DomEvent
        .on(content, 'click', stop)
        .on(content, 'mousedown', stop)
        .on(content, 'touchstart', stop)
        .on(content, 'dblclick', stop)
        .on(content, 'mousewheel', stop)
        .on(content, 'MozMousePixelScroll', stop)

      return this
    },

    removeFrom: function (map) {
      //if the control is visible, hide it before removing it.
      this.hide()

      var content = this._contentContainer

      // Remove horizontal container from controls container
      var controlContainer = map._controlContainer
      controlContainer.removeChild(this._container)

      //disassociate the map object
      this._map = null

      // Unregister events to prevent memory leak
      var stop = L.DomEvent.stopPropagation
      L.DomEvent
        .off(content, 'click', stop)
        .off(content, 'mousedown', stop)
        .off(content, 'touchstart', stop)
        .off(content, 'dblclick', stop)
        .off(content, 'mousewheel', stop)
        .off(content, 'MozMousePixelScroll', stop)

      L.DomEvent
        .off(container, 'transitionend',
          this._handleTransitionEvent, this)
        .off(container, 'webkitTransitionEnd',
          this._handleTransitionEvent, this)

      return this
    },

    isVisible: function () {
      return L.DomUtil.hasClass(this._container, 'visible')
    },

    show: function (opts) {
      if (this.isVisible()) return
        
      var widget      = this
        , container   = this._container
        , messagetext = L.DomUtil.get('messageBox-message')
        , declinebtn  = L.DomUtil.get('messageBox-decline')
        , confirmbtn  = L.DomUtil.get('messageBox-confirm')
        , close       = function () {widget.hide()}

      messagetext.innerHTML = opts.message || ''

      if (opts.decline) {
        L.DomUtil.removeClass(declinebtn, 'hidden')
        declinebtn.innerHTML = (opts.decline.label) ? opts.decline.label : 'cancel'
        declinebtn.onclick = (opts.decline.callback && typeof opts.decline.callback === 'function') ? opts.decline.callback : close
      } else {
        L.DomUtil.addClass(declinebtn, 'hidden')
      }

      var confirmbtn_label = (opts.confirm && opts.confirm.label) ? opts.confirm.label : 'ok'
        , confirmbtn_click = (opts.confirm && opts.confirm.callback && typeof opts.confirm.callback === 'function') ? opts.confirm.callback : close

      confirmbtn.innerHTML = confirmbtn_label
      confirmbtn.onclick   = confirmbtn_click
      L.DomUtil.addClass(container, 'visible')
      this.fire('show')
    },

    hide: function (e) {
      if (this.isVisible()) {
        L.DomUtil.removeClass(this._container, 'visible')
        this.fire('hide')
      }
      if(e) {
        L.DomEvent.stopPropagation(e)
      }
    },

    getContainer: function () {
      return this._contentContainer
    },

    setContent: function (content) {
      this.getContainer().innerHTML = content
      return this
    },

    getOffset: function () {
      return this._container.offsetTop
    },

    _handleTransitionEvent: function (e) {
      this.fire(this.isVisible() ? 'shown' : 'hidden')
    }
})

L.control.messageBox = function (placeholder, options) {
    return new L.Control.messageBox(placeholder, options)
}