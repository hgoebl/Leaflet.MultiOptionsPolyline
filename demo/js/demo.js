/*global L, Zepto*/
(function ($) {
    'use strict';

    function Demo(mapId, multiOptionsKey) {
        this.mapId = mapId;
        this.selected = multiOptionsKey || 'altitude';
    }

    Demo.prototype = {
        constructor: Demo,

        trackPointFactory: function (data) {
            return data.map(function (item) {
                var trkpt = L.latLng(item.lat, item.lng, item.alt);
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
                    return Math.floor(index / 3) % 3;
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
                        zones = [100, 110, 120, 130, 140, 150, 160, 164]; // beats per minute

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
                    speed /= (latLng.meta.time - prevLatLng.meta.time) / 1000; // m/s
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
                        altThresholds = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500]; // meters

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
            },
            inclineLast5: {
                optionIdxFn: function (latLng, prevLatLng, index, points) {
                    var i, minAltitude, deltaAltitude, deltaTime, incline, startIndex,
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900]; // m/h

                    startIndex = Math.max(index - 5, 0);
                    minAltitude = Infinity;
                    for (i = startIndex; i < index; ++i) {
                        minAltitude = Math.min(minAltitude, points[i].alt);
                    }
                    deltaAltitude = latLng.alt - minAltitude; // meters
                    deltaTime = (latLng.meta.time - points[startIndex].meta.time) / 1000; // sec
                    incline = 3600 * deltaAltitude / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return 4; // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            return i;
                        }
                    }
                    return thresholds.length;
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            inclineClustered: {
                fnContext: {
                    lastSlot: -1,
                    lastOptionIdx: 0
                },
                optionIdxFn: function (latLng, prevLatLng, index, points) {
                    var i, deltaAltitude, deltaTime, incline, startIndex, endIndex,
                        gain,
                        slot, slotSize = Math.floor(points.length / 60),
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900];

                    slot = Math.floor(index / slotSize);
                    if (slot === this.lastSlot) {
                        return this.lastOptionIdx;
                    }

                    this.lastSlot = slot;
                    startIndex = slot * slotSize;
                    endIndex = Math.min(startIndex + slotSize, points.length) - 1;
                    gain = 0;
                    for (i = startIndex + 1; i <= endIndex; ++i) {
                        deltaAltitude = points[i].alt - points[i - 1].alt;
                        if (deltaAltitude > 0) {
                            gain += deltaAltitude;
                        }
                    }
                    deltaTime = (points[endIndex].meta.time - points[startIndex].meta.time) / 1000; // sec
                    incline = 3600 * gain / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return (this.lastOptionIdx = 4); // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            break;
                        }
                    }
                    return (this.lastOptionIdx = i);
                },
                options: [
                    {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                    {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                    {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
                ]
            },
            inclineSimple: {
                optionIdxFn: function (latLng, prevLatLng) {
                    var i, deltaAltitude, deltaTime, incline,
                        thresholds = [200, 300, 400, 500, 600, 700, 800, 900];

                    deltaAltitude = latLng.alt - prevLatLng.alt; // meters
                    deltaTime = (latLng.meta.time - prevLatLng.meta.time) / 1000; // sec
                    incline = 3600 * deltaAltitude / deltaTime; // m/h

                    if (isNaN(incline)) {
                        return 4; // neutral
                    }

                    for (i = 0; i < thresholds.length; ++i) {
                        if (incline <= thresholds[i]) {
                            return i;
                        }
                    }
                    return thresholds.length;
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
                points = me.trackPoints;

            if (!me.map) {
                me.map = L.map(me.mapId, {
                    layers: MQ.mapLayer()
                });
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
    new Demo('map2', 'inclineClustered').loadData('hochries');
    new Demo('map3', 'heartRate').loadData('hochries');
    new Demo('map4', 'triZebra').loadData('hallenbad');
    new Demo('map5', 'speed').loadData('hallenbad');

})(Zepto);
