(function () {
    mstrmojo.requiresCls("mstrmojo.vi.ui.VIBoxPropertyEditor");

    /**
     * Abstract class for pane content editors
     *
     * @class mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor
     * @extends mstrmojo.vi.ui.VIBoxPropertyEditor
     */

    mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor = mstrmojo.declare(
        mstrmojo.vi.ui.VIBoxPropertyEditor,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor",
            layoutConfig: {
                h: {
                    controlNode: '0px',
                    containerNode: '100%'
                },
                w: {
                    controlNode: '0px',
                    containerNode: 'all'
                },
                xt: true
            },
            onVIUnitSelected: function onVIUnitSelected(targetUnit) {
                this.set('title', '');
            },
            updateToolbar: function updateToolbar(cfg) {

            }
        }
    );
}());
//@ sourceURL=VisBuilderVIBoxAbstractEditor.js