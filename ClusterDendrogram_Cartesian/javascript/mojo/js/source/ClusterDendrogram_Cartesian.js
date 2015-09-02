(function () { 
    if (!mstrmojo.plugins.ClusterDendrogram_Cartesian) {
        mstrmojo.plugins.ClusterDendrogram_Cartesian = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.ClusterDendrogram_Cartesian.ClusterDendrogram_Cartesian = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ClusterDendrogram_Cartesian.ClusterDendrogram_Cartesian",
            cssClass: "clusterdendrogram_cartesian",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
//var width = 960,
//    height = 900;
var width = parseInt(this.width, 10),
    height = parseInt(this.height, 10);
var cluster = d3.layout.cluster()
    .size([height, width - 160]);
var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });
var svg = d3.select(this.domNode).append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");	var root = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);      var nodes = cluster.nodes(root),
        links = cluster.links(nodes);
  
    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });
    node.append("circle")
        .attr("r", 4.5);
    node.append("text")
        .attr("dx", function(d) {
            return d.children ? -8 : 8;
        })
        .attr("dy", 3)
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        });d3.select(self.frameElement).style("height", height + "px");}})}());
