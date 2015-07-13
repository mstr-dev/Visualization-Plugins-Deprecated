(function () {
    if (!mstrmojo.plugins.SequenceSunburst) {
        mstrmojo.plugins.SequenceSunburst = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.plugins.SequenceSunburst.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.hash"

    );

    mstrmojo.plugins.SequenceSunburst.SequenceSunburst = mstrmojo.declare(
        mstrmojo.plugins.SequenceSunburst.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.SequenceSunburst.SequenceSunburst",

            cssClass: "sequencesunburst",

            errorDetails: "This visualization requires one or more attributes and one metric.",

            externalLibraries: [{url: "http://d3js.org/d3.v3.min.js"}, {url: "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"}],

            useRichTooltip: true,

            reuseDOMNode: true,


            plot: function () {


                // Dimensions of sunburst.

                var width = parseInt(this.width, 10) - 100,
                    height = parseInt(this.height, 10) - 50;
                var radius = Math.min(width, height) / 2 * 0.9;
                var margin = 50;

                var gridData = this.dataInterface;

                var MetricName = gridData.getColHeaders(0).getHeader(0).getName();

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
                var b = {
                    w: 75, h: 30, s: 3, t: 10
                };


                var colors = d3.scale.category20c();
// Total size of all segments; we set this later, after loading the data.
                var totalSize = 0;
                var that = this;

                var color_hash = {};

                initHTMLNodes();
                var svg = d3.select(this.domNode).select("svg");
                if (svg.empty()) {
                    svg = d3.select(this.domNode).append("svg:svg");
                    svg.attr("width", width)
                        .attr("height", height)
                        .attr("y", margin);

                }
                var container = svg.select("#container");
                if (container.empty()) {
                    container = svg.append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                        .attr("id", "container");

                    container.append("circle")
                        .attr("id", "bdcircle")
                        .attr("r", radius)
                        .style("opacity", 0);




                    container.on("mouseleave", mouseleave);
                }


                var innerR;

                var partition = d3.layout.partition()
                    .size([2 * Math.PI, radius * radius])
                    .value(function(d) { return d.value; });

                var arc = d3.svg.arc()
                    .startAngle(function(d) { return d.x; })
                    .endAngle(function(d) { return d.x + d.dx; })
                    .innerRadius(function(d) {
                        if (d.depth == 1) innerR = Math.sqrt(d.y);
                        return Math.sqrt(d.y); })
                    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });





                function initHTMLNodes() {


                    var sidebar = d3.select(that.domNode).select("div.sidebar");
                    if (sidebar.empty()) {
                        sidebar = d3.select(that.domNode).append("div")
                            .attr("class", "sidebar");

                        var cbox = sidebar.select("input");
                        if (cbox.empty()) {

                            cbox = sidebar
                                .append("input")
                                .attr("checked", true)
                                .attr("type", "checkbox");

                            sidebar
                                .append("label")
                                .text("Legend")
                                .style("font-family", "arial");

                        }


                        var legend = sidebar.select("div.legend");
                        if (legend.empty()) {
                            legend = sidebar.append("div")
                                .attr("class", "legend")
                                .style("visibility", "");


                        }

                        cbox.on("click", toggleLegend);




                    }

                    var sequence = d3.select(that.domNode).select("div.sequence");
                    if (sequence.empty()) {
                        sequence = d3.select(that.domNode).append("div")
                            .attr("class", "sequence");

                    }



                };


                this.flareJson(function(data) {
                    initializeBreadcrumbTrail();


                   var root = data;
                    var nodes = partition.nodes(root)
                        .filter(function(d) {
                            return (d.dx > 0.005) ;
                        })

                        var path = d3.select(that.domNode).select("#container")/*.select("g")*/.selectAll("path")
                        .data(nodes)
                        .enter().append("svg:path")

                        .attr("display", function(d) { return d.depth ? null : "none"; })
                        .attr("d", arc)
                        .attr("fill-rule", "evenodd")
                        .style("fill", function(d) {
                                if (d.depth) { color_hash[colors(d.name)] = mstrmojo.string.decodeHtmlString(d.name);
                                return colors(d.name); }
                                return null;
                            })
                        .style("opacity", 1)
                        .on("mouseover", mouseover);


                    drawLegend();


                    // Get total size of the tree = value of root node from partition.

                    totalSize = path.node().__data__.value;
                });


                container.append("text")
                    .style("font-size", "3.5em")
                    .style("fill", "#666")
                    .style("font-family", "arial")
                    .style("text-anchor", "middle")
                    .attr("id", "percentage");

                container.append("text")
                    .attr("id", "explanation")
                    .text("of "+ MetricName + " is with this sequence of dropzone members")
                    .style("font-size", "1em")
                    .style("fill", "#666")
                    .style("font-family", "arial")
                    .attr("dy", "3.5em")
                    .style("visibility", "hidden")
                    .style("text-anchor", "middle");


// Fade all but the current sequence, and show it in the breadcrumb trail.
                function mouseover(d) {

                    var percentage = (100 * d.value / totalSize).toPrecision(3);
                    var percentageString = percentage + "%";
                    if (percentage < 0.1) {
                        percentageString = "< 0.1%";
                    }

                    d3.select("#percentage")
                        .text(percentageString);

                    d3.select("#percentage")
                        .style("visibility", "");
                    d3.select("#explanation")
                        .style("visibility", "");

                    var sequenceArray = getAncestors(d);
                    updateBreadcrumbs(sequenceArray, percentageString);

                    // Fade all the segments.
                    d3.select(that.domNode).select("#container")/*.select("g")*/.selectAll("path")
                        .style("opacity", 0.3);

                    // Then highlight only those that are an ancestor of the current segment.
                    //vis.selectAll("path")
                    d3.select(that.domNode).select("#container")/*.select("g")*/.selectAll("path")
                        .filter(function(node) {
                            return (sequenceArray.indexOf(node) >= 0);
                        })
                        .style("opacity", 1);
                }

// Restore everything to full opacity when moving off the visualization.
                function mouseleave(d) {

                    // Hide the breadcrumb trail
                    d3.select("#trail")
                        .style("visibility", "hidden");

                    // Deactivate all segments during transition.
                    d3.select(that.domNode).select("#container")/*.select("g")*/.selectAll("path").on("mouseover", null);

                    // Transition each segment to full opacity and then reactivate it.
                    d3.select(that.domNode).select("#container")/*.select("g")*/.selectAll("path")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1)
                        .each("end", function() {
                            d3.select(this).on("mouseover", mouseover);
                        });

                    d3.select("#percentage")
                        .style("visibility", "hidden");
                    d3.select("#explanation")
                        .style("visibility", "hidden");
                }

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
                function getAncestors(node) {
                    var path = [];
                    var current = node;
                    while (current.parent) {
                        path.unshift(current);
                        current = current.parent;
                    }
                    return path;
                }

                function initializeBreadcrumbTrail() {
                    // Add the svg area.
                    var trail = d3.select("div.sequence").select("svg");
                    if (trail.empty()) {
                        trail = d3.select("div.sequence").append("svg")
                            .attr("width", width)
                            .attr("height", 50)
                            .attr("id", "trail");
                        trail.append("svg:text")
                            .attr("id", "endlabel")
                            .style("fill", "#000");
                    }

                }

// Generate a string that describes the points of a breadcrumb polygon.
                function breadcrumbPoints(d, i) {
                    var points = [];
                    points.push("0,0");
                    points.push(b.w + ",0");
                    points.push(b.w + b.t + "," + (b.h / 2));
                    points.push(b.w + "," + b.h);
                    points.push("0," + b.h);
                    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                        points.push(b.t + "," + (b.h / 2));
                    }
                    return points.join(" ");
                }

// Update the breadcrumb trail to show the current sequence and percentage.
                function updateBreadcrumbs(nodeArray, percentageString) {

                    // Data join; key function combines name and depth (= position in sequence).
                    var g = d3.select("#trail")
                        .selectAll("g")
                        .data(nodeArray, function(d) {
                            return d.name + d.depth; });

                    // Add breadcrumb and label for entering nodes.
                    var entering = g.enter().append("svg:g");

                    entering.append("svg:polygon")
                        .attr("points", breadcrumbPoints)
                        .style("fill", function(d) {
                            return colors(d.name); });

                    entering.append("svg:text")
                        .attr("x", (b.w + b.t) / 2)
                        .attr("y", b.h / 2)
                        .attr("dy", "0.35em")
                        .attr("text-anchor", "middle")
                        .text(function(d) {
                            return mstrmojo.string.decodeHtmlString(d.name); })
                        .style("fill", "#fff")
                        .style("font-family", "arial")
                        .style("font-weight", "600");

                    // Set position for entering and updating nodes.
                    g.attr("transform", function(d, i) {
                        return "translate(" + i * (b.w + b.s) + ", 0)";
                    });

                    // Remove exiting nodes.
                    g.exit().remove();

                    // Now move and update the percentage at the end.
                    d3.select("#trail").select("#endlabel")
                        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
                        .attr("y", b.h / 2)
                        .attr("dy", "0.35em")
                        .attr("text-anchor", "middle")
                        .style("font-family", "arial")
                        .text(percentageString);

                    // Make the breadcrumb trail visible, if it's hidden.
                    d3.select("#trail")
                        .style("visibility", "");

                }

                function drawLegend() {

                    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
                    var li = {
                        w: 75, h: 30, s: 3, r: 3
                    };

                    var legend = d3.select("div.legend").selectAll("svg");
                    if (legend.empty()) {
                        legend = d3.select("div.legend").append("svg")
                            .attr("width", li.w)
                            .attr("height", mstrmojo.hash.keyarray(color_hash).length * (li.h + li.s));
                    }

                    var g = legend.selectAll("g")

                        .data(colors.range())
                        .enter().append("g")
                        .attr("transform", function(d, i) {
                            return "translate(0," + i * (li.h + li.s) + ")";
                        })

                    g.append("rect")
                        .attr("width", li.w)
                        .attr("height", li.h)
                        .attr("rx", li.r)
                        .attr("ry", li.r)
                        .style("fill", function(d) {
                            return d;
                        });

                    g.append("text")
                        .attr("x", li.w / 2)
                        .attr("y", li.h / 2)
                        .attr("dy", "0.35em")
                        .attr("font-family", "arial")
                        .attr("text-anchor", "middle")
                        .text(function(d) {
                            return color_hash[d]; })
                        .style("fill", "#fff")
                        .style("font-weight", "600");

                }

                function toggleLegend() {
                    var legend = d3.selectAll("div.legend");
                    if (legend.style("visibility") == "hidden") {
                        legend.style("visibility", "");
                    } else {
                        legend.style("visibility", "hidden");
                    }
                }

            }

        }
    );
}());
//@ sourceURL=SequenceSunburst.js