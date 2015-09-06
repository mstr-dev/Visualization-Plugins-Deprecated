(function () { 
    if (!mstrmojo.plugins.ClusterDendrogram_Radial) {
        mstrmojo.plugins.ClusterDendrogram_Radial = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.ClusterDendrogram_Radial.ClusterDendrogram_Radial = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ClusterDendrogram_Radial.ClusterDendrogram_Radial",
            cssClass: "clusterdendrogram_radial",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
var width = parseInt(this.width, 10);var radius = width / 2;
var heightR = parseInt(this.height, 10) / 2;var cluster = d3.layout.cluster()
    .size([360, radius - 240 ]);var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) {
        return [d.y, d.x / 180 * Math.PI];
    });var svg = d3.select(this.domNode)
    .append("svg")
    .attr("width", radius * 2)
    .attr("height", heightR * 2)
    .append("g")
    .attr("transform", "translate(" + radius + "," + heightR + ")");var root = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);var nodes = cluster.nodes(root);var link = svg.selectAll("path.link")
    .data(cluster.links(nodes))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);var node = svg.selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    });node.append("circle")
    .attr("r", 4.5);node.append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) {
        return d.x < 180 ? "start" : "end";
    })
    .attr("transform", function(d) {
        return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
    })
    .text(function(d) {
        return d.name;
    });
d3.select(self.frameElement)
    .style("height", radius * 2 + "px")
	.style("width", heightR * 2 + "px");}})}());
