(function () {
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderPropertiesEditorModel");

    /**
     * Class for properties editor pane
     *
     * @class mstrmojo.plugins._VisBuilder.VisBuilderVIBoxPropertiesEditor
     * @extends mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor
     */
    mstrmojo.plugins._VisBuilder.VisBuilderVIBoxPropertiesEditor = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxPropertiesEditor",
            cssClass: "VisBuilderVIBoxPropertiesEditor",
            onVIUnitSelected: function onVIUnitSelected(targetUnit) {
                this._super(targetUnit);
                var editorModel = new mstrmojo.plugins._VisBuilder.ui.VisBuilderPropertiesEditorModel({
                    hostId: targetUnit.getEditorModel().hostId,
                    docModel: targetUnit.model
                });
                var contents = editorModel && editorModel.getEditorContents();
                contents.forEach(function (child) {
                    child.slot = 'containerNode';
                });
                this.contents.addChildren(contents);
                this.generateToolbar();
                this.doLayout();
            }
        }
    );
}());