(function () { 
    if (!mstrmojo.plugins.ZoomableSunburst) {
        mstrmojo.plugins.ZoomableSunburst = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    mstrmojo.plugins.ZoomableSunburst.ZoomableSunburst = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.ZoomableSunburst.ZoomableSunburst",
            cssClass: "zoomablesunburst",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url:"http:////d3js.org/d3.v3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            plot:function(){
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = parseInt(this.width,10) - margin.left - margin.right,
height = parseInt(this.height,10) - margin.top - margin.bottom,
radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20c();

var partition = d3.layout.partition()
    .value(function(d) { return d.value; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

var svg = d3.select(this.domNode).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

var json = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);

var gridData = this.dataInterface;
var rowHeaders = gridData.getRowHeaders();
var attributeName = rowHeaders.titles[0].n;
  for (var i = 0; i < json.length; i++) {
    for (var key in json[i]) {
      if (key !== attributeName) {
        json[i][key] = json[i][key]["rv"] + "";
      }
    }
  }





  
 root = json;


  svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .on("click", click)
    .append("title")
      .text(function(d) { return d.name + "\n" + d.value; });


function click(d) {
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
}

d3.select(self.frameElement).style("height", height + "px");           

}})}());
//@ sourceURL=ZoomableSunburst.js