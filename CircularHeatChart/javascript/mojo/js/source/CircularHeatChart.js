/*
Copyright (c) 2013, Peter Cook
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * The name Peter Cook may not be used to endorse or promote products
    derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL PETER COOK BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

(function () {
    if (!mstrmojo.plugins.CircularHeatChart) {
        mstrmojo.plugins.CircularHeatChart = {};
    }

    mstrmojo.requiresCls("mstrmojo.CustomVisBase");

    mstrmojo.plugins.CircularHeatChart.CircularHeatChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: 'mstrmojo.plugins.CircularHeatChart.CircularHeatChart',

            cssClass: "circularheatchart",

            errorDetails: "This visualization requires two attributes and one metric.",

            externalLibraries: [
                {url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}
            ],

            reuseDOMNode: true,

            plot: function plot() {

                var getArcData = function (d, r1, r2, segmentKey, fnGetValue, fnGetDisplay, fnSetSegmentLabel) {
                        var numSeg = d.values.length,
                            endAngle = 5.2359,
                            startAngle = 0,
                            len = endAngle / numSeg,
                            i,
                            data = [];

                        for (i = 0; i < numSeg; i++) {
                            var o = {},
                                segment = d.values[i];

                            o.startAngle = startAngle;
                            o.endAngle = len + startAngle;
                            startAngle += len;
                            o.value = fnGetValue(segment);
                            o.display = fnGetDisplay(segment);
                            o.innerRadius = r1;
                            o.outerRadius = r2;
                            if (fnSetSegmentLabel) {
                                fnSetSegmentLabel(o, segment);
                            }

                            data.push(o);
                        }
                        return data;
                    },
                    drawLine = function drawLine(containerGroup, segmentKey, metricKey, width, height) {
                        var w = width,
                            h = height,
                            x = d3.scale.linear().range([0, w - 20]),
                            y = d3.scale.linear().range([h - 20, 10]),
                            line = d3.svg.line()
                                .interpolate("basis")
                                .x(function (d, i) {
                                    return x(i);
                                })
                                .y(function (d) {
                                    return y(d[metricKey].rv);
                                });

                        // Compute the minimum and maximum date across symbols.
                        x.domain([0, this.normalizedModel[0].values.length]);

                        var g = containerGroup.selectAll(".radial"),
                            e = containerGroup.select('#line');

                        g.sort(function (a, b) {
                            return a.key !== segmentKey ? -1 : 1;
                        });

                        g.each(function (d, i) {

                            y.domain([0, d.maxPrice]);
                            e.append("svg:path")
                                .attr("class", "line-chart")
                                .style("fill", 'none')
                                .style("stroke-width", '3px')
                                .style("stroke", d.key === segmentKey ? '#c7f918' : '#7d9a14')
                                .attr("d", line(d.values));
                        });
                    },
                    showFill = function showFill(v, max, r, display) {
                        var k = v / max,
                            t0,
                            t1 = k * 2 * Math.PI,
                            clip = containerGroup.select('#clip rect'),
                            text = containerGroup.select('.centerLabel'),
                            i;

                        // Solve for theta numerically.
                        if (k > 0 && k < 1) {
                            t1 = Math.pow(12 * k * Math.PI, 1 / 3);
                            for (i = 0; i < 10; ++i) {
                                t0 = t1;
                                t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
                            }
                            k = (1 - Math.cos(t1 / 2)) / 2;
                        }
                        var h = 2 * r * k,
                            y = r - h;

                        clip.transition()
                            .duration(500)
                            .attr("y", y)
                            .attr("height", h);

                        containerGroup.select('.fill').attr('fill-opacity', 1);
                        text.text(display);
                    },
                    $DI = mstrmojo.models.template.DataInterface,
                    dataInterface = new $DI(this.model.data),
                    segmentKey = dataInterface.getRowTitles().getTitle(1).getName(),
                    metricKey = dataInterface.getColHeaders(0).getHeader(0).getName(),
                    //zones = this.zonesModel.getDropZones().zones,
                    attributesArray = dataInterface.getRowTitles().titles,
                    metricsArray = dataInterface.getColTitles().titles[0].es,
                    getNormalizedModel = function getNormalizedModel() {
                        var normalizedArray = [],
                            md = this.model.data,
                            key = md.gts.row[0].n,
                            data;

                        normalizedArray = dataInterface.getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS);

                        data = d3.nest()
                            .key(function (d) {
                                return d[key];
                            })
                            .entries(normalizedArray);

                        data.forEach(function (s) {
                            s.maxPrice = d3.max(s.values, function (d) {
                                return d[metricKey].rv;
                            });
                            s.minPrice = d3.min(s.values, function (d) {
                                return d[metricKey].rv;
                            });
                        });
                        return data;
                    };

                var duration = 750,
                    width = parseInt(this.width, 10),
                    height = parseInt(this.height, 10),
                    margins = [height * 0.125, width * 0.125, height * 0.125, width * 0.125];


                var tooltipDiv = d3.select("body").append("div")
                    .attr("class", "tooltip CircularHeatChartTooltip")
                    .style("opacity", 0);

                var getTooltipText = function(segment){
                    var content = "<div>"+"<table>";

                    attributesArray.forEach(function(zoneElement){
                        var zoneName = zoneElement.n;
                        if(segment[zoneName]){
                            content = content + "<tr><td><strong>"+ zoneName +":</strong></td>" +"<td><div>"+ segment[zoneName]+ "</div></td></tr>"
                        }
                    });
                    metricsArray.forEach(function(zoneElement){
                        var zoneName = zoneElement.n;
                        if(segment[zoneName]){
                            content = content + "<tr><td><strong>"+ zoneName +":</strong></td>" +"<td><div>"+  segment[zoneName].v + "</div></td></tr>"
                        }
                    });
                    content = content+ "</table></div>";

                    return content;
                };


                var svg = d3.select(this.domNode).select("svg");

                if (svg.empty()) {
                    svg = d3.select(this.domNode).append("svg:svg");
                }

                svg.attr("width", width)
                    .attr("height", height);

                var containerGroup = svg.select(".container");

                if (containerGroup.empty()) {
                    containerGroup = svg.append("svg:g")
                        .attr("class", 'container')
                        .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");
                }

                if (containerGroup.select(".fill").empty()) {
                    containerGroup.append('circle').attr('class', 'fill');
                    containerGroup.append('circle').attr('class', 'wall');
                    containerGroup.append("defs").append('svg:clipPath').attr('id', 'clip').append('rect').attr('id', 'clip-rect');
                    containerGroup.append('text').attr('class', 'centerLabel');
                }

                this.normalizedModel = getNormalizedModel.call(this);

                var g = containerGroup.selectAll("g")
                    .data(this.normalizedModel);



                g.enter().append("svg:g")
                    .attr("class", "radial");

                g.exit().remove();

                var w = parseInt(this.width, 10) - margins[1] - margins[3],
                    h = parseInt(this.height, 10) - margins[0] - margins[2],
                    x = d3.time.scale().range([0, w - 60]),
                    y = d3.scale.linear().range([h / 4 - 20, 0]),
                    //color = d3.scale.linear().range(['#4a5a11', '#c7f918']),
                    color = d3.scale.category20(),
                    radius = Math.min(w, h) / 2,
                    innerRadius = radius * 0.4,
                    that = this,
                    arc = d3.svg.arc();

                containerGroup.select('#clip rect')
                    .attr('width', function () {
                        return 0.6 * radius;
                    })
                    .attr('height', function () {
                        return 0.6 * radius;
                    })
                    .attr('x', function () {
                        return -0.3 * radius;
                    })
                    .attr('y', function () {
                        return -0.3 * radius;
                    });

                containerGroup.select('.fill')
                    .attr('r', function () {
                        return 0.3 * radius;
                    })
                    .style('fill', '#07a8f4')
                    .style("fill-opacity", 1e-6)
                    .attr('clip-path', 'url(#clip)')
                    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
                    .style("fill-opacity", 1);

                containerGroup.select('.wall')
                    .attr('r', function () {
                        return 0.3 * radius;
                    })
                    .style('fill', 'none')
                    .style('stroke-width', '1.5')
                    .style('stroke', '#07a8f4')
                    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

                containerGroup.select('.centerLabel')
                    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

                g.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

                g.each(function (d, i) {
                    var r = (radius - innerRadius) / that.normalizedModel.length;
                    var r1 = innerRadius + r * i;
                    var r2 = innerRadius + r * (i + 1);
                    var e = d3.select(this);
                    var donut = e.selectAll("path")
                        .data(getArcData(d, r1, r2, segmentKey, function (segment) {
                            return segment[metricKey].rv;
                        }, function (segment) {
                            return segment[metricKey].v;
                        }, function (o, segment) {
                            o.rad = d.key;
                            o.seg = segment[segmentKey];
                            o.segment = segment;
                        }));
                    //color.domain([d.minPrice, d.maxPrice]);
                    donut.enter().append("svg:path")
                        .style("stroke", '#242225')
                        .style("stroke-width", '2')
                        .attr("class", "slice")
                        .on('mouseover', function (s) {
                            showFill(s.value, d.maxPrice, 0.3 * radius, s.display);
                            //tip.show();
                            tooltipDiv.transition()
                                .duration(100)
                                .style("opacity", 1);
                            tooltipDiv.html(getTooltipText(s.segment))
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            tooltipDiv.transition()
                                .duration(200)
                                .style("opacity", 0);
                        });

                    donut.exit()
                        .transition()
                        .duration(200)
                        .style("fill-opacity", 1e-6)
                        .remove();

                    donut.style("fill", function (d) {
                        return color(d.value);
                    })
                        .style("fill-opacity", 1e-6)
                        .transition()
                        .duration(1000)
                        .style("fill-opacity", 1)
                        .attr("d", arc);

                    if (e.select('.radialLabel').empty()) {
                        e.append('svg:text').attr('class', 'radialLabel');
                    }

                    var text = e.select('.radialLabel')
                        .on("mouseover", function (d) {
                            if (containerGroup.select('#line').empty()) {
                                var group = containerGroup.append("svg:g")
                                    .attr('id', 'line');

                                drawLine.call(that, containerGroup, d.key, metricKey, width * 0.25, height * 0.1);

                            }

                            containerGroup.selectAll(".slice")
                                .filter(function (s) {
                                    return s.rad !== d.key;
                                })
                                .transition()
                                .style("opacity", 0.35);
                        })
                        .on("mouseout", function (d) {
                            containerGroup.select('#line').remove();

                            containerGroup.selectAll(".slice")
                                .filter(function (s) {
                                    return s.rad !== d.key;
                                })
                                .transition()
                                .style("opacity", 1);
                        });

                    // transition animations
                    text.transition()
                        .duration(duration)
                        .text(function (d) {
                            return mstrmojo.string.decodeHtmlString(d.key);
                        })
                        .attr("transform", "translate(" + -30 + "," + -1 * (r1 + r2) / 2 + ")")
                        .attr("text-anchor", "end");

                    if (i === that.normalizedModel.length - 1) {
                        var label = e.selectAll(".segLabel")
                            .data(getArcData(d, r2, r2 + 10, segmentKey, function (segment) {
                                return segment[segmentKey];
                            }, function (segment) {
                                return segment[metricKey].v;
                            }));

                        label.enter().append("svg:text").attr('class', 'segLabel')

                            .on("mouseover", function (d) {
                                containerGroup.selectAll(".slice")
                                    .filter(function (s) {
                                        return s.seg !== d.value;
                                    })
                                    .transition()
                                    .style("opacity", 0.35);
                            })
                            .on("mouseout", function (d) {
                                containerGroup.selectAll(".slice")
                                    .filter(function (s) {
                                        return s.seg !== d.value;
                                    })
                                    .transition()
                                    .style("opacity", 1);
                            });

                        // exit
                        label.exit()
                            .transition()
                            .duration(750)
                            .ease("exp")
                            .style("fill-opacity", 1e-6)
                            .remove();

                        // transition animations
                        label.transition()
                            .text(function (d) {
                                return mstrmojo.string.decodeHtmlString(d.value);
                            })
                            .attr("text-anchor", function (d) {
                                return (d.startAngle + d.endAngle) / 2 > Math.PI ? "end" : null;
                            })
                            .attr("transform", function (d) {
                                return "rotate(" + ((d.startAngle + d.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")translate(" + (r2 + 10) + ")"
                                    + ((d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : "");
                            });
                    } else {

                        e.selectAll(".segLabel").remove();
                    }

                });

            }
        }
    );
}());
//@ sourceURL=CircularHeatChart.js