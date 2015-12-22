/**
 * Author: Christoph Kiefer
 * 
 * Description: Force-directed Graph
 * 
 * Code copied and adapted from:
 * 
 * a) http://bl.ocks.org/mbostock/4062045 b)
 * http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
 * c) http://jsfiddle.net/vfu78/16/
 * 
 * Version 1.0, Date: 24.11.2015
 */
(function() {
	if (!mstrmojo.plugins.ForceDirectedGraph) {
		mstrmojo.plugins.ForceDirectedGraph = {};
	}

	mstrmojo.requiresCls("mstrmojo.CustomVisBase",
			"mstrmojo.models.template.DataInterface");

	mstrmojo.plugins.ForceDirectedGraph.ForceDirectedGraph = mstrmojo
			.declare(
					mstrmojo.CustomVisBase,
					null,
					{
						scriptClass : "mstrmojo.plugins.ForceDirectedGraph.ForceDirectedGraph",

						cssClass : "forcedirectedgraph",

						errorDetails : "This visualization requires data.",

						externalLibraries : [
								{
									url : "http://d3js.org/d3.v3.min.js"
								},
								{
									url : "http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"
								} ],

						useRichTooltip : true,

						reuseDOMNode : true,

						plot : function() {

							var $DI = mstrmojo.models.template.DataInterface, normalizedModel = (new $DI(
									this.model.data))
									.getRawData($DI.ENUM_RAW_DATA_FORMAT.TREE),

							isMstr = root, width, height, node, link, min = +Infinity, max = -Infinity, vis, _domNode, scale = d3.scale
									.linear();

							root = normalizedModel;
							width = parseInt(this.width, 10);
							height = parseInt(this.height, 10);
							_domNode = this.domNode;
							vis = d3.select(_domNode).select("svg");
							if (vis.empty()) {
								vis = d3.select(_domNode).append("svg");
							}

							root.fixed = true;
							root.x = width / 2;
							root.y = height / 2;

							vis.attr("width", width).attr("height", height);

							// Set up tooltip
							var tip = d3.tip().attr('class', 'd3-tip').offset(
									[ -10, 0 ]).html(function(d) {
								return d.value + "";
							});

							vis.call(tip);

							var tick = function() {
								link.attr("x1", function(d) {
									return d.source.x;
								}).attr("y1", function(d) {
									return d.source.y;
								}).attr("x2", function(d) {
									return d.target.x;
								}).attr("y2", function(d) {
									return d.target.y;
								});

								node.attr("transform",
										function(d) {
											return "translate(" + d.x + ","
													+ d.y + ")";
										});
							};

							var force = d3.layout
									.force()
									.on("tick", tick)
									.charge(
											function(d) {
												return d.children ? -120
														: -60
																* Math
																		.sqrt(scale(d.value));
											}).linkDistance(function(d) {
										return 80;
									}).size([ width, height - 160 ]);

							var findMin = function findMin(root) {
								function recurse(node) {
									if (node.children) {
										node.children.forEach(function(child) {
											recurse(child);
										});
									} else {
										if (node.value <= min) {
											min = node.value;
										}
									}
								}
								recurse(root);
							}

							// Returns a list of all nodes under the root.
							var flatten = function flatten(root) {
								var nodes = [], i = 0

								function recurse(node) {
									if (node.children) {
										node.value = node.children.reduce(
												function(p, v) {
													return p + recurse(v);
												}, 0);
									}
									if (!node.id) {
										node.id = ++i;
									}

									nodes.push(node);
									return node.value;
								}

								root.value = recurse(root);
								max = root.value;

								findMin(root);

								scale.domain([ min, max ]);
								scale.range([ 0, 20 * height ]);
								return nodes;
							};

							var updateLinks = function() {
								force.links(links).start();
								link = vis.selectAll("line.mylink").data(links,
										function(d) {
											return d.target.id;
										});

								// Enter any new links.
								link.enter().insert("line", ".node").attr(
										"class", "mylink").attr("x1",
										function(d) {
											return d.source.x;
										}).attr("y1", function(d) {
									return d.source.y;
								}).attr("x2", function(d) {
									return d.target.x;
								}).attr("y2", function(d) {
									return d.target.y;
								});

								link.exit().remove();
							};

							var radius = function radius(d) {
								return d.children ? 8 : Math.max(15, Math
										.sqrt(scale(d.value)));
							};

							// Color leaf nodes orange, and packages white or
							// blue.
							var color = function color(d) {
								return d._children ? "#3182bd"
										: d.children ? "#c6dbef" : "#fd8d3c";
							};

							var updateNodes = function() {
								force.nodes(nodes).start();
								node = vis.selectAll(".node").data(nodes,
										function(d) {
											return d.id;
										});

								// Enter any new elements.
								var container = node.enter().append("g").attr(
										"class", "node").attr(
										"transform",
										function(d) {
											return "translate(" + d.x + ","
													+ d.y + ")";
										}).call(force.drag).on('mouseover',
										tip.show).on('mouseout', tip.hide);

								container.append("circle").attr("r", radius)
										.style("fill", color)
										.on("click", click);
								container.append("text").style("text-anchor",
										"middle");

								// update radius and text
								node.selectAll("circle").transition().attr("r",
										radius).style("fill", color);
								node.selectAll("text").text(function(d) {
									return !d.children ? d.name : null;
								});

								node.exit().remove();
							};

							var update = function() {
								nodes = flatten(root);
								links = d3.layout.tree().links(nodes);
								updateLinks();
								updateNodes();
							};

							// Toggle children on click.
							var click = function click(d) {
								if (d.children) {
									d._children = d.children;
									d.children = null;
								} else {
									d.children = d._children;
									d._children = null;
								}
								update();
							};

							update();
						}
					});
})();