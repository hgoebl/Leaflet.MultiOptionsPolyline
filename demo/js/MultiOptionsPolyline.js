var MultiOptionsPolyline = (function (leaflet) {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var MultiOptionsPolyline = /** @class */ (function (_super) {
    __extends(MultiOptionsPolyline, _super);
    function MultiOptionsPolyline(latlngs, options) {
        var _this = _super.call(this) || this;
        _this._options = options;
        _this._originalLatlngs = latlngs;
        var copyBaseOptions = _this._options.multiOptions.copyBaseOptions;
        _this._layers = {};
        if (copyBaseOptions) {
            _this.copyBaseOptions();
        }
        _this.setLatLngs(_this._originalLatlngs);
        return _this;
    }
    MultiOptionsPolyline.prototype.copyBaseOptions = function () {
        var multiOptions = this._options.multiOptions, optionsArray = multiOptions.options;
        var len = optionsArray.length;
        var baseOptions = leaflet.Util.extend({}, this._options);
        delete baseOptions.multiOptions;
        for (var i = 0; i < len; ++i) {
            optionsArray[i] = leaflet.Util.extend(baseOptions, multiOptions.options[i]);
        }
    };
    MultiOptionsPolyline.prototype.setLatLngs = function (latlngs) {
        var _this = this;
        var multiOptions = this._options.multiOptions, optionIdxFn = multiOptions.optionIdxFn, fnContext = multiOptions.fnContext || this, prevOptionIdx, optionIdx, segmentLatlngs;
        this.eachLayer(function (layer) {
            _this.removeLayer(layer);
        }, this);
        var len = latlngs.length;
        for (var i = 1; i < len; ++i) {
            optionIdx = optionIdxFn.call(fnContext, latlngs[i], latlngs[i - 1], i, latlngs);
            if (i === 1) {
                segmentLatlngs = [latlngs[0]];
                prevOptionIdx = optionIdxFn.call(fnContext, latlngs[0], latlngs[0], 0, latlngs);
            }
            segmentLatlngs.push(latlngs[i]);
            // is there a change in options or is it the last point?
            if (prevOptionIdx !== optionIdx || i === len - 1) {
                // Check if options is a function or an array
                if (typeof multiOptions.options === "function") {
                    this.addLayer(new leaflet.Polyline(segmentLatlngs, multiOptions.options(prevOptionIdx)));
                }
                else {
                    this.addLayer(new leaflet.Polyline(segmentLatlngs, multiOptions.options[prevOptionIdx]));
                }
                prevOptionIdx = optionIdx;
                segmentLatlngs = [latlngs[i]];
            }
        }
    };
    MultiOptionsPolyline.prototype.getLatLngs = function () {
        return this._originalLatlngs;
    };
    MultiOptionsPolyline.prototype.getLatLngsSegments = function () {
        var latlngs = [];
        this.eachLayer(function (layer) {
            if (layer instanceof leaflet.Polyline) {
                latlngs.push(layer.getLatLngs());
            }
        });
        return latlngs;
    };
    return MultiOptionsPolyline;
}(leaflet.FeatureGroup));

return MultiOptionsPolyline;

}(L));
