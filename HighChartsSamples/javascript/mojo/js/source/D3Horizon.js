(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3Horizon = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3Horizon',

            plot: function plot() {

                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    n = this.normalizedModel.length,
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear().range([h / n - 20, 0]),
                    line = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y(function (d) { return y(d.price); }),
                    area = d3.svg.area()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y1(function (d) { return y(d.price); })
                        .y0(h / n - 20),
                    color = d3.scale.ordinal()
                        .range(["#c6dbef", "#9ecae1", "#6baed6"]),
                    that = this;

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(this.normalizedModel, function (d) { return d.values[0].date; }),
                    d3.max(this.normalizedModel, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                var g = this.svg.selectAll(".symbol")
                    .attr("transform", function (d, i) { return "translate(0," + (i * h / n + 10) + ")"; });


                g.each(function (d) {
                    var e = d3.select(this);
                    if (e.select("text").empty()){
                        e.append("svg:text")
                            .attr("x", 12)
                            .text(d.key)
                            .attr("transform", function (d) { return "translate(" + (w - 60) + "," + h + ")"; })
                            .attr("dy", "0em");
                    }
                    e.select("text").text(d.key)
                        .transition()
                        .duration(that.duration)
                        .attr("transform", function (d) { return "translate(" + (w - 60) + "," + (h / n - 20) + ")"; });
                });

                if (this.svg.selectAll("rect").empty()){
                    this.svg.insert("svg:defs", ".symbol")
                        .append("svg:clipPath")
                        .attr("id", "clip")
                        .append("svg:rect");
                }
                this.svg.selectAll("rect")
                    .transition()
                    .duration(this.duration)
                    .attr("width", w)
                    .attr("height", h / n - 20);



                g.attr("clip-path", "url(#clip)");

                g.each(function (d) {
                    y.domain([0, d.maxPrice]);

                    var paths = d3.select(this).selectAll(".area")
                        .data(d3.range(3));

                    paths.enter().insert("svg:path", ".line")
                        .attr("class", "area")
                        .attr("transform", function(d) { return "translate(0," + (d * (h / n - 20)) + ")"; })
                        .attr("d", area(d.values))
                        .style("fill", function(d, i) { return color(i); })
                        .style("fill-opacity", 1e-6);

                    y.domain([0, d.maxPrice / 3]);

                    d3.select(this).selectAll(".line").transition()
                        .duration(that.duration)
                        .attr("d", line(d.values))
                        .style("stroke-opacity", 1e-6);

                    d3.select(this).selectAll(".area").transition()
                        .duration(that.duration)
                        .style("fill-opacity", 1)
                        .attr("d", area(d.values))
                        .each("end", function() { d3.select(this).style("fill-opacity", null); });
                });

            }
        }
    );


}());
