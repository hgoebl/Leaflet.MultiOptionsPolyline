// rollup.config.js

export default {
    input: './dist/Leaflet.MultiOptionsPolyline.js',

    output: [{
        file: './dist/Leaflet.MultiOptionsPolyline.browser.js',
        format: 'iife',
        globals: {
            leaflet: 'L'
        },
        name: 'L',
        extend: true,
    }, {
        file: './dist/Leaflet.MultiOptionsPolyline.umd.js',
        format: 'umd',
        globals: {
            leaflet: 'L'
        },
        name: 'L',
        extend: true,
    }]

}
