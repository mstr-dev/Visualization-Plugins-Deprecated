(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3StackedBar = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3StackedBar',

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
                        .order("reverse"),
                    color = d3.scale.category10(),
                    that = this;


                stack(this.normalizedModel);
                var g = this.svg.selectAll(".symbol");

                //set up scales
                x = d3.scale.ordinal()
                    .domain(this.normalizedModel[0].values.map(function (d) { return d.date; }))
                    .rangeBands([0, w - 60], 0.1);

                y.domain([0, d3.max(this.normalizedModel[0].values.map(function(d) { return d.price + d.price0; }))]).range([h, 0]);

                // draw the bars
                g.each(function (p) {
                    var rects = d3.select(this).selectAll("rect")
                        .data(function (d) { return d.values; });

                    rects.attr("fill", color(p.key));

                    rects.enter().append("svg:rect")
                        .style("stroke", "#fff")
                        .style("fill", color(p.key));

                    rects.transition()
                        .duration(that.duration)
                        .attr("x", function(d) { return x(d.date); })
                        .attr("y", function(d) { return y(d.price0 + d.price); })
                        .attr("width", x.rangeBand())
                        .attr("height", function (d) { return h - y(d.price); });

                    var label = d3.select(this).select("text").text(p.key).attr("x", 12);
                    if (label.empty()) {
                        label =  d3.select(this).append("svg:text")
                            .attr("transform", function (d) { return "translate(" + (w - 60) + "," + h + ")"; })
                            .attr("x", 12)
                            .text(p.key);
                    }

                });
                g.select("text").transition()
                    .duration(this.duration)
                    .attr("dy", "1em")
                    .attr("transform", function (d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price + d.price0) + ")"; });
            }
        }
    );


}());
