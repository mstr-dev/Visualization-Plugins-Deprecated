(function () {
    if (!mstrmojo.plugins.MstrVisD3Calendar) {
        mstrmojo.plugins.MstrVisD3Calendar = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.MstrVisD3Calendar.MstrVisD3Calendar = mstrmojo.declare(
        mstrmojo.CustomVisBase,

        null,

        {
            scriptClass: 'mstrmojo.plugins.MstrVisD3Calendar.MstrVisD3Calendar',

            cssClass: "mstrvisd3calendar",

            errorDetails: "This visualization requires one date attribute and one metric.",

            externalLibraries: [
                {url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}
            ],

            useRichTooltip: true,

            reuseDOMNode: true,

            plot: function () {

                var getNormalizedModel = function getNormalizedModel(data) {

                        var dataInterface = new mstrmojo.models.template.DataInterface(data),
                            rows = dataInterface.getTotalRows(),
                            i,
                            normalizedArray = [],
                            name,
                            m,
                            dateFormat = d3.time.format("%x");

                        if (rows <= 0) {
                            throw 'ERROR';
                        }

                        for (i = 0; i < rows; i++) {
                            name = dataInterface.getRowHeaders(i).getHeader(0).getName();
                            m = {};

                            m.date = dateFormat(dateFormat.parse(name));
                            m.value = dataInterface.getMetricValue(i, 0).getRawValue();
                            m.formattedValue = dataInterface.getMetricValue(i, 0).getValue();

                            normalizedArray.push(m);
                        }

                        return {
                            data: normalizedArray,
                            ranges: {
                                year: {
                                    min: d3.min(normalizedArray, function (d) {
                                        return dateFormat.parse(d.date).getFullYear();
                                    }),
                                    max: d3.max(normalizedArray, function (d) {
                                        return dateFormat.parse(d.date).getFullYear();
                                    })
                                },
                                values: {
                                    min: d3.min(normalizedArray, function (d) {
                                        return d.value;
                                    }),
                                    max: d3.max(normalizedArray, function (d) {
                                        return d.value;
                                    })
                                }
                            }
                        };
                    },
                    normalizedModel = getNormalizedModel(this.model.data);

                var width = parseInt(this.width, 10),
                    height = 136,
                    cellWidth = Math.floor(width / 56),
                    cellHeight = 17;// cell size

                var day = d3.time.format("%w"),
                    week = d3.time.format("%U"),
                    format = d3.time.format("%x");

                var color = d3.scale.quantize()
                    .domain([normalizedModel.ranges.values.min, normalizedModel.ranges.values.max])
                    .range(d3.range(11).map(function (d) {
                        return "q" + d + "-11";
                    }));

                var monthPath = function (t0) {
                    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                        d0 = +day(t0),
                        w0 = +week(t0),
                        d1 = +day(t1),
                        w1 = +week(t1);

                    return "M" + (w0 + 1) * cellWidth + "," + d0 * cellHeight
                        + "H" + w0 * cellWidth + "V" + 7 * cellHeight
                        + "H" + w1 * cellWidth + "V" + (d1 + 1) * cellHeight
                        + "H" + (w1 + 1) * cellWidth + "V0"
                        + "H" + (w0 + 1) * cellWidth + "Z";
                };

                var svg = d3.select(this.domNode).selectAll("svg")
                    .data(d3.range(normalizedModel.ranges.year.min, normalizedModel.ranges.year.max + 1));

                // TQMS# 956769 make sure to remove any SVG elements that are no longer in the selection
                svg.exit().remove();

                svg.enter().append("svg")
                    .attr("class", "RdYlGn")
                    .append("g")
                    .append("text")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        return d;
                    });

                // TQMS# 956805 set dimensions and transform of all SVG elements
                d3.select(this.domNode).selectAll("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .selectAll("g")
                    .attr("transform", "translate(" + ((width - cellWidth * 53) / 2) + "," + (height - cellHeight * 7 - 1) + ")")
                    .selectAll("text")
                    .attr("transform", "translate(-6," + cellHeight * 3.5 + ")rotate(-90)");

                var rect = svg.selectAll("g").selectAll(".day")
                    .data(function (d) {
                        return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
                    });

                // create any day boxes necessary
                rect.enter().append("rect")
                    .attr("class", "day")
                    .append("title")
                    .text(function (d) {
                        return format(d);
                    });

                // set the size and location of all day boxes based on the current width/height
                svg.selectAll("g").selectAll(".day")
                    .attr("width", cellWidth)
                    .attr("height", cellHeight)
                    .attr("x", function (d) {
                        return week(d) * cellWidth;
                    })
                    .attr("y", function (d) {
                        return day(d) * cellHeight;
                    });

                // create the paths for the months
                svg.selectAll("g").selectAll(".month")
                    .data(function (d) {
                        return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
                    })
                    .enter().append("path")
                    .attr("class", "month");

                // update the paths of new and existing months
                svg.selectAll("g").selectAll(".month").attr("d", monthPath);

                var data = d3.nest()
                    .key(function (d) {
                        return d.date;
                    })
                    .map(normalizedModel.data);

                rect.datum(format).filter(function (d) {
                    return d in data;
                })
                    .attr("class", function (d) {
                        return "day " + color(data[d][0].value);
                    })
                    .select("title")
                    .text(function (d) {
                        return d + ": " + data[d][0].formattedValue;
                    });
            }
        }
    );
}());