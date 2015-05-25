(function () {
    if (!mstrmojo.plugins.MstrVisD3Cartogram) {
        mstrmojo.plugins.MstrVisD3Cartogram = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.MstrVisD3Cartogram.MstrVisD3Cartogram = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.MstrVisD3Cartogram.MstrVisD3Cartogram",

            cssClass: "mstrvisd3cartogram",

            errorDetails: "This visualization requires one or more attributes and one metric.",

            externalLibraries: [{url: "http://d3js.org/d3.v3.min.js"}, {url: "http://d3js.org/topojson.v1.min.js"}],

            reuseDOMNode: true,

            plot: function () {

                var $DI = mstrmojo.models.template.DataInterface,
                    normalizedModel = (new $DI(this.model.data)).getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS),
                    aggregatedModel = {},
                    i,
                    metricName = this.model.data.gsi.mx[0].n,
                    attributeName = this.model.data.gsi.rows[0].n,
                    transitionDuration = 500,
                    scale = 1.0,
                    translateX = 0,
                    translateY = 0,
                    min = 1,
                    max = 0,
                    key;


                for (i = 0; i < normalizedModel.length; i++) {
                    var stateName = normalizedModel[i][attributeName],
                        currentValue = parseFloat(normalizedModel[i][metricName].rv);

                    if (isNaN(currentValue)) {
                        currentValue = 0;
                    }

                    aggregatedModel[stateName] = (aggregatedModel[stateName] || 0) + Math.abs(currentValue);
                }

                //get min an max to reduce scaling effect
                for (key in aggregatedModel) {
                    var value = aggregatedModel[key];
                    min = Math.min(value, min);
                    max = Math.max(value, max);
                }

                var sizeState = d3.scale.linear().domain([min, max]);

                //get geo path for topoJSON rendering
                var path = d3.geo.path();

                var width = parseInt(this.width, 10),
                    height = parseInt(this.height, 10),
                    statesMap = {1: "Alabama", 2: "Alaska", 4: "Arizona", 5: "Arkansas", 6: "California", 8: "Colorado", 9: "Connecticut", 10: "Delaware", 11: "DC", 12: "Florida", 13: "Georgia", 15: "Hawaii", 16: "Idaho", 17: "Illinois", 18: "Indiana", 19: "Iowa", 20: "Kansas", 21: "Kentucky", 22: "Louisiana", 23: "Maine", 24: "Maryland", 25: "Massachusetts", 26: "Michigan", 27: "Minnesota", 28: "Mississippi", 29: "Missouri", 30: "Montana", 31: "Nebraska", 32: "Nevada", 33: "New Hampshire", 34: "New Jersey", 35: "New Mexico", 36: "New York", 37: "North Carolina", 38: "North Dakota", 39: "Ohio", 40: "Oklahoma", 41: "Oregon", 42: "Pennsylvania", 44: "Rhode Island", 45: "South Carolina", 46: "South Dakota", 47: "Tennessee", 48: "Texas", 49: "Utah", 50: "Vermont", 51: "Virginia", 53: "Washington", 54: "West Virginia", 55: "Wisconsin", 56: "Wyoming"};

                //insert/reuse main svg/g node
                var svg = d3.select(this.domNode).select("svg");

                if (svg.empty()) {
                    svg = d3.select(this.domNode).append("svg");
                }

                svg.attr("width", width)
                    .attr("height", height);

                var g = svg.select("g");

                if (g.empty()) {
                    g = svg.append("g");
                }

                //scale map based on 1X0.618 topo json aspect ratio
                if (height > width * 0.618) {
                    //container is taller, center vertically
                    scale = width / 900;
                    translateY = (height - (900 * 0.618 * scale)) / 2;
                } else {
                    //container is wider, center horizontally
                    scale = height / (900 * 0.618);
                    translateX = (width - (900 * scale)) / 2;
                }

                g.transition()
                    .duration(transitionDuration)
                    .attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");

                d3.json("../plugins/MstrVisD3Cartogram/data/us.json", function (error, us) {
                    var lands = g.selectAll(".land");

                    if (lands.empty()) {
                        g.append("path")
                            .datum(topojson.feature(us, us.objects.land))
                            .attr("class", "land")
                            .attr("d", path);
                    }

                    var states = g.selectAll(".state").data(topojson.feature(us, us.objects.states).features);

                    states.enter().append("path")
                        .attr("class", "state")
                        .attr("d", path);

                    states
                        .transition()
                        .duration(transitionDuration)
                        .attr("transform", function (d) {
                            var centroid = path.centroid(d),
                                x = centroid[0],
                                y = centroid[1];
                            return "translate(" + x + "," + y + ")"
                                + "scale(" + sizeState(aggregatedModel[statesMap[d.id]]) + ")"
                                + "translate(" + -x + "," + -y + ")";
                        });
                });
            }
        }
    );
}());