// Author: Ming Qin (https://github.com/QinMing)
// Copyright 2015 Yahoo Inc.
// This file is licensed under the MIT License. See LICENSE in the project root for terms

/*global d3*/

var SankeyDriver = function (){
  var sankey = d3.sankey();
  var formatNumber;//d3.format(",.2f");
  var color = d3.scale.category20c();
  var graph, width, height;
  //Caution: width and height must be kept outside of function draw()
  //to avoid closure issues in drag event handler
  var tooltips = [];
  var tooltipEnable = true;
  var tooltipContainer, tbody;

  this.prepare = function (canvas, sz, margin, props) {
    width = sz.width - margin.left - margin.right;
    height= sz.height - margin.top - margin.bottom;

    graph = canvas
      .html('')
      .append('svg')
        .attr("width", sz.width)
        .attr("height", sz.height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    tooltipContainer = canvas
      .append('div')
        .attr('id', 'tooltip-container');

    tbody = tooltipContainer
      .append('table')
        .attr('class', 'tooltip')
      .append('tbody');

    if (props){
      if (props.tooltipStyle === 'simple'){
        tooltipEnable = false;
      }

      if (!props.numFormat){
        props.numFormat = '';
      }

      if (props.precision){
        props.precision = '.' + props.precision;
      } else {
        props.precision = '';
      }
    }
    formatNumber = d3.format(',' + props.precision + props.numFormat);
  };

  this.draw = function (inputdata) {

    sankey
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    sankey.nodes(inputdata.nodes)
      .flows(inputdata.flows)
      .layout(32);

    drawNode(sankey.nodes());
    drawLink(sankey.links());

    function drawNode(nodes) {
      var group = graph.selectAll('g#node-group').data([0]);
      group.enter().append('g').attr("id", "node-group");
      var node = group.selectAll("g.node").data(nodes);
      node.exit().remove();

      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on("mouseover", funcMouseover)
        .on("mouseout", funcMouseout)
        .on('mousemove', funcMousemove)
        .on('dblclick', funcTooltipToggle)
        .call(d3.behavior.drag()
          .origin(function (d) {
            return d;
          })
          .on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            this.parentNode.appendChild(this);
          })
          .on("drag", function dragmove(d) {
            d3.select(this).attr("transform",
              "translate(" + (
                d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
              ) + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
              ) + ")");
            sankey.relayout();
            graph.select('g#normal').selectAll('path').attr("d", sankey.link());
            graph.select('g#highlight').selectAll('path').attr("d", sankey.link());
          })
        );
      nodeEnter.append("rect");//.append('title');
      nodeEnter.append("text");

      node
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node.select('rect')
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          if (!d.color){
            d.color = color(d.disp);
          }
          return d.color;
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        });
        // .select("title")
        // .text(function (d) {
        //   var text = formatNumber(d.value) + '\t' + d.disp;
        //   return text;
        // });

      node.select("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.disp;
        })
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
    }

    function drawLink(data) {
      var group = graph.selectAll('g#normal').data([0]);
      group.enter().insert("g", ":first-child").attr('id', 'normal');
      var link = group.selectAll('path.link').data(data);
      link.exit().remove();

      link.enter().append("path")
        .attr("class", "link")
        .on("mouseover", funcMouseover)
        .on("mouseout", funcMouseout)
        .on('mousemove', funcMousemove)
        .on('dblclick', funcTooltipToggle);
        // .append("title");

      link
        .attr("d", sankey.link())
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

      // link.select('title')
      //   .text(function (d) {
      //     var text = formatNumber(d.value) + '\t' +
      //       d.source.disp + " → " + d.target.disp;
      //     return text;
      //   });
    }

    function drawDLink(data) {
      return graph.insert("g", ":first-child")
        .attr('id', 'highlight')
        .selectAll('path')
        .data(data)
        .enter()
        .append("path")
          .attr("class", "link highlight")
          .attr("d", sankey.link())
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          })
          .sort(function (a, b) {
            return b.dy - a.dy;
          });
    }

    function funcMouseover(d) {
      sankey.dflows(d.flows);
      drawDLink(sankey.dlinks());
      updateTooltip(d);
      tooltipContainer.style('display', 'block');
    }
    function funcMouseout() {
      graph.selectAll("g#highlight").remove();
      tooltipContainer.style('display', 'none');
    }
    function funcMousemove() {
      tooltipContainer
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px');
    }
    function funcTooltipToggle(d){
      tooltipEnable = !tooltipEnable;
      updateTooltip(d);
    }

    ///////////////////////
    //// Tooltips

    function colorDot(d){
      return '<span style="background-color:'+ d.color +'"></span>';
    }

    sankey.nodes().forEach(function(n){
      n.tooltip = {
        name: colorDot(n) + n.disp,
        value: formatNumber(n.value),
        head: true,
      };
    });
    sankey.links().forEach(function(l){
      l.tooltip = {
        name: colorDot(l.source) + l.source.disp +
          " → " + colorDot(l.target) + l.target.disp,
        value: formatNumber(l.value),
        head: true,
      };
    });
    sankey.flows().forEach(function(f){
      var name = '';
      f.thru.forEach(function (n, ind) {
        if (ind !== 0) name += ' → ';
        name += colorDot(n) + n.disp;
      });
      f.tooltip = {
        name: name,
        value: formatNumber(f.value),
      };
    });

    //param d: data, could be node or link
    function updateTooltip(d){

      tooltips = [d.tooltip];
      if (tooltipEnable){
        d.flows.forEach(function(f){
          tooltips.push(f.tooltip);
        });
      }

      //no need to use D3
      tbody.selectAll('*').remove();
      tooltips.forEach(function(tip){
        var tr = tbody.append('tr');
        tr.append('td')
          .attr('class', 'name')
          .classed('head', 'head' in tip)
          .html(tip.name);

        tr.append('td')
          .attr('class', 'value')
          .classed('head', 'head' in tip)
          .html(tip.value);
      });
    }
  };
};
