(function (){

    if (!mstrmojo.plugins._VisBuilder) {
        mstrmojo.plugins._VisBuilder = {};
    }
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBase");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderDocumentController");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderDocumentView");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderDocLayoutViewer");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderGallery");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderDocModel");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderVIBoxAbstractEditor");
    mstrmojo.requiresCls("mstrmojo.vi.models.XtabDropZones");
    mstrmojo.requiresCls("mstrmojo.vi.models.BaseVisDropZones");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones");
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel");
    mstrmojo.requiresCls("mstrmojo.vi.ui.rw.Xtab","mstrmojo.plugins._VisBuilder.VisBuilderNew");
    mstrmojo.requiresCls("mstrmojo.List");


    mstrmojo.vi.models.XtabDropZones = mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones; //mstrmojo.vi.models.BaseVisDropZones;
    //mstrmojo.vi.models.XtabDropZones = mstrmojo.vi.models.CustomVisDropZones; //mstrmojo.vi.models.BaseVisDropZones;
    mstrmojo.vi.models.editors.BaseEditorModel = mstrmojo.plugins._VisBuilder.VisBuilderCustomPropertyEditorModel;
}());