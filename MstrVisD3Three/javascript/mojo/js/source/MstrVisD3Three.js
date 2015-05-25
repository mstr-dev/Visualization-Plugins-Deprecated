/* global d3,VIZ */
(function () {
    if (!mstrmojo.plugins.MstrVisD3Three) {
        mstrmojo.plugins.MstrVisD3Three = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.VisBase",
        "mstrmojo.css",
        "mstrmojo._LoadsScript",
        "mstrmojo.models.template.DataInterface"
    );
    function loadExternalCss(cssToLoad) {
        var i = cssToLoad.length;
        while (i) {
            i--;
            var style = document.createElement('link');
            style.href = cssToLoad[i];
            style.type = 'text/css';
            style.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    function getData(data) {
        var gridata = new mstrmojo.models.template.DataInterface(data),
            rows = gridata.getTotalRows(),
            i,
            result = [],
            tileData ,
            tileName,
            metricName = gridata.getColHeaders(0).getHeader(0).getName();
        if (gridata.getRowHeaders(0).size() !== 2) {
            return;
        }

        for (i = 0; i < rows; i++) {
            var row = gridata.getRowHeaders(i);
            var tempTileName = row.getHeader(0).getName();
            var singleRow = {};
            if (tileName !== tempTileName) {
                if (tileData) {
                    //push data from prev tile
                    result.push(tileData);
                }
                tileName = tempTileName;
                tileData = {};
                tileData.data = [];
                tileData.name = tileName;
                tileData.mname = metricName;
            }
            singleRow.name = row.getHeader(1).getName();
            singleRow.value = gridata.getMetricValue(i, 0).getRawValue();
            tileData.data.push(singleRow);
        }
        result.push(tileData);
        return result;
    }

    function displayError() {
        mstrmojo.css.addClass(this.domNode, "error");
        this.inError = true;
        this.domNode.innerHTML = "<div class='d3error' >Only 2 attributes are allowed, only first metric will be used</div>";
        this.svg = false;
    }

    mstrmojo.plugins.MstrVisD3Three.MstrVisD3Three = mstrmojo.declare(
        mstrmojo.VisBase,
        [mstrmojo._LoadsScript],
        {
            scriptClass: 'mstrmojo.plugins.MstrVisD3Three.MstrVisD3Three',
            markupString: '<div id="container" class="d3-layout d3three" style="position:absolute;font-size:8pt;width:{@width}px;height:{@height}px;" >' +
                '<div id="loading"><h5>.</h5></div>' +
                '<div id="menu"></div>' +
                '<div></div>' +
                '</div>',
            inError: false,
            plot: function () {
                this.inError = false;
                var data = getData(this.model.data);
                if (data) {
                    mstrmojo.css.removeClass(this.domNode, "error");
                    VIZ.mjid = this.id;
                    VIZ.init(this.width, this.height);
                    VIZ.drawElements(data);
                    VIZ.transform('helix');
                    d3.select("#loading").remove();
                    VIZ.render();
                    VIZ.animate();

                } else {
                    displayError.call(this);
                }

            },

            initSVG: function () {
                try {
                    this.plot();
                } catch (e) {
                    console.log(e);
                }
            },

            postBuildRendering: function postBuildRendering() {
                this._super();
                var me = this;
                loadExternalCss(["../plugins/MstrVisD3Three/css/style.css"]);
                this.requiresExternalScripts(
                    [
                        {url: "//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js"},
                        {url: "../plugins/MstrVisD3Three/lib/tween.js"},
                        {url: "../plugins/MstrVisD3Three/lib/CSS3DRenderer.js"},
                        {url: "../plugins/MstrVisD3Three/lib/TrackballControls.js"},
                        {url: "../plugins/MstrVisD3Three/lib/d3.min.js"},
                        {url: "../plugins/MstrVisD3Three/lib/viz.js"}
                    ],
                    function () {
                        //me.initSVG();
                        me.plot();
                    }
                );
            },
            redraw: function () {
                var currentWidth = parseInt(this.width, 10), currentHeight = parseInt(this.height, 10);
                if (this.inError || (currentWidth === VIZ.width) && (currentHeight === VIZ.height)) {
                    //data has been change - lets re-render everything
                    return false;
                } else {
                    // just size of window has changed, adjusting camera and render
                    VIZ.resize(currentWidth, currentHeight);
                    return true;
                }
            }
        }
    );
}());