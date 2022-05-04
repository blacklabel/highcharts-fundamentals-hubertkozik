const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

const getRandomItem = (array) => { 
    return array[Math.floor(Math.random()*array.length)]; 
}

(function (H) {
    function clamp(value, min, max) {
        return value > min ? value < max ? value : max : min;
    }
    H.wrap(H.layouts['reingold-fruchterman'].prototype, 'applyLimitBox', function (proceed, node, box) {        
        var radius = node.radius;
        /*
        TO DO: Consider elastic collision instead of stopping.
        o' means end position when hitting plotting area edge:

        - "inelastic":
        o
        \
        ______
        |  o'
        |   \
        |    \

        - "elastic"/"bounced":
        o
        \
        ______
        |  ^
        | / \
        |o'  \

        Euler sample:
        if (plotX < 0) {
            plotX = 0;
            dispX *= -1;
        }

        if (plotX > box.width) {
            plotX = box.width;
            dispX *= -1;
        }
        */
       
        const h = box.height,
            m = box.height,

            halfOfBase = {
            plotX: box.width / 2, 
            plotY: h},

            tA = {
            plotX: halfOfBase.plotX - m,
            plotY: h
            },

            tB = {
            plotX: halfOfBase.plotX + m,
            plotY: h
            };

        let a = node.plotX - tA.plotX;

        if(node.plotX > halfOfBase.plotX){
            a = tB.plotX - node.plotX;
        }

        const b = (a * h) / m,
            D = {plotX: node.plotX, plotY: h - b};

        // Limit X-coordinates:
        node.plotX = clamp(node.plotX, tA.plotX + radius, tB.plotX + radius);
        // Limit Y-coordinates:
        node.plotY = clamp(node.plotY, D.plotY + radius, h + radius);
    });
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: 800,
    },
    plotOptions: {
        packedbubble: {
            minSize: '100%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
        }
    },
    series: [{
        data: getData(1, 50, 100)
    },]
});
