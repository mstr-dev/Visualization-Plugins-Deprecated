(function () {

    mstrmojo.requiresCls(
        'mstrmojo.hash',
        'mstrmojo.dom',
        'mstrmojo.func',
        'mstrmojo.VisEnum',
        'mstrmojo.num',
        'mstrmojo.array',
        'mstrmojo.VisMenuList',
        'mstrmojo.mstr.EnumFunction',
        'mstrmojo._HasMarkup',
        'mstrmojo.chart.model.enums.EnumDSSObjectType',
        'mstrmojo.models.FormatModel',
        'mstrmojo.css',
        'mstrmojo.chart.enums.EnumFontStyle',
        'mstrmojo.vi.ui.DatasetUnitMenuUtils'
    );

    mstrmojo.requiresClsP("mstrmojo.ui.menus",
        "MenuConfig",
        'EditorConfig'
    );



    var CANVAS_NODE = document.getElementById("vis-measure-canvas"),
        SPAN_NODE = document.getElementById("vis-measure-span"),
        TEXT_WIDTH_QUICK_CACHE = {},
        TEXT_WIDTH_CACHE = {},
        TEXT_HEIGHT_CACHE = {},
        $DOM = mstrmojo.dom,
        $DATASET_MENU_UTILS = mstrmojo.vi.ui.DatasetUnitMenuUtils,
        EnumColorRankMode = mstrmojo.VisEnum.EnumColorRankMode,
        ObjectType = mstrmojo.chart.model.enums.EnumDSSObjectType,
        ENUM_PROPERTY_NAMES = mstrmojo.models.FormatModel.ENUM_PROPERTY_NAMES,
        ENUM_FONT_STYLE = mstrmojo.chart.enums.EnumFontStyle,
        $HASH = mstrmojo.hash,
        $WRAP = mstrmojo.func.wrapMethods,
        $VIS_ENUM = mstrmojo.VisEnum,
        ERROR_TYPE = $VIS_ENUM.SERVER_JSON_ERROR_TYPE;

    var ACTION_GROUP = 64,
        ACTION_CALCULATION = 128,
        IDX_A_MINUS_B = 4,
        IDX_B_MINUS_A = 5,
        IDX_A_DIV_B = 6,
        IDX_B_DIV_A = 7,
        $MOJO = mstrmojo,
        $ARR = $MOJO.array,
        $ARRAY = mstrmojo.array,
        $DESC = $MOJO.desc,
        $FUNC = $MOJO.mstr.EnumFunction,
        $DET = mstrmojo.vi.enums.EnumDerivedElementType,
        $HAS_MARKUP = $MOJO._HasMarkup,
        $CSS = $MOJO.css;

    mstrmojo.requiresDescs(221, 358, 1422, 2122, 6017, 5868, 5869);


    /**
     * Get color by color for comb
     * @param widget {VisBase} widget instance
     * @param comb {Array.<*>} color by identity
     * @returns {{color: Number, isManual: boolean}}
     */
    function getColorBy(widget, comb) {
        var tids = $UTIL.pluck(comb, 'tid'),
            eids = $UTIL.pluck(comb, 'eid'),
            docModel = (widget.getDocModel && widget.getDocModel()) || $UTIL.getPropertyByPath(widget, 'model.docModel');

        if ($UTIL.getPropertyByPath(docModel, 'getColorBy') instanceof Function) {
            return docModel.getColorBy(tids, eids);
        }
    }

    function addObservableModelListeners(modelNames, edtModel, callback) {
        var id = edtModel.id,
            host = edtModel.getHost();

        if (host && host.observableModel) {
            modelNames.forEach(function (name) {
                var model = host.observableModel[name];
                if (model) {
                    model.attachEventListener('valueChanged', id, callback);
                }
            });
        }
    }

    function getItems(cellsNum) {
        var ITEMS = {
            'SINGLE': [
                {
                    text: $DESC(358, 'Absolute'),
                    value: $FUNC.FunctionAbs,
                    n: $DESC(358, 'Absolute'),
                    v: $FUNC.FunctionAbs
                }
            ],
            'PAIR': [
                {
                    text: $DESC(6017, 'Add'),
                    value: $FUNC.FunctionAdd,
                    n: $DESC(6017, 'Add'),
                    v: $FUNC.FunctionAdd
                },
                {
                    text: $DESC(2122, 'Average'),
                    value: $FUNC.FunctionAverage,
                    n: $DESC(2122, 'Average'),
                    v: $FUNC.FunctionAverage
                },
                {
                    text: $DESC(5868, 'Least'),
                    value: $FUNC.FunctionLeast,
                    n: $DESC(5868, 'Least'),
                    v: $FUNC.FunctionLeast
                },
                {
                    text: $DESC(5869, 'Greatest'),
                    value: $FUNC.FunctionGreatest,
                    n: $DESC(5869, 'Greatest'),
                    v: $FUNC.FunctionGreatest
                },
                {
                    text: 'A-B',
                    value: $FUNC.FunctionMinus + ';0',
                    n: 'A-B',
                    v: $FUNC.FunctionMinus + ';0'
                },
                {
                    text: 'B-A',
                    value: $FUNC.FunctionMinus + ';1',
                    n: 'B-A',
                    v: $FUNC.FunctionMinus + ';1'
                },
                {
                    text: 'A/B',
                    value: $FUNC.FunctionDivide + ';0',
                    n: 'A/B',
                    v: $FUNC.FunctionDivide + ';0'
                },
                {
                    text: 'B/A',
                    value: $FUNC.FunctionDivide + ';1',
                    n: 'B/A',
                    v: $FUNC.FunctionDivide + ';1'
                }
            ],
            'MORE': [
                {
                    text: $DESC(6017, 'Add'),
                    value: $FUNC.FunctionAdd,
                    n: $DESC(6017, 'Add'),
                    v: $FUNC.FunctionAdd
                },
                {
                    text: $DESC(2122, 'Average'),
                    value: $FUNC.FunctionAverage,
                    n: $DESC(2122, 'Average'),
                    v: $FUNC.FunctionAverage
                },
                {
                    text: $DESC(5868, 'Least'),
                    value: $FUNC.FunctionLeast,
                    n: $DESC(5868, 'Least'),
                    v: $FUNC.FunctionLeast
                },
                {
                    text: $DESC(5869, 'Greatest'),
                    value: $FUNC.FunctionGreatest,
                    n: $DESC(5869, 'Greatest'),
                    v: $FUNC.FunctionGreatest
                }
            ]
        };

        return ITEMS[cellsNum];
    }

    function isActionSupported(data, action) {
        return !!(((data && data.at) || 0) & action);
    }

    function isGroupActionSupported(xtab) {
        return !xtab.selCells.some(function (cell) {
            var cellInfo = xtab.getCellForNode(cell);
            return !isActionSupported(cellInfo, ACTION_GROUP) || cellInfo.dei !== undefined;
        });
    }

    function isCalculationActionSupported(xtab) {
        return !xtab.selCells.some(function (cell) {
            return (!isActionSupported(xtab.getCellForNode(cell), ACTION_CALCULATION));
        });
    }

    function applyCalculation(xtab, data, de, funcType, isEdit) {
        var derivedElementFunctionType = de && de.func;

        if ((derivedElementFunctionType === funcType) || (typeof funcType === 'string' &&
            funcType.indexOf(derivedElementFunctionType) === 0 && funcType.indexOf(';0') > 0)) {
            return;
        }
        if (isEdit) {
            xtab.editDECalculation(data, funcType);
        } else {
            xtab.derivedElementCalculation(data, funcType);
        }
    }

    function getCalculationItems(xtab, de, getCellName) {
        var es = de && de.es,
            n = (es && es.length) || xtab.selCells.length,
            cellsNum = (n === 1) ? 'SINGLE' : ((n === 2) ? 'PAIR' : 'MORE'),
            items = getItems(cellsNum),
            func = (de && de.func),
            i,
            selCells = xtab.selCells,
            selectedItem,
            name1,
            name2,
            reversedOperand;

        if (cellsNum === 'PAIR') {
            if (de) {
                reversedOperand = es[0].v > es[1].v;

                if (reversedOperand) {
                    name2 = es[0].n;
                    name1 = es[1].n;

                    items[4] = {
                        value: $FUNC.FunctionMinus + ';1',
                        v: $FUNC.FunctionMinus + ';1'
                    };
                    items[5] = {
                        value: $FUNC.FunctionMinus + ';0',
                        v: $FUNC.FunctionMinus + ';0'
                    };
                    items[6] = {
                        value: $FUNC.FunctionDivide + ';1',
                        v: $FUNC.FunctionDivide + ';1'
                    };
                    items[7] = {
                        value: $FUNC.FunctionDivide + ';0',
                        v: $FUNC.FunctionDivide + ';0'
                    };
                } else {
                    name1 = es[0].n;
                    name2 = es[1].n;
                }

            } else {
                name1 = getCellName(selCells[0]);
                name2 = getCellName(selCells[1]);
            }

            items[IDX_A_MINUS_B].text = name1 + ' - ' + name2;
            items[IDX_B_MINUS_A].text = name2 + ' - ' + name1;
            items[IDX_A_DIV_B].text = name1 + ' / ' + name2;
            items[IDX_B_DIV_A].text = name2 + ' / ' + name1;

            items[IDX_A_MINUS_B].n = name1 + ' - ' + name2;
            items[IDX_B_MINUS_A].n = name2 + ' - ' + name1;
            items[IDX_A_DIV_B].n = name1 + ' / ' + name2;
            items[IDX_B_DIV_A].n = name2 + ' / ' + name1;
        }

        for (i in items) {
            if (typeof items[i].value === 'string' && items[i].value.indexOf(func) === 0 && items[i].value.indexOf(';0') > 0) {
                selectedItem = items[i];
                break;
            }
            if (items[i].value === func) {
                selectedItem = items[i];
                break;
            }
        }
        return {
            'items': items,
            'selectedItem': selectedItem
        };
    }

    /**
     * Searches cache provided entry using keys provided.
     * @param {Object} cache
     * @param {Array} keys
     * @returns {*}
     */
    function searchCache(cache, keys) {
        if (!cache) {
            return cache;
        }

        if (keys.length === 1) {
            return cache[keys[0]];
        }

        var length = (keys && keys.length) || 0,
            i;
        for (i = 0; i < length; i++) {
            cache = cache[keys[i]];
            if (!cache) {
                break;
            }
        }
        return cache;
    }


    function isTrueForAll(thresholds, type1, type2) {
        return thresholds.every(function (threshold) {
            return threshold.ttp === type1 || threshold.ttp === type2;
        });
    }

    /**
     * Adds the value to the cache using keys provided.
     * @param {Object} cache
     * @param {Array} keys
     * @param {*} value
     */
    function updateCache(cache, keys, value) {
        var length = (keys && keys.length) || 0,
            i,
            k,
            c = cache;

        for (i = 0; i < length - 1; i++) {
            k = keys[i];

            if (!c[k]) {
                c[k] = {};
            }
            c = c[k];
        }
        c[keys[length - 1]] = value;
    }

    function isDerivedMetric(did) {
        var dsn, mx, lastUntOnCol, metrics, col,
            dataSets = this.model.docModel.datasets,
            breakFlag = false,
            isDM = false,
            retObj = {isDM: false};

        for (dsn in dataSets) {
            if (dataSets.hasOwnProperty(dsn)) {
                mx = dataSets[dsn].mx;
                $ARR.forEach((mx || []), function (item) {
                    if (item.did === did) {
                        if (item.um || item.rdm) {//um stand for document level DM, rdm stand for report level DM
                            isDM = true;
                        }
                        breakFlag = true;
                        return false;//break
                    }
                });
                if (breakFlag) {
                    break;
                }
            }
        }

        //derived metric: "CD:id:ContainerID:ContainerType",,metricId.split(':').length > 2
        if (isDM) {
            col = this.model.data.gts.col;
            lastUntOnCol = (col && col[col.length - 1]);
            if (lastUntOnCol && lastUntOnCol.otp === -1) {
                metrics = lastUntOnCol.es;
            }
            $ARR.forEach((metrics || []), function (mtx) {
                if (mtx.oid === did) {
                    retObj =  {isDM: true, id: mtx.id};
                    return false;//break
                }
            });
        }
        return retObj;
    }

    function getUpdateColorMapAction(comb, color) {
        var arrOfColorMap = [],
            action = {act: "updateElementsPropertiesMap", epm: arrOfColorMap},
            colork = [],
            colorvObj = {},
            colorv = [colorvObj],
            me = this;
        arrOfColorMap.push({epmk: colork, epmv: colorv});
        comb.forEach(function (element) {
            var tid = element.tid,
                isMetric = tid === -1,
                unitK = { ob: {did: isMetric ? "" : tid} };//empty string or NULL?
            colork.push(unitK);
        });

        if (color && color.indexOf('default') < 0) {//'default' value mean to clear the manually assigned color
            colorvObj.v = {vv: color};
        }
        var chn = [];
        colorvObj.k = {chn: chn};

        comb.forEach(function (comb) {
            var tid = comb.tid,
                isMetric = tid === -1,
                isDMObj;
            if (isMetric) {
                isDMObj = isDerivedMetric.call(me, comb.eid);
                if (isDMObj.isDM) {
                    chn.push(
                        {
                            emt: 2,
                            ei: isDMObj.id
                        }
                    );
                } else {
                    chn.push(
                        {
                            emt: 2,
                            mt: {
                                did: comb.eid,
                                tp: 4,
                                ql: 0
                            }
                        }
                    );
                }
            } else {
                chn.push(
                    {
                        emt: 1,
                        ei: comb.eid,
                        at: {
                            did: tid,
                            tp: comb.tp,
                            ql: 0
                        }
                    }
                );
            }
        });
        return action;
    }

    /**
     * get the metrics in widget.zonesModel
     * @param zonesModel
     * @param {mstrmojo.vi.viz.EnumDSSDropZones}dzid
     * @returns {Array}
     */
    function getMetricsInDropZone(zonesModel, dzid) {
        var METRIC_NAMES_ID = '00000000000000000000000000000000',
            dropZones = zonesModel.dropZones,
            idx = $ARR.find(dropZones, 'id', dzid);

        return idx === -1 ? [] : $ARR.filter(dropZones[idx].items, function (item) {
            return item.t === 4 && item.id !== METRIC_NAMES_ID;
        });
    }

    /**
     * @namespace
     */
    mstrmojo.plugins.VisMicroChart.VisUtility = mstrmojo.provide(

        "mstrmojo.plugins.VisMicroChart.VisUtility",

        /**
         * @lends mstrmojo.plugins.VisMicroChart.VisUtility
         */
        {
            getCache: function () {
                return JSON.stringify(TEXT_HEIGHT_CACHE);
            },

            getUpdateColorMapAction: function (comb, color) {
                return getUpdateColorMapAction.call(this, comb, color);
            },

            measureTextSize: function (string, fs, bonus) {
                return {
                    width: this.measureTextWidth(string, fs, bonus),
                    height: this.measureTextHeight(string, fs, bonus)
                };
            },

            measureTextWidth: function (text, styles, bonus, maxHeight, singleLine) {
                if ($DOM.isIE || $DOM.isIEW3C) {
                    return this.measureTextWidthWithSpan(text, styles, bonus, maxHeight, singleLine);
                }
                return this.measureTextWidthWithCanvas(text, styles, bonus);
            },

            /**
             * Measure the width of a given string using canvas. No truncation or word wrap will be involved in the measuring process.
             *
             * @param {String} string Text to be measured.
             * @param {Object} fs Font style object. Valid properties include "fontFamily", "fontSize", "fontWeight", and "fontStyle".
             * @param {int} bonus The return value will be added by this bonus.
             * @returns {int}
             */
            measureTextWidthWithCanvas: function (string, fs, bonus, skipCache) {

                skipCache = skipCache || false;

                if (string === '') {
                    return 0;
                }

                if (string === ' ') {
                    string = '\u00A0';
                }

                var fontFamily = fs.fontFamily,
                    fontSize = fs.fontSize,
                    fontStyle = fs.fontStyle,
                    fontWeight = fs.fontWeight;

                if (typeof fontSize === 'number') {
                    fontSize += 'pt';
                }

                fontStyle = fontStyle || 'normal';
                fontWeight = fontWeight || 'normal';
                bonus = bonus || 0;

                var width = skipCache ? undefined : searchCache(TEXT_WIDTH_QUICK_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, string]);

                if (!width) { // NOT found in cache.
                    if (!CANVAS_NODE) {
                        CANVAS_NODE = document.createElement('canvas');
                        CANVAS_NODE.width = 0;
                        CANVAS_NODE.height = 0;
                        CANVAS_NODE.id = 'vis-measure-canvas';
                        CANVAS_NODE.style.position = 'absolute';
                        CANVAS_NODE.style.top = '0';
                        //chrome bug: body fontSize will affect the canvas context.font
                        CANVAS_NODE.style.fontSize = 'medium';
                        document.body.appendChild(CANVAS_NODE);
                    }

                    var context = CANVAS_NODE.getContext('2d');
                    context.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily;
                    width = Math.ceil(context.measureText(string).width);
                    updateCache(TEXT_WIDTH_QUICK_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, string], width);
                }

                return width + bonus;
            },

            /**
             * Measure the width of a given string using span.
             *
             * @param {String} string Text to be measured.
             * @param {Object} fs Font style object. Valid properties include "fontFamily", "fontSize", "fontWeight", and "fontStyle".
             * @param {int} bonus
             * @param {int} maxHeight
             * @param singleLine whether we should start a new line or not, if true, a new line will started only when there are <br> inside the string
             * @returns {*}
             */
            measureTextWidthWithSpan: function (string, fs, bonus, maxHeight, singleLine) {
                if (string === '') {
                    return 0;
                }

                if (string === ' ') {
                    string = '\u00A0';
                }

                var fontFamily = fs.fontFamily,
                    fontSize = fs.fontSize,
                    fontStyle = fs.fontStyle,
                    fontWeight = fs.fontWeight;

                if (typeof fontSize === 'number') {
                    fontSize += 'px';
                }

                fontStyle = fontStyle || 'normal';
                fontWeight = fontWeight || 'normal';
                maxHeight = maxHeight || 'auto';
                bonus = bonus || 0;
                singleLine = !!singleLine;

                if (typeof maxHeight === 'number') {
                    maxHeight += 'px';
                }

                var width = searchCache(TEXT_WIDTH_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, maxHeight, string]);
                if (!width) { // NOT found in cache.
                    var spanStyle;
                    if (!SPAN_NODE) {
                        SPAN_NODE = document.createElement('span');
                        spanStyle = SPAN_NODE.style;
                        SPAN_NODE.id = 'vis-measure-span';
                        spanStyle.position = 'absolute';
                        spanStyle.top = '0';
                        spanStyle.visibility = 'hidden';
                        spanStyle.width = 'auto';
                        spanStyle.height = 'auto';
                        if (singleLine) {
                            spanStyle.whiteSpace = 'nowrap'; // Hongchao, Note that adding this will make wordBreak not work
                        } else {
                            spanStyle.whiteSpace = 'normal';
                        }

                        document.body.appendChild(SPAN_NODE);
                    }

                    spanStyle = SPAN_NODE.style;

                    if (singleLine) {
                        spanStyle.whiteSpace = 'nowrap'; // Hongchao, Note that adding this will make wordBreak not work
                    } else {
                        spanStyle.whiteSpace = 'normal';
                    }

                    spanStyle.width = 'auto';
                    spanStyle.height = maxHeight;
                    spanStyle.fontFamily = fontFamily;
                    spanStyle.fontSize = fontSize;
                    spanStyle.fontStyle = fontStyle;
                    spanStyle.fontWeight = fontWeight;
                    SPAN_NODE.innerHTML = string;

                    width = Math.ceil(SPAN_NODE.clientWidth);
                    updateCache(TEXT_WIDTH_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, maxHeight, string], width);
                }

                return width + bonus;
            },

            /**
             * Measure the height of a given string using span.
             *
             * @param {String} string Text to be measured.
             * @param {Object} fs Font style object. Valid properties include "fontFamily", "fontSize", "fontWeight", and "fontStyle".
             * @param bonus
             * @param maxWidth
             * @param breakMode
             * @param skipCache
             * @param singleLine whether we should start a new line or not, if true, a new line will started only when there are <br> inside the string
             * @skipCache
             * @returns {*}
             */
            measureTextHeight: function (string, fs, bonus, maxWidth, breakMode, skipCache, singleLine) {
                if (string === '') {
                    return 0;
                }

                if (string === ' ') {
                    string = '\u00A0';
                }

                var fontFamily = fs.fontFamily,
                    fontSize = fs.fontSize,
                    fontStyle = fs.fontStyle,
                    fontWeight = fs.fontWeight;

                breakMode = breakMode || "normal";

                singleLine = !!singleLine;

                if (typeof fontSize === 'number') {
                    fontSize += 'px';
                }

                fontStyle = fontStyle || 'normal';
                fontWeight = fontWeight || 'normal';
                maxWidth = maxWidth || 'auto';
                bonus = bonus || 0;

                if (typeof maxWidth === 'number') {
                    maxWidth += 'px';
                }

                var height = skipCache ? undefined : searchCache(TEXT_HEIGHT_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, maxWidth, string]);
                if (!height) { // NOT found in cache.
                    var spanStyle;
                    if (!SPAN_NODE) {
                        SPAN_NODE = document.createElement('span');
                        spanStyle = SPAN_NODE.style;
                        SPAN_NODE.id = 'vis-measure-span';
                        spanStyle.position = 'absolute';
                        spanStyle.top = '0';
                        spanStyle.visibility = 'hidden';
                        spanStyle.width = 'auto';
                        spanStyle.height = 'auto';
                        if (singleLine) {
                            spanStyle.whiteSpace = 'nowrap'; // Hongchao
                        } else {
                            spanStyle.whiteSpace = 'normal';
                        }

                        document.body.appendChild(SPAN_NODE);
                    }

                    spanStyle = SPAN_NODE.style;

                    if (singleLine) {
                        spanStyle.whiteSpace = 'nowrap'; // Hongchao, Note that adding this will make wordBreak not work
                    } else {
                        spanStyle.whiteSpace = 'normal';
                    }
                    spanStyle.heigth = 'auto';
                    spanStyle.width = maxWidth;
                    spanStyle.fontFamily = fontFamily;
                    spanStyle.fontSize = fontSize;
                    spanStyle.fontStyle = fontStyle;
                    spanStyle.fontWeight = fontWeight;
                    spanStyle.wordBreak = breakMode;
                    SPAN_NODE.innerHTML = string;

                    height = SPAN_NODE.clientHeight;

                    if (!skipCache) {
                        updateCache(TEXT_HEIGHT_CACHE, [fontFamily, fontSize, fontStyle, fontWeight, maxWidth, string], height);
                    }
                }

                return height + bonus;
            },

            getVisEmptyMsg: function (type) {
                var msg = "";

                switch (type) {
                case "AE_ERROR":
                    msg = '<div class="gm-vis-msg-container">' +
                        '<div class="gm-vis-msg-vcenter">' +
                        '<div class="gm-vis-msg-hcenter">' +
                        '<div style="padding:25px">' +
                        '<div class="gm-warning-icon" style="padding-bottom:18px"></div>' +
                        '<div style="padding-bottom:8px">' + mstrmojo.desc(null, 'Unable to load visualization.') + '</div>' +
                        '<div>' + mstrmojo.desc(null, 'Use a filter to reduce the data and try again.') + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    break;
                case "NODATA_OTHERERROR":
                    msg = '<div class="gm-vis-msg-container">' +
                        '<div class="gm-vis-msg-vcenter">' +
                        '<div class="gm-vis-msg-hcenter">' +
                        '<div>' + (this.errorMsg || mstrmojo.desc(12093, "Filter excludes all data")) + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    break;
                default:
                    //                    mkString =  '<div class="gm-vis-msg-container">' +
                    //                        '<div class="gm-vis-msg-vcenter">' +
                    //                        '<div class="gm-vis-msg-hcenter">' +
                    //                        '<div>' + mstrmojo.desc(12094, 'The Graph Matrix requires:') + '</div>' +
                    //                        '<div class="gm-vis-msg-indent">' + mstrmojo.desc(12095, '- at least one attribute to be placed on the row or column axis') + '</div>' +
                    //                        '<div class="gm-vis-msg-indent">' + mstrmojo.desc(12096, '- all metrics to be placed on the column axis, below any attributes') + '</div>' +
                    //                        '</div>' +
                    //                        '</div>' +
                    //                        '</div>';
                    msg = '<div class="mstrmojo-Label dropMsg" style="display: block;" >' + mstrmojo.desc(11668, 'Drag objects here.') + '</div>';
                }

                return msg;
            },

            applyStyles2DomNode: function (domNode, styles) {
                var prop,
                    domStyle = domNode.style;
                if (Object.prototype.hasOwnProperty.call(styles, 'backgroundColor') && styles.backgroundColor !== '' && styles.backgroundColor !== 'transparent') {//modified by haifwang
                    var alpha = 1;
                    if (Object.prototype.hasOwnProperty.call(styles, 'opacity') && styles.opacity !== '') {
                        alpha = styles.opacity;
                    }
                    var background = styles.backgroundColor,
                        getRGB = function getRGB(value) {
                            if (isNaN(value)) {
                                value = 0;
                            }
                            value %= 0x1000000;
                            return {
                                b: value % 256,
                                g: (value >> 8) % 256,
                                r: (value >> 16) % 256
                            };
                        },
                        cssString = '';
                    if (background) {
                        var getRGBAString = function getRGBAString(value, alpha) {
                            if (value === 'transparent') {
                                return 'rgba(0,0,0,0)';
                            }
                            value = this.parseCSSColor(value, false);
                            var rgb = getRGB(value);
                            return 'rgba(' + rgb.r + ' ,' + rgb.g + ' ,' + rgb.b + ' ,' + alpha + ' )';
                        }.bind(this);
                        if (background.c1 !== undefined && background.c2 !== undefined && background.or !== undefined) {
                            cssString = ($CSS.buildGradient(background.or, getRGBAString(background.c1, alpha), getRGBAString(background.c2, alpha))).v;
                        } else {
                            cssString = getRGBAString(background, alpha);
                        }
                        domStyle.background = cssString;
                    }
                } else {
                    domStyle.backgroundColor = 'rgba(0,0,0,0)';//set default fill type to transparent
                }
                for (prop in styles) {
                    if (prop !== 'backgroundColor' && prop !== 'opacity' && Object.prototype.hasOwnProperty.call(styles, prop) && styles[prop] && styles[prop] !== '') {
                        domStyle[prop] = styles[prop];
                    }
                }
            },

            parseCSSColor: function (strCSSColor, reverse) {
                var arr,
                    i;
                if (strCSSColor.length === 7) {
                    //return parseInt(res);
                    if (reverse === true) {
                        arr = strCSSColor[5] + strCSSColor[6] + strCSSColor[3] + strCSSColor[4] + strCSSColor[1] + strCSSColor[2];
                    } else {
                        arr = strCSSColor.slice(1);
                    }
                } else {

                    arr = [];
                    var digits = strCSSColor.slice(1);
                    if (reverse === true) {
                        for (i = 2; i >= 0; i--) {
                            arr.push(digits[i]);
                            arr.push(digits[i]);
                        }
                    } else {
                        for (i = 0; i < 3; i++) {
                            arr.push(digits[i]);
                            arr.push(digits[i]);
                        }
                    }
                    arr = arr.join('');
                }
                return parseInt(arr, 16);
            },

            /**
             * This function only handles width, height, top, left, right, bottom.
             * @param domNode
             * @param styles
             */
            positionDomNode: function (domNode, styles) {
                var i,
                    prop,
                    value,
                    TOCHECK = ['width', 'height', 'top', 'left', 'right', 'bottom'],
                    n = TOCHECK.length,
                    domStyle = domNode.style;

                for (i = 0; i < n; i++) {
                    prop = TOCHECK[i];
                    value = styles[prop];
                    if (value !== undefined) {
                        if ((typeof value) === 'number') {
                            value += 'px';
                        }
                        domStyle[prop] = value;
                    }
                }
            },

            getComputedFontStyle: function getComputedFontStyle(elem) {
                var computedStyle = mstrmojo.css.getComputedStyle(elem);
                var fontStyle = {};
                fontStyle.fontFamily = computedStyle.fontFamily;
                fontStyle.fontSize = computedStyle.fontSize;
                fontStyle.fontStyle = computedStyle.fontStyle;
                fontStyle.fontWeight = computedStyle.fontWeight;
                fontStyle.fontVariant = computedStyle.fontVariant;

                var paddingLeft = parseInt(computedStyle.paddingLeft) || 0,
                    paddingRight = parseInt(computedStyle.paddingLeft) || 0;
                fontStyle.bonus = paddingLeft + paddingRight;

                return fontStyle;
            },

            splitWordIfTooLong: function (wordsArr, availSp, fontStyle) {
                var res = [];
                var sz = wordsArr.length;
                var i;
                for (i = 0; i < sz; i++) {
                    var wd = wordsArr[i];
                    while (true) {
                        //span.innerHTML = wd;
                        var wiLen = this.measureTextWidth(wd, fontStyle);
                        if (wiLen > availSp) {
                            var clipL = (availSp / wiLen) * wd.length;
                            var intClip = Math.max(Math.round(clipL), 1);//will infinit loop if intClip < 1

                            while (intClip > 0) {
                                var tpWd = wd.substr(0, intClip);
                                var len1 = Math.round(this.measureTextWidth(tpWd, fontStyle));
                                //to avoid infinit loop and constrain that at least one letter
                                if (len1 <= availSp || intClip === 1) {
                                    res.push(tpWd);
                                    break;
                                } else {
                                    intClip--;
                                }
                            }
                            //wiLen = availSp; // if one word is already larger than the space, clip it.
                            wd = wd.substr(intClip, wd.length - intClip);
                        } else {
                            res.push(wd);
                            break;
                        }
                    }
                }
                return res;
            },

            truncateTextToLineWithWordWrap: function truncateTextToLineWithWordWrap(str, fs, maxWidth, lineCount, returnExtraInfo, notSplitWord) {

                var wordsArr = str.split(' '),
                    wordCnt = wordsArr.length;
                if (!notSplitWord) {
                    wordsArr = this.splitWordIfTooLong(wordsArr, maxWidth, fs);
                }

                var i,
                    lenArr = [],
                    preLenArr = [],
                    totalLen = 0,
                    sz = wordsArr.length,
                    blankSpaceLen = this.measureTextWidth(' ', fs),
                    maxLineLen = 0,
                    textTruncated = false,
                    canWordWrap = (wordCnt === wordsArr.length);

                preLenArr.push(0);//the len is zero with none words is considered
                for (i = 0; i < sz; i++) {
                    var wiLen = this.measureTextWidth(wordsArr[i], fs);
                    if (!notSplitWord && wiLen > maxWidth) {
                        var wd = wordsArr[i];
                        var clipL = (maxWidth / wiLen) * wd.length;
                        wordsArr[i] = wd.substr(0, parseInt(clipL, 10));
                        wiLen = maxWidth; // if one word is already larger than the space, clip it.
                    }
                    lenArr.push(wiLen);
                    totalLen += wiLen;
                    preLenArr.push(totalLen);
                    if (i !== sz - 1) {
                        totalLen += blankSpaceLen;
                    }
                }
                //now lets arrange the words for each line
                var lnS,
                    lnE,//the start and end index for this line
                    ln = lineCount;

                for (lnS = 0, lnE = 0; lnE < preLenArr.length;) {
                    var len1 = preLenArr[lnE] - preLenArr[lnS];
                    if (lnS > 0 && lnE !== lnS) {
                        len1 -= blankSpaceLen;
                    }
                    var len2 = preLenArr[lnE + 1] - preLenArr[lnS];
                    if (lnS > 0 && lnE + 1 !== lnS) {
                        len2 -= blankSpaceLen;
                    }
                    if (len1 <= maxWidth && ((lnE + 1 === preLenArr.length) || (len2 > maxWidth))) {
                        //one line consumed
                        maxLineLen = Math.max(maxLineLen, len1);
                        ln--;
                        if (ln === 0 || lnE === sz) {
                            break;
                        }
                        else {
                            lnS = lnE;
                            lnE++;
                        }
                    }
                    else {
                        lnE++;
                    }
                }
                if (lnE > sz) {
                    lnE = sz;
                }
                var lastlineLen = preLenArr[lnE] - preLenArr[lnS];
                if (lnS > 0 && lnE !== lnS) {
                    lastlineLen -= blankSpaceLen;
                }

                var res;
                if (lnE >= sz && lastlineLen < maxWidth)//all words can be fit in
                {
                    res = wordsArr.join(' ');
                } else {
                    textTruncated = true;
                    maxLineLen = maxWidth;
                    res = wordsArr.slice(0, lnE).join(' ');
                    var elipLen = this.measureTextWidth('...', fs);

                    if (lastlineLen + elipLen <= maxWidth) {
                        //left space enough to hole the '...'
                        if (lastlineLen + blankSpaceLen + elipLen > maxWidth) {
                            res += '...';
                        } else {
                            var lastWord = wordsArr[lnE],
                                preWordLength;
                            for (var ci = 1; ci < lastWord.length; ci++) {
                                preWordLength = this.measureTextWidth(lastWord.substr(0, ci), fs);
                                if (lastlineLen + blankSpaceLen + preWordLength + elipLen > maxWidth) {
                                    break;
                                }
                            }
                            res += ' ' + lastWord.substr(0, ci - 1) + '...';
                        }
                    } else {
                        if (res.charAt(res.length - 1) === ' ') { // remove last char if it's ' '
                            res = res.substr(0, res.length - 1);
                        }
                        var pos = res.lastIndexOf(' ');
                        var left = res.length - 1 - pos; // how many characters are there after the last ' '
                        if (left === 3) {
                            res = res.substr(0, res.length - 3) + ' ...';
                        } // simply remove last 3 characters and append '...'
                        else {
                            //remove characters at last until we have enough space for the '...'
                            var removedCharLen = 0,
                                removedCharString = "",
                                removedCharCnt = 0;
                            while (removedCharLen < elipLen && res.length > removedCharCnt) {
                                removedCharCnt++;
                                removedCharString = res.substr(res.length - removedCharCnt, res.length);
                                removedCharLen = this.measureTextWidth(removedCharString, fs);
                            }
                            res = res.substr(0, res.length - removedCharCnt) + '...';
                        }
                    }
                }
                if (returnExtraInfo) {
                    return {
                        text: res,
                        truncated: textTruncated,
                        maxLineLen: maxLineLen,
                        canWordWrap: canWordWrap
                    };
                }
                return res;
            },

            // if isSuper is true, it meansh it is superscript text, else regular text.
            measureSuperTextWidth: function measureSuperTextWidth(isSuper, string, fs, bonus) {
                return isSuper ? this.measureTextWidth("<sup>" + string + "</sup>", fs, bonus) : this.measureTextWidth(string, fs, bonus);

            },

            // Similar to splitWordIfTooLong function, except that there it process tokens instead of string.
            splitTokenIfTooLong: function splitTokenIfTooLong(wordsArr, availSp, fontStyle) {
                var res = [];
                var sz = wordsArr.length;
                var i,
                    wd,
                    value,
                    isSuper,
                    wiLen;

                for (i = 0; i < sz; i++) {
                    wd = wordsArr[i];
                    isSuper = wd.isSuper;
                    while (true) {
                        value = wd.v;
                        if (wd.textWidth !== undefined) {
                            wiLen = wd.textWidth;
                        } else {
                            wiLen = wd.textWidth = this.measureSuperTextWidth(isSuper, value, fontStyle);
                        }
                        if (wiLen > availSp) {
                            var clipL = (availSp / wiLen) * value.length;
                            var intClip = Math.max(Math.round(clipL), 1);//will infinit loop if intClip < 1

                            while (intClip > 0) {
                                var tpWd = value.substr(0, intClip);
                                var len1 = Math.round(this.measureSuperTextWidth(isSuper, tpWd, fontStyle));
                                //to avoid infinit loop and constrain that at least one letter
                                if (len1 <= availSp || intClip === 1) {
                                    res.push({v: tpWd, isSuper: isSuper, textWidth: len1});
                                    break;
                                } else {
                                    intClip--;
                                }
                            }
                            wd = {v: value.substr(intClip, value.length - intClip), isSuper: isSuper};
                        } else {
                            res.push(wd);
                            break;
                        }
                    }
                }
                return res;
            },

            // Similar to truncateTextToLineWithWordWrap function except that here it process tokens instead of string.
            truncateTextToLineWithWordWrapForTokens: function truncateTextToLineWithWordWrapForTokens(wordsArr, fs, maxWidth, lineCount, returnExtraInfo, checkWordWrap) {
                var // wordsArr = str.split(' '),
                    wordCnt = wordsArr.length;

                wordsArr = this.splitTokenIfTooLong(wordsArr, maxWidth, fs);

                var i,
                    preLenArr = [],
                    totalLen = 0,
                    sz = wordsArr.length,
                    maxLineLen = 0,
                    textTruncated = false,
                    canWordWrap = (wordCnt === wordsArr.length),
                    wd,
                    isSuper,
                    value,
                    wiLen,
                    j,
                    lastWord,
                    preWordLength;

                if (checkWordWrap && !canWordWrap) {
                    return {canWordWrap: canWordWrap}; // return directly here
                }
                preLenArr.push(0);//the len is zero with none words is considered
                for (i = 0; i < sz; i++) {
                    wd = wordsArr[i];
                    value = wd.v;
                    isSuper = wd.isSuper;
                    if (wd.textWidth !== undefined) {
                        wiLen = wd.textWidth;
                    } else {
                        wiLen = wd.textWidth = this.measureSuperTextWidth(isSuper, value, fs);
                    }
                    if (wiLen > maxWidth) {
                        var clipL = (maxWidth / wiLen) * value.length;
                        wd.v = value.substr(0, parseInt(clipL, 10));
                        wiLen = wd.textWidth = maxWidth; // if one word is already larger than the space, clip it.
                    }
                    totalLen += wiLen;
                    preLenArr.push(totalLen);
                }
                //now lets arrange the words for each line
                var lnS,
                    lnE,//the start and end index for this line
                    ln = lineCount;

                for (lnS = 0, lnE = 0; lnE < preLenArr.length;) {
                    var len1 = preLenArr[lnE] - preLenArr[lnS];
                    var len2 = preLenArr[lnE + 1] - preLenArr[lnS];
                    if (len1 <= maxWidth && ((lnE + 1 === preLenArr.length) || (len2 > maxWidth))) {
                        //one line consumed
                        maxLineLen = Math.max(maxLineLen, len1);
                        ln--;
                        if (ln === 0 || lnE === sz) {
                            break;
                        }
                        else {
                            lnS = lnE;
                            lnE++;
                        }
                    }
                    else {
                        lnE++;
                    }
                }
                if (lnE > sz) {
                    lnE = sz;
                }
                var lastlineLen = preLenArr[lnE] - preLenArr[lnS];

                var res;
                if (lnE >= sz && lastlineLen < maxWidth)//all words can be fit in
                {
                    res = wordsArr;
                } else {
                    textTruncated = true;
                    maxLineLen = maxWidth;
                    res = wordsArr.slice(0, lnE);

                    var elipLen = this.measureTextWidth('...', fs);

                    if (lastlineLen + elipLen <= maxWidth) {
                        //left space enough to hole the '...'
                        lastWord = wordsArr[lnE];
                        value = lastWord.v;
                        isSuper = lastWord.isSuper;
                        for (j = 1; j < value.length; j++) {
                            preWordLength = this.measureSuperTextWidth(isSuper, value.substr(0, j), fs);
                            if (lastlineLen + elipLen + preWordLength > maxWidth) {
                                break;
                            }
                        }
                        if (j > 1) {
                            wd = {v: value.substr(0, j - 1), isSuper: isSuper};
                            wd.textWidth = this.measureSuperTextWidth(isSuper, wd.v, fs);
                            res.push(wd);
                            res.push({v: '...', textWidth: elipLen});
                        }

                    } else {
                        //remove characters at last until we have enough space for the '...'
                        var totRemovedCharLen = 0,
                            removedCharLen;
                        for (i = res.length - 1; i >= 0; i--) {
                            wd = res[i];
                            value = wd.v;
                            isSuper = wd.isSuper;
                            removedCharLen = 0;
                            for (j = value.length - 1; j >= 0; j--) {
                                removedCharLen = this.measureSuperTextWidth(isSuper, value.substr(j), fs);
                                if (totRemovedCharLen + removedCharLen >= elipLen) {
                                    break;
                                }
                            }
                            if (j >= 0) {
                                break;
                            } else {
                                totRemovedCharLen += removedCharLen;
                            }
                        }
                        if (i >= 0) {
                            if (j > 0) {
                                wd.v = value.substr(0, j);
                                wd.textWidth = this.measureSuperTextWidth(isSuper, wd.v, fs);
                                res = res.slice(0, i + 1);
                            } else if (j === 0) { // the i-th token is removed entirely
                                res = res.slice(0, i);
                            }
                            res.push({v: '...', textWidth: elipLen});
                        } else {
                            res = [{v: '...', textWidth: elipLen}];
                        }
                    }
                }
                if (returnExtraInfo) {
                    return {
                        text: res,
                        truncated: textTruncated,
                        maxLineLen: maxLineLen,
                        canWordWrap: canWordWrap
                    };
                }
                return res;
            },

            /**
             * This function is used to get the rankMode from thresholds definition.
             * @param thresholds
             */
            getRankMode: function getRankMode(thresholds) {
                var TYPE_LOWEST_PERCENT = 1,
                    TYPE_HIGHEST_PERCENT = 2,
                    TYPE_BETWEEN_PERCENT = 3,
                    TYPE_LOWEST = 4,
                    TYPE_HIGHEST = 5,
                    TYPE_BETWEEN = 6,
                    TYPE_VALUE = 7,
                    rankMode = EnumColorRankMode.INVALID;
                if (thresholds) {
                    if (isTrueForAll(thresholds, TYPE_BETWEEN_PERCENT, TYPE_HIGHEST_PERCENT)) {
                        rankMode = EnumColorRankMode.TOP_PERCENT;
                    } else if (isTrueForAll(thresholds, TYPE_BETWEEN_PERCENT, TYPE_LOWEST_PERCENT)) {
                        rankMode = EnumColorRankMode.BOTTOM_PERCENT;
                    } else if (isTrueForAll(thresholds, TYPE_BETWEEN, TYPE_LOWEST)) {
                        rankMode = EnumColorRankMode.BOTTOM;
                    } else if (isTrueForAll(thresholds, TYPE_BETWEEN, TYPE_HIGHEST)) {
                        rankMode = EnumColorRankMode.TOP;
                    } else if (isTrueForAll(thresholds, TYPE_VALUE)) {
                        rankMode = EnumColorRankMode.VALUE;
                    }
                }
                return rankMode;
            },

            getColorByTitle: function getColorByTitle(metrNam, rankMode) {
                if (rankMode === EnumColorRankMode.BOTTOM_PERCENT || rankMode === EnumColorRankMode.TOP_PERCENT) {
                    metrNam = mstrmojo.desc(2787, "Percentage of ##").replace("\'##\'", metrNam);
                } else if (rankMode === EnumColorRankMode.BOTTOM || rankMode === EnumColorRankMode.TOP) {
                    metrNam = mstrmojo.desc(2788, "Rank of ##").replace("\'##\'", metrNam);
                }
                return metrNam;
            },

            getColorByFormatStr: function getColorByFormatStr(colorMetricFormatStr, rankMode) {
                if (rankMode === EnumColorRankMode.BOTTOM_PERCENT || rankMode === EnumColorRankMode.TOP_PERCENT) {
                    colorMetricFormatStr = "0%;(0%)";
                } else if (rankMode === EnumColorRankMode.BOTTOM || rankMode === EnumColorRankMode.TOP) {
                    colorMetricFormatStr = "";
                }
                return colorMetricFormatStr;
            },

            getColorByItems: function getColorByItems(thresholds, rankMode, max, min, count, fs, defaultColor) {
                var items = [],
                    i,
                    scope,
                    nf = mstrmojo.num,
                    vmin,
                    vmax;

                if (thresholds === undefined || thresholds.length === 0) {
                    return items;
                }
                var descending = true;
                if (thresholds.length > 1) {
                    if (thresholds[0].ceil === thresholds[1].flr) {
                        descending = false;
                    } else {//must be (thresholds[0].flr === thresholds[1].ceil)
                        descending = true;
                    }
                }
                for (i = 0; i < thresholds.length; i++) {
                    var thObj = thresholds[i],
                        itm = {},
                        ceil = thObj.ceil,
                        flr = thObj.flr;

                    if ((i === 0 && descending) || (i === thresholds.length - 1 && !descending)) {//top(Max)
                        if (rankMode === EnumColorRankMode.BOTTOM_PERCENT || rankMode === EnumColorRankMode.TOP_PERCENT) {
                            itm.flr = flr / 100;
                            itm.ceil = 1;
                        } else if (rankMode === EnumColorRankMode.TOP || rankMode === EnumColorRankMode.BOTTOM) {
                            flr += 1;
                            itm.flr = Math.floor(flr);
                            itm.ceil = count;
                        } else {
                            itm.flr = flr;
                            itm.ceil = max;
                        }
                        vmax = itm.ceil;
                    } else if ((i === 0 && !descending) || (i === thresholds.length - 1 && descending)) {//bottom(Min)
                        if (rankMode === EnumColorRankMode.BOTTOM_PERCENT || rankMode === EnumColorRankMode.TOP_PERCENT) {
                            itm.flr = 0;
                            itm.ceil = ceil / 100;
                        } else if (rankMode === EnumColorRankMode.TOP || rankMode === EnumColorRankMode.BOTTOM) {
                            itm.flr = 0; //DE5054,To be consistent with Flash VI and Threshold Editor, we use 0 as the rank base
                            itm.ceil = Math.floor(ceil);
                        }
                        else {
                            itm.flr = min;
                            itm.ceil = ceil;
                        }
                        vmin = itm.flr;
                    } else {
                        if (rankMode === EnumColorRankMode.BOTTOM_PERCENT || rankMode === EnumColorRankMode.TOP_PERCENT) {
                            flr = flr / 100;
                            ceil = ceil / 100;
                        } else if(rankMode === EnumColorRankMode.TOP ||rankMode === EnumColorRankMode.BOTTOM) {
                            flr += 1;
                            flr = Math.floor(flr);
                            ceil = Math.floor(ceil);
                        }
                        itm.flr = flr;
                        itm.ceil = ceil;
                    }
                    if(rankMode === EnumColorRankMode.TOP ||rankMode === EnumColorRankMode.BOTTOM) {
                        itm.ceil = itm.ceil > count ? count : itm.ceil;//DE8866
                    }
                    if (fs) {
                        itm.label = nf.formatByMask(fs, itm.flr) + ' - ' + nf.formatByMask(fs, itm.ceil);
                    } else {
                        itm.label = itm.flr + ' - ' + itm.ceil;
                    }
                    if (thObj.fmt && thObj.fmt.bc) {
                        itm.color = thObj.fmt.bc;
                    } else {//when the threshold is image, the bc is undefined
                        itm.color = defaultColor;
                    }
                    items.push(itm);
                }

                //957421, sometimes [min, max] doesn't intersect with some of the ranges
                items = items.filter(function (i) {
                    return i.flr <= i.ceil && !(i.flr > vmax || i.ceil < vmin);
                });

                if (rankMode === EnumColorRankMode.TOP || rankMode === EnumColorRankMode.BOTTOM) {
                    scope = count;
                } else if (items.length > 0){
                    if (descending) {
                        scope = items[0].ceil - items[(items.length - 1)].flr;
                    } else {
                        scope = items[(items.length - 1)].ceil - items[0].flr;
                    }
                }
                //add the scope percent
                var sumPer = 0, curPer, curScope;
                for (i = 0; i < items.length; i++) {
                    if (i === items.length - 1) {
                        items[i].scopePercent = 1 - sumPer;
                    } else {
                        if (rankMode === EnumColorRankMode.TOP || rankMode === EnumColorRankMode.BOTTOM) {
                            curScope = items[i].ceil - items[i].flr + 1;
                        } else {
                            curScope = items[i].ceil - items[i].flr;
                        }
                        curPer = curScope / scope;
                        items[i].scopePercent = curPer;
                        sumPer += curPer;
                    }
                }
                return items;
            },

            getDefaultColorByItems: function (defaultColor, max, min) {
                var defaultItem = {};
                defaultItem.label = min + ' - ' + max;
                defaultItem.flr = min;
                defaultItem.ceil = max;
                defaultItem.color = defaultColor;
                defaultItem.scopePercent = 1;
                return [defaultItem];
            },

            getNumberFormat: function (modelData, metricIndex) {
                var nf = modelData.nf,
                    gvs = modelData.gvs;

                function getNumberFormatFromCells() {
                    var firstRow = (gvs && gvs.items && gvs.items[0] && gvs.items[0].items) || [],
                        item = firstRow[metricIndex] || {},
                        nfs = item.nfs;
                    return typeof nfs === 'string' ? nfs : '';
                }

                if (typeof nf[metricIndex].nfs !== 'string') {
                    nf[metricIndex].nfs = getNumberFormatFromCells();
                }

                return nf[metricIndex].nfs;
            },

            hasOnlyMetricsOnColumn: function (modelData) {
                var columnItems = (modelData && modelData.gts && modelData.gts.col) || [];
                return columnItems.every(function (item) {
                    return item.otp === ObjectType.DssTypeUnknown && // metric container
                        (item.es || []).every(function (obj) {
                            return obj.otp === ObjectType.DssTypeMetric;
                        });
                });
            },

            hasNoMetricOnRow: function (modelData) {
                var rowItems = (modelData && modelData.gts && modelData.gts.row) || [],
                    notMetric = function (item) {
                        return item.otp !== ObjectType.DssTypeMetric;
                    };

                return rowItems.every(notMetric);
            },

            isOnExpressMode: function () {
                return mstrApp.isExpress;
            },

            /**
             *
             * @param exp view.model.data.sc.exp
             * @param gtsModel [view.model.data.gts.row, view.model.data.gts.col]
             * @param fnCompareIds DocXtabModel.compareElementsIdInSingleGrid
             * @param xtabModel DocXtabModel compareElementsIdInSingleGrid is not a static method, needs to pass in the xtabModel
             */
            modifyScExp: function (exp, gtsModel, xtabModel, normalizedIdCache) {
                if (!exp || !gtsModel) {
                    return;
                }
                var nds = exp.nds,
                    innerNds,
                    elems,
                    gtsElems,
                    id1,
                    id2,
                    nId1,
                    nId2,
                    matched;
                $ARRAY.forEach(nds || [], function (nd) {
                    innerNds = nd.nds;
                    $ARRAY.forEach(innerNds || [], function (innerNd) {
                        elems = innerNd.es;
                        $ARRAY.forEach(elems || [], function (elem) {
                            id1 = elem.v;
                            nId1 = normalizedIdCache[id1];
                            if (!nId1) {
                                nId1 = xtabModel.getNormalizedFormElementId(id1);
                                normalizedIdCache[id1] = nId1;
                            }
                            // traverse the gtsModel
                            $ARRAY.forEach(gtsModel || [], function (rowOrCol) {
                                gtsElems = rowOrCol.es;
                                $ARRAY.forEach(gtsElems || [], function (gtsElem) {
                                    matched = false;
                                    id2 = gtsElem.id;
                                    if (id2 ===  id1) {
                                        matched = true;
                                    } else {
                                        nId2 = normalizedIdCache[id2];
                                        if (!nId2) {
                                            nId2 = xtabModel.getNormalizedFormElementId(id2);
                                            normalizedIdCache[id2] = nId2;
                                        }
                                        if (nId1 === nId2) {
                                            matched = true;
                                        }
                                    }
                                    if (matched) {
                                        elem.v = gtsElem.id;
                                        elem.n = gtsElem.n;
                                        return false;
                                    }
                                });
                                if (matched) {
                                    return false;
                                }
                            });
                        });
                    });
                });
            },

            modifyScExpDeprecated: function (exp, gtsModel, fnCompareIds, xtabModel) {
                if (!exp || !gtsModel) {
                    return;
                }
                //var pn = performance.now();
                var nds = exp.nds,
                    innerNds,
                    elems,
                    gtsElems;
                $ARRAY.forEach(nds || [], function (nd) {
                    innerNds = nd.nds;
                    $ARRAY.forEach(innerNds || [], function (innerNd) {
                        elems = innerNd.es;
                        $ARRAY.forEach(elems || [], function (elem) {
                            // traverse the gtsModel
                            $ARRAY.forEach(gtsModel || [], function (rowsOrCols) {
                                $ARRAY.forEach(rowsOrCols || [], function (rowOrCol) {
                                    gtsElems = rowOrCol.es;
                                    $ARRAY.forEach(gtsElems || [], function (gtsElem) {
                                        if (fnCompareIds.call(xtabModel, gtsElem.id, elem.v)) {
                                            elem.v = gtsElem.id;
                                            elem.n = gtsElem.n;
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
                //console.log("Initial HighLight Time: " + (performance.now() - pn) / 1000);
            },

            /**
             *
             * @param e browser event
             * @returns {{x: number, y: number}
            */
            getMouseOffset: function (e) {
                var offsetX = (e.offsetX !== undefined) ? e.offsetX : (e.layerX),
                    offsetY = (e.offsetY !== undefined) ? e.offsetY : (e.layerY);

                return {x: offsetX, y: offsetY};
            },

            /**
             * get line style (dotted, dashed, solid) and width according to idx
             *
             * @param idx
             * @returns {{width: (string|string), style: (string|string)}}
             */
            translateLineStyle: function (idx) {
                // the first element in styleMap and widthMap is not used, as the idx can only be 1 - 4 and 99('none')
                // styleMap and widthMap is created according to LineConfigGroup.lineStyle
                var styleMap = ['none', 'solid', 'solid', 'dashed', 'dotted'],
                    widthMap = ['1px', '1px', '2px', '1px', '1px'];
                return {
                    width: widthMap[idx] || '0px',
                    style: styleMap[idx] || 'none'
                };
            },

            /**
             * Construct group menu items for data points
             * @param vis Widget instance
             * @param params Additional parameters
             * @param params.selection Selected data points
             * @param params.fnCellName Function to retrieve display name for a cell
             * @param params.fnUnique Function to retrieve a unique collection of selected attributes
             * @param params.fnMakeNode Function to create a selection node
             */
            getGroupAndCalculationContextMenuForDataPoints: function (vis, params) {
                var uniqIdnts, // unique identities
                    attrs = [], // normal attribute elements
                    des = [], // derived elements
                    allAttributes = [], // all attribute elements(de & normal)
                    getCellName = params.fnCellName,
                    getUniqueIdentities = params.fnUnique,
                    makeNode = params.fnMakeNode,
                    getCellForNode = vis.getCellForNode.bind(vis),
                    selection = params.selection;

                var createDe = new $MOJO.ui.menus.MenuConfig(),
                    editGroup = new $MOJO.ui.menus.MenuConfig(),
                    editCalculation = new $MOJO.ui.menus.MenuConfig(),
                    renameDe = new $MOJO.ui.menus.MenuConfig();

                function onGroup(newValue) {
                    vis.selCells = attrs[newValue].selCells;
                    vis.derivedElementGroup(getCellForNode(vis.selCells[0]));
                }

                function onEditGroup(newValue) {
                    vis.selCells = des[newValue].selCells;
                    var data = getCellForNode(des[newValue].selCells[0]),
                        deInfo = vis.getDEInfo(data);
                    vis.derivedElementsEdit(getCellForNode(vis.selCells[0]), deInfo);
                }

                function onUngroup(newValue) {
                    vis.selCells = des[newValue].selCells;
                    var data = getCellForNode(des[newValue].selCells[0]);
                    vis.removeQuickDE(data);
                }

                function onRenameGroup(newValue) {
                    vis.selCells = des[newValue].selCells;
                    var data = getCellForNode(des[newValue].selCells[0]);
                    vis.renameDEList(data);
                }

                function onCalculation(newValue) {
                    applyCalculation(vis, getCellForNode(vis.selCells[0]), null, newValue, false);
                }

                function onEditCalculation(newValue) {
                    applyCalculation(vis, getCellForNode(vis.selCells[0]), null, newValue, true); // null should be de
                }

                function onRemoveCalculation(newValue) {
                    var data = getCellForNode(des[newValue].selCells[0]);
                    vis.removeQuickDE(data);
                }

                function onRenameCalculation(newValue) {
                    var data = getCellForNode(des[newValue].selCells[0]);
                    vis.editDECalculation(data);
                }

                function getSubMenuCallback(callback, options) {
                    return function () {
                        var subMenu = new $MOJO.ui.menus.MenuConfig();
                        subMenu.addNonInteractiveMenuItem(mstrmojo.desc(11859, 'Based on'), 'xt', true);
                        subMenu.addRadioMenuGroup(null, callback, options, 'checkMark', undefined, true);
                        return subMenu;
                    };
                }

                /**
                 * Case command processor
                 * @param caseDefs Menu construction case definitions
                 */
                function process(caseDefs) {
                    caseDefs = caseDefs || [];

                    function run(def) {
                        var extra = def.extra || {},
                            fnSetup = def.setup || mstrmojo.emptyFn,
                            fnAction = def.action || mstrmojo.emptyFn,
                            option = [];
                        fnSetup(option, extra);
                        fnAction(option, extra);
                    }

                    caseDefs.forEach(run);
                }

                // Menu item construction definitions, each case is defined as a `setup' and an `action' and an optional `extra'.
                // `setup 'is called before `action', the parameters are the same object in both functions.
                // If there's an `extra' property in the case definition, it is passed as an extra
                // parameter to `setup' and `action', which can hold case specific data.
                var caseDefinitions = [
                    {
                        name: 'group',
                        setup: function (options) {
                            attrs.forEach(function (attr) {
                                vis.selCells = attrs[attr.v].selCells;
                                if (!Object.prototype.hasOwnProperty.call(des, attr.v) && isGroupActionSupported(vis)) {
                                    options.push(attr);
                                }
                            });
                        },
                        action: function (options) {
                            var local_tid;

                            if (options.length === 1) { // only one group
                                local_tid = options[0].v;
                                createDe.addMenuItem(mstrmojo.desc(1911, 'Group'), 'xt', function () {
                                    vis.selCells = attrs[local_tid].selCells;
                                    vis.derivedElementGroup(getCellForNode(vis.selCells[0]));
                                });
                            }
                            if (options.length > 1) { // multiple group
                                createDe.addPopupMenuItem(mstrmojo.desc(1911, 'Group'), vis.id, getSubMenuCallback(onGroup, options), 'xt');
                            }
                        }
                    }, {
                        name: 'edit-group',
                        setup: function (options) {
                            des.forEach(function (de) {
                                var data = getCellForNode(des[de.v].selCells[0]),
                                    deInfo = vis.getDEInfo(data),
                                    de1 = deInfo && deInfo.de;
                                if (de1 && de1.t === $DET.LIST) {
                                    options.push(de);
                                }
                            });
                        },
                        action: function (options) {
                            var cells,
                                data,
                                deInfo;

                            if (options.length === 1) {
                                cells = des[options[0].v].selCells;
                                data = getCellForNode(cells[0]);
                                deInfo = vis.getDEInfo(data);

                                editGroup.addMenuItem(mstrmojo.desc(13395, "Edit Group..."), 'xt', function () {
                                    vis.selCells = cells;
                                    vis.derivedElementsEdit(getCellForNode(vis.selCells[0]), deInfo);
                                });
                                editGroup.addMenuItem(mstrmojo.desc(12195, "Ungroup"), 'xt', function () {
                                    vis.selCells = cells;
                                    vis.removeQuickDE(data);
                                });
                                renameDe.addMenuItem(mstrmojo.desc(13968, "Rename Group..."), 'xt', function () {
                                    vis.selCells = cells;
                                    vis.renameDEList(data);
                                });
                            }

                            if (options.length > 1) {
                                editGroup.addPopupMenuItem(mstrmojo.desc(13395, "Edit Group..."), vis.id, getSubMenuCallback(onEditGroup, options), 'xt');
                                editGroup.addPopupMenuItem(mstrmojo.desc(12195, "Ungroup"), vis.id, getSubMenuCallback(onUngroup, options), 'xt');
                                renameDe.addPopupMenuItem(mstrmojo.desc(13968, "Rename Group..."), vis.id, getSubMenuCallback(onRenameGroup, options), 'xt');
                            }
                        }
                    }, {
                        name: 'calculation',
                        setup: function (options) {
                            allAttributes.forEach(function (item, idx, arr) {
                                vis.selCells = arr[item.v].selCells;
                                var data = getCellForNode(vis.selCells[0]),
                                    deInfo = vis.getDEInfo(data),
                                    de = deInfo && deInfo.de;
                                if (!(de && de.t === $DET.RESIDUE) && isCalculationActionSupported(vis)) {
                                    options.push(item);
                                }
                            });
                        },
                        action: function (options) {
                            if (options.length === 1) {
                                createDe.addPopupMenuItem(mstrmojo.desc(5188, 'Calculation'), vis.id, function () {
                                    var local_tid = options[0].v,
                                        subMenu = new $MOJO.ui.menus.MenuConfig();
                                    vis.selCells = allAttributes[local_tid].selCells;
                                    subMenu.addRadioMenuGroup(null, onCalculation, getCalculationItems(vis, null, getCellName).items, 'checkMark', undefined, true);
                                    return subMenu;
                                }, 'xt');
                            }

                            if (options.length > 1) {
                                createDe.addPopupMenuItem(mstrmojo.desc(5188, 'Calculation'), vis.id, function () {
                                    return new mstrmojo.ui.menus.EditorConfig({
                                        cssClass: 'base-on-calculation-editor',
                                        data: {},
                                        contents: [
                                            {
                                                scriptClass: 'mstrmojo.Label',
                                                text: mstrmojo.desc(11859, 'Based on')
                                            },
                                            {
                                                scriptClass: 'mstrmojo.ui.Pulldown',
                                                alias: 'attrList',
                                                items: options,
                                                selectedIndex: 0, //$ARR.find(attributeOptions, 'v', 1), //default as 'off'
                                                onitemSelected: function (selectedItem) {
                                                    var tid = selectedItem.v;
                                                    vis.selCells = allAttributes[tid].selCells;
                                                    this.parent.checkList.set('items', []);
                                                    this.parent.checkList.set('items', getCalculationItems(vis, null, getCellName).items);
                                                    this.parent.data.set('valid', false);
                                                }
                                            },
                                            {
                                                scriptClass: 'mstrmojo.VisMenuList',
                                                alias: 'checkList'
                                            }
                                        ],
                                        bindings: {
                                            okEnabled: "this.valid",
                                            valid: function () {
                                                return this.data.valid;
                                            }
                                        },
                                        fnOk: function (data, editor) {
                                            applyCalculation(vis, getCellForNode(vis.selCells[0]), null, editor.checkList.selectedItem.v, false);
                                        }
                                    });
                                });
                            }
                        }
                    },
                    {
                        name: 'edit-calculation',
                        setup: function (options) {
                            des.forEach(function (de) {
                                var data = getCellForNode(des[de.v].selCells[0]),
                                    deInfo = vis.getDEInfo(data),
                                    de1 = deInfo && deInfo.de;
                                if (de1 && de1.t === $DET.CALCULATION) {
                                    options.push(de);
                                }
                            });
                        },
                        action: function (options) {
                            function getEditCalculationSubMenu() {
                                var local_tid = options[0].v;
                                vis.selCells = des[local_tid].selCells;
                                var data = getCellForNode(vis.selCells[0]),
                                    deInfo = vis.getDEInfo(data),
                                    de = deInfo && deInfo.de,
                                    ret = getCalculationItems(vis, de, getCellName),
                                    subMenu = new $MOJO.ui.menus.MenuConfig();

                                subMenu.addRadioMenuGroup(ret.selectedItem.value, onEditCalculation, ret.items, 'checkMark', undefined, true);
                                return subMenu;
                            }

                            if (options.length === 1) {
                                editCalculation.addPopupMenuItem(mstrmojo.desc(12196, 'Edit Calculation'), vis.id, getEditCalculationSubMenu, 'xt');
                                editCalculation.addMenuItem(mstrmojo.desc(12197, 'Delete Calculation'), 'xt', function () {
                                    var local_tid = options[0].v;
                                    vis.selCells = des[local_tid].selCells;
                                    var data = getCellForNode(vis.selCells[0]);
                                    vis.removeQuickDE(data);
                                });
                                renameDe.addMenuItem(mstrmojo.desc(13967, "Rename Calculation..."), 'xt', function () {
                                    var local_tid = options[0].v;
                                    vis.selCells = des[local_tid].selCells;
                                    var data = getCellForNode(vis.selCells[0]);
                                    vis.editDECalculation(data);
                                });
                            }

                            if (options.length > 1) {
                                editCalculation.addPopupMenuItem(mstrmojo.desc(12196, 'Edit Calculation'), vis.id, function () {
                                    return new mstrmojo.ui.menus.EditorConfig({
                                        data: {},
                                        contents: [
                                            {
                                                scriptClass: 'mstrmojo.Label',
                                                text: mstrmojo.desc(11859, 'Based on')
                                            },
                                            {
                                                scriptClass: 'mstrmojo.ui.Pulldown',
                                                alias: 'attrList',
                                                items: options,
                                                selectedIndex: 0, //$ARR.find(attributeOptions, 'v', 1), //default as 'off'
                                                onitemSelected: function (selectedItem) {
                                                    var tid = selectedItem.v;
                                                    vis.selCells = des[tid].selCells;
                                                    var data = getCellForNode(vis.selCells[0]),
                                                        deInfo = vis.getDEInfo(data),
                                                        de = deInfo && deInfo.de;

                                                    var ret = getCalculationItems(vis, de, getCellName);
                                                    this.parent.checkList.set('items', []);
                                                    this.parent.checkList.set('items', ret.items);
                                                    this.parent.checkList.set("selectedItem", ret.selectedItem);
                                                    this.parent.data.set('valid', false);
                                                }
                                            },
                                            {
                                                scriptClass: 'mstrmojo.VisMenuList',
                                                alias: 'checkList'
                                            }
                                        ],
                                        bindings: {
                                            okEnabled: "this.valid",
                                            valid: function () {
                                                return this.data.valid;
                                            }
                                        },
                                        fnOk: function (data, editor) {
                                            applyCalculation(vis, getCellForNode(vis.selCells[0]), null, editor.checkList.selectedItem.v, true); // null should be de
                                        }
                                    });
                                });
                                editCalculation.addPopupMenuItem(mstrmojo.desc(12197, 'Delete Calculation'), vis.id, getSubMenuCallback(onRemoveCalculation, options), 'xt');
                                renameDe.addPopupMenuItem(mstrmojo.desc(13967, "Rename Calculation..."), vis.id, getSubMenuCallback(onRenameCalculation, options), 'xt');
                            }
                        }
                    }
                ];

                // filter reduntant identities, get unique identities
                uniqIdnts = getUniqueIdentities(selection);

                // classify attribute identity & derived element identity
                uniqIdnts.forEach(function (identity) {
                    var node = makeNode(identity),
                        cell = getCellForNode(node),
                        tmp,
                        tid,
                        n;

                    if (!vis.model.supportsViewFilterActions(cell.tid)) { // the condition is the same, so just use the same function
                        return;
                    }

                    tmp = cell.dei === undefined ? attrs : des;
                    tid = cell.tid;
                    n = vis.model.getObjectInfo(tid).n;

                    if (tmp[tid] === undefined) {
                        tmp[tid] = {};
                        tmp[tid].selCells = [];
                        tmp.push({
                            n: n,
                            v: tid,
                            text: n,
                            value: tid
                        });
                    }
                    tmp[tid].selCells.push(node);

                    if (allAttributes[tid] === undefined) {
                        allAttributes[tid] = {};
                        allAttributes[tid].selCells = [];
                        allAttributes.push({
                            n: n,
                            v: tid,
                            text: n,
                            value: tid
                        });
                    }
                    allAttributes[tid].selCells.push(node);
                });
                var visStyle = this.getPropertyByPath(vis, 'model.data.visName') || this.getPropertyByPath(vis, 'model.data.vis.vn');
                if (visStyle === "VIHeatMapVisualizationStyle") {
                    caseDefinitions.splice(2,2);
                }

                process(caseDefinitions);

                return {
                    createDe: createDe,
                    editGroup: editGroup,
                    editCalculation: editCalculation,
                    renameDe: renameDe
                };
            },

            /**
             * Construct group context menu items for attribute element
             * @param vis widget instance
             * @param data
             * @param params additional parameters
             * @param params.skipSingleAttrCheck do not call isSingleAttrSelection
             * @param params.selection selection in widget
             * @param params.fnCellName function to get cell name
             */
            getGroupAndCalculationContextMenu: function (vis, data, params) {
                var xtab = vis,
                    sameCol = params.skipSingleAttrCheck || xtab.isSingleAttrSelection(),
                    isValueCellClick = false,
                    isSingleSelection = xtab.isSingleSelection(),
                    deInfo = xtab.getDEInfo(data),
                    deObject = deInfo && deInfo.deObject,
                    de = deInfo && deInfo.de,
                    othersDE = deObject && xtab.getOthersDEInfo(deObject),
                    sel = xtab.getSelections(),
                    canDoCalculation = true,
                    getCellName = params.fnCellName,
                    visName = this.getPropertyByPath(xtab, 'model.data.visName') || this.getPropertyByPath(xtab, 'model.data.vis.vn');

                var createDe = new $MOJO.ui.menus.MenuConfig(),
                    editGroup = new $MOJO.ui.menus.MenuConfig(),
                    editCalculation = new $MOJO.ui.menus.MenuConfig(),
                    renameDe = new $MOJO.ui.menus.MenuConfig();

                xtab.selCells = params.selection;

                if (vis.model.supportsViewFilterActions(data.tid)) { // the condition is the same, so just use the same function

                    if ((isValueCellClick || sameCol) && isActionSupported(data, ACTION_GROUP) && isGroupActionSupported(xtab)) {
                        createDe.addMenuItem(mstrmojo.desc(1911, 'Group'), 'xt', function () {
                            vis.derivedElementGroup(data);
                        });
                    }

                    if (isSingleSelection && de && de.t === $DET.LIST) {
                        editGroup.addMenuItem(mstrmojo.desc(13395, "Edit Group..."), 'xt', function () {
                            vis.derivedElementsEdit(data, deInfo);
                        });
                        editGroup.addMenuItem(mstrmojo.desc(12195, "Ungroup"), 'xt', function () {
                            vis.removeQuickDE(data);
                        });
                        renameDe.addMenuItem(mstrmojo.desc(13968, "Rename Group..."), 'xt', function () {
                            vis.renameDEList(data);
                        });
                    }

                    var onNewSelectionChange = function (newValue) {
                            applyCalculation(xtab, data, de, newValue, false);
                        },
                        onEditSelectionChange = function (newValue) {
                            applyCalculation(xtab, data, de, newValue, true);
                        };

                    if (othersDE && !isSingleSelection && sameCol) { // make sure others DE is not among the selected
                        $ARR.forEach(sel, function (es) {
                            if (es[0] && es[0].eid.indexOf(othersDE.id) > -1) {
                                canDoCalculation = false;
                                return false;
                            }
                        });
                    }

                    if (visName !== 'VIHeatMapVisualizationStyle' && !(isSingleSelection && de && de.t === $DET.RESIDUE) && (isValueCellClick || sameCol) &&
                        isActionSupported(data, ACTION_CALCULATION) && isCalculationActionSupported(xtab)) {
                        var getNewCalculationSubMenu = function () {
                            var subMenu = new $MOJO.ui.menus.MenuConfig(),
                                calItems = getCalculationItems(xtab, null, getCellName);
                            subMenu.addRadioMenuGroup(null, onNewSelectionChange, calItems.items, 'checkMark', undefined, true);
                            return subMenu;
                        };
                        createDe.addPopupMenuItem(mstrmojo.desc(5188, 'Calculation'), this.id, getNewCalculationSubMenu, 'xt');
                    }

                    if (isSingleSelection && de && de.t === $DET.CALCULATION) {
                        var getEditCalculationSubMenu = function () {
                            var subMenu = new $MOJO.ui.menus.MenuConfig(),
                                calItems = getCalculationItems(xtab, de, getCellName);
                            subMenu.addRadioMenuGroup(calItems.selectedItem.value, onEditSelectionChange, calItems.items, 'checkMark', undefined, true);
                            return subMenu;
                        };

                        editCalculation.addPopupMenuItem(mstrmojo.desc(12196, 'Edit Calculation'), this.id, getEditCalculationSubMenu, 'xt');
                        editCalculation.addMenuItem(mstrmojo.desc(12197, 'Delete Calculation'), 'xt', function () {
                            vis.removeQuickDE(data);
                        });
                        renameDe.addMenuItem(mstrmojo.desc(13967, "Rename Calculation..."), 'xt', function () {
                            vis.editDECalculation(data);
                        });
                    }
                }
                return {
                    createDe: createDe,
                    editGroup: editGroup,
                    editCalculation: editCalculation,
                    renameDe: renameDe
                };
            },

            isHostedPopupNode: function (el, attr, inclusive, elLimit) {
                var node = inclusive ? el : el && el.parentNode;
                while (node && (node !== elLimit)) {
                    var v = node.getAttribute && node.getAttribute(attr);
                    if (v !== null && v.indexOf('mstrmojo-popup-widget-hosted') >= 0) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            },

            applyStyle2Legend: function (styles, domNode, domLegend) {
                var key,
                    fontStyle = {},
                    containerStyle = {};
                for (key in styles) {
                    if (key.indexOf('font') >= 0 || key.indexOf('color') >= 0 || key.indexOf('textDecoration') >= 0) {
                        fontStyle[key] = styles[key];
                    } else {
                        containerStyle[key] = styles[key];
                    }
                }
                if (domNode) {
                    domNode.style.background = '';
                    this.applyStyles2DomNode(domNode, containerStyle);
                }
                if (domLegend) {
                    this.applyStyles2DomNode(domLegend, fontStyle);
                }
            },

            /**
             * Merge configurations into one MenuConfig
             * @param configs {Object} Menu item groups, key is group name
             * @param order {Array.<{name: {String}, noSeparator: {Boolean}}>} item group order description
             */
            mergeMenuConfigs: function mergeMenuConfigs(configs, order) {
                function merge(dest, src, noSeparator) {
                    if (!src) {
                        return;
                    }

                    if (!noSeparator && dest.hasMenuItems() && src.hasMenuItems()) {
                        dest.addSeparator();
                    }

                    if (src.hasMenuItems()) {
                        dest.absorbMenuItems(src);
                    }
                }

                return order.reduce(function (cfg, itemGroup) {
                    merge(cfg, configs[itemGroup.name], itemGroup.noSeparator);
                    return cfg;
                }, new mstrmojo.ui.menus.MenuConfig());
            },

            /**
             * Add a wheel event listener to the dom node in a cross browser way.
             * Modified from https://developer.mozilla.org/en-US/docs/Web/Events/wheel
             * @param {HTMLElement} elem the dom node to attach the wheel event
             * @param {Function} callback the event handler
             * @param {Boolean} useCapture true for capture, false for bubbling
             */
            addWheelListener: (function () {
                var $DOM = mstrmojo.dom,
                    addEventListener = $DOM.attachEvent,
                    preventDefault = $DOM.preventDefault,
                    supportedEvent;

                function addWheelListener(elem, eventName, callback, useCapture) {
                    var cb = (supportedEvent === "wheel") ? callback : function (originalEvent) {
                        if (!originalEvent) {
                            originalEvent = window.event;
                        }

                        // create a normalized event object
                        var event = {
                                originalEvent: originalEvent,
                                target: originalEvent.target || originalEvent.srcElement,
                                type: "wheel",
                                deltaMode: (originalEvent.deltaMode !== undefined ? originalEvent.deltaMode : 1),
                                deltaX: 0,
                                deltaZ: 0,
                                preventDefault: function () {
                                    preventDefault(window, originalEvent);
                                }
                            },
                            me = this;

                        // calculate deltaY (and deltaX) according to the event
                        if (supportedEvent === "mousewheel") {
                            event.deltaY = -originalEvent.wheelDelta;

                            // Webkit also support wheelDeltaX
                            if (originalEvent.wheelDeltaX !== undefined) {
                                event.deltaX = -originalEvent.wheelDeltaX;
                            }
                        } else { // DOMMouseScroll
                            event.deltaY = originalEvent.detail;
                        }

                        return callback.call(me, event);
                    };

                    return addEventListener(elem, eventName, cb, useCapture);
                }

                // detect available wheel event
                if (Object.prototype.hasOwnProperty.call(document.createElement('div'), 'onwheel')) {
                    // Modern browsers support "wheel"
                    supportedEvent = 'wheel';
                } else {
                    // Webkit and IE support at least "mousewheel"
                    // let's assume that remaining browsers are older Firefox
                    supportedEvent = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
                }

                return function (elem, callback, useCapture) {
                    return addWheelListener(elem, supportedEvent, callback, useCapture);
                };
            }()),

            /**
             * Check if val is near zero
             * @param val The value to check
             * @param digits epsilon precision
             * @returns {boolean} true if `val' if within the range (-epsilon, epsilon), false otherwise.
             */
            isNearZero: function (val, digits) {
                digits = digits || 5;
                var epsilon = 1 / Math.pow(10, digits);
                return (Math.abs(val) < epsilon);
            },

            hasMergedRowCells: function (gridData) {
                /* jshint unused: false */

                //TODO: do we need to check it first or try to parse the data first until we get an error?
                //                var prop = (gridData && gridData.gsi && gridData.gsi.prop) || {};
                //                return prop.rows && prop.rows.mg === '-1';
                return false;
            },

            getMockUpThresholds: function (metricId, metricName) {
                var threshold = [{
                    "tid": 1,
                    "n": "threshold 0",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#cc2525", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "10%", "dtp": 5}],
                            "fn": 2,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 1,
                    "flr": 0,
                    "ceil": 10
                }, {
                    "tid": 2,
                    "n": "threshold 1",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#e34b4b", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "10%", "dtp": 5}, {"v": "30%", "dtp": 5}],
                            "fn": 3,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 3,
                    "flr": 10,
                    "ceil": 30
                }, {
                    "tid": 3,
                    "n": "threshold 2",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#e97d7d", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "30%", "dtp": 5}, {"v": "50%", "dtp": 5}],
                            "fn": 3,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 3,
                    "flr": 30,
                    "ceil": 50
                }, {
                    "tid": 4,
                    "n": "threshold 3",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#79d479", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "50%", "dtp": 5}, {"v": "70%", "dtp": 5}],
                            "fn": 3,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 3,
                    "flr": 50,
                    "ceil": 70
                }, {
                    "tid": 5,
                    "n": "threshold 4",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#57ba57", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "70%", "dtp": 5}, {"v": "90%", "dtp": 5}],
                            "fn": 3,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 3,
                    "flr": 70,
                    "ceil": 90
                }, {
                    "tid": 6,
                    "n": "threshold 5",
                    "scope": 1,
                    "rtp": 2,
                    "rtxt": "",
                    "fmt": {"bc": "#2ca02c", "bgs": 0},
                    "expr": {
                        "et": 14,
                        "nds": [{
                            "et": 10,
                            "dmt": 7,
                            "m": {"did": "4C051DB611D3E877C000B3B2D86C964F", "n": "Profit"},
                            "cs": [{"v": "90%", "dtp": 5}],
                            "fn": 5,
                            "fnt": 3
                        }
                        ],
                        "fn": 19
                    },
                    "ttp": 1,
                    "flr": 90,
                    "ceil": 100
                }
                ];
                $ARR.forEach(threshold, function (t) {
                    var m = t.expr.nds[0].m;
                    m.did = metricId;
                    m.n = metricName;
                });
                var ret = {};
                ret[metricId] = threshold;
                return ret;
            },

            /**
             * Convert Photoshop pt value to CSS pt value
             * @param {string} psPt
             * @param {Function} round function to apply after convertion
             * @returns {string}
             */
            psPt2CssPt: function (psPt, round) {
                var v = parseInt(psPt, 10) * 0.75;
                if (round instanceof Function) {
                    v = round(v);
                }
                return v + 'pt';
            },

            /**
             * Capture event once
             * @param event event name
             * @param fn event handler
             * @param thisArg this argument for fn
             * @param el DOM element ot attach the event
             * @param extras extra parameters passed to event handler
             */
            captureEventOnce: function (event, fn, thisArg, el, extras) {
                function handler(evt) {
                    fn.call(thisArg, $HAS_MARKUP.newDomEvent(event, window, evt || window.event), extras);
                    $DOM.detachEvent(el, event, handler);
                }

                extras = extras || {};
                el = el || document;
                $DOM.attachEvent(el, event, handler);
            },

            /**
             @param obj, nested object
             @param path 'foo.bar.quux'
             @param defval default value if not found
             */
            getPropertyByPath: function (obj, path, defval) {
                var keys,
                    found;

                if (typeof path !== 'string') {
                    return defval;
                }

                keys = path.split('.');
                found = keys.every(function (k) {
                    var v = obj[k];
                    if (v !== undefined) {
                        obj = v;
                        return true;
                    }
                    return false;
                });

                return found ? obj : defval;
            },

            /**
             * Merge several hashes, shadow copy.
             */
            mergeHashes: function () {
                return Array.prototype.slice.apply(arguments).reduce(function (dest, src) {
                    if (src) {
                        Object.keys(src).forEach(function (k) {
                            dest[k] = src[k];
                        });
                    }
                    return dest;
                }, {});
            },

            /**
             * Enables (or disables) the controls collection.
             *
             * @param {Array.<mstrmojo.Widget> | mstrmojo.Widget} controls The controls to enable (or disable).
             * @param {boolean} [enabled=false] The enabled state to apply.
             */
            toggleControlEnabled: function (controls, enabled) {
                [].concat(controls).forEach(function (ctrl) {
                    ctrl.set('enabled', !!enabled);
                });
            },

            /**
             * Return the first index that predicate returns true for the element at that index
             * @param arr {Array.<*>} Array to search
             * @param predicate {Function} A function that tests for some condition involving its argument
             * and returns false if the condition is false, or true if the condition is true
             * @param idx {Number} Optional start index, defaults to zero
             * @returns {Number} index of the first element that predicate returns true, -1 if no such element
             */
            findInArray: function (arr, predicate, idx) {
                var notFound = -1,
                    i,
                    len;

                if (!Array.isArray(arr)) {
                    return notFound;
                }

                for (i = idx === undefined ? 0 : idx, len = arr.length; i < len; i += 1) {
                    if (predicate(arr[i])) {
                        return i;
                    }
                }
                return notFound;
            },

            /**
             * A more powerful version of mstrmojo.array.distinct
             * @param arr {Array<*>} array
             * @param equals {Function} Equality function defined on elements of arr
             * @returns {Array.<*>} Array with unique elements
             */
            arrayUnique: function (arr, equals) {
                if (!Array.isArray(arr)) {
                    return arr;
                }

                return arr.filter(function (v, i) {
                    return $UTIL.findInArray(arr, function (u) {
                            return equals(v, u);
                        }, i + 1) === -1;
                });
            },

            /**
             * Return all numbers in range [low, high) with step
             * @param low {Number} low index
             * @param high {Number} high index
             * @param step {Number} Optional step, defaults to 1
             * @returns {Array.<Number>}
             */
            range: function (low, high, step) {
                step = step || 1;

                var i,
                    numbers = [];

                for (i = low; i !== high; i += step) {
                    numbers.push(i);
                }
                return numbers;
            },

            drawDashLine: function drawDashLine(ctx, x1, y1, x2, y2, dashW, spaceW) {
                var isVertical = (x1 === x2),
                    i;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                if (isVertical) {
                    i = 0;
                    y1 += dashW;
                    while (y1 <= y2) {
                        if (i % 2 === 0) {
                            ctx.lineTo(x1, y1);
                            y1 += spaceW;
                        } else {
                            ctx.moveTo(x1, y1);
                            y1 += dashW;
                        }
                        i++;
                    }
                    if (i % 2 === 0) {
                        ctx.lineTo(x2, y2);
                    }
                } else {
                    i = 0;
                    x1 += dashW;
                    while (x1 <= x2) {
                        if (i % 2 === 0) {
                            ctx.lineTo(x1, y1);
                            x1 += spaceW;
                        } else {
                            ctx.moveTo(x1, y1);
                            x1 += dashW;
                        }
                        i++;
                    }
                    if (i % 2 === 0) {
                        ctx.lineTo(x2, y2);
                    }
                }
                ctx.stroke();
            },

            /**
             * Create an array containing n items, the value of all items are value
             * @param value {*} Value of array item
             * @param n {Integer} Number of repeats
             * @returns {Array.<*>} An array with value repeated n times
             */
            repeat: function (value, n) {
                var arr = [],
                    i;

                n = Math.max(0, n);
                for (i = 0; i < n; i += 1) {
                    arr[i] = value;
                }
                return arr;
            },

            /**
             * Check if obj is an hierarchy object
             * @param obj {Object}
             * @returns {boolean}
             */
            isHierarchyObject: function (obj) {
                return (obj && obj.t) === ObjectType.DssTypeDimension;
            },

            /**
             * Select section in property panel
             * @param widget {VisBase} widget instance
             * @param section {*} Selected section in property panel
             */
            selectPropertyPanel: function (widget, section) {
                mstrApp.rootCtrl.docCtrl.selectViPanel('propertiesPanel');
                widget.getDocModel().selectVIUnit(widget.parent.id, true);
                var edtModel = widget.edtModel;
                if (edtModel) {
                    edtModel.selectTargetByValue(section);
                }
            },

            /**
             * Returns a new list by plucking the same named property off all objects in the list supplied.
             * @param list {Array.<Object>} the array to consider
             * @param key {String} the key name to pluck off
             * @returns {Array.<*>} A new array with values for key
             */
            pluck: function (list, key) {
                if (!$ARR.isArray(list)) {
                    return list;
                }

                return list.map(function (item) {
                    return item && item[key];
                });
            },

            /**
             * Returns a partial copy of an object containing only the keys specified.
             * @param obj {Object} the object to copy from
             * @param keys {Array<String>} array of property names to copy onto the new object
             * @returns {Object} A new object with only properties in keys
             */
            pick: function (obj, keys) {
                return keys.reduce(function (copy, k) {
                    copy[k] = obj[k];
                    return copy;
                }, {});
            },

            /**
             * Check if the color have been set by user
             * @param widget {VisBase} widget instance
             * @param comb {Array.<*>} color by identity
             * @returns {boolean} true if use has set it before, otherwise false
             */
            isColorManuallySet: function (widget, comb) {
                var colorby = getColorBy(widget, comb);
                if (colorby) {
                    return colorby.isManual;
                }
            },

            /**
             * Get the color by color
             * @param widget {VisBase} widget instance
             * @param comb {Array.<*>} color by identity
             * @returns {Number} color by color
             */
            getCombColor: function (widget, comb) {
                var colorby = getColorBy(widget, comb);
                if (colorby) {
                    return colorby.color;
                }
            },

            /**
             * Set the showAutomatic property on color picker
             * @param colorPicker {mstrmojo.ui.editors.controls.FillConfigGroup} fill config group instance
             * @param show {boolean} whether to show automatic button
             */
            setColorPickerShowAutomatic: function (colorPicker, show) {
                colorPicker.children[0].fillColor.colorPicker.showAutomatic = show;
            },

            /**
             * Constructs a callback for CharacterGroup.onGroupValueChange
             * @param observableModel {mstrmojo.netviz.ObservableModel|Function} the model to trigger event inside widget
             * @returns {Function}
             */
            getCharGroupValueChangeCb: function (observableModel) {
                /**
                 * Toggle the specified bit in font style mask
                 * @param styleMask {Number} Current style mask
                 * @param bit {String} the name of bit to toggle
                 * @returns {Number} A new style mask
                 */
                var toggleFontStyleBit = (function () {
                    var BIT_TO_MASK_VALUE = {};
                    BIT_TO_MASK_VALUE[ENUM_PROPERTY_NAMES.FONT_WEIGHT] = ENUM_FONT_STYLE.FS_BOLD;
                    BIT_TO_MASK_VALUE[ENUM_PROPERTY_NAMES.FONT_STYLE] = ENUM_FONT_STYLE.FS_ITALIC;
                    BIT_TO_MASK_VALUE[ENUM_PROPERTY_NAMES.UNDERLINE] = ENUM_FONT_STYLE.FS_UNDERLINE;
                    BIT_TO_MASK_VALUE[ENUM_PROPERTY_NAMES.LINE_THROUGH] = ENUM_FONT_STYLE.FS_STRIKETHROUGH;

                    return function (styleMask, bit) {
                        return styleMask ^ BIT_TO_MASK_VALUE[bit];
                    };
                }());

                return function (ctrl, newVal) {
                    // do NOT cache this value in closure, the model reference may break if the widget is refreshed
                    if (observableModel instanceof Function) {
                        observableModel = observableModel();
                    }

                    if (!observableModel) {
                        return;
                    }

                    switch (ctrl) {
                    case ENUM_PROPERTY_NAMES.COLOR:
                        observableModel.fontColor.fill.value.setValue(newVal); // CSS string
                        break;

                    case ENUM_PROPERTY_NAMES.FONT_SIZE:
                        observableModel.fontSize.setValue(newVal);
                        break;

                    case ENUM_PROPERTY_NAMES.FONT_FAMILY:
                        observableModel.fontFamily.setValue(newVal);
                        break;

                    case ENUM_PROPERTY_NAMES.FONT_WEIGHT:
                    case ENUM_PROPERTY_NAMES.FONT_STYLE:
                    case ENUM_PROPERTY_NAMES.UNDERLINE:
                    case ENUM_PROPERTY_NAMES.LINE_THROUGH:
                        // toggle bit
                        observableModel.fontStyle.setValue(toggleFontStyleBit(observableModel.fontStyle.getValue(), ctrl));
                        break;

                    }
                };
            },

            getMetricsInDropZone: getMetricsInDropZone,

            addLegendFontChangeListeners: function (edtModel, callback) {
                var modelNames = ['lgdFntClr', 'lgdFntSz', 'lgdFntFml', 'lgdFntStyle'];
                addObservableModelListeners(modelNames, edtModel, callback);
            },

            addLegendBackgroundChangeListeners: function (edtModel, callback) {
                var modelNames = ['lgdBgFillClr', 'lgdBgFillTrans'];
                addObservableModelListeners(modelNames, edtModel, callback);
            },

            isValidDropZone: function (dz) {
                if (dz === undefined) {
                    return false;
                }

                // visProp is always there in RSD, remove this noise
                var keys = Object.keys(dz).filter(function (k) {
                    return k !== 'visProp';
                });
                var dzInfo = $HASH.copyProps(keys, dz);

                return dz && !$HASH.equals(dzInfo, {});
            },

            /**
             * Find all the attributes that are not used in template but in data set.
             * @param widget {Widget} widget instance
             * @returns {Array.<Object>} The drill candidates.
             */
            getDrillCandidates: function (widget) {
                var modelData = widget.modelData,
                    xtabModel = widget.model,
                    datasets = xtabModel.docModel.datasets,
                    gts = modelData.gts,
                    datasetId = modelData.datasetId,
                    dataset = datasets[datasetId],
                    atts = dataset.att || [];


                // exclude attributes in template and attributes that are hidden from dataset
                return atts.filter(function (attribute) {
                    var did = attribute.did,
                        rowUnits = gts.row || [],
                        colUnits = gts.col || [];

                    return rowUnits.concat(colUnits).every(function (unit) {
                        return unit.id !== did && attribute.hide !== true;
                    });
                });
            },

            /**
             * Menu callback for adding drill to attribute sub menu
             * @param widget {VisBase} Widget instance
             * @param callback {Function} Callback for submenu
             * @param ctx {Object} callback context
             * @returns {Function}
             */
            getDrillMenuItemsCallback: function (widget, callback, ctx) {
                return function () {
                    var candidates = $UTIL.getDrillCandidates(widget),
                        subMenu = new mstrmojo.ui.menus.MenuConfig({
                            supportsScroll: true,
                            maxHeight: 350
                        });

                    candidates.forEach(function (unit) {
                        subMenu.addMenuItem(unit.n, 'xt', callback, $HASH.copy(ctx, {'drillUnit': unit}));
                    });

                    return subMenu;
                };
            },

            /**
             * Execute the drill command
             * @param widget {VisBase} Widget instance
             * @param drillUnit {Object} The drill to attribute
             * @param updateTemplateCallback {Function} callback for update template, e.g. add and remove attribute in drop zone
             * @param params {Object} extra parameters
             */
            doDrill: function (widget, drillUnit, updateTemplateCallback, params) {
                var me = widget;

                function cmdMgr(me) {
                    return me.model.controller.cmdMgr;
                }

                /**
                 * Returns a callback object to update the toolbar of the viz box that the xtab is contained within.
                 *
                 * @returns {mstrmojo.XhrCallbackType}
                 */
                function getToolbarUpdateCallback() {
                    return {
                        success: function success() {
                            $UTIL.visPrint("reaise");
                            this.raiseEvent({
                                name: 'regenerateToolbar'
                            });
                        }.bind(this)
                    };
                }

                var model = me.model,
                    docModel = (me.getDocModel && me.getDocModel()) || me.model.docModel,
                    dataService = docModel.getDataService(),
                    update = dataService.newUpdate();

                // According to Swati, the dafault behavior should be the same with regular document
                var keepParent = true;
                if (docModel.prefs && docModel.prefs.rtprnt) {
                    keepParent = parseInt(docModel.prefs.rtprnt, 10) === 1;
                } else if (model.xtab.defn.tkp !== undefined) {//report level
                    keepParent = parseInt(model.xtab.defn.tkp, 10) === -1;
                }
                params = params || {};
                params.keepParent = keepParent;

                // drop zone actions
                var updateTemplateActions = updateTemplateCallback.call(widget, drillUnit, params);
                var dzModel = me.zonesModel,
                    naiveCallback = dzModel.getUpdateCallback(),
                    controller = me.model.controller || docModel.controller,
                    callback = controller._getXtabCallback(me);
                update.add(updateTemplateActions, $WRAP(naiveCallback, callback));

                // slicing actions
                var selectorData = model.getSelectorDataFromViewFilter(me.model.data.vfexpr).concat({
                        keepOnly: true,
                        data: me.getSelections()
                    }),
                    action = docModel.getKeepOnlyOrExcludeAction(me.k, selectorData);

                update.add(action, getToolbarUpdateCallback.call(me));

                cmdMgr(me).execute({
                    execute: function execute() {
                        this.submitUpdate(update);
                    },
                    urInfo: {
                        // If a callback is provided - use in the undo redo callbacks.
                        callback: update.callback
                    }
                });
            },

            /**
             * Determines whether a string begins with the characters of another string, returning true or false as appropriate.
             * @param s {String} The string to check
             * @param searchStr {String} The characters to be searched for at the start of this string.
             * @param position {Number} Optional. The position in this string at which to begin searching for searchString; defaults to 0.
             * @returns {boolean} True if s starts with searchStr, false otherwise.
             */
            strStartsWith: function (s, searchStr, position) {
                position = position || 0;
                return s.lastIndexOf(searchStr, position) === position;
            },

            /**
             * Changes widget background color. This property is owned by UnitContainer.
             * NOTE: If you need to sync the background color to widget when changed from property panel,
             * do not call this method in onBEMFormatChange if the background color has already changed
             * since you cannot nest server write requests.
             * @param widget {Widget} widget instance
             * @param newValue {String} new background color
             * @param oldValue {String} old background color
             */
            changeWidgetBackground: function (widget, newValue, oldValue) {
                var container = widget.parent;

                if (container && newValue !== oldValue) {
                    container.changeUnitFormats(false, 1, widget.getFormats(), ENUM_PROPERTY_NAMES.BACKGROUND_COLOR, newValue, oldValue);

                    // this event must be raised if we changed the color
                    container.raiseEvent({
                        name: 'BEMFormatChange',
                        propertyName: ENUM_PROPERTY_NAMES.BACKGROUND_COLOR,
                        value: newValue,
                        isTitle: false
                    });
                }
            },

            /**
             * Translate grid error(model.data.eg, and model.data.egt) into Web erro messages.
             * AE errors are not translated.
             * @param msg {String} Grid error message from backend
             * @param type {Number} Grid error message type from backend
             * @returns {{msg: String, type: Number}}
             */
            translateGridError: function (msg, type) {
                if (type === undefined) {
                    type = ERROR_TYPE.AE_ERROR;
                }

                if (type === ERROR_TYPE.EMPTY_DATA) {
                    msg = mstrmojo.desc(12093, "Filter excludes all data");
                }

                if (type === ERROR_TYPE.NO_DATASET || type === ERROR_TYPE.NO_TEMPLATE_UNIT) {
                    msg = mstrmojo.desc(11668, 'Drag objects here.');
                }

                if (!msg) {
                    msg = mstrmojo.desc(13687, 'Unknown error');
                }

                return {
                    msg: msg,
                    type: type
                };
            },

            /**
             * Check if the given metric has valid values.
             * We use min and max defined in gsi.mx to check. Possibly not reliable.
             * @param widget {VisBase} Widget instance
             * @param metricIndex {Number} Metric index
             * @returns {boolean} true if metric has valid values, false otherwise
             */
            hasValidValueInMetric: function (widget, metricIndex) {
                var metrics = $UTIL.getPropertyByPath(widget, 'model.data.gsi.mx');
                if (metrics === undefined || metrics.length <= metricIndex || metricIndex < 0) {
                    return false;
                }

                var mx = metrics[metricIndex];
                return ['min', 'max'].every(function (key) {
                    var val = mx[key];
                    return val !== undefined && val !== null && val !== '';
                });
            },

            /**
             * Render error message in RSD
             * @param widget {VisBase} widget instance
             * @param msg {String} error message to render
             * @param events {Array.<String>} events widget listens to
             */
            renderWidgetErrorRSD: function (widget, msg, events) {
                var div = document.createElement('div');

                var innerHTML = '<div style="display: table; height: 100%; width: 100%; background-color:#F5F5F2; border: solid 1px #A7A7A7; box-sizing: border-box;">' +
                    '<div style="display: table-cell; vertical-align: middle; text-align: center; color: #000000; font-size: 14pt;">' +
                    msg +
                    '</div>' +
                    '</div>';

                div.innerHTML = innerHTML;
                div = div.firstChild;

                var w = widget.width,
                    h = widget.height;
                if (w !== undefined) {
                    div.style.width = w + 'px';
                }
                if (h !== undefined) {
                    div.style.height = h + 'px';
                }

                var dom = widget.domNode;
                if (dom) {
                    // detach events
                    events.forEach(function (evt) {
                        dom['on' + evt] = undefined;
                    });

                    // remove all children
                    while (dom.firstChild) {
                        dom.removeChild(dom.firstChild);
                    }

                    // do not replace current dom, RSD container will not remove our error message when re-rendering
                    dom.appendChild(div);
                } else {
                    widget.parent.domNode.appendChild(div);
                }
            },

            visPrint: function () {
                var enableInVis = mstrmojo.plugins.VisMicroChart.VisUtility.enableInVis;
                if (enableInVis && mstr_profile.enabled && console) {
                    Function.prototype.apply.call(console.log, console, arguments);
                }
            },

            hasCGorCon: function (vis) {
                var datasetId = vis.model.data.datasetId || "",
                    dataset = datasetId ?  $DATASET_MENU_UTILS.getDatasetFromId(vis.model.docModel.datasets, datasetId) : null;
                return $DATASET_MENU_UTILS.hasCGorCon(dataset);
            }
        }
    );

    // to enable/disable debug log in vis, set mstrmojo.VisUtility.enableInVis to be true/false in console
    mstrmojo.plugins.VisMicroChart.VisUtility.enableInVis = false;
    var $UTIL = mstrmojo.plugins.VisMicroChart.VisUtility;
}());//@ sourceURL=VisUtility.js