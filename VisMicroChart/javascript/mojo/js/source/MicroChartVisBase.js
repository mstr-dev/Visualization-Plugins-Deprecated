/**
 * Created by fniu on 9/10/2015.
 */
(function () {

    mstrmojo.requiresCls("mstrmojo.CustomVisBase", "mstrmojo.DocPortlet");

    var FMTS = {'top':'top',
            'left':'left',
            'z-index':'zIndex',
            'width':'width',
            'height':'height'},
        prevWidth,
        prevHeight;


    /**
     * A visualization control.
     *
     * @class
     * @extends mstrmojo.CustomVisBase
     * @mixes mstrmojo._HasLayout
     */
    mstrmojo.plugins.VisMicroChart.MicroChartVisBase = mstrmojo.declare(

        // superclass
        mstrmojo.CustomVisBase,

        // mixins
        null,

        /**
         * @lends mstrmojo.plugins.VisMicroChart.MicroChartVisBase.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.VisMicroChart.MicroChartVisBase',

            cssClass : 'MicroChart',

            offsetTop: 0,
            offsetLeft: 0,

            isAndroid: false,

            reRenderOnDimensionChg: true,

            /**
             * Used by Android ResultSetController
             * @returns {boolean}
             */
            isVis: function () {
                return true;
            },

            setModel: function setModel(model) {

                this._super(model);
                this.set('model', model);
                // this.set('model', model)

                // this is called in android
                /* if (model.data) {
                 this.set('model', model.data);
                 }*/
                //this.xtabModel = model;
                this.xtabModel = model.data;

                // Make request for page by data - used by Android
                if (this.controller && typeof (this.controller.getPageByTree) != 'undefined') {
                    this.controller.getPageByTree(false);
                }
            },

            destroy: function destroy() {
                this._super();

                var xtab = this.xtabModel;
                if (xtab && xtab.destroy) {
                    xtab.destroy();
                    //delete this.xtabModel, as to remove the circular reference
                    delete this.xtabModel;
                }

            },

            setDimensions: function setDimensions(h, w) {
                var dimensionChanged = this._super(h, w);
                if (dimensionChanged && this.hasRendered && this.reRenderOnDimensionChg) {
                    this.reRender();
                }
                return dimensionChanged;
            },

            buildRendering: function bldRn() {

                // do not need this as the DocPorlet will remove this info
                if (this.parent instanceof mstrmojo.DocPortlet) { // In this case, the offset is handled by its parent
                    delete this.left;
                    delete this.top;
                    this.height = this.fmts && this.fmts.height;
                }

                // Call the inherited method to do the DOM construction.
                this._super();
            },

            //override renderVisualization of super
            renderVisualization: function renderVisualization() {

            },

            postBuildRendering: function postBR() {
                prevWidth = this.width;
                prevHeight = this.height;

                this.adjustWidgetOffsets();

                //call super to have children rendered
                this._super();
            },

            adjustWidgetOffsets: function adjustWidgetOffsets() {
                var dn = this.domNode,
                    offset = {
                        top: 0,
                        left: 0
                    };

                if (typeof(mstr) != 'undefined') {
                    offset.top = mstr.utils.BoxModel.getElementSumOffsetTop(dn);
                    offset.left = mstr.utils.BoxModel.getElementSumOffsetLeft(dn);
                } else if (typeof(mstrmojo) != 'undefined') {
                    offset = mstrmojo.boxmodel.offset(dn);
                }

                this.offsetTop = offset.top;
                this.offsetLeft = offset.left;
            },

            update: function update(node) {

                // NOTE: Do not call _super() here; this implementation replaces the base class'

                node = node || this.node;
                if (node) { // called from docs

                    var nodeData = node.data;

                    if (nodeData) {
                        this.model.set('data', nodeData);

                        //TQMS:702824 ,since during partial update the tks is not sent, we will use the 'cgb' to retrieve
                        //tks and update the grid json otherwise , the selections wont work in express mode
                        if (this.xtabModel && this.xtabModel.set) {
                            this.xtabModel.set('data', nodeData);
                        }
                        //this.model = node.data;
                        if (nodeData.layoutModel) {
                            this.layoutModel = nodeData.layoutModel;
                        }
                        if (nodeData.layoutNode) {
                            this.layoutNode = nodeData.layoutNode;
                        }

                        // Pull extra properties from extProps to the root class level.
                        mstrmojo.hash.copy(nodeData.extProps, this);
                    }

                    var controller = this.controller,
                        view = controller.view,
                        currLayout = (view.hasRendered && view.getCurrentLayout && view.getCurrentLayout());

                    if(controller.view.fullScreenInfoWindow && ( currLayout && currLayout.defn.visName)) { // this means we are rendering in full screen info window so set the dimensions accordingly
                        var availableSpace = mstrApp.rootView.getContentDimensions();
                        // set the height and width to the available height and width and ignore the height width in the format
                        this.height = availableSpace.h + 'px';
                        this.width = availableSpace.w + 'px';
                    } else {

                        this.fmts = node.defn.fmts || node.defn.units[this.model.k].fmts;

                        var fmts = this.fmts;
                        if(fmts){
                            for(var k in FMTS){
                                v = FMTS[k];
                                if(k in fmts){
                                    this[v] = fmts[k];
                                }
                            }
                        }
                    }

                    // are we waiting for server JSON?
                    this.waitingForData = !!nodeData.nsj;

                    // do we need to re-request the data for this visualization from server?
                    if (this.waitingForData) {
                        var iveStyleName = 'ServerJsonRWDStyle';

                        // YES: fire of a task to retrieve the server JSON
                        var model = this.model,
                            ds = model.getDataService(),
                            taskReq = {
                                host: this,
                                nodes: [ this.k ]
                            },
                            callback;

                        if (nodeData.wid !== undefined) {
                            taskReq.slices = [ nodeData.wid ];
                        }

                        callback = mstrmojo.func.wrapMethods(this.updateFormatProperties(),
                            model.docModel.getUpdateColorMapCallback(),
                            model.docModel.getUpdateThemePaletteCallback(true),
                            model.controller._getXtabCallback(this));

                        ds.retrieveServerJson(taskReq,
                            callback,
                            {
                                preserveUndo: true,
                                style: {
                                    name: iveStyleName,
                                    params: {
                                        treesToRender: 3
                                    }
                                },
                                params: {
                                    styleName: iveStyleName
                                }
                            });

                        // TQMS#963922 signal we have been updated to prevent unnecessary updates before we receive the Server JSON
                        this.updated = true;

                        // abort the update currently in progress
                        return false;
                    }

                    // convert values in fmts node into properties on this instance.
                    // Unclear which Vis subclasses depend on this copying.
                    if (this.updateFormatsOnUpdate) {
                        var fmts = node.defn.fmts || node.defn.units[this.model.k].fmts;
                        if (fmts) {
                            for (var k in FMTS) {
                                if (FMTS.hasOwnProperty(k)) {
                                    var v = FMTS[k];
                                    if (k in fmts) {
                                        this[v] = fmts[k];
                                    }
                                }
                            }
                        }
                    }

                }

                if (this.model ) {
                    var docModel = this.model && this.model.docModel;
                    if(this.model.data){
                        this.initFromVisProps(this.model.data.vp);
                    }
                    if (docModel && docModel.getDocBuilder) { //html5 vi to update visName
                        var visName = docModel.getDocBuilder().getMojoVisName(node);
                        if (visName) {
                            node.data.visName = visName;
                        }
                    }
                }
                this.updated = true;
                return true;
            },

            getModel: function getModel(k) {
                if (k) {
                    var m = mstrmojo.plugins.VisMicroChart.MicroChartVisBase.getVisGrid(this.layoutModel, this.layoutNode, k);
                    if (m) {
                       // return m.data;
                        return m;
                    } else {
                        alert(mstrmojo.desc(8427, "Incorrect visualization properties encountered.  Data may be inconsistent.  Please reset your properties."));
                        return {};
                    }
                } else {
                    return this.model;
                }
            },

            getDataParser: function getDataParser(key) {
                return new mstrmojo.plugins.VisMicroChart.MicroChartVisBase.DataParser(this.getModel(key));
            },

            /**
             * Renders an error message replacing the entire DOM node
             */
            renderErrorMessage: function renderErrorMessage(msg) {
                this.domNode.innerHTML = "<div class=\"mstrmojo-message\">" + msg + "</div>";
            },

            getMessageID: function getMessageID() {
                return this.model.mid && this.model.mid || this.xtabModel && this.xtabModel.docModel && this.xtabModel.docModel.mid;
            },

            /*
             * Return whether we have selection target that are not info window
             * Used to decide whether we clear the highlight when the info window is closed
             */
            hasNoninfowindowTarget: function hasNoninfowindowTarget(actionObj) {
                var xtabModel = this.xtabModel,
                    docModel = (xtabModel && xtabModel.docModel);

                var result = false;
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
                    this.selectorTargets = {};
                    if (units && actionObj.scObjList) {
                        for (var i = 0; i < actionObj.scObjList.length; i++) {
                            var scObj = actionObj.scObjList[i];
                            /*
                             * The targets is
                             */

                            var tksList = scObj.sc.tks.split("\x1E");
                            for (var j = 0; j < tksList.length; j++) {
                                var unit = units[tksList[j]];
                                if (unit) {
                                    this.selectorTargets[tksList[j]] = unit;
                                    if (!this.isChildOfIfw(units, unit)) {
                                        result = true;
                                    }
                                }
                            }
                        }
                    }
                }

                return result;
            },

            isChildOfIfw: function isChildOfIfw(units, unit) {
                while (unit) {
                    if (unit.ifw) {
                        return true;
                    }
                    unit = units[unit.pnk];
                }
                return false;
            },

            performAction: function performAction(actionObj) {
                var action = this.xtabModel.getAction(actionObj),
                    handler = action && action.h;
                if (handler && this.controller[handler]) {
                    this.controller[handler](this, action.a);
                    return true;
                }
                return false;
            }
        }
    );

    // find the visualization grid
    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.getVisGrid = function (m /*model*/, n /*node*/, k /*key*/) {
        var origN = n;
        var chldn = m.getChildren(n, false);
        for (var i = 0; i < chldn.length; i++) {
            var c = chldn[i];
            if (c.k == k) {
                return c;
            } else {
                var g = mstrmojo.plugins.VisMicroChart.MicroChartVisBase.getVisGrid(m, c, k);
                if (g) {
                    n = origN; // repoint to original object
                    return g;
                }
            }
        }
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.DataParser = function (m /*model*/) {
        var ns = mstrmojo.plugins.VisMicroChart.MicroChartVisBase;

        return {
            getRowTitles: function () {
                return new ns.Titles(m, true);
            },

            getColTitles: function () {
                return new ns.Titles(m, false);
            },

            findMetricValue: function (rvIdx /* an array with the row value indices*/, c /* col value index*/) {
                var rhs = m.ghs.rhs.items;
                for (var e in rhs) {
                    var row = rhs[e].items;
                    var found = true;
                    for (var i in rvIdx) {
                        if (rvIdx[i] != row[i].idx) {
                            found = false;
                            break;
                        }
                    }
                    if (found) {
                        return new mstrmojo.plugins.VisMicroChart.MicroChartVisBase.MetricValue(m.gvs.items[e].items[c]);
                    }
                }
            },

            getTotalRows: function getTotalRows() {
                var rowItems = m.ghs && m.ghs.rhs && m.ghs.rhs.items;
                return (m.eg || !rowItems) ? 0 : rowItems.length;
            },

            getTotalColHeaderRows: function getTotalColHeaderRows() {
                return (!m.ghs.chs.items ? 0 : m.ghs.chs.items.length);
            },

            getTotalCols: function getTotalCols() {
                return this.getColHeaders(0).size();
            },

            getRowHeaders: function getRowHeaders(pos /*position*/) {
                return new ns.Headers(m, pos, true);
            },

            getColHeaders: function getColHeaders(pos /*position*/) {
                return new ns.Headers(m, pos, false);
            },

            getMetricValue: function getMetricValue(row, col) {
                return new ns.MetricValue(m, m.gvs.items[row].items[col]);
            },

            getColumnHeaderCount: function getColumnHeaderCount() {
                return m.gvs.items[0].items.length;
            },

            getCSSString: function getCSSString() {
                return m.cssString;
            }


        };
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Titles = function (m, isRow) {
        var t = (isRow) ? m.gts.row : m.gts.col;
        return {
            size: function size() {
                return t.length;
            },
            getTitle: function getTitle(pos) {
                return new mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Title(t[pos]);
            },
            getCSS: function getCSS(pos) {
                return m.css[t[pos].cni].n;
            }
        };
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Headers = function (m /*Model*/, i /*position*/, isRow /*row or column*/) {
        var t = (isRow) ? m.gts.row : m.gts.col;
        var hs = (isRow) ? m.ghs.rhs : m.ghs.chs;
        var h = hs.items && hs.items[i].items;

        return {
            size: function size() {
                return (!h ? 0 : h.length);
            },
            getHeader: function getHeader(pos) {
                return h && h[pos] && new mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Header(h[pos], isRow ? t[pos] : t[i]);
            },
            getCSS: function getCSS(pos) {
                return h && m.css[h[pos].cni].n;
            },
            getHeaderCell: function (pos) {
                return h && h[pos];
            }

        };
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Title = function (t /*Title JSON */) {
        return {
            /*
             * Bitwise value that represents the the action type.
             * Its possible values are:
             * - STATIC (0)
             * - DRILLING (0x1)
             * - SELECTOR_CONTROL (0x2)
             * - HYPERLINK (0x4)
             * - SORT (0x8)
             * - PIVOT (0x10)
             * - EDIT (0x20)
             */
            getActionType: function () {
                return t.at;
            },
            /*
             * An Object that represents the Drill Paths
             */
            getDrillPath: function () {
                return t.dp;
            },
            getHeaderValues: function getHeaderValues() {
                return t.es;
            },
            getHeaderName: function getHeaderValue(pos) {
                return t.es[pos].n;
            },
            getHeaderId: function getHeaderValue(pos) {
                return t.es[pos].id;
            },
            getForms: function getForms() {
                return t.fs;
            },
            getFormId: function () {
                return t.fid;
            },
            getFormType: function () {
                return t.ftp;
            },
            getUnitId: function () {
                return t.id;
            },
            /*
             * A Map that represents the Links defined for Link Drilling
             */
            getLinkMap: function () {
                return t.lm;
            },
            getName: function () {
                return t.n;
            },
            getUnitDssType: function () {
                return t.otp;
            },
            getSelectorControl: function () {
                return t.sc;
            }
        };
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.Header = function (h /*Header JSON */, t /*Title JSON*/) {
        return {
            getName: function getName() {
                return (h.idx === -1) ? "" : t.es[h.idx].n;
            },
            getElementId: function getElementId() {
                return (h.idx === -1) ? "" : t.es[h.idx].id;
            },
            getObjectId: function getId() {
                return (h.idx === -1) ? "" : t.es[h.idx].oid;
            },
            getElementIndex: function getElementIndex() {
                return h.idx;
            },
            getActionType: function getActionType() {
                return h.at;
            },
            isTotal: function isTotal() {
                return h.otr === 1;
            }
        };
    };

    mstrmojo.plugins.VisMicroChart.MicroChartVisBase.MetricValue = function (m, jsonObj) {
        var v = jsonObj;
        return {
            getValue: function getValue() {
                return v.v;
            },
            getThresholdType: function getThresholdType() {
                return v.ty;
            },
            getRawValue: function getRawValue() {
                return v.rv;
            },
            getCSS: function getCSS() {
                return m.css[v.cni].n;
            },
            getThresholdValue: function getThresholdValue(defaultValue) {
                if (v.ti == undefined) {
                    return defaultValue;
                }

                return m.th[v.ti].n;
            },
            getFillColor: function getFillColor(defaultValue) {
                if (v.ci == undefined) {
                    return defaultValue;
                }

                return m.fc[v.ci].n;
            }
        };
    };
})();//@ sourceURL=MicroChartVisBase.js