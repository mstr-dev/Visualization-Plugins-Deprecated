(function () {
    if (!mstrmojo.plugins.HighChartsSamples) {
        mstrmojo.plugins.HighChartsSamples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.HighChartsSamples.HighChartsBase");

    mstrmojo.plugins.HighChartsSamples.D3Donut = mstrmojo.declare(
        mstrmojo.plugins.HighChartsSamples.HighChartsBase,
        null,
        {
            scriptClass: 'mstrmojo.plugins.HighChartsSamples.D3Donut',

            plot: function plot() {
			debugger;
                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    color = d3.scale.category10(),
                    radius = Math.min(w, h) / 2,
                    pie = d3.layout.pie()
                            .value(function (d) { return d.sumPrice; }),
                    arc = d3.svg.arc()
                        .innerRadius(radius * 0.5)
                        .outerRadius(radius);

                var g = this.svg.select(".symbol")
                    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

                var donut = g.selectAll("path")
                    .data(pie(this.normalizedModel));


                donut.enter().append("svg:path")
                    .each(function(d) { this._current = d; })
                    .style("fill", function(d) {return color(d.data.key); })
                    .attr("d", arc);


                donut.exit()
                    .transition()
                    .duration(1000)
                    .style("fill-opacity", 1e-6)
                    .remove();

                donut.style("fill", function(d) {return color(d.data.key); })
                    .transition()
                    .duration(this.duration)
                    .attrTween("d", arcTween);

                var text = this.svg.selectAll("text")
                    .data(pie(this.normalizedModel));

                text.enter().append("svg:text")
                    .text(function(d) { return d.data.key; })
                    .attr("transform", function (d){ return "translate(" + w / 2 + "," + h / 2 + ")rotate(" + ((d.startAngle + d.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")translate("+ radius * 0.7 +")"})
                    .attr("text-anchor", "middle");

                // exit
                text.exit()
                    .transition()
                    .duration(this.duration)
                    .ease("exp")
                    .style("fill-opacity", 1e-6)
                    .remove();

                // transition animations
                text.transition()
                    .duration(this.duration)
                    .ease("linear")
                    .text(function(d) { return d.data.key; })
                    .attr("transform", function (d){ return "translate(" + w / 2 + "," + h / 2 + ")rotate(" + ((d.startAngle + d.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")translate("+ radius * 0.7+")"});

                // Store the displayed angles in _current.
                // Then, interpolate from _current to the new angles.
                // During the transition, _current is updated in-place by d3.interpolate.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = a;
                    return function(t) {
                        return arc(i(t));
                    };
                }

            }

        }
    );


}());
