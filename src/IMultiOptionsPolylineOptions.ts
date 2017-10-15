import { LatLng, PolylineOptions } from 'leaflet';


type PolylineOptionsFn = (optionIdx: number) => PolylineOptions;


interface IMultiOptions {
    optionIdxFn: (latLng: LatLng, prevLatLng: LatLng, index: number, allLatlngs: Array<LatLng>) => number;
    // options for the index returned by optionIdxFn. If supplied with a function then it will be called with the index
    options: Array<PolylineOptions> | PolylineOptionsFn;
    // the context to call optionIdxFn (optional)
    fnContext?: any;
    copyBaseOptions?: boolean;
}

export interface IMultiOptionsPolylineOptions extends PolylineOptions {
    multiOptions: IMultiOptions;
}