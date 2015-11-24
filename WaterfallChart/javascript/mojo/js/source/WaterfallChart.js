/**
 * Author: Christoph Kiefer
 * 
 * Author email: christoph.kiefer@kieferitsolutions.ch
 * 
 * Description:
 * 
 * Code copied and adapted from:
 * 
 * Version 1.0, Date: 17.11.2015
 */
(function() {
	if (!mstrmojo.plugins.WaterfallChart) {
		mstrmojo.plugins.WaterfallChart = {};
	}

	mstrmojo.requiresCls("mstrmojo.CustomVisBase",
			"mstrmojo.models.template.DataInterface");

	mstrmojo.plugins.WaterfallChart.WaterfallChart = mstrmojo
			.declare(
					mstrmojo.CustomVisBase,
					null,
					{
						scriptClass : "mstrmojo.plugins.WaterfallChart.WaterfallChart",
						cssClass : "waterfallchart",
						errorMessage : "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
						errorDetails : "This visualization requires one or more attributes and one metric.",
						externalLibraries : [ {
							url : "http://code.jquery.com/jquery-latest.js"
						}, {
							url : "http://d3js.org/d3.v3.min.js"
						} ],
						useRichTooltip : false,
						reuseDOMNode : false,
						plot : function() {
							var margin = {
								top : 10,
								right : 10,
								bottom : 30,
								left : 30
							}, width = parseInt(this.width, 10) - margin.left
									- margin.right, height = parseInt(
									this.height, 10)
									- margin.top - margin.bottom;

							var x0 = d3.scale.ordinal().rangeRoundBands(
									[ 0, width ], 0, .1);

							var x1 = d3.scale.ordinal();

							var y = d3.scale.linear().range([ height, 0 ]);

							var color = d3.scale.ordinal().range(
									[ "#2DBAD4", "#33CC33", "#00E6B8",
											"#C9081D" ]);

							var xAxis = d3.svg.axis().scale(x0)
									.orient("bottom");

							var yAxis = d3.svg.axis().scale(y).orient("left")
									.tickFormat(d3.format(".2s"));

							var svg = d3
									.select(this.domNode)
									.append("svg")
									.attr("width",
											width + margin.left + margin.right)
									.attr("height",
											height + margin.top + margin.bottom)
									.append("g").attr(
											"transform",
											"translate(" + margin.left + ","
													+ margin.top + ")");

							var csv = this.dataInterface
									.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS);

							var gridData = this.dataInterface;
							var rowHeaders = gridData.getRowHeaders();
							var attributeName = rowHeaders.titles[0].n;
							for (var i = 0; i < csv.length; i++) {
								for ( var key in csv[i]) {
									if (key !== attributeName) {
										csv[i][key] = csv[i][key]["rv"] + "";
									}
								}
							}

							var data = csv;

							var categories = d3.keys(data[0]).filter(
									function(key) {
										return key !== attributeName;
									});

							data
									.forEach(function(d) {
										debugger;
										// first calculate
										// the starting
										// height for each
										// category
										total = 0;
										totals = {};
										for (var i = 0; i < categories.length; i++) {
											if (i == categories.length) {
												total = total
														- +d[categories[i]];
												totals[categories[i]] = total;
											} else {
												totals[categories[i]] = total;
												total += +d[categories[i]];
											}
										}
										// then map category
										// name, value, and
										// starting height
										// to each
										// observation
										d.formatted = categories
												.map(function(category) {
													return {
														name : category,
														value : Math
																.abs(+d[category]),
														baseHeight : +d[category] > 0 ? +totals[category]
																: (+totals[category] - Math
																		.abs(+d[category]))
													};
												});
									});

							x0.domain(data.map(function(d) {
								return d[attributeName];
							}));
							x1.domain(categories).rangeRoundBands(
									[ 0, x0.rangeBand() ]);
							y.domain([ 0, d3.max(data, function(d) {
								return d3.max(d.formatted, function(d) {
									return d.value + d.baseHeight;
								});
							}) ]);

							svg.append("g").attr("class", "x axis").attr(
									"transform", "translate(0," + height + ")")
									.call(xAxis);

							svg.append("g").attr("class", "y axis").call(yAxis)
									.append("text").attr("transform",
											"rotate(-90)").attr("y", 6).attr(
											"dy", ".71em").style("text-anchor",
											"end").text("Metric Value");

							var state = svg.selectAll(".state").data(data)
									.enter().append("g").attr("class", "g")
									.attr(
											"transform",
											function(d) {
												return "translate("
														+ x0(d[attributeName])
														+ ",0)";
											});

							state.selectAll("rect").data(function(d) {
								return d.formatted;
							}).enter().append("rect").attr("width",
									x1.rangeBand()).attr("x", function(d) {
								return x1(d.name);
							}).attr("y", function(d) {
								return y(d.value + d.baseHeight);
							}).attr("height", function(d) {
								return height - y(d.value);
							}).style("fill", function(d) {
								return color(d.name);
							});

							var legend = svg.selectAll(".legend").data(
									categories.slice().reverse()).enter()
									.append("g").attr("class", "legend").attr(
											"transform",
											function(d, i) {
												return "translate(0," + i * 20
														+ ")";
											});

							legend.append("rect").attr("x", width - 18).attr(
									"width", 18).attr("height", 18).style(
									"fill", color);

							legend.append("text").attr("x", width - 24).attr(
									"y", 9).attr("dy", ".35em").style(
									"text-anchor", "end").text(function(d) {
								return d;
							});

						}
					})
}());
