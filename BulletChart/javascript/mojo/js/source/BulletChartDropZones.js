(function () { 
    if (!mstrmojo.plugins.BulletChart) {
        mstrmojo.plugins.BulletChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.BulletChart.BulletChartDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.BulletChart.BulletChartDropZones",
            cssClass: "bulletchartdropzones",
            getCustomDropZones: function getCustomDropZones(){

                return [
                    {
                        name: 'Category',
                        title: mstrmojo.desc(13828, 'Drag attributes here'),
                        //maxCapacity: ,
                        allowObjectType: 1,
                        disabled: false
                    },
                    {
                        name: 'Actual',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 1,
                        allowObjectType: 2,
                        disabled: false
                    },
                    {
                        name: 'Target',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 1,
                        allowObjectType: 2,
                        disabled: false/*this.getDropZoneObjectsByIndex(1).length === 0 && // Group zone is enabled only if color zone is not empty
                        this.getDropZoneObjectsByIndex(2).length === 0    // And itself is not empty.*/
                    },
                    {
                        name: 'Range',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        maxCapacity: 3,
                        allowObjectType: 2,
                        disabled: false/*this.getDropZoneObjectsByIndex(1).length === 0 && // Group zone is enabled only if color zone is not empty
                        this.getDropZoneObjectsByIndex(3).length === 0    // And itself is not empty.*/
                    },
                    {
                        name: 'KPI',
                        title: mstrmojo.desc(13827, 'Drag metrics here'),
                        //maxCapacity: 3,
                        allowObjectType: 2,
                        disabled: false
                    }
                ];

},
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {

                var me = this;

                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        /*switch(zone.n) {
                            case 'Class':
                                return !me.isObjectInZone(object, 'Package');   // Can't have same unit in Package zone.
                        }*/

                        return true;
                    })
                };
    







},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {

                var me = this,
                    actions = [];

                /*switch(this.getDropZoneName(zone)) {
                    case 'Package':
                        // If added to Color, remove it from Group.
                        mstrmojo.array.forEach(droppedObjects, function (object){
                            // Is this object in group zone?
                            if (me.isObjectInZone(object, 'Class')) {
                                me.getRemoveDropZoneObjectsActions(actions, 'Class', object);
                            }
                        });

                        break;
                    case 'Size':
                        // If added to Size, also add the unit to Tooltip.
                        this.getAddDropZoneObjectsActions(actions, 'Tooltip', droppedObjects, idx, extras);
                        break;
                }*/

                return actions;
},

            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 

    







},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {

                // Add threshold menu option to size zone.

                //TODO: for now remove threshold for world, will resume later
                var zoneName = this.getDropZoneName(zone);
                if (zoneName === 'Actual' || zoneName === "KPI") {
                    cfg.addSeparator();
                    this.buildThresholdMenuOptions(cfg, {item: object}, true);
                }




   },
               /**
             * Sample code that shows how to write custom drop zones transition.
             * Rules (US43713):
             *   All attributes should be moved to 'Category' dropzone in order.
             *   First metric should be moved to 'Actual'
             *   Second metric should be moved to ‘Target'.
             *   All other metric should be moved to 'KPI'
             *   Special case: metric from 'Tooltips' dropzone should always moved to 'KPI' dropzone.
             *
             * @param {Array} attributes
             * @param {Array} metrics
             */
            customDropZonesTransition: function customDropZonesTransition(attributes, metrics) {
                var noTooltipsArr,
                    tooltipsArr;

                // Transit all attributes to "Category".
                this.transitionObjectsToZone('Category', attributes);

                // Find all metrics not from "Tooltips" (In OOTB it is called "AdditionalMetrics").
                noTooltipsArr = metrics.filter(function (metric) {
                    return metric.fromZone !== 'Tooltips' && metric.fromZone !== 'AdditionalMetrics';
                });

                // Transit first metric (not from "Tooltips") to "Actual".
                this.transitionObjectsToZone('Actual', noTooltipsArr[0]);
                // Transit second metric (not from "Tooltips") to "Target".
                this.transitionObjectsToZone('Target', noTooltipsArr[1]);
                // Transit all other metrics (not from "Tooltips") to "KPI".
                this.transitionObjectsToZone('KPI', noTooltipsArr.slice(2));

                // Find all metrics from "Tooltips" (In OOTB it is called "AdditionalMetrics").
                tooltipsArr = metrics.filter(function (metric) {
                    return metric.fromZone === 'Tooltips' || metric.fromZone === 'AdditionalMetrics';
                });

                // Transit all metrics from "Tooltips" to "KPI".
                this.transitionObjectsToZone('KPI', tooltipsArr);

            }
})}());
//@ sourceURL= BulletChartDropZones.js