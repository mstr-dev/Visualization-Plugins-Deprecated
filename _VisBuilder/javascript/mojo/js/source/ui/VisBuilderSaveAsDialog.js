(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.HTMLButton",
        "mstrmojo.HBox",
        "mstrmojo.Label",
        "mstrmojo.Editor",
        "mstrmojo.TextBox",
        "mstrmojo.CheckBox"
    );
    function validateValue() {
        var wind = this.parent.parent, definedNames = wind.usedName, definedNamesC = definedNames.length;
        if (this.changedTooltip === true) {
            this.set('tooltip', "Set visualization name");
            this.changedTooltip = false;
        }
        this.tooltip = this.tooltipOld;
        if (this.value.length > 3) {
            while (definedNamesC--) {
                if (definedNames[definedNamesC].toLowerCase() === (this.value).toLowerCase()) {
                    wind.btns.okbutton.set('enabled', false);
                    mstrmojo.css.addClass(this.domNode, "error");
                    this.set('tooltip', "Name already used");
                    this.changedTooltip = true;
                    return;
                }
            }
            if (this.value.indexOf(' ') > -1) {
                this.set('tooltip', "Name cannot have space in it");
                wind.btns.okbutton.set('enabled', false);
                mstrmojo.css.addClass(this.domNode, "error");
                this.changedTooltip = true;
                return;
            }
            wind.btns.okbutton.set('enabled', true);
            mstrmojo.css.removeClass(this.domNode, "error");
        } else {
            wind.btns.okbutton.set('enabled', false);
        }
    }

    function sendSaveAsRequest(editor) {
        editor.close();
        var newFolderName = editor.d1.nameBox.value, host = editor.host, params = {taskID: 'VisExpSaveAs'};
        params = host.vbGetSaveAsParameters(params, newFolderName);
        mstrApp.showWait({'message': 'Creating visualization, please wait'});
        mstrApp.serverRequest(params, {
            success: function (res) {
                mstrmojo.alert(res.name + ' created with class: ' + res.sc);
                var data ={};
                data.c = res.sc;
                data.d = host.vbGetDescription();
                data.ma=host.vbGetMinAttributes();
                data.mm=host.vbGetMinMetrics();
                data.s = res.name;
                data.scp=host.scope;
                mstrConfig.pluginsVisList[res.name]=data;
                mstrmojo.all.VisBuilderGallery.vizList.refresh();
                mstrmojo.all.VisBuilderGallery.refresh();

            },
            complete: function () {
                mstrApp.hideWait();
            }
        });

    }

    /**
     * Save As dialog box
     *
     * @class  mstrmojo.plugins._VisBuilder.ui.VisBuilderSaveAsDialog
     * @extends mstrmojo.Editor
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderSaveAsDialog = mstrmojo.declare(
        mstrmojo.Editor,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderSaveAsDialog",
            cssClass: 'mstrmojo-VisExpressCreateDialog',
            zIndex: 1000,
            defaultRight: 223,
            showButtonText: true,
            cssText: 'width :300px',
            usedName: [],
            host: {},
            title: "Save as new Visualization",
            init: function (props) {
                this._super(props);
            },
            onShowLink: function (alias) {
                var name = {
                    htmlCode: 'showLink',
                    showLink: 'htmlCode'
                };
                this.tabDock[name[alias]].set('selected', false);
            },
            showWait: mstrmojo.emptyFn,
            hideWait: mstrmojo.emptyFn,
            preBuildRendering: function preBuildRendering() {
                this._super();
            },
            onOpen: function () {
                this.clear();
            },
            clear: function () {
                this.d1.nameBox.set('value', '');
            },
            children: [
                {
                    scriptClass: "mstrmojo.ui.editors.controls.TwoColumnContainer",
                    alias: 'd1',
                    children: [
                        {
                            scriptClass: 'mstrmojo.Label',
                            cssClass: 'mstrmojo-VisExpressLabel',
                            text: 'Folder name:',
                            slot: 'col1Node'
                        },
                        {
                            scriptClass: "mstrmojo.TextBox",
                            alias: 'nameBox',
                            slot: 'col2Node',
                            tooltip: 'Set visualization name',
                            changedTooltip: false,
                            onkeyup: function () {
                                validateValue.call(this);
                            }
                        }
                    ]
                },
                {
                    scriptClass: "mstrmojo.HBox",
                    cssClass: "Editor-buttonBox",
                    alias: 'btns',
                    slot: "buttonNode",
                    children: [
                        {
                            scriptClass: "mstrmojo.HTMLButton",
                            cssClass: "mstrmojo-Editor-button",
                            iconClass: "mstrmojo-Editor-button-OK",
                            text: mstrmojo.desc(1442, "OK"),
                            enabled: false,
                            alias: 'okbutton',
                            onclick: function () {
                                sendSaveAsRequest(this.parent.parent);
                            }
                        },
                        {
                            scriptClass: "mstrmojo.HTMLButton",
                            cssClass: "mstrmojo-Editor-button",
                            iconClass: "mstrmojo-Editor-button-Close",
                            text: 'Cancel',
                            onclick: function () {
                                this.parent.parent.close();
                            }
                        }
                    ]
                }
            ]

        });
}());