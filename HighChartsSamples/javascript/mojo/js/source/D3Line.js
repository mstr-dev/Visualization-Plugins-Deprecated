(function () {
    if (!mstrmojo.plugins.HighChartsSamples) {
        mstrmojo.plugins.HighChartsSamples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.HighChartsSamples.D3Base");

    mstrmojo.plugins.HighChartsSamples.D3Line = mstrmojo.declare(
        mstrmojo.plugins.HighChartsSamples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.HighChartsSamples.D3Line',

            plot: function plot() {
                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    n = this.normalizedModel.length,
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear().range([h / n - 20, 0]),
                    color = d3.scale.category10(),
                    line = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) { return x(d.date); })
                        .y(function (d) { return y(d.price); });

                // Compute the minimum and maximum date across symbols.
                x.domain([
                    d3.min(this.normalizedModel, function (d) { return d.values[0].date; }),
                    d3.max(this.normalizedModel, function (d) { return d.values[d.values.length - 1].date; })
                ]);

                var g = this.svg.selectAll(".symbol")
                    .attr("transform", function (d, i) { return "translate(0," + (i * h / n + 10) + ")"; });

                g.each(function (d) {
                    var e = d3.select(this);
                    var circle = e.select("circle");
                    if (circle.empty()) {
                        e.append("svg:path")
                            .attr("class", "line");
                        e.append("svg:circle")
                            .attr("r", 5)
                            .style("fill", function (d) { return color(d.key); })
                            .style("stroke", "#000")
                            .style("stroke-width", "2px");
                        e.append("svg:text")
                            .attr("x", 12)
                            .attr("dy", ".31em")
                            .text(d.key);
                    }
                    circle.style("fill", function (d) { return color(d.key); });
                    e.select("text")
                        .attr("x", 12)
                        .text(d.key);
//                    e.append("svg:path")
//                        .attr("class", "line");
//
//                    e.append("svg:circle")
//                        .attr("r", 5)
//                        .style("fill", function (d) { return color(d.key); })
//                        .style("stroke", "#000")
//                        .style("stroke-width", "2px");
//
//                    e.append("svg:text")
//                        .attr("x", 12)
//                        .attr("dy", ".31em")
//                        .text(d.key);
                });

                function draw(k) {
                    g.each(function (d) {

                        var e = d3.select(this);
                        y.domain([0, d.maxPrice]);

                        e.select("path")
                            .attr("d", function (d) {
                                return line(d.values.slice(0, k + 1));
                            });

                        e.selectAll("circle, text")
                            .data(function (d) { return [d.values[k], d.values[k]]; })
                            .attr("transform", function (d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
                    });
                }

                var k = 1, n1 = this.normalizedModel[0].values.length;

                d3.timer(function () {
                    draw(k);
                    if ((k += 10) >= n1 - 1) {
                        draw(n1 - 1);
                        return true;
                    }
                });
            }
        }
    );


}());
