(function () {

    mstrmojo.requiresCls("mstrmojo.Dialog",
        "mstrmojo.hash",
        "mstrmojo.vi.ui.editors.EditorGroup");

    var $NWB = mstrmojo.Button.newWebButton;


    function getVersionGroup(vLabel, vValue, vAlias ) {
        return new mstrmojo.TextBoxWithLabel({
            cssDisplay: 'block',
            cssClass: 'VersionPropertiesLine',
            slot: 'containerNode',
            label: vLabel,
            value: vValue,
            hint: vLabel,
            readOnly: true,
            alias: vAlias
        });
    }


    /**
     *
     *
     * @extends mstrmojo.Editor
     *
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog = mstrmojo.declare(

        mstrmojo.Editor,

        null,

        /**
         * @lends  mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog.prototype
         */
        {
            id: "VisBuilderVersionInfoDialog",

            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderVersionInfoDialog",

            title: "Visualization Builder", //mstrmojo.desc(*****, 'Visualization Builder'),

            cssClass : "mstrmojo-visbuilder-version",

            modal : true,

            visible : false,

            btnAlignment: 'right',

            packageJson : null,



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