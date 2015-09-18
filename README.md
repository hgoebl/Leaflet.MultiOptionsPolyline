# Leaflet.MultiOptionsPolyline

A [Leaflet](http://leafletjs.com/)-plugin to enable multiple styles for a polyline.

Here you can see a [demo](http://hgoebl.github.io/Leaflet.MultiOptionsPolyline/demo/).

# Usage

Have a look at the demo. Links to source code are included.

# Example

```js
L.multiOptionsPolyline(points, {
    multiOptions: {
        optionIdxFn: function (latLng) {
            var i,
                altThresholds = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

            for (i = 0; i < altThresholds.length; ++i) {
                if (latLng.alt <= altThresholds[i]) {
                    return i;
                }
            }
            return altThresholds.length;
        },
        options: [
            {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
            {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
            {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
        ]
    },
    weight: 5,
    lineCap: 'butt',
    opacity: 0.75,
    smoothFactor: 1}).addTo(map);
```

# Installation

## Bower

    $ bower install hgoebl/Leaflet.MultiOptionsPolyline --save

# License

MIT-License (see LICENSE file).

# Testing

**TODO** no tests so far

Open `tests/SpecRunner.html` in different browsers.
