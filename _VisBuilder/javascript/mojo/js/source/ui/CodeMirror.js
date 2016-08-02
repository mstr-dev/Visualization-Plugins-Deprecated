/*global CodeMirror:false */
/**
 * Base class for displaying CodeMirror editor field
 * Used to display CSS and JS editors
 *
 * @class
 * @extends mstrmojo.Container
 *
 * @mixes mstrmojo._LoadsScript, mstrmojo._FillsBrowser, mstrmojo._HasLayout
 */
(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    function loadExternalCss(cssToLoad) {
        var i = cssToLoad.length;
        while (i) {
            i--;
            var style = document.createElement("link");
            style.href = cssToLoad[i];
            style.type = "text/css";
            style.rel = "stylesheet";
            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }

    function preapareCodeBeforeAdding(code) {
        var noOfLinesToAdd = 10 - code.split(/\r\n|\r|\n/).length;
        //adding empty lines up to 10 lines
        if (noOfLinesToAdd > 0) {
            while (noOfLinesToAdd) {
                noOfLinesToAdd--;
                code = code + "\r";
            }
        }
        return code;
    }

    function prepareCodeBeforeReading(code) {
       // code = code.split(/\r\n\r\n|\r\r|\n\n/).join('');
        return code;
    }

    mstrmojo.requiresCls("mstrmojo.Container", "mstrmojo.Widget", "mstrmojo.css", "mstrmojo.dom", "mstrmojo._HasLayout","mstrmojo._LoadsScript", "mstrmojo._FillsBrowser");
    mstrmojo.plugins._VisBuilder.ui.CodeMirror = mstrmojo.declare(
        mstrmojo.Container,
        [mstrmojo._LoadsScript, mstrmojo._FillsBrowser, mstrmojo._HasLayout],
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.CodeMirror",
            value: "",
            type: "text",
            tabIndex: "",
            codeMirrorEditor: "",
            cssClass:'',
            mode: "text/html",
            markupString: '<div class="codemirror {@cssClass}" style="position: relative" ><div class="CMMaxMin CMin" mstrAttach:click ></div><div class="CMContainer" ></div></div>',
            markupSlots: {
                c: function () {
                    return this.domNode.lastChild;
                },
                b: function () {
                    return this.domNode.firstChild;
                }
            },
            preBuildRendering: function postBuildRendering() {
                this._super();
                loadExternalCss(["../plugins/_VisBuilder/libs/addon/hint/show-hint.css"]);
            },
            postBuildRendering: function postBuildRendering() {
                this._super();
                if (typeof CodeMirror === "undefined") {
                    this.loadCodeMirrorEditor();
                } else {
                    this.attacheCodeMirror();
                }
            },
            browserResized: function browserResized(size) {
                // Call set dimensions.
                this.setDimensions('auto', 'auto');
                return true;
            },
            loadCodeMirrorEditor: function () {
                var scriptsObjectArray = [];
                /*scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/lib/codemirror.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/mode/javascript/javascript.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/mode/css/css.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/edit/matchbrackets.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/edit/closebrackets.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/comment/continuecomment.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/comment/comment.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/hint/show-hint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/hint/javascript-hint.js"});
                scriptsObjectArray.push({uzrl: "../plugins/_VisBuilder/libs/addon/hint/css-hint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/display/fullscreen.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/lib/xml.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/jshint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/csslint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/lint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/javascript-lint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/json-lint.js"});
                scriptsObjectArray.push({url: "../plugins/_VisBuilder/libs/addon/lint/css-lint.js"});*/
                //To load local libraries
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/lib/codemirror.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/mode/javascript/javascript.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/mode/css/css.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/edit/matchbrackets.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/edit/closebrackets.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/comment/continuecomment.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/comment/comment.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/hint/show-hint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/hint/javascript-hint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/hint/css-hint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/display/fullscreen.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/lib/xml.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/jshint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/csslint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/lint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/javascript-lint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/json-lint.js"});
                scriptsObjectArray.push({url: "file://../plugins/_VisBuilder/libs/addon/lint/css-lint.js"});
                var me = this;
                this.requiresExternalScripts(scriptsObjectArray, function () {
                    me.attacheCodeMirror();
                });
            },
            attacheCodeMirror: function () {
                //DE31269 to handle case: this.parent is null
                var parent = this.parent && this.parent.parent;
                if(!parent) return;
                var properties = {
                    mode: this.mode,
                    lineNumbers: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    continueComments: "Enter",
                    extraKeys: {
                        "Ctrl-Q": "toggleComment",
                        "Ctrl-Space": "autocomplete",
                        "F4": function (cm) {
                            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        },
                        "Esc": function (cm) {
                            if (cm.getOption("fullScreen")) {
                                cm.setOption("fullScreen", false);
                            }
                        }
                    },
                    showCursorWhenSelecting: true,
                    value: preapareCodeBeforeAdding(this.value)
                };
                properties.gutters = ["CodeMirror-lint-markers"];
                properties.lint = true;

                if (this.c) {
                    this.codeMirrorEditor = CodeMirror(this.c, properties);
                    this.codeMirrorEditor.on("change", function() {
                        //if code has changed call container to resfresh heigh - so scrolls if needed will be displayed
                        if(parent && parent.parent && parent.parent.onheightChange ){
                            parent.parent.onheightChange();
                        }
                    });
                    this.codeMirrorEditor.on("focus", function() {
                        //DE29010 : if code has selected call container to refresh height - so scrolls if needed will be displayed
                        if(parent && parent.parent && parent.parent.onheightChange ){
                            parent.parent.onheightChange();
                        }

                    });
                }
            },
            onclick: function onclick() {
                var scrolls = document.getElementsByClassName('mstrmojo-scrolltrack'), i = scrolls.length;
                if (this.codeMirrorEditor.getOption("fullScreen")) {
                    this.codeMirrorEditor.setOption("fullScreen", false);
                    mstrmojo.css.addClass(this.b, 'CMin');
                    mstrmojo.css.removeClass(this.b, 'CMax');
                    while (i) {
                        i--;
                        scrolls[i].style.display = '';
                    }
                    document.getElementsByClassName('mstrmojo-RootView-gallery')[0].style.display = '';
                } else {
                    this.codeMirrorEditor.setOption("fullScreen", true);
                    mstrmojo.css.addClass(this.b, 'CMax');
                    mstrmojo.css.removeClass(this.b, 'CMin');
                    while (i) {
                        i--;
                        scrolls[i].style.display = 'none';
                    }
                    document.getElementsByClassName('mstrmojo-RootView-gallery')[0].style.display = 'none';
                }
            },
            isValid: function () {
                //validation is switch off - always true - just uncomment below to check for markers
                return true;
                /*var lintState = this.codeMirrorEditor.state.lint;
                 if (lintState) {
                 return lintState.marked.length === 0;
                 } else {
                 return true;
                 }*/
            },
            getValue: function () {
                var c = prepareCodeBeforeReading(this.codeMirrorEditor.getValue());
                return c;
            }
        }
    );

}());
//@ sourceURL=CodeMirror.js