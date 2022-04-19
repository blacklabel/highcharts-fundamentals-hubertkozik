(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            zoomType: 'xy',
            height: 700
        },
        mapView: {
            projection: {
                name: 'Miller',
            }
        },
        series: [{
            data: [
                ['POL', 100],
                ['USA', 90],
                ['PER', 50],
                ['TZA', 40],
                ['AUS', 1]
            ],
            keys: ['iso-a3', 'value'],
            joinBy: ['iso-a3']
        }]
    });
})();