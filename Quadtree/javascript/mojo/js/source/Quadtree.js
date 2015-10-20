/**
 * Replace
 * MojoVisualizationTemplate with your plugin folder name which should be same as JS file name
 * ...YOUR JS CODE... - Javascript code
 */
(function () {
    // We need to define this code as plugin in mstrmojo object
    if (!mstrmojo.plugins.Quadtree) {
        mstrmojo.plugins.Quadtree = {};
    }
    // Visualization requires library to render, and in this
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    // Declaration of the visualization object
    mstrmojo.plugins.Quadtree.Quadtree = mstrmojo.declare(
        //We need to declare that our code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            //here scriptClass is defined as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.Quadtree.Quadtree',
            cssClass: "quadtree",
            errorDetails: "This visualization requires two metrics.",
            useRichTooltip: true,
            reuseDOMNode: true,
            externalLibraries: [
                {url: "http://d3js.org/d3.v3.min.js"}
            ],
            plot: function () {
                //...YOUR JS CODE...
                var width = parseInt(this.width,10),
                    height = parseInt(this.height,10);

                var data = d3.range(5000).map(function() {
                    return [Math.random() * width, Math.random() * width];
                });

                var quadtree = d3.geom.quadtree()
                    .extent([[-1, -1], [width + 1, height + 1]])
                (data);

                var brush = d3.svg.brush()
                    .x(d3.scale.identity().domain([0, width]))
                    .y(d3.scale.identity().domain([0, height]))
                    .extent([[100, 100], [200, 200]])
                    .on("brush", brushed);

                var svg = d3.select(this.domNode).append("svg")
                    .attr("width", width)
                    .attr("height", height);

                svg.selectAll(".node")
                    .data(nodes(quadtree))
                    .enter().append("rect")
                    .attr("class", "node")
                    .attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; })
                    .attr("width", function(d) { return d.width; })
                    .attr("height", function(d) { return d.height; });

                var point = svg.selectAll(".point")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "point")
                    .attr("cx", function(d) { return d[0]; })
                    .attr("cy", function(d) { return d[1]; })
                    .attr("r", 4);

                svg.append("g")
                    .attr("class", "brush")
                    .call(brush);

                brushed();

                function brushed() {
                    var extent = brush.extent();
                    point.each(function(d) { d.scanned = d.selected = false; });
                    search(quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
                    point.classed("scanned", function(d) { return d.scanned; });
                    point.classed("selected", function(d) { return d.selected; });
                }

// Collapse the quadtree into an array of rectangles.
                function nodes(quadtree) {
                    var nodes = [];
                    quadtree.visit(function(node, x1, y1, x2, y2) {
                        nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
                    });
                    return nodes;
                }

// Find the nodes within the specified rectangle.
                function search(quadtree, x0, y0, x3, y3) {
                    quadtree.visit(function(node, x1, y1, x2, y2) {
                        var p = node.point;
                        if (p) {
                            p.scanned = true;
                            p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
                        }
                        return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
                    });
                }
            }
        });
})();//@ sourceURL=Quadtree.js