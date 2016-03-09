//*removing Vis Gallery
(function () {
    mstrmojo.requiresCls(
        "mstrmojo.vi.controllers.DocumentController",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderSaveAsDialog",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderSelectVizEditor",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog");
    var $VI = mstrmojo.vi;
    /**
     * Overwrites / extends mstrmojo.vi.controllers.DocumentController
     * new actions added - like save, save as, new and open for visualization
     * hide vis gallery by default
     */


    /**
     *
     * @param folderName: _VisBuilder
     * @param packageName: package.json
     * @returns {string}
     */
    function getPackageJson(folderName, packageName) {
        var styleSheets = document.styleSheets, path = "plugins/" + folderName + "/style/VisBuilderPage.css", size = styleSheets.length, i = 0, hrefToReturn = "",content = "", packageJson= null;
        for (i = size-1; i >= 0; i--) {//search web path for visbuilder/package.json
            var style = styleSheets[i];
            if (style.href && style.href.indexOf(path) > -1) {
                hrefToReturn = style.href;
                break;
            }
        }

        if (!hrefToReturn) {
            hrefToReturn = "../plugins/" + folderName + "/" +  packageName;
        }else{
            var end = hrefToReturn.indexOf("/style/VisBuilderPage.css");
            hrefToReturn = hrefToReturn.substr(0, end) + "/" +  packageName;
        }

        path = hrefToReturn+'?tstp='+ Date.now() ;
        if (path !== "") {
            if (mstrmojo.loadFileSync) {
                content = mstrmojo.loadFileSync(path);
            } else {
                content = mstrmojo.loadFile(path);
            }
        }

        try{
            packageJson = JSON.parse( content );
            //eval("packageJson = " + content);
        }catch (e){
            packageJson= {};
        }
        return packageJson;
    }

    function getSaveWindow(host) {
        var onOk = function () {
            var parameters = {taskId: 'VisExpSave'};
            parameters = host.vbGetSaveParameters(parameters);
            mstrApp.showWait({'message': 'Saving visualization, please wait'});
            mstrApp.serverRequest(parameters, {
                    success: function (res) {
                        mstrmojo.alert(res.name + ' has been saved: ' + res.sc);

                        var data ={},
                            VisBuilderGallery = mstrmojo.all.VisBuilderGallery;
                        data.c = res.sc;
                        data.d = host.vbGetDescription();
                        data.ma=host.vbGetMinAttributes();
                        data.mm=host.vbGetMinMetrics();
                        data.s = res.name;
                        data.scp=host.scope;
                        data.dz = data.c + "DropZones";
                        data.em = data.c+"EditorModel";//Add to support property API
                        data.wtp = "7";
                        mstrConfig.pluginsVisList[res.name]=data;
                        VisBuilderGallery.update();
                        VisBuilderGallery.vizList.refresh();
                        VisBuilderGallery.refresh();

                        if (data.s) {
                            mstrmojo.invalidateCls('mstrmojo.' + data.c);
                        }
                        if(data.dz){
                            mstrmojo.invalidateCls('mstrmojo.' + data.dz);
                        }
                        //force to reload property editor model files
                        if(data.em){
                            mstrmojo.invalidateCls('mstrmojo.' + data.em);
                        }

                        VisBuilderGallery.model.changeSelectedVisType(res.name , -1 , mstrConfig.pluginsVisList[res.name].wtp || "7", mstrConfig.pluginsVisList[res.name].dz);

                    },
                    complete: function () {
                        mstrApp.hideWait();
                    }
                }
            );
        };
        var onCancel = function () {
        };
        var buttonConfigs = {
            confirmBtn: {fn: onOk},
            cancelBtn: {fn: onCancel}
        };
        mstrmojo.confirm("Do you want to save code on server? This will affect all documents", buttonConfigs, {title: "Visualization editor"});
    }

    var gallery;

    function getSelectVizEditor() {
        var editor = mstrmojo.all.VisBuilderSelectVizEditor;

        //Modified for DE23690, save and save as work in open dialog
        if(editor) {
            editor.destroy();
        }

        return new mstrmojo.plugins._VisBuilder.ui.VisBuilderSelectVizEditor();
    }

    mstrmojo.plugins._VisBuilder.VisBuilderDocumentController = mstrmojo.declare(
        mstrmojo.vi.controllers.DocumentController,
        null,
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.VisBuilderDocumentController',
            start: function start(documentData) {

                // Create model...
                var model = new mstrmojo.vi.models.DocModel(documentData),
                    rootCtrl = this.rootCtrl;

                // Record the intial state id for "needToSave" check later
                model.lastSavedStid = model.stid || 0;

                // wire up controller and model...
                model.controller = this;

                // Initialize command manager.
                this.cmdMgr = new mstrmojo.vi.controllers.UICmdMgr({
                    controller: this,
                    model: model
                });
                this.cmdMgr.dataService = model.getDataService();

                // create, cache and add datasets panel to root...
                this.datasetsPanel = rootCtrl.setDatasetObjectsPanel(model.getDocDatasetsPanel());

                var visTransitionFactory = this.visTransitionFactory = new $VI.factories.VisualizationTransitionFactory(),
                    layoutXml = documentData.defn.root.layoutXML, galleryOpen = layoutXml ? !!layoutXml.go : true;

                //Removing Vis gallery

                // create visualization gallery...
                gallery = new $VI.ui.VizGallery({
                    model: model,
                    //visible: galleryOpen
                    visible: false
                });
                // and pass to root controller.
                rootCtrl.setGalleryView(gallery);

                // Create document view...
                var view = this.view = new $VI.ui.DocumentView({
                    controller: this,
                    model: model
                });

                // set the model after the view is ready so that the onmodelchange can be triggered.
                this.set('model', model);

                // add it to the root view...
                rootCtrl.setDocumentView(view);

                // Mark all disposables.
                this.addDisposable([ visTransitionFactory, model, gallery, view ]);
                // this.addDataset();
                gallery.vizList.singleSelect(0);
            },
            saveBeforeClosing: function (saveCB, target) {
                var fnDirectRun = function () {
                    if (saveCB && saveCB.success) {
                        saveCB.success();
                    }
                    if (saveCB && saveCB.complete) {
                        saveCB.complete();
                    }
                };
                fnDirectRun();
            },

            showSaveVisualization: function () {
                var host = window.currentVis;
                if (host.scriptClass === 'mstrmojo.plugins._VisBuilder.VisBuilderNew') {
                    this.showSaveAsVisualization();
                } else {
                    this.currentCodeTab.apply();
                    this.currentPropsTab.apply();
                    this.currentDZCodeTab.apply();
                    getSaveWindow(host);
                }

            },
            showSaveAsVisualization: function () {
                this.currentCodeTab.apply();
                this.currentPropsTab.apply();
                this.currentDZCodeTab.apply();
                var $ID = "saveAsVisBuilder",
                    saveAsViEditor = mstrmojo.all[$ID],
                    host = window.currentVis,
                    openCreateViEditor = function (names) {
                        if (saveAsViEditor) {
                            saveAsViEditor.set("usedName", names);
                            saveAsViEditor.set("host", host);
                        } else {
                            saveAsViEditor = new mstrmojo.plugins._VisBuilder.ui.VisBuilderSaveAsDialog({
                                usedName: names,
                                host: host
                            });
                        }
                        saveAsViEditor.open();
                    };
                var cb = {
                    success: function (res) {
                        openCreateViEditor(res.result.visNames);
                    },
                    failure: function (res) {
                        mstrmojo.alert(res.getResponseHeader('X-MSTR-TaskFailureMsg'));
                    }
                };
                mstrApp.serverRequest({
                    taskId: 'VisExpDefined'
                }, cb);
            },
            /**
             * Get Visualization Builder version Information
             */
            showVersion: function(){

                var versionInfoWindow = mstrmojo.all.VisBuilderVersionInfoDialog;
                if(! versionInfoWindow) {
                    var packageJson = getPackageJson("_VisBuilder", "package.json");
                    versionInfoWindow = new mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog(packageJson);
                    this.addDisposable(versionInfoWindow);
                }
                versionInfoWindow.open();
            },
            newVisualizationPlugin: function () {
                gallery.vizList.singleSelect(0);
            },
            openVisualizationPlugin: function () {
                getSelectVizEditor().open(gallery);
            },
            exportVisualization: function () {
                mstrmojo.form.send({ taskId: 'VisExport', sc: window.currentVis.scriptClass}, mstrConfig.taskURL, null, '_blank');
            },
            isDocChanged: function isDocChanged() {
                return false;
            }
        }
    );
    mstrmojo.vi.controllers.DocumentController = mstrmojo.plugins._VisBuilder.VisBuilderDocumentController;
}());
//@ sourceURL=VisBuilderDocumentController.js