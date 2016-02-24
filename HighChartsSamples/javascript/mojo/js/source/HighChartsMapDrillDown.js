	(function () {
		if (!mstrmojo.plugins.HighChartsSamples) {
			mstrmojo.plugins.HighChartsSamples = {};
		}

		mstrmojo.requiresCls("mstrmojo.plugins.HighChartsSamples.HighChartsBase");

		mstrmojo.plugins.HighChartsSamples.HighChartsMapDrillDown = mstrmojo.declare(
			mstrmojo.plugins.HighChartsSamples.HighChartsBase,
			null,
			{
				scriptClass: 'mstrmojo.plugins.HighChartsSamples.HighChartsMapDrillDown',

				plot: function plot() {
				debugger;
					var scriptsObjectArray = [];
					scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/jquery-1.9.1.js"});
					scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/highmaps.js"});
					scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/data.js"});
					scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/drilldown.js"});
					scriptsObjectArray.push({url: "../plugins/HighChartsSamples/highchart/js/us-all.js"});				
					
					var me = this;
					this.requiresExternalScripts(scriptsObjectArray, function () {
						me.renderVis();
					});         
				},
				renderVis: function () {
					var mstrData = this.normalizedModel;
					console.log(mstrData);
					if (!mstrData) {
						console.log('data is empty');
						return;
					}

					debugger;
						
					var domNode = this.domNode;

					var data = Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'map');
					
					for(var ii=0;ii<data.length;ii++) {
						data[ii].value = 500;
						for(var jj=0;jj<mstrData.length;jj++) {
							if(data[ii].name == mstrData[jj].State) {
								data[ii].value = mstrData[jj].price;
								break;
							}	
						}
					}
					
					// Set drilldown pointers
					$.each(data, function (i) {
						this.drilldown = this.properties['hc-key'];
						//this.value = Math.random()*100; // Non-random bogus data
					});

					// Some responsiveness
					var small = $(domNode).width() < 400;

					// Instanciate the map
					$(domNode).highcharts('Map', {
						chart : {
							events: {
								drilldown: function (e) {
									
									if (!e.seriesOptions) {
										var chart = this,
											mapKey = 'countries/us/' + e.point.drilldown + '-all';

										// Show the spinner
										chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

										// Handle error, the timeout is cleared on success
										var fail = setTimeout(function () {
											if (!Highcharts.maps[mapKey]) {
												chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

												fail = setTimeout(function () {
													chart.hideLoading();
												}, 1000);
											}
										}, 3000);
										
										// Load the drilldown map
										$.getScript('http://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

											var data = Highcharts.geojson(Highcharts.maps[mapKey], 'map');
										
											// Set a non-random bogus value
											$.each(data, function (i) {
												this.value = Math.random()*100;
											});

											// Hide loading and add series
											chart.hideLoading();
											clearTimeout(fail);
											chart.addSeriesAsDrilldown(e.point, {
												name: e.point.name,
												data: data,
												dataLabels: {
													enabled: true,
													format: '{point.name}'
												}
											});
										})
									}

									
									this.setTitle(null, { text: e.point.name });
								},
								drillup: function (e) {
									this.setTitle(null, { text: 'USA' });
								}
							}
						},

						title : {
							text : 'Highcharts Map Drilldown'
						},

						subtitle: {
							text: 'USA',
							floating: true,
							align: 'right',
							y: 50,
							style: {
								fontSize: '16px'
							}
						},

						legend: small ? {} : {
							layout: 'vertical',
							align: 'right',
							verticalAlign: 'middle'
						},

						colorAxis: {
							min: 0,
							minColor: '#E6E7E8',
							maxColor: '#005645'
						},
						
						mapNavigation: {
							enabled: true,
							buttonOptions: {
								verticalAlign: 'bottom'
							}
						},

						plotOptions: {
							map: {
								states: {
									hover: {
										color: '#EEDD66'
									}
								}
							}
						},
						
						series : [{
							data : data,
							name: 'USA',
							dataLabels: {
								enabled: true,
								format: '{point.properties.postal-code}'
							}
						}], 

						drilldown: {
							//series: drilldownSeries,
							activeDataLabelStyle: {
								color: 'white',
								textDecoration: 'none'
							},
							drillUpButton: {
								relativeTo: 'spacingBox',
								position: {
									x: 0,
									y: 60
								}
							}
						}
					});				
				}			

			}
		);


	}());
