(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.plugins._VisBuilder.ui.CodeMirror",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel",
        "mstrmojo.plugins._VisBuilder.DropZoneGUIEditor",
    "mstrmojo.plugins._VisBuilder.TemplateDropzones",
    "mstrmojo.Label");

    var $MOJO = mstrmojo,
        $HASH = $MOJO.hash;
    /**
     * Raise an event when model is edited.
     *
     * @param {Object} props optional
     */
    function raiseModelEditEvent(props) {
        this.raiseEvent($HASH.copy(props, {
            name: 'dropzoneEdit'
        }));
    }
    /**
     * Class to generate content of dropzone code Editor pane
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel
     * @extends mstrmojo.Container
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel,
        null,
        {
            height: 1000,
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel",
            //dropzoneTxt:null, //The code for the other four functions
            dropzones: null,  //zones object array []
            dropzoneGUI: null,

            shouldAllowObjectsInDropZoneTxt: null,
            getActionsForObjectsDroppedTxt:null,
            getActionsForObjectsRemovedTxt: null,
            getDropZoneContextMenuItemsTxt : null,

            alias:'DZCodeTab',


            apply: function () {
                var host = this.getHost(),
                    targetUnit = this.targetUnit,
                    dropzoneModel = targetUnit.getZonesModel();
                if (!this.shouldAllowObjectsInDropZoneTxt.isValid() || !this.getActionsForObjectsDroppedTxt.isValid() || !this.getActionsForObjectsRemovedTxt.isValid() || !this.getDropZoneContextMenuItemsTxt.isValid()) {
                    mstrmojo.alert("There is a error in javascript code");
                    return false;
                }

                if(dropzoneModel){
                    dropzoneModel.setDropZonesCode(this.dropzones);
                    dropzoneModel.setShouldAllowObjectsInDropZoneCode(this.shouldAllowObjectsInDropZoneTxt.getValue());
                    dropzoneModel.setGetActionsForObjectsDroppedCode(this.getActionsForObjectsDroppedTxt.getValue());
                    dropzoneModel.setGetActionsForObjectsRemovedCode(this.getActionsForObjectsRemovedTxt.getValue());
                    dropzoneModel.setGetDropZoneContextMenuItemsCode(this.getDropZoneContextMenuItemsTxt.getValue());
                }

                //Update Visualization Editor Panel
                mstrmojo.all.VisBuilderDocLayoutViewer.getViPanel('editPanel').onRender();

                host.vbReRender = false;
                this._super();

                //TODO: ClEAR drop zone data, when applying
                //dropzoneModel.clearAllDropZones(dropzoneModel.docModel.clearVisAsFilterAction(targetUnit));
            },

            getContent: function getContent(results) {
                var that = this,
                    dropzoneModel = that.targetUnit.getZonesModel(),
                    controller = that.getHost().controller;


                var getJSCode = function (code) {
                    if (!code) {
                        return "";
                    }
                    var bracketBegin = (code.indexOf('{') + 2),
                        bracketEnd = (code.lastIndexOf('}') - (bracketBegin));
                    code = code.substr(bracketBegin, bracketEnd);
                    return code;
                };


                if (dropzoneModel) {
                    this.dropzones = dropzoneModel.getCustomDropZones();

                    var templateDropzones = new mstrmojo.plugins._VisBuilder.TemplateDropzones(),
                        allowObjectTooltip = mstrmojo.string.decodeHtmlString(getJSCode(String(templateDropzones.shouldAllowObjectsInDropZone))),
                        objectDroppedTooltip = mstrmojo.string.decodeHtmlString(getJSCode(String(templateDropzones.getActionsForObjectsDropped))),
                        objectRemovedTooltip = mstrmojo.string.decodeHtmlString(getJSCode(String(templateDropzones.getActionsForObjectsRemoved))),
                        contextMenuTooltip = mstrmojo.string.decodeHtmlString(getJSCode(String(templateDropzones.getDropZoneContextMenuItems)));


                    this.dropzoneGUI = new mstrmojo.plugins._VisBuilder.DropZoneGUIEditor({model: that});
                    results.push(this.getEditorGroup([new mstrmojo.Label({
                        cssClass: "edt-title",
                        text: "Custom Zones"
                    }), this.dropzoneGUI]));
                    this.attachEventListener("dropzoneEdit", this.dropzoneGUI.id, "ondropzoneEdit");

                    this.shouldAllowObjectsInDropZoneTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({
                        value: dropzoneModel.getShouldAllowObjectsInDropZoneCode(),
                        mode: "javascript"
                    });
                    results.push(this.getEditorGroup([new mstrmojo.Label({
                        cssClass: "edt-title",
                        text: "shouldAllowObjectsInDropZone",
                        title: allowObjectTooltip
                    }), this.shouldAllowObjectsInDropZoneTxt]));

                    this.getActionsForObjectsDroppedTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({
                        value: dropzoneModel.getGetActionsForObjectsDroppedCode(),
                        mode: "javascript"
                    });
                    results.push(this.getEditorGroup([new mstrmojo.Label({
                        cssClass: "edt-title",
                        text: "getActionsForObjectsDropped",
                        title: objectDroppedTooltip
                    }), this.getActionsForObjectsDroppedTxt]));

                    this.getActionsForObjectsRemovedTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({
                        value: dropzoneModel.getGetActionsForObjectsRemovedCode(),
                        mode: "javascript"
                    });
                    results.push(this.getEditorGroup([new mstrmojo.Label({
                        cssClass: "edt-title",
                        text: "getActionsForObjectsRemoved",
                        title: objectRemovedTooltip
                    }), this.getActionsForObjectsRemovedTxt]));

                    this.getDropZoneContextMenuItemsTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({
                        value: dropzoneModel.getGetDropZoneContextMenuItemsCode(),
                        mode: "javascript"
                    });
                    results.push(this.getEditorGroup([new mstrmojo.Label({
                        cssClass: "edt-title",
                        text: "getDropZoneContextMenuItems",
                        title: contextMenuTooltip
                    }), this.getDropZoneContextMenuItemsTxt]));

                }
                controller.currentDZCodeTab = this;


                return results;
            },

            /**
             * Change threshold's order.
             *
             * @param {Number} scrIdx
             * @param {Number} dstIdx
             */
            moveZone: function moveZone(scrIdx, dstIdx) {
                var zones = this.dropzones,
                    dropzone = this.dropzones.splice(scrIdx, 1);

                this.dropzones = zones.slice(0, dstIdx).concat(dropzone, zones.slice(dstIdx, zones.length));

                raiseModelEditEvent.call(this);
            },


            deleteDropZone: function deleteDropZone(dropzone) {
                var dropzones = this.dropzones,
                    dropzoneIdx =dropzones.indexOf(dropzone);
                if (dropzoneIdx !== -1) {
                    this.dropzones.splice(dropzoneIdx, 1);
                }

                raiseModelEditEvent.call(this);
            },

            addZone: function addZone(zone, index){
                if(! this.dropzones || !this.dropzones.length){
                    this.dropzones = [];
                }
                if(index < this.dropzones.length){
                    this.dropzones[index] = zone;
                }else{
                    this.dropzones.push(zone);
                }
                raiseModelEditEvent.call(this);
            }
        });

}())
//@ sourceURL=VisBuilderDZCodeEditorModel.js