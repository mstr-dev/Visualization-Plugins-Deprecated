(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.array",
        "mstrmojo.plugins._VisBuilder.ui.CodeMirror",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel",
        "mstrmojo.plugins._VisBuilder.DropZoneGUIEditor",
        "mstrmojo.plugins._VisBuilder.TemplateDropzones",
        "mstrmojo.Label");

    var $MOJO = mstrmojo,
        $ARR = $MOJO.array,
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
            getActionsForObjectsDroppedTxt: null,
            getActionsForObjectsRemovedTxt: null,
            getDropZoneContextMenuItemsTxt: null,

            alias: 'DZCodeTab',


            apply: function () {
                var host = this.getHost(),
                    targetUnit = this.targetUnit,
                    dropzoneModel = targetUnit.getZonesModel();
                if (!this.shouldAllowObjectsInDropZoneTxt.isValid() || !this.getActionsForObjectsDroppedTxt.isValid() || !this.getActionsForObjectsRemovedTxt.isValid() || !this.getDropZoneContextMenuItemsTxt.isValid()) {
                    mstrmojo.alert("There is a error in javascript code");
                    return false;
                }

                var setDropZoneModel = function (target) {
                    if (dropzoneModel) {
                        dropzoneModel.setDropZonesCode(target.dropzones);
                        dropzoneModel.setShouldAllowObjectsInDropZoneCode(target.shouldAllowObjectsInDropZoneTxt.getValue());
                        dropzoneModel.setGetActionsForObjectsDroppedCode(target.getActionsForObjectsDroppedTxt.getValue());
                        dropzoneModel.setGetActionsForObjectsRemovedCode(target.getActionsForObjectsRemovedTxt.getValue());
                        dropzoneModel.setGetDropZoneContextMenuItemsCode(target.getDropZoneContextMenuItemsTxt.getValue());
                    }
                };


                var me = this,
                    templateActions = [],
                    w = targetUnit.boxContent,
                    key = targetUnit.k,
                    data = w.node.data,
                    widgetType = "7",
                    style = host.styleName;
                var isCustomDZ = function (dz) {
                    var DROP_ZONE_MAP = [
                            'XAxis',
                            'YAxis',
                            'BreakBy',
                            'SliceBy',
                            'ColorBy',
                            'SizeBy',
                            'AdditionalMetrics',
                            'AngleBy', // AngleBy
                            'Grp', // Grp
                            'Geo', // Geo
                            'layout', // layout
                            'from', // from
                            'to', // to
                            'itemsz', // itemsz
                            'Lat', // Lat
                            'Long' // Long
                        ],
                        result = true;

                    $ARR.forEach(DROP_ZONE_MAP, function (item) {
                        if (!dz[item]) {
                            result = false;
                        }
                    });
                    return result;
                };

                if (this.dropzones && !isCustomDZ(data.dz)) {
                    //DE35633, as CustomDropZone is null, we will used the grid type dropzones instead of CustomDropzone
                    //Thus we need to createDefaultDropZones with widgetType =7
                    //lend code from _VisAction.js

                    // Is a style specified?
                    if (style !== "") {//&& visDefinition.id !== $KNOWN_VIZ.UNKNOWN
                        // YES, make sure we have the appropriate drop zones created
                        templateActions.push({
                            "act": "updateTemplate",
                            "keyContext": w.k,
                            'actions': [{
                                act: 'createDefaultDropZones',
                                nodeKey: w.k,
                                treeType: w.defn.tt,
                                datasetId: data.datasetId,
                                datasetType: 3,
                                widgetType: widgetType,
                                partialUpdate: {
                                    nodes: [w.k]
                                }
                            }]
                        });
                    }

                    // Notify backend.
                    host.controller.submitUndoRedoUpdates(templateActions, null, {
                        success: function success(res) {
                            var currentLayoutKey = this.getCurrentLayoutKey(),
                                panel = this.getPanel();
                            // Copy new definition into old definition.
                            this.refreshDefinition(key, this.getRawLayoutUnitDefn(key, res.defn));
                            // Update the data cache.
                            this.updateDataCache(res.data, this.getTargetDefn(key));

                            //For VIsBuilder we can not selectVIUnit, as reselect will clear all dz editor panel information
                            // Re-build the viz box.  Note that we must re-find the box using the key we cached earlier.  The
                            // box passed via the vizBox parameter is no longer valid. (TQMS#899189)
                            //this.selectVIUnit(panel.rebuildChild(panel.getUnitByKey(key)).id, true);

                            var data,
                            //k = me.dataInterface.data.k,
                                findData = function (obj) {
                                    if (obj.k === key) {
                                        data = obj;
                                        return;
                                    }

                                    for (var n in obj) {
                                        if (obj[n] instanceof Array) {
                                            obj[n].forEach(function (child) {
                                                if (!data) {
                                                    findData(child);
                                                }
                                            });
                                        }
                                    }
                                };

                            findData(res.data);
                            host.model.data = data;
                            setDropZoneModel(me);
                            mstrmojo.all.rootView.documentView.layoutViewer.getViPanel('editPanel').refresh();
                            host.unrender();
                            host.render();
                        }.bind(targetUnit.model)
                    }, null);
                } else {
                    setDropZoneModel(this);
                }


                //Update Visualization Editor Panel
                // mstrmojo.all.VisBuilderDocLayoutViewer.getViPanel('editPanel').onRender();

                host.vbReRender = false;
                this._super();

                //TODO: ClEAR drop zone data, when applying
                //dropzoneModel.clearAllDropZones(dropzoneModel.docModel.clearVisAsFilterAction(targetUnit));
            },

            getContent: function getContent(results) {
                var that = this,
                    targetUnit = that.targetUnit,
                    dropzoneModel = targetUnit.getZonesModel(),
                    host = that.getHost(),
                    controller = host.controller;


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
                    dropzoneIdx = dropzones.indexOf(dropzone);
                if (dropzoneIdx !== -1) {
                    this.dropzones.splice(dropzoneIdx, 1);
                }

                raiseModelEditEvent.call(this);
            },

            addZone: function addZone(zone, index) {
                if (!this.dropzones || !this.dropzones.length) {
                    this.dropzones = [];
                }
                if (index < this.dropzones.length) {
                    this.dropzones[index] = zone;
                } else {
                    this.dropzones.push(zone);
                }
                raiseModelEditEvent.call(this);
            }
        });

}())
//@ sourceURL=VisBuilderDZCodeEditorModel.js