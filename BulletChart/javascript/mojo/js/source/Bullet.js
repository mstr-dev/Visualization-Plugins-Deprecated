(function () {

    mstrmojo.requiresCls("mstrmojo.VisBase");

    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
    var CUSTOM_DARK_THEME = 3;
    var CUSTOM_LIGHT_THEME = 4;

    var REFLINE_WIDTH = 4;

    mstrmojo.plugins.BulletChart.Bullet = mstrmojo.declare(

        mstrmojo.VisBase,

        null,

        {

            scriptClass: 'mstrmojo.plugins.BulletChart.Bullet',

            isDrawAxis: false,

            margin: {t: 0, r: 5, b: 0, l: 5},

            showHighlightLine: false,

            themeColor: '#FFFFFF',

            noBackground: true,

            isAnimateLines: false,

            toolTipMain: null,

            mainWidth: 0,

            mainLeftPos: 0,

            showMinLabel: false,

            previousID:"",

            bulletMetric: null,

            tooltip: null,

            markupString: '<div id="{@id}" class="mstrmojo-Chart {@cssClass}" style="width:{@width}px;height:{@height}px;position:relative;" ' +
            ' mstrAttach:mousedown,mouseup,mousemove,mouseover,mouseout,click ' +
            '><canvas width="{@width}" height="{@height}"></canvas>' +
            '<div style="position:absolute;left:0px;bottom:0px;display:none;font:7px Arial;text-align:left;line-height:7px;"></div>' +
            '<div style="width:100%;height:{@height};top:0px;left:0px;position:absolute;display:none;font:10pt Arial;overflow: hidden; text-overflow: ellipsis; white-space:nowrap"></div>' +
            '</div>',

            markupSlots: {
                canvas: function () {
                    return this.domNode.firstChild;
                },
                minLabel: function () {
                    return this.domNode.childNodes[1];
                },
                errorMsg: function () {
                    return this.domNode.childNodes[2];
                }

            },


            onmouseover: function(evt) {
                console.log("MouseOVer");

                this.renderTooltip(evt);
            },

            onmousemove: function(evt) {
                console.log("MouseMove");
                this.renderTooltip(evt);
            },

            onmouseout: function(evt) {
                    //this.handleTouchEnd();
                console.log("MouseOut");

                var canvas = evt.getTarget(),
                    widgetNode = canvas.parentNode,
                    x = evt.e.clientX,
                    y = evt.e.clientY;

                widgetNode.id = this.previousID;

                this.tooltip.style.display = "none";


            },
            renderTooltip: function rndrttp(evt) {

                var canvas = evt.getTarget(),
                    widgetNode = canvas.parentNode,
                    x = evt.e.clientX,
                    y = evt.e.clientY,
                    wdID = widgetNode.id,
                    mrow = widgetNode.getAttribute("mrow"),
                    index = parseInt(mrow, 10);
                if(index < 0){
                    return;
                }
                if(wdID !== "highLightCavNode"){
                    this.previousID = widgetNode.id;
                    widgetNode.id = "highLightCavNode";//enable hightlight hover over area
                }


                var model = this.model,
                    metrics = this.bulletMetric,
                    metricCount = metrics.length;

                // table body
                var table = this.tooltip.firstChild;
                table.innerHTML = '<tr><td class="desc-txt" style="text-align:right; text-decoration:none;white-space:nowrap;padding-top:0px;padding-bottom:8px; padding-left: 8px; padding-right: 0px"></td>'+
                    '<td class="value-txt" style="text-align: left; text-decoration:none;white-space:nowrap;padding-top:0px;padding-bottom:8px; padding-left: 8px; padding-right: 0px"></td></tr>';

                var tbody = this.tooltip.firstChild.firstChild;

                var htr = tbody.firstChild;
                var TooltipRowTemplate = this.TooltipRowTemplate = htr;

                var fragment = document.createDocumentFragment();

                var renderOneRow = function(metricIdx){
                    var metricName = metrics[metricIdx],
                        metricValue = model[metricName].v,
                        tr = TooltipRowTemplate.cloneNode(true),
                        tds = tr.childNodes;
                    if(metricName && metricValue){
                        tds[0].innerHTML = metricName + ":";
                        tds[1].innerHTML = metricValue;
                    }else{
                        tr.style.display = "none";
                    }
                    return tr;
                };

                for (var i = 0; i < metricCount; i++) {
                    var newTR = renderOneRow(i);
                    fragment.appendChild(newTR);
                }
                tbody.innerHTML = "";
                tbody.appendChild(fragment);


                var fnComputePosition = function(){
                    var posX = posWdt.x,//domNode positionx
                        posY = posWdt.y,//domNode positiony
                        posW = posWdt.w,
                        posH = posWdt.h,
                        posEndX = posX + posW,
                        posEndY = posY + posH,
                        w = this.tooltip.offsetWidth,
                        h = this.tooltip.offsetHeight,
                        padding = 6,
                        space = 15;//right and bottom padding for container

                    if(x + padding + w +space < posEndX){
                        this.tooltip.style.left =( x - posX + padding) + "px";
                    }else{
                        this.tooltip.style.left = (x - posX - padding - w) + "px";
                    }

                    if(y + padding + h +space < posEndY){

                        this.tooltip.style.top = (y - posY + padding) + "px";

                    }else{
                        this.tooltip.style.top = (y - posY - padding - h) + "px";

                    }
                };
                var posWdt = mstrmojo.dom.position(this.widget.domNode, true);                //{x:touchX - posWdt.x, y: touchY - posWdt.y}

                this.tooltip.style.display = "block";
                fnComputePosition.call(this);//compute position



            },

            postBuildRendering: function postBR() {
                if (this._super) {
                    this._super();
                }
                this.tooltip = this.widget.tooltip;
                this.context = this.canvas.getContext('2d');
                this.canvas.selection =  this.selection;
                this.setColorByTheme();
                this.drawChart();
            },


            setColorByTheme: function setColorByTheme() {
                var bulletProps = this.config;
                //var dpi = mstrMobileApp && mstrMobileApp.getDeviceDPI() || 160;
                var dpi = 480;
                if (this.theme == DEFAULT_DARK_THEME) {
                    this.bandColor1 = "#3E9CE0";
                    this.bandColor2 = "#5EB3F0";
                    this.bandColor3 = "#95D1FE";

                    this.refLinePosColor = "#FFFFFF";
                    this.refLineNegColor = "#FFFFFF";
                    this.refLineWidth = REFLINE_WIDTH;
                    this.blueBarPosColor = "#F08108";
                    this.blueBarNegColor ='#F08108';
                    //minlabel
                    this.minLabelColor = "#FFFFFF";
                    this.minLabelFontColor = "#FFFFFF";


                } else if (this.theme == DEFAULT_LIGHT_THEME) {
                    this.bandColor1 = "#3E9CE0";//low
                    this.bandColor2 = "#5EB3F0";//medium
                    this.bandColor3 = "#95D1FE";//high

                    this.refLinePosColor = "#333333";//"#FF9900";//Reference Line Color #333333 "rgba(255,153,0, 0.6)"
                    this.refLineNegColor = "#333333"; //"rgba(255,153,0, 0.6)";//"#FF9900";
                    this.refLineWidth = REFLINE_WIDTH; //width set to 4 instead of  2
                    this.blueBarPosColor = "#F08108";//bar color
                    this.blueBarNegColor = '#F08108';//negative color

                    //minlabel
                    this.minLabelColor = "#FFFFFF";
                    this.minLabelFontColor = "#333333";
                } else {
                    this.bandColor1 = bulletProps.mwBand1 || "#999999";
                    this.bandColor2 = bulletProps.mwBand2 || "#BBBBBB";
                    this.bandColor3 = bulletProps.mwBand3 || "#DEDEDE";

                    this.refLinePosColor = bulletProps.mwRefLineCol || '#0066ff';
                    this.refLineNegColor = bulletProps.mwRefLineCol || '#0066ff';
                    this.blueBarPosColor = bulletProps.mwPosCol || '#F08108';
                    this.blueBarNegColor = bulletProps.mwNegCol || '#F08108';
                }
            },



            drawChart: function drwchrt() {
                var bulletProps = this.config;
                var minValue = bulletProps.mfMinValue,//0 ,by default
                    widget = this.widget,
                    metActual = widget.metActual,
                    metsRange = widget.metsRange,
                    metTarget = widget.metTarget;

                var isInverted = bulletProps.mbInvertAxis;
                var hasRefLine = bulletProps.mbRefLine;//whether draw tick
                var hasRefBands = bulletProps.mbRefBands; //whether draw band
                var hasPerformance = true; //whether draw bar
                var mShowTooltip = bulletProps.mbShowTooltip;
                var ctx = this.context;
                var ratioBetweenMetricViewWidth;
                var bulletHeight;
                var bulletMetrics = this.bulletMetric = [];

                var mc3Name =metActual && metActual.length > 0 ? this.IDName[metActual[0].id]: (hasPerformance = false),//not draw
                    mc7Name =metTarget && metTarget.length > 0 ? this.IDName[metTarget[0].id]: (hasRefLine = false),
                    mc4Name,
                    mc5Name,
                    mc6Name,
                    rangeLength = metsRange && metsRange.length > 0 ? metsRange.length: 0 ;

                var mc3, mc4, mc5, mc6, mc7;
                /*
                 * mMc3:bar value
                 * mMc4:high
                 * mMc5:low
                 * mMc6:medium
                 * mMc7:ref line value
                 */
                var mMc3, mMc4, mMc5, mMc6, mMc7;
                if(hasPerformance){

                    var actualMetric = this.model[mc3Name];
                    mMc3 = parseFloat(actualMetric.rv);//rowInfo
                    bulletMetrics[0] = mc3Name;

                    //TODO: for now remove threshold for world, will resume later
                    if(actualMetric.threshold){
                        this.blueBarPosColor = this.blueBarNegColor =actualMetric.threshold.fillColor;
                    }
                }
                if(hasRefLine){
                    mMc7 = parseFloat(this.model[mc7Name].rv);
                    if(bulletMetrics.indexOf(mc7Name) <0 ){
                        bulletMetrics.push( mc7Name);
                    }

                }

                //When there is only one metric in range, use 0.5*range  for Low,  1*Range for Medium, 2*Range for High
                //When there are 3 metrics in Range, use the first one for Med, 2rd for High, 3rd for Low
                if(rangeLength === 0 ){
                    hasRefBands = false;
                }else if(rangeLength === 1 || rangeLength ===2 ){
                    mc6Name = this.IDName[metsRange[0].id];
                    mMc6 = parseFloat(this.model[mc6Name].rv);
                    mMc4 = 2 * mMc6;
                    mMc5 = 0.5 * mMc6;
                    if(bulletMetrics.indexOf(mc6Name) < 0){
                        bulletMetrics.push( mc6Name);
                    }
                    if(rangeLength === 2){
                        mc4Name = this.IDName[metsRange[1].id];
                        if(bulletMetrics.indexOf(mc4Name) < 0){
                            bulletMetrics.push( mc4Name);
                        }
                    }
                }else {
                    mc6Name = this.IDName[metsRange[0].id];
                    mc4Name = this.IDName[metsRange[1].id];
                    mc5Name = this.IDName[metsRange[2].id];
                    if(bulletMetrics.indexOf(mc4Name) < 0){
                        bulletMetrics.push( mc4Name);
                    }
                    if(bulletMetrics.indexOf(mc5Name) < 0){
                        bulletMetrics.push( mc5Name);
                    }
                    if(bulletMetrics.indexOf(mc6Name) < 0){
                        bulletMetrics.push( mc6Name);
                    }

                    mMc4 = parseFloat(this.model[mc4Name].rv);
                    mMc5 = parseFloat(this.model[mc5Name].rv);
                    mMc6 = parseFloat(this.model[mc6Name].rv);
                }


                if(hasPerformance){
                    mc3 = mMc3 - minValue;
                }
                if(hasRefBands){
                    mc4 = mMc4 - minValue;
                    mc5 = mMc5 - minValue;
                    mc6 = mMc6 - minValue;
                }
                if(hasRefLine){
                    mc7 = mMc7 - minValue;
                }




                var minLabelHeight = 7, minLabelWidth;
                var xPadding = 0, yPadding = 9;

                if (hasPerformance && hasRefBands &&(mc3 * mc4 > 0 && Math.abs(mc3) > Math.abs(mc4) || mc4 === 0) ){
                    var err = mstrmojo.desc(10381, 'Metric of Bullet is out of the max graph range');
                    this.errorMsg.innerHTML = err;
                    this.errorMsg.style.display = 'block';
                    this.minLabel.style.display = "none";
                    this.tooltipErrMsg = err;
                    return;
                }
                else {
                    this.errorMsg.style.display = 'none';
                    this.tooltipErrMsg = null;
                }

                var xOri;
                var redComp, greenComp, blueComp;
                var mcOriX, mcOriY;
                var mcHeight, mcWidth;

                if(hasPerformance && hasRefBands){//include Actual/Range/Target, or Actual/Range ; draw as before

                    if (mc3 <= 0 && mc4 >= 0) {
                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc4 - mc3);
                        xOri = xPadding - mc3 * ratioBetweenMetricViewWidth;
                       // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 > mc3 && mc6 < mc4) {
                                mcWidth = (mc6 - mc3) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 > mc3 && mc5 < mc4) {
                                mcWidth = (mc5 - mc3) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                        mcOriX = xPadding;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        if (isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);


                        //draw ref line
                        if (hasRefLine && mc7 >= mc3 && mc7 <= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                           // mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth;//TODO: -2, when mc7 = mc3 or mc4, display ticker
                            if(mc7 > 0){
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth;
                            }else{
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth;
                            }

                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else if (mc3 <= 0 && mc4 < 0) {//"as now, mc3 > mc4, like -3, -4"

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc4));
                        xOri = xPadding;
                       // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        isInverted = !isInverted;//TODO, comment to not change value or  not?

                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 < 0 && mc6 > mc4) {
                                mcWidth = Math.abs(mc6) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 < 0 && mc5 > mc4) {
                                mcWidth = Math.abs(mc5) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                        mcOriX = xPadding;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        if (isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        //draw ref line
                        if (hasRefLine && mc7 <= 0 && mc7 >= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth; //TODO: minus 2; the tick width to display when mc7 = mc4
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            //mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO comment this line, as for by default
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else if (mc3 >= 0 && mc4 > 0) {

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc4;
                        xOri = xPadding;
                        bulletHeight = this.getHeight() - 2 * yPadding;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 > 0 && mc6 < mc4) {
                                mcWidth = mc6 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor2;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 > 0 && mc5 < mc4) {
                                mcWidth = mc5 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor1;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = mc3 * ratioBetweenMetricViewWidth;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        mcOriX = xOri;
                        if (isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        //draw ref line
                        if (hasRefLine && mc7 >= 0 && mc7 <= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth;//TODO: minus 2, to display ticker when equal
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }

                    }
                    else if (mc3 >= 0 && mc4 <= 0) {

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc3 - mc4);
                        //bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        xOri = xPadding - mc4 * ratioBetweenMetricViewWidth;

                        isInverted = !isInverted;

                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 < mc3 && mc6 > mc4) {
                                mcWidth = (mc3 - mc6) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                //mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO: comment this line
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 < mc3 && mc5 > mc4) {
                                mcWidth = (mc3 - mc5) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                               // mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO: comment this line
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                        mcOriX = xOri;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        if (!isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        //draw ref line
                        if (hasRefLine && mc7 <= mc3 && mc7 >= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            if(mc7> 0 ){
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth;//TODO : minus mcWidth to display ticker when equal
                            }else{
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth ;//TODO : display ticker when equal
                            }

                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (!isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }

                }
                else if (hasPerformance && hasRefLine){ // hasRefBands = false, actual/target
                    if(mc3* mc7 > 0 && Math.abs(mc3) > Math.abs(mc7) || mc7 === 0){//Actual
                        if(mc3 >0){ //mc3>0 && mc7 >=0 && mc3 >mc7

                            ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc3;
                            xOri = xPadding;
                            bulletHeight = this.getHeight() - 2 * yPadding;

                            //draw performent bar
                            mcHeight = bulletHeight / 2.0;
                            mcWidth = mc3 * ratioBetweenMetricViewWidth;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            mcOriX = xOri;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            //draw ref line
                            if (hasRefLine && mc7 >= 0 ) {
                                mcHeight = bulletHeight;
                                mcWidth = REFLINE_WIDTH;
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth;
                                mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                                ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        else { // mc3<0 && mc7 <=0

                            ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc3));
                            xOri = xPadding;
                           // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                            bulletHeight = this.getHeight()  - 2 * yPadding ;
                            isInverted = !isInverted;

                            //draw performent bar
                            mcHeight = bulletHeight / 2.0;
                            mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            //draw ref line
                            if (hasRefLine && mc7 <= 0 ) {
                                mcHeight = bulletHeight;
                                mcWidth = REFLINE_WIDTH;
                                mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth;//TODO: minus mcWidth, to display ticker when equal, though here it is not possible to be equal
                                mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                                //mcOriX = this.getWidth() - mcOriX - mcWidth;
                                ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                        }
                    }
                    else if(mc3* mc7 > 0 && Math.abs(mc3) <= Math.abs(mc7) || mc3 === 0){//Target
                        if(mc7 > 0){

                            ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc7;
                            xOri = xPadding;
                            bulletHeight = this.getHeight() - 2 * yPadding;

                            //draw performance bar
                            mcHeight = bulletHeight / 2.0;
                            mcWidth = mc3 * ratioBetweenMetricViewWidth;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            mcOriX = xOri;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw ref line
                            if (hasRefLine && mc7 >= 0 ) {
                                mcHeight = bulletHeight;
                                mcWidth = REFLINE_WIDTH;
                                mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth; //to display target ticker
                                mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                                ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth ; ////to display target ticker
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                        }
                        else{


                            ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc7));
                            xOri = xPadding;
                            //bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                            bulletHeight = this.getHeight()  - 2 * yPadding ;
                            isInverted = !isInverted;

                            //draw performent bar
                            mcHeight = bulletHeight / 2.0;
                            mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                            mcOriX = xPadding; //to display target ticker
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            //draw ref line
                            if (hasRefLine) {
                                mcHeight = bulletHeight;
                                mcWidth = REFLINE_WIDTH;
                                mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth; //TODO: to display target ticker; mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth;
                                mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                                //mcOriX = this.getWidth() - mcOriX - mcWidth;
                                //mcOriX = this.getWidth() - mcOriX - mcWidth ;
                                ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                        }


                    }
                    else{//mc3 * mc7 < 0
                       if(mc3 <0){

                           ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc7 - mc3);
                           xOri = xPadding - mc3 * ratioBetweenMetricViewWidth;
                           //bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                           bulletHeight = this.getHeight()  - 2 * yPadding ;

                           //draw performent bar
                           mcHeight = bulletHeight / 2.0;
                           mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                           mcOriX = xPadding;
                           mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                           ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                           if (isInverted) {
                               mcOriX = this.getWidth() - mcOriX - mcWidth;
                           }
                           this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);


                           //draw ref line
                           if (hasRefLine ) {
                               mcHeight = bulletHeight;
                               mcWidth = REFLINE_WIDTH;
                               mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth; // TODO: minus mcWidth, to display ticker
                               mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                               ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                               if (isInverted) {
                                   mcOriX = this.getWidth() - mcOriX - mcWidth;
                               }
                               this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                           }
                       }
                        else{//mc3 >0
                           //mc3 > 0 && mc7 < 0

                           ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc3 - mc7);
                           //bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                           bulletHeight = this.getHeight()  - 2 * yPadding ;
                           xOri = xPadding - mc7 * ratioBetweenMetricViewWidth;

                           //isInverted = !isInverted;
                           //draw performent bar
                           mcHeight = bulletHeight / 2.0;
                           mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                           mcOriX = xOri;
                           mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                           ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                           if (isInverted) {
                               mcOriX = this.getWidth() - mcOriX - mcWidth;
                           }
                           this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                           //draw ref line
                           if (hasRefLine) {
                               mcHeight = bulletHeight;
                               mcWidth = REFLINE_WIDTH;
                               mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth; //TODO: minus mcWidth, to display ticker
                               mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                               mcOriX = this.getWidth() - mcOriX - mcWidth;//TODO: as isInverted is false by default
                               ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                               if (isInverted) {
                                   mcOriX = this.getWidth() - mcOriX - mcWidth;
                               }
                               this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                           }

                       }

                    }
                }
                else if(hasRefLine && hasRefBands){ //performace = false, target/range
                    if(mc4 >= 0 && mc7 >=0){

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc4;
                        xOri = xPadding;
                        bulletHeight = this.getHeight() - 2 * yPadding;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 > 0 && mc6 < mc4) {
                                mcWidth = mc6 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor2;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 > 0 && mc5 < mc4) {
                                mcWidth = mc5 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor1;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }

                        //draw ref line
                        if (hasRefLine && mc7 >= 0 && mc7 <= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth; //TODO: minus mcWidth to display ticker when equal
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else if(mc4 >= 0 && mc7 < 0){


                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc4 - mc7);
                        xOri = xPadding - mc7 * ratioBetweenMetricViewWidth;
                       // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 > mc3 && mc6 < mc4) {
                                mcWidth = (mc6 - mc3) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 > mc3 && mc5 < mc4) {
                                mcWidth = (mc5 - mc3) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }


                        //draw ref line
                        if (hasRefLine ) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            // mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth;//TODO: -2, when mc7 = mc3 or mc4, display ticker

                            mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else if(mc4 <0 && mc7 >=0){

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (mc7 - mc4);
                       // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        xOri = xPadding - mc4 * ratioBetweenMetricViewWidth;

                        isInverted = !isInverted;

                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 < mc7 && mc6 > mc4) {
                                mcWidth = (mc7 - mc6) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                //mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO: comment this line
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 < mc7 && mc5 > mc4) {
                                mcWidth = (mc7 - mc5) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                // mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO: comment this line
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }

                        //draw ref line
                        if (hasRefLine ) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth;//TODO : minus mcWidth to display ticker when equal
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (!isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else{
                        //mc4 <0 , mc7<0


                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc4));
                        xOri = xPadding;
                       // bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        isInverted = !isInverted;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 < 0 && mc6 > mc4) {
                                mcWidth = Math.abs(mc6) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 < 0 && mc5 > mc4) {
                                mcWidth = Math.abs(mc5) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                        //draw ref line
                        if (hasRefLine && mc7 <= 0 && mc7 >= mc4) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth; //TODO: minus mcWidth, to display ticker
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            //mcOriX = this.getWidth() - mcOriX - mcWidth; //TODO: comment this line
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }

                }
                else if(hasRefBands){//Range

                    if(mc4 > 0){

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc4;
                        xOri = xPadding;
                        bulletHeight = this.getHeight() - 2 * yPadding;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 > 0 && mc6 < mc4) {
                                mcWidth = mc6 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor2;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 > 0 && mc5 < mc4) {
                                mcWidth = mc5 * ratioBetweenMetricViewWidth;
                                mcOriX = xOri;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                ctx.fillStyle = this.bandColor1;
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }


                    }
                    else{ //mc4 < 0


                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc4));
                        xOri = xPadding;
                      //  bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        isInverted = !isInverted;
                        //draw ref bands
                        if (hasRefBands) {
                            mcHeight = bulletHeight;

                            //draw the high band
                            mcWidth = this.getWidth() - 2 * xPadding;
                            mcOriX = xPadding;
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.bandColor3;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                            //draw the middle band
                            if (mc6 < 0 && mc6 > mc4) {
                                mcWidth = Math.abs(mc6) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor2;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }

                            //draw the low ref band
                            if (mc5 < 0 && mc5 > mc4) {
                                mcWidth = Math.abs(mc5) * ratioBetweenMetricViewWidth;
                                mcOriX = xPadding;
                                ctx.fillStyle = this.bandColor1;
                                if (isInverted) {
                                    mcOriX = this.getWidth() - mcOriX - mcWidth;
                                }
                                this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                            }
                        }
                    }
                }
                else if(hasRefLine){//Target
                    if(mc7 > 0){

                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc7;
                        xOri = xPadding;
                        bulletHeight = this.getHeight() - 2 * yPadding;
                        //draw ref line
                        if (hasRefLine ) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + mc7 * ratioBetweenMetricViewWidth - mcWidth;// minus tick width, to display tick
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }
                    }
                    else{


                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc7));
                        xOri = xPadding;
                     //   bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        isInverted = !isInverted;

                       //draw ref line
                        if (hasRefLine ) {
                            mcHeight = bulletHeight;
                            mcWidth = REFLINE_WIDTH;
                            mcOriX = xOri + Math.abs(mc7) * ratioBetweenMetricViewWidth - mcWidth;//minus mcWidth
                            mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                            //mcOriX = this.getWidth() - mcOriX - mcWidth;//TODO: comment this line
                            ctx.fillStyle = this.refLineColor = mMc3 >= 0 ? this.refLinePosColor : this.refLineNegColor;
                            if (isInverted) {
                                mcOriX = this.getWidth() - mcOriX - mcWidth;
                            }
                            this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                        }

                    }

                }
                else if(hasPerformance){//Performance
                    if(mc3 > 0){
                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / mc3;
                        xOri = xPadding;
                        bulletHeight = this.getHeight() - 2 * yPadding;

                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = mc3 * ratioBetweenMetricViewWidth;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        mcOriX = xOri;
                        if (isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                    }
                    else{


                        ratioBetweenMetricViewWidth = (this.getWidth() - 2 * xPadding) / (Math.abs(mc3));
                        xOri = xPadding;
                     //   bulletHeight = this.getHeight() - minLabelHeight - 2 * yPadding - 2;
                        bulletHeight = this.getHeight()  - 2 * yPadding ;
                        isInverted = !isInverted;

                        //draw performent bar
                        mcHeight = bulletHeight / 2.0;
                        mcWidth = Math.abs(mc3) * ratioBetweenMetricViewWidth;
                        mcOriX = xPadding;
                        mcOriY = (bulletHeight) / 2 - mcHeight / 2 + yPadding;
                        ctx.fillStyle = this.targetColor = mMc3 >= 0 ? this.blueBarPosColor : this.blueBarNegColor;
                        if (isInverted) {
                            mcOriX = this.getWidth() - mcOriX - mcWidth;
                        }
                        this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                    }
                }



                ///////////the black line if necessary///////////////
                if (hasPerformance && mc3 < 0 ) {
                    mcHeight = bulletHeight;
                    mcWidth = 1;
                    mcOriX = xOri;
                    mcOriY = yPadding;
                    redComp = 0;
                    greenComp = 0;
                    blueComp = 0;



                    if (isInverted) {
                        mcOriX = this.getWidth() - mcOriX - mcWidth;
                    }

                    ctx.fillStyle = this.minLabelColor;
                    //this.drawRect(ctx, mcOriX, mcOriY, mcWidth, mcHeight);
                    this.drawLine(ctx, mcOriX, mcOriY, mcWidth, mcHeight);

                    //here, show the label
                    minValue = minValue + "";
                    var disPlayValue = (minValue == "0") ? "" : "$";//"$";
                    var mlen = 0;
                    for (var i = 0; i < minValue.length; i++) {
                        if (minValue[i] == '.') {
                            break;
                        }
                        mlen++;
                    }
                    for (var i = 0; i < minValue.length; i++) {
                        disPlayValue += minValue[i];
                        mlen--;
                        if (mlen % 3 == 0 && mlen > 0) {
                            disPlayValue += ",";
                        }
                    }
                    minValue = disPlayValue;
                    var minLabelStyle = this.minLabel.style;

                    minLabelStyle.fontFamily = "Arial";
                    minLabelStyle.fontSize = "7pt";
                    minLabelStyle.fontStyle = "normal";

                    //getTextWidthByCanvas: function gtwCvs(text, elem, fontStyle, withPadding, paddingLeft, paddingRight) {
                    var textWidth = this.getTextWidthByCanvas(minValue, this.minLabel,minLabelStyle, false);
                   // var textWidth = 20;
                    minLabelWidth = textWidth ;

                    mcOriX = xOri;

                    if (isInverted) {
                        mcOriX = this.getWidth() - mcOriX - mcWidth;
                    }
                    if (mcOriX - minLabelWidth / 2 <= xPadding) {
                        this.minLabel.style.paddingLeft = xPadding;
                    } else if (mcOriX + minLabelWidth / 2 <= this.getWidth() - xPadding) {
                        this.minLabel.style.paddingLeft = Math.round(mcOriX - minLabelWidth / 2) + "px";
                    }
                    else {
                        this.minLabel.style.paddingLeft = Math.round((this.getWidth() - xPadding - minLabelWidth)) + "px";
                    }

                   // this.minLabel.style.bottom = yPadding + "px";
                    this.minLabel.style.bottom = 2 + "px";


                    if (this.minLabelFontColor) {
                        this.minLabel.style.color = this.minLabelFontColor;
                    } else {
                        this.minLabel.style.color = "";
                    }
                    this.minLabel.innerHTML = minValue;
                    this.minLabel.style.display = "block";

                }
                else {
                    this.minLabel.style.display = "none";
                }

            },

            convertColor: function convrtClr(ngv) {
                var ret = "#";
                var base = parseInt("0xff");
                var blueComp = ngv & base;
                base = parseInt("0xff00");
                var greenComp = ((ngv & base) >> 8);
                base = parseInt("0xff0000");
                var redComp = ((ngv & base) >> 16);
                var redP = redComp.toString(16);
                if (redP.length < 2) {
                    redP = "0" + redP;
                }

                var greenP = greenComp.toString(16);
                if (greenP.length < 2) {
                    greenP = "0" + greenP;
                }

                var blueP = blueComp.toString(16);
                if (blueP.length < 2) {
                    blueP = "0" + blueP;
                }
                ret += redP;
                ret += greenP;
                ret += blueP;
                return ret;
            },

            drawRect: function (ctx, x, y, width, height) {
                // xiawang: remove the anti-aliasing effect by rounding to integer
                x = Math.round(x);
                y = Math.round(y);
                width = Math.round(width);
                height = Math.round(height);
                ctx.fillRect(x, y, width, height);
            },

            drawLine: function (ctx, x, y, width, height) {
                // xiawang: remove the anti-aliasing effect by rounding to integer
                x = Math.round(x);
                y = Math.round(y);
                width = Math.round(width);
                height = Math.round(height);
                //ctx.fillRect(x, y, width, height);
                ctx.setLineDash([1,2,3,5,6,7,9,10,11]);
                ctx.lineWidth=width;

                ctx.beginPath();
                ctx.moveTo(x,y);
                ctx.lineTo(x,y+height);
                //ctx.lineTo(50,100);
                ctx.strokeStyle =this.minLabelColor;
                ctx.stroke();
                ctx.closePath();
            },

            reDrawChart: function reDrwchart() {
                var context = this.context,
                    canvas = this.canvas,
                    wd = canvas.width,
                    ht = canvas.height;
                context.clearRect(0, 0, wd, ht);
                this.postBuildRendering();
            },


            /**
             *
             * @param text the string to meature
             * @param elem the element which provide the computed style used to meatrue text width
             */
            getTextWidthByCanvas: function gtwCvs(text, elem, fontStyle, withPadding, paddingLeft, paddingRight) {
                var canvas = this.widget.canvasText;

                var context = canvas.getContext('2d');

                var computedStyle = mstrmojo.css.getComputedStyle(elem);
                    //fontStyle = this.utils.getComputedFontStyle(computedStyle);
                context.font = fontStyle;
                context.textAlign = 'center';
                context.fillStyle = 'blue';
                // get text metrics
                var metrics = context.measureText(text);
                var result = metrics.width;
                if (withPadding) {
                    result += paddingLeft;
                    result += paddingRight;
                }
                return result;
            }

        }
    );

})();
//@ sourceURL=Bullet.js