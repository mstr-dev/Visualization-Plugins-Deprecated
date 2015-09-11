**Contributor:** Tiago Siebler

**Contributor's Contact Info.:** tsiebler at microstrategy dot com

**Contributor's Orgnization:** MicroStrategy, Inc.

**Original Author:** Rob Schmuecker

**Original Author's Orgnization:** 

**Original Author's Contact Info.:** @robschmuecker or robert.schmuecker at gmail dot com

**Original Visualization Source Link:** http://bl.ocks.org/robschmuecker/7880033

**Name:** D3.js Drag and Drop, Zoomable, Panning, Collapsible Tree with auto-sizing.

**Usage:** This visualization needs 1 or more attributes.

**Description:** Draggable, zoomable, panning and collapsible treeview with auto-sizing.


This example pulls together various examples of work with trees in D3.js.

The panning functionality can certainly be improved in my opinion and I would be thrilled to see better solutions contributed.

One can do all manner of housekeeping or server related calls on the drop event to manage a remote tree dataset for example.

Dragging can be performed on any node other than root (flare). Dropping can be done on any node.

Panning can either be done by dragging an empty part of the SVG around or dragging a node towards an edge.

Zooming is performed by either double clicking on an empty part of the SVG or by scrolling the mouse-wheel. To Zoom out hold shift when double-clicking.

Expanding and collapsing of nodes is achieved by clicking on the desired node.

The tree auto-calculates its sizes both horizontally and vertically so it can adapt between many nodes being present in the view to very few whilst making the view managable and pleasing on the eye.

**Example scenario:** Hierarchy exploration. Organizational charts.

**Screenshot:**

![Alt text][screenshot1]
[screenshot1]: ./style/images/screenshot1.png?raw=true
![Alt text][screenshot2]
[screenshot2]: ./style/images/screenshot2.png?raw=true
![Alt text][screenshot3]
[screenshot3]: ./style/images/screenshot3.png?raw=true
