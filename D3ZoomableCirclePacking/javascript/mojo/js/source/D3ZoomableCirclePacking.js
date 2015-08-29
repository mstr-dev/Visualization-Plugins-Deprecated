(function () {
    // We need to define this code as plugin in mstrmojo object
    if (!mstrmojo.plugins.D3ZoomableCirclePacking) {
        mstrmojo.plugins.D3ZoomableCirclePacking = {};
    }
    // Visualization requires library to render, and in this
    mstrmojo.requiresCls('mstrmojo.CustomVisBase');
    // Declaration of the visualization object
    mstrmojo.plugins.D3ZoomableCirclePacking.D3ZoomableCirclePacking = mstrmojo.declare(
        //We need to declare that our code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            //here scriptClass is defined as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.D3ZoomableCirclePacking.D3ZoomableCirclePacking',
            cssClass: 'zoomable-circle-packing',
            errorDetails: 'This visualization requires one or more attributes and one metric',
            useRichTooltip: true,
            reuseDOMNode: true,
            externalLibraries: [
                { url: 'http://d3js.org/d3.v3.min.js' }
            ],
            plot: function () {
                if (this.domNode.childNodes.length === 1) {
                    this.domNode.removeChild(this.domNode.childNodes[0]);
                }

                var root = this.dataInterface
                    .getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);

                var margin = 20,
                    padding = 2,
                    width = parseInt(this.width, 10),
                    height = parseInt(this.height, 10),
                    diameter = d3.min([width, height]);

                var color = d3.scale.linear()
                    .domain([0, depthCount(root)])
                    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
                    .interpolate(d3.interpolateHcl);

                var pack = d3.layout.pack()
                    .padding(padding)
                    .size([diameter - margin, diameter - margin])
                    .value(function (d) { return d.value; });

                var svg = d3.select(this.domNode)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + diameter / 2 + ')');

                var focus = root,
                    nodes = pack.nodes(root),
                    view;

                var circle = svg.selectAll('circle')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('class', function (d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'; })
                    .style('fill', function (d) { return d.children ? color(d.depth) : null; })
                    .on('click', function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

                svg.selectAll('text')
                    .data(nodes)
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .style('fill-opacity', function (d) { return d.parent === root ? 1 : 0; })
                    .style('display', function (d) { return d.parent === root ? null : 'none'; })
                    .text(function (d) { return d.name; });

                var node = svg.selectAll('circle, text');

                d3.select(this.domNode)
                    .on('click', function () { zoom(root); });

                zoomTo([root.x, root.y, root.r * 2 + margin]);

                function zoom(d) {
                    focus = d;

                    var transition = d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .tween('zoom', function (d) {
                            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                            return function (t) { zoomTo(i(t)); };
                        });

                    transition.selectAll('text')
                        .filter(function (d) { return d.parent === focus || this.style.display === 'inline'; })
                        .style('fill-opacity', function (d) { return d.parent === focus ? 1 : 0; })
                        .each('start', function (d) { if (d.parent === focus) this.style.display = 'inline'; })
                        .each('end', function (d) { if (d.parent !== focus) this.style.display = 'none'; });
                }

                function zoomTo(v) {
                    var k = diameter / v[2]; view = v;
                    node.attr('transform', function (d) { return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'; });
                    circle.attr('r', function (d) { return d.r * k; });
                }

                /**
                 * Counts JSON graph depth
                 * @param {object} branch
                 * @return {Number} object graph depth
                 */
                function depthCount(branch) {
                    if (!branch.children) {
                        return 1;
                    }
                    return 1 + d3.max(branch.children.map(depthCount));
                }

                d3.select(self.frameElement)
                    .style('height', diameter + 'px');
            }
        });
})();