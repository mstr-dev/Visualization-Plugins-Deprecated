(function () {
    /**
     * Clean up list of visualization on gallery - may not be needed anymore
     */
    mstrmojo.requiresCls("mstrmojo.vi.ui.VizGallery");
    var $MOJO = mstrmojo, $VIZ = $MOJO.vi.viz, $WIDGET_TYPES = $VIZ.EnumWidgetTypes, WTP_GRID = $WIDGET_TYPES.GRID, $VIZ_TEMPLATES = $VIZ.EnumVisualizationTemplates;
    mstrmojo.plugins._VisBuilder.VisBuilderGallery = mstrmojo.declare(
        mstrmojo.vi.ui.VizGallery,
        null,
        {
            id: "VisBuilderGallery",
            scriptClass: ' mstrmojo.plugins._VisBuilder.VisBuilderGallery',
            children: [
                {
                    scriptClass: 'mstrmojo.vi.ui.VizGalleryList',
                    slot: 'containerNode',
                    alias: 'vizList',
                    selectionPolicy: 'reselect',
                    items: [],
                    //TODO: to check in
                    type:2,//add to create custom visualization list instead of ootb, Jan 29th, 2016

                    postselectionChange: function (evt) {
                        var added = evt.added,
                            item = added && this.items[added[0]];
                        if (item) {
                            this.parent.model.changeSelectedVisType(item.s || '', item.vt, item.wtp || WTP_GRID,  item.dz);
                        }
                    }
                }
            ],

            postBuildRendering: function postBuildRendering() {
                // DE30732: Skip postBuildRendering() in VisGallery.js which updates the custom vis list.
                return mstrmojo.Container.prototype.postBuildRendering.call(this);
            },

            /**
             * update custom visualization list
             *
             */
            update: function update() {
                if (mstrApp.getRecentGallery) {
                    mstrApp.getRecentGallery();
                }

                /* This is causing unrendering and rendering of this.vizList node which results in loss of scroll properties of it.
                 *  So call updateScrollbars(true) again to render the scroll functionality*/
                this.vizList.set("items", [].concat(mstrmojo.vi.ui.VizGalleryList.getVizList(2)));// get custom visualization list

                //Detach event listeners to avoid any memory leak, as calling updateScrollbars() will register them again.
                this.cleanUpListeners();

                /*Passing "true" here to differentiate the call of updateScrollbars() btw default rendering scenario
                 * and this(on adding new custom visualization) scenario*/
                this.updateScrollbars(true);

            }


        }
    );
    mstrmojo.vi.ui.VizGallery = mstrmojo.plugins._VisBuilder.VisBuilderGallery;
}())
//@ sourceURL=VisBuilderGallery.js