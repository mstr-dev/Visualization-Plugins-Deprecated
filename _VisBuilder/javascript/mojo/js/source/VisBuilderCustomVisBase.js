(function () {
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
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
        //adding created node so styles are applied
        document.body.appendChild(toAppend);

        var img = el1.children[0].children[0], style = img.currentStyle || window.getComputedStyle(img, false);
        
        imageLink = style.backgroundImage.slice(4, -1);//"url("file://a.txt")", to remove extra "", while for mac, "url(file://a.txt)"
        if(imageLink && (imageLink[0] === '\"' || imageLink[0] === '\'')){
            imageLink = imageLink.slice(1, -1);
        }
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
            }
            /* delete this part, as html5vipage should  also be true sometimes, should not be reset
            else {
                if (style.disabled) {
                    style.disabled = false;
                }
            }*/
        }
        if (folderName !== "ui" && !hrefToReturn) {
            hrefToReturn = "../" + path;
        }
        return hrefToReturn;
    }

    function removeCSSClassPrefix(content, prefix) {
        //Remove prefix automatically, While for case:
        // prefix { }
        //Should not remove prefix, should keep prefix to avoid css error
        var rePrefix = prefix.replace(/([\.\-])/g, "\\$1"),//replace special signal[.-]
            regex = new RegExp(rePrefix + "\\s*{"),
            subContents = content.split(regex);
        subContents.forEach(
            function(subString, index){
                subContents[index] = subString.split(prefix).join("");
            }
        );
        return subContents.join(prefix + " {");
    }

    function addCSSClassPrefix(content, prefix) {
        var doc = document.implementation.createHTMLDocument(""),
            styleElement = document.createElement("style"),
            result = "";
        styleElement.textContent = content;
        doc.body.appendChild(styleElement);
        var styles = styleElement.sheet.cssRules, i = styles.length,
            rePrefix = prefix.replace(/([\.\-])/g, "\\$1"),//replace special signal[.-]
            ignoreLabel = new RegExp("InsertDHTMLWidgetMenuLayoutxml|"+ rePrefix );// rwd insert menu icon and already contain prefixcan not be added prefix
        while (i) {
            i--;
            var txt = styles[i].selectorText,
                subTxts = txt.split(","),//special process for comma, add prefix before both labels besides comma
                cssText = styles[i].cssText;
            if(txt.search(ignoreLabel) >= 0){//find non-need prefix string
                continue;
            }
            subTxts.forEach(function(subTxt){
                subTxt = subTxt.trim();
                cssText  = cssText.replace(subTxt, prefix + subTxt); //not use content to replace, to avoid that subTxt occurs on other labels, like{ .svg.... .div.svg...}, will replace both {.svg}
            });
            cssText = cssText.replace(/{/g, "{\n").replace(/;/g,";\n");
            result = cssText + "\n\n" + result;
        }
        return result;
    }

    function getStyle(folderName) {
        setStyleInWork("");

        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); };
        }

        var path = deactivateStyle(folderName)+'?tstp='+ Date.now(), content = "";
        if (path !== "") {
        	if (mstrmojo.loadFileSync) {
        		content = mstrmojo.loadFileSync(path);
        	} else {
        		content = mstrmojo.loadFile(path);
        	}
            
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
        var items = mstrmojo.all.VisBuilderGallery.vizList.items, i = items.length;
        while (i) {
            i--;
            if (items[i].s === st) {
                return items[i];
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
        //ADD to support dropzone api
        var zonesModel = this.zonesModel,//dropZoneEditorModel
            editorModel = this.edtModel;//propertyEditorModel
        p.dzcode = zonesModel.getGetCustomDropZonesCode();
        p.aocode = zonesModel.getShouldAllowObjectsInDropZoneCode();
        p.odcode = zonesModel.getGetActionsForObjectsDroppedCode();
        p.orcode = zonesModel.getGetActionsForObjectsRemovedCode();
        p.cmcode = zonesModel.getGetDropZoneContextMenuItemsCode();
        p.propertycode = editorModel.vbGetCustomPropertyCode();//get property code
        p.dsc = this.description;
        p.jsc = this.vbGetJSCode();
        p.csssc = this.cssCode;
        p.jsl = this.vbGetJSLibs().join('^');
        p.sc = this.scriptClass;
        p.licntp = this.lightIconType;
        p.licnvl = this.lightIconValue;
        p.dicntp = this.darkIconType;
        p.dicnvl = this.darkIconValue;
        p.rrtt = this.vbGetRichToolTip();
        p.rud = this.vbGetReuseDom();
        p.erm1 = this.vbGetErrorMessage1();
        p.erm2 = this.vbGetErrorMessage2();
        p.mnattr = this.vbGetMinAttributes();
        p.mnmx = this.vbGetMinMetrics();
        p.scp = this.scope;
        return p;
    }

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
     * Custom class which holds and handles changes in plugin
     * Extends / overwrites definition of CustomVisBase
     *
     * @class mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBas
     * @extends mstrmojo.CustomVisBase
     */
    mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBase = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            mnAttributes: 0,
            mnMetrics: 0,
            cssCode: '',
            description: '',
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBase",
            newCssCode: null,
            vbReRender: false,
            pluginFolder: '',
            lightIconType: '',
            lightIconValue: '',
            darkIconType: 1,
            darkIconValue: '',
            scope: 0,
            styleName: '',
            stylePrefix: '.custom-vis-layout.',
            init: function init(props) {
                this._super(props);
                this.styleName = getStyleCatalogName(props, this.scriptClass);
                currentGalleryNode = getVisGalleryNode(this.styleName);
                getMinimalValues.call(this, currentGalleryNode.mr);
                this.description = currentGalleryNode.n;
                this.pluginFolder = this.scriptClass.split(".")[2];
                this.stylePrefix = '.custom-vis-layout.' + this.pluginFolder.toLowerCase() + ' ';
                this.scope = mstrConfig.pluginsVisList[currentGalleryNode.id].scp;
            },
            postBuildRendering:function () {
                applyVisName.call(this, this.description);
                return this._super();
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
            },
            vbGetDescription: function () {
                var r = getCurrentNode.call(this).n;
                r = (r === 'New Visualization') ? '' : r;
                return r;
            },
            vbSetDescription: function (txt) {
                getCurrentNode.call(this).n = txt;
                this.description = txt;
                applyVisName.call(this, this.description);
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
            vbSetIcons: function (lightType, lightValue, darkType, darkValue) {
                this.lightIconType = lightType;
                this.lightIconValue = lightValue;
                this.darkIconType = darkType;
                this.darkIconValue = darkValue;
            },
            vbGetSaveParameters: function (p) {
                p = constructTaskParameters.call(this, p);
                p.ustl = this.gridData.visName;
                p.nm = this.scriptClass.split(".")[3];
                return p;
            },
            vbGetSaveAsParameters: function (p, name) {
                p = constructTaskParameters.call(this, p);
                p.nm = name;
                p.ustl = name;
                return p;
            },
            vbSetScope: function (value) {
                this.scope = value;
            }
        }
    );

    if (mstrmojo.CustomVisBase.ENUM_EXTERNAL_LIBS) {
        mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBase.ENUM_EXTERNAL_LIBS = mstrmojo.CustomVisBase.ENUM_EXTERNAL_LIBS;
    }

    mstrmojo.CustomVisBase = mstrmojo.plugins._VisBuilder.VisBuilderCustomVisBase;


//To avoid browser caches
        if (mstrmojo.loadFileSync) {
            mstrmojo.loadFileSyncBak = mstrmojo.loadFileSync;
        } else {
            mstrmojo.loadFileSyncBak = mstrmojo.loadFile;
        }
        //to avoid browsers caching files
        function loadfile(file) {
            var path = null;
            if (!Date.now) {
                Date.now = function() { return new Date().getTime(); };
            }
            var path = file+'?tstp='+ Date.now();
            return mstrmojo.loadFileSyncBak(path);
        };
        if (mstrmojo.loadFileSync) {
            mstrmojo.loadFileSync = loadfile;
        } else {
            mstrmojo.loadFile = loadfile;
        }

}());
//@ sourceURL=VisBuilderCustomVisBase.js