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
            alias:'CodeTab',
            apply: function () {
                var host = this.getHost();
                if (!this.codeTxt.isValid()) {
                    mstrmojo.alert("There is a error in javascript code");
                    return false;
                }
                host.vbSetJSCode(this.codeTxt.getValue());
                host.vbSetCSScode(this.cssTxt.getValue());
                host.vbReRender = true;
                this._super();
            },
            getContent: function getContent(results) {
                var host = this.getHost();
                this.codeTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: host.vbGetJSCode(),
                    mode: "javascript"});
                this.cssTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: host.vbGetCSScode(), mode: "css"});
                results.push(this.getEditorGroup([new mstrmojo.Label({cssClass: "edt-title", text: "Style"}), this.cssTxt]));
                results.push(this.getEditorGroup([new mstrmojo.Label({cssClass: "edt-title", text: "Code"}), this.codeTxt]));
                window.currentCodeTab = this;
                return results;
            }});
}())