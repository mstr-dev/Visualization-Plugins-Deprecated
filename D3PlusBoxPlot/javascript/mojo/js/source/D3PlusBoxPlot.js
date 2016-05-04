/**
 * Author: Christoph Kiefer
 * 
 * Author email: christoph.kiefer@kieferitsolutions.ch
 * 
 * Description: Box and Whisker plot using D3Plus.jus
 * 
 * Code copied and adapted from: M. Bostock:
 * http://bl.ocks.org/mbostock/4061502, A. Simoes:
 * http://d3plus.org/examples/basic/78018ce8c3787d4e30d9/
 * 
 * Version 1.1, Date: 10.11.2015
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
						} ],
						useRichTooltip : true,
						reuseDOMNode : true,
						plot : function() {
							var data, vis, _domNode, newData;

							_domNode = this.domNode;
							data = this.dataInterface
									.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS);

							newData = [];

							for (var i = 0, l = data.length; i < l; i++) {
								var obj = data[i], t = obj[Object.keys(obj)[0]], n = obj[Object
										.keys(obj)[1]], obj2 = obj[Object
										.keys(obj)[2]], rv = obj2[Object
										.keys(obj2)[1]];

								newData.push({
									time : t,
									name : n,
									value : rv
								});
							}

							vis = d3.select(_domNode).append("div").attr("id",
									"my3DBoxPlot");

							d3plus.viz().container("#my3DBoxPlot")
									.data(newData).type("box").id("name").x(
											"time").y("value").time("time").ui(
											[ {
												"label" : "Visualization Type",
												"method" : "type",
												"value" : [ "scatter", "box" ]
											} ]).draw();

						}
					})
}());
