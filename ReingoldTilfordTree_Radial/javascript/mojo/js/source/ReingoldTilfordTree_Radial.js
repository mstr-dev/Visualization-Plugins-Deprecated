(function () { 
    if (!mstrmojo.plugins.ReingoldTilfordTree_Radial) {
        mstrmojo.plugins.ReingoldTilfordTree_Radial = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.ReingoldTilfordTree_Radial.ReingoldTilfordTree_Radial = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ReingoldTilfordTree_Radial.ReingoldTilfordTree_Radial",
            cssClass: "reingoldtilfordtree_radial",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
var width = parseInt(this.width,10);
var radius = width / 2;
var height = parseInt(this.height,10);var tree = d3.layout.tree()
    .size([360, radius / 2 - 60 ])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });var svg = d3.select(this.domNode).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width - 60) / 2 + "," + (height - 60) / 2 + ")");var root = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);  var nodes = tree.nodes(root),
      links = tree.links(nodes);  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });  node.append("circle")
      .attr("r", 4.5);  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { return d.name; });d3.select(self.frameElement).style("height", height + "px").style("width", width + "px");
}})}());
