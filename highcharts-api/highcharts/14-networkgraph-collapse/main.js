Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        height: '100%',
        events: {
            load: function () {
                this.series[0].points.forEach(point => {
                    point.graphic.hide();
                    point.toNode.graphic.css({
                        display: 'none'
                    });
                    point.toNode.dataLabel.css({
                        display: 'none'
                      })
                    point.toNode.isHidden = true;
                });
            }
        }
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            point: {
                events: {
                  click: function() {
                    this.linksFrom.forEach(link => {
                        if (link.toNode.isHidden) {
                            link.graphic.show();
                            link.toNode.graphic.css({
                                display: 'block'
                            });
                            link.toNode.dataLabel.css({
                                display: 'block'
                            })
                            link.toNode.isHidden = false;
                        } else {
                            link.graphic.hide();
                            link.toNode.graphic.css({
                                display: 'none'
                            });
                            link.toNode.dataLabel.css({
                                display: 'none'
                            })
                            link.toNode.isHidden = true;
                        }
                    })
                  }
                }
              }
        }
    },
    series: [{
        dataLabels: {
            enabled: true,
            linkFormat: '',
        },
        data: [
            ['Proto Indo-European', 'Balto-Slavic'],
            ['Proto Indo-European', 'Germanic'],
            ['Proto Indo-European', 'Celtic'],
            ['Proto Indo-European', 'Italic'],
            ['Proto Indo-European', 'Hellenic'],
            ['Proto Indo-European', 'Anatolian'],
            ['Proto Indo-European', 'Indo-Iranian'],
            ['Proto Indo-European', 'Tocharian'],
            ['Indo-Iranian', 'Dardic'],
            ['Indo-Iranian', 'Indic'],
            ['Indo-Iranian', 'Iranian'],
            ['Iranian', 'Old Persian'],
            ['Old Persian', 'Middle Persian'],
            ['Indic', 'Sanskrit'],
            ['Italic', 'Osco-Umbrian'],
            ['Italic', 'Latino-Faliscan'],
            ['Latino-Faliscan', 'Latin'],
            ['Celtic', 'Brythonic'],
            ['Celtic', 'Goidelic']
        ]
    }]
});
