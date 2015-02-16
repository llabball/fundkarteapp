L.Control.crossHairs = L.Control.extend({

    includes: L.Mixin.Events,

    options: {},

    initialize: function (placeholder, options) {
        L.setOptions(this, options);

        // Find content container
        var content = this._contentContainer = L.DomUtil.get(placeholder);

        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        var l = 'leaflet-';

        // Create container
        var container = this._container =
            L.DomUtil.create('div', l + 'crossHairs');

        // Style and attach content container
        L.DomUtil.addClass(content, l + 'control');
        container.appendChild(content);
    },

    addTo: function (map) {
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

        return this;
    },

    removeFrom: function (map) {
        //if the control is visible, hide it before removing it.
        this.hide();

        var content = this._contentContainer;

        // Remove horizontal container from controls container
        var controlContainer = map._controlContainer;
        controlContainer.removeChild(this._container);

        //disassociate the map object
        this._map = null;

        return this;
    },

    isVisible: function () {
        return L.DomUtil.hasClass(this._container, 'visible');
    },

    show: function () {
        if (!this.isVisible()) {
            L.DomUtil.addClass(this._container, 'visible');
            this.fire('show');
        }
    },

    hide: function (e) {
        if (this.isVisible()) {
            L.DomUtil.removeClass(this._container, 'visible');
            this.fire('hide');
        }
        if(e) {
            L.DomEvent.stopPropagation(e);
        }
    },

    getContainer: function () {
        return this._contentContainer;
    },

    setContent: function (content) {
        this.getContainer().innerHTML = content;
        return this;
    },

    getOffset: function () {
        if (this.options.position === 'bottom') {
            return -this._container.offsetBottom;
        } else {
            return this._container.offsetTop;
        }
    },

    _handleTransitionEvent: function (e) {
        if (e.propertyName == 'top' || e.propertyName == 'bottom')
            this.fire(this.isVisible() ? 'shown' : 'hidden');
    }
});

L.control.crossHairs = function (placeholder, options) {
    return new L.Control.crossHairs(placeholder, options);
};