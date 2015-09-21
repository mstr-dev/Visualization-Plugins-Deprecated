(function () {

    mstrmojo.requiresCls("mstrmojo.plugins.VisMicroChart.MicroChartVisChart");

    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
//    var CUSTOM_DARK_THEME = 3;
//    var CUSTOM_LIGHT_THEME = 4;

    /**
     * @class
     * @extends mstrmojo.VisChart
     */
    mstrmojo.plugins.VisMicroChart.VisMicroChartBar = mstrmojo.declare(
        mstrmojo.plugins.VisMicroChart.MicroChartVisChart,

        null,

        /**
         * @lends mstrmojo.VisMicroChartBar.prototype
         */
        {
           scriptClass: 'mstrmojo.plugins.VisMicroChart.VisMicroChartBar',

            isDrawAxis: false,

            margin: {t: 0, r: 1, b: 0, l: 1},

            showHighlightLine: false,

            themeColor: '#FFFFFF',

            noBackground: true, // There should be no background for microChart

            isAnimateLines: false,

            toolTipMain: null,

            labelLen: 0,

            mainWidth: 0,

            mainLeftPos: 0,

            markupString: '<div id="{@id}" class="mstrmojo-Chart {@cssClass}" style="width:{@width};height:{@height};top:{@top};left:{@left};position:relative;" ' +
                ' mstrAttach:mousedown,mouseup,mousemove,click ' +
                '><canvas width="{@width}" height="{@height}"></canvas>' +
                '<canvas style="position:absolute;left:0;top:0" width="{@width}" height="{@height}"></canvas>' +
                '<canvas style="position:absolute;left:0;top:0" width="{@width}" height="{@height}"></canvas>' +
                '<div style="position:absolute;left:0px;top:0px;padding-left:1px;padding-top:1px;text-align:left;-webkit-text-size-adjust: none; font-family: Roboto"></div>' +
                '<div style="position:absolute;left:0px;bottom:0px;padding-left:1px;padding-bottom:1px;text-align:left;-webkit-text-size-adjust: none;font-family: Roboto"></div>' +
                '</div>',

            markupSlots: {
                //the main canvas of the Chart
                canvas: function () {
                    return this.domNode.firstChild;
                },
                animationCanvas: function () {
                    return this.domNode.childNodes[1];
                },
                highlightCanvas: function () {
                    return this.domNode.childNodes[2];
                },
                minLabel: function () {
                    return this.domNode.childNodes[3];
                },
                maxLabel: function () {
                    return this.domNode.childNodes[4];
                }
            },

            postBuildRendering: function postBR() {
                if (this._super) {
                    this._super();
                }
                //draw bar when size == 1, TQMS 531674
                this.windowSize = this.model.series[0].rv.length;
                if (this.windowSize === 1) {
                    this.plot();
                }

            },

            /**
             * Returns the selected value index
             *
             * @param touchX The x position of the click event on widget.
             * @returns {int} The index of selected bar.
             */
            getTouchValue: function gtvlindx(touchX) {
                var series = this.model.series[0];
                var ind = 0;
                for (var i = 0; i < series.v.length; i++) { // xiawang: use real bar position to decide show which bar
                    if (touchX < this.hightLightPos[i].x) {
                        if (i === 0) {
                            ind = i;
                        } else {
                            ind = (this.hightLightPos[i].x + this.hightLightPos[i - 1].x) / 2 > touchX ? (i - 1) : i;
                        }
                        break;
                    }
                }
                if (i !== series.v.length) {
                } else {
                    ind = i - 1;
                }
                return ind;
            },

            /***
             *
             * @param touchX x coord based on widget
             * @param touchY y coord based on widget
             */
            isTouchPointInGraphRange: function tpInGR(touchX, touchY) {
                if (touchX <= this.labelLen + 1 || touchX >= this.getWidth() - 1) {
                    return false;
                }
                return true;
            },

            /**
             *
             * @param pageX
             * @param pageY
             */
            showTooltip: function rndrttp(pageX, pageY) {
                if (!this.config.mbShowTooltip || this.noDataToShowTtp) {
                    return false;
                }

                var m = this.model,
                    series = m.series[0];

                if (series.rv.length < 1) {
                    return false;
                }

                var pos = mstrmojo.dom.position(this.domNode, true);
                var touchX = pageX - pos.x;
                var touchY = pageY - pos.y;
                //					console.log("show tooltip, touchX: "+ touchX + ", touchY: " + touchY + ", pos.x:"+pos.x+", pox.y"+ pos.y);

                if (!this.isTouchPointInGraphRange(touchX, touchY)) {
                    return false;
                }

                var touchVal = this.getTouchValue(touchX, touchY);

                var x = this.hightLightPos[touchVal].x;
                /*
                 * TQMS 749810:
                 * on device issue:
                 * if the highlight point is covered by leftChart, we will not show the tooltip
                 */
                if (this.widget.enableSmoothScroll) {
                    if (this.domNode.offsetLeft + x < this.widget._scroller.origin.x) {
                        return false;
                    }
                }

                this.prevHighlight = this.currentHighlight;
                this.currentHighlight = touchVal;

                //To improve performance:
                //only need to update tooltip and highlight point when curr point changed, or first show tooltip
                if (!this.widget.tooltipShow || this.prevHighlight != this.currentHighlight) {

                    touchX = Math.round(this.hightLightPos[touchVal].x);
                    touchY = Math.round(this.hightLightPos[touchVal].y);

                    var vl = series.rv[touchVal] * 1.0;
                    var tColor = this.posBarColor;
                    if (vl < 0) {
                        tColor = this.negBarColor;
                    }
                    if (series.thClr && series.thClr[touchVal]) {
                        //if there is threshold use threshold color;
                        tColor = series.thClr[touchVal];
                    }

                    this.renderTooltip(touchVal, pageX, pageY, tColor);
                    this.highlightPoint(touchX, touchY, tColor);
                }
                return true;
            },

            renderTooltip: function rndrttp(valIndex, touchX, touchY, tColor) {
                var m = this.model,
                    barProps = this.config,
                    series = m.series[0],
                    width = this.getWidth(),
                    metrics = m.mtrcs.items,
                    utils = this.utils;

                var ttp = this.widget._tooltip;

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
                ttp.setBorderColor(tColor);
                //TQMS 782203:tooltip position not updated on some device, we change visibility to hidden and back to visible, which force reflow
                ttp.domNode.style.visibility = 'hidden';

                var posWdt = mstrmojo.dom.position(this.widget.domNode, true),
                    zf = this.utils.getScreenZoomFactor(),
                    offset = Math.round(45 * zf);
                utils.positionTooltip(ttp.domNode, {x: touchX - posWdt.x, y: touchY - posWdt.y}, this.widget.domNode, offset);
                ttp.domNode.style.visibility = 'visible';
                //                    var pos = mstrmojo.dom.position(this.domNode, true);
                //					var posWdt = mstrmojo.dom.position(this.widget.domNode, true);
                //					var oft =  {
                //							left: pos.x - posWdt.x,
                //							top: pos.y - posWdt.y
                //					};
                //					var ttpHeight = ttp.domNode.offsetHeight,
                //                		ttpWidth = ttp.domNode.offsetWidth;
                //					var topOff = (touchY + pos.y - posWdt.y - ttpHeight - 20);
                //					if(topOff < 0) {
                //						topOff = 0;
                //					}
                //					var leftOff = (oft.left + touchX + 20);
                //					if(leftOff > this.widget.getWidth() - ttpWidth) {
                //						leftOff = (touchX + oft.left - ttpWidth - 20);
                //						if(leftOff < 0) {
                //							leftOff = 0;
                //						}
                //					}
                //					ttp.posTo({x:leftOff, y:topOff});
            },

            highlightPoint: function highlightPoint(touchX, touchY, tColor) {
                var ctx = this.highlightContext,
                    width = this.getWidth(),
                    height = this.getHeight(),
                    utils = this.utils;

                ctx.clearRect(0, 0, width, height);
                ctx.globalAlpha = 1;

                touchX = touchX > 5 ? touchX : 5;
                if (touchX > width - 5) {
                    touchX = width - 5;
                }
                touchY = touchY > 5 ? touchY : 5;
                if (touchY > height - 5) {
                    touchY = height - 5;
                }
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = "FFFFFF";
                ctx.fillStyle = ctx.strokeStyle;
                utils.drawArc(this, touchX, touchY, 5, 0, Math.PI * 2, true, true, ctx);

                ctx.strokeStyle = tColor;
                ctx.fillStyle = ctx.strokeStyle;

                ctx.globalAlpha = 1.0;
                utils.drawArc(this, touchX, touchY, 5, 0, Math.PI * 2, true, false, ctx);
                utils.drawArc(this, touchX, touchY, 2.5, 0, Math.PI * 2, true, true, ctx);
                this.highlightCanvas.id = "highLightCav" + this.widget.domNode.id;
            },

            textLen: function txtLn(str) {
                // xiawang: this method should be obsolted because we can use context.measureText() method to measure text which are more accurate
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 255 || str.charCodeAt(i < 0)) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            },

            handleTouchMove: function () {
                // xiawang: do nothing. Just disable parent class method.
            },

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

                if (this.windowSize < 1) {
                    return; // not enought data to draw chart
                }
                this.drawChart();
            },

            setColorByTheme: function setColorByTheme() {
                var barProps = this.config;
                if (this.theme == DEFAULT_DARK_THEME || this.theme == DEFAULT_LIGHT_THEME) {
                    this.posBarColor = "#598200";
                    this.negBarColor = "#CC3A06";

                    this.xAxisLineWidth = 1;
                    this.xAxisLineColor = "#7F7F7F";
                    this.refLineWidth = 1;
                    this.refLineColor = "#00A6EF";
                } else {
                    this.posBarColor = barProps.mwPosCol || '#009900';
                    this.negBarColor = barProps.mwNegCol || '#ff0000';

                    this.xAxisLineWidth = 1;
                    this.xAxisLineColor = "#000000";
                    this.refLineWidth = 1;
                    this.refLineColor = barProps.mwRefLineCol;
                }
            },

            getData: function getData() {
                return this.model;
            },


            drawChart: function drwchrt() {

               // var model = this.model;
                var model = this.model.data;
                var barProps = this.config;
                if (model.err) {
                    this.noDataToShowTtp = true;
                    return;
                }

                this.setColorByTheme();

                var context = this.context,
                    values = model.series,
                    height = this.getHeight(),
                    width = this.getWidth(),
                    me = this,
                    utils = this.utils;
                var barOffset = 0;
                var barPadLeft = this.margin.l;
                var barPadRight = this.margin.r;

                var min = 0,
                    max = 0,
                    minLabel = maxLabel = "",
                    series = model.series[0];

                for (var i = 0; i < series.v.length; i++) {
                    var vl = parseFloat(series.rv[i]);
                    if (i === 0) {// for the first element, set max and min
                        max = min = vl;
                        minLabel = maxLabel = series.v[i];
                    } else if (vl > max) {
                        max = vl;
                        maxLabel = series.v[i];
                    } else if (vl < min) {
                        min = vl;
                        minLabel = series.v[i];
                    }
                }

                if (isNaN(min) && isNaN(max)) {
                    //all the data is NaN, draw nothing
                    this.minLabel.innerHTML = "";
                    this.maxLabel.innerHTML = "";
                    this.noDataToShowTtp = true;
                    return;
                }

                this.noDataToShowTtp = false;

                if (barProps.mbShowLegend) { // xiawang: do not show the legend if not told to
                    var fontSize = Math.ceil(Math.min(12, (height / 2) * 0.7));  // xiawang: original is 13px, change to match Flash behavior
                    var mintxt = "Min:" + minLabel.replace(/[ ]/g, "");
                    var maxtxt = "Max:" + maxLabel.replace(/[ ]/g, "");

                    this.minLabel.innerHTML = mintxt;
                    this.maxLabel.innerHTML = maxtxt;

                    // leave at least 10 pixels for chart
                    var maxBarOffset = width - 10;
                    if (maxBarOffset > width * 0.5) {
                        maxBarOffset = Math.floor(width * 0.5);
                    }
                    do {
                        this.minLabel.style.fontSize = fontSize + "px";
                        this.maxLabel.style.fontSize = fontSize + "px";
                        var fontFamily = "Roboto";
                        var minTxtLen = this.widget.getTextWidth(mintxt, "", fontFamily, fontSize, "px", this.isTextBold);
                        var maxTxtLen = this.widget.getTextWidth(maxtxt, "", fontFamily, fontSize, "px", this.isTextBold);
                        var txtLen = minTxtLen > maxTxtLen ? minTxtLen : maxTxtLen; // get the maximum text length
                        barOffset = txtLen + barPadLeft;
                        fontSize -= 1;
                    } while (barOffset > maxBarOffset && fontSize > 5); //add fontSize > 5 to avoid endless loop
                    fontSize += 1;
                } else {
                    barOffset = barPadLeft;
                }

                this.labelLen = barOffset;

                // xiawang: process the reference value. This might need result in adjust of min/max value
                if (this.refv && this.refv.length > 1 && barProps.mbRefLine) {
                    var refValue = this.refv[1].rv * 1.0;
                    if (refValue < min) {
                        min = refValue;
                    }
                    if (refValue > max) {
                        max = refValue;
                    }
                }
                // xiawang: processs the base line
                var ts = max - min;
                var baseY = 0;
                var barPadTop = 5;
                var barPadBottom = 5;
                var rangeRatio = height - barPadTop - barPadBottom; // use rangeRatio to universally calculate the printed height
                if (ts == 0) { // xiawang: consider the case when max == min or any value is undefined
                    if (min == 0) {
                        baseY = height / 2;
                        rangeRatio = 0;
                    } else {
                        rangeRatio /= Math.abs(max);
                        if (max < 0) {
                            baseY = barPadTop;
                        } else {
                            baseY = height - barPadBottom;
                        }
                    }
                } else if (max < 0) {
                    baseY = barPadTop;
                    rangeRatio /= Math.abs(min);
                } else if (min < 0) {
                    baseY = max / ts * rangeRatio + barPadTop;
                    rangeRatio /= ts;
                } else { // both are larger than 0
                    baseY = height - barPadBottom;
                    rangeRatio /= max;
                }

                // xiawang: draw each value bar
                // xiawang: TQMS 532258, Change the bar size to smaller. We should also be more smart to decide position and size of each bar to make it looks symmetric
                var barTotalWidth = width - barOffset - barPadRight;
                var barCount = series.v.length;
                var barSpaceWidth = barTotalWidth * 0.4 / barCount; // allocate 40% for space
                barSpaceWidth = barSpaceWidth >= 1 ? barSpaceWidth : 1; // space at least 1
                var barWidth = barTotalWidth / barCount - barSpaceWidth;
                this.hightLightPos = [];
                for (var i = 0; i < barCount; i++) {
                    this.hightLightPos[i] = {};
                    var vl = series.rv[i] * 1.0;
                    var direct = true;
                    if (vl < 0) {
                        vl = 0 - vl;
                        direct = false;
                    }
                    //console.log("data value: " + vl);
                    var hgt = vl * rangeRatio;
                    //console.log("data height: " + hgt);
                    var cw = (width - barOffset) / series.v.length;
                    this.drawBar(barOffset + (barWidth + barSpaceWidth) * i + barSpaceWidth / 2, baseY, barWidth, hgt, context, series.thClr && series.thClr[i], direct, this.hightLightPos[i]);
                }

                // xiawang: draw the base line
                context.strokeStyle = this.xAxisLineColor;
                context.lineWidth = this.xAxisLineWidth;
                if (context.lineWidth % 2 === 1) {
                    baseY = Math.round(baseY + 0.5) - 0.5; // xiawang: To remove the alias effect when the line width is 1 pixel
                }

                context.beginPath();
                context.moveTo(barOffset, baseY);
                context.lineTo(width - barPadRight, baseY);
                context.stroke();

                // xiawang: draw the reference line
                if (this.refv && this.refv.length > 1 && barProps.mbRefLine) {
                    var refValue = this.refv[1].rv * 1.0;
                    var refH = baseY - refValue * rangeRatio;
                    //console.log("reference value: " + refValue);
                    //console.log("reference height: " + refH);
                    if (context.lineWidth % 2 === 1) {
                        refH = Math.round(refH + 0.5) - 0.5; // xiawang: To remove the alias effect when the line width is 1 pixel
                    }
                    context.beginPath();
                    context.moveTo(barOffset, refH);
                    context.lineTo(width - barPadRight, refH);
                    context.strokeStyle = this.refLineColor;// TQMS 533746
                    context.stroke();
                }
            },

            drawBar: function drwBr(x, y, width, height, context, color, direct, posStore) {
                /*
                 *  xiawang: TQMS 532210 As PM said, remove the gradient effect currently to match Flash behavior
                 *
                 var lingrad = context.createLinearGradient(x,y,x+width,y);
                 lingrad.addColorStop(0, '#66CC00');
                 lingrad.addColorStop(0.5, '#CCFFFF');
                 lingrad.addColorStop(0.5, '#CCFFFF');
                 lingrad.addColorStop(1, '#66CC00');
                 context.fillStyle = lingrad;
                 */

                // xiawang: to remove anti-alias effect, we need to make sure the x, y, width and height are all integers.
                if (width >= 3) { // xiawang: only remove anti-alias effect if the width is larger than 3
                    x = Math.round(x);
                    y = Math.round(y);
                    width = Math.round(width);
                }
                if (height != 0) {
                    height = Math.round(height);
                    if (height < 1) { // xiawang;TQMS 531982;draw the bar chart for at least 1 pixel even if the metric value is very small
                        height = 1;
                    }
                }

                if (direct) {
                    context.fillStyle = color ? color : this.posBarColor;
                    context.fillRect(x, y - height, width, height);
                    posStore.x = x + Math.round(width / 2.0);
                    posStore.y = y - height;
                } else {
                    context.fillStyle = color ? color : this.negBarColor;
                    context.fillRect(x, y, width, height);
                    posStore.x = x + Math.round(width / 2.0);
                    posStore.y = y + height;
                }
            }
        }
    );

})();