(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.ui.CodeMirror", "mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel");
    /**
     * Class to generate content of Editor pane
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel
     * @extends mstrmojo.Container
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderCodeEditorModel = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel,
        null,
        {
            height: 1000,
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderCodeEditorModel",
            cssTxt: null, codeTxt: null,
            propertyTxt:null,
            alias:'CodeTab',
            apply: function () {
                var host = this.getHost(),
                    propertyEditorModel = host.edtModel;
                if (!this.codeTxt.isValid()) {
                    mstrmojo.alert("There is a error in javascript code");
                    return false;
                }
                host.vbSetJSCode(this.codeTxt.getValue());
                host.vbSetCSScode(this.cssTxt.getValue());
                propertyEditorModel.vbSetCustomPropertyCode(this.propertyTxt.getValue());
                host.vbReRender = true;

                //Update Visualization property editor Panel
                mstrmojo.all.VisBuilderDocLayoutViewer.getViPanel('propertiesPanel').onRender();

                this._super();
            },
            getContent: function getContent(results) {
                var host = this.getHost(),
                    propertyEditorModel = host.edtModel;
                this.codeTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: host.vbGetJSCode(),
                    mode: "javascript"});
                this.propertyTxt = new  mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: propertyEditorModel.vbGetCustomPropertyCode(),mode:"javascript"});
                this.cssTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: host.vbGetCSScode(), mode: "css"});
                results.push(this.getEditorGroup([new mstrmojo.Label({cssClass: "edt-title", text: "Style"}), this.cssTxt]));
                results.push(this.getEditorGroup([new mstrmojo.Label({cssClass: "edt-title", text: "Plot Code"}), this.codeTxt]));
                results.push(this.getEditorGroup([new mstrmojo.Label({cssClass: "edt-title", text: "Property Code"}), this.propertyTxt]));
                host.controller.currentCodeTab = this;
                return results;
            }});
}())
//@ sourceURL=VisBuilderCodeEditorModel.js