(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3Area = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3Area',

            plot: function plot() {

                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    n = this.normalizedModel.length,
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear().range([h / n - 20, 0]),
//                    line = d3.svg.line()
//                        .interpolate("basis")
//                        .x(function (d) { return x(d.date); })
//                        .y(function (d) { return y(d.price); }),
                    area = d3.svg.area()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y1(function (d) { return y(d.price); })
                        .y0(h / n - 20),
                    axis = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y(h / n - 21),
                    color = d3.scale.category10(),
                    that = this;

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(this.normalizedModel, function (d) { return d.values[0].date; }),
                    d3.max(this.normalizedModel, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                var g = this.svg.selectAll(".symbol")
                    .attr("transform", function (d, i) { return "translate(0," + (i * h / n + 10) + ")"; });

                g.each(function (p) {
                    y.domain([0, p.maxPrice]);
                    var e = d3.select(this);

                    var path = e.selectAll(".area");

                    if (path.empty()) {
                        e.append("svg:path")
                            .attr("class", "area")
                            .attr("d", area(p.values))
                            .style("fill", function () { return color(p.key); });
                    }
                    path
                        .transition()
                        .duration(that.duration)
                        .style("fill", function () {return color(p.key); })
                        .attr("d", area(p.values));


                    var text = e.select("text");
                    if (text.empty()) {
                        e.append("svg:text")
                            .attr("x", 12)
                            .text(p.key)
                            .attr("dy", "0em")
                            .attr("transform", function () { return "translate(" + (w - 60) + "," + (h / n - 20) + ")"; });

                    }
                    text.text(p.key)
                        .transition()
                        .duration(that.duration)
                        .attr("transform", function () { return "translate(" + (w - 60) + "," + (h / n - 20) + ")"; });
                });

            }
        }
    );


}());
