Highcharts.chart('container', {
    chart: {
        type: 'pie',
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: false,
            },
            point: {
                events: {
                    legendItemClick: function () {
                        this.series.chart.series[1].points.find(point => point.name === this.name).setVisible();
                    },
                    mouseOver: function () {
                        const chart = this.series.chart,
                            oppositeIndex = this.series.index === 0 ? 1 : 0;
                        
                        const pointInSecondSeries = chart.series[oppositeIndex].points.find(point => point.name === this.name);

                        chart.tooltip.refresh(pointInSecondSeries);

                        chart.cloneToolTip = chart.tooltip.label.element.cloneNode(true);
                        chart.container.firstChild.appendChild(chart.cloneToolTip);

                        pointInSecondSeries.setState('hover');;
                    },
                    mouseOut: function () {
                        const chart = this.series.chart,
                            oppositeIndex = this.series.index === 0 ? 1 : 0;

                        if (chart.cloneToolTip) {
                            chart.container.firstChild.removeChild(chart.cloneToolTip);
                        }

                        const pointInSecondSeries = chart.series[oppositeIndex].points.find(point => point.name === this.name);
                        pointInSecondSeries.setState('');
                    }
                }
            }
        },
    },

    tooltip: {
        enabled: true,
        followPointer: false,
        useHTML: false,
        animation: false,
        hideDelay: 0,
    },

    series: [
        {
            name: "Browsers",
            center: ['35%','50%'],
            showInLegend: true,
            data: [
                {
                    name: "Chrome",
                    y: 62.74,
                },
                {
                    name: "Firefox",
                    y: 10.57,
                },
                {
                    name: "Internet Explorer",
                    y: 7.23,
                },
                {
                    name: "Safari",
                    y: 5.58,
                },
                {
                    name: "Edge",
                    y: 4.02,
                },
                {
                    name: "Opera",
                    y: 1.92,
                },
                {
                    name: "Other",
                    y: 7.62,
                }
            ]
        },
        {
            name: "Browsers",
            center: ['65%','50%'],
            data: [
                {
                    name: "Chrome",
                    y: 62.74,
                },
                {
                    name: "Firefox",
                    y: 10.57,
                },
                {
                    name: "Internet Explorer",
                    y: 7.23,
                },
                {
                    name: "Safari",
                    y: 5.58,
                },
                {
                    name: "Edge",
                    y: 4.02,
                },
                {
                    name: "Opera",
                    y: 1.92,
                },
                {
                    name: "Other",
                    y: 7.62,
                }
            ]
        }
    ]
});
