(function () { 
    if (!mstrmojo.plugins.BulletChart) {
        mstrmojo.plugins.BulletChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.plugins.BulletChart.Bullet",
        "mstrmojo.ui._HasScroller"
    );

    var $ARR = mstrmojo.array,
        $CLR = mstrmojo.color,
        $CSS = mstrmojo.css;


    var textAlign = { //  we must use class for text-align, otherwise
        // there is conflict between inherited format
        left: "bulletchart-table-text-L",
        center: "bulletchart-table-text-M",
        right: "bulletchart-table-text-R"
    };



    //column type
    var ATTR_NAME = 0,//attribute
        METRIC_NAME = 1,//title : metrics, this case for now is not used, when attribute is none
        METRIC_VALUE = 2,// KPI, metric
        CHART = 3, //Bullet Chart
        TREE_TRIANGLE = 4,
        DROP_SHADOW = 5;

    var METRICS = [],
        METRIC_INDEX = [],
        ID_NAME = {},
        linkCount = 0,
        attrCount = 0,
        ROWCOUNT = 0,
        metricCount = [];//record, each dropzone metric number


    //how many page we render at one time
    var PAGE_COUNT = 5;

    var TRIANGLE_WIDTH = 30;

    var CHART_MIN_WIDTH = 193;
    //padding added to column widths when smooth scroll is enable
    var paddingForSS = 10;
    var colWidthForChart = 150;
    var maxColWidthForAttr = 150;
    var maxColWidthForMetric =  150;
    var adjustWidthForColumnValue =40;
    var paddingForScroller = 18;//Y-Scrooler

    var ROW_HEIGHT,
        ROW_HEIGHT_FOR_CHART;


    var DEFAULT_DARK_THEME = 1;
    var DEFAULT_LIGHT_THEME = 2;
    var CUSTOM_DARK_THEME = 3;
    var CUSTOM_LIGHT_THEME = 4;

    var DARK_THEME_CLASS = "mojo-theme-dark",
        LIGHT_THEME_CLASS = "mojo-theme-light";


    /**
     * this.theme
     */
    function getUITheme() {
        //var ct = this.model.data && this.model.data.vp && this.model.data.vp.ct;//Not work now
        var themeClass = mstrApp && mstrApp.getThemeClassName(),
            ct ;
        if (!themeClass || themeClass === "") {
            //TQMS 775783
            //var newlyCreated = Object.keys(this.model.vp).length === 0;
           ct = "2";
        }
        if(themeClass == DARK_THEME_CLASS){
            ct = "1"
        }else{
            ct = "2";
        }
        this.theme = parseInt(ct, 10);


        if (this.theme === 1) {
            //default dark theme
            this.legendColor = '#353739';
        } else {
            this.theme = 2;
            //default light theme
            this.legendColor = '#EEEEEE';
        }
    }


    /**
     * calculate column width, decide whether we will use smooth scroll mode
     * update colIdx so that it consistent with idx in colInfos
     */
    function updateColumnWidth() {

        var colInfos = this.colsInfo,
            legendOffsetWidth = this.legend.offsetWidth,
            legendWidth = legendOffsetWidth ? legendOffsetWidth+ 10: 0,//10 for padding
            //width = this.getWidth() - legendWidth - paddingForScroller - 1,//1 for table border: left 1px
            width = this.getWidth() - legendWidth - 1,//1 for table border: left 1px
            colLen = colInfos.length,
            colInfo,
            colType,
            colWidth,
            bulletChartIndex = -1,
            rows = this.rows,
            i,
            j;
            /*
             * sampling the first 50 rows of data( include column header )
             * Include all levels of the tree mode, not just the topmost( expanded level) during this calculation
             */
            var rowCount = Math.min(rows.length, 50);


        for(j=0; j <colLen; j ++){
            colInfo = colInfos[j];
            colType = colInfo.type;
            colWidth = colInfo.colWidth;
            if(colType === CHART){
                bulletChartIndex = j;
                colInfos[bulletChartIndex - 1].valueCssClass = textAlign.right;
                break;
            }
        }

            for ( j = 0; j < colLen; j++) {
                colInfo = colInfos[j];
                colType = colInfo.type;
                if (colType == ATTR_NAME || colType == METRIC_NAME || colType == METRIC_VALUE) {
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


                    var maxColumnHeaderW = this.getTextWidth(headerStr, colInfo.headerCssClass, "Arial,regular", "8", "pt", false);

                    var finalColumnW = maxColumnHeaderW > maxColumnValueW? maxColumnHeaderW: maxColumnValueW;
                    /*if (maxColumnValueW > maxColumnHeaderW) {
                        //finalColumnW = Math.min(maxColumnValueW, maxColWidthForMetric);
                        finalColumnW = maxColumn
                    } else {
                        finalColumnW = Math.min(maxColumnValueW + adjustWidthForColumnValue, maxColumnHeaderW, maxColWidthForMetric);
                    }*/

                    colInfo.colWidth = Math.round(finalColumnW + 20 + 1);//left padding, right padding, and border
                    colInfo.padding.left = 10;
                    colInfo.padding.right = 10;
                } else {
                    //chart
                    //bulletChartIndex = j;
                    colInfo.colWidth = CHART_MIN_WIDTH + 1;//Minimum Bullet Chart Width, and border 1px
                    colInfo.padding.left = 0;
                    colInfo.padding.right = 0;
                }
            }

        //calculate Attribute group Width and Metric group Width. to reset chart Width
        var attrWidth =0,
            metricWidth = 0;
        for(var j=0; j <colLen; j ++){
            colInfo = colInfos[j];
            colType = colInfo.type;
            colWidth = colInfo.colWidth;
            if(colType == ATTR_NAME){
                attrWidth = attrWidth + colWidth;
            }else if(colType == METRIC_NAME || colType == METRIC_VALUE){
                metricWidth = metricWidth + colWidth;
            }
        }
        if(bulletChartIndex >=0 ){//draw bullet chart
            //adjust the most-right chart to right
            //colInfos[bulletChartIndex - 1].valueCssClass = textAlign.right;
            if(attrWidth + metricWidth + CHART_MIN_WIDTH + 1  < width){// reset bullet chart width value
                colInfos[bulletChartIndex].colWidth = width - attrWidth - metricWidth;//reset bullet chart width as the remaining width
            }
        }

       // this.chartTableContainerNode.style.width = (width + paddingForScroller + 1) + "px";
        this.chartTableContainerNode.style.width = (width +  1+1) + "px";

    }

    function getContentOffsetWidth(rows, rowIdx, colIdx) {
        var rowInfo = rows[rowIdx],
            colInfos = this.colsInfo,
            colInfo = colInfos[colIdx],
            col = rowInfo[colIdx],
            colType = colInfo.type;
        if (colType == ATTR_NAME || colType == METRIC_NAME|| colType == METRIC_VALUE) {

            return this.getTextWidth(col.title, colInfo.valueCssClass, "Arial,regular", "8", "pt", false);//, true);
        }

        return 0;

    }

    /**
     * for convereted document, if dz is suitable for bullet, render bullet chart as dashboard bulletchart
     * or, if dz is not suitable, render bullet chart as newly created bulletchart, this case could happen,
     * when converted from a pie VI to document and then change widget to bullet chart
     *
     * @param dz
     */
    function validateDocumentDZ(dz){

        function isEmpty(obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true && JSON.stringify(obj) === JSON.stringify({});
        }

        var result = true,
            dz_map = [
            'XAxis',
            'YAxis',
            'BreakBy',
            'SliceBy',
            'ColorBy',
            'SizeBy',
            'AdditionalMetrics',
            'AngleBy', // AngleBy
            'Grp', // Grp
            'Geo', // Geo
            'layout', // layout
            'from', // from
            'to', // to
            'itemsz', // itemsz
            'Lat', // Lat
            'Long' // Long
        ];
        dz_map.forEach(function(element, index){
            if(dz.hasOwnProperty(element)){//First: must contain all these 19 items
                var zoneItem = dz[element];
                //SliceBy Metric--->Range, XAxis Unit; YAxis Metric-->Actual; ColorBy Metric-->KPI; BreakBy Metric---->Tareget
                switch (index){
                    case 0://For Category, it should be attribute
                        if(zoneItem.TemplateMetric){
                            result = false;
                        }
                        break;
                    case 1:
                    case 2://For Actual and Target, there should be no more than 1 metric
                        if(zoneItem.TemplateMetric && zoneItem.TemplateMetric.length >1 || zoneItem.TemplateUnit){
                            result = false;
                        }
                        break;
                    case 3://For Range, there should be no more than 3 metric
                        if(zoneItem.TemplateMetric && zoneItem.TemplateMetric.length >3 || zoneItem.TemplateUnit){
                            result = false;
                        }
                        break;
                    case 4://For KPI, it should be metric
                        if(zoneItem.TemplateUnit){
                            result = false;
                        }
                        break;
                    default ://index >4
                        if(!isEmpty(zoneItem)){//Second: for the last 14, it should be null
                            result = false;
                        }
                }
            }else{
                result = false;
            }
        });
        return result;
    }



    mstrmojo.plugins.BulletChart.BulletChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        // Mixins
        [mstrmojo.ui._HasScroller],
        {
            scriptClass: "mstrmojo.plugins.BulletChart.BulletChart",
            cssClass: "bulletchart",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: null,
            useRichTooltip: false,
            reuseDOMNode: false,

            valueCssClass: " ",
            colsInfo : [],
            legendDis:{},
            advancedModel:[],
            rows:null,

            legendColor:"",
            backgroundColor:"",

            setupScrollNodes: function setupScrollNodes() {
                this.scrollNode = this.itemsContainerNode;
            },

            showGauge: false,//show bullet chart
            bulletProps:{},
            otherProps:{},
            showKPI: false,//Show KPI
            theme: DEFAULT_LIGHT_THEME,
            metActual: {},
            metTarget:{},
            metsKPI:{},
            metsRange:{},

            previousSelectedNode:null,
            previousClassName: "",
            hoverNode: null, //<tr></tr>

            onclick : function(evt){

               console.log("click");
               var target = evt.getTarget(),
                   selection =  target.selection,
                   row =  target.getAttribute("mrow"),
                   previousNode = this.previousSelectedNode,
                   previousClassName = this.previousClassName,
                   classValue = "";


                if(selection) {

                    if( row === null ){
                        var canvas = evt.getTarget();
                        target = canvas.parentNode.parentNode;
                        row =  target.getAttribute("mrow");
                    }

                    if(row && row >= 0){
                        if(previousNode){//second click

                            if(previousNode !== target){//new Node

                                //reset previousNode
                                previousNode.setAttribute("class", previousClassName);

                                //set New Node; reset previousclassname
                                previousClassName = this.previousClassName = target.getAttribute("class");//td
                                classValue = previousClassName + " selectedTableCell";
                                target.setAttribute("class", classValue);
                                this.previousSelectedNode = target;
                            }else{ //same Node

                                //reset previousNode
                                previousNode.setAttribute("class", previousClassName);

                                previousNode = this.previousSelectedNode = null;
                                selection = null; //clear selection
                               }

                        }
                        else{//first click
                            previousClassName = this.previousClassName = target.getAttribute("class");//td
                            classValue = previousClassName + " selectedTableCell";
                            target.setAttribute("class", classValue);
                            this.previousSelectedNode = target;
                        }
                    }

                    this.applySelection(selection);
                }


                if(!selection ){// click twice or some invalid place, selection == null
                    if(previousNode) {
                        previousNode.setAttribute("class", previousClassName);
                        previousNode = this.previousSelectedNode = null;
                    }
                    this.clearSelections();
                    this.endSelections();
                }
            },

            onmouseover: function(evt){
                console.log("mouse over");

                var target = evt.getTarget(),
                    row =  target.getAttribute("mrow");

                if(row === null){//assume target == canvas
                    target = target.parentNode.parentNode;//target = canvas node
                    row = target.getAttribute("mrow");
                }

                if(row && row >= 0){//table td
                    var parentRow = target.parentNode;
                    parentRow.setAttribute("class", "hoverOverRow");
                    this.hoverNode = parentRow;
                }
            },

            onmouseout: function(evt){
              console.log("mouse out");
              var target = evt.getTarget(),
                    row =  target.getAttribute("mrow");

                if(row === null){//assume target == canvas
                    target = target.parentNode.parentNode;//target = canvas node
                    row = target.getAttribute("mrow");
                }

               if(row && row >= 0){//table td
                   this.hoverNode.removeAttribute("class")
              }
            },



            initModel: function initModel() {
                //this.rows = [];
                METRICS = [];
                METRIC_INDEX = {};
                ID_NAME = {};
                attrCount = 0;
                linkCount  = 0;
            },

            convertDataToModels: function(){
                this.initModel();
                var m = this.model.data,
                    cols = m.gts.col,
                    rows = m.gts.row;

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
                    if (cols[i].n == "Metrics") {
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
            },

            buildColsInfo: function(){
                var dzModel = this.zonesModel,
                    attsCategory,
                    metActual = [],
                    metTarget = [],
                    metsRange = [],
                    metsKPI = [],
                    colsInfoIndex = 0,
                    modelData = this.model.data,
                    modelGts = modelData.gts,
                    dataDz = modelData.dz,
                    me = this;

                me.colsInfo = [];

                if(dzModel){//VI dashboard
                    attsCategory = dzModel.getDropZoneObjectsByName("Category");
                    metActual = this.metActual = dzModel.getDropZoneObjectsByName("Actual");
                    metTarget = this.metTarget = dzModel.getDropZoneObjectsByName("Target");
                    metsRange = this.metsRange = dzModel.getDropZoneObjectsByName("Range");
                    metsKPI = this.metsKPI = dzModel.getDropZoneObjectsByName("KPI");
                }else if(dataDz && validateDocumentDZ(dataDz)) {//converted document directly from dashboard
                    attsCategory = dataDz.XAxis.TemplateUnit;
                    metActual = this.metActual = dataDz.YAxis.TemplateMetric;
                    metTarget =  this.metTarget = dataDz.BreakBy.TemplateMetric;
                    metsRange = this.metsRange = dataDz.SliceBy.TemplateMetric;
                    metsKPI =this.metsKPI =  dataDz.ColorBy.TemplateMetric;
                }else{//newly-created document, or converted document, but change display widget
                    attsCategory = modelGts.row;
                    for(var index=0; index<modelGts.col.length; index++){
                        var tmpCol = modelGts.col[index];
                        if(tmpCol.n === "Metrics"){//ingore column attribute
                            var gtsCols = tmpCol.es,
                                index = 0,
                                i;
                            for(i = 0; i < metricCount[0] ; i ++){
                                metActual.push(gtsCols[index++]);
                                metActual[i].id = metActual[i].oid;
                            }
                            for(i =0; i < metricCount[1]; i++){
                                metTarget.push(gtsCols[index ++]);
                                metTarget[i].id = metTarget[i].oid;
                            }
                            for(i = 0; i< metricCount[2];i++){
                                metsRange.push(gtsCols[index ++]);
                                metsRange[i].id = metsRange[i].oid;
                            }
                            for(i = 0; i< metricCount[3]; i ++){
                                metsKPI.push(gtsCols[index ++]);
                                metsKPI[i].id = metsKPI[i].oid;
                            }
                            this.metActual = metActual;
                            this.metTarget = metTarget;
                            this.metsRange = metsRange;
                            this.metsKPI = metsKPI;
                        }
                    }
                }


                //Attribute
                $ARR.forEach(attsCategory, function(category){
                    var colInfo = {
                        order: category.id,
                        colWidth: 0,
                        padding: {},
                        headerCssClass: " ",
                        valueCssClass: " "
                    };
                    //associate attributes is attributes that will always highlight together with this attributes
                    //e.g. different attribute forms or treeNode and the triangle before it
                    colInfo.associateAttr = [];
                    colInfo.type = ATTR_NAME;
                    colInfo.title = ID_NAME[category.id];
                    colInfo.titleAlign = textAlign.center;
                    colInfo.valueCssClass = textAlign.center;
                    colInfo.headerCssClass = textAlign.center;
                    colInfo.colIdx = colsInfoIndex;
                    me.colsInfo[colsInfoIndex ++] = colInfo;
                });

                //Bullet Chart
                if(metricCount[0] > 0 || metricCount[1] > 0 || metricCount[2]> 0){
                    var colInfo = {
                        order: "GaugeChart",
                        colWidth: 0,
                        padding: {},
                        headerCssClass: " "
                    };
                    colInfo.type = CHART;
                    colInfo.title = this.bulletProps.mstrHeader || (metricCount[1] > 0 && metricCount[0] > 0 ? (ID_NAME[metActual[0].id]+" & " + ID_NAME[metTarget[0].id]) : ((metricCount[0] > 0) ? ID_NAME[metActual[0].id] : ((metricCount[1] > 0)? ID_NAME[metTarget[0].id]: "")));
                    colInfo.titleAlign = textAlign.center;
                    colInfo.padding.left = 0;
                    colInfo.padding.right = 0;
                    colInfo.colIdx = colsInfoIndex;
                    colInfo.headerCssClass = textAlign.center;
                    /*if (cols[metricColIdx] && cols[metricColIdx].lm && cols[metricColIdx].lm[index].links) {
                        colInfo.lm = cols[metricColIdx];
                        linkCount++;
                    }*/
                    me.colsInfo[colsInfoIndex ++] = colInfo;
                }

                //KPI Metric
                if(metsKPI.length > 0){
                    $ARR.forEach(metsKPI, function(kpi){
                        var colInfo = {
                            //order: "GaugeChart",
                            colWidth: 0,
                            padding: {},
                            headerCssClass: " ",
                            valueCssClass: ""

                        };
                        colInfo.order = kpi.id;
                        colInfo.type = METRIC_VALUE;
                        //var index = kpi.id ;

                        //metric id, used for sort
                        colInfo.mid =  kpi.id;
                        colInfo.titleAlign = textAlign.center; // default to right
                        colInfo.valueCssClass = textAlign.right;
                        colInfo.title = ID_NAME[kpi.id];
                        colInfo.colIdx = colsInfoIndex;
                        colInfo.headerCssClass = textAlign.center;
                        me.colsInfo[colsInfoIndex ++ ] = colInfo;
                    });
                }
            },



            initVisProp: function() {
                var bulletProps = this.bulletProps = {};
                bulletProps.mbShow = false;
                bulletProps.mbRefLine = true;
                bulletProps.mbRefBands = true;
                bulletProps.mbShowLegend = false;//by default false, only there is range ,then display
                bulletProps.mbAssMetric = true;
                bulletProps.mbInvertAxis = false;
                bulletProps.mbShowTooltip = true;
                bulletProps.mfMinValue = 0;


                bulletProps.refLinePosColor = "#333333";//Reference Line Color
                bulletProps.refLineNegColor = "#333333";
                bulletProps.refLineWidth = 4; //width set to 4 instead of  2
                bulletProps.blueBarPosColor = "#00548D";//bar color
                bulletProps.mwNegCol = "BE3A3E";//negative color
                bulletProps.bandColor1 = "#3E9CE0";//low
                bulletProps.bandColor2 = "#5EB3F0";//medium
                bulletProps.bandColor3 = "#95D1FE";//high

                bulletProps.mstrHeader = "";//NON Title
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
                otherProps.mRowHeight = 46;//content height
                otherProps.mRowTitleHeight = 35;//title height
                //        if(this.isAndroidTab){
                //            otherProps.mRowHeight = 29;
                //        }else{
                //            otherProps.mRowHeight = 48;
                //        }

                //-1 for the height of the dividing line
               // ROW_HEIGHT = (otherProps.mRowHeight - 1) + 'px';
                ROW_HEIGHT = (otherProps.mRowHeight - 1) + 'px';
                ROW_HEIGHT_FOR_CHART = (otherProps.mRowHeight - 2) + 'px';


                var LEGEND = bulletProps.LEGEND = {};
                LEGEND.color = "#747474";
                LEGEND.fontWeight = "normal";
                LEGEND.fontStyle = "normal";
                LEGEND.textDecoration = "none";
                LEGEND.fontFamily = "Arial";
                LEGEND.fontSize = "8pt";
                LEGEND.opacity = 1;


            },

            setColorByTheme: function setColorByTheme() {
                var bulletProps = this.bulletProps;

                getUITheme.call(this);
                if (this.theme == DEFAULT_DARK_THEME) {
                    this.bandColor1 = "#3E9CE0";
                    this.bandColor2 = "#5EB3F0";
                    this.bandColor3 = "#95D1FE";

                    this.refLinePosColor = "#FFFFFF";
                    this.refLineNegColor = "#FFFFFF";
                    this.refLineWidth = 4;
                    this.blueBarPosColor = "#00548D";
                    this.blueBarNegColor = bulletProps.mwNegCol;


                    //this.legendTextColor = 'white';
                } else if (this.theme == DEFAULT_LIGHT_THEME) {
                    this.bandColor1 = "#3E9CE0";//low
                    this.bandColor2 = "#5EB3F0";//medium
                    this.bandColor3 = "#95D1FE";//high

                    this.refLinePosColor = "#333333";//Reference Line Color
                    this.refLineNegColor = "#333333";
                    this.refLineWidth = 4; //width set to 4 instead of  2
                    this.blueBarPosColor = "#00548D";//bar color
                    this.blueBarNegColor = bulletProps.mwNegCol;//negative color

                } else {
                    this.bandColor1 = bulletProps.mwBand1 || "#3E9CE0";
                    this.bandColor2 = bulletProps.mwBand2 || "#5EB3F0";
                    this.bandColor3 = bulletProps.mwBand3 || "#95D1FE";

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
                    this.legend.style.fontSize = Math.round(8 ) + "pt";
                    this.legend.style.backgroundColor = this.legendColor;
                    //this.setElementDimension(this.legend, this.getWidth());
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


                    //this.legendHeight = 150;
                    //this.legend.style.height = this.legendHeight + "px";

                } else {
                    this.legend.style.display = "none";
                    this.legendHeight = 0;
                }
            },

            initLegend: function(){

                var bulletProps = this.bulletProps;

                this.setColorByTheme();

                this.legendDis = this.showGauge && this.bulletProps.mbShowLegend;


                if (!this.legendDis) {
                    return;
                }



                //GMUTIL.destroyDisposable(this, this.legend);
                var BULLETPROPS = this.bulletProps,
                    legend = new mstrmojo.gm.GMLegend({
                        widget: this,
                        placeholder: this.legend,
                        styles: BULLETPROPS.LEGEND,
                        currDockedPositionIdx:2,
                        model: this.model
                    });

                legend.render();
                legend.parent = this;
               // this._legend = this.addDisposable(legend);
                this.legend = legend.domNode;
            },

            renderBulletChart: function(){

                this.renderLegend();
                this.buildRows(); //for update ColumnWidth, this.rows. including ,title and selection

                updateColumnWidth.call(this); //colInfos[i].colWidth

                var colLen = this.colsInfo.length;


                // table body
                var tbody = this.chartTable.firstChild;
                var htr = tbody.firstChild;
                var rowTmpl = tbody.childNodes[1];

                var th0 = htr.firstChild;
                var td0 = rowTmpl.firstChild;
                //build one row in headerTable and rowTmpl
                for (var i = htr.childNodes.length; i < colLen; i++) {
                    htr.appendChild(th0.cloneNode(true));
                    rowTmpl.appendChild(td0.cloneNode(true));
                }
                this.rowTemplate = rowTmpl;

                var fnSD = function (e, width, height, nopadding) {
                    e.style.width =  width  + 'px';//including padding
                    e.style.height = height + 'px';
                    if(!nopadding){
                        e.style.maxWidth = (width - 20)  + 'px';
                    }else{
                        e.style.maxWidth = width   + 'px';
                    }

                };
                // header ths
                var ths = htr.childNodes;
                // body tds
                var tds = rowTmpl.childNodes;

                for (var i = 0; i < colLen; i++) {
                    var colInfo = this.colsInfo[i];
                    colInfo.thRef = ths[i];
                    ths[i].innerHTML = colInfo.title ? colInfo.title : '';
                    if (colInfo.padding.left != undefined) {
                        tds[i].style.paddingLeft = colInfo.padding.left + "px";
                        ths[i].style.paddingLeft = colInfo.padding.left + "px";
                    }
                    if (colInfo.padding.right != undefined) {
                        tds[i].style.paddingRight = colInfo.padding.right + "px";
                        ths[i].style.paddingRight = colInfo.padding.right + "px";
                    }
                    ths[i].className = colInfo.headerCssClass;
                        //use this.valueCssClass as we need its padding value if inherit from grid/graph
                    tds[i].className = colInfo.valueCssClass + " " + this.valueCssClass;

                    if (colInfo.type == ATTR_NAME || colInfo.type == METRIC_NAME) {
                        this.bodyFontColorRGB = this.valueCssClass && $CLR.rgbStr2rgb(mstrmojo.css.getStyleValue(tds[i], 'color'));
                    }
                    if(colInfo.type !== CHART){
                        fnSD(ths[i], colInfo.colWidth, this.otherProps.mRowTitleHeight-1); //-1 for the height of the dividing line
                        fnSD(tds[i], colInfo.colWidth, this.otherProps.mRowHeight-1);
                    }else{
                        fnSD(ths[i], colInfo.colWidth, this.otherProps.mRowTitleHeight-1, true);
                        fnSD(tds[i], colInfo.colWidth, this.otherProps.mRowHeight-1, true);
                    }


                    /*ths[i].style.wordBreak = "break-word";
                    ths[i].style.whiteSpace = "normal";*/
                   /* tds[i].style.wordBreak = "break-word";
                    tds[i].style.whiteSpace = "normal";*/

                    tds[i].setAttribute("mcol", colInfo.colIdx);
                    ths[i].setAttribute("mcol", colInfo.colIdx);
                    ths[i].setAttribute("mrow", -1);//headers
                }

                var totalOffsetWidth = 0,
                    totalColWidth = 0;

                for (var i = 0; i < colLen; i++) {
                    var colInfo = this.colsInfo[i];
                    console.log(i + " offsetWidth:" + ths[i].offsetWidth + ", styleWidth:" + ths[i].style.width + ", colWidth:" + colInfo.colWidth);
                    totalOffsetWidth += ths[i].offsetWidth;
                    totalColWidth += colInfo.colWidth;

                    var colWidth = colInfo.colWidth;
                    colInfo.contentWidth = colWidth - colInfo.padding.left - colInfo.padding.right;
                    colInfo.styleWidth =  colWidth ;
                }

                var fragment = document.createDocumentFragment();

                for (var i = 0; i < ROWCOUNT; i++) {
                    var newTR = this.renderOneRow(i);
                    fragment.appendChild(newTR);
                }

                tbody.appendChild(fragment);

                rowTmpl.style.display = "none";

                this.itemsContainerNode.style.top = 0 + 'px';

            },




            /**
             * to updateColumnWidth , buildOneRow;
             *  this.rows
             */
            buildRows : function(){
                var model =   this.advancedModel,
                    colInfos = this.colsInfo,
                    colCount = colInfos.length,
                    rowCount = model.length,
                    rowInfo = {},
                    colInfo = {},
                    row = [],
                    col = {},
                    rowIndex,
                    colIndex,
                    colType;

                var rows = this.rows = [];
                var attr = null,
                    metr = null;

                //get metric or attribute value
                var getAttValue = function(mapArray, name){
                    var result ={};
                    $ARR.forEach(mapArray, function(e){
                        if(e.tname == name){
                            result.name = e.name;
                            result.selection = e.attributeSelector;
                        }
                    });
                    return result;
                };
                var getMetricValue = function(mapArray, name){
                    var result = {},
                        threshold;
                    $ARR.forEach(mapArray, function(e){
                        if(e.name == name){
                            result.value = e.v;
                            //TODO: for now remove threshold for world, will resume later
                            threshold = e.threshold;
                            result.threshold = threshold? threshold: null;
                        }
                    });
                    return result;
                };
                for(rowIndex = 0 ; rowIndex < rowCount; rowIndex ++){
                    rowInfo = model[rowIndex];
                    row = [];
                    var headers = rowInfo.headers,
                        values = rowInfo.values,
                        metricSelection = rowInfo.metricSelector;

                    for(colIndex = 0; colIndex < colCount; colIndex ++){
                        colInfo = colInfos[colIndex];
                        colType = colInfo.type;
                        col = {};
                        col.colIdx = colIndex;
                        col.rowIdx = rowIndex;
                        col.type = colType;
                        // changed for attribute will be put in any column
                        if (colType === ATTR_NAME ) {

                            attr = ID_NAME[colInfo.order];
                            var attrResult = attr ? getAttValue(headers,attr) : null,
                                attrName = attrResult && attrResult.name;
                            //TQMS 722933:
                            if (attrName.indexOf("&lt;") >= 0) {
                                attrName = attrName.replace(/&lt;/g, "<");
                                attrName = attrName.replace(/&gt;/g, ">");
                            }
                            col.title = attrName;
                            col.selection = attrResult.selection;
                        }
                        else if (colType === CHART) {//Bullet Chart
                            col.title = CHART;
                            col.selection = metricSelection;
                        }
                        else if(colType === METRIC_VALUE){
                            metr = ID_NAME[colInfo.order];
                            var metrResult = metr? getMetricValue(values,metr): null;
                            col.title = metrResult? metrResult.value: "";

                            //TODO: for now remove threshold for world, will resume later
                            col.threshold = metrResult? metrResult.threshold: null;

                            col.selection = metricSelection;

                        }
                        row[colIndex] = col;
                    }
                    rows[rowIndex] = row;
                }
            },
            getRowData : function(rowIdx){
                var row = this.advancedModel[rowIdx],
                    headers = row.headers,
                    values = row.values,
                    result = {};
                $ARR.forEach(headers, function(e){
                    result[e.tname] = e.name;
                });
                $ARR.forEach(values, function(e){
                    result[e.name] = {
                        "rv":e.rv,
                        "v":e.v,
                        "threshold":e.threshold //TODO: for now remove threshold for world, will resume later
                    };
                });
                return result;
            },

            renderOneRow : function(rowIdx, dockedHeaderRowInfo){

                var rowInfo = this.rows[rowIdx],
                    rowData = this.getRowData(rowIdx),
                    //rowInfo = this.normalizedModel[rowIdx],
                    rowTmpl = this.rowTemplate,
                    colInfos = this.colsInfo,
                    colCount = colInfos.length;
                var bodyFontColorRGB = this.bodyFontColorRGB;


                var tr = null;
                var tds = null;
                    //new tr
                tr = rowTmpl.cloneNode(true);

                tr.style.display = '';

                tds = tr.childNodes;

                var attr = null,
                    metr = null;

                for (var j = 0, tdsIdx = 0; j < colCount; j++, tdsIdx++) {
                    var colInfo = colInfos[j];
                    var colIdx = colInfo.colIdx,
                        column = rowInfo[j],
                        colType = colInfo.type;

                    tds[j].setAttribute("mrow", rowIdx);
                    //tds[j].setAttribute("selection",column.selection);
                    tds[j].selection = column.selection;

                    // changed for attribute will be put in any column
                    if (colType == ATTR_NAME || colType == METRIC_VALUE ) {
                        tds[j].innerHTML = column.title;
                        //TODO: for now remove threshold for world, will resume later
                        if(colType === METRIC_VALUE && column.threshold){
                            tds[j].style.backgroundColor = column.threshold.fillColor;
                        }
                    }
                    else if (colType === CHART) {//Bullet Chart
                        var placeholder = document.createElement("div");
                        var props = {
                            placeholder: placeholder,
                            model: rowData,
                            widget: this,
                            selection: column.selection,
                            config: this.bulletProps,
                            width: colInfo.colWidth, //colInfo.contentWidth,
                            height: ROW_HEIGHT_FOR_CHART,
                            mainOffsetTop: this.offsetTop,
                            mainLeftPos: parseInt(this.domNode.style.left, 0) || 0,
                            mainWidth: this.getWidth(),
                            labelColorRGB: this.bodyFontColorRGB,
                            showMinLabel: this.showMinLabel,
                            theme: this.theme,
                            IDName: ID_NAME,
                        };
                        tds[j].appendChild(placeholder);
                        var w = new mstrmojo.plugins.BulletChart.Bullet(props);
                        w.render();
                        tds[j].removeAttribute("class");
                    }

                    if(colInfo.valueCssClass){
                       if (this.valueCssClass) {
                            tds[j].className = colInfo.valueCssClass + " " + this.valueCssClass;
                        } else {
                            tds[j].className = colInfo.valueCssClass;
                        }
                    }

                }

                if (rowIdx === 0 && (this.theme == DEFAULT_LIGHT_THEME || this.theme == DEFAULT_DARK_THEME)) {
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
                return tr;
            },



            plot:function(){
                this.addUseAsFilterMenuItem();//Add "use as filter" context menu
                //this.addThresholdMenuItem();//not need any more, as now only actual and kpi support threshold

                var $DI = mstrmojo.models.template.DataInterface,
                    dzModel = this.zonesModel,
                    dataDz = this.model.data.dz;
                if(dzModel){
                    //metricCount = [dzModel.getDropZoneObjectsByIndex(1).length, dzModel.getDropZoneObjectsByIndex(2).length, dzModel.getDropZoneObjectsByIndex(3).length, dzModel.getDropZoneObjectsByIndex(4).length];//Actual,Target,Range,KPI
                    metricCount = [dzModel.getDropZoneObjectsByName("Actual").length, dzModel.getDropZoneObjectsByName("Target").length, dzModel.getDropZoneObjectsByName("Range").length, dzModel.getDropZoneObjectsByName("KPI").length];
                }
                else if(dataDz &&  validateDocumentDZ(dataDz)) {//converted document
                        //attsCategory = dataDz.XAxis.TemplateUnit;
                    metricCount[0] = dataDz.YAxis.TemplateMetric? dataDz.YAxis.TemplateMetric.length :0;
                    metricCount[1] = dataDz.BreakBy.TemplateMetric? dataDz.BreakBy.TemplateMetric.length: 0;
                    metricCount[2] = dataDz.SliceBy.TemplateMetric? dataDz.SliceBy.TemplateMetric.length: 0;
                    metricCount[3] = dataDz.ColorBy.TemplateMetric? dataDz.ColorBy.TemplateMetric.length: 0 ;

                }
                else{
                    var metricCols = this.model.data.gts.col;
                    for(var index = 0; index <metricCols.length; index ++ ){
                        var colNames  = metricCols[index];
                        if(colNames.n === "Metrics"){
                            if(index !== 0){//atrribute in column
                                this.errorDetails = "Attribute should be in the Row instead of Column";
                                throw 'ERROR';
                            }

                            //colNames = this.model.data.gts.col[0],
                            var   num = colNames.es.length;
                                if(num < 5) {
                                    metricCount = [0,0,0,num];
                                }else{
                                    metricCount = [1,1,3,num - 5];
                                }
                            }
                    }
                }
                //TODO: as 10.2 has not supported threshold, thus change back to no threshold status
                this.advancedModel = this.dataInterface.getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {hasTitleName:true, hasSelection:true, needDecode:true, hasThreshold: true});
                //this.advancedModel = (new $DI(this.model.data)).getRawData($DI.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {hasTitleName:true, hasSelection:true, needDecode:true});



                if(metricCount[0] === 0 && metricCount[1] === 0 && metricCount[2] === 0 && metricCount[3] === 0){
                    // neither Bullet or KPI has value, will not render graph
                    //this.errorMessage = "Either Actual or KPI should have data to display the visualization";
                    this.errorDetails = "Either Actual or KPI should have data to display the visualization";
                    throw 'ERROR';
                }

                ROWCOUNT = this.advancedModel.length;

                this.initVisProp();//init this.bulletProps

                this.convertDataToModels(false);//parameter forsort= false , init ID_NAME, METRIC, METRIC_INDEX

                this.buildColsInfo(); // init this.colsInfo

                if(metricCount[0] > 0 || metricCount[2] > 0 || metricCount[1] > 0){ //  actual or range or target have metric
                    this.showGauge = true;//display bullet chart
                    this.bulletProps.mbShow = true;
                    if(metricCount[2] > 0 ){//range > 0
                        this.bulletProps.mbShowLegend = true;
                    }
                }

                this.renderBulletChart();

                // Update the scrollbars.
                this.updateScrollbars();

                var legendHeight = this.legend.offsetHeight;
                this.legend.style.top = (this.height - legendHeight )/2 + "px";

                //var headerTableOffsetHeight = this.headerTable.offsetHeight;
                var chartTableHeight = this.itemsContainerNode.offsetHeight;
                if(chartTableHeight   > this.height){ //vertical scrollbar
                    this.itemsContainerNode.style.height = this.height  + "px";
                    this.domNode.style.height = this.height  + "px";
                }else{
                    this.domNode.style.height = chartTableHeight  + "px";
                }

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

            markupString:
            '<div id="{@id}-bulletchart" class="mstrmojo-Chart {@cssClass}"   mstrAttach:mouseover,mouseout,click >'

            +   '<div id="{@id}-bulletchart-table" class="mstrmojo-Chart  bulletchart-Table " style="position:absolute; overflow: hidden">'
            +            '<div id="{@id}-header-bar" class="bulletchart-header-div" >'
            +                '<table id="{@id}-header-table" style="table-layout:fixed">'
            +                       '<tr >'
            +                           '<td style="text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px"></td>'
            +                       '</tr>'
            +                '</table>'
            +             '</div>'
            +             '<div id="{@id}-chart-table-container" class="bulletchart-canvas-div  scroll-container mstrmojo-scrollNode">'
            +                   '<table id="{@id}-charts-body" style="table-layout:fixed; border-spacing: 0px ">'
            +                       '<tr >'
            +                           '<td style="table-layout:fixed;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px"></td>'
            +                       '</tr>'
            +                   '<tr >'
            +                       '<td style="table-layout:fixed;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:0px;padding-bottom:0px"></td>'
            +                   '</tr>'
            +                   '</table>'
            +             '</div>'
            +   '</div>'

            +   '<div style="display:none;position:absolute;right:0;z-index:5; border:none;text-decoration:none;padding: 10px 20px 10px 20px;margin: 0px 0px 0px 10px ;" class="bulletchart-lengend-text gm-legend-alignRight gm-legend">'
            +       '<div class="legend-icon" style="right:0">'
            +       '</div>'
            +       '<div class="legend-title" style="right:0;padding: 10px 10px 10px 0px;">'
            +           "Range Color:"
            +       '</div>'
            +       '<div class="legend-tableContainer" style="right:0;top:0;padding-bottom:7px">'
            +           '<table class = "bullet-legend-table">'
            +               '<tr class="bullet-legend-tr">'
            +                   '<td class="bullet-legend-colorBox">'
            +                       '<div class="bulletchart-legend-band" ></div>'
            +                   '</td>'
            +                   '<td class="bullet-legend-desc">'
            +                       '<div style="margin-right:10px;margin-left:5px;">Low</div>'
            +                   '</td>'
            +               '</tr>'
            +               '<tr class="bullet-legend-tr">'
            +                   '<td class="bullet-legend-colorBox">'
            +                       '<div class="bulletchart-legend-band"></div>'
            +                   '</td>'
            +                   '<td class="bullet-legend-desc">'
            +                        '<div style="margin-right:10px;margin-left:5px;">Mid</div>'
            +                   '</td>'
            +               '</tr>'
            +               '<tr class="bullet-legend-tr">'
            +                   '<td class="bullet-legend-colorBox">'
            +                       '<div class="bulletchart-legend-band"></div>'
            +                   '</td>'
            +                   '<td class="bullet-legend-desc">'
            +                        '<div style="margin-right:10px;margin-left:5px;">High</div>'
            +                   '</td>'
            +               '</tr>'
            +           '</table>'
            +       '</div>'
            +   '</div>'

            +   '<div id="{@id}-errMsg" class="mstrmojo-message" style="top:0px;left:0px;position:absolute; display:none; z-index:30;"><div style="position:absolute;top:50%;text-align:center"></div></div>'


            +
            '<span id="textSpan" style="z-index:-10;visibility:hidden;-webkit-text-size-adjust: none;"></span>'

            +'<div id="{@id}-tooltip" class="bulletchart-tooltip bullet-tooltip" style="display: none; z-index: 100; position: absolute">'
            +               '<table id="{@id}-header-table" class="bulletchart-tooltip-table" style="table-layout:fixed; padding-top: 8px; padding-bottom: 0px; padding-right: 8px; padding-left: 0px">'
            +                '</table>'+
            '</div>'+
            '<canvas id="textCanvas" width="200" height="100" style="z-index:-11;visibility:hidden;-webkit-text-size-adjust: none;"></canvas>' +
            '</div>',


            markupSlots: {

                chartTableContainerNode: function () {
                    return this.domNode.childNodes[0];
                },

                headerTable: function () {
                    return this.domNode.childNodes[0].childNodes[0].firstChild;
                },

                itemsContainerNode: function () {
                    return this.domNode.childNodes[0].childNodes[1];
                },

                chartTable: function () {
                    return this.domNode.childNodes[0].childNodes[1].firstChild;
                },



                // for displaying error message
                errorMsg: function () {
                    return this.domNode.childNodes[2];
                },


                legend: function () {
                    return this.domNode.childNodes[1];
                },

                legendLow: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0];
                },

                legendLowFont: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0];
                },

                legendLowBand: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
                },

                legendMid: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1];
                },

                legendMidFont: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
                },

                legendMidBand: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
                },

                legendHigh: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[2];
                },

                legendHighFont: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[2].childNodes[1].childNodes[0];
                },

                legendHighBand: function () {
                    return this.domNode.childNodes[1].childNodes[2].childNodes[0].childNodes[0].childNodes[2].childNodes[0].childNodes[0];
                },
                textSpan: function () {
                    return this.domNode.childNodes[3];
                },
                tooltip: function(){
                    return this.domNode.childNodes[4];
                },
                canvasText : function(){
                    return this.domNode.childNodes[5];
                }
            }


        })}());



//@ sourceURL= BulletChart.js
