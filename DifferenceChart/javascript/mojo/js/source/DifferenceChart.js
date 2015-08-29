(function () {
    if (!mstrmojo.plugins.DifferenceChart) {
        mstrmojo.plugins.DifferenceChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.DifferenceChart.DifferenceChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,

        null,

        {
            scriptClass: "mstrmojo.plugins.DifferenceChart.DifferenceChart",

            cssClass: "differencechart",

            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",

            errorDetails: "This visualization requires one or more attributes and one metric.",

            externalLibraries: [{url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}],

            useRichTooltip: false,

            reuseDOMNode: false,

            /**
             * A helper function to parse a string to Date.
             * Can be customized for other input.
             *
             * @param dateString {String} the source string to be parsed, e.g. "05/21/2015"
             * @returns {Date}
             */
            parseDate: function parseDate(dateString) {
                var FORMAT_MASK = "%m/%d/%Y";

                return d3.time.format(FORMAT_MASK).parse(dateString);

            },

            plot: function plot() {

                var $DI = mstrmojo.models.template.DataInterface,
                    normalizedModel = (new $DI(this.model.data)).getRawData($DI.ENUM_RAW_DATA_FORMAT.TREE),
                    z = normalizedModel.children,
                    z0 = (z[0] && z[0].children) || [],
                    z1 = (z[1] && z[1].children) || [],
                    length = Math.max(z0.length, z1.length),
                    ff = [];

                for (var i = 0; i < length; i++) {

                    ff.push({
                        a: i < z0.length ? z0[i].value : 0,
                        b: i < z1.length ? z1[i].value : 0,
                        date: this.parseDate(i < z0.length ? z0[i].name : z1[i].name)
                    })
                }

                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 50
                    },
                    width = parseInt(this.width, 10) - margin.left - margin.right,
                    height = parseInt(this.height, 10) - margin.top - margin.bottom;

                var x = d3.time.scale()
                        .range([0, width]),
                    y = d3.scale.linear()
                        .range([height, 0]),
                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom"),
                    yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left"),
                    line = d3.svg.area()
                        .interpolate("basis")
                        .x(function (d) {
                            return x(d.date);
                        })
                        .y(function (d) {
                            return y(d["a"]);
                        }),
                    area = d3.svg.area()
                        .interpolate("basis")
                        .x(function (d) {
                            return x(d.date);
                        })
                        .y1(function (d) {
                            return y(d["a"]);
                        }),
                    svg = d3.select(this.domNode).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                x.domain(d3.extent(ff, function (d) {
                    return d.date;
                }));

                y.domain([
                    d3.min(ff, function (d) {
                        return Math.min(d["a"], d["b"]);
                    }),
                    d3.max(ff, function (d) {
                        return Math.max(d["a"], d["b"]);
                    })
                ]);

                svg.datum(ff);

                svg.append("clipPath")
                    .attr("id", "clip-below")
                    .append("path")
                    .attr("d", area.y0(height));

                svg.append("clipPath")
                    .attr("id", "clip-above")
                    .append("path")
                    .attr("d", area.y0(0));

                svg.append("path")
                    .attr("class", "area above")
                    .attr("clip-path", "url(#clip-above)")
                    .attr("d", area.y0(function (d) {
                        return y(d["b"]);
                    }));

                svg.append("path")
                    .attr("class", "area below")
                    .attr("clip-path", "url(#clip-below)")
                    .attr("d", area);

                svg.append("path")
                    .attr("class", "line")
                    .attr("d", line);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("values");
            }
        })
}());
//@ sourceURL=DifferenceChart.js