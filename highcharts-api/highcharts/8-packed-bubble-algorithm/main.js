const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const getRandomItem = (array) => { 
    return array[Math.floor(Math.random()*array.length)]; 
}

(function (H) {
    H.wrap(H.layouts.packedbubble.prototype, 'repulsiveForces', function (proceed) {        
        var layout = this,
            force,
            distanceR,
            distanceXY,
            bubblePadding = layout.options.bubblePadding;
        layout.nodes.forEach(function (node) {
            node.degree = node.mass;
            node.neighbours = 0;
            layout.nodes.forEach(function (repNode) {
                force = 0;
                if (
                // Node can not repulse itself:
                node !== repNode &&
                    // Only close nodes affect each other:
                    // Not dragged:
                    //!node.fixedPosition &&
                    (layout.options.seriesInteraction ||
                        node.series === repNode.series)) {
                    distanceXY = layout.getDistXY(node, repNode);
                    distanceR = (layout.vectorLength(distanceXY) -
                        (node.marker.radius +
                            repNode.marker.radius +
                            bubblePadding));
                    // TODO padding configurable
                    if (distanceR < 0) {
                        node.degree += 0.01;
                        node.neighbours++;
                        force = layout.repulsiveForce(-distanceR / Math.sqrt(node.neighbours), layout.k, node, repNode);
                    }
                    if (distanceR < 0.15 && repNode.isParentNode) { //if (force > 4 && repNode.isParentNode) { 
                        const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
                        repNode.color = randomColor;
                        repNode.marker.fillColor = randomColor;
                        repNode.marker.lineColor = randomColor;
                        repNode.series.color = randomColor;
                    }
                    layout.force('repulsive', node, force * repNode.mass, distanceXY, repNode, distanceR);
                    
                }
            });
        });
    });
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: 800,
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '70%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            }
        }
    },
    series: [{
        data: getData(1, 50, 3)
    },
    {
        data: getData(1, 50, 3)
    },
    {
        data: getData(1, 50, 3)
    }]
});
