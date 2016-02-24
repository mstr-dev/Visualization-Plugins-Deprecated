(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3GroupedBar = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3GroupedBar',

            plot: function plot() {

                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear(),
                    stack =  d3.layout.stack()
                        .values(function (d) { return d.values; })
                        .x(function (d) { return d.date; })
                        .y(function (d) { return d.price; })
                        .out(function (d, y0, y) { d.price0 = y0; })
                        .order("reverse")
                        .offset("wiggle"),
                    color = d3.scale.category10(),
                    that = this;

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(this.normalizedModel, function (d) { return d.values[0].date; }),
                    d3.max(this.normalizedModel, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                stack(this.normalizedModel);

                var g = this.svg.selectAll(".symbol");

                y.domain([0, d3.max(this.normalizedModel.map(function (d) { return d.maxPrice; }))])
                    .range([h, 0]);

//                this.svg.select("line")
//                    .attr("class", "line")
//                    .attr("x1", 0)
//                    .attr("x2", w - 60)
//                    .attr("y1", h)
//                    .attr("y2", h)
//                    .style("stroke-opacity", 1e-6)
//                    .transition()
//                    .duration(this.duration)
//                    .style("stroke-opacity", 1);

                x = d3.scale.ordinal()
                    .domain(this.normalizedModel[0].values.map(function (d) { return d.date; }))
                    .rangeBands([0, w - 60], 0.1);

                var x1 = d3.scale.ordinal()
                    .domain(this.normalizedModel.map(function (d) { return d.key; }))
                    .rangeBands([0, x.rangeBand()]);

                g.each(function (p, j) {
                    var rects = d3.select(this).selectAll("rect")
                        .data(function (d) { return d.values; });

                    rects.enter().append("svg:rect")
                        .attr("x", function (d) { return x(d.date) + x1(p.key); })
                        .attr("y", function (d) { return y(d.price); })
                        .attr("width", x1.rangeBand())
                        .attr("height", function (d) { return h - y(d.price); })
                        .style("fill", color(p.key));

                    rects.exit()
                        .transition()
                        .duration(that.duration)
                        .style("fill-opacity", 1e-6)
                        .attr("height", 0)
                        .remove();

                    rects.transition()
                        .duration(that.duration)
                        .attr("x", function (d) { return x(d.date) + x1(p.key); })
                        .attr("y", function (d) { return y(d.price); })
                        .attr("width", x1.rangeBand())
                        .attr("height", function (d) { return h - y(d.price); });

                    var label = d3.select(this).select("text")
                        .transition()
                        .duration(that.duration)
                        .text(p.key);

                    if (label.empty()) {
                        label =  d3.select(this).append("svg:text")
                            .attr("x", 12)
                            .text(p.key);
                    }
                    label.attr("transform", function () { return "translate(" + (w - 60) + "," + h + ")"; })
                        .attr("dy", "0em");

                });
                g.select("text").transition()
                    .duration(this.duration)
                    .attr("dy", ".31em")
                    .attr("transform", function (d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price) + ")"; });



            }
        }
    );


}());
