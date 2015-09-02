(function () {
    if (!mstrmojo.plugins.GoogleAnnotationChart) {
        mstrmojo.plugins.GoogleAnnotationChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChart",
            cssClass: "GoogleAnnotationChart",
            externalLibraries: [{url: "//www.google.com/jsapi"}],
            useRichTooltip: false,
            reuseDOMNode: true,
            draggable: true,        
            isDragValid: function isDragValid() {
                // US17907: Don't do anything for DnD here.
                return false;
            },    
            shouldDragBubble: function shouldDragBubble() {
                // US17907: Don't propagate DnD event to parent to prevent triggering DnD on UnitContainer.
                return true;
            },
            plot: function () {
                var me = this,
                    model = new mstrmojo.models.template.DataInterface(me.model.data);
                if (model.getTotalRows() <= 0) {
                    this.displayError();
                    return;
                }
                google.load('visualization', '1', {
                    callback: function () {
                        try {
                            var data = new google.visualization.DataTable(),
                                colHeaders = model.getColHeaders(0),
                                columnSize = model.getTotalCols(),
                                i,
                                j,
                                dataRows = [],
                                dataRow;
                            data.addColumn('date', model.getRowTitles().getTitle(0).getName());
                            for (i = 0; i < colHeaders.size(); i++) {
                                data.addColumn('number', colHeaders.getHeader(i).getName());
                            }
                            for (i = 0; i < model.getTotalRows(); i++) {
                                dataRow = [new Date(model.getRowHeaders(i).getHeader(0).getName())];
                                for (j = 0; j < columnSize; j++) {
                                    dataRow.push(model.getMetricValue(i, j).getRawValue());
                                }
                                dataRows.push(dataRow);
                            }
                            data.addRows(dataRows);
                            var annotatedchart = new google.visualization.AnnotationChart(me.domNode);
                            annotatedchart.draw(data);
                        } catch (e) {
                            this.displayError();
                        }
                    }, packages: ['annotationchart']
                });
            }
        })
}());
//@ sourceURL=GoogleAnnotationChart.js