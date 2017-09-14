"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var leaflet_1 = require("leaflet");
var MultiOptionsPolyline = /** @class */ (function (_super) {
    __extends(MultiOptionsPolyline, _super);
    function MultiOptionsPolyline(latlngs, options) {
        var _this = _super.call(this) || this;
        _this._options = options;
        _this._originalLatlngs = latlngs;
        var copyBaseOptions = _this._options.multiOptions.copyBaseOptions;
        _this._layers = {};
        if (copyBaseOptions === undefined || copyBaseOptions) {
            _this._copyBaseOptions();
        }
        _this.setLatLngs(_this._originalLatlngs);
        return _this;
    }
    MultiOptionsPolyline.prototype._copyBaseOptions = function () {
        var multiOptions = this._options.multiOptions, baseOptions, optionsArray = multiOptions.options, i, len = optionsArray.length;
        baseOptions = leaflet_1.Util.extend({}, this._options);
        delete baseOptions.multiOptions;
        for (i = 0; i < len; ++i) {
            optionsArray[i] = leaflet_1.Util.extend(baseOptions, optionsArray[i]);
        }
    };
    MultiOptionsPolyline.prototype.setLatLngs = function (latlngs) {
        var i, len = latlngs.length, multiOptions = this._options.multiOptions, optionIdxFn = multiOptions.optionIdxFn, fnContext = multiOptions.fnContext || this, prevOptionIdx, optionIdx, segmentLatlngs;
        this.eachLayer(function (layer) {
            this.removeLayer(layer);
        }, this);
        for (i = 1; i < len; ++i) {
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
                    this.addLayer(new leaflet_1.Polyline(segmentLatlngs, multiOptions.options(prevOptionIdx)));
                }
                else {
                    this.addLayer(new leaflet_1.Polyline(segmentLatlngs, multiOptions.options[prevOptionIdx]));
                }
                prevOptionIdx = optionIdx;
                segmentLatlngs = [latlngs[i]];
            }
        }
        return this;
    };
    MultiOptionsPolyline.prototype.getLatLngs = function () {
        return this._originalLatlngs;
    };
    MultiOptionsPolyline.prototype.getLatLngsSegments = function () {
        var latlngs = [];
        this.eachLayer(function (layer) {
            if (layer instanceof leaflet_1.Polyline) {
                latlngs.push(layer.getLatLngs());
            }
        });
        return latlngs;
    };
    return MultiOptionsPolyline;
}(leaflet_1.FeatureGroup));
function multiOptionsPolyline(latlngs, options) {
    return new MultiOptionsPolyline(latlngs, options);
}
exports.multiOptionsPolyline = multiOptionsPolyline;
