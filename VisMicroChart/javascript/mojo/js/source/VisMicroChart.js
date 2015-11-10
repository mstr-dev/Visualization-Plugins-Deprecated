(function () {
    if (!mstrmojo.plugins.VisMicroChart) {
        mstrmojo.plugins.VisMicroChart = {};
    }


    mstrmojo.requiresCls( "mstrmojo.plugins.VisMicroChart.MicroChartVisBase",
        "mstrmojo.plugins.VisMicroChart.VisChartUtils",
        "mstrmojo.plugins.VisMicroChart.VisMicroChartTable",
        "mstrmojo.dom",
        "mstrmojo.plugins.VisMicroChart.VisMicroChartTooltip",
        "mstrmojo.hash",
        "mstrmojo.color",
        "mstrmojo.css",
        "mstrmojo.array");

    var $CLR = mstrmojo.color,
        $CSS = mstrmojo.css,
        $HASH = mstrmojo.hash,
        $forEachHash = $HASH.forEach,
        $M = Math,
        $D = mstrmojo.dom,
        $ARR = mstrmojo.array;

    var zf = 1;

    //how many page we render at one time
    var PAGE_COUNT = 5;

    var TRIANGLE_WIDTH = 30;

    //metric columns spacing
    var COMPACT = 0;
    var NORMAL = 1;
    //    var LARGE = 2;

    //column type
    var ATTR_NAME = 0,
        METRIC_NAME = 1,
        METRIC_VALUE = 2,
        CHART = 3,
        TREE_TRIANGLE = 4,
        DROP_SHADOW = 5;

    //sort order
    var SORT_ORDER = {
        NORMAL: 0,
        ASCENDING: 1,
        DESCENDING: 2
    };

    //    var DEFAULT_TH_CSS = "border:none;word-break:break-word;white-space:normal;";
    var DEFAULT_TD_CSS = "border:none;background:transparent;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px;";
    var TD_SELECTED_CSS = "border:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px;";
    //    var TH_SELECTED_CSS = "border:none;word-break:break-word;white-sapce:normal;";

    var NO_REPLACE = 2;
    var IN_REPLACE = 3;

    //    var TOP_Z_INDEX = 200;

    var DOCKED_HEADER = 0,
        OTHER_ROW = 1;

    var ROW_AXIS = 1, COL_AXIS = 2;
    //    var DRILLING_ACTION = 1, SELECTOR_ACTION = 2, HYPERLINK_ACTION = 4;
    var linkCount = 0;
    var attrCount = 0;
    var order = [];
    var ID_NAME = {};
    var METRIC_INDEX = {};
    var METRICS = [];
    var models = [];

    var LEFT_CHART_ROW = 'leftRow';
    var RIGHT_CHART_ROW = 'rightRow';

    // combine the attr with diff form
    var GFL = 1;
    // CG attr count
    var CGL = 0;

    var textAlign = { // xiawang: we must use class for text-align, otherwise
        // there is conflict between inherited format
        left: "microchart-table-text-L",
        center: "microchart-table-text-M",
        right: "microchart-table-text-R"
    };

    function getParentBkgColor() {
        var parentNode = this.domNode.parentNode,
            bkgColor;
        while (parentNode) {
            var compStyle = mstrmojo.css.getComputedStyle(parentNode);
            bkgColor = compStyle.backgroundColor;
            if (bkgColor) {
                if (bkgColor.indexOf('rgba') >= 0) {
                    var rgba = this.utils.rgbaStr2rgba(bkgColor);
                    if (rgba && rgba[4]) {
                        return rgba;
                    }
                } else if (bkgColor.indexOf('rgb') >= 0) {
                    var rgb = $CLR.rgbStr2rgb(bkgColor);
                    return rgb;
                }

            }
            parentNode = parentNode.parentNode;
        }

        bkgColor = this.model.data['background-color'];
        if (bkgColor) {
            return $CLR.hex2rgb(bkgColor);
        }

        //return default value
        return [255, 255, 255];
    }

    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
    var CUSTOM_DARK_THEME = 3;
    var CUSTOM_LIGHT_THEME = 4;

    function getUITheme() {
        var ct = this.model.data && this.model.data.vp && this.model.data.vp.ct;
        if (!ct || ct === "") {
            //TQMS 775783
           //var newlyCreated = Object.keys(this.model.vp).length === 0;
            var newlyCreated = true;
            if (newlyCreated) {
                ct = "2";
            } else {
                //for the old doc which not set custome theme, set it as custom theme
                ct = "0";
            }
        }
        this.theme = parseInt(ct, 10);

        if (this.theme === 0) {
            //custom theme
            //          var rgb = getParentBkgColor.call(this);
            var rgb = $CLR.hex2rgb(this.utils.getAncestorBgColor(this) || '#fff');

            var opacity = this.otherProps.mfBkgOpacity;
            rgb = this.utils.getRGBWithOpacity(rgb, opacity);

            //set background color
            this.backgroundColor = this.utils.rgb2rgbStr(rgb);

            var brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            if (brightness > 150) {
                this.theme = CUSTOM_LIGHT_THEME;
            } else {
                this.theme = CUSTOM_DARK_THEME;
            }
        } else if (this.theme === 1) {
            //default dark theme
            this.backgroundColor = '#333333';
        } else if (this.theme === 2) {
            //default light theme
            this.backgroundColor = '#f9f9f9';
        }

        this.domNode.style.backgroundColor = this.backgroundColor;
    }

    //padding added to column widths when smooth scroll is enable
    var paddingForSS = [5, 8, 10];
    var colWidthForChart = [100, 150, 200];
    var maxColWidthForAttr = [120, 150, 180];
    var maxColWidthForMetric = [100, 150, 200];
    var adjustWidthForColumnValue = [20, 40, 80];

    function setDimensionWithDPI() {
        zf = this.utils.getScreenZoomFactor();

        var otherProps = this.otherProps;
        otherProps.mRowHeight = Math.round(zf * otherProps.mRowHeight);
        TRIANGLE_WIDTH = Math.round(zf * 36);

        this.dropShadowWidth = Math.round(zf * 5);

        paddingForSS = [Math.round(5 * zf), Math.round(8 * zf), Math.round(10 * zf)];
        colWidthForChart = [Math.round(100 * zf), Math.round(150 * zf), Math.round(200 * zf)];
        maxColWidthForAttr = [Math.round(120 * zf), Math.round(150 * zf), Math.round(180 * zf)];
        maxColWidthForMetric = [Math.round(100 * zf), Math.round(150 * zf), Math.round(200 * zf)];
        adjustWidthForColumnValue = [Math.round(20 * zf), Math.round(40 * zf), Math.round(80 * zf)];
    }

    function isScrollableElementTouched(touch) {
        if (this.enableSmoothScroll) {
            var touchPointOnWidget = this.utils.getTouchXYOnWidget(touch.pageX, touch.pageY, this);

            var x = touchPointOnWidget.touchX,
                y = touchPointOnWidget.touchY;

            return x >= this.leftWidth;
        }

        return true;
    }

    // xiawang: this is helper function to set border and background-color while
    // maintain the width and height
    function setNodeCssText(node, cssText) {
        var height = node.style.height;
        var width = node.style.width;
        var textDecoration = node.style.textDecoration;
        var display = node.style.display;
        var fontSize = node.style.fontSize;
        var fontWeight = node.style.fontWeight;
        var paddingLeft = node.style.paddingLeft;
        var paddingRight = node.style.paddingRight;
        var boxShadow = node.style.boxShadow;
        node.style.cssText = cssText;
        node.style.height = height;
        node.style.width = width;
        node.style.textDecoration = textDecoration;
        if (display) {
            node.style.display = display;
        }
        if (fontSize) {
            node.style.fontSize = fontSize;
        }
        if (fontWeight) {
            node.style.fontWeight = fontWeight;
        }
        if (paddingLeft) {
            node.style.paddingLeft = paddingLeft;
        }
        if (paddingRight) {
            node.style.paddingRight = paddingRight;
        }
        if (boxShadow) {
            node.style.boxShadow = boxShadow;
        }
    }

    function init(w) {
        METRICS = [];
        METRIC_INDEX = {};
        ID_NAME = {};
        order = [];
        models = [];
        GFL = 1;
        CGL = 0;
        linkCount = 0;
        attrCount = 0;
    }

    function initProp() {
        // mb:bolean value
        // mw:string value with format like "#FF00CC". It is used to represent color and converted from decimal or hex string from JSON
        // mstr:string value
        // mf:float value
        // mn:int value
        // mp:array value
        var sparklineProps = this.sparklineProps = {};
        sparklineProps.mbShow = true;
        sparklineProps.mbAllPoints = false;
        sparklineProps.mbEndPoints = true;
        sparklineProps.mbRefLine = true;
        sparklineProps.mbRefArea = true;
        sparklineProps.mbAssMetric = true;
        sparklineProps.mbShowTooltip = true;
        sparklineProps.mwSeriesLineCol = "#333333";
        sparklineProps.mwRefLineCol = "#0066FF";
        sparklineProps.mwRefAreaCol = "#DEDEDE";
        sparklineProps.mstrHeader = "[Sparkline]";
        sparklineProps.mstrAssMetric = "";

        var barProps = this.barProps = {};
        barProps.mbShow = false;
        barProps.mbShowLegend = true;
        barProps.mbRefLine = true;
        barProps.mbShowTooltip = true;
        barProps.mwPosCol = "#66CC00";
        barProps.mwNegCol = "#FF0000";
        barProps.mwRefLineCol = "#0066FF";
        barProps.mstrHeader = "[Bar]";

        var bulletProps = this.bulletProps = {};
        bulletProps.mbShow = true;
        bulletProps.mbRefLine = true;
        bulletProps.mbRefBands = true;
        bulletProps.mbShowLegend = true;
        bulletProps.mbAssMetric = true;
        bulletProps.mbInvertAxis = false;
        bulletProps.mbShowTooltip = true;
        bulletProps.mfMinValue = 0;
        bulletProps.mwPosCol = "#000066";
        bulletProps.mwNegCol = "#FF0000";
        bulletProps.mwRefLineCol = "#0066FF";
        bulletProps.mwBand1 = "#999999";
        bulletProps.mwBand2 = "#BBBBBB";
        bulletProps.mwBand3 = "#DEDEDE";
        bulletProps.mstrHeader = "[Bullet]";
        bulletProps.mstrAssMetric = "";
        bulletProps.mstrBand1 = "Low";
        bulletProps.mstrBand2 = "Medium";
        bulletProps.mstrBand3 = "High";

        var otherProps = this.otherProps = {};
        otherProps.mfBkgOpacity = 1.0;
        otherProps.mnMetricsPerKPI = 1;
        otherProps.mbHideColHeaders = false;
        otherProps.mbHideTextColumns = false;
        otherProps.mbLockLayout = false;
        otherProps.mbShowForHiddenGraphs = true;
        otherProps.mbInheritFromGridGraph = false;
        otherProps.mbInSingleColumnMode = false;

        otherProps.mpColumnIDs = [];
        otherProps.mpColumnIDsInTreeMode = [];
        otherProps.mpColumnPositions = null;
        otherProps.mpColumnWidths = null;
        otherProps.mpSortKey = null;

        otherProps.mbSortDescend = true;

        //set default row height
        otherProps.mRowHeight = 36;
        //        if(this.isAndroidTab){
        //            otherProps.mRowHeight = 29;
        //        }else{
        //            otherProps.mRowHeight = 48;
        //        }

    }

    function isTouchedOnWidget(touch) {

        if (!touch) {
            return false;
        }
        var me = this;

        var pos = mstrmojo.dom.position(this.domNode);

        //        var touchPointOnWidget = me.utils.getTouchXYOnWidget(touch.pageX,
        //                touch.pageY, me);
        //        var x = touchPointOnWidget.touchX, y = touchPointOnWidget.touchY;

        var x = touch.pageX - pos.x,
            y = touch.pageY - pos.y;

        if ((x > 0 && x < me.getWidth()) && (y > 0 && y < me.getHeight())) {
            return true;
        }
        return false;
    }

    // xiawang: used to convert decimal or hex strings into color strings like #0000FF
    function convertToColor(intString) {
        var colorString = parseInt(intString, 10).toString(16),
            len = colorString.length,
            i;

        for (i = len; i < 6; i++) {
            colorString = "0" + colorString;
        }
        colorString = "#" + colorString;
        return colorString;
    }

    function buildNonTreeRows() {
        this.rows = [];
        var i;

        for (i = 0; i < models.length; i++) {
            this.rows[i] = {model: models[i],
                rowIdx: i,
                selected: {},
                rowRef: {}};
        }
    }

    function isSubTotalRow(row) {
        var result = {
                isSubTtl: false,
                hasSubTtlAttr: false,
                firstSubTtlIdx: -1
            },
            i,
            j;

        for (i = 0; i < row.length; i++) {
            if (row[i].etk != undefined && row[i].etk < 0) {
                //attr i is subtotal
                result.firstSubTtlIdx = i;
                result.hasSubTtlAttr = true;

                for (j = i + 1; j < row.length - 1; j++) {
                    var etk = row[j].etk;
                    if (etk === undefined || etk >= 0) {
                        break;
                    }
                }

                //return true if from attr i to second last attr is all subtotal
                result.isSubTtl = j === row.length - 1;
                break;
            }
        }

        return result;
    }

    /*
     * the ith item in attrIdxArray and attrIDArray, correspond to the attr at
     * tree level i the attrIdxArray[i] store the index of attr in the gts.row
     * the attrIDArray[i] store the attrID of attr at tree level i
     */
    function getAttrIdxArray(w) {

        var attrIDArray = w.attrIDArray;

        var m = w.model, gts = m.gts, rows = gts.row;
        var id = rows[0].id;

        attrIDArray[0] = id;
        for (var i = 1; i < rows.length; i++) {
            if (id == rows[i].id || id == rows[i].id + ":CG") {
                // same attr form, or CG
                // skip
            } else {
                // new attr
                id = rows[i].id;
                attrIDArray[i] = id;
            }
        }
    }

    /*
     * get the treeNode in this.tree according to the tree path
     */
    function getTreeNode(tree, treePath) {
        var treePathArray = treePath.split("_");
        var treeNode = tree;
        for (var i = 0; i < treePathArray.length; i++) {
            var idx = treePathArray[i];
            treeNode = treeNode.childrenTreeNodeList[idx];
        }
        return treeNode;
    }

    function getPreSiblingTreeNode(tree, treePath) {
        var treePathArray = treePath.split("_");
        var lowestLevelIdx = treePathArray[treePathArray.length - 1];
        if (lowestLevelIdx > 0) {
            //has previous siblings
            treePathArray[treePathArray.length - 1] = lowestLevelIdx - 1;
            var treeNode = tree;
            for (var i = 0; i < treePathArray.length; i++) {
                var idx = treePathArray[i];
                treeNode = treeNode.childrenTreeNodeList[idx];
            }
            return treeNode;
        } else {
            return null;
        }
        return null;
    }

    function getParentTreeNodeAtLevel(tree, treePath, level) {
        var treePathArray = treePath.split("_");
        var treeNode = tree;
        for (var i = 0; i <= level; i++) {
            var idx = treePathArray[i];
            treeNode = treeNode.childrenTreeNodeList[idx];
        }
        return treeNode;
    }

    function getBoolValue(value) {
        if (value === true || value === "true") {
            return true;
        }
        return false;
    }

    /*
     * used in expand all and collapse all set needExpand of treeNode according
     * to treeNode level
     */
    function setNeedExpandToLevel(tree, level) {
        if (!tree) {
            return;
        }

        if (tree.level <= level) {
            tree.needExpand = true;
        } else {
            tree.needExpand = false;
        }

        var treeNodeList = tree.childrenTreeNodeList;

        for (var j = 0; j < treeNodeList.length; j++) {
            setNeedExpandToLevel(treeNodeList[j], level);
        }

    }

    function initTree() {

        this.tree = {};
        this.tree.childrenTreeNodeList = [];
        this.tree.needExpand = true;
        //        this.tree.expanded = false;
        this.tree.treePath = "";
        this.tree.level = -1;

        this.attrIDArray = [];

        //selected treenode reference
        this.currSelectedObj = [];
        this.lastSelectedObj = [];

        this.initDockedHeadersDone = false;
    }


    function compareTreePath(src, des) {
        var count = src.length;
        if (des.length != count) {
            return false;
        }
        for (var i = 0; i < count - 1; i++) {
            if (src[i] != des[i].idx) {
                return false;
            }
        }
        return true;
    }

    /*
     * process the data model to tree structure For each treeNode, there are
     * following prop:
     * childrenTreeNodeList: an array store the children
     * treeNode level: first level is 0
     * rowIdx:
     * addedToDom: whether this treeNode is add to domNode
     * treePath: used to find this treeNode quickly
     * isLeaf: true or false needExpand: true or false(first set by vp.exps)
     */
    function convertDataToTreeModels(AttrIndexes) {
        var treeNodeList = this.tree.childrenTreeNodeList,
            model = this.model.data,
            rhs = model.ghs.rhs,
            rowTitles = model.gts.row,
            gvs = model.gvs,
            expsTree = model.vp.exps && model.vp.exps.tree,
            addToNodeList,
            treePath,
            firstDiffAttrIdx,
            lastSameNode,
            treeNodeIdx;
        var allExpanded = expsTree && getBoolValue(expsTree.allExpanded);
        //if the mcStatus != undefined, we will use the mcStatus to define the tree expand
        var mcStatus = this.mcStatus;
        var expandToLevel = -1;
        var expandedEntryArray = mcStatus ? mcStatus.expandedEntryArray : expsTree && expsTree.expandedEntry;

        this.attrIDArray = [];

        var attrIdxArray = this.attrMapIdx;

        // attrIdxArray is used to skip the CG attr and multi attr form
        getAttrIdxArray(this);

        var rowAttrCount = rhs.items && rhs.items[0] && rhs.items[0].items
            && rhs.items[0].items.length;
        // level count is count for the tree level, -1 as there ia a dummy one at last position
        var levelCount = attrIdxArray.length - 1;
        this.maxTreeLevel = levelCount - 2;

        expandToLevel = mcStatus ? mcStatus.expandToLevel : allExpanded ? this.maxTreeLevel - 1 : -1;

        var lastTreePath = [],
            lastModelTreePath = [];
        // init lastTreePath to all -1
        for (var i = 0; i < rowAttrCount; i++) {
            lastTreePath.push(-1);
        }
        var modelIdx = -1;
        var gridRowCount = rhs.items.length;
        if (this.mcStatus && this.mcStatus.currSelectedObj) {
            this.currSelectedObj = this.mcStatus.currSelectedObj;
        }
        for (var i = 0; i < gridRowCount; i++) {
            var currRow = rhs.items[i].items;
            var sameAsLastRow = compareTreePath(lastModelTreePath, currRow);
            if (!sameAsLastRow) {
                modelIdx++;
            } else {
                continue;
            }

            var SubTotalRes = isSubTotalRow(currRow),
                isSubtotal = SubTotalRes.isSubTtl,
                hasSubTotalAttr = SubTotalRes.hasSubTtlAttr
            ignoreRow = hasSubTotalAttr && !isSubtotal;
            if (!ignoreRow) {
                firstDiffAttrIdx = isSubtotal ? SubTotalRes.firstSubTtlIdx : levelCount;
                // rowAttrCount - 1 for the last is the time attr
                for (var j = 0; j < levelCount - 1; j++) {
                    var attrIdx = attrIdxArray[j];
                    var currSelectedNodeID = this.currSelectedObj[j];

                    if (lastTreePath[attrIdx] != currRow[attrIdx].idx && firstDiffAttrIdx > attrIdx) {
                        //find the first attr idx that is different with last row
                        firstDiffAttrIdx = attrIdx;
                    }

                    if (attrIdx >= firstDiffAttrIdx) {

                        // find the position in the treeList
                        addToNodeList = treeNodeList;
                        lastSameNode = null;
                        // construct treePath in this tree structure,like "0_1_1"
                        treePath = "";
                        for (var k = 1; k <= j; k++) {
                            treeNodeIdx = addToNodeList.length - 1;
                            if (k == j) {
                                lastSameNode = addToNodeList[treeNodeIdx];
                            }
                            addToNodeList = addToNodeList[treeNodeIdx].childrenTreeNodeList// addToNodeList[currRowIdx[attrIdxArray[k]]].childrenTreeNodeList;
                            treePath += treeNodeIdx;
                            treePath += "_";
                        }

                        if (isSubtotal && lastSameNode) {
                            lastSameNode.model = models[modelIdx];
                            //                            console.log(lastSameNode.treePath+" subtotal row:"+i);
                            break;
                        } else {

                            // add new treenode to the list
                            var newTreeNode = {};
                            newTreeNode.es = [];
                            //                        for ( var l = attrIdxArray[j]; l < attrIdxArray[j + 1]; l++) {
                            newTreeNode.es.push(rowTitles[j].es[currRow[attrIdx].idx]);
                            //                        }
                            var elem = rowTitles[j].es[currRow[attrIdx].idx];
                            newTreeNode.id = elem.id;
                            newTreeNode.n = elem.n;

                            newTreeNode.model = models[modelIdx];

                            newTreeNode.selected = false;
                            newTreeNode.childrenTreeNodeList = [];
                            // attr idx in model.gts.row[].es[]
                            newTreeNode.attrElemIdx = currRow[attrIdx].idx;
                            newTreeNode.isLeaf = (j == this.maxTreeLevel);
                            newTreeNode.level = j;

                            var preSiblingCount = addToNodeList.length;
                            newTreeNode.preSiblingCount = preSiblingCount;
                            newTreeNode.preSibling = preSiblingCount > 0 ? addToNodeList[preSiblingCount - 1] : null;

                            treePath += addToNodeList.length;
                            newTreeNode.treePath = treePath;

                            //newTreeNode.idx = addToNodeList.length;
                            //                             console.log(treePath+ " ,gridrowidx:"+i);

                            addToNodeList.push(newTreeNode);

                            newTreeNode.needExpand = j <= expandToLevel ? true : false;

                            //recalculate the currSelectedObj after on slice
                            if (currSelectedNodeID == newTreeNode.id) {
                                this.currSelectedObj[j] = newTreeNode;
                            }

                        }
                    }
                }

                // update lastTreePath
                for (var j = 0; j < rowAttrCount; j++) {
                    lastTreePath[j] = currRow[j].idx;
                }
            }

            // update lastModelTreePath
            for (var j = 0; j < rowAttrCount; j++) {
                lastModelTreePath[j] = currRow[j].idx;
            }
        }

        if (expandToLevel < 0 && expandedEntryArray) {
            // compute the expandedEntry
            for (var i = 0; i < expandedEntryArray.length; i++) {
                var expandedEntry = expandedEntryArray[i];
                var treeNode = this.tree;
                for (var j = 0; j < expandedEntry.length; j++) {
                    var eid = expandedEntry[j].element;
                    var idx = $ARR.find(
                        treeNode.childrenTreeNodeList, 'id', eid);
                    if (idx < 0) {
                        break;
                    }
                    treeNode = treeNode.childrenTreeNodeList[idx];
                }
                treeNode.needExpand = true;
            }
        }

        //compute the postSiblingCount
        var preOrderTreeNodeQueue = [];
        preOrderTreeNodeQueue.push(this.tree);
        var treeNode = null;
        //pre order travel tree
        while (preOrderTreeNodeQueue.length > 0) {
            treeNode = preOrderTreeNodeQueue.pop();
            var treeNodeList = treeNode.childrenTreeNodeList;
            var childrenCount = treeNodeList.length;
            for (var i = childrenCount - 1; i >= 0; i--) {
                treeNode = treeNodeList[i];
                preOrderTreeNodeQueue.push(treeNode);
                treeNode.postSiblingCount = childrenCount - treeNode.preSiblingCount;
                treeNode.isLeaf = treeNode.childrenTreeNodeList.length == 0;
            }

        }

    }

    function scaleColumnWidthToFitWidget(colInfos, fitToWidth) {
        var colLen = colInfos.length;
        var totalWidth = 0;
        for (var i = 0; i < colLen; i++) {
            if (colInfos[i].type == TREE_TRIANGLE) {
                //totalWidth doesn't contains TRIANGLE_WIDTH, so we should minus it from fitToWidth
                fitToWidth -= TRIANGLE_WIDTH;
            } else {
                totalWidth += colInfos[i].colWidth;
            }
        }

        var scaleRatio = fitToWidth / totalWidth;

        for (var i = 0; i < colLen; i++) {
            if (colInfos[i].type == TREE_TRIANGLE) {
                colInfos[i].colWidth = TRIANGLE_WIDTH;
            } else {
                colInfos[i].colWidth = Math.round(colInfos[i].colWidth * scaleRatio);
            }
        }

        return scaleRatio;
    }

    function getContentOffsetWidth(rows, rowIdx, colIdx) {
        var rowInfo = rows[rowIdx],
            curM = rowInfo.model,
            elms = curM.elms,
            treeNode = rowInfo.treeNode,
            colInfos = this.colInfos,
            rowIdx = rowInfo.rowIdx,
            colCount = colInfos.length,
            colInfo = colInfos[colIdx],
            colIdx = colInfo.colIdx;

        if (colInfo.type == ATTR_NAME || colInfo.type == METRIC_NAME) {
            if (this.isTreeMode) {
                var attrName = "";
                for (var k = 0; k < treeNode.es.length; k++) {
                    attrName += treeNode.es[k].n;
                }
                //TQMS 702933:
                if (attrName.indexOf("&lt;") >= 0) {
                    attrName = attrName.replace(/&lt;/g, "<");
                    attrName = attrName.replace(/&gt;/g, ">");
                }

                return this.getTextWidth(attrName, colInfo.valueCssClass, null, null, null, treeNode.level == 0 ? true : false);//, true);

            } else {
                attr = elms[colInfo.order];
                var attrName = attr ? attr.n : "";
                //TQMS 722933:
                if (attrName.indexOf("&lt;") >= 0) {
                    attrName = attrName.replace(/&lt;/g, "<");
                    attrName = attrName.replace(/&gt;/g, ">");
                }
                return this.getTextWidth(attrName, colInfo.valueCssClass, null, null, null, false);//, true);

            }

        }

        if (colInfo.type == METRIC_VALUE) {
            var metricIdx = -1;
            var idx = -1;

            if (this.isKPI) {
                //idx for refv in model
                idx = parseInt(colInfo.order) % this.otherProps.mnMetricsPerKPI;

                //idx for the metric in metric array
                var metricIdx = rowInfo.model.metricIdx + idx;
            } else {
                if (colInfo.type == METRIC_VALUE) {
                    metricIdx = parseInt(colInfo.order);
                    idx = metricIdx;
                }
            }

            var innerHTML = "";
            var cssClass = "";

            if (curM.refv[idx].ti === undefined) { // by defult, use regular value
                if (curM.refv[idx].ts === 4) { // xiawang: For web JSON, ts  === 4 means image
                    innerHTML = "<img src='" + curM.refv[idx].v + "'/>";
                } else {
                    innerHTML = curM.refv[idx].v;
                }
            } else { // there is threshold
                try { // we will try to apply the threshold. But if it fails, we shouldn't just fail the document rendering.
                    // Instead, we show default value;
                    var model = this.model.data;
                    var th = model.th['' + metricIdx];
                    var ti = curM.refv[idx].ti;

                    if (curM.refv[idx].ty === 4) { // xiawang: This is image type
                        var path;
                        if (th[ti] && th[ti].n) {
                            path = th[ti].n;
                        } else {
                            path = curM.refv[idx].v;
                        }
                        if (path.indexOf(":") >= 0) { // xiawang: Then it is absolute image path like http://.... or ftp://...
                            // do nothing
                        } else { // xiawang: Then it is relative image path like "Images/Arr3_Up.png". We should append base url to the image path
                            var baseURL;
                            try {
                                baseURL = mstrApp.getConfiguration().getHostUrlByProject(mstrApp.getCurrentProjectId());
                            } catch (err) {
                                baseURL = "";
                            }
                            path = baseURL + path;
                        }
                        innerHTML = "<img src='" + path + "'/>";
                    } else {
                        if (th[ti] && th[ti].n && th[ti].cni !== undefined) { // if the threshold text is there, use it
                            innerHTML = th[ti].n;
                        } else {
                            innerHTML = curM.refv[idx].v;
                        }
                        //                            tds[j].style.fontSize = this.widget.fontSize; // xiawang: We should keep consistent with Flash and iOS to
                        // NOT inherite font size from Threshold at this time
                    }
                    cssClass = model.css[th[ti].cni].n;
                } catch (err) {
                    if (!innerHTML) { // xiawang: If innerHTML is not finalized yet.
                        innerHTML = curM.refv[idx].v;
                    }
                }
            }

            var className = "";
            if (cssClass) {
                className = colInfo.valueCssClass + " " + cssClass;
            } else if (this.valueCssClass) {
                className = colInfo.valueCssClass + " " + this.valueCssClass;
            } else {
                className = colInfo.valueCssClass;
            }

            return this.getTextWidth(innerHTML, className, null, null, null, this.isTreeMode && treeNode.level == 0 ? true : false);//, true);

        }

        return 0;

    }

    /**
     * calculate column width, decide whether we will use smooth scroll mode
     * update colIdx so that it consistent with idx in colInfos
     */
    function updateColumnWidth() {
        var colInfos = this.colInfos,
            width = this.getWidth();

        if (this.enableSmoothScroll) {
            /*
             * sampling the first 50 rows of data( include column header )
             * Include all levels of the tree mode, not just the topmost( expanded level) during this calculation
             */
            var rows = this.isTreeMode ? getTreeNodeRows.call(this, true, 50) : this.rows;
            var rowCount = Math.min(rows.length, 50);
            var mcs = this.metricColumnsSpacing;
            var paddingWidth = paddingForSS[mcs];

            for (var j = 0; j < this.colInfos.length; j++) {
                var colInfo = this.colInfos[j];

                if (colInfo.type == ATTR_NAME || colInfo.type == METRIC_NAME || colInfo.type == METRIC_VALUE) {

                    //calculate space required for longest metric data value
                    var maxColumnValueW = 0;
                    for (var i = 0; i < rowCount; i++) {
                        var columnW = getContentOffsetWidth.call(this, rows, i, j);
                        if (columnW > maxColumnValueW) {
                            maxColumnValueW = columnW;
                        }
                    }

                    //calculate space required for title of the column( 2 rows and word wrap)
                    var headerStr = colInfo.title;
                    var midPos = Math.round(headerStr.length / 2);

                    //                        if(headerStr.charAt(midPos) != ' '){
                    //                            //find the whitespace on left and right
                    //                            var leftWSPos = headerStr.lastIndexOf(' ', midPos);
                    //                            var rightWSPos = headerStr.indexOf(' ', midPos);
                    //
                    //                            if(midPos - leftWSPos > rightWSPos - midPos){
                    //                                midPos = rightWSPos;
                    //                            }else{
                    //                                midPos = leftWSPos;
                    //                            }
                    //                        }
                    var leftHalf = headerStr.slice(0, midPos);
                    var rightHalf = headerStr.slice(midPos);

                    var leftW = this.getTextWidth(leftHalf, colInfo.headerCssClass, null, null, null, true, false);
                    var rightW = this.getTextWidth(rightHalf, colInfo.headerCssClass, null, null, null, true, false);
                    var maxColumnHeaderW = Math.max(leftW, rightW);

                    var finalColumnW = 0;
                    if (maxColumnValueW > maxColumnHeaderW) {
                        finalColumnW = Math.min(maxColumnValueW, maxColWidthForMetric[mcs]);
                    } else {
                        finalColumnW = Math.min(maxColumnValueW + adjustWidthForColumnValue[mcs], maxColumnHeaderW, maxColWidthForMetric[mcs]);
                    }

                    colInfo.colWidth = Math.round(finalColumnW + paddingWidth);
                    colInfo.padding.left = Math.floor(paddingWidth / 2);
                    colInfo.padding.right = Math.ceil(paddingWidth / 2);
                } else if (colInfo.type == TREE_TRIANGLE) {
                    colInfo.colWidth = Math.round(TRIANGLE_WIDTH);
                } else if (colInfo.type == DROP_SHADOW) {
                    colInfo.colWidth = Math.round(this.dropShadowWidth);
                } else {
                    //chart
                    colInfo.colWidth = Math.round(colWidthForChart[mcs] + paddingWidth);
                    colInfo.padding.left = Math.floor(paddingWidth / 2);
                    colInfo.padding.right = Math.ceil(paddingWidth / 2);
                }
            }

            //recalculate the leftWidth and rightWidth
            this.leftWidth = 0;
            for (var i = 0; i < this.attrColumnCount; i++) {
                this.leftWidth += colInfos[i].colWidth;
            }

            this.rightWidth = 0;
            var maxMetricWidth = 0;
            for (var i = this.attrColumnCount; i < colInfos.length; i++) {

                this.rightWidth += colInfos[i].colWidth;
                if (colInfos[i].colWidth > maxMetricWidth) {
                    maxMetricWidth = colInfos[i].colWidth;
                }
            }

            if (this.leftWidth + this.rightWidth < this.getWidth()) {
                //the default width doesn't fulfill the widget, no need to scroll
                var scaleRatio = scaleColumnWidthToFitWidget(this.colInfos, this.getWidth());

                this.dropShadowDiv.style.display = "none";
                this.enableSmoothScroll = false;
                this.scrollerConfig.hScroll = false;

                this.leftWidth = this.getWidth();
                this.rightWidth = 0;
                this.leftChart.style.width = this.getWidth() + 'px';
            } else {
                //can scroll, add the dropshadow column
                if (this.attrColumnCount >= 0) {
                    //make space for the drop shadow between attributes area and metric area
                    var spaceCol = {order: "",
                        type: DROP_SHADOW,
                        title: "",
                        titleAlign: textAlign.center,
                        colWidth: this.dropShadowWidth,
                        padding: {l: 0, r: 0},
                        headerCssClass: this.headerCssClass,
                        valueCssClass: "",
                        colIdx: this.colInfos.length};
                    this.colInfos.splice(this.attrColumnCount, 0, spaceCol);
                    this.rightWidth += this.dropShadowWidth;
                }
                //all attributes + at least one metric ( the largest metric column )
                var requiredSpace = this.leftWidth + maxMetricWidth + this.dropShadowWidth;
                if (this.getWidth() < requiredSpace) {
                    var rightContainWidth = Math.min(maxMetricWidth + this.dropShadowWidth, 0.75 * this.getWidth());
                    this.leftWidth = this.getWidth() - rightContainWidth;

                    //The remaining space would be used by attributes equally
                    var attrWidth = this.treeColumnIdx > -1 ? (this.leftWidth - TRIANGLE_WIDTH) / (this.attrColumnCount - 1) : this.leftWidth / this.attrColumnCount;
                    for (var i = 0; i < this.attrColumnCount; i++) {
                        colInfos[i].colWidth = colInfos[i].type == TREE_TRIANGLE ? TRIANGLE_WIDTH : attrWidth;
                    }

                }

                this.dropShadowDiv.style.display = "block";
                this.scrollerConfig.hScroll = true;

                this.leftChart.style.width = this.leftWidth + 'px';
                this.rightChart.style.width = this.rightWidth + 'px';
                this.itemsContainerNode.style.width = ( this.getWidth() - this.leftWidth ) + 'px';
                this.itemsContainerNode.style.left = this.leftWidth + 'px';
            }

            //rebuild the colIdx so that when we handle touch event, we can easily get the coresponding column
            var colIdxNewPosition = [];
            var colInfos = this.colInfos,
                colCount = colInfos.length;
            for (var i = 0; i < colCount; i++) {
                colIdxNewPosition[colInfos[i].colIdx] = i;
            }
            for (var i = 0; i < colCount; i++) {
                var colInfo = colInfos[i];
                colInfo.colIdx = i;
                if (this.colInfos[i].type == TREE_TRIANGLE) {
                    this.treeColumnIdx = i;
                }
                if (colInfo.rowH) {
                    colInfo.rowH.colIdx = i;
                }
                if (colInfo.CGColIdx) {
                    colInfo.CGColIdx = colIdxNewPosition[colInfo.CGColIdx];
                }
                if (colInfo.associateAttr) {
                    for (var j = 0; j < colInfo.associateAttr.length; j++) {
                        colInfo.associateAttr[j] = colIdxNewPosition[colInfo.associateAttr];
                    }
                }

            }

        } else {
            //not enable smooth scroll
            var colLen = colInfos.length;

            if (this.otherProps.mpColumnWidths.length > 0) {
                //TQMS 702512:When user define column width, we should scale up or scale down the column width, so as to fit the width of widget.
                scaleColumnWidthToFitWidget(this.colInfos, width);
            } else {
                if (this.treeColumnIdx > -1) {
                    colLen--;
                    width -= TRIANGLE_WIDTH;
                }
                var chWidth = Math.round(width / colLen);
                for (var i = 0; i < colInfos.length; i++) {
                    if (colInfos[i].type == TREE_TRIANGLE) {
                        colInfos[i].colWidth = TRIANGLE_WIDTH;
                    } else {
                        colInfos[i].colWidth = chWidth;
                    }

                }
            }
        }
    }

    /*
     * colInfos:
     * order:
     * colIdx: need this as when smooth scroll enable, the colInfos will be split to two part, but the colIdx is continuous
     * title:
     * titleAlign:
     * type:
     * colWidth:
     * padding:{l,r,t,p} will be set to tds style
     * headerCssClass: classname templete
     * valueCssClass: valueCssClass for text align and so on. Need to combine with this.valueCssClass or threshold css for metric TDs
     * associateAttr: attr col index list.( the attr with same id but not same fid, that is the other attr form)
     * sort_order: NORMAL, ASCENDING, DESCENDING
     */
    function buildColInfos(metricColIdx) {
        var m = this.model.data,
            rows = m.gts.row,
            cols = m.gts.col,
            mes = cols[metricColIdx].es,
            propValue = m.vp ? m.vp : {},
            width = this.getWidth(),
            otherProps = this.otherProps;

        otherProps.mpColumnWidths = propValue.cw ? propValue.cw.split(",") :
            (propValue.tcw ? propValue.tcw.split(",") : [] );

        var columnWidths = otherProps.mpColumnWidths;// as shortcut;
        //check wether columnWidth is invalid
        if (columnWidths.length != order.length) {
            columnWidths = [];
            otherProps.mpColumnWidths = [];
        }

        this.colInfos = [];

        this.showGauge = false;
        for (var i = 0; i < order.length; i++) {
            if (order[i] == "GaugeChart") {
                // xiawang: check if Gauge chart is shown. This will decide whether
                // the order "2" act as associated metric or normal metric
                this.showGauge = true;
            }
        }

        this.isAllAttrSelectable = true;
        for (var i = 0, colInfoIdx = 0; i < order.length; i++) {
            var orderID = order[i];

            var colInfo = {
                order: orderID,
                colWidth: 0,
                padding: {},
                headerCssClass: " ",
                valueCssClass: " ",
                sortOrder: SORT_ORDER.NORMAL};

            if (orderID == "LineChart") {
                colInfo.type = CHART;
                colInfo.title = this.sparklineProps.mstrHeader;
                colInfo.titleAlign = textAlign.center;
                colInfo.padding.left = Math.round(3 * zf);
                colInfo.padding.right = Math.round(3 * zf);
            } else if (orderID == "BarChart") {
                colInfo.type = CHART;
                colInfo.title = this.barProps.mstrHeader;
                colInfo.titleAlign = textAlign.center;
                colInfo.padding.left = Math.round(3 * zf);
                colInfo.padding.right = Math.round(3 * zf);
            } else if (orderID == "GaugeChart") {
                colInfo.type = CHART;
                colInfo.title = this.bulletProps.mstrHeader;
                colInfo.titleAlign = textAlign.center;
                colInfo.padding.left = Math.round(3 * zf);
                colInfo.padding.right = Math.round(3 * zf);
            } else if (orderID == 'Metric') {
                if (otherProps.mbHideTextColumns) {
                    //do not show this attribute
                    //do nothing, and continue
                    this.treeColumnIdx = -1;
                    continue;
                }
                colInfo.type = METRIC_NAME;
                colInfo.title = mstrmojo.desc(1158, 'Metrics');
                colInfo.titleAlign = textAlign.left;
                colInfo.valueCssClass += " " + this.valueCssClass;
                if (cols[metricColIdx].lm && cols[metricColIdx].lm.length > 0) {
                    colInfo.lm = cols[metricColIdx];
                    linkCount++;
                }
            } else if (orderID != parseInt(orderID)) {
                //attribute
                if (otherProps.mbHideTextColumns) {
                    //do not show this attribute
                    //do nothing, and continue
                    this.treeColumnIdx = -1;
                    continue;
                }

                //associate attributes is attributes that will always highlight together with this attributes
                //e.g. different attribute forms or treeNode and the triangle before it
                colInfo.associateAttr = [];

                colInfo.type = ATTR_NAME;
                colInfo.title = ID_NAME[orderID];
                colInfo.titleAlign = textAlign.left;
                colInfo.valueCssClass += " " + this.valueCssClass;

                if (this.isTreeMode) {
                    //show attribute and is tree mode
                    //add triangle column
                    this.treeColumnIdx = colInfoIdx;
                    this.colInfos[colInfoIdx] = {order: orderID,
                        type: TREE_TRIANGLE,
                        title: "",
                        titleAlign: textAlign.center,
                        colWidth: 0,
                        padding: {},
                        headerCssClass: this.headerCssClass,
                        valueCssClass: "",
                        colIdx: this.treeColumnIdx};
                    //set colWidth to 0, and set colWidth to TRIANGLE_WIDTH after updateColumnWidth

                    colInfo.associateAttr.push(colInfoIdx);

                    colInfoIdx++;
                } else {
                    //none tree mode
                    for (var j = 0; j < rows.length; j++) {
                        var rowH = rows[j];

                        var findTheRowH = (orderID == rowH.id) || (orderID == rowH.id + ":" + rowH.fid),
                            findCGRowH = (orderID == rowH.id + ":CG")
                        isAttrForm = false;

                        //if this col is one attr form
                        var fs = rowH.fs;
                        for (var q = 0; q < fs.length; q++) {
                            if (orderID == rowH.id + ":" + fs[q].id) {
                                isAttrForm = true;
                                break;
                            }
                        }

                        if (findCGRowH && rowH.colIdx >= 0) {
                            this.colInfos[rowH.colIdx].CGColIdx = i;
                            this.colInfos[rowH.colIdx].isFirstCGCol = true;
                            colInfo.CGColIdx = rowH.colIdx;
                        }

                        if (findTheRowH || isAttrForm) {

                            rowH.colIdx = colInfoIdx;
                            colInfo.rowH = rowH;
                            //remove the ":CG"
                            colInfo.id = rowH.id.split(":")[0];
                            colInfo.fid = rowH.fid;

                            if (otherProps.mbInheritFromGridGraph && rowH.cni !== undefined && m.css.length > rowH.cni) {
                                colInfo.titleAlign = m.css[rowH.cni].n;
                            }

                            var isFirstAttrForm = (orderID == rowH.id + ":" + rowH.fid);
                            if (isFirstAttrForm) {
                                //only count the different attribute form for one time
                                attrCount++;
                            }

                            if (rowH.sc && rowH.sc.tks && rowH.sc.tks != "") {
                                colInfo.sc = rowH.sc;
                            } else {
                                this.isAllAttrSelectable = false;
                            }

                            if (rowH.lm && rowH.lm.length > 0 && rowH.lm[0].links) {
                                colInfo.lm = rowH;
                                if (isFirstAttrForm) {
                                    linkCount++;
                                }
                            }

                            //find the associate attributes, which will be highlighed together
                            var fs = rowH.fs;
                            for (var q = 0; q < fs.length; q++) {
                                var attrID = rowH.id + ":" + fs[q].id;
                                if (attrID == orderID) {
                                    //current attr
                                    colInfo.fid = fs[q].id;
                                    continue;
                                } else {
                                    //different attr form
                                    //find its column index
                                    for (var n = 0; n < order.length; n++) {
                                        if (order[n] == attrID) {
                                            colInfo.associateAttr.push(n);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }

                }

            } else {
                //metric
                colInfo.type = METRIC_VALUE;
                var index = parseInt(orderID);
                if (index >= mes.length) {
                    continue;
                }
                //metric id, used for sort
                colInfo.mid = mes[index].oid;
                if (otherProps.mbInheritFromGridGraph && mes[index].cni !== undefined && m.css.length > mes[index].cni) {
                    colInfo.titleAlign = m.css[mes[index].cni].n;
                } else {
                    colInfo.titleAlign = textAlign.right; // default to right
                }
                if (orderID == "0") {
                    if (this.sparklineProps.mstrAssMetric) {
                        // xiawang: add support for Ass Metric name for LineChart and Bar Chart
                        colInfo.title = this.sparklineProps.mstrAssMetric;
                    } else if (this.isKPI) {
                        colInfo.title = "";
                    } else {
                        colInfo.title = mes[index].n;
                    }
                } else if (orderID == "2") {
                    if (this.bulletProps.mstrAssMetric) {
                        // xiawang: add support for Ass Metric name for Bullet Chart
                        colInfo.title = this.bulletProps.mstrAssMetric;
                    } else if (this.isKPI && this.showGauge) {
                        colInfo.title = "";
                    } else {
                        colInfo.title = mes[index].n;
                    }
                } else {
                    colInfo.title = mes[index].n;
                }
                if (cols[metricColIdx] && cols[metricColIdx].lm && cols[metricColIdx].lm[index].links) {
                    colInfo.lm = cols[metricColIdx];
                    linkCount++;
                }

            }

            colInfo.valueCssClass += " microchart-table-text " + colInfo.titleAlign;
            colInfo.headerCssClass += " microchart-table-text " + colInfo.titleAlign + " " + this.headerCssClass;

            if (columnWidths.length > 0) {
                colInfo.colWidth = parseFloat(columnWidths[i]);
            }

            colInfo.colIdx = colInfoIdx;
            this.colInfos[colInfoIdx++] = colInfo;
        }

        var colInfos = this.colInfos;

        if (order.length == 0) {
            colInfos[0].title = rows[0].n;
            for (var i = 1; i < rows.length - GFL; i++) {
                colInfos[i].title = rows[i].n;
            }
        }

        //if enable smooth scroll, make attr on the left
        if (this.enableSmoothScroll) {
            var belongToLeft = function (type) {
                switch (type) {
                case ATTR_NAME:
                    return -1;
                case TREE_TRIANGLE:
                    return -1;
                case METRIC_NAME:
                    return -1;
                default:
                    return 1;
                }
            }

            var sortFunc = function (colInfo1, colInfo2) {
                if (belongToLeft(colInfo1.type) * belongToLeft(colInfo2.type) > 0) {
                    //both in left or both in right
                    return colInfo1.colIdx < colInfo2.colIdx ? -1 : 1;
                } else {
                    return belongToLeft(colInfo1.type);
                }
            }

            colInfos.sort(sortFunc);
            //after sort, the cols maybe disorganize, we will rebuild the colIdx later in function updateColumnWidth

            var colCount = colInfos.length;
            for (var i = 0; i < colCount; i++) {
                if (belongToLeft(colInfos[i].type) > 0) {
                    //none attr column
                    this.attrColumnCount = i;
                    break;
                }
            }

        }

    }

    function convertDataToModels(forSort) {
        this.initModel();

        var m = this.model.data,
            cols = m.gts.col,
            metricL = (m.gts.col[0] && m.gts.col[0].es && m.gts.col[0].es.length)? m.gts.col[0].es.length :0 ,
            rows = m.gts.row,
            rowL = (rows && rows.length)? rows.length:0,
            rl = (m.gvs && m.gvs.items && m.gvs.items.length)? m.gvs.items.length : 0,
            propValue = m.vp ? m.vp : {};

        if (rowL === 0 || metricL === 0 || cols.length > 1) {
            var errmsg = "The widget requires at least two attributes on row axis and one metrics in column axis OR exactly one attribute on row axis and at least one metric on column axis for KPI List mode.";
            m.err = mstrmojo.desc(8424, errmsg);
            return;
        }

        //show it as non-treemode, if the attr is less than 3
        if (this.isTreeMode) {
            if (rows.length < 3) {
                this.isTreeMode = false;
            }

        }

        var len = rows.length;
        var gfid = rows[len - 1].id;
        len = len - 2;
        while (len >= 0) {
            if (gfid == rows[len].id) {
                GFL++;
                len--;
            } else {
                break;
            }
        }

        if (rowL <= GFL) {
            this.isKPI = true;
        }

        //for Custom Group
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].otp == 1) {
                //is Custom Group
                rows[i].otp = -1;
                while (++i < rows.length && rows[i].otp == 1) {
                    rows[i].id += ":CG";
                    rows[i].n = " ";
                    rows[i].otp = -1;
                }
            }
        }

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].fs && rows[i].fs.length > 0) {
                for (var q = 0; q < rows[i].fs.length; q++) {
                    // only the first one display the name
                    if (q == 0) {
                        ID_NAME[rows[i].id + ":" + rows[i].fs[q].id] = rows[i].n;
                    } else {
                        ID_NAME[rows[i].id + ":" + rows[i].fs[q].id] = " ";
                    }
                }
            }
            if (rows[i].fid && rows[i].fid.length > 0) {
                /*
                 *  in multi form case, .dn = "Region" while .n = "Region DESC" or "Region ID"
                 *  we only need to display a single title if .dn is used. Otherwise, if .n is used, we display both
                 */
                // xiawang: TQMS 532304 update: we should follow web behavior
                // rather than iOS behavior. So we should always use .n
                var headerTitle;
                headerTitle = rows[i].n; // rows[i].dn || rows[i].n;
                ID_NAME[rows[i].id] = headerTitle;
                ID_NAME[rows[i].id + ":" + rows[i].fid] = headerTitle;
            } else {
                ID_NAME[rows[i].id] = rows[i].n;
            }
        }

        /*
         * build METRIC_INDEX map
         * key:metric name or metric ID
         * value:metric index
         */
        var metricIdx = -1;
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].n = "Metrics") {
                metricIdx = i;
                var mes = cols[i].es;
                for (var j = 0; j < mes.length; j++) {
                    ID_NAME[mes[j].oid] = mes[j].n;
                    METRIC_INDEX[mes[j].n] = j;
                    METRIC_INDEX[mes[j].oid] = j;
                    METRICS[j] = mes[j].n;
                }
            }
        }

        var orderValid = true;
        if (!propValue.co && !propValue.tco) {
            orderValid = false;
        } else {
            order = propValue.tco ? propValue.tco.split(",") : propValue.co.split(",");
            orderValid = processAndCheckOrderValid.call(this);
            if (!orderValid) {
                //do not use the column width too
                propValue.cw = null;
                propValue.tcw = null;
            }
        }

        if (!orderValid) {
            order = [];

            if (!this.isKPI) {
                createNonKPIDefaultCol.call(this);
            } else {
                createKPIDefaultCol.call(this);

            }
        }

        var otherProps = this.otherProps;
        // Set the background opacity TQMS 531313
        //        this.domNode.style.background = "rgba(255, 255, 255," + otherProps.mfBkgOpacity + ")";

        //TODO: will be removed after sort on mobile is enable
        if (otherProps.mpSortKey && otherProps.mpSortKey.length > 0) {
            var tempSortKey = "";
            for (var i = 0; i < otherProps.mpSortKey.length; i++) {
                if (otherProps.mpSortKey[i] == '_') {
                    break;
                }
                tempSortKey += otherProps.mpSortKey[i];
            }

            var mIdx = METRIC_INDEX[tempSortKey];
            if (mIdx >= 0) {
                //sort by metric value
                otherProps.mpSortKey = mIdx
            } else {
                //sort by attr, find attr id
                for (var id in ID_NAME) {
                    if (ID_NAME[id] == tempSortKey) {
                        otherProps.mpSortKey = id;
                        break;
                    }
                }

                if (!ID_NAME[otherProps.mpSortKey]) {
                    //not found this sort key
                    otherProps.mpSortKey = null;
                }
            }
        } else {
            otherProps.mpSortKey = null;
        }
        //TODO: above will be removed after sort on mobile is enable

        // xiawang: Inherit from GridGraph. We should assign headerCssClass and valueCssClass
        // TQMS 723274: disable 'Inherit grid formatting' when use dark theme or light theme
        if (otherProps.mbInheritFromGridGraph && (this.theme == CUSTOM_DARK_THEME || this.theme == CUSTOM_LIGHT_THEME)) {
            try {
                var headerIndex = m.headercni ? m.headercni : 0;
                var valueIndex = m.valuecni ? m.valuecni : (m.css.length - 1);

                var getCssClass = function (name) {
                    if (name) {
                        //!= undefined && != null
                        return name;
                    }

                    return "";

                }

                this.headerCssClass = getCssClass(m.css[headerIndex].n);
                this.valueCssClass = getCssClass(m.css[valueIndex].n);

                //get the default fontSize from valueCssClass
                if (this.valueCssClass && this.valueCssClass.length > 0) {
                    var textSpan = this.textSpan;
                    textSpan.className = this.valueCssClass;
                    textSpan.style.font = "";

                    this.fontSize = mstrmojo.css.getStyleValue(textSpan, 'fontSize');

                }

                //TQMS 712632: if the text height is larger than the rowHeight, change the rowHeight to hold the text
                var fontHeight = this.getTextHeight("a", this.valueCssClass, true);
                if (fontHeight > otherProps.mRowHeight) {
                    otherProps.mRowHeight = fontHeight;
                }
            } catch (err) {
                // do nothing if error happens
            }
        }

        // xiawang: The header of each chart and lengend should follow locale specific settings.
        var applyLocale = function (proOwner, proName, dftStr, hasBracket, descID) {
            var compareStr = dftStr;
            var returnStr;
            if (hasBracket) {
                compareStr = "[" + dftStr + "]";
            }

            if (proOwner[proName] === compareStr) {
                // need replacement
                returnStr = mstrmojo.desc(descID, dftStr);
                if (hasBracket) {
                    returnStr = "[" + returnStr + "]";
                }
                proOwner[proName] = returnStr;
            }
        };

        if (forSort) {
            //when do sort, we don't need to rebuild the colInfos, only need to update the rowH reference
            var colInfos = this.colInfos,
                colCount = colInfos.length;
            for (var i = 0; i < colCount; i++) {
                var colInfo = colInfos[i],
                    orderID = colInfo.order,
                    oldRowH = colInfo.rowH;
                if (oldRowH) {
                    for (var j = 0; j < rows.length; j++) {
                        var rowH = rows[j];

                        var findTheRowH = (oldRowH.id == rowH.id) && (oldRowH.fid == rowH.fid);

                        if (findTheRowH) {
                            rowH.colIdx = oldRowH.colIdx;
                            colInfo.rowH = rowH;

                            if (rowH.sc && rowH.sc.tks && rowH.sc.tks != "") {
                                colInfo.sc = rowH.sc;
                            }

                            if (rowH.lm && rowH.lm.length > 0 && rowH.lm[0].links) {
                                colInfo.lm = rowH;
                            }
                            break;
                        }
                    }
                }
                if (colInfo.type == TREE_TRIANGLE) {
                    this.treeColumnIdx = i;
                }
            }
        } else {
            buildColInfos.call(this, metricIdx);
        }

        if (!this.isKPI) {
            convertAttributeDrivenData(this);
        } else {

            convert(this);
        }

        // if no data, display the error message
        var kpi = otherProps.mnMetricsPerKPI;
        var m = this.model.data;

        if (this.isKPI && metricL < kpi) {
            var errmsg = "Metric per KPI should be at least 1 or less than or equal to the total number of Metrics in the widget";
            m.err = errmsg;
            return;
        }

        if (models.length == 0) {
            var errmsg = "No data returned for this view, this might be because the applied filter excludes all data";
            m.err = errmsg;
            return;
        }

        this.showMinLabel = bulletShowMinLabel.call(this);

        this.buildRows();

        m.processed = true;

    }

    /*
     * xiawang: other than check the order valid, we may also convert the order into expected order
     */
    function processAndCheckOrderValid() {

        for (var i = 0; i < order.length; i++) {
            if (order[i] == "LineChart" || order[i] == "BarChart"
                || order[i] == "GaugeChart" || order[i] == "Metric") {
                // xiawang: Metric is also a valid string
                continue;
            }
            if (order[i].length < 3) {
                return false;
            }
            var tstStr = order[i];
            var len = tstStr.length;

            if (tstStr[len - 2] == '|') {
                order[i] = tstStr = tstStr.substring(0, len - 2);
            }
            if (!ID_NAME[tstStr]) {
                return false;
            } else if (METRIC_INDEX[tstStr] !== undefined) {
                // xiawang: we should make sure that every order is string
                order[i] = METRIC_INDEX[tstStr] + "";
            } else if (this.isKPI) {
                order[i] = "0";
            }
        }

        if (this.enableSmoothScroll) {
            return false;
        }

        var m = this.model.data,
            metricES = m.gts.col[0].es;
        var columnIDs = [],
            cIDs = [];
        if (this.isTreeMode) {
            columnIDs = this.otherProps.mpColumnIDsInTreeMode;
            if (columnIDs.length == 1) {
                return false;
            }

            for (var i = 0; i < metricES.length; i++) {
                var metricID = metricES[i].oid;
                cIDs.push(metricID);
            }
        } else {
            //non tree mode
            columnIDs = this.otherProps.mpColumnIDs;
            if (this.isKPI) {
                if (columnIDs.length <= 1) {
                    // TQMS 538305
                    // xiawang: For some old document, the cid length is less than 1. We then should not rely on .co property
                    return false;
                }

                cIDs.push("Metric");
                var metricPerKPI = this.otherProps.mnMetricsPerKPI;
                if (metricPerKPI > 2) {
                    for (var i = 0; i < metricPerKPI; i++) {
                        if (i % metricPerKPI <= 1) {
                            //exclude the first and second attribute
                            continue;
                        }
                        var metricID = metricES[i].oid;
                        cIDs.push(metricID);
                    }
                }

            } else {// no KPI
                if (columnIDs.length == 1) {
                    return false;
                }
                var rows = m.gts.row,
                    attrCnt = rows.length - 1,
                    rowHeaderCnt = 0;

                for (var i = 0; i < attrCnt; i++) {
                    var attr = rows[i],
                        attrFormCnt = attr.fs && attr.fs.length;
                    cIDs.push(attr.id);

                    for (var j = 1; j < attrFormCnt; j++) {
                        cIDs.push(attr.fs[j].id);
                    }
                    rowHeaderCnt += attrFormCnt;
                }

                for (var i = 0; i < metricES.length; i++) {
                    var metricID = metricES[i].oid;
                    cIDs.push(metricID);
                }

            }

        }

        if (cIDs.length != columnIDs.length) {
            return false;
        }
        for (var i = 0; i < cIDs.length; i++) {
            var metricID = cIDs[i];
            if ($ARR.indexOf(columnIDs, metricID) == -1) {
                //can't find this metric
                return false;
            }
        }

        return true;
    }

    function createKPIDefaultCol() {
        var ind = 0;
        var otherProps = this.otherProps,
            sparklineProps = this.sparklineProps,
            barProps = this.barProps,
            bulletProps = this.bulletProps;

        order[ind++] = "Metric";
        var kpi = otherProps.mnMetricsPerKPI;
        if (isNaN(kpi)) {
            kpi = 1;
        }
        var firstChartShow = false;
        if (sparklineProps.mbShow) {
            firstChartShow = true;
            order[ind++] = "LineChart";
        }
        if (barProps.mbShow) {
            firstChartShow = true;
            order[ind++] = "BarChart";
        }
        if ((!firstChartShow && otherProps.mbShowForHiddenGraphs)
            || (firstChartShow && sparklineProps.mbAssMetric)) {
            // xiawang: TQMS533526 the associated metric should only show if at
            // least one of line chart and bar chart is shown
            order[ind++] = "0";
        }

        if (kpi >= 7) {
            if (bulletProps.mbShow) {
                if (bulletProps.mbAssMetric) {
                    order[ind++] = "2";
                }
                order[ind++] = "GaugeChart";
            } else if (otherProps.mbShowForHiddenGraphs) {
                for (var i = 3; i <= kpi && i <= 7; i++) {
                    order[ind++] = "" + (i - 1);
                }
            }
            for (var i = 8; i <= kpi; i++) {
                order[ind++] = "" + (i - 1);
            }
        } else {
            for (var i = 3; i <= kpi; i++) {
                order[ind++] = "" + (i - 1);
            }
        }
    }

    function createNonKPIDefaultCol() {
        var ind = 0;
        var m = this.model.data,
            rows = m.gts.row,
            cols = m.gts.col;
        var mtrcNum = 0;

        if (this.isTreeMode) {
            order[ind++] = rows[0].id;
        } else {

            for (var i = 0; i < rows.length - GFL; i++) {
                if (rows[i].fs && rows[i].fs.length > 0) {
                    for (var q = 0; q < rows[i].fs.length; q++) {
                        order[ind++] = rows[i].id + ":" + rows[i].fs[q].id;
                    }
                } else {
                    if (rows[i].fid && rows[i].fid.length > 0) {
                        order[ind++] = rows[i].id + ":" + rows[i].fid;
                    } else {
                        order[ind++] = rows[i].id;
                    }
                }
            }
        }

        for (var i = 0; i < cols.length; i++) {
            if (cols[i].n = "Metrics") {
                mtrcNum = cols[i].es.length;
            }
        }

        var firstChartShow = false;
        if (this.sparklineProps.mbShow) {
            firstChartShow = true;
            order[ind++] = "LineChart";
        }
        if (this.barProps.mbShow) {
            firstChartShow = true;
            order[ind++] = "BarChart";
        }
        if ((!firstChartShow && this.otherProps.mbShowForHiddenGraphs)
            || (firstChartShow && this.sparklineProps.mbAssMetric)) {
            // xiawang: TQMS533526 the associated metric should only show if at
            // least one of line chart and bar chart is shown
            order[ind++] = "0";
        }

        if (mtrcNum >= 7) {
            if (this.bulletProps.mbShow) {
                if (this.bulletProps.mbAssMetric) {
                    order[ind++] = "2";
                }
                order[ind++] = "GaugeChart";
            } else if (this.otherProps.mbShowForHiddenGraphs) {
                for (var i = 3; i <= 7 && i <= mtrcNum; i++) {
                    order[ind++] = "" + (i - 1);
                }
            }
            for (var i = 8; i <= mtrcNum; i++) {
                order[ind++] = "" + (i - 1);
            }
        } else {
            for (var i = 3; i <= mtrcNum; i++) {
                order[ind++] = "" + (i - 1);
            }
        }
    }

    function convertAttributeDrivenData(w) {
        var m = w.model.data,
            metricES = m.gts.col[0].es,
            rows = m.gts.row,
            gvsRows = m.gvs.items,
            rl = m.gvs.items.length,
            rhs = m.ghs.rhs.items;

        var rowsLen = rows.length;
        //last attr idx
        var lai = rows.length - GFL;
        //second last attr idx
        var slai = lai - 1;

        var idxPos = 0;
        w.attrMapIdx = []; // xiawang: the attrMapIdx key is attr index.
        // value is the starting idx position of that attr
        var attrMapIdx = w.attrMapIdx;
        for (var q = 0; q < rowsLen; q++) {
            attrMapIdx[q] = idxPos;
            if (!rows[q].fs || rows[q].fs.length == 0) {
                idxPos++;
            } else {
                idxPos += rows[q].fs.length;
            }
        }

        // this last is dummy one but it is helpful if we want to find the last idx pos of (attLen - 1)th attribute
        attrMapIdx[rowsLen] = idxPos;

        var attrName = rows[lai].dn || rows[lai].n;

        /*
         * map: this is an array to map from row column into corresponding idx
         * selectedIdx: attr idx for which is selected
         */
        for (var q = 0; q <= lai; q++) {
            var rowH = rows[q],
                selectable = rowH.sc && rowH.sc.tks && rowH.sc.tks != "";
            if (selectable) {
                rowH.ctlMatrix = {
                    map: [],
                    selectedIdx: {}
                };
            }

        }

        var fnCopyArray = function (src, isIdx) {
            var dest = [];
            for (var i = 0; i < src.length; i++) {
                dest[i] = src[i];
            }
            return dest;
        };

        /*
         * xiawang: process RHS into AttrIndexes array. The reason is to handle
         * special case for un-merged row header grid {0, 0}, {1}, {2}, {1, 0},
         * {1}, {2}
         */
        var AttrIndexes = [];
        var i = 0, j = 0;
        var template = [];
        var tempLen = 0;
        for (i = 0; i < rhs.length; i++) {
            if (i === 0) {
                // For the first row, set up the template
                AttrIndexes[0] = [];
                for (j = 0; j < rhs[i].items.length; j++) {
                    AttrIndexes[0][j] = rhs[0].items[j].idx;
                    if (AttrIndexes[0][j] < 0 && rows[j].otp == -1) {
                        /*
                         * for the CG attr, the " " attr idx is set to
                         * e.g. Category Sales " "            0    4
                         *      Category Sales Books        0    0
                         *      Category Sales Electronics    0    1
                         *      Category Sales Movies        0    2
                         *      Category Sales Music        0    3
                         *      Top 5 Items by Revenue " "    1    5
                         *      Bottom 3 Suppliers       " "    2    6
                         */
                        AttrIndexes[0][j] = rows[j].es.length + AttrIndexes[0][j - 1];
                    }
                    // cet -- default highlight
                    if (rhs[0].items[j].cet) {
                        var id = rhs[0].items[j].cet;
                        var controlMatrix = rows[j].ctlMatrix;
                        if (controlMatrix) {
                            //if it exist
                            controlMatrix.selectedIdx[AttrIndexes[0][j]] = true;
                        }
                    }
                }
                template = fnCopyArray(AttrIndexes[0]);
                tempLen = template.length;
                continue;
            }
            var rhsRow = rhs[i].items;
            var rhsRowLen = rhsRow.length;
            for (j = 1; j <= rhsRowLen; j++) {
                template[tempLen - j] = rhsRow[rhsRowLen - j].idx;
                //TQMS 810342: when the previous attr is also subtotal value, this follow code will result in wrong case
                if (template[tempLen - j] < 0 && rows[tempLen - j].otp == -1) {
                    //find the attribute index
                    var k = 0;
                    for (; k < attrMapIdx.length; k++) {
                        if (tempLen - j < attrMapIdx[k]) {
                            break;
                        }
                    }
                    template[tempLen - j] = rows[k - 1].es.length + rhsRow[rhsRowLen - j - 1].idx;
                }
                if (rhsRow[rhsRowLen - j].cet) {
                    var id = rhsRow[rhsRowLen - j].cet;
                    if (order[rhsRowLen - j] == id + ":CG") {
                        // for custom group, we use seperate control matrix
                        id += ":CG";
                    }
                    var controlMatrix = rows[rhsRowLen - j].ctlMatrix;
                    if (controlMatrix) {
                        controlMatrix.selectedIdx[template[tempLen - j]] = true;
                    }
                }
            }
            AttrIndexes[i] = fnCopyArray(template);
        }

        var fnBEL = function (index) {
            var elms = {};
            var ind = 0;
            for (var i = 0; i < rows.length - GFL; i++) {
                var fL = rows[i].fs.length;
                if (fL < 1) {
                    fL = 1;
                }
                var attId = rows[i].id;
                if (AttrIndexes[index][ind] < 0) {
                    elms[attId] = "";
                } else {
                    elms[attId] = rows[i].es[AttrIndexes[index][ind]];
                }

                if (elms[attId] == undefined) {
                    elms[attId] = {n: ""};
                }

                var fidId = rows[i].fid;
                if (fidId && fidId.length > 0) {
                    elms[attId + ":" + fidId] = rows[i].es[AttrIndexes[index][ind]];
                }
                for (var j = 0; j < fL; j++) {
                    var formId = "";
                    if (rows[i].fs && rows[i].fs[j]) {
                        formId = rows[i].fs[j].id;
                    }
                    if (formId && formId.length > 0) {
                        var afID = attId + ":" + formId;
                        elms[afID] = rows[i].es[AttrIndexes[index][ind]];
                    }
                    ind++;
                }
            }

            return elms;
        };

        var s = {
            v: [],
            rv: [],
            thClr: [],
            hi: [ 0 ]
        };
        var referValue = [];
        var attrElems = null;
        var ch = [
            {
                items: [
                    {
                        n: metricES[0].n
                    }
                ]
            }
        ];

        var c = [],
            baseRow = [],
            j = 0, si = 0,
            isTotal = false,
            compareResult = false;

        function indexChanged(baseRow, newRow) {
            // xiawang: we should compare all the idx from index 0 to idxPos - 1 to determine if row changed
            if (baseRow.length != newRow.length) {
                return true;
            }
            var endIndex = attrMapIdx[lai] - 1;
            if (endIndex >= baseRow.length) {
                endIndex = baseRow.length - 1;
            }
            for (var i = endIndex; i >= 0; i--) {
                // xiawang: There are more chances for the end to be different
                if (baseRow[i] != newRow[i]) {
                    return true;
                }
            }
            return false;
        }

        for (var i = 0; i <= rl; i++) {
            if (i === 0) {
                baseRow = AttrIndexes[i];
            } else if ((compareResult = (i === rl || indexChanged(baseRow,
                AttrIndexes[i])))
                || isTotal) {
                if (isTotal && !compareResult) {
                    // xiawang: we only post the changed one last data for the total case.
                    // so we skip if index not changed or not the last row
                } else {
                    // xiawang: start to update the map of ctlMatrix
                    if (!w.isTreeMode) {
                        for (var x = 0; x < lai; x++) {
                            var controlMatrix = rows[x].ctlMatrix;
                            if (controlMatrix) {
                                controlMatrix.map[si] = AttrIndexes[i - 1][x];
                            }
                        }
                    }

                    models[si] = {
                        isTotal: isTotal,
                        refv: referValue,
                        elms: attrElems,
                        tr: s.v[s.v.length - 1],
                        model: {
                            categories: {
                                items: c,
                                tn: attrName
                            },
                            mtrcs: {
                                items: METRICS
                            },
                            colHeaders: ch,
                            series: [ s ],
                            rowHeaders: [
                                {
                                    n: rows[lai].n
                                }
                            ]
                        }
                    };
                    si++;
                    if (i === rl) {
                        break; // xiawang: i == rl is the ending signal
                    }
                }
                //TQMS 702277:add threshold for bar chart
                s = {
                    v: [],
                    rv: [],
                    thClr: [],
                    hi: [ 0 ]
                };
                referValue = [];

                c = [];

                baseRow = AttrIndexes[i];
                j = 0;
                isTotal = false;
            }

            var otherProps = w.otherProps;

            // xiawang: TQMS 531618;When subtotal is enabled in the grid the
            // value of reference line in sparkline and bar graph should be the
            // total value of the second metric
            for (var p = 0; p < gvsRows[i].items.length; p++) {
                if (!referValue[p]) {
                    referValue[p] = {};
                }
                referValue[p] = gvsRows[i].items[p];
            }

            attrElems = fnBEL(i);

            //TODO: will be removed after sort on mobile is enable
            if (otherProps.mpSortKey != null) {
                var sortByAttr = ( otherProps.mpSortKey != parseInt(otherProps.mpSortKey) );
                if (sortByAttr) {
                    sortValue = attrElems[otherProps.mpSortKey].n;
                } else {
                    //sort by metric value
                    sortValue = parseFloat(referValue[otherProps.mpSortKey].rv);
                }

            }
            //TODO: above will be removed after sort on mobile is enable

            if (!w.isTreeMode) { //TODO: test this issue
                // xianzhang: for none tree mode
                // If one row has subtotal value,
                // we should not show charts for this graph
                var isSubTotal = function (attr) {
                    return (attr.id && attr.id.substring(0, 1) === "D")
                        || (attr.id === undefined && attr.n === "Total");
                };

                for (var k = slai; k >= 0; k--) {
                    var attrES = rows[k].es[AttrIndexes[i][attrMapIdx[k]]];
                    if (attrES && isSubTotal(attrES)) {
                        // this row has subtotal value
                        isTotal = true;
                        break;
                    }
                }

                if (isTotal) {
                    continue;
                }

                var attr = rows[lai].es[AttrIndexes[i][attrMapIdx[lai]]];
                if (attr && isSubTotal(attr)) {
                    // xiawang: TQMS 531573 The subtotal value should not be
                    // displayed in the sparkline and bar graph
                    continue;
                }
            }

            var attrElement = "";
            var attIdxPos = attrMapIdx[lai];
            var thisAtt = null;
            var thisAttFormLen = 1;
            try {
                for (var p = 0; p < GFL; p++) {
                    thisAtt = rows[lai + p];
                    if (thisAtt.fs && thisAtt.fs.length > 0) {
                        // sometimes thisAtt.fs is an empty array, this should go to default case
                        thisAttFormLen = thisAtt.fs.length;
                    } else {
                        thisAttFormLen = 1;
                    }
                    for (var pp = 0; pp < thisAttFormLen; pp++) {
                        attrElement += " " + thisAtt.es[AttrIndexes[i][attIdxPos]].n;
                        attIdxPos++;
                    }
                }
            } catch (err) {
                // just to keep it working if error happens;
            }

            c[j] = attrElement;

            var item = gvsRows[i].items[0];
            s.v[j] = item.v;
            s.rv[j] = item.rv;

            var th = m.th && m.th['0'];
            var ti = item.ti;
            /*
             * threshold color for bar chart is apply under following conditions:
             * 1. inherit from grid and graph
             * 2. threshold not apply to chart == false
             */
            if (ti != undefined && item.ty == 2 && th[ti].cni != undefined && otherProps.mbInheritFromGridGraph) {
                this.textSpan.className = m.css[th[ti].cni].n;
                var compStyle = mstrmojo.css.getComputedStyle(this.textSpan);
                s.thClr[j] = compStyle.backgroundColor;
                if (s.thClr[j] == "rgba(0, 0, 0, 0)") {
                    s.thClr[j] = null;
                }
            } else {
                s.thClr[j] = null;
            }

            j++;
        }

        //TODO: will be removed after sort on mobile is enable

        // sort the models with the sort key
        //        var sortFunc = function(m1, m2){
        //            var sortV1 = m1.sortV,
        //                sortV2 = m2.sortV;
        //            if (otherProps.mbSortDescend){
        //                if(sortV1 > sortV2) {
        //                    return -1;
        //                }else if(sortV1 > sortV2){
        //                    return 1;
        //                }else{
        //                    return 0;
        //                }
        //            }else{
        //                if(sortV1 > sortV2) {
        //                    return 1;
        //                }else if(sortV1 > sortV2){
        //                    return -1;
        //                }else{
        //                    return 0;
        //                }
        //            }
        //        };

        //        models.sort(sortFunc);

        if (otherProps.mpSortKey != null) {
            if (w.isTreeMode) {

            } else {
                var rowCount = models.length;
                for (var i = 0; i < rowCount; i++) {
                    for (var j = 0; j < rowCount - 1; j++) {
                        if ((otherProps.mbSortDescend && models[j].sortV < models[j + 1].sortV)
                            || (!otherProps.mbSortDescend && models[j].sortV > models[j + 1].sortV)) {
                            var temp = models[j];
                            models[j] = models[j + 1];
                            models[j + 1] = temp;
                        }
                    }
                }
            }

        }

        //TODO: above will be removed after sort on mobile is enable

        if (w.isTreeMode) {
            // is tree display
            convertDataToTreeModels.call(w, AttrIndexes);
        }

    }

    function convert(w) {
        var m = w.model.data,
            rows = m.gts.row,
            cols = m.gts.col,
            cs = rows[rows.length - 1].es,
            sn = cols[0].es,
            idxItems = m.ghs.rhs.items,
            csl = idxItems.length,
            v = m.gvs.items,
            ch = [];

        for (var i = 0; i < sn.length; i++) {
            if (!ch[0]) {
                ch[0] = {
                    items: []
                };
            }
            ch[0].items[i] = [
                {
                    n: sn[i].n
                }
            ];
        }

        var vl = v[0].items.length;

        var series = [];
        var c = [];
        var attrName = m.gts.row[0].dn || m.gts.row[0].n;

        var referValue = [];
        var kpi = w.otherProps.mnMetricsPerKPI;
        if (isNaN(kpi)) {
            kpi = 1;
        }
        var sNum = 0;
        var metrixIdxArray = [];
        for (var i = 0; i + kpi <= vl; i = i + kpi) {
            var fv = [];
            var rv = [];
            series[sNum] = {
                v: fv,
                rv: rv,
                hi: [ 0 ]
            };
            var refV = [];
            referValue[sNum] = {
                refv: refV
            };
            for (var j = 0; j < kpi; j++) {
                referValue[sNum].refv[j] = v[csl - 1].items[i + j];
            }
            metrixIdxArray[sNum] = i;
            sNum++;
        }

        for (var i = 0; i < csl; i++) {
            var idxItemsItems = idxItems[i].items;
            //in the case if we have CG, the idx might not be equal to row index
            var idx = idxItemsItems[idxItemsItems.length - 1].idx;
            if (isNaN(idx)) {
                console.log("idx is not a number!" + idx);
                // this is unexpected. However, if it happens, we should still be able to handle it
                c[i] = cs[i].n;
            } else {
                if (idx < 0) {
                    c[i] = "";
                } else {
                    c[i] = cs[idx].n;
                }
                // so we should always use the last idx of any row
                for (var k = 2; k <= idxItemsItems.length && k <= rows.length; k++) {
                    // in case of CG and in KPI,then all idx referes to CG
                    var anotherIdx = idxItemsItems[idxItemsItems.length - k].idx;
                    if (!isNaN(anotherIdx)) {
                        // if previous idx is different as current idx, we should show both string
                        c[i] = rows[rows.length - k].es[anotherIdx].n + " " + c[i];
                    }
                }

            }
            var ind = 0;
            for (var j = 0; j + kpi <= vl; j = j + kpi) {
                series[ind].v[i] = v[i].items[j].v;
                series[ind].rv[i] = v[i].items[j].rv;
                ind++;
            }
        }

        var sl = series.length;
        for (var i = 0; i < sl; i++) {
            var elmsValue = {};
            elmsValue[m.gts.row[0].id] = ch[0].items[i * kpi][0];
            if (m.gts.row[0].fid) {
                elmsValue[m.gts.row[0].id + ":" + m.gts.row[0].fid] = ch[0].items[i * kpi][0];
            }
            elmsValue["Metric"] = ch[0].items[i * kpi][0];
            models[i] = {
                refv: referValue[i].refv,
                elms: elmsValue,
                tr: series[i].v[series[i].v.length - 1],
                model: {
                    categories: {
                        items: c,
                        tn: attrName
                    },
                    mtrcs: {
                        items: METRICS
                    },
                    series: [ series[i] ],
                    colHeaders: [
                        {
                            items: ch[0].items[i]
                        }
                    ],
                    rowHeaders: [
                        {
                            n: rows[0].n
                        }
                    ]
                },
                metricIdx: metrixIdxArray[i]
            };
        }
    }

    function bulletShowMinLabel() {
        var showMinLabel = false;
        var otherProps = this.otherProps;
        if (this.showGauge) {
            var minValue = this.bulletProps.mfMinValue;
            var count = models.length;
            for (var i = 0; i < count; i++) {
                var v = models[i].refv[2];
                if (v && v.rv < minValue) {
                    showMinLabel = true;
                    otherProps.mRowHeight = otherProps.mRowHeight > 36 ? otherProps.mRowHeight : 36;
                    break;
                }

            }

        }

        return showMinLabel;
    }

    function getFirstRowUnderDockedHeader(yPos) {
        var scl = this.getChartWithScrollBar()._scroller;
        var y = yPos != undefined ? yPos : scl && scl.origin && scl.origin.y;
        var rowOffsetHeight = this.rowOffsetHeight;

        var rowIdx = this.startCnt + parseInt(y / rowOffsetHeight) + this.dockedHeaderRows.length;//this.dockedHeaderCount;
        var rowPast = y % rowOffsetHeight;

        var rowInfo = getRowAtIdx.call(this, rowIdx);

        return{rowInfo: rowInfo, treeNode: rowInfo.treeNode, pastOffset: rowPast, rowIdx: rowIdx};
    }

    function getRowAtIdx(rowIdx) {
        if (rowIdx < 0) {
            rowIdx = 0;
        }
        var maxRowIdx = this.rows.length - 1;
        if (rowIdx > maxRowIdx) {
            rowIdx = maxRowIdx;
        }

        return this.rows[rowIdx];
    }

    /*
     * generate all the rows shown under current expand status
     * allExpand: if true, we get all rows no matter if the treeNode is expanded
     * rowCnt: only get the first rowCnt rows
     */
    function getTreeNodeRows(allExpand, rowCnt) {
        var preOrderTreeNodeQueue = [];
        var treeNode = null;
        var rows = [];

        //init the queue
        var treeNodeList = this.tree.childrenTreeNodeList;
        var childrenCount = treeNodeList.length;
        for (var i = childrenCount - 1; i >= 0; i--) {
            preOrderTreeNodeQueue.push(treeNodeList[i]);
        }

        var rowCount = 0;
        //pre order travel tree to find the first row node
        while (preOrderTreeNodeQueue.length > 0) {
            treeNode = preOrderTreeNodeQueue.pop();
            var row = {treeNode: treeNode,
                model: treeNode.model,
                rowIdx: rowCount,
                selected: treeNode.selected,
                rowRef: {}};
            rows.push(row);
            if (!allExpand) {
                treeNode.rowIdx = rowCount++;
            }

            if (rowCnt && rowCount >= rowCnt) {
                break;
            }
            if (treeNode.needExpand || allExpand) {
                treeNodeList = treeNode.childrenTreeNodeList;
                childrenCount = treeNodeList.length;
                for (var i = childrenCount - 1; i >= 0; i--) {
                    preOrderTreeNodeQueue.push(treeNodeList[i]);
                }
            }
        }

        return rows;

    }

    function getLowestLevelOnScreen() {
        var scl = this.getChartWithScrollBar()._scroller;
        var y = scl && scl.origin && scl.origin.y;
        var rowOffsetHeight = this.rowOffsetHeight;

        var firstRowIdx = this.startCnt + parseInt(y / rowOffsetHeight);//+ this.dockedHeaderCount;
        var chartHeight = Math.min(this.chartTableMaxHeight, parseInt(this._leftChart.itemsContainerNode.style.height));
        var lastRowIdx = this.startCnt + parseInt((y + chartHeight) / rowOffsetHeight);

        if (firstRowIdx < 0) {
            firstRowIdx = 0;
        }
        if (lastRowIdx >= this.rows.length) {
            lastRowIdx = this.rows.length - 1;
        }

        var lowestLevel = -1;
        for (var i = firstRowIdx; i <= lastRowIdx; i++) {
            var currLevel = this.rows[i].treeNode.level;
            if (currLevel > lowestLevel) {
                lowestLevel = currLevel;
            }
        }

        return lowestLevel;
    }

    function removeChildren(container) {
        var count = container && container.childNodes && container.childNodes.length;
        for (var i = 0; i < count; ++i) {
            container.removeChild(container.firstChild);
        }

    }

    function hasScrollDownPast(yPos) {
        return yPos < 0;
    }

    function expandOrCollapseTreeAndSetScrlPos(levelToExpand, anchorRowTreeNode, anchorRowIdxOnScrn) {

        if (this.expandToLevel == levelToExpand) {
            //do nothing
            return;
        }

        setNeedExpandToLevel(this.tree, levelToExpand);

        this.expandToLevel = levelToExpand;

        this.rowsNeedRebuild = true;

        this.reRenderChartWithAnchor(anchorRowTreeNode, anchorRowIdxOnScrn);

        setChartTableHeight.call(this);

        this.reBuildDH(levelToExpand);

    }

    function expandTreeNodeAndSetScrlPos(rowInfo, rowType) {
        var treeNode = rowInfo.treeNode;

        treeNode.needExpand = true;

        this.expandToLevel = -1;

        var scl = this.getChartWithScrollBar()._scroller;

        var currRowIdx = rowInfo.rowIdx;

        this.reRenderChart(scl.origin);

        setChartTableHeight.call(this);

        if (currRowIdx == this.startCnt + parseInt(scl.origin.y / this.rowOffsetHeight) + this.dockedHeaderRows.length) {
            //add this row to dockedHeader

            var rowIdxList = [];
            var currRowTreeNode = rowInfo.treeNode;
            while (currRowTreeNode.needExpand) {
                //first row lower than last docked header
                //add to dockedHeaders, dockedHeaderCount++
                rowIdxList.push(currRowIdx);
                currRowTreeNode = getRowAtIdx.call(this, ++currRowIdx).treeNode;
            }
            this.addRowsToDH(rowIdxList);

            //            this.dockedHeaderCount = this.dockedHeaderRows.length;
        }

        /*
         * PM required:
         * When the last row is expanded, there is not indication to the user apart from the triangle changing its orientation
         * To combat this, along with changing the triangle's orientation, we will also automatically scroll up by 2 rows worth of pixels,
         * so that two child rows wil be visible.
         */
        var rowOffsetHeight = this.rowOffsetHeight;
        var lastRowOnScrnIdx = this.startCnt + Math.round((scl.origin.y + this.chartTableHeight) / rowOffsetHeight) - 1;
        if (currRowIdx == lastRowOnScrnIdx) {
            var scroller = scl;
            var maxYPos = Math.min(scl.origin.y + 2 * rowOffsetHeight, scl.offset.y.end);
            scl.origin.y = maxYPos;

            //            $D.translate(scroller.scrollEl, -scroller.origin.x, -scroller.origin.y, 0, scroller.transform, scroller.useTranslate3d);

            this._leftChart.scrollTo(scl.origin);
            if (this._rightChart) {
                this._rightChart.scrollTo(scl.origin);
            }

            this.onScrollMoved({y: maxYPos});
        }

    }

    function getIdxByRowIdx(rows, targetIdx) {
        var rowCount = rows.length;
        for (var i = 0; i < rowCount; i++) {
            var rowInfoDH = rows[i];
            if (rowInfoDH.rowIdx == targetIdx) {
                return i;
            }
        }
        return -1;
    }

    function collapseTreeNodeAndSetScrlPos(rowInfo, rowType) {
        var treeNode = rowInfo.treeNode;
        treeNode.needExpand = false;

        this.expandToLevel = -1;

        var scl = this.getChartWithScrollBar()._scroller;

        if (rowType == DOCKED_HEADER) {

            var adjustOffset = 0;
            //find this docked header in dockedHeaderRows
            var rowCount = this.dockedHeaderRows.length;
            var dockedHeaderIdx = getIdxByRowIdx(this.dockedHeaderRows, rowInfo.rowIdx);

            if (dockedHeaderIdx >= 0) {
                this.removeRowsFromDH(rowCount - dockedHeaderIdx);
                //                this.dockedHeaderCount  = this.dockedHeaderRows.length;
                this.removeChildrenForDHReplaceTable();
                this.dockedHeaderStatus = NO_REPLACE;

            } else {
                //find this docked header in dockedHeaderReplaceRows
                dockedHeaderIdx = getIdxByRowIdx(this.dockedHeaderReplaceRows, rowInfo.rowIdx);

                if (dockedHeaderIdx < 0) {
                    //should not occur
                    return;
                }
                dockedHeaderIdx += rowCount;
                adjustOffset = scl.origin.y % this.rowOffsetHeight;
                this.removeChildrenForDHReplaceTable();
                this.dockedHeaderStatus = NO_REPLACE;
                //                this.dockedHeaderCount  = this.dockedHeaderRows.length;
            }

            var rowCount = this.startCnt + parseInt(scl.origin.y / this.rowOffsetHeight) + dockedHeaderIdx - rowInfo.rowIdx;
            this.reRenderChart(scl.origin, rowCount, adjustOffset);
        } else if (rowType == OTHER_ROW) {

            this.reRenderChart(scl.origin);
        }

        setChartTableHeight.call(this);

    }

    var hideTooltipGlobal = function () {
        if (this._tooltip.show) {
            var highLightCav = document.getElementById("highLightCav"
                + this.domNode.id);
            if (highLightCav) {
                highLightCav.id = "";
                //                highLightCav.height = highLightCav.height;
                //clear canvas
                var context = highLightCav.getContext('2d');
                context.clearRect(0, 0, highLightCav.width, highLightCav.height);
            }
            // here, this referes to domNode
            this._tooltip.toggle(false);
            this.tooltipShow = false;

            if (this._touchListener) {
                var touchManager = mstrmojo.touchManager;
                touchManager.detachEventListener(this._touchListener);
                delete this._touchListener;
            }

        }
    };

    function setChartTableHeight() {
        if (!this._leftChart) {
            return;
        }

        var chartTableOffsetHeight = (this.otherProps.mbHideTextColumns && this.enableSmoothScroll) ? this._rightChart.chartTableOffsetHeight : this._leftChart.chartTableOffsetHeight;
        var headerTableOffsetHeight = (this.otherProps.mbHideTextColumns && this.enableSmoothScroll) ? this._rightChart.headerTableOffsetHeight : this._leftChart.headerTableOffsetHeight;
        this.headerTableOffsetHeight = headerTableOffsetHeight;

        var chartTableHeight = 0;
        //if parent domNode display is 'none', we will get the offsetHeight is 0
        if (chartTableOffsetHeight >= this.chartTableMaxHeight || chartTableOffsetHeight === 0) {
            chartTableHeight = this.chartTableMaxHeight;
        } else {
            chartTableHeight = chartTableOffsetHeight;
        }

        this._leftChart.itemsContainerNode.style.height = chartTableHeight + "px";
        if (this._rightChart) {
            this._rightChart.itemsContainerNode.style.height = chartTableHeight + "px";
        }

        this.legend.style.top = (headerTableOffsetHeight + chartTableHeight) + "px";
        this.dropShadowDiv.style.height = (headerTableOffsetHeight + chartTableHeight) + "px";

        this.indicatorEl.parentNode.style.top = headerTableOffsetHeight + "px";
        this.indicatorEl.parentNode.style.height = chartTableHeight + "px";

        this.chartTableHeight = chartTableHeight;

        //test if the chart is scroll beyond the position it should be
        //this happend when collapse the treeNode at the end, or rotate
        var scl = this.getChartWithScrollBar()._scroller;
        //var yPos = scl.origin.y;
        var yPos = 0;
        var maxYPos = chartTableOffsetHeight - chartTableHeight + 2;
        var rowOffsetHeight = this.rowOffsetHeight;
        if (yPos > maxYPos) {
            if (scl && scl.vScroll) {
                scl.origin.y = maxYPos;
                this._leftChart.scrollTo(scl.origin);
                if (this._rightChart) {
                    this._rightChart.scrollTo(scl.origin);
                }

                while ((yPos = yPos - rowOffsetHeight) > maxYPos) {
                    this.updateDockedHeadersByOneRow(yPos, true);
                }
                this.updateDockedHeadersByOneRow(maxYPos);

                this.firstRowIdxOnScrn = parseInt(this.startCnt + scl.origin.y / rowOffsetHeight);
            } else {
                //scl.origin.y = 0;
                this._leftChart.scrollTo({
                    x: 0,
                    y: 0
                });
                if (this._rightChart) {
                    this._rightChart.scrollTo({
                    x: 0,
                    y: 0
                });
                }
                this.firstRowIdxOnScrn = parseInt(this.startCnt )
            }

        }

        this.updateWindowRatio();
        this.updateScrollBarPosition();
    }

    function setScrollerPosition(scrollTo) {

        var scl = {},
            icn = this.rightChart,
            offsetEnd = this.rightChart.offsetWidth - ( this.getWidth() - this.leftWidth );

        scl.origin = {
            x: scrollTo && scrollTo.x || 0,
            y: scrollTo && scrollTo.y || 0
        };

        scl.showScrollbars = true;
        scl.hScroll = (offsetEnd !== 0 && scl.noHScroll !== true) || this.scrollPast;

        if (scl.hScroll) {

            scl.offset = {
                x: {
                    start: 0,
                    end: offsetEnd
                },
                scrollPast: this.scrollPast
            };
        }

        this.utils.translateCSS(-scl.origin.x, -scl.origin.y, false, icn);
    }

    /**
     * notClearHighlight -- true:
     * When we open infow on phone, the info window will open in a new view, so we need to clear the status so that when back from infow, the highlight will not show
     */
    function clearHighlightOnIfwClosed(notClearHighlight) {
        var me = this;
        if (me.isTreeMode) {
            var treeNode = me.lastSelectedObj[me.lastSelectedObj.length - 1];
            if (treeNode && treeNode.treePath) {
                //store the attr info for the infoWindow, so when tap on this attr again will not trigger infow
                me.closedIfwAttr = treeNode.treePath;
                me.currSelectedObj = [];

                if (!notClearHighlight) {
                    // update the highlight
                    me.updateSelectedStatus(me.tree);
                    me.updateHighlightForCurrRenderRows();
                }

                me.lastSelectedObj = [];
            }
        } else {
            if (me.isAllAttrSelectable) {
                //store the attr info for the infoWindow, so when tap on this attr again will not trigger infow
                me.closedIfwAttr = me.prevSelected.mrow;

                me.prevSelected = {mrow: -2, mcol: -1};
                me.unselectedRemainCells = [];
                me.updateUnselectedRemainCells();

                if (!notClearHighlight) {
                    // update the highlight
                    me.updateSelectedStatus();
                    me.updateHighlightForCurrRenderRows();
                }

            } else {
                //not entire row mode
                var mcol = me.prevSelected && me.prevSelected.mcol,
                    colInfo = me.getCGColInfo(mcol, true);

                if (!colInfo) {
                    //no prevSelection, do nothing and return
                    return;
                }

                var ctlMatrix = colInfo.rowH.ctlMatrix,
                    colInfoCG = this.getCGColInfo(mcol),
                    ctlMatrixCG = colInfoCG && colInfoCG.rowH.ctlMatrix;

                //TODO: the closedIfwAttr may not correct when there is CG
                //store the attr info for the infoWindow, so when tap on this attr again will not trigger infow
                var selectedIdx = Object.keys(ctlMatrix.selectedIdx)[0];
                me.closedIfwAttr = colInfo.rowH.es[selectedIdx].id;

                ctlMatrix.selectedIdx = {};

                if (ctlMatrixCG) {
                    ctlMatrixCG.selectedIdx = {};
                }

                if (!notClearHighlight) {
                    // update the highlight
                    me.updateSelectedStatus();
                    me.updateHighlightForCurrRenderRows();
                }

            }

        }
    }

    /**
     * @class
     *
     * @extends mstrmojo.Vis
     *
     * @mixes mstrmojo._TouchGestures
     * @mixes mstrmojo._HasTouchScroller
     */
    mstrmojo.plugins.VisMicroChart.VisMicroChart = mstrmojo.declare(
        mstrmojo.plugins.VisMicroChart.MicroChartVisBase,

        null,

        /**
         * @lends mstrmojo.VisMicroChart.prototype
         */
        {


            //scriptClass: 'mstrmojo.VisMicroChart',
            scriptClass: 'mstrmojo.plugins.VisMicroChart.VisMicroChart',

            utils: mstrmojo.plugins.VisMicroChart.VisChartUtils,

            scrollerConfig: {
                bounces: false,
                showScrollbars: true,
                vScroll: false,
                hScroll: true,
                useTranslate3d: false
            },


            scrollPast: false,


            legendHeight: 30,


            //PM require: do not need gradient
            selectedStyle: "background-color:#015DE6;color:#FFFFFF;",

            //                        selectedStyle : "background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #058CF5), color-stop(1, #015DE6));color:#FFFFFF;",

            selectedClass: "",

            isAllAttrSelectable: false,

            // -2 for default, -1 for header total, 0, 1, 2 for concrete row
            prevSelected: {
                mrow: -2,
                mcol: -1
            },

            rows: [],

            dockedHeaderRows: [],

            dockedHeaderReplaceRows: [],

            rowsReusePool: [],

            unselectedRemainCells: [],

            isTreeMode: false,

            isKPI: false,

            showMinLabel: false,

            rowsNeedRebuild: true,

            lastScrollPosition: {y: 0},

            /*
             * start and end idx for the rows curr rendered
             */
            startCnt: -1,

            endCnt: -1,

            /*
             * the row index for the first row on screen
             * the index in this.rows array
             * used to decide startCnt and end Cnt
             */
            firstRowIdxOnScrn: 0,

            pageSize: 10,

            mcStatus: null,

            //default font size
            fontSize: '10pt',

            headerCssClass: '',

            valueCssClass: '',

            //smooth scroll setting:
            enableSmoothScroll: false,

            metricColumnsSpacing: NORMAL,

            attrColumnCount: 0,

            dropShadowWidth: 5,

            markupString: '<div id="{@id}-microchart" class="mstrmojo-Chart {@cssClass}" style="width:{@width};height:{@height};left:{@left};top:{@top};z-index:{@zIndex};position:absolute" '
            + ' mstrAttach:mouseover,mouseout,click >'
            +
            '<div id="{@id}-microchart-left" style="width:{@leftWidth+"px"};height:{@height};left:0px;right:0px;position:absolute;z-index:1;" > </div>'
            +
            '<div id="{@id}-microchart-smoothscroll-container" class="mstrmojo-Chart {@cssClass}" style="width:{@rightWidth+"px"};height:{@height};left:{@leftWidth+"px"};top:0;position:absolute;overflow:hidden;">'
            + '<div id="{@id}-microchart-right" style="width:{@rightWidth};position:absolute;" > </div>'
            + '<div id="{@id}-drop-shadow-ss" style="position:absolute;left:0px;width:{@dropShadowWidth+"px"}" > </div>'
            + '</div>'
            +
            '<div style="display:none;position:absolute;right:0;z-index:5;height:{@legendHeight + "px"};width:{@width};border:none;background:transparent;text-decoration:none;" class="microchart-lengend-text">'
            + '<div style="position:absolute;right:0;top:0;padding-bottom:7px">'
            + '<div style="float:left;padding-top:7px;">'
            + '<div class="microchart-legend-band" ></div>'
            + '<div style="float:right;margin-right:10px;margin-left:10px;">Low</div>'
            + '</div>'
            + '<div style="float:left;padding-top:7px;">'
            + '<div class="microchart-legend-band"></div>'
            + '<div style="float:right;margin-right:10px;margin-left:10px;">Mid</div>'
            + '</div>'
            + '<div style="float:left;padding-top:7px;">'
            + '<div class="microchart-legend-band"></div>'
            + '<div style="float:right;margin-right:10px;margin-left:10px;">High</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            +
            '<span id="textSpan" style="z-index:-10;visibility:hidden;-webkit-text-size-adjust: none;"></span>'
            +
            '<div id="{@id}-loading-msg" class="mstrmojo-loading-msg" style="display:none;z-index:10"></div>'
            +
            '<canvas id="textCanvas" width="900" height="500" style="z-index:-11;visibility:hidden;-webkit-text-size-adjust: none;"></canvas>'
            +
            '<div id="{@id}-tooltip"></div>'
            +
            '<div id="{@id}-text-tooltip" class="mstrmojo-Chart-tooltip timeseries-legend-tooltip" style="z-index:10"></div>'
            +
            '<div id="{@id}-errMsg" class="mstrmojo-message" style="width:{@width};height:{@height};top:0px;left:0px;position:absolute; display:none; z-index:30;"><div style="width:{@width};position:absolute;top:50%;text-align:center"></div></div>'
            +
            '<div id="{@id}-indicatorEl-container"  style="width:{@width};height:{@height};top:0px;left:0px;position:absolute;z-index:-5"><div></div></div>'
            +
            '<canvas id="{@id}-sort-arrow" width="8" height="15" style="position:absolute"></canvas>'
            +
            '</div>',

            markupSlots: {
                leftChart: function () {
                    return this.domNode.childNodes[0];
                },

                rightChart: function () {
                    return this.domNode.childNodes[1].firstChild;
                },

                dropShadowDiv: function () {
                    return this.domNode.childNodes[1].childNodes[1];
                },

                itemsContainerNode: function () {
                    return this.domNode.childNodes[1];
                },

                textSpan: function () {
                    return this.domNode.childNodes[3];
                },

                loadingMsg: function () {
                    return this.domNode.childNodes[4];
                },

                textCanvas: function () {
                    return this.domNode.childNodes[5];
                },

                tooltip: function () {
                    return this.domNode.childNodes[6];
                },

                textTooltip: function () {
                    return this.domNode.childNodes[7];
                },

                // for displaying error message
                errorMsg: function () {
                    return this.domNode.childNodes[8];
                },

                indicatorEl: function () {
                    return this.domNode.childNodes[9].firstChild;
                },

                sortArrowCanvas: function () {
                    return this.domNode.childNodes[10];
                },

                legend: function () {
                    return this.domNode.childNodes[2];
                },

                legendLow: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[0];
                },

                legendLowFont: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[0].childNodes[1];
                },

                legendLowBand: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[0].childNodes[0];
                },

                legendMid: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[1];
                },

                legendMidFont: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[1].childNodes[1];
                },

                legendMidBand: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[1].childNodes[0];
                },

                legendHigh: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[2];
                },

                legendHighFont: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[2].childNodes[1];
                },

                legendHighBand: function () {
                    return this.domNode.childNodes[2].childNodes[0].childNodes[2].childNodes[0];
                }
            },

            renderErrorMessage: function renderErrorMessage(msg) {
                var contentDiv = this.errorMsg.firstChild;
                contentDiv.innerHTML = msg; //"<div class=\"mstrmojo-message\">" + msg + "</div>";
                this.errorMsg.style.display = 'block';
                var contentHeight = contentDiv.offsetHeight;
                contentDiv.style.marginTop = -0.5 * contentHeight;
            },

            /**
             *
             * @param text the string to meature
             * @param elem the element which provide the computed style used to meatrue text width
             */
            getTextWidthByCanvas: function gtwCvs(text, elem, withPadding) {
                var canvas = this.textCanvas;

                var context = canvas.getContext('2d');

                var computedStyle = mstrmojo.css.getComputedStyle(elem),
                    fontStyle = this.utils.getComputedFontStyle(computedStyle);

                context.font = fontStyle;

                context.textAlign = 'center';
                context.fillStyle = 'blue';

                // get text metrics
                var metrics = context.measureText(text);

                var result = metrics.width;

                if (withPadding) {
                    var addPadding = function (padding) {
                        if (computedStyle[padding]) {
                            result += parseInt(computedStyle[padding]);
                        }
                    }

                    addPadding("paddingLeft");
                    addPadding("paddingRight");
                }

                return result;
            },

            getTextDimesion: function gtwCvs(text, elem) {
                var textSpan = this.textSpan;

                var computedStyle = mstrmojo.css.getComputedStyle(elem),
                    fontStyle = this.utils.getComputedFontStyle(computedStyle);

                textSpan.style.font = fontStyle;

                textSpan.innerHTML = text;

                var result = {width: textSpan.offsetWidth, height: textSpan.offsetHeight};

                //clear the style
                textSpan.style.font = '';

                return result;
            },

            getTextWidth: function gtw(str, className, fontName, fontSize, fontSizeUnit, bold, withoutPadding) {
                var selfTextSpan = this.textSpan;
                if (selfTextSpan.className !== className || "") {
                    selfTextSpan.className = className || "";
                }
                if (selfTextSpan.style.fontFamily !== fontName || "") {
                    selfTextSpan.style.fontFamily = fontName || "";
                }

                var fsUnit = fontSizeUnit || "pt"

                if (fontSize) {
                    selfTextSpan.style.fontSize = fontSize + fsUnit;
                } else {
                    selfTextSpan.style.fontSize = '';
                }

                if (bold) {
                    if (selfTextSpan.style.fontWeight !== 'bold') {
                        selfTextSpan.style.fontWeight = 'bold';
                    }
                } else {
                    if (selfTextSpan.style.fontWeight !== '') {
                        selfTextSpan.style.fontWeight = '';
                    }
                }
                if (withoutPadding) {
                    selfTextSpan.style.padding = "0px 0px";
                } else {
                    selfTextSpan.style.padding = "";
                }

                selfTextSpan.innerHTML = str;
                var ret = selfTextSpan.offsetWidth;
                return ret;
            },

            getTextHeight: function gth(str, className, bold, fontFamily, fontSize) {
                //clear the style
                this.textSpan.style.fontFamily = fontFamily || "";
                this.textSpan.style.fontSize = fontSize || "";
                if (bold) {
                    this.textSpan.style.fontWeight = 'bold';
                } else {
                    this.textSpan.style.fontWeight = '';
                }
                //set the className
                this.textSpan.className = className;
                //set content string
                this.textSpan.innerHTML = str;

                return this.textSpan.offsetHeight;
            },

            /**
             * remove this.mcStatus and mcStatus in docModel as we will recreate them in unrender
             *
             */
            removeMCStatus: function removeMCStatus() {
                this.mcStatus = null;
                if (this.controller && this.controller.view && this.controller.view.model && this.controller.view.model.mcStatus) {
                    delete this.controller.view.model.mcStatus[this.getModelK()];
                }
            },

            restoreMCStatus: function restoreMCStatus() {
                /*
                 * restore the mcStatus
                 */
                if (this.isTreeMode && this.mcStatus && this.mcStatus.currSelectedObj && this.mcStatus.currSelectedObj.length > 0) {
                    this.lastSelectedObj = $HASH.clone(this.currSelectedObj);

                }
                if (this.mcStatus && this.mcStatus.startCnt != undefined && this.mcStatus.endCnt != undefined) {
                    this.startCnt = this.mcStatus.startCnt;
                    this.firstRowIdxOnScrn = this.mcStatus.firstRowIdxOnScrn;

                    var minRowCntToCoverScreen = Math.max(this.mcStatus.endCnt - this.mcStatus.firstRowIdxOnScrn, this.minPageSize);
                    this.endCnt = Math.min(this.mcStatus.firstRowIdxOnScrn + minRowCntToCoverScreen, this.rows.length);
                    //                    console.log("startCnt:"+this.startCnt+", endCnt:"+this.endCnt);
                }

                if (this.isTreeMode && this.mcStatus) {
                    this.replacingStartRowIdx = this.mcStatus.replacingStartRowIdx;
                    this.needReplaceCount = this.mcStatus.needReplaceCount;
                    this.lastFirstRowIdxOnScrn = this.mcStatus.lastFirstRowIdxOnScrn;
                    this.dockedHeaderStatus = this.mcStatus.dockedHeaderStatus;
                    this.lastScrollPosition = this.mcStatus.lastScrollPosition;
                }

                if (this.model.data.prevSelected) {
                    this.prevSelected = this.model.data.prevSelected;
                }
                if (this.model.data.unselectedRemainCells) {
                    this.unselectedRemainCells = this.model.data.unselectedRemainCells;
                }
                if (this.model.data.ctlMatrixs) {
                    var colInfos = this.colInfos;
                    for (var i = 0; i < colInfos.length; i++) {
                        var ctlMatrix = this.model.data.ctlMatrixs[i];
                        if (ctlMatrix && colInfos[i].rowH) {
                            colInfos[i].rowH.ctlMatrix = ctlMatrix;
                        }
                    }

                    var colInfos = this.colInfos;
                    for (var i = 0; i < colInfos.length; i++) {
                        var rowH = colInfos[i].rowH,
                            ctlMatrix = rowH && rowH.ctlMatrix,
                            selectedID = rowH && this.model.data.ctlMatrixs && this.model.data.ctlMatrixs[rowH.id];
                        if (ctlMatrix && selectedID) {
                            for (var j = 0; j < rowH.es.length; j++) {
                                var id = rowH.es[j].id;
                                if (selectedID[id]) {
                                    ctlMatrix.selectedIdx[j] = true;
                                }
                            }
                        }
                    }
                }

            },

            storeMCStatus: function storeMCStatus(noNeedToStoreScrollInfo) {
                if (this.startCnt < 0) {
                    //if no init, no need to store status.
                    return;
                }
                this.mcStatus = {};
                if (this.isTreeMode) {
                    this.mcStatus.expandToLevel = this.expandToLevel || -1;
                    this.mcStatus.expandedEntryArray = [];
                    if (this.mcStatus.expandToLevel < 0) {
                        //we are not expanded to certain level, so store the expanded tree node one by one
                        this.addTreeNodeToExpanedEntry(this.tree.childrenTreeNodeList, []);
                    }

                    this.mcStatus.currSelectedObj = [];

                    /*
                     * store the currSelectedObj for tree mode
                     * change from treepath to treenode id
                     * as after slice, the treepath idx may be changed
                     */
                    for (var i = 0; i < this.currSelectedObj.length; i++) {
                        //if this.currselectedObj[i] is not in the curr data model, it will not be converted to treeNodeIdx
                        //so keep the treeNode id
                        var treeNode = this.currSelectedObj[i];
                        this.mcStatus.currSelectedObj[i] = treeNode && treeNode.id;
                    }

                    /*
                     * for some case, we do not store the scroll position and dockedheader info
                     * e.g. after slice
                     */
                    if (!noNeedToStoreScrollInfo) {
                        this.mcStatus.dHRowIdxList = [];
                        var dHRows = this.dockedHeaderRows;
                        for (var i = 0; i < dHRows.length; i++) {
                            this.mcStatus.dHRowIdxList.push(dHRows[i].rowIdx);
                        }
                        this.mcStatus.dHReplaceRowIdxList = [];
                        var dHRows = this.dockedHeaderReplaceRows;
                        for (var i = 0; i < dHRows.length; i++) {
                            this.mcStatus.dHReplaceRowIdxList.push(dHRows[i].rowIdx);
                        }

                        this.mcStatus.replacingStartRowIdx = this.replacingStartRowIdx;
                        this.mcStatus.needReplaceCount = this.needReplaceCount;
                        this.mcStatus.lastFirstRowIdxOnScrn = this.lastFirstRowIdxOnScrn;
                        this.mcStatus.dockedHeaderStatus = this.dockedHeaderStatus;
                        this.mcStatus.lastScrollPosition = this.lastScrollPosition;
                    }

                } else {
                    /**
                     * TQMS 783349:
                     * store the selection info to model, convert to elementID, to keep consistent after data updated
                     * used to store the selection infomation, so when back from link drill, we can show the correct highlight
                     */

                    if (this.model && this.model.data && this.model.data.processed) {
                        //when onslice, the model is changed when unrender, we don't store the selection info in the new model, as it should be shown as initial highlight
                        this.model.data.prevSelected = this.prevSelected;
                        this.model.data.unselectedRemainCells = this.unselectedRemainCells;
                        this.model.data.ctlMatrixs = {};
                        var colInfos = this.colInfos;
                        for (var i = 0; i < colInfos.length; i++) {
                            var rowH = colInfos[i].rowH,
                                ctlMatrix = rowH && rowH.ctlMatrix;
                            if (ctlMatrix) {
                                var selectedID = {};
                                for (var selectedIdx in ctlMatrix.selectedIdx) {
                                    var eid = rowH.es[selectedIdx].id;
                                    selectedID[eid] = true;
                                }

                                this.model.data.ctlMatrixs[rowH.id] = selectedID;
                            }
                        }

                    }

                }

                if (!noNeedToStoreScrollInfo) {
                    this.mcStatus.startCnt = this.startCnt;
                    this.mcStatus.endCnt = this.endCnt;
                    this.mcStatus.firstRowIdxOnScrn = this.firstRowIdxOnScrn;
                    var chart = this.getChartWithScrollBar()
                    this.mcStatus.scrollTo = chart && chart._scroller && chart._scroller.origin || {x: 0, y: 0};
                }

                if (this.enableSmoothScroll && this._scroller && this._scroller.origin) {
                    //store hscroll position, use percent position
                    this.mcStatus.hScrollPos = this._scroller.origin.x / this.rightWidth;
                }

                /*
                 * stort status in docModel
                 * This is used in case that there are two layouts, one for landscape and one for portrait,
                 *
                 */
                if (this.controller && this.controller.view && this.controller.view.model) {

                    if (!this.controller.view.model.mcStatus) {
                        this.controller.view.model.mcStatus = {};
                    }
                    var modelK = this.getModelK();
                    this.controller.view.model.mcStatus[modelK] = this.mcStatus;
                }

                if (this.sortKeyIdx != undefined) {
                    this.mcStatus.sortKeyIdx = this.sortKeyIdx;
                    this.mcStatus.sortOrder = this.colInfos[this.sortKeyIdx].sortOrder;
                }

            },

            addTreeNodeToExpanedEntry: function addExpanedEntry(treeNodeList, parentEntry) {
                var expEntryArray = this.mcStatus.expandedEntryArray;
                var treeNodeCount = treeNodeList.length;
                for (var i = 0; i < treeNodeCount; i++) {
                    var treeNode = treeNodeList[i];
                    if (treeNode.needExpand) {
                        //clone parentEntry
                        var expandedEntry = $HASH.clone(parentEntry)
                        expandedEntry.push({element: treeNode.id});
                        expEntryArray.push(expandedEntry);
                        //recur
                        this.addTreeNodeToExpanedEntry(treeNode.childrenTreeNodeList, expandedEntry);
                    }
                }

            },

            unrender: function unrender(ignoreDom, noNeedToStoreScrollInfo) {
                //                console.log("in unrender");
                if (!this.mcStatus) {
                    // only update mcStatus for the first time we call unrender
                    // As we will also call unrender in destroy for several times, and the mcStatus may be uncorrect
                    this.storeMCStatus(noNeedToStoreScrollInfo);
                }

                this.destroyChartWidget();

                //need to remove the _scrollBar reference, so that TouchScroller will recreate the scroll bar
                if (this._scroller) {
                    delete this._scroller._scrollBarEls;
                }
                var listener = this._touchListener;
                if (listener) {
                    // Detach event listener and delete listener handle.
                    mstrmojo.touchManager.detachEventListener(listener);
                    delete this._touchListener;
                }

                if (this._infoWClosedListener) {
                    mstrmojo.touchManager.detachEventListener(this._infoWClosedListener);
                    delete this._infoWClosedListener;
                }

                this.destroyChartWidget();

                if (this._leftChart) {
                    this._leftChart.destroy();
                    delete this._leftChart;
                }

                if (this._rightChart) {
                    this._rightChart.destroy();
                    delete this._rightChart;
                }


                if (this._tooltip) {
                    this._tooltip.destroy();
                    delete this._tooltip;
                }

                if (this._super) {
                    this._super(ignoreDom);
                }
            },

            //refresh is called on slice operation
            refresh: function refresh() {
                this.unrender(null, true);
                this.render();
            },

            reRender: function reRender() {
                this.unrender();

                if (this.model && this.model.data) {
                    this.initFromVisProps(this.model.data.vp);
                }
                this.render();
            },

            initScroller: function initScroller(scroller) {
                if (this._super) {
                    this._super(scroller);
                }


            },

            updateScrollBarPosition: function updateScrollBarPosition() {
                var scroller = this._rightChart && this._rightChart._scroller;
                var scrollBar = scroller && scroller._scrollBarEls && scroller._scrollBarEls.y;

                if (scrollBar) {
                    scrollBar.style.left = (this._scroller.origin.x + this.getWidth() - this.leftWidth - 9) + "px";
                }

                scroller = this._scroller;
                scrollBar = scroller && scroller._scrollBarEls && scroller._scrollBarEls.x;

                if (scrollBar) {
                    scrollBar.style.top = (this.chartTableHeight + this._leftChart.headerTableOffsetHeight - 9) + "px";
                }
            },

            onScrollDone: function onScrollDone(evt) {
                var scrl = this.getChartWithScrollBar()._scroller;
                if(scrl){
                    scrl.toggleScrollBars(false);
                }
                if (this.partialRender) {
                       this.firstRowIdxOnScrn = parseInt(this.startCnt + evt.y / this.rowOffsetHeight);
                       if ((this.firstRowIdxOnScrn - this.startCnt <= this.pageSize && this.firstRowIdxOnScrn >= this.pageSize)
                           || this.endCnt - 1 - this.firstRowIdxOnScrn <= this.pageSize && this.endCnt != this.rows.length) {
                           //                                    console.log("reRenderChartWhenScrollDone");
                           this.reRenderChartWhenScrollDone({x:0,y:0});
                           setChartTableHeight.call(this);
                       }
                }
                
                
            },

            onScrollMoved: function onScrollMoved(evt) {
                hideTooltipGlobal.call(this);
                if (this.isTreeMode) {
                    //TQMS 703260:we should remove the docked headers when scroll past.
                    if (hasScrollDownPast(evt.y)) {
                        this._leftChart.hideDockedHeader();
                        if (this._rightChart) {
                            this._rightChart.hideDockedHeader();
                        }
                    } else {
                        this._leftChart.showDockedHeader();
                        if (this._rightChart) {
                            this._rightChart.showDockedHeader();
                        }
                    }

                    var rowOffsetHeight = this.rowOffsetHeight;
                    this.firstRowIdxOnScrn = this.startCnt + parseInt(evt.y / rowOffsetHeight);

                    var currPos = evt.y;
                    var lastPos = this.lastScrollPosition.y;
                    if (lastPos > currPos) {
                        while ((lastPos -= rowOffsetHeight) > currPos) {
                            this.updateDockedHeadersByOneRow(lastPos, true);
                        }
                        this.updateDockedHeadersByOneRow(currPos);
                    } else {
                        while ((lastPos += rowOffsetHeight) < currPos) {
                            this.updateDockedHeadersByOneRow(lastPos, true);
                        }
                        this.updateDockedHeadersByOneRow(currPos);
                    }
                }
            },

            initDockedHeaders: function initDockedHeaders() {
                this._leftChart.initDHs();
                if (this._rightChart) {
                    this._rightChart.initDHs();
                }

                this.clearDockedHeader();

                var rowIdx = 0;
                var rowIdxList = [];

                var currRow = getRowAtIdx.call(this, rowIdx);
                while (currRow && currRow.treeNode.needExpand) {
                    rowIdxList.push(rowIdx);
                    currRow = getRowAtIdx.call(this, ++rowIdx);
                }

                this.addRowsToDH(rowIdxList);

                //this.dockedHeaderCount =  this.dockedHeaderRows.length;

                this.lastFirstRowIdxOnScrn = rowIdx;
                this.lastScrollPosition = {x: 0, y: 0};
                this.dockedHeaderStatus = NO_REPLACE;
            },

            clearDockedHeader: function clearDockedHeader() {
                this.removeRowsFromDH(this.dockedHeaderRows.length);
                this.removeChildrenForDHReplaceTable();
            },

            reBuildDH: function reBuildDH(level) {
                this.clearDockedHeader();

                var rows = this.rows;
                var rowIdxToCheck = this.firstRowIdxOnScrn + level;
                if (rowIdxToCheck < 0 || rowIdxToCheck >= rows.length) {
                    return;
                }
                var treeNodeToCheck = rows[rowIdxToCheck].treeNode;

                if (treeNodeToCheck.level > level) {
                    var rowIdxList = [];
                    for (var i = 0; i <= level; i++) {
                        var treeNode = getParentTreeNodeAtLevel(this.tree, treeNodeToCheck.treePath, i);
                        rowIdxList.push(treeNode.rowIdx);
                    }
                    this.addRowsToDH(rowIdxList);
                } else if (treeNodeToCheck.level == level) {
                    var rowIdxList = [];
                    for (var i = 0; i < level; i++) {
                        var treeNode = getParentTreeNodeAtLevel(this.tree, treeNodeToCheck.treePath, i);
                        rowIdxList.push(treeNode.rowIdx);
                    }
                    rowIdxList.push(treeNodeToCheck.rowIdx);
                    this.addRowsToDH(rowIdxList);
                } else if (treeNodeToCheck.level < level) {
                    var preSiblingTreeNode = getPreSiblingTreeNode(this.tree, treeNodeToCheck.treePath);
                    while (!preSiblingTreeNode) {
                        rowIdxToCheck--;
                        var treeNodeToCheck = rows[rowIdxToCheck].treeNode;
                        preSiblingTreeNode = getPreSiblingTreeNode(this.tree, treeNodeToCheck.treePath);
                    }
                    var rowIdxList = [];
                    for (var i = 0; i < treeNodeToCheck.level; i++) {
                        var treeNode = getParentTreeNodeAtLevel(this.tree, treeNodeToCheck.treePath, i);
                        rowIdxList.push(treeNode.rowIdx);
                    }
                    rowIdxList.push(preSiblingTreeNode.rowIdx);

                    var dHCount = treeNodeToCheck.rowIdx - this.firstRowIdxOnScrn;
                    rowIdxToCheck--;
                    var treeNodeToCheck = rows[rowIdxToCheck].treeNode;
                    for (var i = rowIdxList.length; i < dHCount; i++) {
                        var treeNode = getParentTreeNodeAtLevel(this.tree, treeNodeToCheck.treePath, i);
                        rowIdxList.push(treeNode.rowIdx);
                    }
                    this.addRowsToDH(rowIdxList);
                }

                this.dockedHeaderStatus = NO_REPLACE;
            },

            updateDockedHeadersByOneRow: function updateDHBOR(yPos, onlyUpdateStatus) {
                var scroller = this.getChartWithScrollBar()._scroller;
                if (!scroller.vScroll || yPos > scroller.offset.y.end || yPos < 0) {
                    //if not scrollable, or beyond the scroller offset, we will do nothing
                    return;
                }

                var lastDockedHeaderRow;

                var currFirstRow = getFirstRowUnderDockedHeader.call(this, yPos);

                this.firstRowIdxOnScrn = currFirstRow.rowIdx - this.dockedHeaderRows.length;//this.dockedHeaderCount;
                //console.log("firstRowOnScrn:"+this.firstRowIdxOnScrn);

                if (this.dockedHeaderStatus == IN_REPLACE) {
                    var hasReplacedRowCount = this.firstRowIdxOnScrn - this.replacingStartRowIdx;
                    if (hasReplacedRowCount >= 0) {
                        if (hasReplacedRowCount < this.needReplaceCount) {
                            lastDockedHeaderRow = this.dockedHeaderRows[this.dockedHeaderRows.length - 1];
                            if (this.firstRowIdxOnScrn > this.lastFirstRowIdxOnScrn) {
                                //row changed when scroll up

                                //clear the dockedHeaderReplaceTable
                                this.removeChildrenForDHReplaceTable();
                                this.shiftDockedHeaderWithRow(0, onlyUpdateStatus);

                                if (lastDockedHeaderRow) {
                                    this.removeRowsFromDH(1, true);
                                }
                            } else if (this.firstRowIdxOnScrn < this.lastFirstRowIdxOnScrn) {
                                //row changed when scroll down
                                //finish the IN_REPLACE mode
                                this.dockedHeaderStatus = NO_REPLACE;

                                this.moveRowFromDHRplcTableToDH();

                                //                                            this.dockedHeaderCount  = this.dockedHeaderRows.length;
                                currFirstRow = getFirstRowUnderDockedHeader.call(this, yPos);

                            }
                            this.shiftDockedHeaderWithRow(-currFirstRow.pastOffset, onlyUpdateStatus);
                        } else {
                            //scroll up replace finish
                            this.dockedHeaderStatus = NO_REPLACE;

                            //clear the dockedHeaderReplaceTable
                            this.removeChildrenForDHReplaceTable();
                            this.shiftDockedHeaderWithRow(0, onlyUpdateStatus);

                            //                                        this.dockedHeaderCount = this.dockedHeaderRows.length;
                            currFirstRow = getFirstRowUnderDockedHeader.call(this, yPos);

                        }
                    } else {
                        //scroll down finish
                        this.dockedHeaderStatus = NO_REPLACE;

                        //clear the dockedHeaderReplaceTable
                        this.moveRowFromDHRplcTableToDH();

                        //                                    this.dockedHeaderCount  = this.dockedHeaderRows.length;
                        currFirstRow = getFirstRowUnderDockedHeader.call(this, yPos);

                    }

                }

                if (this.dockedHeaderStatus == NO_REPLACE && currFirstRow.treeNode) {
                    var currLevel = currFirstRow.treeNode.level;
                    lastDockedHeaderRow = this.dockedHeaderRows[this.dockedHeaderRows.length - 1];
                    var lastLevel = lastDockedHeaderRow ? lastDockedHeaderRow.treeNode.level : -1;
                    if (yPos > this.lastScrollPosition.y) {
                        //scroll up
                        if (currLevel <= lastLevel) {
                            //first row has same or higher level than last docked heaker
                            if (lastDockedHeaderRow) {
                                this.removeRowsFromDH(1, true);
                            }
                            this.replacingRowTreeNode = currFirstRow.treeNode;
                            this.replacingStartRowIdx = this.firstRowIdxOnScrn;
                            this.needReplaceCount = lastLevel - currLevel + 1;
                            this.dockedHeaderStatus = IN_REPLACE;
                            //shite the two row
                            this.shiftDockedHeaderWithRow(-currFirstRow.pastOffset, onlyUpdateStatus);
                        } else if (currLevel > lastLevel) {
                            var currRowIdx = currFirstRow.rowIdx;
                            var rowIdxList = [];
                            var currRowTreeNode = currFirstRow.treeNode;
                            while (currRowTreeNode.needExpand) {
                                //first row lower than last docked header
                                //add to dockedHeaders, dockedHeaderCount++
                                rowIdxList.push(currRowIdx);
                                //                                            this.dockedHeaderCount++;
                                currRowTreeNode = getRowAtIdx.call(this, ++currRowIdx).treeNode;
                            }
                            this.addRowsToDH(rowIdxList);

                            //TODO: if

                        }
                    } else if (yPos < this.lastScrollPosition.y) {
                        //scroll down
                        if (currLevel == lastLevel) {

                            var addedTreeNode = currFirstRow.treeNode.preSibling;
                            var currRowIdx = currFirstRow.rowIdx;
                            var rowCount = 0;
                            while (!addedTreeNode) {
                                //remove the last docked header, which will be replaced
                                rowCount++;
                                //this.dockedHeaderCount--;
                                currFirstRow = getRowAtIdx.call(this, --currRowIdx);//getFirstRowUnderDockedHeader.call(this, yPos);
                                addedTreeNode = currFirstRow && currFirstRow.treeNode.preSibling;
                            }
                            this.removeRowsFromDH(rowCount);

                            //remove the last docked header, which will be replaced
                            lastDockedHeaderRow = this.dockedHeaderRows[this.dockedHeaderRows.length - 1];
                            if (lastDockedHeaderRow) {
                                this.removeRowsFromDH(1);
                            }

                            if (addedTreeNode.needExpand) {
                                var rowIdxList = [addedTreeNode.rowIdx];
                                this.addRowsToDH(rowIdxList, true);
                            } else {
                                //no need to add to replaceTable, as the row is just there
                            }

                            this.replacingStartRowIdx = this.firstRowIdxOnScrn;//currFirstRow.rowIdx ;
                            this.replacingRowTreeNode = addedTreeNode;

                            this.needReplaceCount = 1;
                            this.dockedHeaderStatus = IN_REPLACE;
                            var pastOffset = yPos % this.rowOffsetHeight;
                            //shite the row
                            this.shiftDockedHeaderWithRow(-pastOffset, onlyUpdateStatus);

                        } else if (currLevel > lastLevel + 1) {
                            var addedTreeNode = getParentTreeNodeAtLevel(this.tree, currFirstRow.treeNode.treePath, lastLevel + 1);

                            var rowIdxList = [addedTreeNode.rowIdx];
                            this.addRowsToDH(rowIdxList, true);

                            this.replacingStartRowIdx = this.firstRowIdxOnScrn;
                            this.replacingRowTreeNode = addedTreeNode;
                            this.needReplaceCount = currLevel - lastLevel - 1;
                            this.dockedHeaderStatus = IN_REPLACE;
                            //shift the two row
                            this.shiftDockedHeaderWithRow(-currFirstRow.pastOffset, onlyUpdateStatus);
                        }

                    }
                }
                this.lastScrollPosition.y = yPos;
                this.lastFirstRowIdxOnScrn = this.firstRowIdxOnScrn;
            },

            checkParentBeforeAddToDH: function checkParentBeforeAddToDH(addedRowIdx) {
                var rowInfo = this.rows[addedRowIdx];
                var treeNode = rowInfo && rowInfo.treeNode;

                var rowCount = this.dockedHeaderRows.length;
                if (rowCount != treeNode.level) {
                    //                                this.removeRowsFromDH(rowCount);
                    //
                    //                                var treePath = treeNode.treePath.split('_');
                    //                                var rowIdxList = [];
                    //                                var treeNode = this.tree;
                    //                                for(var i = 0; i < rowCount; i++){
                    //                                    treeNode = treeNode.childrenTreeNodeList[treePath[i]];
                    //                                    rowIdxList.push(treeNode.rowIdx);
                    //                                }
                    //                                this.addRowsToDH(rowIdxList);
                }

            },

            addRowsToDH: function addRowsToDH(rowIdxList, toDHReplacingTable) {
                var rows = this.rows;
                var rowCount = rowIdxList.length;
                if (rowCount <= 0) {
                    return;
                }

                var addTo = null;
                if (toDHReplacingTable) {
                    addTo = this.dockedHeaderReplaceRows;
                } else {
                    addTo = this.dockedHeaderRows;
                    //                                this.checkParentBeforeAddToDH(rowIdxList[0]);
                }

                for (var i = 0; i < rowCount; i++) {
                    var rowIdx = rowIdxList[i];
                    var rowInfo = rows[rowIdx];
                    addTo.push({rowIdx: rowIdx, treeNode: rowInfo.treeNode, rowRef: this.popFromReusePool()});
                }

                this._leftChart.addRowsToDH(rowCount, toDHReplacingTable);
                if (this._rightChart) {
                    this._rightChart.addRowsToDH(rowCount, toDHReplacingTable);
                }
            },

            removeRowsFromDH: function removeRowsFromDH(rowCount, moveToReplacingTable) {
                //move TR
                if (this._leftChart) {
                    this._leftChart.removeRowsFromDH(rowCount, moveToReplacingTable);
                }

                if (this._rightChart) {
                    this._rightChart.removeRowsFromDH(rowCount, moveToReplacingTable);
                }

                if (rowCount > this.dockedHeaderRows.length) {
                    //there are not enough rows to remove
                    rowCount = this.dockedHeaderRows.length;
                }
                //move rows
                for (; rowCount > 0; rowCount--) {
                    var row = this.dockedHeaderRows.pop();
                    if (!moveToReplacingTable) {
                        this.pushRowRefToReusePool(row);
                    } else {
                        //destroy later, when they are removed from dockedHeaderReplacingTable
                        this.dockedHeaderReplaceRows.push(row);
                    }

                }
            },

            moveRowFromDHRplcTableToDH: function moveRowFromDHRplcTableToDH() {
                this._leftChart.moveRowFromDHRplcTableToDH();
                if (this._rightChart) {
                    this._rightChart.moveRowFromDHRplcTableToDH();
                }
                this.shiftDockedHeaderWithRow(0);
                //                            for(; rowCount > 0; rowCount--){
                var row = this.dockedHeaderReplaceRows.pop();
                //                                if(!moveToDHTable){
                //                                    this.pushRowRefToReusePool(row);
                //                                }else{
                //destroy later, when they are removed from dockedHeaderReplacingTable
                if (row) {
                    this.dockedHeaderRows.push(row);
                }

                //                                }

                //                            }
            },

            removeChildrenForDHReplaceTable: function removeChildrenForDHReplaceTable() {
                if (this._leftChart) {
                    this._leftChart.removeChildrenForDHReplaceTable();
                }
                if (this._rightChart) {
                    this._rightChart.removeChildrenForDHReplaceTable();
                }

                var rowCount = this.dockedHeaderReplaceRows.length;
                for (; rowCount > 0; rowCount--) {
                    var row = this.dockedHeaderReplaceRows.pop();
                    this.pushRowRefToReusePool(row);
                }
            },

            pushRowRefToReusePool: function pushRowRefToReusePool(row) {
                if (!row) {
                    return;
                }
                var rowRef = row.rowRef;
                this.rowsReusePool.push(rowRef);
                row.rowRef = {};
            },

            shiftDockedHeaderWithRow: function shiftDockedHeaderWithRow(pastOffset, onlyUpdateStatus) {

                if (onlyUpdateStatus) {
                    return;
                }
                if (this._leftChart) {
                    this.utils.translateCSS(0, pastOffset, 0, this._leftChart.dockedHeaderReplaceDiv.firstChild);
                }
                if (this._rightChart) {
                    this.utils.translateCSS(0, pastOffset, 0, this._rightChart.dockedHeaderReplaceDiv.firstChild);
                }

            },

            init: function init(props) {
                this._super(props);

                this.rowsReusePool = [];

                this.dockedHeaderRows = [];
                this.dockedHeaderReplaceRows = [];

                //used as the identity for each sort, so that when user do sort very frequently, we can know whether this sort this out of date and don't need to render any more
                this.sortID = 0;
            },

            initFromVisProps: function (vp) {
                initProp.call(this);
                var propValue = vp ? vp : {},
                    sparklineProps = this.sparklineProps,
                    barProps = this.barProps,
                    bulletProps = this.bulletProps,
                    otherProps = this.otherProps;

                this.isTreeMode = getBoolValue(propValue.itd);

                if (propValue.lsh) {
                    sparklineProps.mbShow = (propValue.lsh === "true");
                }
                if (propValue.lap) {
                    sparklineProps.mbAllPoints = (propValue.lap === "true");
                }
                if (propValue.lep) {
                    sparklineProps.mbEndPoints = (propValue.lep === "true");
                }
                if (propValue.lrl) {
                    sparklineProps.mbRefLine = (propValue.lrl === "true");
                }
                if (propValue.lra) {
                    sparklineProps.mbRefArea = (propValue.lra === "true");
                }
                if (propValue.lmsh) {
                    sparklineProps.mbAssMetric = (propValue.lmsh === "true");
                }
                if (propValue.let) {
                    sparklineProps.mbShowTooltip = (propValue.let === "true");
                }
                if (propValue.llsc) {
                    sparklineProps.mwSeriesLineCol = convertToColor(propValue.llsc);
                }
                if (propValue.lrlc) {
                    sparklineProps.mwRefLineCol = convertToColor(propValue.lrlc);
                }
                if (propValue.lrac) {
                    sparklineProps.mwRefAreaCol = convertToColor(propValue.lrac);
                }
                if (propValue.lh) {
                    sparklineProps.mstrHeader = propValue.lh;
                }
                if (propValue.lam) {
                    sparklineProps.mstrAssMetric = propValue.lam;
                }

                if (propValue.bsg) {
                    barProps.mbShow = (propValue.bsg === "true");
                }
                if (propValue.bl) {
                    barProps.mbShowLegend = (propValue.bl === "true");
                }
                if (propValue.brl) {
                    barProps.mbRefLine = (propValue.brl === "true");
                }
                if (propValue.bet) {
                    barProps.mbShowTooltip = (propValue.bet === "true");
                }
                if (propValue.bpv) {
                    barProps.mwPosCol = convertToColor(propValue.bpv);
                }
                if (propValue.bnv) {
                    barProps.mwNegCol = convertToColor(propValue.bnv);
                }
                if (propValue.brlc) {
                    barProps.mwRefLineCol = convertToColor(propValue.brlc);
                }
                if (propValue.bh) {
                    barProps.mstrHeader = propValue.bh;
                }

                if (propValue.gsh) {
                    bulletProps.mbShow = (propValue.gsh === "true");
                }
                if (propValue.grl) {
                    bulletProps.mbRefLine = (propValue.grl === "true");
                }
                if (propValue.gra) {
                    bulletProps.mbRefBands = (propValue.gra === "true");
                }
                if (propValue.gl) {
                    bulletProps.mbShowLegend = (propValue.gl === "true");
                }
                if (propValue.gmsh) {
                    bulletProps.mbAssMetric = (propValue.gmsh === "true");
                }
                if (propValue.gia) {
                    bulletProps.mbInvertAxis = (propValue.gia === "true");
                }
                if (propValue.get) {
                    bulletProps.mbShowTooltip = (propValue.get === "true");
                }
                if (propValue.gmm) {
                    bulletProps.mfMinValue = parseFloat(propValue.gmm);
                }

                if (propValue.ggc) {
                    bulletProps.mwPosCol = convertToColor(propValue.ggc);
                }
                if (propValue.gnv) {
                    bulletProps.mwNegCol = convertToColor(propValue.gnv);
                }
                if (propValue.grlc) {
                    bulletProps.mwRefLineCol = convertToColor(propValue.grlc);
                }
                if (propValue.gpc) {
                    bulletProps.mwBand1 = convertToColor(propValue.gpc);
                }
                if (propValue.grc) {
                    bulletProps.mwBand2 = convertToColor(propValue.grc);
                }
                if (propValue.gsc) {
                    bulletProps.mwBand3 = convertToColor(propValue.gsc);
                }
                if (propValue.gh) {
                    bulletProps.mstrHeader = propValue.gh;
                }
                if (propValue.gtam) {
                    bulletProps.mstrAssMetric = propValue.gtam;
                }
                if (propValue.glt) {
                    bulletProps.mstrBand1 = propValue.glt;
                }
                if (propValue.gmt) {
                    bulletProps.mstrBand2 = propValue.gmt;
                }
                if (propValue.ght) {
                    bulletProps.mstrBand3 = propValue.ght;
                }

                // xiawang: the propValue.wa could be something like "83%" and after
                // parseFloat it became 83 rather than 0.83. So we add code to detect
                // the value format
                if (propValue.wa) {
                    var value = parseFloat(propValue.wa);
                    if (propValue.wa.indexOf("%")) {
                        value /= 100; // for percent value, divided by 100
                    }
                    otherProps.mfBkgOpacity = value;
                }
                if (propValue.metkpi) {
                    otherProps.mnMetricsPerKPI = parseInt(propValue.metkpi);
                }
                if (propValue.hch) {
                    otherProps.mbHideColHeaders = (propValue.hch === "true");
                }
                if (propValue.htc) {
                    otherProps.mbHideTextColumns = (propValue.htc === "true");
                }
                if (propValue.ll) {
                    otherProps.mbLockLayout = (propValue.ll === "true");
                }
                if (propValue.gam) {
                    otherProps.mbShowForHiddenGraphs = (propValue.gam === "true");
                }
                if (propValue.igf) {
                    otherProps.mbInheritFromGridGraph = (propValue.igf === "true");
                }
                if (propValue.scm) {
                    otherProps.mbInSingleColumnMode = (propValue.scm === "true");
                }
                if (propValue.cid) {
                    otherProps.mpColumnIDs = propValue.cid.split(",");
                }
                if (propValue.tcid) {
                    otherProps.mpColumnIDsInTreeMode = propValue.tcid.split(",");
                }
                // xiawang: otherProps.mpColumnWidths = propValue.cw we delay the
                // process to see if the order is valid. If not valid, we will not use
                // user settings for column width
                if (propValue.co) {
                    otherProps.mpColumnPositions = propValue.co.split(",");
                }
                if (propValue.sc) {
                    otherProps.mpSortKey = propValue.sc;
                }
                if (propValue.so) {
                    otherProps.mbSortDescend = (propValue.so !== "false");
                }

                if (propValue.rh) {
                    otherProps.mRowHeight = parseFloat(propValue.rh);
                }

                // 27 is the minimum Row height. This logic is copied from Flash behavior
                otherProps.mRowHeight = otherProps.mRowHeight > 27 ? otherProps.mRowHeight : 27;

                setDimensionWithDPI.call(this);

            },

            preBuildRendering: function preBR() {
                if (this._super) {
                    this._super();
                }

                //var m = this.model;
                var m = this.model.data;

                if (!m) {
                    m.err = mstrmojo.desc(8426, 'No model provided');
                    return;
                }

                // check if device type is Tablet Universal
                //  this.isTablet = !!mstrApp.isTablet();
                //  this.isAndroidTab = $D.isAndroid ? this.isTablet : false;

                this.isTablet = false;
                this.isAndroidTab = false;

                var propValue = m.vp || {};

                //var isReport = this.controller && (this.controller instanceof mstrmojo.android.controllers.XtabController);
                //var fullScreen = this.isFullScreenWidget || isReport;
                //enable smooth scroll automatically when for the phone in full screen mode
                //this.enableSmoothScroll = ( !this.isTablet && fullScreen) ? true : getBoolValue(propValue.ss);
                this.enableSmoothScroll = false;
                //console.log("isAndroid:"+$D.isAndroid+", isPhone:"+!this.isAndroidTab+", fullscreen:"+fullScreen);

                if (propValue.mcs) {
                    this.metricColumnsSpacing = parseInt(propValue.mcs);
                } else {
                    //this.metricColumnsSpacing = !this.isTablet ? (mstrApp.isLandscape() ? NORMAL : COMPACT) : -1;
                    this.metricColumnsSpacing = !this.isTablet ? 1 : -1;
                }

                if (this.enableSmoothScroll) {
                    this.leftWidth = this.getWidth() / 3;
                    this.rightWidth = this.getWidth() / 3 * 2;
                } else {
                    this.leftWidth = this.getWidth();
                    this.rightWidth = 0;
                    this.scrollerConfig.hScroll = false;
                }
            },

            /*
             * build this.rows[];
             * for TreeMode:
             * this.rows[] need to rebuild once there is treeNode expand or collapse
             * for None-TreeMode:
             * this.rows[] only need to build once.
             */
            buildRows: function buildRows() {
                if (this.rowsNeedRebuild) {
                    if (this.isTreeMode) {
                        // is tree display
                        this.rows = getTreeNodeRows.call(this);
                    } else {
                        buildNonTreeRows.call(this);

                    }
                    this.rowsNeedRebuild = false;
                }
            },

            pushToReusePool: function pushToReusePool(beginCnt, endCnt) {
                var bCnt = beginCnt != undefined ? beginCnt : this.startCnt;
                var eCnt = endCnt != undefined ? endCnt : this.endCnt;

                var rowInfo = null;
                for (var i = bCnt; i < eCnt; i++) {
                    rowInfo = this.rows[i];
                    this.rowsReusePool.push(rowInfo.rowRef);
                    rowInfo.rowRef = {};
                }
            },

            popFromReusePool: function popFromReusePool() {
                var rowRef = this.rowsReusePool.pop();
                return rowRef || {};
            },

            /*
             * rowCount is used for scroll back x rows, used when collapse on docked header
             * adjustOffsetY is used when we collapse a docked header which is in replacing
             */
            reRenderChart: function reRenderChart(scrollTo, rowCount, adjustOffsetY) {

                this.pushToReusePool();

                this.buildRows();

                var rowOffsetHeight = this.rowOffsetHeight;

                if (!rowCount) {
                    rowCount = 0;
                }

                this.firstRowIdxOnScrn = parseInt(this.startCnt + scrollTo.y / rowOffsetHeight) - rowCount;
                this.getCurrRenderRowCount();

                if (adjustOffsetY == undefined) {
                    adjustOffsetY = scrollTo.y % rowOffsetHeight;
                }
                scrollTo.y = (this.firstRowIdxOnScrn - this.startCnt) * rowOffsetHeight + adjustOffsetY;

                //update the lastScrollPosition, used to calculate dockedheader
                this.lastScrollPosition.y = scrollTo.y;
                this.lastFirstRowIdxOnScrn = this.firstRowIdxOnScrn;

                //assign rowRef to the row which will be rendered.
                var rows = this.rows;
                for (var i = this.startCnt; i < this.endCnt; i++) {
                    rows[i].rowRef = this.popFromReusePool();
                }

                if (!this.enableSmoothScroll) {
                    this._leftChart.reRenderRows(scrollTo);
                } else {
                    this._leftChart.reRenderRows(scrollTo);
                    this._rightChart.reRenderRows(scrollTo);
                }
            },

            reRenderChartWhenScrollDone: function reRenderChartwsd(scrollTo) {

                var oldStartCnt = this.startCnt;
                var oldEndCnt = this.endCnt;

                var rowOffsetHeight = this.rowOffsetHeight;
                this.firstRowIdxOnScrn = parseInt(this.startCnt + scrollTo.y / rowOffsetHeight);
                this.getCurrRenderRowCount();

                var firstRowToRemove, lastRowToRemove, firstRowToRender, lastRowToRender;
                if (this.startCnt < oldEndCnt && this.startCnt > oldStartCnt) {
                    firstRowToRemove = oldStartCnt;
                    lastRowToRemove = this.startCnt;
                    firstRowRemain = this.startCnt;
                    lastRowRemain = oldEndCnt;
                    firstRowToRender = oldEndCnt;
                    lastRowToRender = this.endCnt;

                } else if (oldStartCnt < this.endCnt && oldStartCnt > this.startCnt) {
                    firstRowToRemove = this.endCnt;
                    lastRowToRemove = oldEndCnt;
                    firstRowRemain = oldStartCnt;
                    lastRowRemain = this.endCnt;
                    firstRowToRender = this.startCnt;
                    lastRowToRender = oldStartCnt;
                } else {
                    firstRowToRemove = oldStartCnt;
                    lastRowToRemove = oldEndCnt;
                    firstRowRemain = 0;
                    lastRowRemain = 0;
                    firstRowToRender = this.startCnt;
                    lastRowToRender = this.endCnt;
                }

                //                            console.log("firstRowToRemove: "+firstRowToRemove+", lastRowToRemove: "+lastRowToRemove);
                //                            console.log("firstRowRemain: "+firstRowRemain+", lastRowRemain: "+lastRowRemain);
                //                            console.log("firstRowToRender: "+firstRowToRender+", lastRowToRender: "+lastRowToRender);
                //                            console.log("....");

                this.pushToReusePool(firstRowToRemove, lastRowToRemove);

                scrollTo.y = (this.firstRowIdxOnScrn - this.startCnt) * rowOffsetHeight + scrollTo.y % rowOffsetHeight;

                //update the lastScrollPosition, used to calculate dockedheader
                this.lastScrollPosition.y = scrollTo.y;
                this.lastFirstRowIdxOnScrn = this.firstRowIdxOnScrn;

                //assign rowRef to the row which will be rendered.
                var rows = this.rows;
                for (var i = firstRowToRender; i < lastRowToRender; i++) {
                    rows[i].rowRef = this.popFromReusePool();
                }

                if (!this.enableSmoothScroll) {
                    this._leftChart.reRenderRows(scrollTo, firstRowRemain, lastRowRemain, firstRowToRender, lastRowToRender);
                } else {
                    this._leftChart.reRenderRows(scrollTo, firstRowRemain, lastRowRemain, firstRowToRender, lastRowToRender);
                    this._rightChart.reRenderRows(scrollTo, firstRowRemain, lastRowRemain, firstRowToRender, lastRowToRender);
                }
            },

            reRenderChartWithAnchor: function reRenderChartWithAnchor(anchorRowTreeNode, anchorRowIdxOnScrn) {

                this.pushToReusePool();

                this.buildRows();

                var rowOffsetHeight = this.rowOffsetHeight;

                var anchorRowIdx = -1;
                for (var i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].treeNode.treePath == anchorRowTreeNode.treePath) {
                        anchorRowIdx = i;
                        break;
                    }
                }

                this.firstRowIdxOnScrn = anchorRowIdx - anchorRowIdxOnScrn;
                if (this.firstRowIdxOnScrn < 0) {
                    this.firstRowIdxOnScrn = 0;
                }

                this.getCurrRenderRowCount();

                scrollTo.y = (this.firstRowIdxOnScrn - this.startCnt) * rowOffsetHeight;

                //update the lastScrollPosition, used to calculate dockedheader
                this.lastScrollPosition.y = scrollTo.y;
                this.lastFirstRowIdxOnScrn = this.firstRowIdxOnScrn;

                //assign rowRef to the row which will be rendered.
                var rows = this.rows;
                for (var i = this.startCnt; i < this.endCnt; i++) {
                    rows[i].rowRef = this.popFromReusePool();
                }

                if (!this.enableSmoothScroll) {
                    this._leftChart.reRenderRows(scrollTo);
                } else {
                    this._leftChart.reRenderRows(scrollTo);
                    this._rightChart.reRenderRows(scrollTo);
                }
            },

            getCurrRenderRowCount: function getCRRC() {

                var maxRenderRowCount = this.pageSize * PAGE_COUNT;

                if (this.rows.length <= maxRenderRowCount) {
                    this.partialRender = false;
                    this.startCnt = 0;
                    this.endCnt = this.rows.length;
                } else {
                    this.partialRender = true;
                    this.startCnt = Math.round(this.firstRowIdxOnScrn - this.pageSize * (PAGE_COUNT - 1) / 2)
                    if (this.startCnt < 0) {
                        this.startCnt = 0;
                    }
                    this.endCnt = this.startCnt + maxRenderRowCount;
                    if (this.endCnt > this.rows.length) {
                        this.endCnt = this.rows.length;
                    }
                }
                //                            console.log("startCnt, endCnt: "+this.startCnt+" ,"+this.endCnt);
            },

            getChartWithScrollBar: function () {
                if (this.enableSmoothScroll) {
                    return this._rightChart;
                } else {
                    return this._leftChart;
                }
            },

            updateWindowRatio: function updateWindowRatio() {
                /*
                 * every time we change the startCnt and endCnt, we have to recalculate the ratio used for scrollbar
                 */
                var chart = this.getChartWithScrollBar(),
                    scroller = chart._scroller;

                if(scroller){
                    scroller.chartTableRenderRatio = (this.endCnt - this.startCnt) / this.rows.length;
                    scroller.topUnRenderedRatio = this.startCnt / this.rows.length;

                    scroller.updateScrollBars();
                }
                

            },

            initModel: function initModel() {

                this.prevSelected = {
                    mrow: -2,
                    mcol: -1
                };

                if (this.isTreeMode) {
                    initTree.call(this);
                }

                this.treeColumnIdx = -1;

                this.rowsNeedRebuild = true;
                this.rows = [];

                this.unselectedRemainCells = [];

                this.errorMsg.style.display = 'none';

                this.isKPI = false;
                this.showMinLabel = false;

                METRICS = [];
                METRIC_INDEX = {};
                ID_NAME = {};
                order = [];
                models = [];
                GFL = 1;
                CGL = 0;
                linkCount = 0;
                attrCount = 0;

                this.infoWindowsShown = {};
            },

            renderMicroChart: function renderMicroChart() {
                var me = this;

                this.buildRows();

                updateColumnWidth.call(this);

                //render legend before render table, so that we know the legend offsetHeight
                me.renderLegend();

                me.getCurrRenderRowCount();

                me.restoreMCStatus();

                if (!me.enableSmoothScroll) {
                    me.itemsContainerNode.style.display = 'none';
                    var props = {
                        placeholder: me.leftChart,
                        colInfos: me.colInfos,
                        theme: me.theme,
                        isTreeMode: me.isTreeMode,
                        showMinLabel: me.showMinLabel,
                        width: me.leftWidth + "px",
                        height: (me.getHeight() - me.legendHeight) + "px",
                        textSpan: me.textSpan,
                        textCanvas: me.textCanvas,
                        headerCssClass: me.headerCssClass,
                        valueCssClass: me.valueCssClass,
                        isAndroidTab: me.isAndroidTab,
                        widget: me,
                        treeColumnIdx: me.treeColumnIdx,
                        backgroundColor: me.backgroundColor,
                        domRefName: LEFT_CHART_ROW,
                        showScrollbars: true
                    };
                    var w = new mstrmojo.plugins.VisMicroChart.VisMicroChartTable(props);
                    w.render();
                    me._leftChart = w;
                    w.parent = me;

                   // me.replaceScrollerUpdate(w);
                } else {
                    var props = {
                        placeholder: me.leftChart,
                        colInfos: me.colInfos.slice(0, this.attrColumnCount),
                        theme: me.theme,
                        isTreeMode: me.isTreeMode,
                        showMinLabel: me.showMinLabel,
                        width: me.leftWidth + "px",
                        height: (me.getHeight() - me.legendHeight) + "px",
                        textSpan: me.textSpan,
                        textCanvas: me.textCanvas,
                        headerCssClass: me.headerCssClass,
                        valueCssClass: me.valueCssClass,
                        isAndroidTab: me.isAndroidTab,
                        widget: me,
                        treeColumnIdx: me.treeColumnIdx,
                        backgroundColor: me.backgroundColor,
                        domRefName: LEFT_CHART_ROW,
                        showScrollbars: false,
                        zIndex: 1
                    };
                    var w = new mstrmojo.plugins.VisMicroChart.VisMicroChartTable(props);
                    w.render();
                    me._leftChart = w;
                    w.parent = me;
                    me.leftChart = w.domNode;

                    //                                $CSS.applyShadow(me.leftChart, this.dropShadowWidth, 0, this.dropShadowWidth, '#888');

                    var props = {
                        placeholder: me.rightChart,
                        colInfos: me.colInfos.slice(this.attrColumnCount),
                        theme: me.theme,
                        isTreeMode: me.isTreeMode,
                        showMinLabel: me.showMinLabel,
                        width: me.rightWidth + "px",
                        height: (me.getHeight() - me.legendHeight) + "px",
                        textSpan: me.textSpan,
                        textCanvas: me.textCanvas,
                        headerCssClass: me.headerCssClass,
                        valueCssClass: me.valueCssClass,
                        isAndroidTab: me.isAndroidTab,
                        widget: me,
                        treeColumnIdx: me.treeColumnIdx,
                        backgroundColor: me.backgroundColor,
                        domRefName: RIGHT_CHART_ROW,
                        showScrollbars: true
                    };
                    var w2 = new mstrmojo.plugins.VisMicroChart.VisMicroChartTable(props);
                    w2.render();
                    me._rightChart = w2;
                    w2.parent = me;
                    me.rightChart = w2.domNode;

                    //me.replaceScrollerUpdate(w2);

                    if (this.theme == DEFAULT_LIGHT_THEME || this.theme == CUSTOM_LIGHT_THEME) {
                        me.dropShadowDiv.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(0, rgba(0,0,0,0.25)), color-stop(1, rgba(0,0,0,0)))";
                    } else {
                        me.dropShadowDiv.style.backgroundImage = "-webkit-gradient(linear, left top, right top, color-stop(0, rgba(0,0,0,0.5)), color-stop(1, rgba(0,0,0,0)))";
                    }

                    w2.addSyncScroller(w);
                    w.addSyncScroller(w2);

                    //make sure the header table in left chart and right chart have the same height
                    var headerHeight = Math.max(me._leftChart.headerTableOffsetHeight, me._rightChart.headerTableOffsetHeight);
                    me._leftChart.headerTable.style.height = headerHeight + "px";
                    me._rightChart.headerTable.style.height = headerHeight + "px";
                    me._leftChart.updateHeaderTableOffsetH();
                    me._rightChart.updateHeaderTableOffsetH();

                    me.scrollerConfig.scrollEl = me.rightChart;
                    //hscroll bar
                    me.updateScroller();

                    var scrollTo = null;
                    if (this.mcStatus && this.mcStatus.hScrollPos != undefined) {
                        var xPos = Math.min(this.mcStatus.hScrollPos * this.rightWidth, this.rightWidth + this.leftWidth - this.getWidth());
                        scrollTo = this._scroller.origin = {
                            x: xPos,
                            y: 0
                        }
                    }
                    setScrollerPosition.call(me, scrollTo);

                }

                //if the container for the microchart is set display to none, we will use the default rowHeight
                me.rowOffsetHeight = ((me.otherProps.mbHideTextColumns && this.enableSmoothScroll) ? w2.rowOffsetHeight : w.rowOffsetHeight) || 30;

                if (me.isTreeMode) {
                    if (me.mcStatus && me.mcStatus.dHRowIdxList) {
                        //restore the dockedHeaders
                        me._leftChart.initDHs();
                        if (me._rightChart) {
                            me._rightChart.initDHs();
                        }
                        me.addRowsToDH(me.mcStatus.dHRowIdxList);
                        if (me.mcStatus.dHReplaceRowIdxList.length > 0) {
                            me.addRowsToDH(me.mcStatus.dHReplaceRowIdxList, true);
                            var pastOffset = me.mcStatus.scrollTo.y % me.rowOffsetHeight;
                            //shite the row
                            me.shiftDockedHeaderWithRow(-pastOffset);
                        }

                    } else {
                        me.initDockedHeaders();
                    }
                }

                me.getDefaultHighlightRow();
                me.updateSelectedStatus(me.tree);
                me.updateHighlightForCurrRenderRows();

                me.chartTableMaxHeight = me.getHeight() - me._leftChart.headerTableOffsetHeight;
                if (me.legendDis) {
                    me.chartTableMaxHeight -= me.legendHeight;
                }

                //if the height of widget is to large, make it to 20, so that won't take to much memory.
                //but make sure pageSize not smaller than the minPageSize.
                me.pageSize = Math.max(Math.min(parseInt(me.chartTableMaxHeight / me.rowOffsetHeight) + 1, 20), me.minPageSize);
                setChartTableHeight.call(me);
            },


            //deal with microchart as report. It will set the gridData when model is changed
            ongridDataChange: function onGridDataChange(evt) {
                if (this.model) {
                    this.model.data = this.gridData;
                }
                //this.model = this.gridData;
            },


            postBuildRendering: function postBR() {
                console.log("in postb");
                var me = this,//model = me.model,
                    model = me.model.data;
                var err = model.err || model.eg;

                if (err) {
                    me.renderErrorMessage(err);
                    return;
                }

                if (me.controller && me.controller.view && me.controller.view.model && me.controller.view.model.mcStatus) {
                    if (!me.mcStatus && me.controller.view.model.mcStatus[this.getModelK()]) {
                        //me is newly created
                        me.mcStatus = me.controller.view.model.mcStatus[this.getModelK()];
                        console.log("found stored mcStatus with key:" + this.getModelK());
                    }
                }

                me.highlightEntireRow = me.isTreeMode || me.isAllAttrSelectable;

                getUITheme.call(me);

                convertDataToModels.call(me);

                err = model.err || model.eg;

                if (err) {
                    me.renderErrorMessage(err);
                    return;
                }

                if (this._super) {
                    this._super();
                }

                if (this.otherProps.mbInheritFromGridGraph) {
                    this.selectedClass = "sc_" + this.getModelK(); // xiawang: this css class name is fixed
                } else {
                    this.selectedClass = "";
                }

                //minPageSize make sure we render at least three page, when the widget height is quite large
                this.minPageSize = Math.ceil((this.getHeight() / this.otherProps.mRowHeight) * 3 / PAGE_COUNT);
                this.pageSize = this.minPageSize;

                var callback = {
                    success: function (res) {
                        var nodeKey = me.getModelK();

                        me.model = res;//mstrmojo.Vis.getVisGrid(docModel, res, nodeKey);

                        //add the node key as backend won't send it when apply sort.
                        me.model.k = nodeKey;

                        me.rowsNeedRebuild = true;
                        convertDataToModels.call(me);

                        me.renderMicroChart();

                        me.toggleSortOrderAndArrow(me.sortKeyIdx, me.sortOrder);
                    }
                };

                //TODO: after will be enable after sort on mobile is enable
                /*
                 var otherProps = this.otherProps;
                 if ( this.mcStatus && this.mcStatus.sortKeyIdx != undefined ){
                 this.sortKeyIdx = this.mcStatus.sortKeyIdx;
                 this.sortOrder = this.mcStatus.sortOrder;
                 this.renderMicroChart();
                 this.toggleSortOrderAndArrow(this.sortKeyIdx, this.sortOrder);
                 //                    this.doSort(this.sortOrder, callback );
                 } else if (otherProps.mpSortKey && otherProps.mpSortKey.length > 0) {
                 var sortKeyIdx = $ARRAY.find( this.colInfos, "title", otherProps.mpSortKey );
                 if(sortKeyIdx > -1){
                 this.sortKeyIdx = sortKeyIdx;
                 this.sortOrder = otherProps.mbSortDescend ? SORT_ORDER.DESCENDING : SORT_ORDER.ASCENDING;
                 //                        this.doSort(this.sortOrder, callback);
                 this.renderMicroChart();
                 this.toggleSortOrderAndArrow(this.sortKeyIdx, this.sortOrder);
                 }

                 }else {
                 this.renderMicroChart();
                 }
                 */
                //TODO: above will be enable after sort on mobile is enable
                this.renderMicroChart();
                //TODO: above will be removed after sort on mobile is enable

                /*
                 * remove the mcStatus after all the mcStatus are restored
                 * as we will recreate it in unrender accoring to whether it is null
                 */
                me.removeMCStatus();

                /*
                 * clear the selected highlight when all info windows are closed and there are not any other select targets
                 */
                var xtabModel = me.xtabModel,
                    docModel = (xtabModel && xtabModel.docModel);
                if (docModel) {
                    me._infoWClosedListener = me.xtabModel.docModel.attachEventListener('infoWindowClosed', this.id, function (evt) {
                        var infoWindowK = evt.psKey;
                        //selection targets are all info window && the closed info window is our target
                        if (!me.hasNonifwTarget && me.infoWindowsShown && me.infoWindowsShown[infoWindowK]) {
                            window.setTimeout(function () {
                                clearHighlightOnIfwClosed.call(me);
                            }, 10);
                        }
                        me.infoWindowsShown[infoWindowK] = false;

                    });
                }

                //this.renderTextTooltip();
                this.renderVisTooltip();
            },

            renderVisTooltip: function renderVisTooltip() {
                //renderToolip
                var props = {
                    placeholder: this.tooltip,
                    cssClass: 'timeseries-tooltip mstrmojo-MicroChart-tooltip'
                };
                this._tooltip = new mstrmojo.plugins.VisMicroChart.VisMicroChartTooltip(props);
                this._tooltip.render();

                this._tooltip.toggle(false);
            },

            /*
             * As we are using windowing algorithm, we only render part of the rows and when we scroll to the boundary,
             * we will render the following part of rows. The scroll bar can only indicate the position relative to the current rendered rows,
             * but not to the whole rows.
             * So we rewrite the updateScrollBars function
             */

            replaceScrollerUpdate: function replaceScrollerUpdate(chartTable) {

                chartTable._scroller.updateScrollBars = function updateScrollBars(viewportCoords, scrollBarContainerElement) {
                    var scrollEl = this.scrollEl;

                    // Are we not showing scrollbars, or do we not have a scroll element yet?
                    if (!this.showScrollbars || !scrollEl) {
                        // Nothing to do here.
                        return;
                    }

                    var bars = this._scrollBarEls;

                    var chartTableRenderRatio = this.chartTableRenderRatio || 1;
                    var topUnRenderedRatio = this.topUnRenderedRatio || 0;

                    // Have we NOT created the scroll bar DOM elements yet?
                    if (!bars) {
                        var me = this;
                        bars = this._scrollBarEls = {
                            x: 'hScroll',
                            y: 'vScroll'
                        };

                        // Iterate the axes...
                        $forEachHash(bars, function (scroll, axis) {
                            // Do we support scrolling for this axis?
                            if (me[scroll]) {
                                // YES, then create the scroll bar element...
                                var bar = document.createElement('div');
                                bar.className = 'mstrmojo-touch-scrollBar ' + axis + 'Axis';

                                // and insert into DOM and scrollBars collection.
                                (scrollBarContainerElement || scrollEl.parentNode).appendChild(bar);
                                bars[axis] = bar;
                            } else {
                                // NO, so remove this axis from the collection of bars.
                                delete bars[axis];
                            }
                        });
                    }

                    // Did the consumer not supply viewportCoords?
                    if (!viewportCoords) {
                        // Create viewportCoords based on the scoll elements parent node.
                        var parentNode = this.scrollEl.parentNode;
                        viewportCoords = {
                            top: 0,
                            right: parentNode.clientWidth,
                            bottom: parentNode.clientHeight,
                            left: 0
                        };
                    }

                    // Convert the viewportCoords into position (and length) coordinates for the scrollbars.
                    var offset = 9,
                        scrollBarCoords = {
                            x: {
                                left: viewportCoords.left,
                                top: viewportCoords.bottom - offset,
                                x: viewportCoords.right - viewportCoords.left,
                                d: 'Width'
                            },
                            y: {
                                left: viewportCoords.right - offset,
                                top: viewportCoords.top,
                                x: viewportCoords.bottom - viewportCoords.top,
                                d: 'Height'
                            }
                        };

                    var me = this;
                    // Size the scrollbars.
                    $forEachHash(bars, function (bar, axis) {
                        var barStyle = bar.style,
                            coords = scrollBarCoords[axis],
                            dimension = coords.d,
                            parentNode = bar.parentNode,
                            x = coords.x;

                        // Calculate position...
                        var left = coords.left,
                            top = coords.top + x * topUnRenderedRatio,
                            ratio = x / scrollEl['offset' + dimension] * chartTableRenderRatio,
                            length = Math.min(Math.round(x * ratio), x);

                        // cache on bar for scrolling...
                        bar.baseLeft = left;
                        bar.baseTop = top;
                        bar.ratio = ratio;
                        bar.viewportSize = $M.round(x * chartTableRenderRatio);
                        bar.length = length;

                        // position and size bar.
                        barStyle.left = left + 'px';
                        barStyle.top = top + 'px';
                        barStyle[dimension.toLowerCase()] = length + 'px';

                        var isX = (axis === 'x'),
                            direction = isX ? 'hScroll' : 'vScroll';
                        if (me[direction]) {
                            //update the scrollbar pos in its viewport
                            var origin = me.origin,
                                position = origin && origin[axis] || 0,
                                viewportSize = bar.viewportSize,
                                minScale = 6 / length,
                                minPosition = bar['base' + ((isX) ? 'Left' : 'Top')],
                                maxPosition = minPosition + viewportSize - length,
                                newPosition = $M.round(minPosition + (ratio * position));

                            // Adjust position and bar length for scroll out cases.
                            if (newPosition < minPosition) {
                                newPosition = minPosition - position;
                                length += position;
                            } else if (newPosition > maxPosition) {
                                var delta = (position - me.offset[axis].end) * ratio;
                                newPosition = $M.min(maxPosition + delta, viewportSize + minPosition - 6) - 1;
                                length -= delta;
                            }

                            // Move and size the bar.  Use webkitTransform for better performance.
                            var v = 0,
                                translate = [v, v, v],
                                scale = [1, 1, 1],
                                idx = (isX) ? 0 : 1;

                            translate[idx] = (newPosition - minPosition);
                            scale[idx] = $M.min($M.max(length / bar.length, minScale), 1);

                            $D.translate(bar, translate[0], translate[1], translate[2], ' scale3d(' + scale.join(',') + ')');
                            //                                    $D.translate(bar, translate[0], translate[1], translate[2], me.transform, me.useTranslate3d);

                        }
                    });
                }

            },

            setElementDimension: function setElementDimension(e, width) {
                var paddingWidth = 0;

                var compStyle = mstrmojo.css.getComputedStyle(e);
                if (compStyle.paddingLeft) {
                    paddingWidth += parseFloat(compStyle.paddingLeft);
                }
                if (compStyle.paddingRight) {
                    paddingWidth += parseFloat(compStyle.paddingRight);
                }

                e.style.width = (width - paddingWidth) + 'px';

            },

            setColorByTheme: function setColorByTheme() {
                var bulletProps = this.bulletProps;
                if (this.theme == DEFAULT_DARK_THEME) {
                    this.bandColor1 = "#494949";
                    this.bandColor2 = "#595959";
                    this.bandColor3 = "#727272";

                    this.refLinePosColor = "#FF781D";
                    this.refLineNegColor = "#FF781D";
                    this.refLineWidth = 2;
                    this.blueBarPosColor = "#00BDFF";
                    this.blueBarNegColor = "#00BDFF";

                    this.legendTextColor = 'white';
                } else if (this.theme == DEFAULT_LIGHT_THEME) {
                    this.bandColor1 = "#A5A5A5";
                    this.bandColor2 = "#B3B3B3";
                    this.bandColor3 = "#BCBCBC";

                    this.refLinePosColor = "#FF781D";
                    this.refLineNegColor = "#FF781D";
                    this.refLineWidth = 2;
                    this.blueBarPosColor = "#00BDFF";
                    this.blueBarNegColor = "#00BDFF";
                } else {
                    this.bandColor1 = bulletProps.mwBand1 || "#999999";
                    this.bandColor2 = bulletProps.mwBand2 || "#BBBBBB";
                    this.bandColor3 = bulletProps.mwBand3 || "#DEDEDE";

                    this.refLinePosColor = bulletProps.mwRefLineCol;
                    this.refLineNegColor = bulletProps.mwRefLineCol;
                    this.blueBarPosColor = bulletProps.mwPosCol;
                    this.blueBarNegColor = bulletProps.mwNegCol;
                }
            },

            renderLegend: function renderLgd() {
                var bulletProps = this.bulletProps;

                this.setColorByTheme();

                this.legendDis = this.showGauge && this.bulletProps.mbShowLegend;
                if (this.legendDis) {
                    this.legend.className += " " + this.valueCssClass;

                    /*
                     * set chartTable max-height, so that the legend will not be covered
                     * max-height not work well on all the device, so that we call setChartTableHeight  manually
                     */
                    //                                var chartTableContainer = this.chartTable.parentNode;
                    //                                chartTableContainer.style.maxHeight = this.getHeight() - 30 - ht.offsetHeight;

                    this.legend.style.display = "block";
                    this.legend.style.fontSize = Math.round(11 * zf) + "pt";
                    this.setElementDimension(this.legend, this.getWidth());
                    if (this.legendTextColor) {
                        this.legend.style.color = this.legendTextColor;
                    }

                    if (bulletProps.mstrBand1) {
                        this.legendLowFont.innerHTML = bulletProps.mstrBand1;
                    }
                    this.legendLowBand.style.backgroundColor = this.bandColor1;

                    if (bulletProps.mstrBand2) {
                        this.legendMidFont.innerHTML = bulletProps.mstrBand2;
                    }
                    this.legendMidBand.style.backgroundColor = this.bandColor2;

                    if (bulletProps.mstrBand3) {
                        this.legendHighFont.innerHTML = bulletProps.mstrBand3;
                    }
                    this.legendHighBand.style.backgroundColor = this.bandColor3;

                    var lowWidth = this.legendLow.offsetWidth,
                        midWidth = this.legendMid.offsetWidth,
                        highWidth = this.legendHigh.offsetWidth;

                    if (lowWidth + midWidth + highWidth > this.getWidth()) {
                        //legend will be shown in more than one row
                        if (lowWidth + midWidth > this.getWidth()) {
                            this.legendLow.style.width = this.width;
                            if (midWidth + highWidth > this.getWidth()) {
                                this.legendMid.style.width = this.width;
                                this.legendHigh.style.width = this.width;
                            } else {
                                this.legendMid.style.width = (this.getWidth() - highWidth) + "px";
                            }
                        } else {
                            this.legendLow.style.width = (this.getWidth() - midWidth) + "px";
                            this.legendHigh.style.width = this.width;
                        }
                    }
                    this.legendHeight = this.legend.firstChild.offsetHeight;
                    this.legend.style.height = this.legendHeight + "px";

                } else {
                    this.legend.style.display = "none";
                    this.legendHeight = 0;
                }
            },

            showChartTooltip: function showChartTooltip(touchedChart, touch) {
                var me = this;
                var wasNoTooltip = !this._tooltip.show;
                touchedChart.showTooltip(touch.pageX, touch.pageY);
                var nowHasTooltip = this._tooltip.show;
                this.tooltipShow = nowHasTooltip;
                // if the tooltip's style is block, add
                if (wasNoTooltip && nowHasTooltip) {
                    var touchManager = mstrmojo.touchManager;
                    this._touchListener = touchManager.attachEventListener('touchesBegin', this.id, function (evt) {
                        if (!isTouchedOnWidget.call(me, evt.touch)) {
                            hideTooltipGlobal.call(me, evt.touch); // hide the tooltip
                        }
                    });
                }

            },

            touchSelectMove: function touchSelectMove(touch) {
                if (touch.evt.ctrlKey) {
                    this.touchMultiMove(touch);
                    return;
                }

                if (!this.currSelectedWidget) {
                    return;
                }

                // first hide tooltip. So it will not block the chart that underneith it
                this._tooltip.toggle(false);

                var target = touch.target;

                var mcol = -1,
                    colInfo = null;

                var targetFound = true;
                var td = mstrmojo.dom.findAncestorByAttr(target, "mcol", true, this.domNode);
                td = td && td.node;
                if (td) {
                    mcol = td.getAttribute("mcol");
                    colInfo = this.colInfos[mcol];
                    //if it is bullet, we need to recalculate the target
                    if (colInfo.order == "GaugeChart") {
                        //why not just use touch.target? The tooltip for bullet is not correct cross rows and docked header on device, if we use touch.target.
                        // use this way, we don't need to calculate object by ourselves
                        targetFound = false;
                    }
                } else {
                    //tap on tooltip
                    targetFound = false;
                }

                if (targetFound === false) {
                    target = document.elementFromPoint(touch.pageX, touch.pageY);
                    //find the td and mrow again, as target update
                    td = mstrmojo.dom.findAncestorByAttr(target, "mcol", true, this.domNode);
                    td = td && td.node;
                    if (!td) {
                        return;
                    }
                    mcol = td.getAttribute("mcol");
                    colInfo = this.colInfos[mcol];
                }

                var mrow = td.getAttribute("mrow");
                var tr = td.parentNode;

                //find rowInfo
                var rowInfo = null;
                if (tr.getAttribute("rowType") == DOCKED_HEADER) {
                    var dockedHeaderIdx = getIdxByRowIdx(this.dockedHeaderRows, mrow);
                    if (dockedHeaderIdx >= 0) {
                        rowInfo = this.dockedHeaderRows[dockedHeaderIdx];
                    } else {
                        dockedHeaderIdx = getIdxByRowIdx(this.dockedHeaderReplaceRows, mrow);
                        rowInfo = this.dockedHeaderReplaceRows[dockedHeaderIdx];
                    }
                } else {
                    rowInfo = this.rows[mrow];
                }

                var touchedChart = rowInfo && rowInfo.rowRef && rowInfo.rowRef[mcol];
                var tooltipShown;
                if (touchedChart) {
                    if (colInfo.order == "LineChart" || colInfo.order == "BarChart") {
                        if (mrow == this.currSelectedWidget.mrow && mcol == this.currSelectedWidget.mcol) {
                            tooltipShown = touchedChart.showTooltip(touch.pageX, touch.pageY);
                            this.currSelectedWidget = {mrow: mrow, mcol: mcol};
                        }
                    } else {
                        if (mcol == this.currSelectedWidget.mcol && mrow != this.currSelectedWidget.mrow) {
                            tooltipShown = touchedChart.showTooltip(touch.pageX, touch.pageY);
                            this.currSelectedWidget = {mrow: mrow, mcol: mcol};
                        }
                    }
                }

                if (tooltipShown) {
                    this.tooltipShow = true;
                }
                //                console.log("tooltip show:" + this.tooltipShow);
                if (this.tooltipShow) {
                    this._tooltip.toggle(true);
                }

            },

            touchSwipeBegin: function touchSwipeBegin(touch) {
                hideTooltipGlobal.call(this);
                //First check if scrollable element is selected if yes call the super to scroll
                if (isScrollableElementTouched.call(this, touch) && this._super) {
                    this._super(touch);
                } else {
                    this._touchCanceled = true;
                }

            },

            touchSwipeMove: function touchSwipeMove(touch) {
                //First check if scrollable element is selected if yes call the super to scroll
                if (!this._touchCanceled && this._super) {
                    this._super(touch);
                }
            },

            touchSwipeEnd: function touchSwipeEnd(touch) {
                //First check if scrollable element is selected if yes call the super to scroll
                if (!this._touchCanceled && this._super) {
                    this._super(touch);
                }
            },

            buildLeftParent: function buildLeftParent(node, mrow, mcol) {
                var colInfos = this.colInfos,
                    colCount = colInfos.length;

                if (!this.isKPI) {
                    // non KPI mode
                    if (mrow == -1) { // select all
                        var gts = this.model.data.gts;
                        var metricIndex = $ARR.find(gts.col, 'n', 'Metrics');
                        node._e = gts.col[metricIndex].es[colInfos[mcol].order] || {id: "", n: ""};
                        node.v = node._e.n;
                    } else {
                        var rows = this.model.data.gts.row;
                        var currNode = node;

                        for (var i = colCount - 1; i >= 0; i--) {
                            var colInfo = colInfos[i];
                            if (colInfo.type == CHART) {
                                continue;
                            }
                            if (colInfo.type == ATTR_NAME) {
                                var nodeLP = {};
                                var index = $ARR.find(rows, 'id', colInfo.order.split(":")[0]);
                                nodeLP.titleInfo = rows[index];
                                nodeLP._e = this.rows[mrow].model.elms[colInfo.order] || {id: "", n: ""};
                                nodeLP.v = nodeLP._e.n;
                                nodeLP.axis = ROW_AXIS;

                                currNode._lp = nodeLP;
                                currNode = nodeLP;
                            }
                        }
                    }
                } else {
                    // KPI mode
                    if (mcol == 0) {
                        // metric name, select all
                        var gts = this.model.data.gts;
                        var metricIndex = $ARR.find(gts.col, 'n', 'Metrics');
                        node._e = gts.col[metricIndex].es[mrow] || {id: "", n: ""};
                        node.v = node._e.n;
                    } else {
                        var rows = this.model.data.gts.row;
                        var currNode = node;
                        for (var i = 0; i < rows.length; i++) {
                            var nodeLP = {};
                            nodeLP.titleInfo = rows[i];
                            var idx = rows[i].es.length;
                            nodeLP._e = rows[i].es[idx - 1] || {id: "", n: ""};
                            nodeLP.v = nodeLP._e.n;
                            nodeLP.axis = ROW_AXIS;

                            currNode._lp = nodeLP;
                            currNode = nodeLP;
                        }
                    }
                }
            },

            getModelK: function getModelK() {
                var k = this.model && this.model.data && this.model.data.k;

                return k;
            },

            getDataService: function getDataService() {
                var xtabModel = this.xtabModel,
                    docModel = xtabModel && xtabModel.docModel,
                    dataService = docModel && docModel.getDataService();

                if (!dataService) {
                    dataService = xtabModel && xtabModel.getDataService();
                }

                return dataService;
            },

            addSCObjToList: function addSCObjToList(scObjList, rowH, n, id) {
                var scObj = {};
                scObj.sc = rowH.sc;
                scObj.es = n;
                scObj.eid = id;
                scObjList.push(scObj);
            },

            getSelectionObjForTreeMode: function getSelectionObjForTreeMode(touchedObj) {
                var attrIdxArray = this.attrMapIdx;
                var me = this,
                    model = me.model,
                    gts = model.gts,
                    rows = gts.row;

                var scObjList = [];
                var actionType = 0;
                var selectedAll = false;

                var treeNode = touchedObj.treeNode;
                var treePath = treeNode.treePath;
                var treePathArray = treePath.split("_");
                var treeLevel = treePathArray.length - 1;
                var isAttrSelectable = this.isAttrSelectable(treeLevel);

                if (this.closedIfwAttr == treePath && this.isTablet) {
                    /*
                     * tapped on the attr which has show its infowindow and the ifw is the only target for this attr,
                     * the highlight will be clear and we do nothing here
                     */
                    return null;
                }

                if (isAttrSelectable) {
                    // tapped attr is selectable
                    var isTappedNodeSelected = this.lastSelectedObj && this.lastSelectedObj[treeLevel] && (this.lastSelectedObj[treeLevel].treePath == treePath);

                    if (!isTappedNodeSelected) {
                        //try to do selection
                        this.currSelectedObj = this.getSelectedTreeNodeListFromTreePath(treePathArray);

                        var useFirstAttr = false;
                        var parentTreeNode = this.currSelectedObj[treeLevel];
                        for (var i = treeLevel + 1; i < this.lastSelectedObj.length; i++) {
                            var thisLevelSelectable = this.isAttrSelectable(i);
                            var thisLevelSelected = !!this.lastSelectedObj[i];

                            if (!thisLevelSelectable || !thisLevelSelected) {
                                /*
                                 * this level is not selectable, or this level is selectable but currently not selected
                                 * we will also not select it, so currSelectedObj[i] is null
                                 * for the furture children nodes, useFirstAttr will be true
                                 * update the parentTreeNode to its first child
                                 */
                                useFirstAttr = true;
                                this.currSelectedObj[i] = null;
                                parentTreeNode = parentTreeNode.childrenTreeNodeList[0];
                                continue;
                            }

                            /*
                             * for this level, we will find one node to select
                             * if useFirstAttr == false, we will try to find the same node in last selection
                             * else use the first node
                             */
                            if (!useFirstAttr) {
                                //find the same Attr
                                var attrID = this.lastSelectedObj[i].id;
                                var treeNodeList = parentTreeNode.childrenTreeNodeList;
                                for (var j = 0; j < treeNodeList.length; j++) {
                                    if (attrID == treeNodeList[j].id) {
                                        //find the attr
                                        this.currSelectedObj[i] = treeNodeList[j];
                                        break;
                                    }
                                }
                                if (j == treeNodeList.length) {
                                    //not find
                                    useFirstAttr = true;
                                }
                            }

                            if (useFirstAttr) {
                                this.currSelectedObj[i] = parentTreeNode.childrenTreeNodeList[0];
                            }

                            //update parentTreeNode for next level
                            parentTreeNode = this.currSelectedObj[i];
                        }

                        selectedAll = false;
                        //build scObj from this.currSelectedObj
                        for (var i = 0; i < this.currSelectedObj.length; i++) {
                            var treeNode = this.currSelectedObj[i];
                            if (treeNode) {
                                var attrIdx = attrIdxArray[i];
                                rowH = rows[attrIdx];

                                this.addSCObjToList(scObjList, rowH, treeNode.n, treeNode.id);
                            } else {
                                //treeNode not select
                                continue;
                            }
                        }
                    } else {
                        //try to do unselection
                        for (var i = treeLevel; i < this.lastSelectedObj.length; i++) {
                            var treeNode = this.currSelectedObj[i];

                            if (!treeNode) {
                                continue;
                            }

                            var attrIdx = attrIdxArray[i];
                            rowH = rows[attrIdx];

                            var unselectable = rowH.sc && !(rowH.sc.all === "false" || rowH.sc.all === false);

                            if (treeNode && !unselectable) {
                                //selectable && not unselectable
                                //if the child is not select all enabled, stop here and do not check any further
                                break;

                            } else {
                                //do unselect
                                this.addSCObjToList(scObjList, rowH, treeNode.n, "OA:(All)");
                                this.currSelectedObj[i] = null;
                            }
                        }

                        //if the level tapped is unselectable, so nothing is changed
                        if (i == treeLevel) {
                            return {at: 0};
                        }

                        //remove all the null at last
                        while (this.currSelectedObj.length > 0 && !this.currSelectedObj[this.currSelectedObj.length - 1]) {
                            this.currSelectedObj.pop();
                        }

                        //build scObj for the unselected nodes
                        for (; i < this.currSelectedObj.length; i++) {
                            var treeNode = this.currSelectedObj[i];
                            if (treeNode) {
                                var attrIdx = attrIdxArray[i];
                                rowH = rows[attrIdx];

                                this.addSCObjToList(scObjList, rowH, treeNode.n, treeNode.id);
                            } else {
                                //treeNode not select
                                continue;
                            }
                        }
                        //                                    /*
                        //                                     * If the children node is unselectable, we will stop unselect further children
                        //                                     * So we need to retain the highlight for them.
                        //                                     * So here we clear the retain selected rows  in lastSelectedObj, whose highlight will be clear
                        //                                     */
                        //                                    for(;i < this.lastSelectedObj.length; i++){
                        //                                        this.lastSelectedObj[i] = null;
                        //                                    }

                        selectedAll = true;

                    }
                }

                if (scObjList.length > 0) {
                    actionType = actionType | SELECTOR_ACTION;

                    var hasInfoWOnNode = this.hasInfoWOnNode(rows[attrIdxArray[treeLevel]]);
                    //node use as info window anchor
                    var anchorNode = selectedAll ? null : hasInfoWOnNode ? touchedObj.node : null;

                    return {at: actionType, k: this.getModelK(), scObjList: scObjList, anchor: anchorNode};
                }

                return null;

            },

            hasOnlyInfoWTarget: function hasOnlyInfoWTarget(row) {
                return this.hasInfoWOnNode(row, true);
            },

            /*
             * return whether the selection target contain infoWindow on the rowH
             * onlyIfW: if true means the target only contain infoWindow
             */
            hasInfoWOnNode: function hasInfoWOnNode(rowH, onlyIfW) {
                var tksList = rowH.sc.tks.split("\x1E"),
                    infows = this.findInfoWInTargets(tksList);
                if (onlyIfW) {
                    return tksList && infows && tksList.length === infows.length;
                } else {
                    return infows && infows.length > 0;
                }
            },

            /**
             * recode the infow shown in this.infoWindowsShown
             */
            hasNoninfowindowTarget: function hasNoninfowindowTarget(actionObj) {
                var scObjList = actionObj && actionObj.scObjList,
                    length = scObjList && scObjList.length,
                    result = false;

                for (var i = 0; i < length; i++) {
                    var scObj = scObjList[i],
                        tksList = scObj.sc.tks.split("\x1E"),
                        infows = this.findInfoWInTargets(tksList);

                    if (tksList.length > infows.length) {
                        //has target which is not infow
                        result = true;
                    }

                    for (var j = 0; j < infows.length; j++) {
                        var key = infows[j];
                        this.infoWindowsShown[key] = true;
                    }
                }

                return result;

            },

            /**
             * return an array contain all the infow in tksList.
             */
            findInfoWInTargets: function hasInfoWOnNode(tksList) {
                var xtabModel = this.xtabModel,
                    docModel = (xtabModel && xtabModel.docModel),
                    result = [];
                if (docModel) {
                    var layouts = docModel.defn && docModel.defn.layouts,
                        layout = null;
                    var i;
                    // for document which has multiple layouts
                    if (layouts) {
                        for (i in layouts) {
                            if (layouts[i].loaded) {
                                layout = layouts[i];
                                break;
                            }
                        }
                    }
                    var units = layout && layout.units;

                    if (units && tksList) {
                        for (var j = 0; j < tksList.length; j++) {
                            var key = tksList[j],
                                unit = units[key];
                            if (unit) {
                                if (this.isChildOfIfw(units, unit)) {
                                    result.push(key);
                                }
                            }
                        }
                    }
                }

                return result;
            },

            getSelectionObjForNonTreeMode: function getSelectionObjForNonTreeMode(touchedObj) {
                var mcol = touchedObj.mcol,
                    mrow = touchedObj.mrow,
                    colInfos = this.colInfos;
                var attrIdxArray = this.attrMapIdx;
                var me = this,
                    model = me.model.data,
                    gts = model.gts,
                    rows = gts.row;

                var scObjList = [];
                var actionType = 0;
                var selectedAll = false;

                var id = colInfos[mcol].order;

                if (this.isAllAttrSelectable) {
                    // entire row mode

                    if (this.closedIfwAttr == mrow && this.isTablet) {
                        /*
                         * tapped on the attr which has show its infowindow and the ifw is the only target for this attr,
                         * the highlight will be clear and we do nothing here
                         */
                        return null;
                    }

                    var hasTapRemainCell = this.updateUnselectedRemainCells({mrow: mrow, mcol: mcol});
                    if (hasTapRemainCell) {
                        return null;
                    }

                    var doUnselection = (mrow == this.prevSelected.mrow),
                        canSelectAll = false;
                    for (var i = 0; i < colInfos.length; i++) {
                        var colInfo = colInfos[i];

                        if (colInfo.sc && (colInfo.sc.all === "true" || colInfo.sc.all === true)) {
                            //can do unselection
                            canSelectAll = true;
                            break;
                        }
                    }

                    if (doUnselection && !canSelectAll) {
                        for (var i = 0; i < colInfos.length; i++) {
                            var colInfo = colInfos[i];
                            if (colInfo.sc) {
                                var tksList = colInfo.sc.tks.split("\x1E"),
                                    infows = me.findInfoWInTargets(tksList);
                                for (var j = 0; j < infows.length; j++) {
                                    var key = infows[j];
                                    if (!me.infoWindowsShown[key]) {
                                        //infow not shown, do selection
                                        doUnselection = false;
                                    }
                                }
                            }
                        }

                    }

                    if (doUnselection) { // xiawang: if current click and previous click is on the same row
                        //do unselection

                        for (var i = 0; i < colInfos.length; i++) {

                            var colInfo = colInfos[i];

                            if (!colInfo.sc) {
                                //not selectable, to next column
                                continue;
                            }

                            /*
                             * a.    if the "select all" has been set for all attributes, then the highlight is removed and the selection is cleared
                             * b.    if the "select all" has not be set on any attributes, then the tap is ignored
                             * c.    if the "select all" has been set on some but not all of the attributes, then the highlight and selection is removed only from those attributes that support the Ã¢â‚¬Å“select allÃ¢â‚¬ï¿½
                             */
                            if (colInfo.sc.all === "false" || colInfo.sc.all === false) {
                                this.unselectedRemainCells.push({mrow: mrow, mcol: i});
                                continue;
                            }

                            var obj = colInfo.rowH.ctlMatrix,
                                selectedIdx = obj.map[mrow],
                                elementId = colInfo.rowH.es[selectedIdx].id;
                            if (!elementId || elementId.substring(0, 1) === "D") {
                                // xiawang: jump for subtotal and empty ID;
                                continue;
                            }

                            selectedAll = true;
                            this.addSCObjToList(scObjList, colInfo.rowH, "", "OA:(All)");
                        }
                        if (scObjList.length > 0) {
                            this.prevSelected = {mrow: -2, mcol: -1};
                            this.updateUnselectedRemainCells();

                            actionType = actionType | SELECTOR_ACTION;
                            //node use as info window anchor, if doing unselect, not show infowindow
                            var anchorNode = selectedAll ? null : touchedObj.node;
                            return {at: actionType, k: this.getModelK(), scObjList: scObjList, anchor: anchorNode};
                        } else {
                            //all the attributes can't select all, do nothing
                            this.unselectedRemainCells = [];
                        }

                        //do nothing, return actionObj with actionType = 0;
                        return {at: actionType};

                    } else {// return if tap on the remainCell, otherwise clean the unselectedRemainCells
                        this.updateUnselectedRemainCells();
                        this.unselectedRemainCells = [];
                    }

                    //do selection
                    for (var i = 0; i < colInfos.length; i++) {
                        var colInfo = colInfos[i];
                        if (!colInfo.sc) {
                            // not selectable, just to next object
                            continue;
                        }

                        var ctlMatrix = colInfo.rowH.ctlMatrix,
                            selectedIdx = ctlMatrix.map[mrow];
                        if (colInfo.rowH.es[selectedIdx]) {
                            var elementId = colInfo.rowH.es[selectedIdx].id;
                            if (!elementId || elementId.substring(0, 1) === "D") {
                                // xiawang: jump for subtotal and empty ID;
                                continue;
                            }

                            this.addSCObjToList(scObjList, colInfo.rowH, "", elementId);
                        }

                    }
                    if (scObjList.length > 0) {
                        this.prevSelected = {mrow: mrow, mcol: -1};

                        actionType = actionType | SELECTOR_ACTION;
                        //node use as info window anchor
                        var anchorNode = selectedAll ? null : touchedObj.node;
                        return {at: actionType, k: this.getModelK(), scObjList: scObjList, anchor: anchorNode};
                    }

                } else {
                    //not entire row mode

                    var colInfo = this.getCGColInfo(mcol, true);

                    if (colInfo.sc) {
                        // selectable

                        var ctlMatrix = colInfo.rowH.ctlMatrix,
                            colInfoCG = this.getCGColInfo(mcol),
                            ctlMatrixCG = colInfoCG && colInfoCG.rowH.ctlMatrix,
                            touchedId = this.colInfos[mcol].order,
                            touchedOnCGChildren = touchedId.indexOf(":CG") === touchedId.length - 3 && touchedId.length >= 3;

                        var elementId = "";
                        var isAll = false;

                        var selectedIdx = ctlMatrix.map[mrow];
                        if (colInfo.rowH.es[selectedIdx]) {
                            elementId = colInfo.rowH.es[selectedIdx].id;
                            if (!elementId || elementId.substring(0, 1) === "D") {
                                // xiawang: jump for subtotal and empty ID;
                                return;
                            }
                            if (this.closedIfwAttr == elementId && this.isTablet) {
                                /*
                                 * tapped on the attr which has show its infowindow and the ifw is the only target for this attr,
                                 * the highlight will be clear and we do nothing here
                                 */
                                return null;
                            }

                        }

                        var canSelectAll = !(colInfo.sc.all === "false" || colInfo.sc.all === false);

                        var me = this;
                        var sameAsLastSelected = function () {
                            var result = ctlMatrix.selectedIdx[selectedIdx];
                            if (ctlMatrixCG) {
                                if (ctlMatrixCG.selectedIdx[-1]) {
                                    //all the CG node selected
                                } else {
                                    result = result && ctlMatrixCG.selectedIdx[ctlMatrixCG.map[mrow]];
                                }
                            }

                            /**
                             * if can do unselection, do unselection
                             * else if there is infow on this node, show the infow again
                             */
                            if (result && !canSelectAll) {
                                var tksList = colInfo.rowH.sc.tks.split("\x1E"),
                                    infows = me.findInfoWInTargets(tksList);
                                for (var i = 0; i < infows.length; i++) {
                                    var key = infows[i];
                                    if (!me.infoWindowsShown[key]) {
                                        //infow not shown, do selection
                                        result = false;
                                    }
                                }
                            }
                            return result;
                        }
                        if (sameAsLastSelected()) {
                            //do unselect
                            var canSelectAll = !(colInfo.sc.all === "false" || colInfo.sc.all === false);
                            if (canSelectAll) {
                                elementId = "OA:(All)";
                                selectedAll = true;
                                ctlMatrix.selectedIdx = {};
                                if (ctlMatrixCG) {
                                    ctlMatrixCG.selectedIdx = {};
                                }
                                this.prevSelected = {mrow: -2, mcol: -1};
                            } else {
                                return null;
                            }
                        } else {
                            //do select
                            ctlMatrix.selectedIdx = {};
                            ctlMatrix.selectedIdx[selectedIdx] = true;

                            if (ctlMatrixCG) {
                                ctlMatrixCG.selectedIdx = {};
                                if (touchedOnCGChildren) {
                                    //click on CG children node
                                    //select this node and this parent
                                    ctlMatrixCG.selectedIdx[ctlMatrixCG.map[mrow]] = true;
                                    if (ctlMatrixCG.map[mrow] < colInfoCG.rowH.es.length) {
                                        //if has children node, get its element id
                                        elementId = colInfoCG.rowH.es[ctlMatrixCG.map[mrow]].id;
                                    }
                                } else {
                                    //click on CG parent node
                                    //select all the CG node
                                    ctlMatrixCG.selectedIdx[-1] = true;
                                }
                            }

                            //used to decide the selected attr after infow closed
                            this.prevSelected = {mrow: mrow, mcol: mcol};
                        }

                        var scObj = {};
                        scObj.sc = colInfo.sc;
                        scObj.eid = elementId;
                        scObjList.push(scObj);
                    }

                    if (scObjList.length > 0) {
                        actionType = actionType | SELECTOR_ACTION;
                        //node use as info window anchor
                        var anchorNode = selectedAll ? null : touchedObj.node;
                        return {at: actionType, k: this.getModelK(), scObjList: scObjList, anchor: anchorNode};
                    }
                }

                return null;

            },

            getLinkDrillObjForTreeMode: function getLinkDrillObjForTreeMode(touchedObj) {

                var actionType = 0;
                var linkDrillNode = null;

                var model = this.model.data,
                    gts = model.gts,
                    rowHs = gts.row;
                var mcol = touchedObj.mcol,
                    mrow = touchedObj.mrow,
                    colInfos = this.colInfos;

                var treeNode = touchedObj.treeNode;
                var treePath = treeNode.treePath;
                var treePathArray = treePath.split("_");
                var treeLevel = treePathArray.length - 1;
                var attrIdxArray = this.attrMapIdx;

                //find col index
                var id = null;
                var colInfo = colInfos[mcol];
                var colType = colInfo && colInfo.type;
                if (colType == ATTR_NAME) {
                    if (mrow == -1) {
                        /*
                         * PM required: remove selection and link drill on header from 931
                         */
                        //tapped on header
                        //                                    var rowH = rowHs[0];
                        //                                    if(rowH.lm && rowH.lm[0] && rowH.lm[0].links){
                        //                                        linkDrillNode = {};
                        //                                        linkDrillNode.titleInfo = rowH;
                        //                                        linkDrillNode._e = {n:"", id:""};
                        //                                        linkDrillNode.v = linkDrillNode._e.n;
                        //                                    }
                    } else {
                        //tapped on treeNode
                        var rowH = rowHs[attrIdxArray[treeLevel]];
                        if (rowH.lm && rowH.lm[0] && rowH.lm[0].links) {
                            linkDrillNode = {};
                            linkDrillNode.titleInfo = rowH;
                            var treeNode = getTreeNode(this.tree, treePath);
                            linkDrillNode._e = treeNode.es[0] || {n: "", id: ""};
                            linkDrillNode.v = linkDrillNode._e.n;
                        }
                    }

                } else if (colType == METRIC_VALUE) {
                    if (colInfo.lm) {
                        //has link drill on this metric

                        id = colInfo.order;
                        //tapped on metric
                        var mix = parseInt(id); //metric idx

                        var metricH = gts.col[0];//metric Header in gts

                        if (metricH) {
                            //this metric has defined link drill
                            linkDrillNode = {};
                            linkDrillNode.mix = mix;
                            linkDrillNode.titleInfo = metricH;

                            if (mrow == -1) {
                                // tapped on metric header
                                linkDrillNode._e = metricH.es[mix] || {n: "", id: ""};
                                linkDrillNode.v = linkDrillNode._e.n;
                            } else {
                                // tapped on metric vaule
                                //build TreeNode Parent Attr
                                var currNode = linkDrillNode;
                                var treeNode = this.tree;
                                for (var i = 0; i < treePathArray.length; i++) {
                                    var idx = treePathArray[i];
                                    treeNode = treeNode.childrenTreeNodeList[idx];

                                    var attrIdx = attrIdxArray[i];
                                    rowH = rowHs[attrIdx];

                                    var nodeLP = {};
                                    nodeLP.titleInfo = rowH;
                                    nodeLP._e = treeNode.es[0] || {n: "", id: ""};
                                    nodeLP.v = nodeLP._e.n;

                                    currNode._lp = nodeLP;
                                    currNode.axis = ROW_AXIS;
                                    currNode = nodeLP;
                                }
                            }
                        }
                    }

                }

                if (linkDrillNode) {
                    this.highlightEntireRow = false;
                    actionType = actionType | HYPERLINK_ACTION;
                    if (linkDrillNode.mix != undefined) {
                        return {at: actionType, k: this.getModelK(), node: linkDrillNode, mix: mix};
                    } else {
                        return {at: actionType, k: this.getModelK(), node: linkDrillNode};
                    }

                }
            },

            getLinkDrillObjForNonTreeMode: function getLinkDrillObjForNonTreeMode(touchedObj) {
                var actionType = 0;

                var model = this.model.data,
                    gts = model.gts,
                    rowHs = gts.row;
                var mcol = touchedObj.mcol,
                    mrow = touchedObj.mrow,
                    colInfos = this.colInfos;

                var node = touchedObj.node, titleInfo;
                this.highlightEntireRow = false;
                var attrIdxArray = this.attrMapIdx;
                var colInfo = colInfos[mcol];

                if (!this.isKPI) {
                    // non-KPI mode
                    if (linkCount === 1 && attrCount === 1 && mrow != -1) {
                        //only one link drill, check whether the link drill is on attr
                        for (var key in colInfos) {
                            var colInf = colInfos[key];
                            if (colInf.lm && colInf.type == ATTR_NAME) {
                                // if there is only one attr and there is one link drill on it
                                // entire row mode
                                this.highlightEntireRow = true;
                                var titleInfo = colInf.lm;
                                actionType = titleInfo && titleInfo.at || HYPERLINK_ACTION;
                                node._e = this.rows[mrow].model.elms[colInf.order] || {id: "", n: ""};
                                node.v = node._e.n;
                                break;
                            }
                        }

                    }

                    if (!this.highlightEntireRow) {

                        if (colInfo.type == CHART) {
                            return null;
                        }

                        var titleInfo = colInfo.lm;
                        if (titleInfo) {
                            actionType = titleInfo && titleInfo.at;

                            if (colInfo.type == ATTR_NAME) {
                                // attribute
                                if (mrow === -1) { // attribute
                                    // header
                                    node._e = {};
                                    node._e.onTitle = true;
                                    node._e.id = titleInfo.id;
                                    node._e.n = titleInfo.n;
                                    node.v = titleInfo.n;
                                } else { // attribute element
                                    node._e = this.rows[mrow].model.elms[colInfo.order] || {id: "", n: ""};
                                    node.v = node._e.n;
                                }
                            } else if (colInfo.type == METRIC_VALUE) { // metric
                                node.mix = colInfo.order;
                                node.axis = ROW_AXIS;

                                this.buildLeftParent(node, mrow, mcol);
                                actionType = this.rows[mrow == -1 ? 0 : mrow].model.refv[colInfo.order].at || HYPERLINK_ACTION;
                            }
                        }
                    }
                } else {
                    //KPI mode
                    if (colInfo.type == CHART) {
                        return null;
                    }
                    var titleInfo = colInfo.lm;
                    var metricIdx = this.rows[mrow].model.metricIdx;
                    if (titleInfo && titleInfo.lm && titleInfo.lm[metricIdx] && titleInfo.lm[metricIdx].links) {

                        node.mix = "" + metricIdx;
                        node.axis = ROW_AXIS;

                        this.buildLeftParent(node, metricIdx, mcol);
                        actionType = this.rows[mrow].model.refv[0].at || HYPERLINK_ACTION;
                    } else {
                        titleInfo = null;
                    }

                }

                if (titleInfo) {
                    node.titleInfo = titleInfo;
                    actionType = actionType | HYPERLINK_ACTION;

                    if (node.mix != undefined) {
                        return {at: actionType, mcol: mcol, mrow: mrow, k: this.getModelK(), node: node, mix: node.mix};
                    } else {
                        return {at: actionType, mcol: mcol, mrow: mrow, k: this.getModelK(), node: node};
                    }

                }

                return null;
            },

            getActionObj: function getActionObj(touchedObj) {
                var actionObjList = [];

                if (touchedObj.mrow == -1) {
                    //PM required: remove the selection and link drilling on header
                    return null;
                }

                var actionObj = null;

                //first try to do selection
                if (this.isTreeMode) {
                    actionObj = this.getSelectionObjForTreeMode(touchedObj);
                } else {
                    actionObj = this.getSelectionObjForNonTreeMode(touchedObj);
                }

                if (actionObj) {
                    actionObjList.push(actionObj);
                    return actionObjList;
                } else {
                    //if no selection try to do link drill
                    if (this.isTreeMode) {
                        actionObj = this.getLinkDrillObjForTreeMode(touchedObj);
                    } else {
                        actionObj = this.getLinkDrillObjForNonTreeMode(touchedObj);
                    }
                    actionObjList.push(actionObj);
                }
                return actionObjList;
            },

            /*
             * find the default highlight row for treemode and entire row mode in non-treemode
             * if the highlight targets only contains infowindow, then don't show the highlight
             * remove the selectedIdx in ctlMatrix
             */
            getDefaultHighlightRow: function getDHR() {
                var attrIdxArray = this.attrMapIdx,
                    rows = this.model.data.gts.row,
                    colInfos = this.colInfos,
                    colCount = colInfos.length,
                    controlMatrix = null,
                    resultSet = null,
                    hasOnlyIfwTarget = true;

                if (!this.isTreeMode) {

                    if (this.isAllAttrSelectable) {
                        //for entire row mode

                        for (var i = 0; i < colCount; i++) {
                            // for Custom Group Children, We should use CG control matrix, not default control matrix
                            var colInfo = this.colInfos[i],
                                rowH = colInfo.rowH;
                            if (!colInfo.sc || !rowH) {
                                //skip if not selectable
                                continue;
                            }
                            controlMatrix = rowH.ctlMatrix;
                            if (controlMatrix) {
                                if (!this.hasOnlyInfoWTarget(rowH)) {
                                    hasOnlyIfwTarget = false;
                                }

                                if (!resultSet) {
                                    // for the first time, we need to set result set
                                    resultSet = {};
                                    for (var j = 0; j < controlMatrix.map.length; j++) {
                                        if (controlMatrix.selectedIdx[controlMatrix.map[j]]) {
                                            resultSet[j] = true;
                                        }
                                        ;
                                    }
                                    ;
                                } else { // we remove result set from existing set
                                    for (var j in resultSet) {
                                        if (!controlMatrix.selectedIdx[controlMatrix.map[j]]) { // if row
                                            delete resultSet[j];
                                        }
                                        ;
                                    }
                                    ;
                                }
                            }
                        }

                        if (hasOnlyIfwTarget || !resultSet || Object.keys(resultSet).length !== 1) {
                            // do nothing, no init highlight
                        } else {
                            var selectedRow = parseInt(Object.keys(resultSet)[0]);
                            this.prevSelected = {
                                mrow: selectedRow,
                                mcol: -1
                            };
                        }

                        //remove the selectedIdx in controlMatrix
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].ctlMatrix) {
                                rows[i].ctlMatrix.selectedIdx = {};
                            }
                        }
                    } else {
                        //none treemode, not entire row mode, remove selectedIdx if target only ifw
                        for (var i = 0; i < rows.length; i++) {
                            var rowH = rows[i],
                                controlMatrix = rowH.ctlMatrix,
                                checkThisAttr = (controlMatrix && Object.keys(controlMatrix.selectedIdx).length > 0) ? true : false;

                            if (checkThisAttr && !this.hasOnlyInfoWTarget(rowH)) {
                                hasOnlyIfwTarget = false;
                                break;
                            }
                        }

                        if (hasOnlyIfwTarget) {
                            //remove the selectedIdx in controlMatrix
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].ctlMatrix) {
                                    rows[i].ctlMatrix.selectedIdx = {};
                                }
                            }
                        }
                    }

                } else {
                    //Treemode
                    //use the default highlight when the this.currSelectedObj is not set
                    if (this.currSelectedObj && this.currSelectedObj.length <= 0) {

                        this.currSelectedObj = [];

                        var findTreeNodeByAttrElemIdx = function (treeNodeList, attrElemIdx) {
                            var treeNodeCount = treeNodeList.length;
                            for (var i = 0; i < treeNodeCount; i++) {
                                var treeNode = treeNodeList[i];
                                if (treeNode.attrElemIdx == attrElemIdx) {
                                    return treeNode;
                                }
                            }
                            return null;
                        };

                        var me = this;

                        var findCurrSelectedObjByAttrElemIdx = function (tree, level) {
                            controlMatrix = rows[me.attrMapIdx[level]].ctlMatrix;

                            var treeNodeList = tree.childrenTreeNodeList;
                            var treeNodeCount = treeNodeList.length;
                            if (treeNodeCount <= 0) {
                                return;
                            }

                            var treeNode = null;
                            if (controlMatrix) {
                                for (var key in controlMatrix.selectedIdx) {
                                    treeNode = findTreeNodeByAttrElemIdx(treeNodeList, key);
                                }

                                if (treeNode) {
                                    me.currSelectedObj[level] = treeNode;
                                    findCurrSelectedObjByAttrElemIdx(treeNode, level + 1);

                                    return true;
                                }

                            } else {
                                //do not care
                                me.currSelectedObj[level] = null;
                                for (var i = 0; i < treeNodeCount; i++) {
                                    var find = findCurrSelectedObjByAttrElemIdx(treeNodeList[i], level + 1);
                                    if (find) {
                                        return true;
                                    }
                                }

                            }

                            return false;

                        };

                        findCurrSelectedObjByAttrElemIdx(this.tree, 0);

                        //remove all the null at last
                        while (this.currSelectedObj.length > 0 && !this.currSelectedObj[this.currSelectedObj.length - 1]) {
                            this.currSelectedObj.pop();
                        }

                        //if the target for the default highlight contains only infowindow, then do not show the highlight
                        for (var i = 0; i < this.currSelectedObj.length; i++) {
                            var treeNode = this.currSelectedObj[i];
                            if (treeNode) {
                                var attrIdx = attrIdxArray[i];
                                rowH = rows[attrIdx];
                                if (!this.hasInfoWOnNode(rowH, true)) {
                                    hasOnlyIfwTarget = false;
                                    break;
                                }
                            } else {
                                //treeNode not select
                                continue;
                            }
                        }
                        if (hasOnlyIfwTarget) {
                            this.currSelectedObj = [];
                        }

                        this.lastSelectedObj = $HASH.clone(this.currSelectedObj);
                        return;

                    }
                }
            },

            /**
             * firstCGCol: true -- return this colInfo if it is not CG, else return the first CG
             *             false -- return null if it is not CG, else return the CG chidren
             */
            getCGColInfo: function getCGColInfo(cIdx, firstCGCol) {
                var colInfo = this.colInfos[cIdx],
                    isCG = colInfo.CGColIdx >= 0 ? true : false,
                    otherColInfo = colInfo && (isCG ? this.colInfos[colInfo.CGColIdx] : null);

                if (firstCGCol) {
                    if (isCG) {
                        return colInfo.isFirstCGCol ? colInfo : otherColInfo;
                    } else {
                        return colInfo;
                    }
                } else {
                    //find CG children
                    if (isCG) {
                        return colInfo.isFirstCGCol ? otherColInfo : colInfo;
                    } else {
                        return null;
                    }
                }
            },

            /*
             * update rowInfos:
             * rowInfo.selected[-1] = true; --- highlight the row
             * rowInfo.selected[i] = true; --- highlight the cell with column idx i
             */
            updateSelectedStatus: function updateSS(tree) {
                if (this.isTreeMode) {
                    this.updateTreeSelection(tree);
                } else {
                    //none tree mode
                    if (this.isAllAttrSelectable && this.unselectedRemainCells.length == 0) {
                        //entire row mode
                        var rows = this.rows,
                            rowCount = rows.length,
                            selectedRowIdx = this.prevSelected.mcol == -1 ? this.prevSelected.mrow : -2;

                        for (var i = 0; i < rowCount; i++) {
                            var rowInfo = rows[i];
                            if (i == selectedRowIdx) {
                                rowInfo.selected[-1] = true;
                            } else {
                                rowInfo.selected[-1] = false;
                            }
                        }

                    } else {
                        //for none-entire row mode, update selected status for rows according to ctlMatrix

                        var colInfos = this.colInfos,
                            colCount = colInfos.length;

                        var update = function (colIdx) {
                            var colInfo = this.getCGColInfo(colIdx, true)
                            ctlMatrix = colInfo.rowH.ctlMatrix,
                                colInfoCG = this.getCGColInfo(colIdx),
                                ctlMatrixCG = colInfoCG && colInfoCG.rowH.ctlMatrix;

                            // now work for body
                            if (ctlMatrixCG && !ctlMatrixCG.selectedIdx[-1]) {
                                //has CG
                                //select all the CG attr, according to ctlMatrix
                                //select CG attr according to ctlMatrixCG
                                ctlMatrix = ctlMatrixCG;
                            }

                            var map = ctlMatrix.map,
                                rows = this.rows,
                                rowCount = rows.length,
                                selectedIdx = ctlMatrix.selectedIdx,
                                assAttr = colInfo.associateAttr;

                            for (var i = 0; i < rowCount; i++) {
                                var rowInfo = rows[i];
                                if (selectedIdx[map[i]]) {
                                    rowInfo.selected[colIdx] = true;
                                    //TQMS 734480: When there are multi attribute forms are displayed in Microchart, these forms should work as one attribute.
                                    for (var idx in assAttr) {
                                        rowInfo.selected[assAttr[idx]] = true;
                                    }
                                } else {
                                    rowInfo.selected[colIdx] = false;
                                    for (var idx in assAttr) {
                                        rowInfo.selected[assAttr[idx]] = false;
                                    }
                                }
                            }
                        };

                        for (var i = 0; i < colCount; i++) {
                            var colInfo = colInfos[i];
                            if (colInfo.rowH && colInfo.rowH.ctlMatrix) {
                                update.call(this, i);
                            }
                        }
                    }
                }

            },

            performActionAndDoHighlight: function performActionAndDoHighlight(actionObjList, touchedObj) {
                var actionObj = actionObjList && actionObjList[0];

                this.hasNonifwTarget = this.hasNoninfowindowTarget(actionObj);
                if (actionObj.at & SELECTOR_ACTION) {
                    // update the highlight
                    if (this.isTreeMode) {
                        this.updateSelectedStatus(this.tree);
                        this.updateHighlightForCurrRenderRows();

                        this.lastSelectedObj = $HASH.clone(this.currSelectedObj);
                    } else {
                        this.updateSelectedStatus();
                        this.updateHighlightForCurrRenderRows();
                    }

                    //do not need to highlight for selection, if the selection targets contain only infowindow on phone
                    var isPhone = $D.isAndroid && !this.isTablet;
                    var infoWInNewDialog = isPhone && !this.hasNonifwTarget;

                    //TQMS 794808:There is no highlight when tapping on microchart to trigger info window
                    if (infoWInNewDialog) {
                        var me = this;
                        window.setTimeout(function () {
                            me.performAction(actionObjList);
                        }, 100);
                    } else {
                        this.performAction(actionObjList);
                    }

                } else if (actionObj.at & HYPERLINK_ACTION) {
                    //do link drill
                    this.highlightForLD(touchedObj.mrow, touchedObj.mcol, touchedObj.node);

                    this.performAction(actionObjList);

                }

            },

            /**
             * tappedCell: null -- update the ctlMatrix according to this.unselectedRemainCells. if the unselectedRemainCells is not selected in ctlMatrix, set the ctlMatrix, else clear the ctlMatrix
             *               {mrow:x, mcol:x} -- return whether tapped on the unselected remain cells
             */
            updateUnselectedRemainCells: function uurc(tappedCell) {
                var hasTapRemainCell = false;

                for (var i = this.unselectedRemainCells.length - 1; i >= 0; i--) {
                    var cell = this.unselectedRemainCells[i],
                        mcol = cell.mcol,
                        mrow = cell.mrow,
                        colInfo = this.getCGColInfo(mcol, true);

                    if (colInfo.sc) {
                        // selectable
                        var ctlMatrix = colInfo.rowH.ctlMatrix,
                            colInfoCG = this.getCGColInfo(mcol),
                            ctlMatrixCG = colInfoCG && colInfoCG.rowH.ctlMatrix,
                            touchedId = this.colInfos[mcol].order,
                            touchedOnCGChildren = touchedId.indexOf(":CG") === touchedId.length - 3 && touchedId.length >= 3;

                        var selectedIdx = ctlMatrix.map[mrow];
                        elementId = colInfo.rowH.es[selectedIdx].id;
                        if (!elementId || elementId.substring(0, 1) === "D") {
                            // xiawang: jump for subtotal and empty ID;
                            // return;
                            continue;
                        } else {
                            if (ctlMatrix.selectedIdx[selectedIdx]) {
                                //has already selected
                                if (tappedCell) {
                                    if (mcol == tappedCell.mcol) {
                                        // tapped on remain cell
                                        var tappedCtlMatrix = touchedOnCGChildren ? ctlMatrixCG : ctlMatrix,
                                            tappedIdx = tappedCtlMatrix && tappedCtlMatrix.map[tappedCell.mrow];
                                        if (tappedIdx == selectedIdx) {
                                            hasTapRemainCell = true;
                                        }
                                    }
                                    continue;
                                }
                                // clear the unselected remain cell before we selected others
                                ctlMatrix.selectedIdx = {};
                                if (ctlMatrixCG) {
                                    ctlMatrixCG.selectedIdx = {};
                                }

                            } else {
                                // set selectedIdx for the unselectedRemainCell, so that the remain cell can be highlight after the unselected
                                ctlMatrix.selectedIdx = {};
                                ctlMatrix.selectedIdx[selectedIdx] = true;
                                if (ctlMatrixCG) {
                                    ctlMatrixCG.selectedIdx = {};
                                    if (touchedOnCGChildren) {
                                        //click on CG children node
                                        //select this node and this parent
                                        ctlMatrixCG.selectedIdx[ctlMatrixCG.map[mrow]] = true;
                                    } else {
                                        //click on CG parent node
                                        //select all the CG node
                                        ctlMatrixCG.selectedIdx[-1] = true;
                                    }
                                }

                            }

                        }
                    }

                }

                return hasTapRemainCell;

            },

            highlightCellsByRowInfo: function highlightCellsByRowInfo(rowInfo) {
                var rowRef = rowInfo.rowRef;
                if (!rowRef) {
                    return;
                }

                var trL = rowRef[LEFT_CHART_ROW];
                var trR = rowRef[RIGHT_CHART_ROW];

                var tdsL = trL && trL.childNodes;
                var tdsR = trR && trR.childNodes;
                var tdsLLen = tdsL && tdsL.length || 0,
                    tdsRLen = tdsR && tdsR.length || 0;

                var colCount = tdsLLen + tdsRLen;

                for (var i = 0; i < colCount; i++) {
                    var td = i < tdsLLen ? tdsL[i] : tdsR[i - tdsLLen];
                    this.highlightCell(td, rowInfo.selected[i]);
                }
            },

            setSelectedStyle: function setSelectedStyle(level) {
                if (level == 0) {
                    this.selectedStyle = "background-color:#015DE6;color:#FFFFFF;";
                } else if (level == 1) {
                    this.selectedStyle = "background-color:rgba(1,93,230, 0.7);color:#FFFFFF;";
                } else {
                    this.selectedStyle = "background-color:rgba(1,93,230, 0.5);color:#FFFFFF;";
                }

            },

            highlightTreeArrow: function highlightTreeArrow(rowInfo, highlight) {
                if (this.treeColumnIdx > -1 && this._leftChart) {
                    if (highlight) {
                        this._leftChart.setTreeArrow(rowInfo, 'white');
                    } else {
                        this._leftChart.setTreeArrow(rowInfo);
                    }

                }
            },

            highlightCell: function highlightCell(td, highlight) {
                if (highlight) {
                    // add style
                    setNodeCssText(td, TD_SELECTED_CSS + this.selectedStyle);

                    if (this.selectedClass && this.selectedClass.length > 0) {
                        $CSS.addClass(td, this.selectedClass);
                    }
                } else {
                    // remove style
                    setNodeCssText(td, DEFAULT_TD_CSS);

                    if (this.selectedClass && this.selectedClass.length > 0) {
                        $CSS.removeClass(td, this.selectedClass);
                    }
                }

            },

            highlightForLD: function highlightForLD(mrow, mcol, node) {
                if (this.highlightEntireRow && !this.isTreeMode) {
                    this.highlightRowByRowInfo(this.rows[mrow], true);
                } else {
                    if (node) {
                        this.highlightCell(node, true);
                    }

                    var colInfo = this.colInfos[mcol],
                        aAttr = colInfo.associateAttr;
                    var siblings = node.parentNode.childNodes;
                    for (var idx in aAttr) {
                        this.highlightCell(siblings[aAttr[idx]], true);

                        if (this.treeColumnIdx == idx) {
                            this.highlightTreeArrow(this.rows[mrow]);
                        }
                    }
                }

            },

            /**
             * highlight if true highlihgt, else unhighlihgt
             */
            highlightRowByRowInfo: function highlightRowByRowInfo(rowInfo, highlight) {
                var rowRef = rowInfo.rowRef;
                if (!rowRef) {
                    return;
                }
                var level = rowInfo.treeNode ? rowInfo.treeNode.level : 0;
                this.setSelectedStyle(level);
                if (rowRef[LEFT_CHART_ROW]) {
                    this.highlightRow(rowRef[LEFT_CHART_ROW], highlight);
                }
                if (rowRef[RIGHT_CHART_ROW]) {
                    this.highlightRow(rowRef[RIGHT_CHART_ROW], highlight);
                }

                /*
                 * PM required: Once a row is selected, the color of the arrow should also be changed along with the text
                 */
                this.highlightTreeArrow(rowInfo, highlight);

            },

            highlightRow: function highlightRow(tr, highlight) {
                var tds = tr.childNodes;
                for (var i = 0; i < tds.length; i++) {
                    if (highlight) {
                        // add style
                        setNodeCssText(tds[i], TD_SELECTED_CSS + this.selectedStyle);

                        if (this.selectedClass && this.selectedClass.length > 0) {
                            $CSS.addClass(tds[i], this.selectedClass);
                        }
                    } else {
                        // remove style
                        setNodeCssText(tds[i], DEFAULT_TD_CSS);
                        if (this.selectedClass && this.selectedClass.length > 0) {
                            $CSS.removeClass(tds[i], this.selectedClass);
                        }
                    }

                }
            },

            /*
             * return whether the attr at tree level ? is selectable
             */
            isAttrSelectable: function isAttrSelectable(treeLevel) {
                var attrIdx = this.attrMapIdx[treeLevel];
                var ctlMatrix = this.model.data.gts.row[attrIdx].ctlMatrix;
                if (ctlMatrix) {
                    return true;
                }
                return false;
            },

            /*
             * update selected var in this.tree
             */
            updateTreeSelection: function updateTreeSelection(tree) {
                //clear last selected
                this.selectOrClearTreeNodes(tree, true, 0);
                //highlight curr selected
                this.selectOrClearTreeNodes(tree, false, 0);
            },

            findTheTreeNodeWithSameID: function findTheTreeNodeWithSameID(treeNodeList, id) {
                var treeNodeCount = treeNodeList.length;
                for (var i = 0; i < treeNodeCount; i++) {
                    var treeNode = treeNodeList[i];
                    if (treeNode.id == id) {
                        return treeNode;
                    }
                }
                return null;
            },

            selectOrClearTreeNodes: function selectOrClearTreeNodes(treeNode, clear, treeLevel) {
                if (!treeNode) {
                    return;
                }
                if (clear && this.lastSelectedObj.length <= treeLevel) {
                    // nothing to clear
                    return;
                }
                if (!clear && this.currSelectedObj.length <= treeLevel) {
                    // nothing to highlight
                    return;
                }

                var tappedTreeNode = null;

                if (clear) {
                    tappedTreeNode = this.lastSelectedObj[treeLevel];
                } else {
                    tappedTreeNode = this.currSelectedObj[treeLevel];
                }

                var treeNodeList = treeNode.childrenTreeNodeList,
                    treeNodeCount = treeNodeList.length;

                if (tappedTreeNode) {

                    treeNode = this.findTheTreeNodeWithSameID(treeNodeList, tappedTreeNode.id);

                    if (treeNode) {
                        // same as selected node
                        treeNode.selected = clear ? false : true;
                        this.selectOrClearTreeNodes(treeNode, clear, treeLevel + 1);
                    }
                } else {
                    for (var i = 0; i < treeNodeCount; i++) {
                        this.selectOrClearTreeNodes(treeNodeList[i], clear, treeLevel + 1);
                    }
                }

            },

            updateHighlightForCurrRenderRows: function updateHighlightForCurrRenderRows() {
                //                            this.updateHighlightForHeader();
                var rows = this.rows;
                var rowCount = rows.length,
                    rowInfo = null;
                for (var i = this.startCnt; i < this.endCnt; i++) {
                    rowInfo = rows[i];
                    if (this.isTreeMode) {
                        //tree mode
                        this.highlightRowByRowInfo(rowInfo, rowInfo.treeNode.selected);
                    } else {
                        //non-tree mode
                        if (this.isAllAttrSelectable && this.unselectedRemainCells.length == 0) {
                            this.highlightRowByRowInfo(rowInfo, rowInfo.selected[-1]);
                        } else {
                            this.highlightCellsByRowInfo(rowInfo);
                        }
                    }
                }

                if (this.isTreeMode) {
                    //update highlight for docked headers
                    rows = this.dockedHeaderRows;
                    rowCount = rows.length;
                    for (var i = 0; i < rowCount; i++) {
                        rowInfo = rows[i];
                        this.highlightRowByRowInfo(rowInfo, rowInfo.treeNode.selected);
                    }
                    rows = this.dockedHeaderReplaceRows;
                    rowCount = rows.length;
                    for (var i = 0; i < rowCount; i++) {
                        rowInfo = rows[i];
                        this.highlightRowByRowInfo(rowInfo, rowInfo.treeNode.selected);
                    }
                }

            },

            /*
             * travel from top to bottom use the treePathArray and return a treeNode array on the treePath
             * if the treeNode is not selected, then use null instead
             */
            getSelectedTreeNodeListFromTreePath: function getSelectedTreeNodeListFromTreePath(treePathArray) {
                if (!treePathArray) {
                    return [];
                }
                var treeNodeList = [];
                var treeNode = this.tree;
                for (var i = 0; i < treePathArray.length; i++) {
                    var treeNodeIdx = treePathArray[i];
                    treeNode = treeNode.childrenTreeNodeList[treeNodeIdx];
                    if (!treeNode) {
                        break;
                    }
                    if (this.isAttrSelectable(i)) {
                        treeNodeList[i] = treeNode;
                    } else {
                        treeNodeList[i] = null;
                    }

                }
                return treeNodeList;
            },



            toggleSortOrderAndArrow: function togglesoaa(sortKeyIdx, currSortOrder) {
                var colInfo = this.colInfos[sortKeyIdx],
                    th = colInfo.thRef,
                    prevSortOrder = colInfo.sortOrder;

                if (!th) {
                    return;
                }

                //set the sortOrder
                colInfo.sortOrder = currSortOrder;

                /**
                 * TQMS 764167:
                 * On web, when we want to set the width for table cells to w, we have to minus the padding and set the width style to w - padding, then the actually value will be w.
                 * But on device, if we do the same thing, the sum of the width we set is less than the total width. It will scale the width to fit the total width
                 */
                var ignorePadding = this.isAndroid;

                var compStyle = $CSS.getComputedStyle(th),
                    textAlign = compStyle['text-align'],
                    arrowWidth = Math.round(4 * zf),
                    maxarrowHeadHeight = Math.round(15 * zf),
                    sortArrowCanvasWidth = arrowWidth * 2,
                    whichPadding,
                    sortArrowPosition,
                    textDimesion = this.getTextDimesion(th.innerHTML, th),
                    arrowTotalHeight = textDimesion.height > maxarrowHeadHeight ? maxarrowHeadHeight : textDimesion.height || maxarrowHeadHeight,
                    textLineCount = textDimesion.width > parseInt(colInfo.contentWidth) ? 2 : 1;
                //find which side to draw the arrow, left or right
                if (textAlign == 'left' || textAlign == 'center') {
                    whichPadding = 'padding-left';
                    sortArrowPosition = 'left';
                } else {
                    whichPadding = 'padding-right';
                    sortArrowPosition = 'right';
                }

                //make room for the sort arrow
                var on = prevSortOrder == SORT_ORDER.NORMAL && currSortOrder !== SORT_ORDER.NORMAL,
                    off = prevSortOrder !== SORT_ORDER.NORMAL && currSortOrder == SORT_ORDER.NORMAL;

                if (on) {
                    //increase the padding to hold the arrow
                    th.style[whichPadding] = (parseInt(compStyle[whichPadding]) + sortArrowCanvasWidth) + 'px';
                    if (!ignorePadding) {
                        th.style['width'] = (colInfo.styleWidth - sortArrowCanvasWidth) + 'px';
                    }
                } else if (off) {
                    th.style['width'] = colInfo.styleWidth + 'px';
                    th.style[whichPadding] = colInfo.padding[sortArrowPosition] + 'px';
                }
                //as the room for title text is smaller. do the truncate again
                colInfo.titleOverflow = this.utils.truncateTextToLineWithWordWrap2(th, colInfo.title, this.textCanvas, textLineCount);
                //update the title text dimesion
                textDimesion = this.getTextDimesion(th.innerHTML, th);

                //draw the sort arrow
                var canvas = this.sortArrowCanvas;

                //find arrow position
                var posTH = $D.position(th),
                    posW,
                    leftTH,
                    isSortOnRightChart = this.enableSmoothScroll && sortKeyIdx >= this.attrColumnCount;

                if (isSortOnRightChart) {
                    posW = $D.position(this._rightChart.domNode);
                    leftTH = posTH.x - posW.x + this._leftChart.domNode.offsetWidth;
                } else {
                    posW = $D.position(this.domNode);
                    leftTH = posTH.x - posW.x;
                }
                var textWidth = textDimesion.width;
                if (textAlign == 'left') {
                    canvas.style.left = (leftTH + colInfo.padding[sortArrowPosition]) + 'px';
                } else if (textAlign == 'center') {
                    canvas.style.left = Math.round(leftTH + (colInfo.colWidth - colInfo.padding.left - colInfo.padding.right - sortArrowCanvasWidth - textWidth) / 2 + colInfo.padding[sortArrowPosition]) + 'px';
                } else {
                    canvas.style.left = (leftTH + colInfo.colWidth - colInfo.padding[sortArrowPosition] - sortArrowCanvasWidth ) + 'px';
                }

                if (isSortOnRightChart) {
                    var origin = this._scroller.origin;
                    this.utils.translateCSS(-origin.x, -origin.y, false, canvas);
                    canvas.style.zIndex = 0;
                } else {
                    this.utils.translateCSS(0, 0, false, canvas);
                    canvas.style.zIndex = 1;
                }

                var textHeight = textDimesion.height;
                if (textLineCount > 1) {
                    canvas.style.top = Math.round((this.headerTableOffsetHeight - textHeight * textLineCount) / 2 + textHeight * (textLineCount - 1) + (textHeight - arrowTotalHeight) / 2) + 'px';
                } else {
                    //                    canvas.style.top = Math.round( (this.headerTableOffsetHeight - textHeight * textLineCount)/2 + (textHeight - arrowTotalHeight)/2 )+'px';
                    canvas.style.top = Math.round((this.headerTableOffsetHeight - arrowTotalHeight) / 2) + 'px';
                }

                var arrowLeftPadding = sortArrowPosition == 'left' ? 0 : sortArrowCanvasWidth - arrowWidth,
                    arrowHeadHeight = Math.round(3 * zf);
                canvas.height = arrowTotalHeight;
                canvas.width = sortArrowCanvasWidth;
                var cntx = canvas.getContext('2d');
                cntx.save();
                cntx.fillStyle = compStyle.color;
                cntx.strokeStyle = compStyle.color;
                if (currSortOrder == SORT_ORDER.ASCENDING) {
                    cntx.beginPath();
                    cntx.moveTo(arrowLeftPadding + 0, arrowHeadHeight);
                    cntx.lineTo(arrowLeftPadding + arrowWidth / 2, 0);
                    cntx.lineTo(arrowLeftPadding + arrowWidth, arrowHeadHeight);
                    cntx.lineTo(arrowLeftPadding + 0, arrowHeadHeight);
                    cntx.closePath();
                    cntx.fill();
                    cntx.lineWidth = 1;
                    cntx.moveTo(arrowLeftPadding + arrowWidth / 2, arrowHeadHeight);
                    cntx.lineTo(arrowLeftPadding + arrowWidth / 2, arrowTotalHeight);
                    cntx.stroke();
                } else if (currSortOrder == SORT_ORDER.DESCENDING) {
                    cntx.beginPath();
                    cntx.moveTo(arrowLeftPadding + 0, arrowTotalHeight - arrowHeadHeight);
                    cntx.lineTo(arrowLeftPadding + arrowWidth / 2, arrowTotalHeight);
                    cntx.lineTo(arrowLeftPadding + arrowWidth, arrowTotalHeight - arrowHeadHeight);
                    cntx.lineTo(arrowLeftPadding + 0, arrowTotalHeight - arrowHeadHeight);
                    cntx.closePath();
                    cntx.fill();
                    cntx.lineWidth = 1;
                    cntx.moveTo(arrowLeftPadding + arrowWidth / 2, 0);
                    cntx.lineTo(arrowLeftPadding + arrowWidth / 2, arrowTotalHeight - arrowHeadHeight);
                    cntx.stroke();
                }
                cntx.restore();
            },

            /**
             * call AE side to get the new model using this.sortKeyIdx
             *
             */
            doSort: function (currSortOrder, callback) {
                var sortKeyIdx = this.sortKeyIdx,
                    currSortColInfo = this.colInfos[sortKeyIdx],
                    dataService = this.getDataService(),
                    sortList = [],
                    sortType;
                //ascending or desceding
                var isAsc = currSortOrder == SORT_ORDER.ASCENDING ? true : false

                if (currSortColInfo.type == ATTR_NAME) {

                    sortType = 1;

                    if (currSortOrder == SORT_ORDER.NORMAL) {
                        //To undo the sort and back to normal order, applySort with sortList is empty
                    } else {
                        if (this.isTreeMode) {
                            var attrIdxArray = this.attrMapIdx,
                                rows = this.model.data.gts.row;

                            for (var i = 0; i < attrIdxArray.length - 2; i++) {
                                var attrIdx = attrIdxArray[i],
                                    rowH = rows[attrIdx];

                                sortList.push({
                                    id: rowH.id,
                                    fid: rowH.fid,
                                    asc: isAsc
                                });
                            }
                        } else {
                            var rowH = currSortColInfo.rowH;

                            sortList.push({
                                id: currSortColInfo.id,
                                fid: currSortColInfo.fid,
                                asc: isAsc
                            });
                        }
                    }
                } else if (currSortColInfo.type == METRIC_VALUE) {
                    if (this.isTreeMode) {
                        sortType = 3;
                    } else {
                        sortType = 2;
                    }

                    if (currSortOrder == SORT_ORDER.NORMAL) {
                        //To undo the sort and back to normal order, applySort with sortList is empty
                    } else {
                        sortList.push({
                            id: currSortColInfo.mid,
                            asc: isAsc
                        });
                    }
                }

                dataService.applySorts(this.getModelK(), sortType, sortList, callback);

            },

            multiTap: true,



            onPinchOpen: function onPinchOpen() {
                var currLowestLevel = getLowestLevelOnScreen.call(this);
                var levelToExpand = currLowestLevel;
                if (levelToExpand >= this.maxTreeLevel) {
                    //for the leaf node, do not set it as needExpand
                    levelToExpand = this.maxTreeLevel - 1;
                }

                var anchorRowTreeNode = this.rows[this.centerRowIdx].treeNode;
                var anchorRowIdxOnScrn = this.centerRowIdx - this.firstRowIdxOnScrn;

                expandOrCollapseTreeAndSetScrlPos.call(this, levelToExpand, anchorRowTreeNode, anchorRowIdxOnScrn);
            },

            onPinchClose: function onPinchClose() {
                var currLowestLevel = getLowestLevelOnScreen.call(this);
                var levelToExpand = currLowestLevel - 2;
                if (levelToExpand < -1) {
                    // needExpand of the highest level(-1)
                    // must be true
                    levelToExpand = -1;
                }

                var anchorRowTreeNode = this.rows[this.centerRowIdx].treeNode;

                if (anchorRowTreeNode.level > levelToExpand + 1) {
                    //the anchor row will be collapsed
                    anchorRowTreeNode = getParentTreeNodeAtLevel(this.tree, anchorRowTreeNode.treePath, levelToExpand + 1);
                }
                var anchorRowIdxOnScrn = this.centerRowIdx - this.firstRowIdxOnScrn;

                expandOrCollapseTreeAndSetScrlPos.call(this, levelToExpand, anchorRowTreeNode, anchorRowIdxOnScrn);

            },

            /*
             * remove the domRef in rowInfo to the domNode
             * call the destroy func of each chart widget
             */
            destroyChartWidget: function destroyChartWidget() {

                if (this.rows && this.rows.length > 0 && this.rowsReusePool) {
                    this.pushToReusePool();
                }

                if (this.dockedHeaderRows && this.dockedHeaderReplaceRows) {
                    this.clearDockedHeader();
                }

                if (this.rowsReusePool && this.rowsReusePool.length > 0) {
                    var rows = this.rowsReusePool,
                        rowCount = rows.length,
                        colInfos = this.colInfos,
                        colCount = colInfos.length;

                    for (var i = 0; i < rowCount; i++) {
                        var rowRef = rows[i];

                        if (rowRef[LEFT_CHART_ROW]) {
                            delete rowRef[LEFT_CHART_ROW];
                        }
                        if (rowRef[RIGHT_CHART_ROW]) {
                            delete rowRef[RIGHT_CHART_ROW];
                        }

                        for (var j = 0; j < colCount; j++) {
                            var w = rowRef[colInfos[j].colIdx];
                            if (w && w.destroy) {
                                w.destroy();
                                delete rowRef[colInfos[j].colIdx];
                            }
                        }
                    }
                    this.rowsReusePool = [];
                }

            },

            destroy: function destroy() {
                // Do we have a touch listener?

                if (this.rows) {
                    delete this.rows;
                }

                if (this.rowsReusePool) {
                    delete this.rowsReusePool;
                }

                if (this.dockedHeaderRows) {
                    delete this.dockedHeaderRows;
                }

                if (this.dockedHeaderReplaceRows) {
                    delete this.dockedHeaderReplaceRows;
                }

                if (this.selectorTargets) {
                    delete this.selectorTargets;
                }

                this._super();
            }
        }
    );

}());//@ sourceURL=VisMicroChart.js
