(function () {
    if (!mstrmojo.plugins.D3Samples) {
        mstrmojo.plugins.D3Samples = {};
    }

    mstrmojo.requiresCls("mstrmojo.plugins.D3Samples.D3Base");

    mstrmojo.plugins.D3Samples.D3Bar = mstrmojo.declare(
        mstrmojo.plugins.D3Samples.D3Base,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3Samples.D3Bar',

            plot: function plot() {
                var w = parseInt(this.width, 10) - this.margins[1] - this.margins[3],
                    h = parseInt(this.height, 10) - this.margins[0] - this.margins[2],
                    x = d3.scale.ordinal(),
                    y = d3.scale.linear(),
                    color = d3.scale.category10(),
                    that = this;

                x.domain(this.normalizedModel.map(function(d) { return d.key; }))
                    .rangeRoundBands([0, w], 0.2);

                y.domain([0, d3.max(this.normalizedModel, function(d) {return d.sumPrice; })])
                    .rangeRound([0, h]);

                var bars = this.svg.selectAll("rect")
                    .data(this.normalizedModel);
                //update
                bars.style("fill", function(d) { return color(d.key); });
                // enter
                bars.enter().append("svg:rect")
                    .style("fill", function(d) { return color(d.key); });

                // exit
                bars.exit()
                    .transition()
                    .duration(this.duration)
                    .ease("exp")
                    .style("fill-opacity", 1e-6)
                    .attr("width", 0)

                    .remove();

                // transition animations
                bars.transition()
                    .duration(this.duration)
                    .ease("quad")
                    .attr("x", function (d) {  return x(d.key); })
                    .attr("y", function (d) { return h - y(d.sumPrice); })
                    .attr("width", x.rangeBand())
                    .attr("height", function (d) { return y(d.sumPrice); });

                var text = this.svg.selectAll("text")
                    .data(this.normalizedModel);

                text.enter().append("svg:text")
                    .text(function(d) { return d.key; })
                    .attr("x", function (d) {  return (x(d.key) + x.rangeBand() / 2); })
                    .attr("y", h)
                    .attr("text-anchor", "middle")
                    .attr("dy", "1.31em");

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
                    .text(function(d) { return d.key; })
                    .attr("x", function (d) {  return (x(d.key) + x.rangeBand() / 2); });

            }
        }
    );


}());
