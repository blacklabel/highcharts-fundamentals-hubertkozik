const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const renderLines = chart => {
    if(chart.lines && chart.lines.length > 0) {
        chart.lines.forEach(line => {
            line.destroy();
        });
    }
    chart.lines = [];
    const lineWidth = 2;
    chart.series.forEach(series => {
        if(series.visible){
            const positions = series.points.map((point, i) => {
                const temp = [];
                if(i !== 0) {
                    temp.push(chart.plotLeft +  point.shapeArgs.x);
                    temp.push(chart.plotHeight + chart.plotTop - point.shapeArgs.height + lineWidth);             
                }           
                temp.push('M');
                temp.push(chart.plotLeft + point.shapeArgs.x + point.shapeArgs.width - lineWidth);
                temp.push(chart.plotHeight + chart.plotTop - point.shapeArgs.height + lineWidth);
                i !== series.points.length -1 && temp.push('L');  
                return temp;
            });
            chart.lines.push(chart.renderer.path(positions.flat())
            .attr({
                'stroke-width': lineWidth,
                stroke: series.color,
                zIndex: 10
            }).add());
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