/**
 * Author: Christoph Kiefer
 * 
 * Description: Box and Whisker plot
 * 
 * Code copied and adapted from:
 * 
 * M. Bostock: http://bl.ocks.org/mbostock/4061502
 * 
 * A. Simoes: http://d3plus.org/examples/basic/78018ce8c3787d4e30d9/
 * 
 * Version 1.0, Date: 06.10.2015
 */
(function() {
	if (!mstrmojo.plugins.D3PlusBoxPlot) {
		mstrmojo.plugins.D3PlusBoxPlot = {};
	}

	mstrmojo.requiresCls("mstrmojo.CustomVisBase",
			"mstrmojo.models.template.DataInterface");

	mstrmojo.plugins.D3PlusBoxPlot.D3PlusBoxPlot = mstrmojo
			.declare(
					mstrmojo.CustomVisBase,
					null,
					{
						scriptClass : "mstrmojo.plugins.D3PlusBoxPlot.D3PlusBoxPlot",
						cssClass : "d3plusboxplot",
						errorMessage : "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
						errorDetails : "This visualization requires one or more attributes and one metric.",
						externalLibraries : [ {
							url : "http://www.d3plus.org/js/d3.js"
						}, {
							url : "http://www.d3plus.org/js/d3plus.js"
						}, {
							url : "http://d3js.org/d3.v3.min.js"
						} ],
						useRichTooltip : true,
						reuseDOMNode : true,
						plot : function() {

							var isMstr = true, $DI, normalizedModel, vis, _domNode, newData;

							if (isMstr) {
								_domNode = this.domNode;
										$DI = mstrmojo.models.template.DataInterface,
										normalizedModel = (new $DI(
												this.model.data))
												.getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS);
								newData = [];

								for (var i = 0, l = normalizedModel.length; i < l; i++) {
									var obj = normalizedModel[i], t = obj[Object
											.keys(obj)[0]], n = obj[Object
											.keys(obj)[1]], obj2 = obj[Object
											.keys(obj)[2]], rv = obj2[Object
											.keys(obj2)[1]];

									newData.push({
										time : t,
										name : n,
										value : rv
									});
								}

								vis = d3.select(_domNode).append("div").attr(
										"id", "my3DBoxPlot");

								d3plus.viz().container("#my3DBoxPlot").data(
										newData).type("box").id("name").x(
										"time").y("value").time("time").ui([ {
									"label" : "Visualization Type",
									"method" : "type",
									"value" : [ "scatter", "box" ]
								} ]).draw();

							} else {
								vis = d3.select("body").append("div").attr(
										"id", "viz");

								var visualization = d3plus.viz().container(
										"#viz").data(data).type("box").id(
										"name").x("year").y("value").time(
										"year").ui([ {
									"label" : "Visualization Type",
									"method" : "type",
									"value" : [ "scatter", "box" ]
								} ]).draw()
							}

						}
					})
}());
