(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.vi.models.editors.EditorModel");
    var M$L = mstrmojo.Label, M$H = mstrmojo.HBox;

    function getNoSupportedGUI() {
        return [this.getEditorGroup([new M$L({cssClass: "edt-title", text: ""})])];
    }

    function getUpdateGroup() {
        var me = this,
            validPointer = "mstrmojo.all." + me.id + ".valid";
        var button = mstrmojo.Button.newWebButton("Apply", function () {
            me.apply();
        }, true, {
            bindings: {
                enabled: validPointer
            },
            cssClass: 'ApplyButton'
        });

        return this.getEditorGroup(new M$H({cssText: "width:100%", children: [button]}));
    }

    /**
     * Abstract class for pane content for Code editor and properites tab
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel
     * @extends mstrmojo.vi.models.editors.EditorModel
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.EditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel",
            rerender: false,
            init: function (props) {
                this._super(props);
                window.currentVis = this.getHost();
            },
            apply: function () {
                if (this.getHost().vbReRender) {
                    this.getHost().renderVisualization();
                }
            },

            valid: true,
            getContent: function (results) {
                return results;
            },
            getEditorContents: function getEditorContents() {
                var host = this.getHost(), results = [];
                if (host && host.vbIsSupported && host.vbIsSupported()) {
                    results = [ getUpdateGroup.call(this)];
                    results = this.getContent(results);
                } else {
                    results = getNoSupportedGUI.call(this);
                }
                return results;
            }
        }
    );
}())