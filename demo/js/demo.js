/*global L, Zepto*/
(function ($) {
    'use strict';

    function Demo(mapId, multiOptionsKey) {
        this.mapId = mapId;
        this.selected = multiOptionsKey || 'altitude';
        this.tilesKey = 'mapQuest';
    }

    Demo.prototype = {
        constructor: Demo,

        tiles: {
            mapQuest: {
                layer: 'http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            },
            osm: {
                layer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        },

        trackPointFactory: function (data) {
            return data.map(function (item) {
                var trkpt = new L.LatLng(item.lat, item.lng, item.alt);
                trkpt.meta = item.meta;
                return trkpt;
            });
        },

        loadData: function (name) {
            var me = this;

            $.getJSON('data/' + name + '.json', function (data) {
                me.trackPoints = me.trackPointFactory(data);
                me.showMapAndTrack();
            });
        },

        _multiOptions: {
            triZebra: {
                optionIdxFn: function (latLng, prevLatLng, index) {
                    return Math.floor(index / 5) % 3;
                },
                options: [
                    {color: '#2FFC14'},
                    {color: '#FC14ED'},
                    {color: '#FAE900'}
                ]
            },
            heartRate: {
                optionIdxFn: function (latLng) {
                    var i, hr = latLng.meta.hr,
                        zones = [94, 107, 120, 125, 141, 146, 155, 164];

                    for (i = 0; i < zones.length; ++i) {
                        if (hr <= zones[i]) {
                            return i;
                        }
                    }
                    return zones.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'}, // below zone
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'}, // in zone
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}  // above zone
                ]
            },
            speed: {
                optionIdxFn: function (latLng, prevLatLng) {
                    var i, speed,
                        speedThresholds = [30, 35, 40, 45, 50, 55, 60, 65];

                    speed = latLng.distanceTo(prevLatLng); // meters
                    speed /= (latLng.meta.time - prevLatLng.meta.time) / 1000;
                    speed *= 3.6; // km/h

                    for (i = 0; i < speedThresholds.length; ++i) {
                        if (speed <= speedThresholds[i]) {
                            return i;
                        }
                    }
                    return speedThresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            altitude: {
                optionIdxFn: function (latLng) {
                    var i, alt = latLng.alt,
                        altThresholds = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

                    if (!alt) {
                        return 0;
                    }

                    for (i = 0; i < altThresholds.length; ++i) {
                        if (alt <= altThresholds[i]) {
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
            }
        },

        showMapAndTrack: function () {
            var me = this,
                points = me.trackPoints,
                tiles = me.tiles[me.tilesKey];

            if (!me.map) {
                me.map = L.map(me.mapId);

                L.tileLayer(tiles.layer, {
                    attribution: tiles.attribution
                }).addTo(me.map);
            }

            if (me.visibleTrack) {
                me.map.removeLayer(me.visibleTrack);
            }

            me.visibleTrack = L.featureGroup();

            // create a polyline from an arrays of LatLng points
            var polyline = L.multiOptionsPolyline(points, {
                multiOptions: me._multiOptions[me.selected],
                weight: 5,
                lineCap: 'butt',
                opacity: 0.75,
                smoothFactor: 1}).addTo(me.visibleTrack);

            // zoom the map to the polyline
            me.map.fitBounds(polyline.getBounds());

            me.visibleTrack.addTo(me.map);
        }
    };

    new Demo('map1', 'altitude').loadData('hochries');
    new Demo('map2', 'heartRate').loadData('hochries');
    new Demo('map3', 'triZebra').loadData('hallenbad');
    new Demo('map4', 'speed').loadData('hallenbad');

})(Zepto);
