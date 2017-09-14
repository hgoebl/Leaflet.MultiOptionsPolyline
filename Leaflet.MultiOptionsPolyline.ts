import { Polyline, FeatureGroup, Util, LatLng, PolylineOptions, MarkerOptions } from 'leaflet';

type PolylineOptionsFn = (optionIdx: number) => PolylineOptions;

interface MultiOptions {
    optionIdxFn: (latLng: LatLng, prevLatLng: LatLng, index: number, allLatlngs: Array<LatLng>) => number;
    // options for the index returned by optionIdxFn. If supplied with a function then it will be called with the index
    options: PolylineOptions[] | PolylineOptionsFn;
    // the context to call optionIdxFn (optional)
    fnContext?: any;
    copyBaseOptions?: boolean;
}

export interface MultiOptionsPolylineOptions extends MarkerOptions {
    multiOptions: MultiOptions;
}

class MultiOptionsPolyline extends FeatureGroup {
    _layers: object;
    _options: any;
    _originalLatlngs: Array<LatLng>;
    _inLatLngs: Array<LatLng>;
    constructor(latlngs: Array<LatLng>, options: MultiOptionsPolylineOptions){
        super();      
        this._options = options;
        this._originalLatlngs = latlngs;
        
        let copyBaseOptions = this._options.multiOptions.copyBaseOptions;
        
        this._layers = {};
        if (copyBaseOptions === undefined || copyBaseOptions) {
            this._copyBaseOptions();
        }

        this.setLatLngs(this._originalLatlngs);
    }
    _copyBaseOptions () {
        let multiOptions = this._options.multiOptions,
            baseOptions,
            optionsArray = multiOptions.options,
            i, len = optionsArray.length;

        baseOptions = Util.extend({}, this._options);
        delete baseOptions.multiOptions;

        for (i = 0; i < len; ++i) {
            optionsArray[i] = Util.extend(baseOptions, optionsArray[i]);
        }
    }

    setLatLngs (latlngs) {
        let i, len = latlngs.length,
            multiOptions = this._options.multiOptions,
            optionIdxFn = multiOptions.optionIdxFn,
            fnContext = multiOptions.fnContext || this,
            prevOptionIdx, optionIdx,
            segmentLatlngs;

        this.eachLayer(function (layer) {
            this.removeLayer(layer);
        }, this);

        for (i = 1; i < len; ++i) {
            optionIdx = optionIdxFn.call(
                fnContext, latlngs[i], latlngs[i - 1], i, latlngs);

            if (i === 1) {
                segmentLatlngs = [latlngs[0]];
                prevOptionIdx = optionIdxFn.call(fnContext, latlngs[0], latlngs[0], 0, latlngs);
            }

            segmentLatlngs.push(latlngs[i]);

            // is there a change in options or is it the last point?
            if (prevOptionIdx !== optionIdx || i === len - 1) {
                // Check if options is a function or an array
                if (typeof multiOptions.options === "function") {
                    this.addLayer(new Polyline(segmentLatlngs, multiOptions.options(prevOptionIdx)));
                } else {
                    this.addLayer(new Polyline(segmentLatlngs, multiOptions.options[prevOptionIdx]));
                }

                prevOptionIdx = optionIdx;
                segmentLatlngs = [latlngs[i]];
            }
        }

        return this;
    }

    getLatLngs() {
        return this._originalLatlngs;
    }

    getLatLngsSegments() {
        let latlngs = [];

        this.eachLayer(function (layer) {
            if(layer instanceof Polyline){
                latlngs.push(layer.getLatLngs());
            }
        });

        return latlngs;
    }
}

export function multiOptionsPolyline(latlngs:Array<LatLng>, options: MultiOptionsPolylineOptions): MultiOptionsPolyline{
    return new MultiOptionsPolyline(latlngs, options);
}
