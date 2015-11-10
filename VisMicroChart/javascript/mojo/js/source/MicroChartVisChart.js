/**
 * Created by fniu on 9/10/2015.
 */

(function() {

    mstrmojo.requiresCls("mstrmojo.plugins.VisMicroChart.MicroChartVisBase",
        "mstrmojo.plugins.VisMicroChart.VisChartUtils",
        "mstrmojo.plugins.VisMicroChart.VisChartData",
        "mstrmojo.boxmodel"
    );

    function getTooltipName(ch, s) {
        var nm = "",
            l = ch.length;

        if(l !== s.hi.length) {
            //something wrong these two must be the same
            return ch[0].items[s.hi[0]].n;
        }

        for(var i = 0; i < l; i++) {
            nm += (i > 0 ? " " : "") + ch[i].items[s.hi[i]].n;
        }

        return nm;
    }

    /**
     * A Chart widget
     *
     * @class
     * @extends mstrmojo.Widget
     */
    mstrmojo.plugins.VisMicroChart.MicroChartVisChart = mstrmojo.declare(
        // superclass
        mstrmojo.plugins.VisMicroChart.MicroChartVisBase,

        // mixins
        null,
        /**
         * @lends mstrmojo.VisChart.prototype
         */
        {
            cssClass: 'MicroChartVisChart',
            /**
             * @ignore
             */
            scriptClass: 'mstrmojo.plugins.VisMicroChart.MicroChartVisChart',

            /**
             * @ignore
             */
            utils: mstrmojo.plugins.VisMicroChart.VisChartUtils,

            /**
             *
             * @ignore
             */
            data: mstrmojo.plugins.VisMicroChart.VisChartData,

            /**
             * The list of items to display.
             *
             * @type Array
             */
            model: null,

            /**
             * To remember the previous Y label co-ordinates to make sure it does not overlap
             */
            prevYLabel: {x:0, y:0, h:0},

            /**
             * To remember the previous X label co-ordinates to make sure it does not overlap
             */
            prevXLabel: {x:0, y:0, w:0},

            /**
             * @ignore
             */
            context: null,

            /**
             * The color used as the background of the Chart. It is also used to determine the color of the lines.
             * @type String
             */
            themeColor: '#000000',

            /**
             * The color used when highligting items in the Chart
             * @type String
             */
            highlightColor: '#ff8833',

            /**
             * An object representing the margins the Chart will have. It contains the following Objects: t (top), r (right), b (bottom), l (left).
             * @type Object
             */
            margin: {t:50, r:2, b:30, l:2},

            /**
             * Widget offset in pixels
             */
            offsetLeft: null,

            /**
             * padding to use between x axis labels
             */
            xLabelPadding: 10,

            /**
             * padding to use between y axis labels
             */
            yLabelPadding: 10,

            /**
             * Property that determines if we need to draw axis in the chart.
             * If no axes are drawn labels are excluded automatically
             */
            isDrawAxis: true,

            /**
             * Property that determines if we need to draw labels on x axis
             */
            drawXAxisLabels: true,

            /**
             * Property that determines if we need to draw labels on y axis
             */
            drawYAxisLabels: true,

            /**
             * Property that determines if need to draw highlight when touch event occurs
             */
            isHighlightOnTouch: true,

            /**
             * property that defines if the chart is linear or based on low high point values
             */
            isLinearChart: true,

            /**
             * if we want to show the highlight line on the chart
             */
            showHighlightLine: true,

            browserSupportsHtml5: true,

            /**
             * if the user want to display a single line or multi line chart.
             */
            multiLine: true,

            /**
             * draw the Grid Lines.
             * 0 - No Grid Line
             * 1 - Horizontal lines only
             * 2 - Vertical lines only
             * 3 - Both horizontal and vertical lines
             */
            drawGridLines: 3,

            /**
             * Variable to control drawing horizontal lines
             */
            drawHorizontalGridLines: 1,

            /**
             * Variable to control drawing vertical lines
             */
            drawVerticalGridLines: 2,

            /**
             * Variable that controls the behavior of tooltip and selection point selection
             * if true we select next point closer to the touch for move events.  If it is
             * set to false on touch start the closer line will be selected and will remain
             *  to be the one even during move another line become closer.
             *  By default it is true for chartLine and false for TimeSeries.
             */
            switchSeriesOnTouch: true,

            /**
             * variable that works in conjuction with switchSeriesOnTouch to cache the series index that
             * will be selected on touch and stay cached during the move event.
             */
            seriesIndex: -1,

            /**
             * This property will help determine the user if we have display mode set to regular or micro-chart
             * 0 - regular
             * 1 - micro-chart
             * setting this property other than displayMode to regular will result in overwriting bunch of other properties
             * to ensure that the micro-chart behavior is maintained
             */
            displayMode: 0,

            /**
             * @ignore
             */
            markupString: '<div id="{@id}" class="mstrmojo-Chart {@cssClass}" style="width:{@width};height:{@height};top:{@top};left:{@left};position:relative;" ' +
            ' mstrAttach:mouseover,mouseout,mousemove ' +
            '><canvas width="{@width}" height="{@height}"></canvas>' +
            '<canvas style="position:absolute;left:0;top:0" width="{@width}" height="{@height}"></canvas>' +
            '<canvas style="position:absolute;left:0;top:0" width="{@width}" height="{@height}"></canvas>' +
            '<div id="{@id}-tooltip" class="mstrmojo-Chart-tooltip"></div>' +
            '</div>',

            /**
             * @ignore
             */
            markupSlots: {
                //the main canvas of the Chart
                canvas: function(){ return this.domNode.firstChild; },

                //the base canvas for animation @TODO: each animation should create independent canvas objects
                animationCanvas: function(){ return this.domNode.childNodes[1]; },

                //the canvas used for highlighting points
                highlightCanvas: function(){ return this.domNode.childNodes[2]; },

                //the tooltip display when highlighting points
                tooltip: function(){ return this.domNode.childNodes[3]; }
            },

            /**
             * @ignore
             */
            postBuildRendering: function postBR() {
                if (this._super) {
                    this._super();
                }
                this.browserSupportsHtml5 = this.canvas.getContext;
                if (!this.browserSupportsHtml5) {
                    this.renderErrorMessage(mstrmojo.desc(8126,'Your browser does not support HTML5'));
                    return;
                }
                if (!this.model) {
                    this.renderErrorMessage(mstrmojo.desc(8426,'No model provided'));
                    return; // should return here
                }
                // If error message is received than print error message and return
                if(this.model.err || this.model.eg) {
                    this.renderErrorMessage(this.model.err  || this.model.eg);
                    return;
                }

                // process data
                if(this.isLinearChart) {
                    this.data.processLinearData(this);
                } else {
                    this.data.process(this);
                }

                //cache the values length property
                this.windowSize = this.model.series[0].rv.length;

                //cache the different canvas' context objects in the Widget
                this.context = this.canvas.getContext('2d');
                this.highlightContext = this.highlightCanvas.getContext('2d');
                this.animationContext = this.animationCanvas.getContext('2d');

                //fill the Chart's background with the theme color
                this.utils.fillBackground(this);

                if(this.windowSize <= 1) {
                    return; // not enought data to draw chart
                }
                //trigger the Chart's plot method
                this.plot();
            },

            /*
             * return the max value of all the points on Y axis
             */
            getMaxValue: function getMaxV(){
                var vals = this.model.mvalues;
                return vals && vals[vals.length - 1];
            },

            /*
             * return the min value of all the points on Y axis
             */
            getMinValue: function getMinV(){
                var vals = this.model.mvalues;

                return vals && vals[0];
            },

            /**
             * Called to render the Chart elements
             */
            plot: function plt() {

                // draw the chart
                this.drawChart();

                // If error is found don't draw any axis etc just return. Error message should be displayed
                // from the drawChart method already
                if(this.model.err  || this.model.eg) {
                    return;
                }

                //draw the Chart's axes.
                if(this.isDrawAxis) {

                    if(this.isTimeSeries || !(this.isAnimateLines && (!this.multiLine || this.model.series.length === 1 ))) {
                        this.drawLabels();
                    }
                    else{
                        this.drawAxis();
                    }
                }
            },

            /**
             * draw the actual chart lines/bars
             */
            drawChart: function drwchrt() {},

            /**
             * Called to render the Chart axes
             */
            drawAxis: function drwAxs() {
                var utils = this.utils,
                    margin = this.margin,
                    width = this.getWidth(),
                    height = this.canvas.height,
                    context = this.context;

                context.save();

                //set the style of the axes lines
                context.strokeStyle =  utils.getColor(this);
                context.lineWidth = 2;
                context.globalAlpha = 0.3;

                //draw the rectangle
                utils.drawRectangle(this, margin.l, margin.t, width - margin.l - margin.r, height - margin.t - margin.b);

                context.restore();
            },

            /**
             * Called to render the Chart data labels. By default this method renders labels for the max and min values of a single axis Chart
             */
            drawLabels: function drwlbls() {
                if (!this.isDrawAxis || !this.drawYAxisLabels) return;
                var model = this.model,
                    utils = this.utils,
                    margin = this.margin,
                    v = model.mvalues,
                    ylbls = model.ylbls,
                    l = v.length,
                    dgl = this.drawGridLines;

                this.prevYLabel.x = 0;
                this.prevYLabel.y = 0;
                this.prevYLabel.h =0;

                for(var i = 0; i < l; i++) {
                    var y = utils.getYValue(this, v[i]);
                    var lbl = utils.addDataLabel(this, ylbls[i], y, this.prevYLabel);
                    //only if label was drawn draw the highlight
                    var yPos = Math.floor(y) + 0.5;
                    if(lbl && (dgl & this.drawHorizontalGridLines) && i > 0 && i < l-1 ) {
                        utils.drawHighlightLine(this, yPos);
                    }
                    if(i == l-1 && this.isTimeSeries && lbl && (dgl & this.drawHorizontalGridLines)){
                        utils.drawHighlightLine(this, yPos);
                    }
                }
            },

            renderTooltip: function rndrttp(valIndex, touchX, touchY) {
                if (valIndex < 0) {
                    this.tooltip.style.display = 'none';
                    return;
                }

                var m = this.model,
                    s = m.series,
                    utils = this.utils,
                    l = s.length,
                    si = this.seriesIndex,
                    ch = m.colHeaders,
                    ttp = this.tooltip;

                // also put the series name
                var sn = '';

                //if not multiline get the value of series to be drawn
                if(!this.multiLine) {
                    sn = getTooltipName(ch,s[0]) + ': ' + s[0].v[valIndex];
                } else {
                    //Now if we are drawing multiLines get all the values of highlight line
                    // have to be shown
                    if(this.showHighlightLine) {
                        for(var i = 0; i < l; i++) {
                            sn += (i === 0 ? '' : '<br/>') + getTooltipName(ch,s[i]) + ': ' + s[i].v[valIndex];
                        }
                    } else {
                        //else draw the index based on the series selected
                        sn = getTooltipName(ch,s[si]) + ': ' + s[si].v[valIndex];
                    }

                }

                //Cached the row/attribute values
                var rVal = this.model.categories.items[valIndex];

                //Set the tooltip text
                ttp.innerHTML = rVal + '<br/>' + sn;

                //show the tooltip
                ttp.style.display = 'block';

                //Calculate the position of the highlight tooltip and adjust if necesary

                //get the width of the tooltip div
                var tooltipWidth = ttp.offsetWidth;

                var toolx = touchX - tooltipWidth /2;
                var margin = this.margin;

                if (toolx < margin.l) {
                    toolx = margin.l;
                } else if (toolx > this.getWidth() - margin.r - tooltipWidth) {
                    toolx = this.getWidth() - margin.r - tooltipWidth;
                }

                //Set the tooltip position
                if(this.showHighlightLine) {
                    utils.translateCSS(toolx, 0, false, ttp);
                } else {
                    //series should actually be picked up either for one that is drawn or which is the closest to the touch
                    // get the ypos to show the tooltip and make sure it fits inside the window.
                    var yPos = utils.getYValue(this, s[si].rv[valIndex]) - ttp.offsetHeight - 20;
                    if(yPos < 0 ) {
                        yPos = utils.getYValue(this, s[si].rv[valIndex]);
                    }
                    utils.translateCSS(toolx, yPos, false, ttp);
                }

            },

            /**
             * Returns the selected value (null if nothing is selected)
             * @param x the x position of the click event
             * @param y the y position of the click event
             * @return the selected value (null if nothing is selected)
             */
            getTouchValue: function gtvlindx(x,y) {
                var md = this.model,
                    m = this.margin;

                var sz = md.rne - md.rns > 0 ? md.rne - md.rns > 1 ? md.rne - md.rns : 2 : this.windowSize;
                var touchVal = Math.round(((x - m.l) * (sz - 1))/(this.getWidth() - m.l - m.r - 1));
                return (touchVal < sz) ? touchVal: null;
            },

            /**
             * Called to highlight a single data point. Implemetation left empty for Chart Widgets.
             * @param {Integer} [x] the x axis point to highlight
             */
            highlightPoint: function hghlghtpnt(x, touchY) {

            },

            /**
             * Handles the touch begin event.
             * @private
             */
            handleTouchBegin: function handleTouchBegin(touchX, touchY) {
                //console.log('handle touch Begin');
                if(!this.isHighlightOnTouch || !this.browserSupportsHtml5) {
                    return;
                }
                this.tooltipOn = true;
                this.adjustWidgetOffsets();
                this.handleTouchMove(touchX, touchY);
            },

            /**
             * Handles the touch move event. The method positions the Chart tooltip and calls highlightPoint()
             * @private
             */
            handleTouchMove: function handleTouchMove(touchX, touchY) {
                //console.log('handle touch Move');
                var me = this,
                    m = me.model;

                if (!me.tooltipOn || !me.isHighlightOnTouch || !this.browserSupportsHtml5 || this.windowSize <= 1) {
                    return;
                }


                var touchPointOnWidget = me.utils.getTouchXYOnWidget(touchX, touchY, me);
                var posX = touchX, posY = touchY;
                touchX = touchPointOnWidget.touchX;
                touchY = touchPointOnWidget.touchY;

                var margin = me.margin;

                //Get the index of the values array that matched the x coordinate where the event happened.
                var touchVal = me.getTouchValue(touchX,touchY);

                //The points falls within a valid window
                if (touchVal !== null) {
                    // adjust rns value if the difference is only 1 point
                    var rns = (m.rne - m.rns > 1) ? m.rns : m.rns - 1;

                    // if this is the first time we come in select the series we try to display
                    if(me.seriesIndex === -1 || me.switchSeriesOnTouch) {
                        me.seriesIndex = me.utils.getSeriesIndexAndYValue(me, rns + touchVal, touchY).si;
                    }

                    //This point has no value
                    if(m.series[me.seriesIndex].rv[rns + touchVal] === "") {
                        return;
                    }

                    //remember previous highlightpoint position
                    me.prevHighlight = me.currentHighlight;

                    //cache the highlightpoint position
                    me.currentHighlight = touchVal;

                    //render the tooltip
                    me.renderTooltip(touchVal, posX, posY);

                    //Call the method that will highlight the current point
                    if(this.isTimeSeries){
                        me.highlightPoint(touchVal, touchX, touchY);
                    }else{
                        me.highlightPoint(touchVal, touchY);
                    }

                }
            },

            /**
             * Handles the touch end event.
             * @private
             */
            handleTouchEnd: function handleTouchEnd() {
                //console.log('handle touch End');
                if (!this.browserSupportsHtml5) {
                    return;
                }
                var me = this;

                if(me.model.err || this.model.eg) {
                    return;
                }
                me.tooltipOn = false;

                me.seriesIndex = -1;
                me.currentHighlight = null;

                //erase the highlight context.
                //me.highlightContext.clearRect(0, 0, me.getWidth(), me.highlightCanvas.height);
                me.highlightCanvas.height = me.highlightCanvas.height;

                //hide tooltip
                me.hideTooltip();
            },

            hideTooltip: function hidettp() {
                this.tooltip.style.display = 'none';
                return;

            },

            /**
             * @ignore
             */
            onmouseover: function(evt) {
                if(!this.isAndroid) {
                    //console.log('mouse over');
                    this.handleTouchBegin(evt.e.pageX, evt.e.pageY);
                }
            },

            /**
             * @ignore
             */
            onmouseout: function(evt) {
                if(!this.isAndroid) {
                    //console.log('mouse out');
                    this.handleTouchEnd();
                }
            },

            /**
             * @ignore
             */

            onmousemove: function(evt) {
                if (!this.isAndroid) {
                    this.handleTouchMove(evt.e.pageX, evt.e.pageY);
                }
            }
        }
    );

})();//@ sourceURL=MicroChartVisChart.js
