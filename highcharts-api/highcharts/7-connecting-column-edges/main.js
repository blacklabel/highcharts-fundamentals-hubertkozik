const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const renderLines = chart => {
    const lineWidth = 2; 
    if(chart.linesGroups = chart.linesGroups || []){
        chart.linesGroups.forEach(lineGroup => {
            lineGroup.destroy();
        });
    } 
    chart.linesGroups = [];
    chart.series.forEach(series => {
        if (series.visible){
            const positions = series.points.map((point, i) => {
                const temp = [];
                const {plotLeft, plotHeight, plotTop} = chart,
                    pointHeight = point.shapeArgs.height,
                    pointWidth = point.shapeArgs.width,
                    x = point.shapeArgs.x;
                if (i !== 0) {
                    temp.push(plotLeft + x, plotHeight + plotTop - pointHeight + lineWidth);             
                }           
                temp.push('M', plotLeft + x + pointWidth  - lineWidth, plotHeight + plotTop - pointHeight + lineWidth);
                i !== series.points.length -1 && temp.push('L');  
                return temp;
            });
            const group = chart.renderer.g().attr({
                'stroke-width': lineWidth,
                stroke: series.color,
                zIndex: 10
            }).add();
            chart.renderer.path(positions.flat()).add(group);
            chart.linesGroups.push(group);
        }     
    });
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            render: function() {
                renderLines(this);
            }
        }
    },
    series: [{
        data: getData(11, 15, 6)

    }, {
        data: getData(1, 4, 6)

    },  {
        data: getData(1, 13, 6)
    }]
});