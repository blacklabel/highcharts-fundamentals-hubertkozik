// Add z values handler for polygon 3D
(function (H) {
    /**
     * (c) 2010-2017 Torstein Honsi
     *
     * License: www.highcharts.com/license
     */
    var perspective = H.perspective,
        pick = H.pick,
        Point = H.Point,
        seriesTypes = H.seriesTypes,
        wrap = H.wrap;

    /*** 
        EXTENSION FOR 3D SCATTER CHART
    ***/

    wrap(
        seriesTypes.scatter.prototype,
        'init',
        function (proceed, chart, options) {
            if (chart.is3d()) {
                // add a third coordinate
                this.axisTypes = ['xAxis', 'yAxis', 'zAxis'];
                this.pointArrayMap = ['x', 'y', 'z'];
                this.parallelArrays = ['x', 'y', 'z'];

                // Require direct touch rather than using the k-d-tree, because the k-d-tree currently doesn't
                // take the xyz coordinate system into account (#4552)
                this.directTouch = true;
            }

            var result = proceed.apply(this, [chart, options]);

            if (this.chart.is3d()) {
                // Set a new default tooltip formatter
                var default3dScatterTooltip =
                    'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
                if (this.userOptions.tooltip) {
                    this.tooltipOptions.pointFormat =
                        this.userOptions.tooltip.pointFormat ||
                        default3dScatterTooltip;
                } else {
                    this.tooltipOptions.pointFormat = default3dScatterTooltip;
                }
            }
            return result;
        }
    );
})(Highcharts);

// Give the points a 3D feel by adding a radial gradient
Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5,
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.2).get('rgb')],
            ],
        };
    }),
});

// Calculate shadows
const ShadowSeries = (data, chart, numberOfPoints, r) => {
    var newShadow = [],
        cos = Math.cos,
        sin = Math.sin,
        alpha = (2 * Math.PI) / numberOfPoints,
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0],
        zAxis = chart.zAxis[0],
        rx = xAxis.toValue(r) - xAxis.toValue(0),
        ry = yAxis.toValue(r) - yAxis.toValue(0),
        rz = zAxis.toValue(r) - zAxis.toValue(0);

    data.forEach((p) => {
        for (i = 0; i <= numberOfPoints; i++) {
            newShadow.push([
                0,
                p.y + ry * cos(i * alpha),
                p.z + rz * sin(i * alpha),
            ]);
        }
        newShadow.push(null);
        for (i = 0; i <= numberOfPoints; i++) {
            newShadow.push([
                p.x + rx * cos(i * alpha),
                0,
                p.z + rz * sin(i * alpha),
            ]);
        }
        newShadow.push(null);
        for (i = 0; i <= numberOfPoints; i++) {
            newShadow.push({
                x: p.x + rx * sin(i * alpha),
                y: p.y + ry * cos(i * alpha),
                z: 10,
            });
        }
        newShadow.push(null);
    });
    return newShadow;
};

const addShadowSeries = (data, chart, color) => {
    chart.addSeries({
        type: 'polygon',
        zIndex: 1,
        color: color,
        data: data,
    });
};

// Set up the chart
const chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        margin: 100,
        width: 1000,
        type: 'scatter3d',
        animation: false,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 45,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                bottom: {
                    size: 1,
                    color: 'rgba(0,0,0,1)',
                },
                back: {
                    size: 1,
                    color: 'rgba(0,0,0,1)',
                },
                side: {
                    size: 1,
                    color: 'rgba(0,0,0,1)',
                },
            },
        },
        events: {
            load: function () {
                const chart = this;

                const { pointCameraDistance } = Highcharts;

                let yellowShadow = ShadowSeries(
                    chart.series[0].data,
                    chart,
                    20,
                    10
                );
                addShadowSeries(yellowShadow, chart, 'yellow');

                let blueShadow = ShadowSeries(
                    chart.series[1].data,
                    chart,
                    20,
                    6
                );
                addShadowSeries(blueShadow, chart, 'blue');

                let redShadow = ShadowSeries(
                    chart.series[2].data,
                    chart,
                    20,
                    2
                );
                addShadowSeries(redShadow, chart, 'red');

                const maxSteps = 180,
                    yellowSeries = chart.series[0],
                    blueSeries = chart.series[1],
                    redSeries = chart.series[2],
                    yellowPoint = yellowSeries.points[0],
                    bluePoint = blueSeries.points[0],
                    redPoint = redSeries.points[0],
                    startX = yellowPoint.x,
                    startZ = yellowPoint.z,
                    alpha = (2 * Math.PI) / maxSteps,
                    redR = 0.3;

                let i = 0,
                    j = 0;

                setInterval(() => {
                    if (i === maxSteps) {
                        i = 0;
                    }
                    if (j === maxSteps) {
                        j = 0;
                    }

                    // BLUE POINT
                    blueZIndex =
                        pointCameraDistance(bluePoint, chart) <
                        pointCameraDistance(yellowPoint, chart)
                            ? -1
                            : 2;

                    blueSeries.update({
                        zIndex: blueZIndex,
                    });

                    const newBlueX = Math.cos(alpha * i) + startX,
                        newBlueZ = Math.sin(alpha * i) + startZ;

                    bluePoint.update({
                        x: newBlueX,
                        z: newBlueZ,
                    });

                    blueShadow = ShadowSeries(
                        chart.series[1].data,
                        chart,
                        20,
                        6
                    );
                    chart.series[4].update({
                        data: blueShadow,
                        zIndex: -1 * blueZIndex,
                    });

                    // RED POINT

                    redZIndex =
                        pointCameraDistance(redPoint, chart) <
                        pointCameraDistance(bluePoint, chart)
                            ? -2
                            : 3;

                    redZIndex2 =
                        pointCameraDistance(redPoint, chart) >
                        pointCameraDistance(yellowPoint, chart)
                            ? -2
                            : 3;

                    redSeries.update({
                        zIndex: redZIndex,
                    });

                    const newRedX = redR * Math.cos(alpha * j) + bluePoint.x,
                        newRedZ = redR * Math.sin(alpha * j) + bluePoint.z;

                    redPoint.update({
                        x: newRedX,
                        z: newRedZ,
                    });

                    redShadow = ShadowSeries(
                        chart.series[2].data,
                        chart,
                        20,
                        2
                    );
                    chart.series[5].update({
                        data: redShadow,
                        zIndex: redZIndex2,
                    });
                    i++;
                    j = j + 2;
                }, 10);
            },
        },
    },
    xAxis: {
        min: 0,
        max: 10,
        tickInterval: 1,
        gridLineWidth: 1,
    },
    yAxis: {
        min: 0,
        max: 10,
        tickInterval: 2,
        title: null,
    },
    zAxis: {
        min: 0,
        max: 10,
        tickInterval: 2,
        showFirstLabel: false,
    },
    legend: {
        enabled: false,
    },
    series: [
        {
            data: [
                {
                    x: 5,
                    y: 5,
                    z: 5,
                    marker: {
                        enabled: true,
                        radius: 10,
                        symbol: 'circle',
                        fillColor: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.3,
                                r: 0.5,
                            },
                            stops: [
                                [0, 'rgba(195,195,255,1)'],
                                [1, 'rgba(255,255,0,1)'],
                            ],
                        },
                    },
                },
            ],
        },
        {
            data: [
                {
                    x: 4.5,
                    y: 5,
                    z: 5,
                    marker: {
                        enabled: true,
                        radius: 6,
                        symbol: 'circle',
                        fillColor: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.3,
                                r: 0.5,
                            },
                            stops: [
                                [0, 'rgba(195,195,255,1)'],
                                [1, 'rgba(0,0,255,1)'],
                            ],
                        },
                    },
                },
            ],
        },
        {
            data: [
                {
                    x: 4,
                    y: 5,
                    z: 5,
                    marker: {
                        enabled: true,
                        radius: 2,
                        symbol: 'circle',
                        fillColor: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.3,
                                r: 0.5,
                            },
                            stops: [
                                [0, 'rgba(195,195,255,1)'],
                                [1, 'rgba(255,0,0,1)'],
                            ],
                        },
                    },
                },
            ],
        },
    ],
});

// Add mouse and touch events for rotation
(function (H) {
    function dragStart(eStart) {
        eStart = chart.pointer.normalize(eStart);

        const posX = eStart.chartX,
            posY = eStart.chartY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            sensitivity = 5, // lower is more sensitive
            handlers = [];

        function drag(e) {
            // Get e.chartX and e.chartY
            e = chart.pointer.normalize(e);

            chart.update(
                {
                    chart: {
                        options3d: {
                            alpha: alpha + (e.chartY - posY) / sensitivity,
                            beta: beta + (posX - e.chartX) / sensitivity,
                        },
                    },
                },
                undefined,
                undefined,
                false
            );
        }

        function unbindAll() {
            handlers.forEach(function (unbind) {
                if (unbind) {
                    unbind();
                }
            });
            handlers.length = 0;
        }

        handlers.push(H.addEvent(document, 'mousemove', drag));
        handlers.push(H.addEvent(document, 'touchmove', drag));

        handlers.push(H.addEvent(document, 'mouseup', unbindAll));
        handlers.push(H.addEvent(document, 'touchend', unbindAll));
    }
    H.addEvent(chart.container, 'mousedown', dragStart);
    H.addEvent(chart.container, 'touchstart', dragStart);
})(Highcharts);
