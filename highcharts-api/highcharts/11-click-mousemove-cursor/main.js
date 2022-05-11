const chart = Highcharts.chart('container', {
    series: [
        {
            data: [2, 5, 2, 3, 6, 5],
        },
    ],
});

(function (H) {
    function mouseMove(e) {
        e = chart.pointer.normalize(e);
        var posX = e.chartX,
            posY = e.chartY;

        if (!chart.circleOnMouse) {
            chart.circleOnMouse = chart.renderer
                .circle(posX, posY, 5)
                .attr({
                    fill: 'blue',
                })
                .add();
        } else {
            chart.circleOnMouse.attr({
                x: posX,
                y: posY,
            });
        }
    }
    function drawCircle(e) {
        e = chart.pointer.normalize(e);

        var posX = e.chartX,
            posY = e.chartY;

        chart.renderer
            .circle(posX, posY, 5)
            .attr({
                fill: 'blue',
            })
            .add();
    }

    H.addEvent(document, 'mousedown', drawCircle);
    H.addEvent(document, 'mouseover', mouseMove);
})(Highcharts);
