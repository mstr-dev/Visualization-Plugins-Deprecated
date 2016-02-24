(function () {
    if (!mstrmojo.plugins.HighChartsSamples) {
        mstrmojo.plugins.HighChartsSamples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.HighChartsSamples.HighChartsBase");

    mstrmojo.plugins.HighChartsSamples.HighChartsDynamicLine = mstrmojo.declare(
        mstrmojo.plugins.HighChartsSamples.HighChartsBase,
        null,
        {
            scriptClass: 'mstrmojo.plugins.HighChartsSamples.HighChartsDynamicLine',

            plot: function plot() {
			debugger;
                var scriptsObjectArray = [];
				scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/jquery-1.9.1.js"});
                scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/highcharts.js"});
                scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/exporting.js"});
				
				
                var me = this;
                this.requiresExternalScripts(scriptsObjectArray, function () {
                    me.renderVis();
                });         
            },
			renderVis: function () {
                var mstrData = this.normalizedModel;
                console.log(mstrData);
                if (!mstrData) {
                    console.log('json is empty');
                    return;
                }

				debugger;
					var domNode = this.domNode;

					Highcharts.setOptions({
						global: {
							useUTC: false
						}
					});
				
					var chart;
					$(domNode).highcharts({
						chart: {
							type: 'spline',
							animation: Highcharts.svg, // don't animate in old IE
							marginRight: 10,
							events: {
								load: function() {
				
									// set up the updating of the chart each second
									var series = this.series[0];
									setInterval(function() {
										var x = (new Date()).getTime(), // current time
											y = Math.random()*2000;
										series.addPoint([x, y], true, true);
									}, 2000);
								}
							}
						},
						title: {
							text: 'Live random data'
						},
						xAxis: {
							type: 'datetime',
							tickPixelInterval: 150
						},
						yAxis: {
							title: {
								text: 'Value'
							},
							plotLines: [{
								value: 0,
								width: 1,
								color: '#304244'
							}]
						},
						tooltip: {
							formatter: function() {
									return '<b>'+ this.series.name +'</b><br/>'+
									Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
									Highcharts.numberFormat(this.y, 2);
							}
						},
						legend: {
							enabled: false
						},
						exporting: {
							enabled: false
						},
						series: [{
							name: 'Random data',
							color: '#987654',
							data: (function() {
								// generate an array of random data
								var data = [],
									time = (new Date()).getTime(),
									i;
				
								for (i = 1-mstrData.length; i <= 0; i++) {
									data.push({
										x: time + i * 2000,
										y: mstrData[mstrData.length -1 - Math.abs(i)].price/1000
									});
								}
								return data;
							})()
						}]
					});
				//});
			}			

        }
    );


}());
