(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.Editor",
        "mstrmojo.vi.ui.VizGalleryList",
        "mstrmojo.plugins._VisBuilder.ui.VisBuilderGalleryList");
    function closeMe() {
        mstrmojo.all.VisBuilderSelectVizEditor.close();
    }

    var gallery;
    /**
     * Open / Select vizualization to edit window
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderSelectVizEditor
     * @extends mstrmojo.Editor
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderSelectVizEditor = mstrmojo.declare(
        mstrmojo.Editor,
        null,
        {
            id: "VisBuilderSelectVizEditor",
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderSelectVizEditor",
            cssClass: "mstrmojo-VIGallery VisBuilderSelectViz",
            zIndex: 990,
            showButtonText: true,
            usedName: [],
            title:'Open',
            open: function open(gal) {
                gallery = this.gallery = gal;
                this._super();
            },
            children: [
                {
                    scriptClass: 'mstrmojo.plugins._VisBuilder.ui.VisBuilderGalleryList',
                    slot: 'containerNode',
                    selectionPolicy: 'reselect',
                    items: [],
                    //TODO: to check in
                    type:2,//add to create custom visualization list instead of ootb, Jan 29th, 2016
                    postselectionChange: function (evt) {
                        var added = evt.added, item = added && this.items[added[0]];
                        gallery.vizList.singleSelect(item._renderIdx+1);
                        closeMe();
                    }

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
                            iconClass: "mstrmojo-Editor-button-Close",
                            text: 'Cancel',
                            onclick: function () {
                                closeMe();
                            }
                        }
                    ]
                }
            ]

        });
}());
//@ sourceURL=VisBuilderSelectVizEditor.js