import { Polyline, FeatureGroup, Util, LatLng, PolylineOptions, MarkerOptions } from 'leaflet';
import { IMultiOptionsPolylineOptions } from './IMultiOptionsPolylineOptions'

export default class MultiOptionsPolyline extends FeatureGroup
{
    _layers: object;
    _options: IMultiOptionsPolylineOptions;
    _originalLatlngs: Array<LatLng>;
    _inLatLngs: Array<LatLng>;
    constructor(latlngs: Array<LatLng>, options: IMultiOptionsPolylineOptions){
        super();
        this._options = options;
        this._originalLatlngs = latlngs;

        //let copyBaseOptions = this._options.multiOptions.copyBaseOptions;
        
        this._layers = {};
        /*if (copyBaseOptions) {
            this.copyBaseOptions();
        }*/

        this.setLatLngs(this._originalLatlngs);
    }
    /*
    private copyBaseOptions ():void {
        let multiOptions = this._options.multiOptions;
        let optionsArray = multiOptions.options;
        let len = optionsArray.length;

        let baseOptions = Util.extend({}, this._options);
        delete baseOptions.multiOptions;

        for (let i = 0; i < len; ++i) {
            optionsArray[i] = Util.extend(baseOptions, multiOptions.options[i]);
        }
    }
    */

    setLatLngs (latlngs:Array<LatLng>):void {
        let multiOptions = this._options.multiOptions,
            optionIdxFn = multiOptions.optionIdxFn,
            fnContext = multiOptions.fnContext || this,
            prevOptionIdx, optionIdx,
            segmentLatlngs;

        this.eachLayer((layer) => {
            this.removeLayer(layer);
        }, this);


        let len = latlngs.length;
        for (let i = 1; i < len; ++i) {
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
    }

    getLatLngs(): Array<LatLng> {
        return this._originalLatlngs;
    }

    getLatLngsSegments():Array< Array<LatLng> > {
        let latlngs:Array< Array<LatLng> > = [];

        this.eachLayer((layer) => {
            if(layer instanceof Polyline){
                latlngs.push(layer.getLatLngs());
            }
        });

        return latlngs;
    }
}