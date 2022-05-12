const randomData = () => {
    var data = [],
        time = (new Date()).getTime(),
        i;

    for (i = -999; i <= 0; i += 1) {
        data.push([
            time + i * 1000,
            Math.round(Math.random() * 100)
        ]);
    }
    return data;
}

const addRandomData = series => {
    setInterval(function () {
        if(series.chart.LiveDataEnabled){
            const x = (new Date()).getTime(),
                y = Math.round(Math.random() * 100);
            series.addPoint([x, y], true, true);
        }
    }, 1000);
}

const loadFunction = chart => {
    const series = chart.series[0];
    chart.LiveDataEnabled = true;
    addRandomData(series);

    liveDataBtn.addEventListener('click', (e) => {
        chart.LiveDataEnabled = !chart.LiveDataEnabled;
        if(chart.LiveDataEnabled ){
            e.target.innerHTML = 'Disable Live Data';
        } else {
            e.target.innerHTML = 'Enable Live Data';
        }        
    });
}

Highcharts.stockChart('container1', {
    chart: {
        events: {
            load: function () {
                loadFunction(this);          
            }
        }
    },

    plotOptions: {
        series: {
            dataGrouping: {
                forced: true, 
                units: [ 
                    ['minute', [1]] 
                ] 
            }
        }
    },

    yAxis: [{},{},{}],

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1 Minute'
        }, {
            count: 5,
            type: 'minute',
            text: '5 Minute'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        buttonTheme: {
            width: 60
        },
        selected: 2
    },

    time: {
        useUTC: false
    },    

    series: [{
        name: 'Random data 1',
        id: 'randomData1',
        data: randomData()
    }, {
        type: 'sma',
        linkedTo: 'randomData1',
        zIndex: 1,
        yAxis: 1,
        marker: {
            enabled: false
        }
    }, {
        type: 'linearRegression',
        linkedTo: 'randomData1',
        zIndex: -1,
        yAxis: 2,
        params: {
            period: 15
        }
    }]
});

Highcharts.stockChart('container2', {
    chart: {
        events: {
            load: function () {
                loadFunction(this);          
            }
        }
    },

    rangeSelector: {
        buttons: [{
            type: 'second',
            //count: 3,
            text: 'Second',
            dataGrouping: {
                forced: true,
                units: [['second', [1]]]
            }
        }, {
            type: 'minute',
            text: 'Minute',
            dataGrouping: {
                forced: true,
                units: [['minute', [1]]]
            }
        }, {
            type: 'all',
            //count: 1,
            text: '5 Minutes',
            dataGrouping: {
                forced: true,
                units: [['minute', [5]]]
            }
        },],
        buttonTheme: {
            width: 60
        },
        inputEnabled: false,
        selected: 0
    },

    series: [{
        name: 'Random data 2',
        data: randomData()
    }]
});