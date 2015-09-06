(function () { 
    if (!mstrmojo.plugins.CollapsibleIndentedTree) {
        mstrmojo.plugins.CollapsibleIndentedTree = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.CollapsibleIndentedTree.CollapsibleIndentedTree = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.CollapsibleIndentedTree.CollapsibleIndentedTree",
            cssClass: "collapsibleindentedtree",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http://d3js.org/d3.v3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = parseInt(this.width,10) - margin.left - margin.right,
	height = parseInt(this.height,10) - margin.top - margin.bottom,
    barHeight = 20,
    barWidth = width * 0.8;var i = 0,
    duration = 400,
    root;var tree = d3.layout.tree()
    .nodeSize([0, 20]);var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });var svg = d3.select(this.domNode).append("svg")
    .attr("width", width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");var flare = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
flare.x0 = 0;
flare.y0 = 0;
update(root = flare);function update(source) {  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * barHeight;
  });  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.name; });  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();  // Update the links…
  var link = svg.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}}})}());
