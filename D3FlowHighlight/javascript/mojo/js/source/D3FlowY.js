//Author: Ming Qin (https://github.com/QinMing) at Yahoo Inc.
//This file was based on Pradyut's code here: http://community.microstrategy.com/t5/MicroStrategy-Software/Integrating-3rd-party-javascript-visualizations-into-a/td-p/224128

/* global d3 */
/* global mstrmojo */
(function () {
  if (!mstrmojo.plugins.D3FlowHighlight) {
    mstrmojo.plugins.D3FlowHighlight = {};
  }
  mstrmojo.requiresCls("mstrmojo.Vis", "mstrmojo._LoadsScript");

  mstrmojo.plugins.D3FlowHighlight.D3FlowHighlight = mstrmojo.declare(
    mstrmojo.Vis, [mstrmojo._LoadsScript], {
      scriptClass: 'mstrmojo.plugins.D3FlowHighlight.D3FlowHighlight',

      markupString: '<div id="{@id}" style="top:{@top};left:{@left};position:absolute;overflow:hidden;"></div>',

      properties: {},

      postBuildRendering: function () {
        if (this._super) {
          this._super();
        }
        this.domNode.style.width = parseInt(this.width, 10) + 'px';
        this.domNode.style.height = parseInt(this.height, 10) + 'px';
        //if eg exists then we do not have data
        if (this.model.eg) {
          //displaying No data message
          this.domNode.innerHTML = this.model.eg;
        } else {
          //parsing properties
          this.properties = this.getProperties();
          this.loadScripts();
        }
      },

      loadScripts: function () {
        var externalLibraries = [
          {
            url: "http://d3js.org/d3.v3.min.js"
          },
          {
            url: "../plugins/D3FlowHighlight/javascript/mojo/js/source/sankey.js"
          },
          {
            url: "../plugins/D3FlowHighlight/javascript/mojo/js/source/sankey-driver.js"
          },
        ];
        var me = this;
        // load required external JS files and after that run renderGraph method
        this.requiresExternalScripts(externalLibraries, function () {
          me.renderGraph();
        });
      },

      /**
       * Reads properties from model
       * @returns properties
       */
      getProperties: function () {
        var prop = {};
        if (this.model && this.model.vp) {
          prop.tooltipStyle = this.model.vp.tooltipStyle;
          prop.numFormat = this.model.vp.numFormat;
          prop.precision = this.model.vp.precision;
        }
        return prop;
      },

      // useRichTooltip: true,
      // reuseDOMNode: true,
      errorDetails: "This visualization requires one or more attributes and one metric.",

      renderGraph: function (type) {

        var gridData = this.getDataParser();
        // var metricName = gridData.getColHeaders(0).getHeader(0).getName();//not needed
        var negValFound = false;
        var nodeDict = {};
        var data = {
          nodes: [],
          flows: [],
        };

        for (var i = 0; i < gridData.getTotalRows(); i++) {
          var value = gridData.getMetricValue(i, 0).getRawValue(); //getValue()
          if (value <= 0) {
            console.error(
              'Warning: negative value(s) in the metric. Assuming zero.'
            );
            if (!negValFound) {
              negValFound = true;
            }
            continue;
          }

          var f = {
            value: value,
            thru: [],
          };
          for (var j = 0; j < gridData.getRowTitles().size(); j++) {
            var attrTitle = gridData.getRowTitles().getTitle(j).getName();
            var attr = gridData.getRowHeaders(i).getHeader(j).getName();
            if (!attr || attr === '') {
              attr = ' ';
            }
            var name = attr + ' - ' + attrTitle;
            if (!nodeDict[name]) {
              var newnode = {
                name: name,
                disp: attr,
              };
              data.nodes.push(newnode);
              nodeDict[name] = newnode;
            }
            // f.thru.push(data.nodes.indexOf(nodeDict[name])); //both works
            f.thru.push(nodeDict[name]);
          }
          data.flows.push(f);
        }

        // data finally look like this
        // {
        //     nodes: [
        //       {
        //         "name": "node0",
        //         "disp": "Node Zero",
        //       }, {
        //         "name": "node1",
        //         "disp": "Node One",
        //       }
        //
        //       ......
        //
        //     ],
        //
        //     flows: [
        //       {
        //         value: 50,
        //         thru: [ "node0", "node1"] //name, or objects references
        //       }, {
        //         value: 30,
        //         thru: [ 0, 1, 2 ] //or even indices in the `nodes` array
        //       }
        //
        //       ......
        //
        //     ]
        // }

        var sz = {
          width: parseInt(this.domNode.style.width, 10),
          height: parseInt(this.domNode.style.height, 10),
        };
        var margin = {
          top: 10,
          left: 10,
          bottom: 25,
          right: 25,
        };
        var driver = new SankeyDriver();
        driver.prepare(d3.select(this.domNode), sz, margin, this.properties);
        driver.draw(data);
      }
    }
  );
}());
