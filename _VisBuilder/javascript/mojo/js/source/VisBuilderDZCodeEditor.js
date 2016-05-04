(function () {

    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel", "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor");

    /**
     * Class for custome drop zone code editor pane
     *
     * @class mstrmojo.plugins._VisBuilder.VisBuilderDZCodeEditor
     * @extends mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor
     */
    mstrmojo.plugins._VisBuilder.VisBuilderDZCodeEditor = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderDZCodeEditor",
            cssClass:'vb-code-editor vb-dzcode-editor',
            onVIUnitSelected: function onVIUnitSelected(targetUnit) {


                this._super(targetUnit);
                var editorModel = new mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel({
                                    hostId: targetUnit.getEditorModel().hostId,//host.vbReRender = true; to make visualization re-render
                                    //docModel: targetUnit.model, // not used for dzcodeeditormodel
                                    targetUnit:targetUnit
                                    }),
                contents = editorModel && editorModel.getEditorContents();

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
//@ sourceURL=VisBuilderDZCodeEditor.js
