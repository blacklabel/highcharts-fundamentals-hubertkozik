const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const getRandomItem = (array) => { 
    return array[Math.floor(Math.random()*array.length)]; 
}

const movePoint = chart => {
    let seriesFrom = getRandomItem(chart.series),
        seriesTo = getRandomItem(chart.series);

    while(seriesFrom.data.length === 1){ // to avoid empty parent node
        seriesFrom = getRandomItem(chart.series);
    }

    while(chart.series.indexOf(seriesFrom) === chart.series.indexOf(seriesTo)){ // exclude seriesFrom
        seriesTo = getRandomItem(chart.series);
    }

    const pointToMove = getRandomItem(seriesFrom.data)
        indexOfPointToMove = seriesFrom.data.indexOf(pointToMove),
        value = pointToMove.options.value,
        plotX = pointToMove.plotX,
        plotY = pointToMove.plotY;
        
    seriesFrom.data[indexOfPointToMove].remove(true, true);
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
                setInterval(()=>movePoint(this), 1500);
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
