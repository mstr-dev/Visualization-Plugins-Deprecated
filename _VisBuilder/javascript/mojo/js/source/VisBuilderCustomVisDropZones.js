(function () {
    mstrmojo.requiresCls("mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.vi.models.BaseVisDropZones",
        "mstrmojo.array");

    var $decodeHtmlString = mstrmojo.string.decodeHtmlString;


    function getJSCode(code) {
        if (!code) {
            return "";
        }
        var bracketBegin = (code.indexOf('{') + 1),
            bracketEnd = (code.lastIndexOf('}') - (bracketBegin));
        code = code.substr(bracketBegin, bracketEnd);
        return code;
    }

    /**
     * Return custom Dropzones Code
     */
    function getDropZonesCode(dropzones) {
        if (!dropzones) {
            return "";
        }
        var code = " return [ \n ",
            zoneCode = "";

        mstrmojo.array.forEach(dropzones, function (dropzone, index) {
            if (!dropzone || !dropzone.name) {return;}

            if (index !== 0) {
                zoneCode = ", { \n"
            } else {
                zoneCode = "{ \n";
            }
            zoneCode = zoneCode.concat("name: ", "\'" + dropzone.name + "\'", ", \n");

            if (dropzone.maxCapacity) {
                zoneCode = zoneCode.concat("maxCapacity:", dropzone.maxCapacity, ", \n");
            }
            if (dropzone.title) {
                zoneCode = zoneCode.concat("title:", "\'" + dropzone.title + "\'", ", \n");
            }
            if (dropzone.allowObjectType) {
                zoneCode = zoneCode.concat("allowObjectType:", dropzone.allowObjectType, ", \n");
            }
            if (dropzone.disabled) {
                zoneCode = zoneCode.concat("disabled:", "\'" + dropzone.disabled + "\'", ", \n");
            }
            var end = zoneCode.lastIndexOf(',');
            zoneCode = zoneCode.slice(0, end).concat('\n }');

            code = code.concat(zoneCode);
        });

        return code.concat("\n ];");
    }




    /**
     * this class which holds and handles changes in plugin drop zone model, extends/overwrites definition of CustomVisDropZones;
     *
     *
     * @extends mstrmojo.vi.models.CustomVisDropZones,
     */
    mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {


            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones",

            vbReRender: false,
            pluginFolder: '',

            getClearAllUnitsActions: function getClearAllUnitsActions() {
                // TODO: Clear all not work in visualization builder, when visualization does not contain a custom dropzone
                //  DE27174    By default this function is overwritten in mstrmojo.vi.models.TemplateBasedDropZones, which clears the template's zones.
                //      Call its parent's function to clear all drop zones.
                var zones = this.getCustomDropZones();
                if(zones &&zones.length > 0){
                    return mstrmojo.vi.models.DropZonesModel.prototype.getClearAllUnitsActions.call(this);
                }else{
                    return mstrmojo.vi.models.TemplateBasedDropZones.prototype.getClearAllUnitsActions.call(this)
                }
            },

            init: function init(props) {
                this._super(props);
                this.pluginFolder = this.scriptClass.split(".")[2];
            },

            postBuildRendering:function () {
                return this._super();
            },

            vbIsSupported: function () {
                return true;
            },

            /**
             * return []dropzones
             */
            getDropZonesArray: function(){

                /*var code =  $decodeHtmlString(getJSCode(String(this.getCustomDropZones))),
                    zones = [],
                    bracketBegin = code.indexOf('[') ,
                    bracketEnd = code.lastIndexOf(']') - bracketBegin +1 ;
                code = code.substr(bracketBegin, bracketEnd);

                try  {
                    zones = eval(""+code+"");
                }
                catch(exception) {
                    zones = [];
                }
                return zones;*/
                return this.getCustomDropZones();
            },
            /**
             *
             * @param dropzones Array
             */
            setDropZonesCode: function(dropzones){
                var code = getDropZonesCode(dropzones);
                this.getCustomDropZones = eval("(function (){ " + code + "})");
            },

            getGetCustomDropZonesCode:function(){
                return $decodeHtmlString(getJSCode(String(this.getCustomDropZones)));
            },

            getGetDropZoneContextMenuItemsCode: function(){
                return $decodeHtmlString(getJSCode(String(this.getDropZoneContextMenuItems)));
            },

            setGetDropZoneContextMenuItemsCode: function(code){
                this.getDropZoneContextMenuItems = eval("(function (cfg, zone, object, el){ " + code + "})");
            },

            getGetActionsForObjectsRemovedCode: function(){
                return $decodeHtmlString(getJSCode(String(this.getActionsForObjectsRemoved)));
            },

            setGetActionsForObjectsRemovedCode: function(code){
                this.getActionsForObjectsRemoved = eval("(function (zone, objects){ " + code + "})");
            },

            getGetActionsForObjectsDroppedCode: function(){
                return $decodeHtmlString(getJSCode(String(this.getActionsForObjectsDropped)));
            },

            setGetActionsForObjectsDroppedCode: function(code){
                this.getActionsForObjectsDropped = eval("(function (zone, droppedObjects, idx, replaceObject, extras){ " + code + "})");
            },

            getShouldAllowObjectsInDropZoneCode:function(){
                return $decodeHtmlString(getJSCode(String(this.shouldAllowObjectsInDropZone)));
            },

            setShouldAllowObjectsInDropZoneCode:function(code){
                this.shouldAllowObjectsInDropZone = eval("(function (zone, dragObjects, idx, edge, context){ " + code + "})");
            }

        }
    );
    mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones.ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;//Add this to avoid ENUM_ALLOW_DROP_TYPE is covered
    mstrmojo.vi.models.CustomVisDropZones =  mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones;
    mstrmojo.vi.models.BaseVisDropZones = mstrmojo.plugins._VisBuilder.VisBuilderCustomVisDropZones;
}());
//@ sourceURL=VisBuilderCustomVisDropZones.js