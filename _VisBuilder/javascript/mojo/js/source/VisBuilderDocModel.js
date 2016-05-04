(function () {
    /**
     * Overwrites / extendsmstrmojo.vi.models.DocModel
     * dataset panel to be hidden getDocDatasetsPanel
     * auto adding attr and metrics but currently broken -updateDatasetsNOTUSED
     */
    var autoAdd = undefined;
    mstrmojo.requiresCls("mstrmojo.vi.models.DocModel");
    mstrmojo.plugins._VisBuilder.VisBuilderDocModel = mstrmojo.declare(
        mstrmojo.vi.models.DocModel,
        null,
        {
            updateDatasetsNOTUSED: function updateDatasets(datasets, datasetsSettings) {
                if (!autoAdd) {
                    autoAdd = (Object.keys(this.datasets).length === 0 && datasets && Object.keys(datasets).length === 1);
                }
                this._super(datasets, datasetsSettings);
                if (autoAdd) {
                    var controller = mstrApp.rootCtrl.docCtrl, datasetID = Object.keys(this.datasets)[0], dataset = this.datasets[datasetID];
                    setTimeout(function () {
                        var ds = dataset.att.concat(dataset.mx);
                        controller.model.getSelectedViUnit().getZonesModel().addUnitsFromDataSet(ds, datasetID);
                    }, 1);
                }
            },
            selectVIUnit: function selectVIUnit(id, forceSelection) {
                this._super(id, forceSelection);
            },
            getDocDatasetsPanel: function () {
                var panel = this._super();
                panel.set('visible', false);
                return panel;
            }
        }
    );
    mstrmojo.vi.models.DocModel = mstrmojo.plugins._VisBuilder.VisBuilderDocModel;
}())
//@ sourceURL=VisBuilderDocModel.js