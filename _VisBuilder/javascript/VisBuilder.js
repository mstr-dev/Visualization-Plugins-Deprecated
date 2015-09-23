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
    mstrmojo.requiresCls("mstrmojo.vi.ui.rw.Xtab","mstrmojo.plugins._VisBuilder.VisBuilderNew");
    mstrmojo.requiresCls("mstrmojo.List");

    var newList = {}, key;
    newList.VisBuilderNew = {c: "plugins._VisBuilder.VisBuilderNew",d: "New Visualization",s: "VisBuilderNew"};
    for(key in mstrConfig.pluginsVisList){
        if (mstrConfig.pluginsVisList.hasOwnProperty(key)) {
            var vis = mstrConfig.pluginsVisList[key], path=vis.c.split('.');
            /*
            * Lets check path to see if plugin is valid for edition
            * if path has 3 elements
            * if first element is plugins
            * if folder and js name is same - editor requires that
            * */
            if(path.length!==3 || path[0]!=="plugins" || path[1]!==path[2]){
                continue;
            }
            /*
            * Path is correct, lets load code to do more checks:
            * if visualization extends CustomVisBase
            * if plot function is present
            * if plot function does not uses this._super - this breaks editor
            */
            if(mstrmojo.loader.load("mstrmojo."+vis.c)){
               var pseudoObj = mstrmojo[path[0]][path[1]][path[2]].prototype,
                   instanceCheck = pseudoObj instanceof mstrmojo.CustomVisBase,
                   plotCheck =(pseudoObj.hasOwnProperty('plot') && (String(pseudoObj.plot)).indexOf('superwrap') ===-1);
                if(instanceCheck && plotCheck){
                    newList[key]=vis;
                }
            }
        }
    }
    mstrConfig.pluginsVisList =newList;
    mstrmojo.vi.models.XtabDropZones = mstrmojo.vi.models.BaseVisDropZones;
}());