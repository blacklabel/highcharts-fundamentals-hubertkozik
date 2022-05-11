Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        width: 1000,
    },
    plotOptions: {
        series: {
            allowPointSelect: false,
            states: {
                inactive: {
                    enabled: false,
                },
            },
        },
    },
    xAxis: [{}, { opposite: true }],
    yAxis: [{}, { opposite: true }],
    series: [
        {
            type: 'histogram',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 's1',
            zIndex: -1,
            point: {
                events: {
                    click: function () {
                        const chart = this.series.chart,
                            min = this.x,
                            max = this.x2;

                        this.select(!this.selected, false);

                        chart.series[1].points.forEach((point) => {
                            if (point.y >= min && point.y <= max) {
                                point.select(true, true);
                            }
                        });
                    },
                },
            },
        },
        {
            id: 's1',
            data: [
                3, 4, 5, 3, 2, 3, 2, 3, 4, 5, 3, 6, 3, 2, 4, 5, 5, 6, 6, 1, 6,
                6, 2, 1, 3, 5, 6,
            ],
        },
    ],
});
