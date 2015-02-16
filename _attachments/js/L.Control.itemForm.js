L.Control.itemForm = L.Control.extend({

  includes: L.Mixin.Events,

  options: {},

  initialize: function(placeholder, options) {
    L.setOptions(this, options);

    // Find content container
    var content = this._contentContainer = L.DomUtil.get(placeholder);

    // Remove the content container from its original parent
    content.parentNode.removeChild(content);

    var l = 'leaflet-';

    // Create horizontal container
    var container = this._container =
      L.DomUtil.create('div', l + 'itemForm');

    // Style and attach content container
    L.DomUtil.addClass(content, l + 'control');
    container.appendChild(content);
  },

  addTo: function(map) {
    var container = this._container;
    var content = this._contentContainer;

    L.DomEvent
      .on(container, 'transitionend',
        this._handleTransitionEvent, this)
      .on(container, 'webkitTransitionEnd',
        this._handleTransitionEvent, this);

    // Attach horizontal container to controls container
    var controlContainer = map._controlContainer;
    controlContainer.insertBefore(container, controlContainer.firstChild);

    this._map = map;

    // Make sure we don't drag the map when we interact with the content
    var stop = L.DomEvent.stopPropagation;
    L.DomEvent
      .on(content, 'click', stop)
      .on(content, 'mousedown', stop)
      .on(content, 'touchstart', stop)
      .on(content, 'dblclick', stop)
      .on(content, 'mousewheel', stop)
      .on(content, 'MozMousePixelScroll', stop);

    return this;
  },

  removeFrom: function(map) {
    //if the control is visible, hide it before removing it.
    this.hide();

    var content = this._contentContainer;

    // Remove horizontal container from controls container
    var controlContainer = map._controlContainer;
    controlContainer.removeChild(this._container);

    //disassociate the map object
    this._map = null;

    // Unregister events to prevent memory leak
    var stop = L.DomEvent.stopPropagation;
    L.DomEvent
      .off(content, 'click', stop)
      .off(content, 'mousedown', stop)
      .off(content, 'touchstart', stop)
      .off(content, 'dblclick', stop)
      .off(content, 'mousewheel', stop)
      .off(content, 'MozMousePixelScroll', stop);

    L.DomEvent
      .off(container, 'transitionend',
        this._handleTransitionEvent, this)
      .off(container, 'webkitTransitionEnd',
        this._handleTransitionEvent, this);

    return this;
  },

  isVisible: function() {
    return L.DomUtil.hasClass(this._container, 'visible');
  },

  show: function() {
    if (!this.isVisible()) {
      L.DomUtil.addClass(this._container, 'visible');
      this.fire('show');
    }
  },

  hide: function(e) {
    if (this.isVisible()) {
      L.DomUtil.removeClass(this._container, 'visible');
      this.fire('hide');
    }
    if (e) {
      L.DomEvent.stopPropagation(e);
    }
  },

  toggle: function() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  },

  getContainer: function() {
    return this._contentContainer;
  },

  setContent: function(content) {
    this.getContainer().innerHTML = content;
    return this;
  },

  setDatetime: function (date) {
    if (!date || !(date instanceof Date) || date.toString() === 'Invalid Date') return

    document.getElementById('form-datetime').setAttribute('value', date.toISOString())
    document.getElementById('form-date').innerHTML = date.toLocaleDateString()
    document.getElementById('form-time').innerHTML = date.toLocaleTimeString().substring(0,5)
  },

  getDatetime: function () {
    return document.getElementById('form-datetime').getAttribute('value')
  },

  _handleTransitionEvent: function(e) {
    if (e.propertyName == 'top' || e.propertyName == 'bottom')
      this.fire(this.isVisible() ? 'shown' : 'hidden');
  }
});

L.control.itemForm = function(placeholder, options) {
  return new L.Control.itemForm(placeholder, options);
};