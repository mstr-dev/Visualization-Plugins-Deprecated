(function () { 
    if (!mstrmojo.plugins.ReingoldTilfordTree_Cartesian) {
        mstrmojo.plugins.ReingoldTilfordTree_Cartesian = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.ReingoldTilfordTree_Cartesian.ReingoldTilfordTree_Cartesian = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ReingoldTilfordTree_Cartesian.ReingoldTilfordTree_Cartesian",
            cssClass: "reingoldtilfordtree_cartesian",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = parseInt(this.width,10) - margin.left - margin.right,
	height = parseInt(this.height,10) - margin.top - margin.bottom;var tree = d3.layout.tree()
    .size([height, width - 160]);var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });var svg = d3.select(this.domNode).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");var json = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
  var nodes = tree.nodes(json),
      links = tree.links(nodes);  var link = svg.selectAll("path.link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);  var node = svg.selectAll("g.node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });  node.append("circle")
      .attr("r", 4.5);  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });d3.select(self.frameElement).style("height", height + "px");}})}());
