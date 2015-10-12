//Author: Ming Qin (https://github.com/QinMing) at Yahoo Inc.
//This file was forked from Mike Bostock's [D3 Sankey plugin](https://github.com/d3/d3-plugins/tree/master/sankey)
//which is licensed under the BSD License at https://github.com/mbostock/d3/blob/master/LICENSE

d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      flows = [],
      links = [],
      linkDict = {},
      dflows = [], //dynamic links
      dlinks = [],
      dlinkDict = {},
      ky = 0;

  sankey.nodeWidth = function(_) {
    if (!arguments.length) {
      return nodeWidth;
    }
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) {
      return nodePadding;
    }
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) {
      return nodes;
    }
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) {
      return links;
    }
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) {
      return size;
    }
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    computeDlinks();
    return sankey;
  };

  sankey.link = function() {
    var curvature = 0.5;

    function link(d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
      return "M" + x0 + "," + y0 +
             "C" + x2 + "," + y0 +
             " " + x3 + "," + y1 +
             " " + x1 + "," + y1;
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      // if (typeof source === "number") source = link.source = nodes[link.source];
      // if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
      var remainingNodes = nodes,
          nextNodes,
          x = 0;

      function pick_node(node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(push_if_didnt);
      }

      function push_if_didnt(link) {
          if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
          }
      }

      while (remainingNodes.length) {
          nextNodes = [];
          remainingNodes.forEach(pick_node);
          remainingNodes = nextNodes;
          ++x;
      }

      //
      moveSinksRight(x);
      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  function computeNodeDepths(iterations) {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= 0.99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
      ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach(function(link) {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }
  }

  function ascendingDepth(a, b) {
    return a.y - b.y;
  }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });
  }

  function ascendingSourceDepth(a, b) {
    return a.source.y - b.source.y;
  }

  function ascendingTargetDepth(a, b) {
    return a.target.y - b.target.y;
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  //////////////////////////////
  // The Flow API
  ////////////////////////////

  //will modify linkDict, links, flows
  sankey.flows = function(_) {
    if (!arguments.length) return flows;
    if (!nodes.length) console.error(
      'sankey.nodes() must be called before flows(). ' +
      'Or maybe matric has no positive value');
    flows = _;
    linkDict = {};

    flows.forEach(function (f, ind) {

      //normalize nodes in f.thru
      f.thru = f.thru.map(function (n) {
        if (typeof n === "object") {
          return n;
        } else if (typeof n === "number") {
          return nodes[n];
        } else if (typeof n === "string"){
          return nodes.filter(function(node){
            return node.name === n;
          })[0];
        } else {
          console.error('not supported node type');
          return null;
        }
      });

      //build index in nodes, pointing back to f
      f.thru.forEach(function (n) {
        if (!n.flows){
          n.flows = {};
        }
        n.flows[ind] = true;
      });

      //extract links
      for (var i = 0; i < f.thru.length - 1; i++) {
        var key = stPair(f.thru[i], f.thru[i + 1]);
        if (linkDict[key]) {
          linkDict[key].value += Number(f.value);
          linkDict[key].flows.push(f);
        } else {
          linkDict[key] = {
            source: f.thru[i],
            target: f.thru[i + 1],
            value: Number(f.value),
            flows: [f],
          };
        }

      }
    });
    nodes.forEach(function (n) {
      var sets = n.flows;
      n.flows = [];
      for (var i in sets){
        n.flows.push(flows[i]);
      }
    });

    links = [];
    for (var key in linkDict) {
      var l = linkDict[key];
      links.push(l);
    }

    return sankey;
  };

  //will modify dlinks
  sankey.dflows = function(_) {
    if (!arguments.length) {
      return dflows;
    }
    dflows = _;
    dlinkDict = {};
    dflows.forEach(function (f) {
      for (var i = 0; i < f.thru.length - 1; i++) {
        var key = stPair(f.thru[i], f.thru[i + 1]);
        if (dlinkDict[key]) {
          dlinkDict[key].value += Number(f.value);
        } else {
          dlinkDict[key] = {
            source: f.thru[i],
            target: f.thru[i + 1],
            value: Number(f.value),
            sy: linkDict[key].sy,
            ty: linkDict[key].ty,
          };
        }
      }
    });
    dlinks = [];
    for (var key in dlinkDict) {
      var l = dlinkDict[key];
      l.dy = l.value * ky;
      dlinks.push(dlinkDict[key]);
    }
    this.relayout();
    return sankey;
  };

  sankey.dlinks = function() {
    return dlinks;
  };

  function stPair(s, t) {
    if (typeof s === 'number') {
      return nodes[s].name + '|' + nodes[t].name ;
    } else if (typeof s === 'object') {
      return s.name + '|' + t.name;
    } else if (typeof s === 'string'){
      return s + '|' + t;
    } else {
      console.error('wrong type');
    }
  }

  //compute the starting and ending point (y) for each dynamic link
  function computeDlinks() {
    for (var k = dflows.length-1 ; k>=0; k--){
      var f = dflows[k];
      for (var i = 1; i < f.thru.length - 1; i++) {
        var center, commonBot, commonTop, ddy0, ddy1, dsy1, dty0, dy0, dy1, sy1,
          key0, key1, link0, link1, dlink0, dlink1, ty0;
        key0 = stPair(f.thru[i - 1], f.thru[i]);
        key1 = stPair(f.thru[i], f.thru[i + 1]);
        link0 = linkDict[key0];
        link1 = linkDict[key1];
        dlink0 = dlinkDict[key0];
        dlink1 = dlinkDict[key1];
        ty0 = link0.ty;
        dy0 = link0.dy;
        sy1 = link1.sy;
        dy1 = link1.dy;
        ddy0 = dlink0.dy;
        ddy1 = dlink1.dy;
        // compute the ideal position of both links on two sides
        commonTop = Math.max(ty0, sy1);
        commonBot = Math.min(ty0 + dy0, sy1 + dy1);
        center = (commonTop + commonBot) / 2;
        dty0 = center - (ddy0 / 2);
        dsy1 = center - (ddy1 / 2);
        // limit the position
        dty0 = Math.max(dty0, ty0);
        dty0 = Math.min(dty0, ty0 + dy0 - ddy0);
        dsy1 = Math.max(dsy1, sy1);
        dsy1 = Math.min(dsy1, sy1 + dy1 - ddy1);
        // set y
        dlink0.ty = dty0;
        dlink1.sy = dsy1;
        if (!dlink0.sy){
          dlink0.sy = link0.sy - (link0.ty - dlink0.ty);
        }
        dlink1.ty = link1.ty - (link1.sy - dlink1.sy);
      }
    }
  }
  return sankey;
};
