/// <reference types="leaflet" />
import { PolylineOptions, LatLng, FeatureGroup } from 'leaflet';
declare module 'Leaflet.MultiOptionsPolyline' {
    export type PolylineOptionsFn = (optionIdx: number) => PolylineOptions;

    export interface MultiOptions {
        optionIdxFn: (latLng: LatLng, prevLatLng: LatLng, index: number, allLatlngs: Array<LatLng>) => number;
        // options for the index returned by optionIdxFn. If supplied with a function then it will be called with the index
        options: PolylineOptions[] | PolylineOptionsFn;
        // the context to call optionIdxFn (optional)
        fnContext?: any;
        copyBaseOptions?: boolean;
    }

    export interface MultiOptionsPolylineOptions extends PolylineOptions {
        multiOptions: MultiOptions;
    }

    export interface MultiOptionsPolyline extends FeatureGroup {
        initialize(latlng: LatLng[], options?: MultiOptionsPolylineOptions): void;
        setLatLngs(latlngs: LatLng[]): MultiOptionsPolyline;
        getLatLngs(): LatLng[];
        getLatLngsSegments(): LatLng[];
    }

    export function multiOptionsPolyline(latlng: LatLng[], options?: MultiOptionsPolylineOptions): MultiOptionsPolyline;
}
