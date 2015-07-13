(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.D3BarChart) {
        mstrmojo.plugins.D3BarChart = {};
    }
    // All mojo visualization require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");

    /**
     * <p>Simple visualization using D3 library</p>
     * <p>Renders a bar chart for concatenated attributes and the first metric</p>
     * <p>Based on the D3 tutorial at http://bl.ocks.org/mbostock/3885304 created by Mike Bostock</p>
     * @class
     * @extends mstrmojo.CustomVisBase
     */
	// Declare the visualization object
    mstrmojo.plugins.D3BarChart.D3BarChart = mstrmojo.declare(
	    // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
	    scriptClass: 'mstrmojo.plugins.D3BarChart.D3BarChart',
	    // Define the CSS class that will be appended to container div
            cssClass: "d3barchart",
	    // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric.",
	    // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
	    // Define whether the DOM should be reused on data/layout change - no, reconstruct it from scratch
            reuseDOMNode: true,
	    // Define the external libraries to be used - in this sample. the D3 library
            externalLibraries: [
                {url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js"}
            ],
            /**
             * For more info on rendering a bar graph using D3, see http://bl.ocks.org/mbostock/3885304
             */
            plot: function () {
                if(this.domNode.childNodes.length===1){
                    this.domNode.removeChild(this.domNode.childNodes[0]);
                }

                var margin = {top: 10, right: 30, bottom: 50, left: 80},
                    width = parseInt(this.width,10) - margin.left - margin.right,
                    height = parseInt(this.height,10) - margin.top - margin.bottom;
                var chart = d3.select(this.domNode).append("svg").attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.1);


                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE),
                	metricName = this.dataInterface.getColHeaders(0).getHeader(0).getName(),
                	data = [];


				/*
					The dataInterface returns the data in a tree form to support multiple attributes in the ATTRIBUTES zone. The D3 Bar chart expects
					the data in a flat array so we need to post-process the data from tree to array.  In this process we concatenate the names of the attribute
					elements to form a single row.

					e.g  In the tree below, the "Bantam Books" entry would be displayed as "Books Bantam Books"

					{
					    "name":"root",
					    "children":
					    [
					        {
					            "name":"Books",
					            "children":
					            [
					                {
					                    "name":"Bantam Books",
					                    "value":160649.502,
					                    "formattedValue":"$160,
					                    650"
					                },
					                {
					                    "name":"John Wiley &amp; Sons",
					                    "value":204720.126,
					                    "formattedValue":"$204,
					                    720"
					                },
					            	...
					            ],
					        },
					        ....
					    ]
					}

				*/
				/**
					 * Utility function that unescapes HTML entities <,>,& and '.  D3 will re-escape them when creating it's DOM elements.
					 * @param {String} st
					 * @returns {String}
					 */
				var unescapeString = function(st) {
						return st.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&#039;/g, "\'");
					};
                /**
                 * Recursive function used to flatten raw data tree into an array. The output is appended to the 'data' array declared above.
                 *
                 * @param {Array} nodes Nodes to process
                 * @param {String} nodeName Name of the current node so far
                 */
			    var processRawData = function(nodes,nodeName) {
			        if ( nodes ) {
			            nodes.forEach(function(c) {
			            	if ( c.children ) {
			            		processRawData(c.children, nodeName + c.name + " " );
			            	} else {
					            data.push({
					                "name": unescapeString(nodeName + c.name),
					                "value" : c.value
					            });
			            	}
			            });
			        }
			    };

                // Begin processing the raw data with the children of the root node
				processRawData(rawData.children, "");

                x.domain(data.map(function (d) {
                    return d.name;
                }));

                var y = d3.scale.linear()
                    .range([height, 0]).domain([0, d3.max(data, function (d) {
                        return d.value;
                    })]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                chart.append("g")
                    .attr("class", "y axis")
                    .call(yAxis).append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(metricName);

                chart.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) {
                        return x(d.name);
                    })
                    .attr("y", function (d) {
                        return y(d.value);
                    })
                    .attr("height", function (d) {
                        return height - y(d.value);
                    })
                    .attr("width", x.rangeBand());
            }
        }
    );

    


}());
