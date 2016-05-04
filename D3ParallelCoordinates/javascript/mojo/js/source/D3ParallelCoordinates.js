/**
 * Author: Christoph Kiefer
 * 
 * Description: Parallel Coordinates Plot
 * 
 * Code copied and adapted from:
 * https://github.com/syntagmatic/parallel-coordinates
 * 
 * Version 1.0, Date: 06.10.2015
 */
(function() {
	if (!mstrmojo.plugins.D3ParallelCoordinates) {
		mstrmojo.plugins.D3ParallelCoordinates = {};
	}

	mstrmojo.requiresCls("mstrmojo.CustomVisBase",
			"mstrmojo.models.template.DataInterface");

	mstrmojo.plugins.D3ParallelCoordinates.D3ParallelCoordinates = mstrmojo
			.declare(
					mstrmojo.CustomVisBase,
					null,
					{
						scriptClass : "mstrmojo.plugins.D3ParallelCoordinates.D3ParallelCoordinates",

						cssClass : "d3parallelcoordinates",

						errorDetails : "This visualization requires data.",

						externalLibraries : [
								{
									url : "http://d3js.org/d3.v3.min.js"
								},
								{
									url : "https://syntagmatic.github.io/parallel-coordinates/d3.parcoords.js"
								},
								{
									url : "https://syntagmatic.github.io/parallel-coordinates/examples/lib/divgrid.js"
								},
								{
									url : "http://underscorejs.org/underscore-min.js"
								} ],

						useRichTooltip : true,

						reuseDOMNode : true,

						plot : function() {

							var $DI = mstrmojo.models.template.DataInterface, normalizedModel = (new $DI(
									this.model.data))
									.getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS), isMstr = true, width, height, vis, _domNode = this.domNode, data;

							var transform = function transform(data) {
								var newData = [];

								// iterate over data rows
								for (var i = 0, l = data.length; i < l; i++) {
									var obj = data[i], row = {};

									// iterate over columns
									for (j = 0, lk = Object.keys(obj).length; j < lk; j++) {
										if (typeof obj[Object.keys(obj)[j]] == 'object') {
											obj2 = obj[Object.keys(obj)[j]];
											// console.log(Object.keys(obj)[j] +
											// " = " + obj2.rv);
											row[Object.keys(obj)[j]] = obj2.rv;
										} else {
											// console.log(Object.keys(obj)[j] +
											// " = " +
											// obj[Object.keys(obj)[j]]);
											row[Object.keys(obj)[j]] = obj[Object
													.keys(obj)[j]];
										}

									}
									newData.push(row);
								}
								return newData;
							};

							var init = function() {
								if (isMstr) {
									data = normalizedModel;
									vis = d3.select(_domNode).append("div")
											.attr("id", "example").attr(
													"class", "parcoords").attr(
													"style", "height:200px;");
									vis = d3.select(_domNode).append("div")
											.attr("id", "grid");
								} else {
									data = source;
									vis = d3.select("body").append("div").attr(
											"id", "example").attr("class",
											"parcoords").attr("style",
											"height:200px;");
									vis = d3.select("body").append("div").attr(
											"id", "grid");
								}

								data = transform(data);
							};

							var draw = function() {
								var firstRow = data[0], colorKey = Object
										.keys(firstRow)[1];

								var colorgen = d3.scale.category20();
								var colors = {};

								_(data).chain().pluck(colorKey).uniq().each(
										function(d, i) {
											colors[d] = colorgen(i);
										});

								var color = function(d) {
									return colors[d[colorKey]];
								};

								var parcoords = d3.parcoords()("#example")
										.color(color).alpha(0.4).data(data)
										.render().reorderable().brushMode(
												"1D-axes"); // enable brushing

								// create data table, row hover highlighting
								var grid = d3.divgrid();

								d3.select("#grid").datum(data.slice(0, 10))
										.call(grid).selectAll(".row").on({
											"mouseover" : function(d) {
												parcoords.highlight([ d ])
											},
											"mouseout" : parcoords.unhighlight
										});

								// update data table on brush event
								parcoords
										.on(
												"brush",
												function(d) {
													d3
															.select("#grid")
															.datum(
																	d.slice(0,
																			10))
															.call(grid)
															.selectAll(".row")
															.on(
																	{
																		"mouseover" : function(
																				d) {
																			parcoords
																					.highlight([ d ])
																		},
																		"mouseout" : parcoords.unhighlight
																	});
												});

							};

							init();
							draw();

						}
					});
})();