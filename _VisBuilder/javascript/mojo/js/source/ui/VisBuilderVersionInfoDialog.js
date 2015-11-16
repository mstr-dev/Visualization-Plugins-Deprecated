(function () {

    mstrmojo.requiresCls("mstrmojo.Dialog",
        "mstrmojo.hash",
        "mstrmojo.vi.ui.editors.EditorGroup");

    var $H = mstrmojo.hash,
        $NWB = mstrmojo.Button.newWebButton;


    function getVersionGroup(vLabel, vValue, vAlias ) {
        var content = this.descField = new mstrmojo.TextBoxWithLabel({
            cssDisplay: 'block',
            cssClass: 'VersionPropertiesLine',
            label: vLabel,
            value: vValue,
            hint: vLabel,
            readOnly: true,
            alias: vAlias
        });
        return new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
            children: [content]
        }));
    }
    /**
     *
     *
     * @extends mstrmojo.Editor
     *
     */

    mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog = mstrmojo.declare(

        mstrmojo.Editor,

        [null],

        /**
         * @lends mstrmojo.vi.ui.VisBuilderVersionInfoDialog.prototype
         */
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog",

            title: "Visualization Builder", //mstrmojo.desc(*****, 'Visualization Builder'),

            cssClass : "mstrmojo-visbuilder-version",

            modal : true,

            visible : false,

            btnAlignment: 'right',

            packageJson : null,


            markupString: '<div id="{@id}" class="mstrmojo-Editor-wrapper">' +
            '<div class="mstrmojo-Editor {@cssClass}" style="z-index:{@zIndex};{@cssText}" mstrAttach:mouseup,mousedown,click,contextmenu>' +
            '{@titlebarHTML}' +
            '<div class="mstrmojo-Editor-content"></div>' +
            '<div class="mstrmojo-Editor-buttons"></div>' +
            '</div>' +
            '<div class="mstrmojo-Editor-curtain"></div>' +
            '</div>',

            titleMarkupString: '<div class="mstrmojo-Editor-title-container">' +
            '<div class="mstrmojo-Editor-title"></div>' +
            '<div class="edt-title-btn mstrmojo-Editor-help" tooltip="' + mstrmojo.desc(1143, "help") + '"></div>' +
            '<div class="edt-title-btn mstrmojo-Editor-close" tooltip="' + mstrmojo.desc(2102, "Close") + '"></div>' +
            '</div>' +
            '<div class="mstrmojo-Editor-titleSpacer"></div>',

            markupSlots: {
                editorNode: function editorNode() {
                    return this.domNode.firstChild;
                },
                titlebarNode: function titlebarNode() {
                    return this.showTitle ? this.domNode.firstChild.firstChild.firstChild : null;
                },
                titleNode: function titleNode() {
                    return this.showTitle ? this.domNode.firstChild.firstChild.firstChild : null;
                },
                helpNode: function helpNode() {
                    return this.showTitle ? this.domNode.firstChild.firstChild.children[1] : null;
                },
                closeNode: function closeNode() {
                    return this.showTitle ? this.domNode.firstChild.firstChild.lastChild : null;
                },
                containerNode: function containerNode() {
                    return this.domNode.firstChild.childNodes[2];
                },
                buttonNode: function buttonNode() {
                    return this.domNode.firstChild.childNodes[3];
                },
                curtainNode: function curtainNode() {
                    return this.domNode.lastChild;
                }
            },

            init: function init(props) {
                var that = this;
                this.packageJson =props;
                /*Set the buttons and the callbacks*/
                this.set("buttons", [
                    $NWB(mstrmojo.desc(2177, "Close"), function () {
                        that.close();
                    })
                ]);
                this._super();
            },
            postBuildRendering: function postBuildRendering() {

                var contents = this.getContent(this.packageJson);
                contents.forEach(function (child) {
                    child.slot = 'containerNode';
                });
                this.addChildren(contents );

                this._super();
            },

            /**
             *
             * @param param
             */
            /*
             {"version": "v1.0.0",
             "commit":"380938f82c3624b32938f7be846ce8edafc1e15a",
             "require":"10.2 or higher",
             "others":"JDK 1.6 or higher and Tomcat 6 or higher",
             "target_commitish": "master",
             "body": "Add version control",
             "draft": false,
             "prerelease": false
             }
             */
            getContent: function getContent(param){
                var results = [];
                if(param){
                    if(param.version){
                        results.push(getVersionGroup("Version Tag:",param.version,"Visualization Builder Version Tag"));
                    }
                    if(param.commit){
                        results.push(getVersionGroup("Commit:",param.commit,"Visualization Builder commit number"));
                    }
                    if(param.require){
                        results.push(getVersionGroup("MicroStrategy Version:",param.require,"require MicroStrategy product version"));
                    }
                    if(param.others){
                        results.push(getVersionGroup("Environments:",param.others,"Enviroments required"));
                    }
                }
                return results;
            }
        }
    );

}());
//@ sourceURL=VisBuilderVersionInfoDialog.js