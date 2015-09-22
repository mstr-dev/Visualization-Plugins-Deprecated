**Contributor:** Tiago Siebler

**Contributor's Contact Info.:** tsiebler at microstrategy dot com

**Contributor's Orgnization:** MicroStrategy, Inc.

**Original Author:** Mike Bostock

**Original Author's Orgnization:** 

**Original Author's Contact Info.:** mike@ocks.org

**Original Visualization Source Link:** http://bl.ocks.org/mbostock/1283663

**Name:** Hierarchical Bar Chart

**Usage:** This visualization needs 2 or more attributes, and 1 metric.

**Description:** This bar chart visualizes hierarchical data using D3. Each blue bar represents a folder, whose length encodes the total size of all files in that folder (and all subfolders). Clicking on a bar dives into that folder, while clicking on the background bubbles back up to the parent folder. The effect is similar to a zoomable partition layout, though in a more conventional display.

**Example scenario:** Presentation of multiple related bar charts, one by one, through a single visualization.

**Screenshots:**

![Alt text][screenshot1]
[screenshot1]: ./style/images/screenshot1.png?raw=true

Click on "Movies" bar to drill to the next level.

![Alt text][screenshot2]
[screenshot2]: ./style/images/screenshot2.png?raw=true

Click on "Drama" to drill another level down.

![Alt text][screenshot3]
[screenshot3]: ./style/images/screenshot3.png?raw=true

Click anywhere to drill out again:
![Alt text][screenshot2]
[screenshot2]: ./style/images/screenshot2.png?raw=true