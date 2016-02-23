(function () {
    if (!mstrmojo.plugins.HighChartsSamples) {
        mstrmojo.plugins.HighChartsSamples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.HighChartsSamples.HighChartsBase");

    mstrmojo.plugins.HighChartsSamples.HighStockCandleStick = mstrmojo.declare(
        mstrmojo.plugins.HighChartsSamples.HighChartsBase,
        null,
        {
            scriptClass: 'mstrmojo.plugins.HighChartsSamples.HighStockCandleStick',

            plot: function plot() {
                var scriptsObjectArray = [];
				scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/jquery-1.9.1.js"});
                scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/highstock.js"});
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

				// split the data set into ohlc and volume
				var ohlc = [],
					volume = [],
					dataLength = mstrData.length;
					
				for (i = 0; i < dataLength; i++) {
					debugger;
					var parts = mstrData[i].date.split("/");
					var month = ""+(parseInt(parts[0])-1);
					var date = parts[1];
					var year = parts[2];
					var dUTC = Date.UTC(year, month, date);
					ohlc.push([
						dUTC, // the date
						mstrData[i].open, // open
						mstrData[i].high, // high
						mstrData[i].low, // low
						mstrData[i].close // close
					]);
					
					volume.push([
						dUTC, // the date
						mstrData[i].volume // the volume
					])
				}

				// set the allowed units for data grouping
				var groupingUnits = [[
					'week',                         // unit name
					[1]                             // allowed multiples
				], [
					'month',
					[1, 2, 3, 4, 6]
				]];

				// create the chart
				$(this.domNode).highcharts('StockChart', {
					
					rangeSelector: {
						inputEnabled: $(this.domNode).width() > 480,
						selected: 1
					},

					title: {
						text: 'Google Historical'
					},

					yAxis: [{
						labels: {
							align: 'right',
							x: -3
						},
						title: {
							text: 'OHLC'
						},
						height: '60%',
						lineWidth: 2
					}, {
						labels: {
							align: 'right',
							x: -3
						},
						title: {
							text: 'Volume'
						},
						top: '65%',
						height: '35%',
						offset: 0,
						lineWidth: 2
					}],
					
					series: [{
						type: 'candlestick',
						name: 'GOOG',
						data: ohlc,
						dataGrouping: {
							units: groupingUnits
						}
					}, {
						type: 'column',
						name: 'Volume',
						data: volume,
						yAxis: 1,
						dataGrouping: {
							units: groupingUnits
						}
					}]
				});
				
			}			

        }
    );


}());
