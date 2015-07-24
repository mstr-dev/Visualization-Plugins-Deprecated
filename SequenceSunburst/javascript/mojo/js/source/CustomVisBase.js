(function () {

    mstrmojo.requiresCls("mstrmojo.VisBase",
        "mstrmojo.vi.ui.rw._XtabDE",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.string",
        "mstrmojo.dom",
        "mstrmojo.array");

    var $DOM = mstrmojo.dom,
        $ARR = mstrmojo.array;

    var FILTER_TYPE = {
        SHARED: 0
    };
    /*var $ENUM_REQUIREMENT_TYPE = mstrmojo.vi.models.DropZonesModel.ENUM_REQUIREMENT_TYPE,
        REQ_ATTRIBUTE = $ENUM_REQUIREMENT_TYPE.ATTRIBUTE,
        REQ_METRIC = $ENUM_REQUIREMENT_TYPE.METRIC;*/
    var REQ_ATTRIBUTE = 12,
        REQ_METRIC = 4;




    var currentGalleryNode, styleNode;

    //get icon for gallery
    function getIconStyleParser(visStyleName, isForDark) {
        var tempGalleryNode = document.createElement('div'), tempGalleryListNode = document.createElement('div'), el1 = document.createElement('div'), el2 = document.createElement('div'), el3 = document.createElement('div');
        var toAppend, imageLink;
        tempGalleryNode.setAttribute('class', 'mstrmojo-VIGallery');
        //make it hidden just in case
        tempGalleryNode.setAttribute('style', 'display:none');
        tempGalleryListNode.setAttribute('class', 'mstrmojo-VIGalleryList');
        el1.setAttribute('class', 'item ' + visStyleName);
        el2.appendChild(el3);
        el1.appendChild(el2);
        tempGalleryListNode.appendChild(el1);
        tempGalleryNode.appendChild(tempGalleryListNode);
        if (isForDark) {
            var dark = document.createElement('div');
            dark.setAttribute('class', 'mojo-theme-dark');
            dark.appendChild(tempGalleryNode);
            toAppend = dark;
        } else {
            toAppend = tempGalleryNode;
        }


        //var html5vicss = "../plugins/stylename/style/Html5ViPage.css".replace("stylename", visStyleName.substring(3,visStyleName.length));
        //tempGalleryNode.href = html5vicss;
        //tempGalleryNode.onload = function(){
        //    alert('Success！');

            //adding created node so styles are applied
        document.body.appendChild(toAppend);


        var img = el1.children[0].children[0], style = img.currentStyle || window.getComputedStyle(img, false);
            imageLink = style.backgroundImage.slice(4, -1);
        //removing node from document since we do not need it any more
        document.body.removeChild(toAppend);

        return imageLink;
    }

    //base on icon determine type of icon - default vs uploaded vs href
    function getIconTypeParser(defaultIcon, currentIcon, folderName) {
        defaultIcon =defaultIcon.split('..')[1];
        if (currentIcon.indexOf(defaultIcon)>-1 ) {
            return defaultImage;
        } else {
            if (currentIcon.indexOf(folderName) > -1 ) {
                return uploadedImage;
            } else {
                return hrefImage;
            }
        }
    }

    function deactivateStyle(folderName) {
        var styleSheets = document.styleSheets, path = "plugins/" + folderName + "/style/global.css", size = styleSheets.length, i = 0, hrefToReturn = "";
        for (i = 0; i < size; i++) {
            var style = styleSheets[i];
            if (style.href && style.href.indexOf(path) > -1) {
                style.disabled = true;
                hrefToReturn = style.href;
            } else {
                if (style.disabled) {
                    style.disabled = false;
                }
            }
        }
        if (folderName !== "ui" && !hrefToReturn) {
            hrefToReturn = "../" + path;
        }
        return hrefToReturn;
    }

    function removeCSSClassPrefix(content, prefix) {
        return content.split(prefix).join("");
    }

    function addCSSClassPrefix(content, prefix) {
        var doc = document.implementation.createHTMLDocument(""),
            styleElement = document.createElement("style");
        styleElement.textContent = content;
        doc.body.appendChild(styleElement);
        var styles = styleElement.sheet.cssRules, i = styles.length;
        while (i) {
            i--;
            var txt = styles[i].selectorText;
            content = content.replace(txt, prefix + txt);
        }
        return content;
    }

    function getStyle(folderName) {
        setStyleInWork("");

        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); };
        }

        var path = deactivateStyle(folderName)+'?tstp='+ Date.now(), content = "";
        if (path !== "") {
            content = mstrmojo.loadFile(path);
            if (content && content.indexOf("<html>") !== -1) {
                //if global.css is missing content will contain a 404 page, so we need to clear it
                content = '';
            }
            setStyleInWork(content);
        }
        return content;
    }

    function getJSCode(code) {
        if (!code) {
            return "";
        }
        var bracketBegin = (code.indexOf('{') + 2),
            bracketEnd = (code.lastIndexOf('}') - (bracketBegin));
        code = code.substr(bracketBegin, bracketEnd);
        return code;
    }

    function setStyleInWork(css) {
        var tempId = 'vbtempstyle';
        if (!styleNode) {
            styleNode = document.getElementById(tempId);
        }
        if (!styleNode) {
            var head = document.head || document.getElementsByTagName('head')[0];
            styleNode = document.createElement('style');
            styleNode.id = tempId;
            styleNode.type = 'text/css';
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = css;
            } else {
                styleNode.appendChild(document.createTextNode(css));
            }
            head.appendChild(styleNode);
        } else {
            if (styleNode.styleSheet) {
                styleNode.styleSheet.cssText = css;
            } else {
                styleNode.innerHTML = css;
            }
        }
    }

    function getVisGalleryNode(st) {

        var items = mstrApp.rootCtrl.galleryPanel.vizList.items, i = items.length;
        while (i) {
            i--;
            if (items[i].s === st) {
                return items[i];
            }
        }
    }

    // from mstrConfig.plu to get styleName item
    function getSelectNode(st){
        var vizItems = [],
            visList = mstrConfig.pluginsVisList || {},
            fnAddRequirement = function (type, value, requirements) {
                // Initialize collection if undefined.
                requirements = requirements || [];

                // Convert to number (default to zero).
                value = isNaN(value) ? 0 : parseInt(value, 10);

                // Do we have a required value?
                if (value > 0) {
                    // Add requirement to passed collection.
                    requirements.push({
                        t: type,
                        r: value
                    });
                }

                // Returns requirements.
                return requirements;
            };



        // Iterate visualizations.
        Object.keys(visList).forEach(function (vizType) {
            var viz = visList[vizType],
                vizStyle = viz.s,
                vizName = viz.d,
                introduction = viz.i; // Add this line on 13th July 2015


            // Do we have a descriptor ID?
            var descriptorID = viz.desc;
            if (descriptorID) {
                // DE7017: Use descriptor ID instead of description.
                vizName = mstrmojo.desc(descriptorID, "");
            }

            var arrresult = ["GraphMatrixVisualizationStyle", "GoogleMapVisualizationStyle", "ESRIMapVisualizationStyle",
                "ImageLayoutVisualizationStyle", "VIHeatMapVisualizationStyle", "NetworkVisualizationStyle"] ;


            //Add judge to add 3rd party vis
            if(vizStyle &&  arrresult.indexOf(vizStyle) < 0){
                // Calculate attribute and metric requirements and add button.
                vizItems.push({
                    n: vizName,
                    s: vizStyle,
                    mr: fnAddRequirement(REQ_ATTRIBUTE, viz.ma, fnAddRequirement(REQ_METRIC, viz.mm)),
                    id: vizStyle,
                    vt: -1, //unknown graph type
                    wtp: viz.wtp,
                    i: introduction // Add this line on 13th July 2015
                });
            }
            /****************/
        });


        var i = vizItems.length;
        while (i) {
            i--;
            if (vizItems[i].s === st) {
                return vizItems[i];
            }
        }
    }



    function getCurrentNode() {
        if (currentGalleryNode) {
            return currentGalleryNode;
        } else {
            currentGalleryNode = getVisGalleryNode(this.scriptClass.split(".")[3]);
            return currentGalleryNode;
        }
    }

    function getMinimalValues(mr) {
        if (mr && mr.length > 0) {
            var i = mr.length;
            while (i) {
                i--;
                var m = mr[i];
                switch (m.t) {
                    case 12:
                        this.mnAttributes = m.r;
                        break;
                    case 4:
                        this.mnMetrics = m.r;
                        break;
                }
            }
        }
    }

    function setMinimalValues(attributes, metrics) {
        var currentGalleryNode = getCurrentNode(), mr = currentGalleryNode.mr;
        if (mr && mr.length > 0) {
            var i = mr.length;
            while (i) {
                i--;
                var m = mr[i];
                switch (m.t) {
                    case 12:
                        m.r = attributes;
                        break;
                    case 4:
                        m.r = metrics;
                        break;
                }
            }
        }
    }

    function constructTaskParameters(p) {
        p.dsc = this.description;
        p.jsc = this.vbGetJSCode();
        p.csssc = this.cssCode;
        p.jsl = this.vbGetJSLibs().join('^');
        p.sc = this.scriptClass;
        p.licntp = this.lightIconType;
        p.licnvl = this.lightIconValue;
        p.dicntp = this.lightIconType;
        p.dicnvl = this.lightIconValue;
        p.rrtt = this.vbGetRichToolTip();
        p.rud = this.vbGetReuseDom();
        p.erm1 = this.vbGetErrorMessage1();
        p.erm2 = this.vbGetErrorMessage2();
        p.mnattr = this.vbGetMinAttributes();
        p.mnmx = this.vbGetMinMetrics();
        p.scp = this.scope;


        // add for internal share on 7th April 2015; when isShared is true: vis will be first saved in Owner folder,
        // then stored in Plugins. When isShared is false, vis will be only saved in owner folder.
        p.isShared = this.isShared; // Judge whether it is shared or only be saved
        p.owner = this.owner; // the folder in plugins to be stored
        p.privateOrPublic = this.privateOrPublic; // Add for save as and internal share. Judge where the source code is, private place or public place now. it has nothing to do with where the destinate source will be.

        p.introduction = this.introduction;

        return p;
    }

   /* function pause(milliseconds) {
        var dt = new Date();
        while ((new Date()) - dt <= milliseconds) { *//* Do nothing *//* }
    }*/

    var defaultImage = 1, uploadedImage = 2, hrefImage = 3;

    function getStyleCatalogName(props, scriptClass) {
        try {
            return props.node.defn.vis.vn;
        } catch (e) {
            return scriptClass.split(".")[3];
        }
    }
    function applyVisName(name)
    {
        this.parent.set('title',name);
    }

    /**
     * Base class for custom visualizations.
     *
     * @class
     * @extends mstrmojo.VisBase
     *
     * @mixes mstrmojo.vi.ui.rw._XtabDE
     */
    mstrmojo.plugins.SequenceSunburst.CustomVisBase = mstrmojo.declare(
        mstrmojo.VisBase,

        [ mstrmojo.vi.ui.rw._XtabDE ],

        /**
         * @lends mstrmojo.CustomVisBase.prototype
         */
        {
            mnAttributes: 0,
            mnMetrics: 0,
            cssCode: '',
            description: '',
            scriptClass: 'mstrmojo.plugins.SequenceSunburst.CustomVisBase',
            newCssCode: null,
            vbReRender: false,
            pluginFolder: '',
            lightIconType: '',
            lightIconValue: '',
            darkIconType: 1,
            darkIconValue: '',
            scope: 16,
            styleName: '',
            stylePrefix: '.custom-vis-layout.',

            // Added for internal sharing on 7th April 2015
            isShared: false, //Judge whether the vis is got from sharing; when clicking sharing, it should be changed to true.
            owner:"", // when click save, save as, or internal sharing; owner will be changed to the sharing developers.
            privateOrPublic: 2, // 1 signals private, under self-folder; 2 singals public, under public folder plugins.

            //scriptClass: 'mstrmojo.CustomVisBase',

            plotted: false,

            markupString: '<div class="custom-vis-layout {@cssClass}" style="position:absolute;font-size:8pt;width:{@width}px;height:{@height}px;z-index:{@zIndex};{@viewportCssText}" mstrattach:click,mousedown,mouseup,mousemove></div>',

            markupSlots: {
                viewport: function () {
                    return this.domNode;
                }
            },

            formatHandlers: {
                viewport: [ 'background-color' ]
            },

            bindings: {
                gridData: 'this.model.data'
            },

            externalLibraries: null,

            /**
             * @type {Array.<String>}
             */
            cssFiles: null,

            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",

            errorDetails: "",

            isDynamicTooltip: true,

            reuseDOMNode: false,

            /**
             * Holds grid data.
             *
             * @type {mstrmojo.models.template.DataInterface}
             */
            dataInterface: null,

            plot: mstrmojo.emptyFn,

            //Add for property panel on 13th April 2015
            introduction: "The Visualization is :",
            //errorMessage: "need at least 0 attribute",
            //errorDetails: "data is not enough",

            init: function init(props) {

                if (window.mstrApp && window.mstrApp.isVI) {
                    // Are there viewport formatting handlers?
                    var viewportHandler = this.formatHandlers.viewport;
                    if (viewportHandler) {
                        // Does it have background color?
                        var idx = $ARR.indexOf(viewportHandler, 'background-color');
                        if (idx > -1) {
                            // Remove background color.
                            viewportHandler.splice(idx, 1);
                        }
                    }
                }

                this._super(props);

                // Are there CSS files to load?
                var cssFiles = this.cssFiles;
                if (cssFiles) {
                    // Insert CSS files.
                    mstrmojo.insertCSSLinks(cssFiles);
                }



                //this._super(props);
                if (mstrApp.isVI) {
                    this.styleName = getStyleCatalogName(props, this.scriptClass);
                    currentGalleryNode = getVisGalleryNode(this.styleName);
                    if(currentGalleryNode === undefined || currentGalleryNode === null){
                        currentGalleryNode = getSelectNode( this.styleName);
                    }

                    getMinimalValues.call(this, currentGalleryNode.mr);
                    this.description = currentGalleryNode.n;
                    this.pluginFolder = this.scriptClass.split(".")[2];
                    this.stylePrefix = '.custom-vis-layout.' + this.pluginFolder.toLowerCase() + ' ';
                    this.scope = mstrConfig.pluginsVisList[currentGalleryNode.id].scp;
                }
            },
           /* postBuildRendering:function () {
                applyVisName.call(this, this.description);
                return this._super();
            },*/

            toggleError: function toggleError(show) {
                this.raiseEvent({
                    name: 'toggleCtrlOverlay',
                    visible: show,
                    controls: [
                        {
                            scriptClass: 'mstrmojo.Label',
                            cssClass: 'dropMsg',
                            text: this.errorMessage + " " + this.errorDetails
                        }
                    ]
                });
            },

            vbIsSupported: function () {
                return true;
            },
            vbGetCSScode: function () {
                if (this.scriptClass === "mstrmojo.plugins._VisBuilder.VisBuilderNew") {
                    return "";
                }
                this.cssCode = mstrmojo.string.decodeHtmlString(getStyle(this.pluginFolder));
                return removeCSSClassPrefix(this.cssCode, this.stylePrefix);
            },
            vbSetCSScode: function (code) {
                this.cssCode = addCSSClassPrefix(code, this.stylePrefix);
                setStyleInWork(this.cssCode);
            },
            vbGetIntroduction: function () {
                return this.introduction;
            },
            vbSetIntroduction: function (intro) {
                this.introduction = intro;
            },
            vbGetJSCode: function () {
                return mstrmojo.string.decodeHtmlString(getJSCode(String(this.plot)));
            },
            vbSetJSCode: function (code) {
                this.plot = eval("(function (){ " + code + "})");
            },
            vbGetErrorMessage1: function () {
                return this.errorMessage;
            },
            vbSetErrorMessage1: function (txt) {
                this.errorMessage = txt;
            },
            vbGetErrorMessage2: function () {
                return this.errorDetails;
            },
            vbSetErrorMessage2: function (txt) {
                this.errorDetails = txt;
            },
            vbGetMinAttributes: function () {

                return this.mnAttributes;
            },
            vbGetMinMetrics: function () {
                return this.mnMetrics;
            },
            vbSetMinimal: function (attr, mtx) {
                this.mnAttributes = attr;
                this.mnMetrics = mtx;
                setMinimalValues(attr, mtx);
                this.errorMessage = "need at least "+  this.mnAttributes +" attribute and " + this.mnMetrics + "metric";
                this.errorDetails = "there are not enough data";
            },
            vbGetDescription: function () {
                var r = getCurrentNode.call(this).n;
                r = (r === 'New Visualization') ? '' : r;
                return r;
            },
            vbSetDescription: function (txt) {
                getCurrentNode.call(this).n = txt;
                this.description = txt;
                //applyVisName.call(this, this.description);
            },
            vbGetRichToolTip: function () {
                if (this.useRichTooltip) {
                    return true;
                } else {
                    return false;
                }
            },
            vbSetRichToolTip: function (value) {
                this.useRichTooltip = value;
            },
            vbGetReuseDom: function () {
                if (this.reuseDOMNode) {
                    return true;
                } else {
                    return false;
                }
            },
            vbSetReuseDom: function (value) {
                this.reuseDOMNode = value;
            },
            vbGetJSLibs: function () {
                var result = [];
                if (this.externalLibraries && this.externalLibraries.length > 0) {
                    for (var i = 0; i < this.externalLibraries.length; i++) {
                        result.push(this.externalLibraries[i].url);
                    }
                }
                return result;
            },
            vbSetJSLibs: function (libs) {
                this.externalLibraries = libs;
            },
            vbGetGalleryLightIcon: function (defaultIcon) {
                var visName = this.gridData.visName, result = defaultIcon, className = 'ic-' + visName;
                result = getIconStyleParser(className, false);
                this.lightIconType = getIconTypeParser(defaultIcon, result,this.pluginFolder);
                return result;
            },
            vbGetGalleryDarkIcon: function (defaultIcon) {
                var visName = this.gridData.visName, result = defaultIcon, className = 'ic-' + visName;
                result = getIconStyleParser(className, true);
                this.darkIconType = getIconTypeParser(defaultIcon, result,this.pluginFolder);
                return result;
            },
            vbSetIcons: function (lightType, lightValue) {
                this.lightIconType = lightType;
                this.lightIconValue = lightValue;


                this.darkIconType = lightType;
                this.darkIconValue = lightValue;
            },
            vbGetSaveParameters: function (p) {
                p = constructTaskParameters.call(this, p);

                //Modify for save.....
                if(p.scp === undefined) {
                    p.scp = 16;
                }
                if(p.licntp === ""){
                    p.licntp = 2;
                }

                p.ustl = this.gridData.visName;
                p.nm = this.scriptClass.split(".")[3];
                return p;
            },
            vbGetSaveAsParameters: function (p, name) {
                p = constructTaskParameters.call(this, p);

                //Modify for save as.....
                if(p.scp === undefined || p.scp === 0) {
                    p.scp = 16;
                }
                if(p.licntp === ""){
                    p.licntp = 2;
                }

                //
               /* p.licntp = this.lightIconType;
                p.licnvl = this.lightIconValue;
                p.dicntp = this.lightIconType;
                p.dicnvl = this.lightIconValue;*/
                //"http://localhost:8080/MSTRWeb/plugins/MstrVisCircularHeatChart/style/images/gallery.png"

                var re = /http:\/\/localhost:8080\/(\w+)\/plugins\/(\w+)\/style/;

                function replacer(match, p1, p2, offset, string) {
                    // p1 is mstrweb, p2 MstrVisCircularHeatChart
                    return ["http://localhost:8080", p1, "plugins", name, "style"].join('/');
                }
                if(p.licntp === 3 && p.licnvl.search(re) === 0){
                    p.licnvl = p.licnvl.replace( re,  replacer );
                }
                if(p.dicntp === 3 && p.dicnvl.search(re) === 0){
                    p.licnvl = p.licnvl.replace( re,  replacer );
                }

                p.nm = name;
                p.ustl = name;
                return p;
            },
            vbSetScope: function (value) {
                this.scope = value;
            },



            /*  init: function init(props) {
             // Is this a VI visualization?
             if (window.mstrApp && window.mstrApp.isVI) {
             // Are there viewport formatting handlers?
             var viewportHandler = this.formatHandlers.viewport;
             if (viewportHandler) {
             // Does it have background color?
             var idx = $ARR.indexOf(viewportHandler, 'background-color');
             if (idx > -1) {
             // Remove background color.
             viewportHandler.splice(idx, 1);
             }
             }
             }

             this._super(props);

             // Are there CSS files to load?
             var cssFiles = this.cssFiles;
             if (cssFiles) {
             // Insert CSS files.
             mstrmojo.insertCSSLinks(cssFiles);
             }
             },*/

            getFilterType: function getFilterType() {
                return this.defn.ins || FILTER_TYPE.SHARED;
            },

            unrender: function unrender(ignoreDom) {
                //Clear the cache.
                this.clearCache();

                //Call super.
                this._super(ignoreDom);
            },

            displayError: function displayError() {
                this.toggleError(true);
            },

            renderVisualization: function renderVisualization() {
                try {
                    this.toggleError(false);

                    this.dataInterface = new mstrmojo.models.template.DataInterface(this.getData());

                    this.plot();
                    this.plotted = true;


                } catch (e) {
                    this.displayError();
                    this.plotted = false;
                }
            },

            getExternalLibraries: function getExternalLibraries() {
                var result = [];
                if (this.externalLibraries && this.externalLibraries.length > 0) {
                    for (var i = 0; i < this.externalLibraries.length; i++) {
                        result.push(this.externalLibraries[i]);
                    }
                }
                return result;
            },

            postBuildRendering: function postBuildRendering() {

                if (mstrApp.isVI) {
                    applyVisName.call(this, this.description);
                }

                var me = this,

                libraries = this.getExternalLibraries();//this.vbGetJSLibs();//this.externalLibraries;

                // Are there libraries to load?
                if (libraries) {
                    this.requiresExternalScripts(libraries, function () {
                        me.renderVisualization();

                    });
                }else{
                    me.renderVisualization();

                }
                //Call super.
                return this._super();

            },

            redraw: function redraw() {
                if (this.reuseDOMNode) {
                    if (this.plotted) {
                        this.renderVisualization();
                    }

                    return this.plotted;
                }

                return false;
            },

            moveTooltip: function moveTooltip(evt, win) {
                var target = evt.target || $DOM.eventTarget(evt.hWin, evt.e),
                    that = this,
                    content,
                    getTitle = function getTitle(node) {
                        var i,
                            children = node.childNodes;

                        for (i = 0; i < children.length; i++) {
                            var child = children[i];

                            if (child.nodeName === "title") {
                                return child;
                            }
                        }

                        if (node !== that.domNode) {
                            return getTitle(node.parentNode);
                        }

                        return null;
                    },
                    title = getTitle(target);

                if (title) {
                    var tooltip = title.innerHTML;

                    if (tooltip && tooltip.length) { //DE14469 : if(tooltip.length)
                        content = tooltip;
                        title.tt = tooltip;
                        title.innerHTML = "";
                    } else if (title.tt !== undefined) {
                        content = title.tt;
                    }
                }


                    this.richTooltip = {
                        posType: mstrmojo.tooltip.POS_TOPLEFT,
                        content: content,
                        top: evt.clientY + 12,
                        left: evt.clientX - 12,
                        cssClass: 'vi-regular vi-tooltip-A'
                    };



                this._super(evt, win);
            },

            /**
             * Mimic d3.json('flare.json', function (data){})
             * Convert grid data into a flare.json like structure.
             * @param consumer {Function} Function consumes the json.
             */
            flareJson: function (consumer) {
                var tree = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
                if (consumer instanceof Function) {
                    consumer(tree);
                }

            }

        }
    );

   // mstrmojo.getIconTypeParser = getIconTypeParser;
}());

//@ sourceURL=CustomVisBase.js