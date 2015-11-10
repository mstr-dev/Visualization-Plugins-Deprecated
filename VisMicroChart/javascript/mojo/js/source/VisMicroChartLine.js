(function () {

    mstrmojo.requiresCls("mstrmojo.plugins.VisMicroChart.MicroChartVisChart");

    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
    var CUSTOM_DARK_THEME = 3;
    var CUSTOM_LIGHT_THEME = 4;

    var ttp_ParentNode = null;

    /**
     * @class
     * @extends mstrmojo.VisChart
     */
    mstrmojo.plugins.VisMicroChart.VisMicroChartLine = mstrmojo.declare(

        mstrmojo.plugins.VisMicroChart.MicroChartVisChart,

        null,

        /**
         * @lends mstrmojo.plugins.VisMicroChart.VisMicroChartLine.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.VisMicroChart.VisMicroChartLine',

            isDrawAxis: false,

            /*
             * To get the effects of padding top and bottom is 4, make margin.t and margin.b is 4
             * As we draw the bottom point with 4px above the margin.b(VisChartUtils.js getYValue),so margin.b = 4-4 = 0
             */
            margin: {t: 5, r: 2, b: 1, l: 2},

            showHighlightLine: false,

            themeColor: '#FFFFFF',

            isDrawRefArea: true,

            noBackground: true, // There should be no background for microChart

            isAnimateLines: false,

            toolTipMain: null,

            mainWidth: 0,

            mainLeftPos: 0,

            reDrawChart: function reDrwchart() {
                var context = this.context,
                    canvas = this.canvas,
                    wd = canvas.width,
                    ht = canvas.height;
                context.clearRect(0, 0, wd, ht);

                this.data.processLinearData(this);
                //cache the values length property
                this.windowSize = this.model.series[0].rv.length;
                //fill the Chart's background with the theme color
                this.utils.fillBackground(this);

                if (this.windowSize <= 1) {
                    return; // not enought data to draw chart
                }
                this.drawChart();
            },

            setColorByTheme: function setColorByTheme() {
                var lineProps = this.config;
                if (this.theme === DEFAULT_DARK_THEME || this.theme === DEFAULT_LIGHT_THEME) {
                    this.startPointColor = '#50B5D8';
                    this.endPointColor = '#50B5D8';
                    this.otherPointColor = '#50B5D8';
                    this.isDrawRefArea = false;
                    this.sparkLineColor = "#50B5D8";
                    this.refLineColor = "#FF781D";
                } else {
                    /**
                     * defines the color we want to display on the start point
                     * color should be in the '#ffffff' format,this property is fixed. Copied from Flash settings
                     */
                    this.startPointColor = '#000000';
                    /**
                     * defines the color we want to display on the end point
                     * color should be in the '#ffffff' format
                     * this property is fixed. Copied from Flash settings.
                     */
                    this.endPointColor = '#FF0000';
                    /**
                     * This is used to represent color settings for those points which are not start or end point.
                     * Value is fixed. Copied from Flash side code
                     */
                    this.otherPointColor = '#663300';
                    this.isDrawRefArea = lineProps.mbRefArea;
                    this.sparkLineColor = lineProps.mwSeriesLineCol || '#333333';
                    this.refLineColor = lineProps.mwRefLineCol || '#0066ff';
                }
                //var dpi = mstrMobileApp.getDeviceDPI();
                dpi = 480;
                this.sparkLineWidth = dpi > 160 ? 2 : 1;
                this.refLineWidth = 1;
                /**
                 * radius of the circle we draw on start and end points
                 */
                this.startEndPointRadius = dpi >= 320 ? 4 : dpi >= 240 ? 3 : 2;
            },

            drawChart: function drwchrt() {
                this.setColorByTheme();
                var lineProps = this.config;
                var context = this.context;
                var model = this.model;
                var values = model.series;
                var mvalues = model.mvalues;
                var margin = this.margin;
                var height = this.getHeight();
                var width = this.getWidth();
                var utils = this.utils;
                var maxVR = mvalues[mvalues.length - 1]; // this is the max value for values including reference value
                var minVR = mvalues[0]; // this is the min value for values including reference value
                var maxYValue = mvalues[mvalues.length - 1];
                var minYValue = mvalues[0];

                //this.domNode.style.position = "absolute";

                // calculate reference line value
                this.drawRefLine = false;
                if (this.refv && this.refv.length > 1 && lineProps.mbRefLine) {
                    var refValue = parseFloat(this.refv[1].rv);
                    if (isNaN(refValue)) {
                        //When 2nd metric is null value / missing object, it displays sparkline without reference line
                    	this.drawRefLine = false;
                    } else {
                    	this.drawRefLine = true;
                        // xiawang;TQMS 531977;if the mvalues[] array has length 1, we can't just substitue it with maxVR or minVR;
                        if (refValue > maxVR) {
                            maxVR = refValue;
                            if (mvalues.length === 1) {
                                mvalues[1] = maxVR;
                            } else {
                                mvalues[mvalues.length - 1] = maxVR;
                            }
                        }
                        if (refValue < minVR) {
                            minVR = refValue;
                            if (mvalues.length === 1) {
                                mvalues[1] = mvalues[0];
                                mvalues[0] = maxVR;
                            } else {
                                mvalues[0] = minVR;
                            }
                        }
                    }

                }
                this.themeColor = lineProps.mwRefAreaCol || '#dedede';
                // set the begin, end, all point values. Please refer to VisChartUtils.js::drawStartEndPoints  for help
                this.isDrawStartEndPoints = lineProps.mbAllPoints ? 7 : (lineProps.mbEndPoints ? 3 : 0);
                if (this.isDrawStartEndPoints & 1 && margin.l < this.startEndPointRadius) {
                    margin.l = this.startEndPointRadius;
                }
                if (this.isDrawStartEndPoints & 2 && margin.r < this.startEndPointRadius) {
                    margin.r = this.startEndPointRadius - 1; // xiawang: there seems to be an offset when draw the chart. so we minus extra 1 for the right margin
                }

                if (model.err) {
                    return;
                }

                if (!values) {
                    return;
                }

                // xiawang: handle the case of divide by zero
                if (maxVR !== minVR) {
                    this.RTY = (height - margin.t - margin.b - 4) / (maxVR - minVR);
                } else {
                    this.RTY = 0;
                }
                if (this.windowSize !== 1) {
                    this.RTX = (width - margin.l - margin.r - 1) / (this.windowSize - 1);
                } else {
                    this.RTX = 0;
                }
                // calculate the lines and max/min Y values
                var lines = [];

                //var maxYValue = undefined;
                //var minYValue = undefined;
                for (var i = 0; i < this.windowSize; i++) {
                    var val = parseFloat(values[0].rv[i]);
                    if (isNaN(val)) {
                    	lines[i] = null;
                        continue;
                    }
                    var x = (i * this.RTX) + margin.l;
                    var y = utils.getYValue(this, val);
                    lines[i] = {x: x, y: y};

                }
                if (lines.length === 0) {
                    //no data to draw lines
                    return;
                }
                maxYValue = utils.getYValue(this, maxYValue);
                minYValue = utils.getYValue(this, minYValue);
                //console.log("maxY:"+maxYValue+",minY:"+minYValue);
                if (maxYValue === undefined || minYValue === undefined) { // if either maxYValue or minYValue is unset, default to draw the whole chart
                    maxYValue = height - 4 - margin.b;
                    minYValue = margin.t;
                }
                // draw the background. According to spec and TQMS 531508, the background only between maxV and minV
                if (this.isDrawRefArea) {
                    context.fillStyle = this.themeColor;
                    context.fillRect(margin.l, minYValue, width - margin.r - margin.l, (maxYValue - minYValue));
                }
                // draw the lines
                context.lineCap = 'round';
                context.lineWidth = this.sparkLineWidth;
                context.lineJoin = 'round';
                context.strokeStyle = this.sparkLineColor;

                utils.drawLineSet(this, lines, false, context);

                // draw the start and end points
                if (this.isDrawStartEndPoints) {
                    utils.drawStartEndPoints(this, lines, context, this.isDrawStartEndPoints);
                }

                // draw the reference line
                if ( this.drawRefLine ) {

                    var y = this.utils.getYValue(this, refValue);
//                    if (isNaN(y)) {
//                        y = height - 5;
//                    }
                    if (context.lineWidth % 2 === 1) {
                        y = Math.round(y + 0.5) - 0.5; // xiawang: To remove the alias effect when the line width is 1 pixel
                    }
                    context.beginPath();
                    context.moveTo(margin.l, y);
                    context.lineTo(width - margin.r, y);
                    context.lineWidth = this.refLineWidth;
                    context.strokeStyle = this.refLineColor;
                    context.stroke();
                }
            },

            /**
             * Called to highlight a single data point
             * @param {Integer} [x] the x axis point to highlight
             */
            highlightPoint: function hghlghtpnt(x, touchY) {

                var me = this,
                    ctx = me.highlightContext,
                    height = me.getHeight(),
                    width = me.getWidth(),
                    margin = me.margin,
                    model = me.model,
                    utils = me.utils;

                ctx.clearRect(0, 0, width, height);

                if (x < 0) {
                    return;
                }

                var xcoord = (x * me.RTX) + margin.l;

                ctx.globalAlpha = 1;

                ctx.strokeStyle = this.sparkLineColor;
                ctx.fillStyle = ctx.strokeStyle;

                var y = utils.getYValue(me, model.series[0].rv[x]);

                if (xcoord < 5) {
                    xcoord = 5;
                }
                if (xcoord > width - 5) {
                    xcoord = width - 5;
                }
                if (y < 5) {
                    y = 5;
                }
                if (y > height - 5) {
                    y = height - 5;
                }
                ctx.strokeStyle = "FFFFFF";
                ctx.fillStyle = ctx.strokeStyle;
                ctx.globalAlpha = 0.8;
                utils.drawArc(this, xcoord, y, 5, 0, Math.PI * 2, true, true, ctx);

                ctx.strokeStyle = this.sparkLineColor;
                ctx.fillStyle = ctx.strokeStyle;
                ctx.globalAlpha = 1.0;
                utils.drawArc(me, xcoord, y, 5, 0, Math.PI * 2, true, false, ctx);
                utils.drawArc(me, xcoord, y, 2.5, 0, Math.PI * 2, true, true, ctx);
                this.highlightCanvas.id = "highLightCav" + this.widget.domNode.id;
            },

            renderTooltip: function rndrttp(valIndex, touchX, touchY) {
            	var ttp = this.widget._tooltip;
                if(ttp_ParentNode && !ttp.domNode.parentNode)
                    ttp_ParentNode.appendChild(ttp.domNode);
                if (valIndex < 0) {
                    ttp.toggle(false);
                    return;
                }

                var highLightCav = document.getElementById("highLightCav" + this.widget.domNode.id);
                if (highLightCav) {
                    var highlightCt = highLightCav.getContext('2d');
                    highLightCav.id = "";
                    highlightCt.clearRect(0, 0, 1000, 1000);
                }

                var me = this,
                	m = this.model,
                    s = m.series,
                    series = s[0],
                    utils = this.utils,
                    l = s.length,
                    si = this.seriesIndex,
                    ch = m.colHeaders,
                    rh = this.baseModel.rowHeaders,
                    margin = this.margin,
                    metrics = m.mtrcs.items;
                    
                if (isNaN(this.kpiOffset)) {
                    this.kpiOffset = 0;
                }
                
                var displayInfos = [];
                //line 1
                displayInfos.push({
                	n: m.categories.tn,
                	v: m.categories.items[valIndex]});
                
                //line 2
                if (this.widget.sparklineProps.mstrAssMetric) {
                	//!this.widget.isKPI  
                	displayInfos.push({
                    	n: this.widget.sparklineProps.mstrAssMetric,
                    	v: series.v[valIndex]});
                }
                else {
                	displayInfos.push({
                    	n: metrics[this.kpiOffset],
                    	v: series.v[valIndex]});
                }

                //line 3
                if (this.refv && this.refv.length > 1 && this.config.mbRefLine) {
                	displayInfos.push({
                    	n: metrics[this.kpiOffset + 1],
                    	v: this.refv[1].v});
                }
                
                ttp.displayInfo(displayInfos);
                ttp.toggle(true);
                ttp.setBorderColor(this.sparkLineColor);
                //TQMS 782203:tooltip position not updated on some device, we change visibility to hidden and back to visible, which force reflow
				ttp.domNode.style.visibility = 'hidden';
                
                var posWdt = mstrmojo.dom.position(this.widget.domNode, true),
                	zf = this.utils.getScreenZoomFactor(),
                	offset = Math.round(45*zf);
                utils.positionTooltip(ttp.domNode, {x:touchX - posWdt.x, y: touchY - posWdt.y}, this.widget.domNode, offset);
                ttp.domNode.style.visibility = 'visible';

            },
            hideTooltip: function hidettp() {
                var ttp = this.widget._tooltip;
                ttp.toggle(false);
                var win = ttp.domNode;
                if (win && win.parentNode) {
                    ttp_ParentNode = win.parentNode;
                    win.parentNode.removeChild(win);
                    //this.tooltipShape = undefined;
                }
                return;
            },

            /***
             *
             * @param touchX x coord based on widget
             * @param touchY y coord based on widget
             */
            isTouchPointInGraphRange: function tpInGR(touchX, touchY) {
                var margin = this.margin;
                if (touchX < margin.l || touchY < margin.t || touchY > this.canvas.height - margin.b) {
                    return false;
                }

                return true;
            },

            getData: function getData() {
                return this.model;
            },

            showTooltip: function handleTouchMove(touchX, touchY) {
                if (!this.config.mbShowTooltip) {
                    return false;
                }
                var me = this,
                    m = me.model;

                if (m.series[0].rv.length <= 1) {
                    return false;
                }

                //find x y position on canvas
                var pos = mstrmojo.dom.position(this.domNode, true),
                	touchXInChart = touchX - pos.x,
                	touchYInChart = touchY - pos.y;

                if (!this.isTouchPointInGraphRange(touchXInChart, touchYInChart)) {
                    return false;
                }

                var touchVal = me.getTouchValue(touchXInChart, touchYInChart);

                var margin = this.margin;

                if (touchVal !== null) {

                    var x = (touchVal * me.RTX) + margin.l;

                    /*
                     * TQMS 749810:
                     * on device issue:
                     * if the highlight point is covered by leftChart, we will not show the tooltip
                     */

                    if (me.widget.enableSmoothScroll) {
                        if (this.domNode.offsetLeft + x < this.widget._scroller.origin.x) {
                            return false;
                        }
                    }
                    var rns = (m.rne - m.rns > 1) ? m.rns : m.rns - 1;

                    if (me.seriesIndex === -1 || me.switchSeriesOnTouch) {
                        me.seriesIndex = me.utils.getSeriesIndexAndYValue(me, rns + touchVal, touchYInChart).si;
                    }

                    if (m.series[me.seriesIndex].rv[rns + touchVal] === "") {
                        return false;
                    }

                    me.prevHighlight = me.currentHighlight;
                    me.currentHighlight = touchVal;

                    //To improve performance:
                    //only need to update tooltip and highlight point when curr point changed, or first show tooltip
                    if (!me.widget.tooltipShow || me.prevHighlight != me.currentHighlight) {
                        me.renderTooltip(touchVal, touchX, touchY);
                        me.highlightPoint(touchVal, touchY);
                    }

                    return true;

                }
            },

            postBuildRendering: function postBR() {
                if (this._super) {
                    this._super();
                }
                var me = this,
                    w = me.widget;
                if(w){
                    me.defn = w.defn;
                }
            }


        }
    );

})();//@ sourceURL=VisMicroChartLine.js