(function () {

    mstrmojo.requiresCls('mstrmojo.Box',
                         'mstrmojo.dom',
                         'mstrmojo.css',
                         'mstrmojo.string',
                         'mstrmojo.plugins.VisMicroChart.VisUtility');

    var $CSS = mstrmojo.css,
        $UTILS = mstrmojo.plugins.VisMicroChart.VisUtility,
        $ARR = mstrmojo.array,
        $STR = mstrmojo.string,
        cssBaseClass = 'vis-tooltip',
        OFFSET_MAX = 20,
        MAX_STRING_WIDTH = 165,
        MAX_WIDTH = 350,
        MAX_HEIGHT = 350,
        PX = 'px';

    /**
     * Clears all tooltip content and adds standard container and empty table (no rows or cells).
     *
     * @returns {HTMLTableElement}
     */
    function addTableNode() {
        // Clear domNode contents.
        var domNode = this.domNode;
        domNode.innerHTML = '';

        // Create container.
        var container = document.createElement('div');
        container.className = cssBaseClass + '-container';

        // Create table.
        var table = /** @type {HTMLTableElement} **/ document.createElement('table');
        table.className = cssBaseClass + '-table';

        for (var i = 0; i < 3; i++) {
            table.appendChild(document.createElement("COL"));
        }

        // Append table and container.
        container.appendChild(table);
        this.domNode.appendChild(container);

        // Return table node.
        return table;
    }

    function getTrendLineFuncHtmlText(funcTokens) {
        var textArr = [],
            hasSuper = false;

        $ARR.forEach(funcTokens, function (exprToken) {
            if (!exprToken.isSuper) {
                textArr.push(exprToken.v);
            } else {
                hasSuper = true;
                textArr.push("<sup>" + exprToken.v + "</sup>");
            }
        });

        return {
            hasSuper: hasSuper,
            htmlText: textArr.join("")
        };

    }

    /**
     * @class
     * @extends {mstrmojo.Box}
     */
    mstrmojo.plugins.VisMicroChart.VisTooltip = mstrmojo.declare(

        mstrmojo.Box,

        null,

        /**
         * @lends mstrmojo.plugins.VisTooltip.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.VisMicroChart.VisTooltip',

            init: function init(props) {
                this._super(props);

                // Add custom base class.
                $CSS.addWidgetCssClass(this, cssBaseClass);
            },

            toggle: function toggle(show) {
                if ( this.domNode ) {
                    this.domNode.style.display = show ? 'block' : 'none';
                }
            },

            /**
             * @param {Array.<{n: String, v: String}>} infoArr Array of information items.
             * @param {Object=} pos
             * @param {boolean} [nContainColon=false]
             */
            displayInfo: function displayInfo(infoArr, pos, nContainColon) {
                // Get fresh table.
                var container = this.domNode,
                    table = addTableNode.call(this),
                    isLastTRSeparator = false,
                    maxNameLen = 0,
                    maxValueLen = 0,
                    spaceLen = 8,
                    exceedMaxHeight = false,
                    col0 = table.childNodes[0],
                    col2 = table.childNodes[2];

                // Iterate array of information.
                infoArr.forEach(function (infoItem) {
                    var itemName,
                        itemValue,
                        nameFs,
                        nameLen,
                        valueFs,
                        valueLen,
                        lineCountToTruncate,
                        result,
                        tlFuncHtmlText,
                        isFuncToken,
                        needEncode;

                    if (!exceedMaxHeight) {
                        // Create row and cells.
                        var tr = table.insertRow(-1),
                            td0 = tr.insertCell(-1),
                            td1 = tr.insertCell(-1),
                            td2 = tr.insertCell(-1);

                        // Add default classes.
                        tr.className = cssBaseClass + '-tr';
                        td0.className = cssBaseClass + '-name';
                        td1.className = cssBaseClass + '-space';
                        td2.className = cssBaseClass + '-value';

                        // Is this item a separator?
                        if (infoItem === null) {
                            // Add separator class.
                            $CSS.addClass(tr, 'separator');

                            // Update last separator flag.
                            isLastTRSeparator = true;
                        } else {
                            // Was the last info item a separator?
                            if (isLastTRSeparator) {
                                // Add separator padding class.
                                $CSS.addClass(tr, 'below-separator');
                            }

                            // Does the name NOT already contain a colon?
                            if (!nContainColon) {
                                // Add colon.
                                td1.innerHTML = ':';
                            }

                            itemName = infoItem.n;
                            needEncode = !infoItem.skipEncode;
                            td0.innerHTML = needEncode ? $STR.encodeHtmlString(itemName, true) : itemName;
                            nameFs = $UTILS.getComputedFontStyle(td0);
                            nameLen = Math.ceil($UTILS.measureTextWidth(itemName, nameFs, nameFs.bonus));
                            lineCountToTruncate = container.offsetHeight >= MAX_HEIGHT ? 1 : 2;

                            //PM required:  If a String is too long to fit in in one line, it should be Word Wrapped to a second line; otherwise it would be truncated in just a single line
                            if (nameLen > MAX_STRING_WIDTH) {
                                result = $UTILS.truncateTextToLineWithWordWrap(itemName, nameFs, MAX_STRING_WIDTH, lineCountToTruncate, true);
                                if (result.canWordWrap) {
                                    td0.innerHTML = needEncode ? $STR.encodeHtmlString(result.text, true) : result.text;
                                } else {
                                    result = $UTILS.truncateTextToLineWithWordWrap(itemName, nameFs, MAX_STRING_WIDTH, 1);
                                    td0.innerHTML = needEncode ? $STR.encodeHtmlString(result, true) : result;
                                }

                            }
                            maxNameLen = Math.min(Math.max(maxNameLen, nameLen), MAX_STRING_WIDTH);

                            itemValue = infoItem.v;
                            isFuncToken = infoItem.isTrendLineFuncToken;
                            if (isFuncToken) { // if value is Trend line function tokens
                                tlFuncHtmlText = getTrendLineFuncHtmlText(itemValue);
                            }
                            if (!isFuncToken || !tlFuncHtmlText.hasSuper) { // not Trend Line function tokens or no superscripts
                                if (isFuncToken) {
                                    itemValue = tlFuncHtmlText.htmlText;
                                }
                                td2.innerHTML = needEncode ? $STR.encodeHtmlString(itemValue, true) : itemValue;
                                valueFs = $UTILS.getComputedFontStyle(td2);
                                valueLen = Math.ceil($UTILS.measureTextWidth(itemValue, valueFs, valueFs.bonus));
                                if (valueLen > MAX_STRING_WIDTH) {
                                    result = $UTILS.truncateTextToLineWithWordWrap(itemValue, valueFs, MAX_STRING_WIDTH, infoItem.noTruncate ? 100 : lineCountToTruncate, true);
                                    if (!result.canWordWrap) {
                                        result = $UTILS.truncateTextToLineWithWordWrap(itemValue, valueFs, MAX_STRING_WIDTH, 1, true);
                                    }
                                    td2.innerHTML = needEncode ? $STR.encodeHtmlString(result.text, true) : result.text;
                                    valueLen = result.maxLineLen;
                                }
                                maxValueLen = Math.min(Math.max(maxValueLen, valueLen), MAX_STRING_WIDTH);
                            } else { // if value is Trend line function tokens and has superscripts
                                /**
                                 * Do not need to encode for Trend line function String because the attr or metric name
                                 * has already been encoded in TrendLineModel before generating the function string.*/
                                td2.innerHTML = tlFuncHtmlText.htmlText;
                                valueFs = $UTILS.getComputedFontStyle(td2);

                                // Update Trend Line function tokens with text width.
                                valueLen = 0;
                                $ARR.forEach(itemValue, function (exprToken) {
                                    exprToken.textWidth = $UTILS.measureSuperTextWidth(exprToken.isSuper, exprToken.v, valueFs, valueFs.bonus);
                                    valueLen += exprToken.textWidth;
                                });
                                valueLen = Math.ceil(valueLen);
                                if (valueLen > MAX_STRING_WIDTH) {
                                    result = $UTILS.truncateTextToLineWithWordWrapForTokens(itemValue, valueFs, MAX_STRING_WIDTH, infoItem.noTruncate ? 100 : lineCountToTruncate, true, true);
                                    if (!result.canWordWrap) {
                                        result = $UTILS.truncateTextToLineWithWordWrapForTokens(itemValue, valueFs, MAX_STRING_WIDTH, 1, true);
                                    }
                                    td2.innerHTML = getTrendLineFuncHtmlText(result.text).htmlText;
                                    valueLen = result.maxLineLen;
                                }
                                maxValueLen = Math.min(Math.max(maxValueLen, valueLen), MAX_STRING_WIDTH);
                            }

                            col0.style.width = maxNameLen + 'px';
                            col2.style.width = maxValueLen + 'px';
                            table.style.width = (maxNameLen + maxValueLen + spaceLen) + 'px';

                            // Update last separator flag.
                            isLastTRSeparator = false;
                        }

                        if (container.offsetHeight >= MAX_HEIGHT) {
                            //remove last tr
                            var tbody = table.lastChild;
                            tbody && tbody.removeChild(tbody.lastChild);
                            exceedMaxHeight = true;
                        }
                    }
                });

                if (pos) {
                    // make sure the entire tooltip window is visible to user.
                    this.moveTo(pos.x, pos.y);
                }
            },

            moveTo: function (x, y) {
                var loc = mstrmojo.dom.position(document.body),
                    domNode = this.domNode,
                    w = domNode.offsetWidth,
                    h = domNode.offsetHeight,
                    ctnX2 = loc.x + loc.w,
                    ctnY2 = loc.y + loc.h,
                    ox = x + OFFSET_MAX,
                    oy = y + OFFSET_MAX;

                if (ox > ctnX2 - w || oy > ctnY2 - h) {
                    if (ox <= ctnX2 - w) {
                        oy = ctnY2 - h;
                    } else if (oy <= ctnY2 - h) {
                        ox = ctnX2 - w;
                    } else {
                        ox = ctnX2 - w;
                        oy = y - OFFSET_MAX - h;
                    }
                }

                var domNodeStyle = domNode.style;
                domNodeStyle.left = ox + PX;
                domNodeStyle.top = oy + PX;
            },

            doLayout: function doLayout(tableMaxWidth) {
                var table = this.domNode.getElementsByTagName('table')[0];
                if (!table) {
                    return;
                }

                // Get table domNode computed style and calculate max value width.
                var tooltipStyle = $CSS.getComputedStyle(this.domNode),
                    maxWidthForValue = tableMaxWidth - parseInt(tooltipStyle.paddingLeft, 10) - parseInt(tooltipStyle.paddingRight, 10);

                // Reduce max value width by width of first cell.
                maxWidthForValue -= table.rows[0].cells[0].offsetWidth;
                // Reduce max value width by width of spacer cell.
                maxWidthForValue -= 10;

                // Iterate value cells.
                table.getElementsByClassName(cssBaseClass + '-value').forEach(function (cell) {
                    // Cell max width of value cell.
                    cell.style.maxWidth = maxWidthForValue + PX;
                });
            },

            /***
             * Move the tooltip to indicated position.
             *
             * @param {{x: int, y: int}}} pos The position to move to.
             */
            posTo: function posTo(pos) {
                var domNodeStyle = this.domNode.style;
                domNodeStyle.left = pos.x + PX;
                domNodeStyle.top = pos.y + PX;
            },

            /**
             * Displays an error message.
             *
             * @param {String} msg
             */
            renderErrMsg: function renderErrMsg(msg) {
                addTableNode.call(this).insertRow(-1).insertCell(-1).innerText = msg;
            }
        }
    );
}());//@ sourceURL=VisTooltip.js