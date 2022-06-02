const getData = (min, max, count) => {
    return Array.from({
        length: count
    }, () => Math.floor(Math.random() * (max - min) + min));
}

(function (H) {
    H.wrap(
        H.layouts['reingold-fruchterman'].prototype, 'force', function (p) {
            p.apply(this, Array.prototype.slice.call(arguments, 1));            

            if (arguments[1] === 'repulsive') {
                const repNode = arguments[5],
                force = arguments[3] / repNode.mass,
                forceLimit = 4;

                if (force > forceLimit) {
                    const randomColor = Math.floor(Math.random() * 16777215);
                    repNode.color = '#' + randomColor.toString(16);
                }
            }
        }
    );
// eslint-disable-next-line no-undef
})(Highcharts);

// eslint-disable-next-line no-undef
Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: 800
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000
        }
    },
    series: [{
        data: getData(1, 50, 3)
    }]
});
