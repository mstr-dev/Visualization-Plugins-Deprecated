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

                    postselectionChange: function (evt) {
                        var added = evt.added,
                            item = added && this.items[added[0]];
                        if (item) {
                            this.parent.model.changeSelectedVisType(item.s || '', item.vt, item.wtp || WTP_GRID);
                        }
                    }
                }
            ]
        }
    );
    mstrmojo.vi.ui.VizGallery = mstrmojo.plugins._VisBuilder.VisBuilderGallery;
}())