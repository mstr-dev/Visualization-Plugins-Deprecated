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


            //DE31333; refresh code mirror in code editor panel to rerender code mirror, to expand all code editor area
            //when open code editor panel
            doLayout: function doLayout() {
                // Is this panel currently hidden?
                if (!this.visible) {
                    // Do not perform doLayout, it will happen when we become visible.
                    return;
                }
                if(this.refreshTimes === 0){
                    this.refreshTimes = 1;
                    var panelContents = this.children && this.children[1],
                        editGroups = panelContents && panelContents.children,
                        $ARR = mstrmojo.array;

                    $ARR.forEach(editGroups, function(item){
                        var children = item && item.children,
                            len = children && children.length;
                        if(len >1){
                            var cm = children[1];
                            if((cm instanceof  mstrmojo.plugins._VisBuilder.ui.CodeMirror) && cm.refresh){
                                cm.refresh();
                            }
                        }
                    });
                }
                this._super();
            },


            onVIUnitSelected: function onVIUnitSelected(targetUnit) {
                if (mstrmojo.all.VisBuilder) {
                    mstrmojo.all.VisBuilder.destroy();
                }
                this.refreshTimes = 0 ;// change to default value DE31333

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
//@ sourceURL=VisBuilderVIBoxCodeEditor.js