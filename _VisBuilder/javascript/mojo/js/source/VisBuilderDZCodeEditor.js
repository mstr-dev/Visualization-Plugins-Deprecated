(function () {

    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel",
                            "mstrmojo.array",
                            "mstrmojo.plugins._VisBuilder.ui.CodeMirror",
                            "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor");

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

            //DE31333; refresh code mirror in DZ code editor panel to rerender code mirror, to expand all code editor area
            //when open dz code editor panel
            doLayout: function doLayout() {
                // Is this panel currently hidden?
                if (!this.visible) {
                    // Do not perform doLayout, it will happen when we become visible.
                    return;
                }

                if(this.refreshTimes === 0  ){
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


                this._super(targetUnit);
                this.refreshTimes = 0 ;// change to default value DE31333
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
