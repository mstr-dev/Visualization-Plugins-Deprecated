(function () {
    if (!mstrmojo.plugins._VisBuilder) {
        mstrmojo.plugins._VisBuilder = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

    var $decodeHtmlString = mstrmojo.string.decodeHtmlString;


    function getJSCode(code) {
        if (!code) {
            return "";
        }
        var bracketBegin = (code.indexOf('{') + 2),
            bracketEnd = (code.lastIndexOf('}') - (bracketBegin));
        code = code.substr(bracketBegin, bracketEnd);
        return code;
    }

    mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel= mstrmojo.declare(

        mstrmojo.vi.models.editors.CustomVisEditorModel,

        null,
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel',

            vbGetCustomPropertyCode: function vbGetCustomPropertyCode(){
                return $decodeHtmlString(getJSCode(String(this.getCustomProperty)));

            },
            vbSetCustomPropertyCode: function vbSetCustomPropertyCode( code){
                this.getCustomProperty = eval("(function (){ " + code + "})");
            }
        }
    );

    mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel.WIDGET_TYPE = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel.ENUM_LINE_STYLE =  mstrmojo.vi.models.editors.CustomVisEditorModel.ENUM_LINE_STYLE;
    mstrmojo.vi.models.editors.CustomVisEditorModel = mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel;
}());
//@ sourceURL=VisbuilderCustomPropertyEditorModel.js
