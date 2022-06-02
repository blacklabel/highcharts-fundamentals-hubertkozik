const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const getRandomItem = (array) => { 
    return array[Math.floor(Math.random() * array.length)]; 
}

function getRandomItems(array, n) {
    return array.sort(() => .5 - Math.random()).slice(0, n);
}

const movePoint = chart => {
    let randomItems = getRandomItems(chart.series, 2),
        seriesFrom = randomItems[0],
        seriesTo = randomItems[1];

    while (seriesFrom.data.length === 1) { // to avoid empty parent node
        randomItems = getRandomItems(chart.series, 2),
        seriesFrom = randomItems[0],
        seriesTo = randomItems[1];
    }

    const pointToMove = getRandomItem(seriesFrom.data),
        value = pointToMove.options.value,
        plotX = pointToMove.plotX,
        plotY = pointToMove.plotY;
        
    seriesFrom.data[pointToMove.index].remove(true, true);
    seriesTo.addPoint({
        value,
        plotX,
        plotY
    });
}

Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: 800,
        events: {
            load: function() {
                if (this.series.length > 1){
                    setInterval(()=>movePoint(this), 1500);
                }
            }
        }
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            }
        }
    },
    series: [{
        data: getData(1, 50, 8)
    }, {
        data: getData(7, 50, 18)
    }]
});
