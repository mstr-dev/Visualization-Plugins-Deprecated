(function () {
    // We need to define this code as plugin in mstrmojo object
    if (!mstrmojo.plugins.GoogleSankey) {
        mstrmojo.plugins.GoogleSankey = {};
    }
    // Visualization requires library to render, and in this
     mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );
    // Declaration of the visualization object
    mstrmojo.plugins.GoogleSankey.GoogleSankey = mstrmojo.declare(
        //We need to declare that our code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleSankey.GoogleSankey",
            cssClass: "GoogleSankey",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//www.google.com/jsapi"}],
            useRichTooltip: true,
            reuseDOMNode: true,
            plot: function () {
                var me = this,
                    model = new mstrmojo.models.template.DataInterface(me.model.data);
                if (model.getTotalRows() <= 0) {
                    this.displayError();
                    return;
                }
                google.load('visualization', '1', {
                    callback: function () {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'From');
                    data.addColumn('string', 'To');
                    data.addColumn('number', 'Value');

                    var mydata = {};
                    mydata=model.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS);
                    var metricName = model.getColHeaders(0).getHeader(0).getName();
                    var source =model.getRowTitles().titles[0].n;
                    var target = model.getRowTitles().titles[1].n;
                    for (i = 0; i < mydata.length; i++) {
                        var a=mydata[i][source];
                        var b=mydata[i][target];
                        var c= parseInt(mydata[i][metricName]["v"]);
                        data.addRow([a,b,c]);
                    }
                    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f','#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];

                    var options = {
                      sankey: {
                        node: {
                          colors: colors,
                          labelPadding: 2,
                          width: 10,
                          nodePadding: 80
                        },
                        link: {
                          colorMode: 'gradient',
                          colors: colors
                        }
                      }
                    };

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.Sankey(me.domNode);
                    chart.draw(data, options);

                    }, packages: ['sankey']
                });
            }
        })
}());