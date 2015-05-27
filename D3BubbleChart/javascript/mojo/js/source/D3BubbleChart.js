(function () {
    if (!mstrmojo.plugins.D3BubbleChart) {
        mstrmojo.plugins.D3BubbleChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.D3BubbleChart.D3BubbleChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3BubbleChart.D3BubbleChart",

            cssClass: "d3bubblechart",

            errorDetails: "This visualization requires one or more attributes and one metric.",

            externalLibraries: [{url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}],

            useRichTooltip: true,

            reuseDOMNode: true,

            plot: function () {

                var $DI = mstrmojo.models.template.DataInterface,
                    normalizedModel = (new $DI(this.model.data)).getRawData($DI.ENUM_RAW_DATA_FORMAT.TREE);

                var width = parseInt(this.width, 10),
                    height = parseInt(this.height, 10),
                    diameter = Math.min(width, height),
                    color = d3.scale.category20c(),
                    transitionDuration = 750,
                    resolveColor = function (key) {
                        this.colorMap = this.colorMap || {};

                        return (this.colorMap[key] = this.colorMap[key] || color(key));
                    };

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([diameter, diameter])
                    .padding(1.5);

                var getNodes = function getNodes(root) {
                        var classes = [];

                        function recurse(name, node) {
                            if (node.children) {
                                node.children.forEach(function (child) {
                                    recurse(name && name !== "root" ? name + ", " + node.name : node.name, child);
                                });
                            } else {
                                classes.push({packageName: name, className: node.name, value: Math.max(node.value, 0), formattedValue: node.formattedValue});
                            }
                        }

                        recurse(null, root);
                        return {children: classes};
                    },
                    decodeHTML = function decodeHTML(text) {
                        return text.replace(/&#(\d+);/g, function (match, dec) {
                            return String.fromCharCode(dec);
                        }).replace(/&amp;/g, '&');
                    };

                var svg = d3.select(this.domNode).select("svg");

                if (svg.empty()) {
                    svg = d3.select(this.domNode).append("svg")
                        .attr("class", "bubble");
                }

                svg.attr("width", width)
                    .attr("height", height);

                var g = svg.select("g");

                if (g.empty()) {
                    g = svg.append("g");
                }

                g.attr("transform", "translate(" + (width - diameter) / 2 + "," + (height - diameter) / 2 + ")");

                var node = g.selectAll(".node")
                    .data(bubble.nodes(getNodes(normalizedModel))
                        .filter(function (d) {
                            return !d.children;
                        }));

                var newNode = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + width / 2 + "," + height / 2 + ")";
                    })
                    .style("opacity", 0);


                node.exit().remove();

                node
                    .transition()
                    .duration(transitionDuration)
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
                    .style("opacity", 1);

                newNode.append("title");
                newNode.append("circle")
                    .style("fill", function (d) {
                        return resolveColor(d.packageName);
                    });
                newNode.append("text");

                node.select("title")
                    .text(function (d) {
                        return decodeHTML(d.packageName + ", " + d.className + ": " + d.formattedValue);
                    });

                node.select("circle")
                    .attr("r", function (d) {
                        return d.r;
                    })
                    .style("fill", function (d) {
                        return resolveColor(d.packageName);
                    });

                node.select("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        return decodeHTML(d.className).substring(0, d.r / 3);
                    });

                //IE SVG refresh bug: re-insert SVG node to update/redraw contents.
                var svgNode = this.domNode.firstChild;
                this.domNode.insertBefore(svgNode, svgNode);
            }
        }
    );
}());