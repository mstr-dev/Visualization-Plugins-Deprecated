(function () {
    mstrmojo.requiresCls(
        "mstrmojo.plugins.VisMicroChart.MicroChartVisBase",
        "mstrmojo.dom",
       // "mstrmojo._TouchGestures",
        "mstrmojo.plugins.VisMicroChart.VisChartUtils",
        //"mstrmojo._HasTouchScroller",
        "mstrmojo.color",
        "mstrmojo.css",
        "mstrmojo.plugins.VisMicroChart.VisMicroChartLine",
        "mstrmojo.plugins.VisMicroChart.VisMicroChartBar",
        "mstrmojo.plugins.VisMicroChart.VisMicroChartBullet");
       // "mstrmojo._NeedSyncScroller"

    //theme type
    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
    var CUSTOM_DARK_THEME = 3;
    var CUSTOM_LIGHT_THEME = 4;

    //column type
    var ATTR_NAME = 0,
        METRIC_NAME = 1,
        METRIC_VALUE = 2,
        CHART = 3,
        TREE_TRIANGLE = 4,
        DROP_SHADOW = 5;

    var TRIANGLE_NONE = 0;
    var TRIANGLE_OPEN = 1;// "microchart-triangle-open";-webkit-transform:scale(0.9,0.7)
    var TRIANGLE_CLOSE = 2;// "microchart-triangle-close";
    var TRIANGLE_CLOSE_STYLE = "width:0px;height:0px;border-left:10px solid black;border-top:5px solid transparent;border-bottom:5px solid transparent;margin-left:auto;margin-right:auto;-webkit-transform:scale(0.8,0.9)";
    var TRIANGLE_OPEN_STYLE = "width:0px;height:0px;border-left:5px solid transparent;border-top:10px solid black;border-right:5px solid transparent;margin-left:auto;margin-right:auto;-webkit-transform:scale(0.9,0.8)";

    var DOCKED_HEADER = 0,
        OTHER_ROW = 1;

    var zf = 1;

    var $CLR = mstrmojo.color,
        $CSS = mstrmojo.css;

    var MC_TABLE_TEXT = "microchart-table-text";

    var ROW_HEIGHT = 0;
    var ROW_HEIGHT_FOR_CHART = 0;

    function removeChildren(container) {
        container.innerHTML = '';
    }

    function setDHBackGroundColor() {
        var backgroundColor = this.backgroundColor;
        if (!backgroundColor) {
            return;
        }
        this.dockedHeaderTable.style.backgroundColor = backgroundColor;
        this.dockedHeaderTable.style.opacity = '1';
        this.dockedHeaderReplaceDiv.firstChild.style.backgroundColor = backgroundColor;
        this.dockedHeaderReplaceDiv.firstChild.style.opacity = '1';
    }

    // xiawang: this is helper function to set border and background-color while
    // maintain the width and height
    function setNodeCssText(node, cssText) {
        var height = node.style.height;
        var width = node.style.width;
        var textDecoration = node.style.textDecoration;
        var display = node.style.display;
        var fontSize = node.style.fontSize;
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

    function setTreeTriangle(arrowDiv, treeNode, color) {
        var level = treeNode.level;

        var state = "";
        if (treeNode.isLeaf) {
            // for leafNode , not show triangle
            state = TRIANGLE_NONE;
        } else {
            if (treeNode.needExpand) {
                state = TRIANGLE_OPEN;
            } else {
                state = TRIANGLE_CLOSE;
            }
        }

        var whichBorderColor = null;
        var bodyFontColorRGB = this.bodyFontColorRGB;
        var theme = this.theme;

        if (state == TRIANGLE_CLOSE) {
            arrowDiv.className = "microchart-tree-arrow-close";
            whichBorderColor = "border-left-color";
        } else if (state == TRIANGLE_OPEN) {
            arrowDiv.className = "microchart-tree-arrow-open";
            whichBorderColor = "border-top-color";
        } else {
            //leaf node, no triangle
            arrowDiv.className = "";
            arrowDiv.setAttribute("style", "");
            return;
        }

        var styleContent = "";

        if (color) {
            //use specific color
            styleContent = whichBorderColor + ':' + color;
        } else if (theme == DEFAULT_LIGHT_THEME) {
            if (level == 0) {
                // First Level Triangle: color:#4C4C4C
                styleContent = whichBorderColor + ':' + '#4d4d4d';
            } else if (level == 1) {
                // Second Level Triangle: color:#4C4C4C 80% opacity
                styleContent = whichBorderColor + ':' + 'rgba(77,77,77,0.8)';
            } else if (level > 1) {
                styleContent = whichBorderColor + ':' + 'rgba(77,77,77,0.6)';
            }
        } else if (theme == DEFAULT_DARK_THEME) {
            if (level == 0) {
                // First Level Triangle: color: white opaque
                styleContent = whichBorderColor + ':' + '#c2c2c2';
            } else if (level == 1) {
                // Second Level Triangle: color:white 80% opacity
                styleContent = whichBorderColor + ':' + "rgba(194,194,194,0.8)";
            } else if (level > 1) {
                styleContent = whichBorderColor + ':' + "rgba(194,194,194,0.6)";
            }

        } else if (bodyFontColorRGB && bodyFontColorRGB.length > 2 && (theme == CUSTOM_LIGHT_THEME || theme == CUSTOM_DARK_THEME)) {
            if (level == 0) {
                // First Level Triangle: color: white opaque
                styleContent = whichBorderColor + ':' + 'rgba(' + bodyFontColorRGB[0] + ',' + bodyFontColorRGB[1] + ',' + bodyFontColorRGB[2] + ',0.8)';
            } else if (level > 0) {
                // Second Level Triangle: color:white 80% opacity
                styleContent = whichBorderColor + ':' + 'rgba(' + bodyFontColorRGB[0] + ',' + bodyFontColorRGB[1] + ',' + bodyFontColorRGB[2] + ',0.7)';
            }

        }

        arrowDiv.setAttribute("style", styleContent);
    }

    function renderOneRow(rowIdx, dockedHeaderRowInfo) {
        var widget = this.widget,
            rowInfo = widget.rows[rowIdx],
            curM = rowInfo.model,
            elms = curM.elms,
            rowTmpl = this.rowTemplate,
            treeNode = rowInfo.treeNode,
            colInfos = this.colInfos,
            rowIdx = rowInfo.rowIdx,
            rowRef = null,
            colCount = colInfos.length;
        var bodyFontColorRGB = this.bodyFontColorRGB;

        var ths = this.headerTable.firstChild.firstChild.childNodes;

        rowRef = dockedHeaderRowInfo ? dockedHeaderRowInfo.rowRef : rowInfo.rowRef;

        var tr = null;
        var tds = null;
        if (rowRef[this.domRefName]) {
            //reuse the tr
            tr = rowRef[this.domRefName];
        } else {
            //new tr
            tr = rowTmpl.cloneNode(true);
            rowRef[this.domRefName] = tr;
        }
        tr.style.display = '';

        fillThemeColor.call(this, dockedHeaderRowInfo ? dockedHeaderRowInfo : rowInfo);

        tr.setAttribute("rowType", dockedHeaderRowInfo ? DOCKED_HEADER : OTHER_ROW);

        var tds = tr.childNodes;

        var attr = null;

        for (var j = 0, tdsIdx = 0; j < colCount; j++, tdsIdx++) {
            var colInfo = colInfos[j];
            var colIdx = colInfo.colIdx;

            tds[j].setAttribute("mrow", rowInfo.rowIdx);

            if (colIdx == this.treeColumnIdx && treeNode) {
                //tree trianlge
                var arrowDiv = tds[j].firstChild;

                setTreeTriangle.call(this, arrowDiv, treeNode);

                if (!treeNode.isLeaf) {

                    arrowDiv.parentNode.setAttribute("CLK", "T");
                }
                continue;
            }

            // changed for attribute will be put in any column
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

                    tds[j].innerHTML = attrName;

                    if (treeNode.level == 0) {
                        tds[j].style.fontWeight = 'bold';
                    } else {
                        tds[j].style.fontWeight = '';
                    }
                    if (treeNode.level > 0 && (this.theme == CUSTOM_DARK_THEME || this.theme == CUSTOM_LIGHT_THEME)) {
                        //Texts: user defined the first level bold
                        //		 second level or lower: 80% regular
                        if (bodyFontColorRGB && bodyFontColorRGB.length > 2) {
                            tds[j].style.color = 'rgba(' + bodyFontColorRGB[0] + ',' + bodyFontColorRGB[1] + ',' + bodyFontColorRGB[2] + ',0.8)';
                        }
                    } else {

                    }
                } else {
                    attr = elms[colInfo.order];
                    var attrName = attr ? attr.n : "";
                    //TQMS 722933:
                    if (attrName.indexOf("&lt;") >= 0) {
                        attrName = attrName.replace(/&lt;/g, "<");
                        attrName = attrName.replace(/&gt;/g, ">");
                    }
                    tds[j].innerHTML = attrName;

                }

                continue;
            }

            if (colInfo.order == "LineChart") {

                if (rowRef[colIdx]) {
                    var w = rowRef[colIdx];
                    if (curM.isTotal && !this.isTreeMode) {
                        w.domNode.style.display = 'none';
                    } else {
                        //reuse chart
                        w.domNode.style.display = '';
                        w.model = curM.model;
                        w.refv = curM.refv;
                        w.kpiOffset = this.kpiOff * rowIdx;
                        w.reDrawChart();
                        //						tds[j].appendChild(w.domNode);
                    }

                } else {
                    if (curM.isTotal && !this.isTreeMode) {
                        continue;
                    }
                    var placeholder = document.createElement("div");
                    var props = {
                        placeholder: placeholder,
                        model: curM.model,
                        refv: curM.refv,
                        config: widget.sparklineProps,
                        widget: widget,
                        kpiOffset: this.kpiOff * rowIdx,
                        width: colInfo.contentWidth,
                        height: ROW_HEIGHT_FOR_CHART,
                        mainOffsetTop: this.offsetTop,
                        mainLeftPos: parseInt(this.domNode.style.left, 0) || 0,
                        mainWidth: this.getWidth(),
                        isTreeMode: this.isTreeMode,
                        theme: this.theme
                    };
                    tds[j].appendChild(placeholder);
                    var w = new mstrmojo.plugins.VisMicroChart.VisMicroChartLine(props);
                    w.render();
                    tds[j].removeAttribute("class");
                    rowRef[colIdx] = w;
                }

            } else if (colInfo.order == "BarChart") {

                if (rowRef[colIdx]) {
                    var w = rowRef[colIdx];
                    if (curM.isTotal && !this.isTreeMode) {
                        w.domNode.style.display = 'none';
                    } else {
                        //reuse chart
                        w.domNode.style.display = '';
                        w.model = curM.model;
                        w.refv = curM.refv;
                        w.kpiOffset = this.kpiOff * rowIdx;
                        w.isTextBold = this.isTreeMode ? treeNode.level == 0 : false;
                        w.reDrawChart();
                        //					tds[j].appendChild(w.domNode);
                    }
                } else {
                    if (curM.isTotal && !this.isTreeMode) {
                        continue;
                    }
                    var placeholder = document.createElement("div");
                    var props = {
                        placeholder: placeholder,
                        model: curM.model,
                        refv: curM.refv,
                        widget: widget,
                        kpiOffset: this.kpiOff * rowIdx,
                        config: widget.barProps,
                        width: colInfo.contentWidth,
                        height: ROW_HEIGHT_FOR_CHART,
                        mainOffsetTop: this.offsetTop,
                        mainLeftPos: parseInt(this.domNode.style.left, 0) || 0,
                        mainWidth: this.getWidth(),
                        isTreeMode: this.isTreeMode,
                        theme: this.theme,
                        isTextBold: this.isTreeMode ? treeNode.level == 0 : false
                    };

                    tds[j].appendChild(placeholder);
                    var w = new mstrmojo.plugins.VisMicroChart.VisMicroChartBar(props);
                    w.render();
                    //add the className so that the max and min value have the right style
                    tds[j].className = this.valueCssClass;
                    rowRef[colIdx] = w;
                }

            } else if (colInfo.order == "GaugeChart") {
                /*
                 * if (curM.isTotal) { continue; }
                 */
                if (rowRef[colIdx]) {
                    //reuse chart
                    var w = rowRef[colIdx];
                    w.model = curM.model;
                    w.refv = curM.refv;
                    w.kpiOffset = this.kpiOff * rowIdx;
                    w.labelColorRGB = this.bodyFontColorRGB;
                    w.reDrawChart();
                } else {
                    var placeholder = document.createElement("div");
                    var props = {
                        placeholder: placeholder,
                        model: curM.model,
                        refv: curM.refv,
                        widget: widget,
                        config: widget.bulletProps,
                        width: colInfo.contentWidth,
                        height: ROW_HEIGHT_FOR_CHART,
                        mainOffsetTop: this.offsetTop,
                        mainLeftPos: parseInt(this.domNode.style.left, 0) || 0,
                        mainWidth: this.getWidth(),
                        labelColorRGB: this.bodyFontColorRGB,
                        showMinLabel: this.showMinLabel,
                        isTreeMode: this.isTreeMode,
                        theme: this.theme

                    };
                    tds[j].appendChild(placeholder);
                    var w = new mstrmojo.plugins.VisMicroChart.VisMicroChartBullet(props);
                    w.render();
                    tds[j].removeAttribute("class");
                    rowRef[colIdx] = w;
                }

            } else {
                var metricIdx = -1;
                var idx = -1;

                if (this.widget.isKPI) {
                    //idx for refv in model
                    idx = parseInt(colInfo.order) % this.kpiOff;

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

                if (!curM.refv[idx]) {
                    continue;
                }

                if (curM.refv[idx].ti === undefined) { // by defult, use regular value
                    if (curM.refv[idx].ts === 4) { // xiawang: For web JSON, ts  === 4 means image
                        innerHTML = "<img src='" + curM.refv[idx].v + "'/>";
                    } else {
                        innerHTML = curM.refv[idx].v;
                    }
                } else { // there is threshold
                    try { // we will try to apply the threshold. But if it fails, we shouldn't just fail the document rendering.
                        // Instead, we show default value;
                        var model = this.widget.model.data;//Model here is DocVisModel
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
                            tds[j].style.fontSize = this.widget.fontSize; // xiawang: We should keep consistent with Flash and iOS to
                            // NOT inherite font size from Threshold at this time
                        }
                        cssClass = model.css[th[ti].cni].n;
                    } catch (err) {
                        if (!innerHTML) { // xiawang: If innerHTML is not finalized yet.
                            innerHTML = curM.refv[idx].v;
                        }
                    }
                }

                if (cssClass) {
                    tds[j].className = colInfo.valueCssClass + " " + cssClass;
                } else if (this.valueCssClass) {
                    tds[j].className = colInfo.valueCssClass + " " + this.valueCssClass;
                } else {
                    tds[j].className = colInfo.valueCssClass;
                }

                tds[j].innerHTML = innerHTML;
            }

            //set first level font weight to bold
            if (this.isTreeMode) {
                if (treeNode.level == 0) {
                    tds[j].style.fontWeight = 'bold';
                } else {
                    tds[j].style.fontWeight = '';
                }
            }
        }

        if (this.isTreeMode) {
            /*
             * Drop shadow are need to apply below the higher level add the drop
             * shadow on the top of the first row, which are added under the
             * expanded treeNode
             * For docked header, it is always expanded, so we add the drop shadow and remove the dividing line
             */
            var preRowInfo = widget.rows[rowIdx - 1];
            var preRowExpanded = preRowInfo && preRowInfo.treeNode.level < rowInfo.treeNode.level;
            var isDockedHeader = dockedHeaderRowInfo != undefined;
            var isFirstRow = rowIdx == 0;

            if (preRowExpanded || ( isDockedHeader && treeNode.level > 0)) {
                //show drop shadow and remove dividing line
                var tdCount = tds.length;
                for (var i = 0; i < tdCount; i++) {
                    if (this.theme == DEFAULT_LIGHT_THEME || this.theme == CUSTOM_LIGHT_THEME) {
                        tds[i].style.boxShadow = '0px 5px 3px -3px rgba(0,0,0,0.2) inset';
                    } else if (this.theme == DEFAULT_DARK_THEME || this.theme == CUSTOM_DARK_THEME) {
                        tds[i].style.boxShadow = '0px 5px 3px -3px rgba(0,0,0,0.5) inset';
                    }

                }

                //if show the drop shadow, we will not draw the dividing line, but have to keep the 1px border
                //so that the row height is same
                tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0)';

            } else if ((isDockedHeader && treeNode.level == 0 || isFirstRow) && (this.theme == DEFAULT_LIGHT_THEME || this.theme == DEFAULT_DARK_THEME)) {
                /*
                 * PM required:
                 * For default dark theme and default light theme: the 2px line between the header and the body should be removed.
                 * For custom themes, the 2px line should be left as it is.
                 */
                tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0)';
            } else {
                var tdCount = tds.length;
                for (var i = 0; i < tdCount; i++) {
                    tds[i].style.boxShadow = '';
                }
            }
        }

        var rowInfoToHighlight = dockedHeaderRowInfo ? dockedHeaderRowInfo : rowInfo;
        if (this.isTreeMode) {
            //tree mode
            this.widget.highlightRowByRowInfo(rowInfoToHighlight, treeNode.selected);

        } else {
            //none-tree mode
            if (this.widget.isAllAttrSelectable) {
                this.widget.highlightRowByRowInfo(rowInfo, rowInfo.selected[-1]);
            } else {
                //highlight one cell
                this.widget.highlightCellsByRowInfo(rowInfo);
            }
        }

        return tr;
    }

    function fillThemeColor(rowInfo) {
        var tr = rowInfo.rowRef[this.domRefName],
            utils = this.utils;
        // set fill color
        if (this.isTreeMode) {

            var treeNode = rowInfo.treeNode
            var level = treeNode.level;

            if (level == 0) {
                //First level row
                if (this.theme == DEFAULT_LIGHT_THEME) {

                    tr.style.backgroundColor = '#f7f7f7';
                    tr.style.color = '#333333';
                    // Dividing line on top of the first level: black, 15% opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.15)';

                } else if (this.theme == DEFAULT_DARK_THEME) {

                    tr.style.backgroundColor = '#1f1f1f';
                    tr.style.color = '#e0e0e0';
                    // Dividing line on top of the first level: white, 15% opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.15)';

                } else if (this.theme == CUSTOM_DARK_THEME) {
                    tr.style.backgroundColor = '';

                    // Dividing line follow DEFAULT_DARK_THEME
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.1)';

                } else if (this.theme == CUSTOM_LIGHT_THEME) {
                    tr.style.backgroundColor = '';
                    // Dividing line follow DEFAULT_DARK_THEME
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.3)';

                }

                tr.style.font = 'bold 12pt Roboto';

            } else if (level == 1) {
                //Second level row
                if (this.theme == DEFAULT_LIGHT_THEME) {

                    tr.style.backgroundColor = '#eaeaea';
                    tr.style.color = '#333333';
                    // Dividing line on top of the second level: white, 20% opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.2)';

                } else if (this.theme == DEFAULT_DARK_THEME) {

                    tr.style.backgroundColor = '#2a2a2a';
                    tr.style.color = '#e0e0e0';
                    // Dividing line on top of the second level: white, 20% opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.2)';

                } else if (this.theme == CUSTOM_DARK_THEME) {

                    tr.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    // Dividing line follow DEFAULT_DARK_THEME
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.2)';

                } else if (this.theme == CUSTOM_LIGHT_THEME) {

                    tr.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    // Dividing line follow DEFAULT_LIGHT_THEME
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.2)';

                }

                tr.style.font = '12pt Roboto';

            } else if (level == 2) {
                //Third level row
                if (this.theme == DEFAULT_LIGHT_THEME) {

                    tr.style.backgroundColor = '#dedede';
                    tr.style.color = '#333333';
                    // Dividing line on top of the third level: white, 10%
                    // opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.1)';

                } else if (this.theme == DEFAULT_DARK_THEME) {

                    tr.style.backgroundColor = '#363636';
                    tr.style.color = '#e0e0e0';
                    // Dividing line on top of the third level: white, 10%
                    // opacity, 1px
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.1)';

                } else if (this.theme == CUSTOM_DARK_THEME) {

                    tr.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    // Dividing line follow DEFAULT_DARK_THEME
                    tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.1)';

                } else if (this.theme == CUSTOM_LIGHT_THEME) {

                    tr.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    // Dividing line follow DEFAULT_LIGHT_THEME
                    tr.style.borderTop = 'solid 1px rgba(0, 0, 0, 0.1)';

                }
                tr.style.font = '12pt Roboto';
            } else if (level > 2) {
                //If five or more levels, keep the same color as fouth level.
                level = Math.min(level, 3);
                //Four or more level row
                var opc = level / 10;

                if (this.theme == DEFAULT_LIGHT_THEME) {
                    tr.style.backgroundColor = '#d1d1d1';
                    tr.style.color = '#333333';

                } else if (this.theme == DEFAULT_DARK_THEME) {

                    tr.style.backgroundColor = '#404040';
                    tr.style.color = '#e0e0e0';

                } else if (this.theme == CUSTOM_DARK_THEME) {

                    tr.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';

                } else if (this.theme == CUSTOM_LIGHT_THEME) {

                    tr.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';

                }

                tr.style.font = '12pt Roboto';
                //TQMS 698607: add dividing line for four or more levels
                tr.style.borderTop = 'solid 1px rgba(255, 255, 255, 0.1)';
            }

        } else {
            //none tree mode
            if (this.theme == DEFAULT_LIGHT_THEME) {
                tr.style.backgroundColor = '#f7f7f7';
                tr.style.color = '#333333';
                tr.style.borderBottom = 'solid 1px #c0c0c0';
            } else if (this.theme == DEFAULT_DARK_THEME) {
                tr.style.backgroundColor = '#1f1f1f';
                tr.style.color = '#e0e0e0';
                tr.style.borderBottom = 'solid 1px #3f3f3f';
            } else {
                //custom theme
                tr.style.borderBottom = 'solid 1px #808080';
            }
        }
    }

    function setScrollerPosition(scrollTo) {
        var scl = this._scroller,
            icn = this.chartTable,
        //			offsetEnd = Math.max((this.widget.rows.length - this.widget.startCnt) * this.rowOffsetHeight  + hbody.offsetHeight - this.getHeight() + 2, 0);
            offsetEnd = Math.max(this.chartTableOffsetHeight + this.headerTableOffsetHeight - this.getHeight(), 0);

        scl.origin = {
            x: scrollTo && scrollTo.x || 0,
            y: scrollTo && scrollTo.y || 0
        };

        scl.showScrollbars = this.showScrollbars;
        scl.vScroll = (offsetEnd !== 0 && scl.noVScroll !== true) || this.scrollPast;

        if (scl.vScroll) {

            scl.offset = {
                y: {
                    start: 0,
                    end: offsetEnd
                },
                scrollPast: this.scrollPast

            };
        } else {
            scl.offset = null;
        }

        this.utils.translateCSS(-scl.origin.x, -scl.origin.y, false, icn);
    }

    mstrmojo.plugins.VisMicroChart.VisMicroChartTable = mstrmojo.declare(
        mstrmojo.plugins.VisMicroChart.MicroChartVisBase,

        //mixin
        //[mstrmojo._TouchGestures, mstrmojo._HasTouchScroller, mstrmojo._NeedSyncScroller],
        //[ mstrmojo._NeedSyncScroller],
        null,

        {
            scriptClass: 'mstrmojo.plugins.VisMicroChart.VisMicroChartTable',

            utils: mstrmojo.plugins.VisMicroChart.VisChartUtils,

            scrollerConfig: {
                bounces: false,
                showScrollbars: false,
                useTranslate3d: false,
                hScroll: false,
                vScroll: true
            },

            scrollPast: false,

            /*
             * colInfos get from VisMicroChart.js
             */
            colInfos: null,

            rowTemplate: null,

            theme: -1,

            isTreeMode: false,

            showMinLabel: false,

            bodyFontColorRGB: null,

            markupString: '<div id="{@id}-microchart-table" class="mstrmojo-Chart {@cssClass}" style="width:{@width};height:{@height};z-index:{@zIndex};position:absolute;background-color:{@backgroundColor}">'
            +
            '<div id="{@id}-header-bar" class="microchart-header-div" style="width:{@width};">'
            + '<table id="{@id}-header-table" style="width:{@width};table-layout:fixed;">'
            + '<tr >'
            + '<th style="border:none;text-decoration:none;"></th>'
            + '</tr>'
            + '</table>'
            + '</div>'
            +
            '<div id="{@id}-chart-table-container" class="microchart-canvas-div" style="position:absolute;overflow:hidden;width:{@width};">'
            + '<table id="{@id}-charts-body" style="width:{@width};table-layout:fixed">'
            + '<tr >'
            + '<td style="border:none;background:transparent;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px"></td>'
            + '</tr>'
            + '</table>'
            + '</div>'
            +
            '<div style="position:absolute;z-index:2;">'
            + '<table id="{@id}-docked-header" style="width:{@width};table-layout:fixed;position:relative;background-color:white;">'
            + '<tbody></tody>'
            + '</table>'
            + '<div id="{@id}-docked-header-replace-div" style="width:{@width};position:relative;overflow:hidden">'
            + '<table id="{@id}-docked-header-replace" style="width:{@width};table-layout:fixed;background-color:white;">'
            + '<tbody></tody>'
            + '</table>'
            + '</div>'
            + '</div>'
            +
            '</div>',

            markupSlots: {

                headerTable: function () {
                    return this.domNode.childNodes[0].firstChild;
                },

                itemsContainerNode: function () {
                    return this.domNode.childNodes[1];
                },

                chartTable: function () {
                    return this.domNode.childNodes[1].firstChild;
                },

                dockedHeaderTable: function () {
                    return this.domNode.childNodes[2].firstChild;
                },

                dockedHeaderReplaceDiv: function () {
                    return this.domNode.childNodes[2].lastChild;
                }
            },

            postBuildRendering: function postBR() {
                if(this.widget && this.widget.model){
                    this.model = this.widget.model;
                }

                //-1 for the height of the dividing line
                ROW_HEIGHT = (this.widget.otherProps.mRowHeight - 1) + 'px';
                ROW_HEIGHT_FOR_CHART = (this.widget.otherProps.mRowHeight - 2) + 'px';
                zf = this.utils.getScreenZoomFactor();
                this.scrollerConfig.scrollEl = this.chartTable;
                this.scrollerConfig.indicatorEl = this.widget.indicatorEl;
                this.scrollerConfig.showScrollbars = this.showScrollbars;
                this._super();
                this.renderMicroChart();
                this.updateRowOffsetHeight();
                this.updateHeaderTableOffsetH();
                this.updateChartTableOffsetH();
               // setScrollerPosition.call(this, this.widget.mcStatus && this.widget.mcStatus.scrollTo);

                setDHBackGroundColor.call(this);

                // save infowindowOn flag before infowindow close, before "touchesBegin" event
                // this should be after _super to make sure this._tn has been set in _TouchGesture.js
                var widget = this.widget;
                if(widget){
                    this.defn = widget.defn;
                }
                if (this._tn) {
                    var backup = this._tsCallback;
                    this._tsCallback = function (e) {
                        widget.closedIfwAttr = null;
                        backup.call(this, e);
                    };
                    mstrmojo.dom.detachEvent(this._tn, mstrmojo.dom.TOUCHSTART, backup);
                    mstrmojo.dom.attachEvent(this._tn, mstrmojo.dom.TOUCHSTART, this._tsCallback);
                }
            },

            renderMicroChart: function rmc() {

                var colLen = this.colInfos.length;

                var ht = this.headerTable;
                //set style for Header
                if (this.theme == DEFAULT_LIGHT_THEME) {
                    ht.style.backgroundColor = '#B5BDC4';
                    ht.style.color = '#333333';
                } else if (this.theme == DEFAULT_DARK_THEME) {
                    ht.style.backgroundColor = '#1C273A';
                    ht.style.color = '#e0e0e0';
                }
//                if (!this.isAndroidTab) {
                //on phone, resize according to DPI
                ht.style.height = zf * 32 + 'px';
//                }

                // header tr
                var htr = ht.firstChild.firstChild;

                // table body
                var tbody = this.chartTable.firstChild;
                var rowTmpl = tbody.firstChild;

                var th0 = htr.firstChild;
                var td0 = rowTmpl.firstChild;
                //build one row in headerTable and rowTmpl
                for (var i = ht.childNodes.length; i < colLen; i++) {
                    htr.appendChild(th0.cloneNode(true));
                    rowTmpl.appendChild(td0.cloneNode(true));
                }
                this.rowTemplate = rowTmpl;

                /**
                 * TQMS 764167:
                 * On web, when we want to set the width for table cells to w, we have to minus the padding and set the width style to w - padding, then the actually value will be w.
                 * But on device, if we do the same thing, the sum of the width we set is less than the total width. It will scale the width to fit the total width
                 */
                /**
                 * TQMS 824166: on device with OS 4.4, use same method for web
                 */
                //var sdkVersion = mstrMobileApp.getSDKVersion();
                //var ignorePadding = this.widget.isAndroid && (sdkVersion < 19);
                var ignorePadding = true;

                var fnSD = function (e, width) {
                    var paddingWidth = 0;

                    var compStyle = mstrmojo.css.getComputedStyle(e);
                    if (compStyle.paddingLeft) {
                        paddingWidth += parseFloat(compStyle.paddingLeft);
                    }
                    if (compStyle.paddingRight) {
                        paddingWidth += parseFloat(compStyle.paddingRight);
                    }

                    e.style.width = (ignorePadding ? width : (width - paddingWidth)) + 'px';

                    e.style.height = ROW_HEIGHT;

                };

                // header ths
                var ths = htr.childNodes;
                // body tds
                var tds = rowTmpl.childNodes;

                for (var i = 0; i < colLen; i++) {

                    var colInfo = this.colInfos[i];

                    colInfo.thRef = ths[i];

                    ths[i].innerHTML = colInfo.title ? colInfo.title : '';

                    if (colInfo.padding.left != undefined) {
                        tds[i].style.paddingLeft = colInfo.padding.left + "px";
                    }
                    if (colInfo.padding.right != undefined) {
                        tds[i].style.paddingRight = colInfo.padding.right + "px";
                    }

                    ths[i].className = colInfo.headerCssClass;
                    if (colInfo.type == DROP_SHADOW) {
                        ths[i].style.paddingLeft = '0px';
                        ths[i].style.paddingRight = '0px';
                    } else if (this.treeColumnIdx == colInfo.colIdx) {
                        // add the arrow
                        var arrowDiv = document.createElement('div');
                        tds[i].appendChild(arrowDiv);
                        arrowDiv.style.display = "";
                    } else {
                        //use this.valueCssClass as we need its padding value if inherit from grid/graph
                        tds[i].className = colInfo.valueCssClass + " " + this.valueCssClass;
                    }

                    if (colInfo.type == ATTR_NAME || colInfo.type == METRIC_NAME) {
                        this.bodyFontColorRGB = this.valueCssClass && $CLR.rgbStr2rgb(mstrmojo.css.getStyleValue(tds[i], 'color'));
                    }

                    fnSD(ths[i], colInfo.colWidth);
                    fnSD(tds[i], colInfo.colWidth);

                    ths[i].style.wordBreak = "break-word";
                    ths[i].style.whiteSpace = "normal";

                    tds[i].setAttribute("mcol", colInfo.colIdx);
                    ths[i].setAttribute("mcol", colInfo.colIdx);
                    ths[i].setAttribute("mrow", -1);

                }

                var totalOffsetWidth = 0;
                totalColWidth = 0;

                for (var i = 0; i < colLen; i++) {
                    var colInfo = this.colInfos[i];

                    console.log(i + " offsetWidth:" + ths[i].offsetWidth + ", styleWidth:" + ths[i].style.width + ", colWidth:" + colInfo.colWidth);
                    totalOffsetWidth += ths[i].offsetWidth;
                    totalColWidth += colInfo.colWidth;

                    colInfo.titleOverflow = this.utils.truncateTextToLineWithWordWrap2(ths[i], colInfo.title, this.textCanvas, 2);

                    var compStyle = mstrmojo.css.getComputedStyle(ths[i]);
                    colInfo.padding.left = parseInt(compStyle.paddingLeft);
                    colInfo.padding.right = parseInt(compStyle.paddingRight);


                    var colWidth = tds[i].offsetWidth || colInfo.colWidth;
                    colInfo.contentWidth = colWidth - colInfo.padding.left - colInfo.padding.right;
                    colInfo.styleWidth = ignorePadding ? colWidth : colWidth - colInfo.padding.left - colInfo.padding.right;
                }
//                console.log("totalOffsetWidth:"+totalOffsetWidth + ", totalColWidth:" + totalColWidth);

                var otherProps = this.widget.otherProps;
                this.kpiOff = otherProps.mnMetricsPerKPI;
                if (!this.widget.isKPI) {
                    this.kpiOff = 0;
                }

                var w = this.widget;

                var fragment = document.createDocumentFragment();
                for (var i = w.startCnt; i < w.endCnt; i++) {
                    var newTR = renderOneRow.call(this, i);
                    fragment.appendChild(newTR);

                }
                tbody.appendChild(fragment);

                rowTmpl.style.display = "none";

                // xiawang: hide the headerTable if user set it TQMS 532011
                if (otherProps.mbHideColHeaders) {
                    this.headerTable.style.display = "none";
                }

                this.itemsContainerNode.style.top = this.headerTableOffsetHeight + 'px';
            },

            reRenderRows: function reRenderRows(scrollTo, firstRowRemain, lastRowRemain, firstRowToRender, lastRowToRender) {
                var tbody = this.chartTable.firstChild;
                tbody.innerHTML = "";
                var w = this.widget;

                var fragment = document.createDocumentFragment();

                if (firstRowRemain == undefined) {
                    firstRowRemain = 0;
                    lastRowRemain = 0;
                    firstRowToRender = w.startCnt;
                    lastRowToRender = w.endCnt;
                }

                var rows = w.rows;
                if (firstRowRemain < firstRowToRender) {
                    for (var i = firstRowRemain; i < lastRowRemain; i++) {
                        var newTR = rows[i].rowRef[this.domRefName];
                        fragment.appendChild(newTR);
                    }

                    for (var i = firstRowToRender; i < lastRowToRender; i++) {
                        var newTR = renderOneRow.call(this, i);
                        fragment.appendChild(newTR);

                    }
                } else {
                    for (var i = firstRowToRender; i < lastRowToRender; i++) {
                        var newTR = renderOneRow.call(this, i);
                        fragment.appendChild(newTR);

                    }
                    for (var i = firstRowRemain; i < lastRowRemain; i++) {
                        var newTR = rows[i].rowRef[this.domRefName];
                        fragment.appendChild(newTR);
                    }
                }

                tbody.appendChild(fragment);

                this.updateChartTableOffsetH();
               // setScrollerPosition.call(this, scrollTo);
            },

            updateHeaderTableOffsetH: function updateHeaderTableOffsetH() {
                if (this.widget.otherProps.mbHideColHeaders) {
                    this.headerTableOffsetHeight = 0;
                } else {
                    this.headerTableOffsetHeight = this.headerTable.offsetHeight;
                }
            },

            updateRowOffsetHeight: function updateRowOffsetHeight() {
                this.rowOffsetHeight = this.chartTable.firstChild.lastChild.offsetHeight;

            },

            updateChartTableOffsetH: function updateChartTableOffsetH() {
                this.chartTableOffsetHeight = this.chartTable.firstChild.offsetHeight;
            },

            onScrollDone: function onScrollDone(evt) {
                if (this._super) {
                    this._super(evt);
                }
                this.widget.onScrollDone(evt);
            },

            onScrollMoved: function onScrollMoved(evt) {
                if (this._super) {
                    this._super(evt);
                }
                this.widget.onScrollMoved(evt);
            },

            initScroller: function initScroller(scroller) {

                if (!scroller.offset && this.scrollPast) {
                    scroller.offset = {scrollPast: this.scrollPast};
                }

                scroller.vScroll = true;

                if (this._super) {
                    this._super(scroller);
                }

                var me = this;
            },

            initDHs: function initDHs() {
                var dockedHeaderTable = this.dockedHeaderTable;
                dockedHeaderTable.parentNode.style.top = this.headerTableOffsetHeight + 'px';
            },

            /*
             * add domNode to dockedHeader table or dockedHeaderReplacing table
             * rowcount is the last x rowInfos in w.xxRows
             */
            addRowsToDH: function addRowsToDH(rowCount, toDHReplacingTable) {
                var w = this.widget;
                var rows = null;
                if (toDHReplacingTable) {
                    rows = w.dockedHeaderReplaceRows;
                } else {
                    rows = w.dockedHeaderRows;
                }

                var fragment = document.createDocumentFragment();
                for (var i = rows.length - rowCount; i < rows.length; i++) {
                    var newTR = renderOneRow.call(this, rows[i].rowIdx, rows[i]);
                    rows[i].rowRef[this.domRefName] = newTR;
                    fragment.appendChild(newTR);
                }
                if (toDHReplacingTable) {
                    this.dockedHeaderReplaceDiv.firstChild.firstChild.appendChild(fragment);
                } else {
                    this.dockedHeaderTable.firstChild.appendChild(fragment);
                }

            },

            removeRowsFromDH: function removeRowsFromDH(rowCount, moveToReplacingTable) {
                var dockedHeaderTable = this.dockedHeaderTable,
                    dockedHeaderTbody = dockedHeaderTable.firstChild;
                var dockedHeaderReplaceTbody = this.dockedHeaderReplaceDiv.firstChild.firstChild;

                if (rowCount > dockedHeaderTbody.childNodes.length) {
                    //there are not enough rows to remove
                    rowCount = dockedHeaderTbody.childNodes.length;
                }

                if (rowCount > 1) {
                    //if rowCount > 1, remove the tbody to remove the reflow
                    dockedHeaderTable.removeChild(dockedHeaderTbody);
                    for (var i = 0; i < rowCount; i++) {
                        dockedHeaderTbody.removeChild(dockedHeaderTbody.lastChild);
                    }
                    dockedHeaderTable.appendChild(dockedHeaderTbody);

                } else if (rowCount == 1) {
                    var dockedHeaderTR = dockedHeaderTbody.lastChild;
                    dockedHeaderTbody.removeChild(dockedHeaderTR);
                    if (moveToReplacingTable) {
                        dockedHeaderReplaceTbody.appendChild(dockedHeaderTR);
                    }

                }
            },

            moveRowFromDHRplcTableToDH: function moveRowFromDHRplcTableToDH() {
                var dockedHeaderTable = this.dockedHeaderTable,
                    dockedHeaderTbody = dockedHeaderTable.firstChild;
                var dockedHeaderReplaceTbody = this.dockedHeaderReplaceDiv.firstChild.firstChild;

                var replacingTR = dockedHeaderReplaceTbody.firstChild;
                if (replacingTR) {
                    removeChildren(dockedHeaderReplaceTbody);
                    dockedHeaderTbody.appendChild(replacingTR);
                }

            },

            removeChildrenForDHReplaceTable: function removeChildrenForDHReplaceTable() {
                var dockedHeaderReplaceTbody = this.dockedHeaderReplaceDiv.firstChild.firstChild;

                removeChildren(dockedHeaderReplaceTbody);
            },

            showDockedHeader: function showDockedHeader() {
                this.dockedHeaderTable.parentNode.style.display = 'block';
            },

            hideDockedHeader: function hideDockedHeader() {
                this.dockedHeaderTable.parentNode.style.display = 'none';
            },

            setTreeArrow: function setTreeArrow(rowInfo, color) {
                var tr = rowInfo.rowRef[this.domRefName];
                var tds = tr.childNodes;
                var arrowDiv = tds[this.treeColumnIdx].firstChild;
                setTreeTriangle.call(this, arrowDiv, rowInfo.treeNode, color);
            },

            scrollTo: function (origin) {
                var icn = this.chartTable;
                this.utils.translateCSS(-origin.x, -origin.y, false, icn);
            },
/*
            getData: function getData() {
                return this.widget && this.widget.model && this.widget.model.data;
            },*/

           /* shouldTouchBubble: function shouldTouchBubble(touch) {
                var scroller = this._scroller,
                    isVertical = touch.isVertical;

                var vScrollable = !!scroller.offset && scroller.offset['y'].end !== 0;

                return isVertical ? !vScrollable : this._super(touch);
            },*/

            multiTap: true,

            multiTouch: true,

            destroy: function destroy() {
                var colLen = this.colInfos.length;
                for (var i = 0; i < colLen; i++) {
                    var colInfo = this.colInfos[i];
                    delete colInfo.thRef;
                }

                delete this.widget;
                delete this.parent;
                delete this.rowTemplate;

                delete this.textSpan;

                this._super();
            }
        }
    );
}());//@ sourceURL=VisMicroChartTable.js