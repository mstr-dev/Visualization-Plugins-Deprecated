(function () {

    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.ui.VisBuilderCodeEditorModel", "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor");

    /**
     * Class for code editor pane
     *
     * @class mstrmojo.plugins._VisBuilder.VisBuilderVIBoxCodeEditor
     * @extends mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor
     */
    mstrmojo.plugins._VisBuilder.VisBuilderVIBoxCodeEditor = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxCodeEditor",
            cssClass:'vb-code-editor',
            onVIUnitSelected: function onVIUnitSelected(targetUnit) {
                if (mstrmojo.all.VisBuilder) {
                    mstrmojo.all.VisBuilder.destroy();
                }

                this._super(targetUnit);
                var editorModel = new mstrmojo.plugins._VisBuilder.ui.VisBuilderCodeEditorModel({
                    hostId: targetUnit.getEditorModel().hostId,
                    docModel: targetUnit.model
                });
                var contents = editorModel && editorModel.getEditorContents();
                contents.forEach(function (child) {
                    // Set slot.
                    child.slot = 'containerNode';
                });
                this.contents.addChildren(contents);
                this.generateToolbar();
                this.doLayout();
            }
        }
    );
}());