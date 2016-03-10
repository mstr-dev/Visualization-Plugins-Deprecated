(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins._VisBuilder) {
        mstrmojo.plugins._VisBuilder = {};
    }

    // Import the necessary library.
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    var $ARR = mstrmojo.array;



    /**
     * <p>Simple drop zone model for visualization using D3 library</p>
     * <p>Defined the drop zones displayed in drop zone panel.</p>
     * @class mstrmojo.plugins.D3BubbleChart.D3BubbleChartDropZones
     * @extends mstrmojo.vi.models.CustomVisDropZones
     */
        // Declare the visualization drop zones model object
    mstrmojo.plugins._VisBuilder.TemplateDropzones= mstrmojo.declare(
        // Declare that this code extends CustomVisDropZones
        mstrmojo.vi.models.CustomVisDropZones,

        null,

        {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins._VisBuilder.TemplateDropzones',

            getCustomDropZones: function getCustomDropZones() {

                return [
                    {
                        name: "Package",
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        maxCapacity: 1,
                        allowObjectType: 1,
                        disabled: false
                    }, {
                        name: 'Class',
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        allowObjectType: 1,
                        disabled: "this.getDropZoneObjectsByIndex(0).length === 0 && this.getDropZoneObjectsByIndex(1).length === 0  "

                    }, {
                        name: 'Size',
                        maxCapacity: 2,
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        allowObjectType: 2
                    }, {
                        name: 'Tooltip',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        allowObjectType: 2
                    }
                ];
            },

            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;
                return {
                    allowedItems: $ARR.filter(dragObjects, function (object) {
                        switch(zone.n) {
                            case "Class":
                                return !me.isObjectInZone(object, ZONE_PACKAGE);   // Can't have same unit in Package zone.
                        }
                        return true;
                    })
                };
            },

            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
                var me = this,
                    actions = [];
                switch(this.getDropZoneName(zone)) {
                    case "Package":
                        // If added to Color, remove it from Group.
                        $ARR.forEach(droppedObjects, function (object){
                            // Is this object in group zone?
                            if (me.isObjectInZone(object, ZONE_CLASS)) {
                                me.getRemoveDropZoneObjectsActions(actions, ZONE_CLASS, object);
                            }
                        });
                        break;
                    case "Size":
                        // If added to Size, also add the unit to Tooltip.
                        this.getAddDropZoneObjectsActions(actions, ZONE_TOOLTIP, droppedObjects, idx, extras);
                        break;
                }
                return actions;
            },

            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) {
                var actions = [];
                switch(this.getDropZoneName(zone)) {
                    case "Size":
                        // If removed from Size, also remove it from Tooltip.
                        this.getRemoveDropZoneObjectsActions(actions, ZONE_TOOLTIP, objects);
                        break;
                }
                return actions;
            },

            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
                // Add threshold menu option to size zone.
                if (this.getDropZoneName(zone) === "Size") {
                    cfg.addSeparator();
                    this.buildThresholdMenuOptions(cfg, {item: object}, true);
                }
            }
        }
    );
}());
//@ sourceURL=TemplateDropzones.js