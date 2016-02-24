(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3StackedArea = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3StackedArea',

            plot: function plot() {

                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear(),
                    line = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y(function (d) { return y(d.price0); }),
                    area = d3.svg.area()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y0(function (d) { return y(d.price0); })
                        .y1(function (d) { return y(d.price0 + d.price); }),
                    stack = d3.layout.stack()
                        .values(function (d) { return d.values; })
                        .x(function (d) { return d.date; })
                        .y(function (d) { return d.price; })
                        .out(function (d, y0, y) { d.price0 = y0; })
                        .order("reverse"),
                    color = d3.scale.category10(),
                    that = this;

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(this.normalizedModel, function (d) { return d.values[0].date; }),
                    d3.max(this.normalizedModel, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                stack(this.normalizedModel);

                var g = this.svg.selectAll(".symbol");

                y.domain([0, d3.max(this.normalizedModel[0].values.map(function (d) { return d.price + d.price0; }))])
                    .range([h, 0]);

                g.each(function (d) {

                    var e = d3.select(this);

                    if (e.select("path").empty()) {
                        e.append("svg:path")
                            .attr("class", "area")
                            .attr("d", area(d.values));

                        e.append("svg:text")
                            .attr("x", 12)
                            .attr("transform", function () { return "translate(" + (w - 60) + "," + h + ")"; })
                            .attr("dy", "0em");
                    }

                    e.select(".area").attr("fill", color(d.key));
                    e.select("text").text(d.key);

                });


                g.select("path.area")
                    .transition()
                    .duration(this.duration)
                    .attr("d", function (d) { return area(d.values); });

//                this.svg.select("line")
//                    .attr("class", "line")
//                    .attr("x1", 0)
//                    .attr("x2", w - 60)
//                    .attr("y1", h)
//                    .attr("y2", h);

                g.select("text")
                    .transition()
                    .duration(this.duration)
                    .attr("transform", function (d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

            }
        }
    );


}());
