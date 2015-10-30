(function () {
    if (!mstrmojo.plugins.D3Flow) {
        mstrmojo.plugins.D3Flow = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.D3Flow.D3Flow = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            // Source Code: http://bl.ocks.org/d3noob/5028304 
            scriptClass: "mstrmojo.plugins.D3Flow.D3Flow",

            cssClass: "d3flow",

            errorDetails: "This visualization requires one or more attributes and one metric.",

           // externalLibraries: [{url: "http://d3js.org/d3.v3.min.js"}, {url: "../plugins/D3Flow/javascript/mojo/js/source/sankey.js"}, {url: "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"}],
            externalLibraries: [{url: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"}, {url: "https://rawgit.com/mstr-dev/Visualization-Plugins/master/D3Flow/javascript/mojo/js/source/sankey.js"}, {url: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"}],

            useRichTooltip: true,

            reuseDOMNode: true,

            plot: function () {
		var lMstrID = this.domNode.parentNode.parentNode.id;
		var lD3ID = "D3Flow-" + lMstrID;
		if( $('#' + lD3ID).length ) {
			$('#' + lD3ID).empty();
		}

                var mWidth = parseInt(this.domNode.style.width, 10),
                    mHeight = parseInt(this.domNode.style.height, 10);

                //Data Expected is an array of Objects key-value pairs like this:
                //  {links: [], nodes: []}
                // link items: {source: XXX, target: YYY, value: VVV}
                // nodes items: {name: XXX}

                // gridData.getRowTitles().size() // Nb Attributes
                //var lAttributeName = gridData.getRowTitles().getTitle(i).getName(); // Attrbiute Name
                var gridData = this.dataInterface;
                if (gridData.getRowTitles().size() <= 1) return;
                var mMyData = [];

                window.gridData = gridData;

                var lMetricName = gridData.getColHeaders(0).getHeader(0).getName();

                var lData_Links = [];

                // Build a Dictionary indicating for each attribute if values are renamed or not
                var mDictAttributes = {};
                for(var lAttrIdx = 0; lAttrIdx < gridData.getRowTitles().size(); lAttrIdx++) {
                    var lAttributeName = gridData.getRowTitles().getTitle(lAttrIdx).getName();
                    var lAttributeValues = gridData.getRowTitles().getTitle(lAttrIdx).getHeaderValues();

                    var lDictValues = {};
                    for(var lElementIdx = 0 ; lElementIdx < lAttributeValues.length; lElementIdx++) {
                        var lElement = lAttributeValues[lElementIdx]['n'];
                        var lValueNotFound = true;
                        for(var lAttrName in mDictAttributes) {
                            var lAttrDic = mDictAttributes[lAttrName];
                            for(var lElementNm in lAttrDic) {
                                var lElementNewName = lAttrDic[lElementNm];
                                if (lElementNewName == lElement) {
                                    lValueNotFound = false;
                                }
                            }
                        }
                        if (lValueNotFound) {
                            lDictValues[lElement]=lElement;
                        } else {
                            lDictValues[lElement]=lElement + '-' + lAttributeName + '-';
                        }
                    }
                    mDictAttributes[lAttributeName] = lDictValues;
                }
                for (var lSrcIdx = 0; lSrcIdx < (gridData.getRowTitles().size() - 1); lSrcIdx++) {
                    var lTrgtIdx = lSrcIdx + 1;
                    var lMoreLinks = [];
                    for (var i = 0; i < gridData.getTotalRows(); i++) {
                        var lNewLink = {};

                        var lAttribute_Src_Name = gridData.getRowTitles().getTitle(lSrcIdx).getName();
                        var lAttribute_Trgt_Name = gridData.getRowTitles().getTitle(lTrgtIdx).getName();

                        var lAttribute_Src = gridData.getRowHeaders(i).getHeader(lSrcIdx).getName();
                        var lAttribute_Trgt = gridData.getRowHeaders(i).getHeader(lTrgtIdx).getName();

                        var lMetricValue = gridData.getMetricValue(i, 0).getRawValue();

                        lNewSrcName = mDictAttributes[lAttribute_Src_Name][lAttribute_Src];
                        var lNewTrgtName = mDictAttributes[lAttribute_Trgt_Name][lAttribute_Trgt];

                        lNewLink['source'] = lNewSrcName;
                        lNewLink['target'] = lNewTrgtName;
                        lNewLink['value'] = lMetricValue;
                        lMoreLinks.push(lNewLink);
                    }

                    lData_Links = lData_Links.concat(lMoreLinks);
                }

                var mNodeNames = [];
                for(var lAttrName in mDictAttributes) {
                    var lAttrDic = mDictAttributes[lAttrName];
                    for(var lElementNm in lAttrDic) {
                        var lElementNewName = lAttrDic[lElementNm];
                        var lNode = {};
                        lNode['name'] = lElementNewName
                        mNodeNames.push(lNode);
                    }
                }
                mMyData['nodes'] = mNodeNames;

                // If 2 Links have the same source and target, sum the value and only keep one

                var lSummarisedArray = [];
                $.each(lData_Links, function(iIdx, iObj){
                    var lExistingPair = false;
                    $.each(lSummarisedArray, function(iIdx, iObjS){
                        if (iObj.source === iObjS.source && iObj.target === iObjS.target) {
                            iObjS.value = iObj.value + iObjS.value;
                            lExistingPair = true;
                        }
                    });
                    if (!lExistingPair) {
                        lSummarisedArray.push(iObj);
                    }
                });

                lData_Links = lSummarisedArray;

                mMyData['links'] = [].concat(lData_Links);
                // Add all default values
                window.mMyData = mMyData;

                //D3 Visualisation
                console.log('begin Visualisation Code');

               // $("#sankey-chart").remove();

                d3.select(this.domNode)
                    .attr("id", lD3ID)
                    .append("p")
                 //   .attr("id", "sankey-chart")
                var units = lMetricName;

                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                    width = mWidth - margin.left - margin.right,
                    height = mHeight - margin.top - margin.bottom;

                var formatNumber = d3.format(",.0f"),    // zero decimal places
                    format = function(d) { return formatNumber(d) + " " + units; },
                    color = d3.scale.category20();
// append the svg canvas to the page
                //var svg = d3.selectAll($('#' + lD3ID).toArray()).append("svg")
				//for some reason, upper selectAll does not work, replace it with select domNode
				var svg = d3.select(this.domNode).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
                var sankey = d3.sankey()
                    .nodeWidth(36)
                    .nodePadding(10)
                    .size([width, height]);

                var path = sankey.link();

// load the data

                graph = mMyData;
                window.data=graph;
                var nodeMap = {};
                graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
                graph.links = graph.links.map(function(x) {
                    return {
                        source: nodeMap[x.source],
                        target: nodeMap[x.target],
                        value: x.value
                    };
                });
                sankey
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .layout(32);
// add in the links
                var link = svg.append("g").selectAll(".link")
                    .data(graph.links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", path)
                    .style("stroke-linecap", "butt")
                    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                    .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
                link.append("title")
                    .text(function(d) {
                        return mstrmojo.string.decodeHtmlString(d.source.name) + " → " +
                            mstrmojo.string.decodeHtmlString(d.target.name) + "\n" + format(d.value); });

// add in the nodes
                var node = svg.append("g").selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"; })
                    .call(d3.behavior.drag()
                        .origin(function(d) { return d; })
                        .on("dragstart", function(e) {
console.log(this);
                            d3.event.sourceEvent.stopPropagation();
                            this.parentNode.appendChild(this); })
                        .on("drag", dragmove));

// add the rectangles for the nodes
                node.append("rect")
                    .attr("height", function(d) { return d.dy; })
                    .attr("width", sankey.nodeWidth())
                    .style("fill", function(d) {
                        return d.color = color(d.name.replace(/ .*/, "")); })
                    .style("stroke", function(d) {
                        return d3.rgb(d.color).darker(2); })
                    .append("title")
                    .text(function(d) {
                        return mstrmojo.string.decodeHtmlString(d.name) + "\n" + format(d.value); });

// add in the title for the nodes
                node.append("text")
                    .attr("x", -6)
                    .attr("y", function(d) { return d.dy / 2; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .attr("transform", null)
                    .text(function(d) { return mstrmojo.string.decodeHtmlString(d.name); })
                    .style("font-family", "arial")
                    .filter(function(d) { return d.x < width / 2; })
                    .attr("x", 6 + sankey.nodeWidth())
                    .attr("text-anchor", "start");

// the function for moving the nodes
                function dragmove(d) {
		console.log(d);
                    d3.select(this).attr("transform",
                        "translate(" + (
                            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                        ) + "," + (
                            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                        ) + ")");
                    sankey.relayout();
                    link.attr("d", path);
                }
                console.log('end');
                //IE SVG refresh bug: re-insert SVG node to update/redraw contents.
                // var svgNode = this.domNode.firstChild;
                // this.domNode.insertBefore(svgNode, svgNode);
            }
        }
    );
}());
//@ sourceURL=D3Flow.js