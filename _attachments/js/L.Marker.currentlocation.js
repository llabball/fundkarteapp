/*global L*/

(function (window, document, undefined) {
    "use strict";

    L.CurrentlocationMarker = {};

    L.CurrentlocationMarker.version = '1.0.0';

    L.CurrentlocationMarker.Icon = L.Icon.extend({
        options: {
            iconSize: [35, 45],
            iconAnchor:   [17, 42],
            popupAnchor: [1, -32],
            shadowAnchor: [10, 12],
            shadowSize: [36, 16],
            className: 'awesome-marker',
            prefix: 'glyphicon',
            spinClass: 'fa-spin',
            extraClasses: '',
            icon: 'home',
            markerColor: 'blue',
            iconColor: 'white'
        },html

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options;

            if (options.icon) {
                div.innerHTML = this._createInner();
            }

            if (options.bgPos) {
                div.style.backgroundPosition =
                    (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }

            this._setIconStyles(div, 'icon-' + options.markerColor);
            return div;
        },


    });
        
    L.CurrentlocationMarker.icon = function (options) {
        return new L.CurrentlocationMarker.Icon(options);
    };

}(this, document));



