Highcharts.chart('container', {
    chart: {
        type: 'funnel3d',
        options3d: {
            enabled: true,
            alpha: 10,
            depth: 50,
            viewDistance: 50,
        },
    },
    plotOptions: {
        series: {
            enableMouseTracking: false,
        },
        funnel3d: {
            neckWidth: '30%',
            neckHeight: '25%',
            width: '70%',
            height: '40%',
        },
        pyramid3d: {
            width: '80%',
            height: '35%',
            center: ['50%', '15%'],
        },
    },
    series: [
        {
            name: 'Unique users',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846],
            ],
        },
        {
            type: 'pyramid3d',
            name: 'Unique users',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846],
            ],
        },
    ],
});
