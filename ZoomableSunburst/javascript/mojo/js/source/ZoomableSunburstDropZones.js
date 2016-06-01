(function () { 
    if (!mstrmojo.plugins.ZoomableSunburst) {
        mstrmojo.plugins.ZoomableSunburst = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.ZoomableSunburst.ZoomableSunburstDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.ZoomableSunburst.ZoomableSunburstDropZones",
            cssClass: "zoomablesunburstdropzones",
            getCustomDropZones: function getCustomDropZones(){
 },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
 
 
 
 
 
 
 
                // DE25750: By default allow all items.
                return {
                    allowedItems: dragObjects
                };
            



},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
 
 
 
 
 
 
 








},
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 
  
  
  
  
  
  
 








},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
 
 
 
 
 
 
 








}
})}());
//@ sourceURL=ZoomableSunburstDropZones.js