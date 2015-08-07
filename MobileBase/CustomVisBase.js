var xmjd = mstrmojo && mstrmojo.descriptors;

/**
 * The global namespace for all project mojo objects and classes.
 *
 * @namespace
 */
var mstrmojo = {
    /**
     * <p>Descriptor store. </p>
     *
     * <p>This is a hash map keyed by descriptor key, and value is the localized string for the descriptor.</p>
     */
    descriptors: xmjd || {},

    /**
     * <p>Information about MSTR metadata.</p>
     *
     * @type {Object}
     */
    meta: {
        TP: "t",     // the key for a web object's type
        STP: "st"    // the key for a web object's sub-type
    },

    /**
     * A static empty function for use by classes to declare abstract methods.
     */
    emptyFn: function () {
    },

    /**
     * Returns a function that can be used as a placeholder for methods that must be overridden in subclasses.
     *
     * @return {Function}
     * @throws An error notifying the developer specifying which method needs to be overriden.
     */
    getMissingFn: function getMissingFn() {
        return function () {
            var n = this.scriptClass,
                i;

            try {
                for (i in this) {
                    // If we found the function,
                    if (this[i] === arguments.callee) {
                        n += "." + i;
                        break;
                    }
                }
            } catch (e) {
                // Swallow error and do nothing.
            }

            // Throw a new error specifying that we have an abstract method that was not implemented.
            throw new Error('Missing abstract method: ' + n);
        };
    },

    /**
     * <p>Get tick count in milliseconds</p>
     *
     * @returns {int} The number of milliseconds since beginning of epoch.
     */
    now: function now() {
        return new Date().getTime();
    },

    /**
     * <p>If true, indicates that the mstrmojo namespace spans multiple frames/windows.</p>
     *
     * @type {boolean}
     */
    usesFrames: false
};

(function () {

    /**
     * <p>Reference to the global context object, typically same as "window" in browsers, may be different
     * in other environments like Adobe AIR.</p>
     *
     * @type {window}
     */
    mstrmojo.global = /** @type {window} **/ (function () {
        var f = function () {
            return this;
        };
        return f.call(null);
    }());

    /**
     * <p>Stubs to be overridden by debug.js augmentation.
     */
    mstrmojo.dbg = mstrmojo.emptyFn;
    mstrmojo.dbg_stack = mstrmojo.emptyFn;
    mstrmojo.dbg_xhr = mstrmojo.emptyFn;
    mstrmojo.dbg_profile = mstrmojo.emptyFn;

    mstrmojo.debugBundles = (function () {
        // Debug bundles flags are stored in the debug flags at 4 bit.
        return (window.mstrConfig && (mstrConfig.debugFlags !== undefined) && ((mstrConfig.debugFlags & 4) > 0));
    })();

    /**
     * sub packages.
     */
    mstrmojo.platform = {};
    mstrmojo.prompt = {};
    mstrmojo.settings = {};

    /**
     * The namespace for the model classes.
     *
     * @namespace
     */
    mstrmojo.models = {
        /**
         * The namespace for datasets model class and utilities.
         *
         * @namespace
         */
        datasets: {},

        /**
         * The namespace for template data interfaces and utilities.
         *
         * @namespace
         */
        template: {}
    };

    /**
     * mstrmojo's UI component's namespace.
     *
     * @namespace
     */
    mstrmojo.ui = {
        /**
         * The namespace for common editor components.
         *
         * @namespace
         */
        editors: {
            /**
             * The namespace for common editor controls.
             *
             * @namespace
             */
            controls: {}
        },
        /**
         * The UX namespace for menus.
         *
         * @namespace
         */
        menus: {},

        /**
         * The path bar namespace.
         *
         * @namespace
         */
        pathbar: {}
    };

    /**
     * The mstrmojo namespace for preference related widgets.
     *
     * @namespace
     */
    mstrmojo.prefs = {};

    mstrmojo.ACL = {};
    mstrmojo.CMS = {};
    mstrmojo.storage = {};
    mstrmojo.maps = {};
    mstrmojo.maps.androidmap = {};
    mstrmojo.maps.jsmap = {};
    mstrmojo.graph = {};
    mstrmojo.IPA = {};
    mstrmojo.IPA.Monitors = {};
    mstrmojo.IPA.Alerts = {};
    mstrmojo.IPA.Environment = {};
    mstrmojo.IPA.Groups = {};
    mstrmojo.IPA.Heartbeat = {};
    mstrmojo.IPA.Managers = {};
    mstrmojo.sm = {};
    /**
     * The metric editor namespace.
     *
     * @namespace
     */
    mstrmojo.ME = {};
    /**
     * The Web Architect namespace.
     *
     * @namespace
     */
    mstrmojo.architect = {
        /**
         * The Web Architect namespace for UI components.
         *
         * @namespace
         */
        ui: {
            /**
             * The Web Architect namespace for UI editor components.
             *
             * @namespace
             */
            editors: {},

            /**
             * The Web Architect namespace for UI Panels
             *
             * @namespace
             */
            panels: {},

            /**
             * The Web Architect namespace for UI Factories
             *
             * @namespace
             */
            factories: {}
        },

        /**
         * The Web Architect namespace for model objects.
         *
         * @namespace
         */
        obj: {},

        /**
         * The Web Architect namespace for menus.
         *
         * @namespace
         */
        menu: {},

        /**
         * The Web Architect namespace for project management.
         *
         * @namespace
         */
        projectmanagement: {}
    };
    /**
     * The warehouse panel namespace.
     *
     * @namespace
     */
    mstrmojo.warehouse = {
        /**
         * The warehouse panel namespace for UI components.
         *
         * @namespace
         */
        ui: {
            /**
             * The warehouse namespace for UI editor components.
             *
             * @namespace
             */
            editors: {}
        },

        /**
         * The warehouse panel namespace for model objects.
         *
         * @namespace
         */
        obj: {},

        /**
         * The warehouse panel namespace for dbroles.
         *
         * @namespace
         */
        dbroles: {},

        /**
         * The Architect namespace for menus.
         *
         * @namespace
         */
        menu: {}
    };
    mstrmojo.plugins = {};
    mstrmojo.gmaps = {};
    mstrmojo.DI = {
        /**
         * DI Controllers
         */
        controller: {},

        /**
         * DI model
         */
        model: {},

        /**
         * DI widgets
         */
        ui: {
            /**
             * DI dialogs
             */
            dialogs: {}
        }
    };
    mstrmojo.Refine = {};
    /**
     * The Web QueryBuilder namespace.
     *
     * @namespace
     */
    mstrmojo.qb = {
        /**
         * The Web QueryBuilder namespace for Big Query.
         *
         * @namespace
         */
        bigquery: {},
        /**
         * The Web QueryBuilder namespace for Emma Single Source Table.
         *
         * @namespace
         */
        es: {},
        /**
         * The Web QueryBuilder namespace for MDX Source Table.
         *
         * @namespace
         */
        mdx: {},
        /**
         * The Web QueryBuilder namespace for context menu
         *
         * @namespace
         */
        menu: {},
        /**
         * The Web QueryBuilder namespace for SAPBO/OBIEE/COGNOS Source Table.
         *
         * @namespace
         */
        thirdParty: {}
    };

    mstrmojo.WH = {};
    mstrmojo.fe = {};
    mstrmojo.txEditor = {};
    mstrmojo.condTx = {};

    /**
     * The namespace to handle all the editors relating to threshold edits.
     *
     * @namespace
     */
    mstrmojo.threshold = {};

    /**
     * The Report Services Express Mode namespace.
     *
     * @namespace
     */
    mstrmojo.express = {
        /**
         * The Report Services Express Mode namespace for UI components.
         *
         * @namespace
         */
        ui: {}
    };

    /**
     * The Report Services namespace.
     *
     * @namespace
     */
    mstrmojo.rw = {
        /**
         * The namespace to host the RWD model specific class.
         *
         * @namespace
         */
        model: {},

        /**
         * The namespace to host the xtab specific classes for documents.
         *
         * @namespace
         */
        xtab: {}
    };

    /**
     * The common utilities namespace.
     *
     * @namespace
     */
    mstrmojo.util = {
        /**
         * The common utilities namespace for UI utilities.
         *
         * @namespace
         */
        ui: {}
    };

    /**
     * The Android namespace.
     *
     * @namespace
     */
    mstrmojo.android = {

        /**
         * Android controllers.
         *
         * @namespace
         */
        controllers: {},

        /**
         * Android factories.
         *
         * @namespace
         */
        factories: {},

        /**
         * Android input controls.
         *
         * @namespace
         */
        inputControls: {},

        /**
         * Android tablet specific namespace.
         *
         * @namespace
         */
        large: {
            /**
             * Android op controllers.
             *
             * @namespace
             */
            controllers: {},

            /**
             * Android tablet factories.
             *
             * @namespace
             */
            factories: {},

            /**
             * Android tablet UI controls.
             *
             * @namespace
             */
            ui: {}
        },

        /**
         * Android phone specific namespace.
         *
         * @namespace
         */
        medium: {
            /**
             * Android phone controllers.
             *
             * @namespace
             */
            controllers: {},

            /**
             * Android phone factories.
             *
             * @namespace
             */
            factories: {},

            /**
             * Android phone UI controls.
             *
             * @namespace
             */
            ui: {

                /**
                 * Android Native Navigation Bar.
                 *
                 * @namespace
                 */
                nativebar: {}
            }
        },

        /**
         * Android selectors.
         *
         * @namespace
         */
        selectors: {},

        /**
         * Common Android UI controls and mixins.
         *
         * @namespace
         */
        ui: {},

        /**
         * Android Native Dialog.
         *
         * @namespace
         */
        nativedialog: {}
    };

    /**
     * The HTML5 VI namespace.
     *
     * @namespace
     */
    mstrmojo.vi = {
        /**
         * The HTML5 VI namespace for application controllers.
         *
         * @namespace
         */
        controllers: {},

        /**
         * The HTML5 VI namespace for view, model and controller factories.
         */
        factories: {},

        /**
         * The HTML5 VI namespace for data models.
         *
         * @namespace
         */
        models: {
            /**
             * The HTML5 VI namespace for properties editor models.
             *
             * @namespace
             */
            editors: {}
        },

        /**
         * The HTML5 VI namespace for VI enumerations.
         *
         * @namespace
         */
        enums: {

        },

        /**
         * The HTML5 VI namespace for UI controls.
         *
         * @namespace
         */
        ui: {
            /**
             * The HTML5 VI namespace UI menus.
             *
             * @namespace
             */
            menus: {},

            /**
             * The HTML5 VI namespace for properties editor UI components.
             *
             * @namespace
             */
            editors: {},

            /**
             * The HTML5 VI namespace for Report Services document UI controls.
             *
             * @namespace
             */
            rw: {
                /**
                 * The HTML5 VI namespace for Report Services document selector controls.
                 *
                 * @namespace
                 */
                selectors: {},

                /**
                 * The HTML5 VI namespace for Report Services specific Xtab classes.
                 */
                xtab: {}
            },

            /**
             * The HTML5 VI namespace for tab controls.
             *
             * @namespace
             */
            tabs: {},

            /**
             * The HTML5 VI namespace for Toolbar controls.
             *
             * @namespace
             */
            toolbars: {

            },

            /**
             * The HTML5 VI namespace for the Tutorial.
             *
             * @namespace
             */
            tutorial: {

            }
        },

        /**
         * The HTML5 VI namespace for VI visualization code.
         *
         * @namespace
         */
        viz: {},

        /**
         * The HTML5 VI namespace for VI utilities.
         *
         * @namespace
         */
        util: {}
    };

    /**
     * The MSTR OneTier namespace.
     *
     * @namespace
     */
    mstrmojo.onetier = {
        /**
         * The OneTier namespace for application controllers.
         *
         * @namespace
         */
        controllers: {},

        /**
         * The OneTier namespace for one tier specific classes.
         *
         * @namespace
         */
        vi: {
            /**
             * name space for access list settings for one tier
             */
            acl : {},
            /**
             * The OneTier UI namespace for the preferences editor.
             */
            prefs: {
                /**
                 * The OneTier Preferences Editor namespace for model classes.
                 *
                 * @namespace
                 */
                model: {}
            },

            /**
             * The OneTier namepsace for one-tier UI classes.
             */
            ui: {
                /**
                 * The onetier namespace for onetier tutorial classes.
                 */
                tutorial: {}
            }
        }
    };

    /**
     * The MSTR Config namespace.
     *
     * @namespace
     */
    mstrmojo.config = {
        /**
         * The config namespace for HTML5 VI specific config files.
         *
         * @namespace
         */
        vi: {},

        /**
         * The config namespace for OneTier specific config files.
         *
         * @namespace
         */
        onetier: {}
    };

    /**
     * The HTML charts namespace.
     *
     * @namespace
     */
    mstrmojo.chart = {
        /**
         * package for classes and functions that are common to more than one Chart type
         * @namespace
         */
        common: {
        },

        /**
         * package to hold various enumerations ported from C++ code
         * @namespace
         */
        enums: {},

        /**
         * classes for Chart model
         * @namespace
         */
        model: {

            /**
             * package to hold enumerations related to chart data model
             * @namespace
             */
            enums: {}
        }
    };

    /**
     * GraphMatrix namespace
     * @namespace
     */
    mstrmojo.gm = {

    };

    /**
     * HeatMap namespace
     * @namespace
     */
    mstrmojo.heatmap = {
        vi: {}
    };

    /**
     * Network visualization namespace
     * @namespace
     */
    mstrmojo.netviz = {

    };

    // iPhone specific libraries.
    mstrmojo.iphone = {};

    // Windows Phone specific libraries.
    mstrmojo.winphone = {};

    // MSTRWeb related based code.
    mstrmojo.mstr = {};
    // MSTRWeb related UI component
    mstrmojo.mstr.ui = {};

    mstrmojo.gmaps = {};
    mstrmojo.esrimap = {};

    /**
     * The namespace for code used in the Mojo Example plugin page.
     *
     * @namespace
     */
    mstrmojo.examples = {};

    /**
     * <p>Alerts an error message to the user when errors are encountered.</p>
     *
     * @param {{name: string, message: string, fileName: string, lineNumber: string, sourceURL: string, line: int}} e The error object.
     */
    mstrmojo.err = function err(e) {
        // Default message
        var s = e.name + ': "' + e.message + '"';

        if (mstrmojo.debug) {
            if (e.fileName) {
                s += ' at\n    ' + e.fileName;
            }
            if (e.hasOwnProperty('lineNumber')) {
                s += ': ' + e.lineNumber;
            } else if (e.hasOwnProperty('line') && e.sourceURL) { //for webkit
                var a = e.sourceURL.split('/');
                s += '(' + a[a.length > 1 ? a.length - 1 : 0] + ':' + e.line + ')';
            }
        }

        // If console is available then output there as well.
        this.dbg(s);
        //this.dbg_stack();

        // Display to user.
        if (mstrmojo.Dialog) {
            mstrmojo.alert(e.message, null, e.name);
        } else {
            window.alert(s);
        }
    };

    /**
     * Displays a simple confirm message using the window.confirm method.
     *
     * @param {string} msg The message to display.
     *
     * @returns True is use pressed Ok button.
     */
    mstrmojo.confirm = function confirm(msg) {
        return window.confirm(msg);
    };

    /**
     * Displays a simple message to the user with a single 'Ok' button.
     *
     * @param {string} msg The message to display.
     */
    mstrmojo.alert = function alert(msg) {
        window.alert(msg);
    };

    /**
     * <p>Used to determine if the current browser can parse a function's body text.</p>
     *
     * @private
     */
    var canParseFuncs = !!(/return true/.test(String(function () {
        return true;
    })));

    /**
     * <p>Similar to {@link mstrmojo.hash.copy} in that it copies all of the members of a given source hash to another given destination hash, except that
     * it does NOT overwrite existing Functions in the destination.</p>
     *
     * <p>When there is a name collision between 2 functions, the destination receives a newly created wrapper function which
     * allows the overwriting function to call the pre-existing function with the reserved call "this._super()".</p>
     *
     * @param {Object} src The source object whose properties/values should be copied.
     * @param {Object=} dest An optional hash to receive the copied properties/values.  If this parameter is undefined, an empty hash will be used.
     *
     * @returns {Object} The modified destination hash.
     */
    mstrmojo.mixin = function mixin(src, dest) {
        if (src) {
            dest = dest || {};
            var funcCallsSuper = /this\.\_super/;

            /**
             * Utility function for adding _super functionality to methods.
             *
             * @param {Function} overwriting
             * @param {Function} inher
             *
             * @inner
             */
            var fnWrapMethod = function (overwriting, inher) {
                return function superwrap() {
                    var tmp = this._super;
                    this._super = inher;
                    var ret = overwriting.apply(this, arguments || []);
                    this._super = tmp;
                    return ret;
                };
            };

            // Optimization: temporarily remove the optional reserved "__onmixin__" property.
            var fnOnMixin = src.__onmixin__;
            if (fnOnMixin) {
                delete src.__onmixin__;
            }

            var n;
            for (n in src) {
                // Are we overwriting a function with a function? And if so, does the
                // overwriting function call "this._super"?
                if ((typeof src[n] === 'function') && (!canParseFuncs || funcCallsSuper.test(src[n]))) {
                    // Yes, we are subclassing a method with a new method that uses the
                    // "this._super" reserved keyword call to invoke the inherited method.  To support
                    // the reserved keyword, create a wrapper function which encapsulates both the
                    // overwriting method and the inherited method.
                    // Do this even if there is no this._super defined, because the wrapper is
                    // needed to reset this._super back to null; otherwise this._super would get
                    // stuck pointing at the bottom of the inheritance chain, causing an infinite loop there.
                    // For example, suppose the mixin has a method M that checks:
                    // "if (this._super) this._super()"
                    // If the base has no such method M, this._super is null.  So far so good. But now
                    // suppose second mixin is applied on top of the first, and the second mixin does
                    // have an overwriting method named M too, which calls "this._super()".
                    // A wrapper is made around the second M, setting this._super to the first M.
                    // Now after the first M is called, we must reset this._super to null, otherwise,
                    // the "if (this._super)" check in first M [see above] will return true, triggering
                    // an infinite loop!  So who will reset this._super to null when first M is called?
                    // Answer: the wrapper to the first M method, which we create here because even though
                    // first M has no super, its code still references this._super, and that's what matters.
                    dest[n] = fnWrapMethod(src[n], dest[n]);
                } else {
                    // We are not subclassing a method; just do a simple overwrite.
                    dest[n] = src[n];
                }
            }

            // Cleanup optimization.
            if (fnOnMixin) {
                src.__onmixin__ = fnOnMixin;
            }
        }
        return dest;
    };
}());

(function () {

    /**
     * <p>The XMLHTTPRequest object used to load files. Instantiated on-demand.</p>
     *
     * @private
     */
    var $XHR;

    /**
     * <p>Hash of FQCNs that are requested to load but fail.</p>
     *
     * <p>The hash is keyed by FQCN strings; each value is a Boolean (true).</p>
     */
    var $MISSING = {};

    var $GLOBAL = mstrmojo.global,
        $APP = $GLOBAL.mstrApp || {},
        jsRoot = $APP.jsRoot || "../javascript/",
        jsBundlesRoot = jsRoot + "bundles/",
        jsMojoRoot = $APP.jsMojoRoot || "../javascript/mojo/js/source/",
        isIE = !!document.all;     // Don't use mstrmojo.dom here. Avoid dependencies on utilities.

    /**
     * <p>Computes the relative path of the JavaScript file for the given FQCN.</p>
     *
     * <p>Examples:</p>
     * <ol>
     * <li>"Class1" is mapped to "<mstrApp.jsRoot>Class1.js"</li>
     * <li>"pkg.Class1" is mapped to "<mstrApp.jsRoot>pkg/Class1.js"</li>
     * <li>"mstrmojo.Class1" is mapped to "<mstrApp.jsMojoRoot>Class1.js"</li>
     * <li>"mstrmojo.pkg.Class1" is mapped to "<mstrApp.jsMojoRoot>pkg/Class1.js"</li>
     * </ol>
     *
     * <p>If "mstrApp" is undefined, then the default roots are used:</p>
     * <ol>
     * <li>jsRoot = "../javascript/"</li>
     * <li>jsMojoRoot = "../javascript/mojo/js/source/"</li>
     * </ol>
     *
     * @param {String} fqcn The name of the class to be mapped to a file.
     * @returns {String} The file relative path + name.
     */
    function fqcn2File(fqcn) {
        if (fqcn.match(/^mstrmojo\.plugins\./)) {
            var pluginName = fqcn.substring(17, fqcn.indexOf(".", 17));
            fqcn = '../' + pluginName + '/javascript/' + jsMojoRoot + fqcn.replace("mstrmojo.plugins." + pluginName + '.', "").replace(/\./gm, '/');
        } else if (fqcn.match(/^mstrmojo\./)) {
            fqcn = jsMojoRoot + fqcn.replace("mstrmojo.", "").replace(/\./gm, '/');
        } else {
            fqcn = jsRoot + fqcn.replace(/\./gm, '/');
        }
        return fqcn + '.js';
    }

    function getXHR() {
        // Instantiate XMLHTTPRequest using browser-specific techniques.
        // For IE, use new ActiveXObject(); for Mozilla, new XMLHttpRequest().
        $XHR = self.XMLHttpRequest ? new XMLHttpRequest() : (self.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null);
    }

    /**
     * <p>Loads contents of given file into a string using synchronous
     * XMLHTTPRequest GET call.</p>
     *
     * @param {String} file The path + name of the file to load.
     * @returns {String} The file contents as a string, if successful; null otherwise.
     */
    function syncGet(file) {
        var result = null;

        if (!$XHR) {
            getXHR();
        }
        if ($XHR) {
            try {
                // Do a synchronous GET call to fetch the file.
                $XHR.open("GET", file + ((window.mstrConfig && mstrConfig.webVersion) ? '?v=' + mstrConfig.webVersion : ''), false);
                $XHR.send(null);
                // Retrieve responseText. If successful, status will be 200 (HTTP) or 0 (file://).
                result = $XHR.responseText || null;
            } catch (localerr) {
            }

            // Minor hack: For Mozilla, do an abort() afterwards to avoid errors.
            // TO DO: investigate why without abort() we get errors on subsequent calls here.
            if (!isIE && $XHR.abort) {
                $XHR.abort();
            }

        }
        return result;
    }

    /**
     * <p>Encodes parameters for XHR transport.</p>
     *
     * @param {Object} params A hash containing parameter names and values.
     * @returns {String} The encoded parameter string.
     *
     * @returns {string} A URL of encoded parameters.
     *
     * @private
     */
    function encodeParams(params) {
        var x = -1,
            url = [],
            p;

        if (params) {
            for (p in params) {
                if (params.hasOwnProperty(p)) {
                    url[++x] = p + '=' + encodeURIComponent(params[p]);
                }
            }
        }

        return url.join('&');
    }

    /**
     * <p>Builds up the url with parameters is method == 'GET'.</p>
     *
     * @param {String} method The method for the xhr ('GET' or 'POST').
     * @param {String} baseUrl The url used for both GET and POST (excludes parameters in GET case).
     * @param {Object} [params] The parameters for this request.
     *
     * @returns {string} The url built from the baseUrl and params.
     *
     * @private
     */
    function appendUrlParams(method, baseUrl, params) {
        if (method !== 'GET' || !params) {
            return baseUrl;
        }

        return baseUrl + '?' + encodeParams(params);
    }

    function syncXHR(method, baseUrl, params) {
        var result = null;

        // Make sure it's uppercase for comparisons.
        method = method.toUpperCase();
        if (!$XHR) {
            getXHR();
        }
        if ($XHR) {
            try {
                var m = null,
                    app = window.mstrApp;

                if (window.microstrategy !== undefined && microstrategy) {
                    m = microstrategy;
                }

                // Set default values.
                params.taskContentType = params.taskContentType || 'json';
                params.taskEnv = 'xhr';
                params.xts = mstrmojo.now();

                params = mstrmojo.addCSRFTokenToTaskParams(params);

                //persisted task params
                var ptp = (app && app.persistTaskParams) || (m && m.persistParams);
                if (ptp) {
                    mstrmojo.requiresCls("mstrmojo.hash");
                    mstrmojo.hash.copy(ptp, params);
                }

                $XHR.open(method, appendUrlParams(method, baseUrl, params), false);

                if (method !== 'POST') {
                    params = null;
                } else {
                    params = encodeParams(params);
                    $XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                }

                $XHR.send(params);
                // Retrieve responseText. If successful, status will be 200 (HTTP) or 0 (file://).
                result = $XHR.responseText || null;
            } catch (localerr) {
                if (window.console) {
                    window.console.log(localerr);
                }
            }
        }
        return result;
    }

    /**
     * <p>Loads a given javascript file path synchronously via XmlHttpRequest, then tests if load succeeded by
     * performing a null-check on a given expression.</p>
     *
     * @param {String} file Path + name of the file to load (example: "/javascript/foo.js").
     * @param {String} [nullCheck] JavaScript expression for null-check after the file is loaded.
     * @returns {Boolean} true if the given file is loaded successfully and, optionally, if the given
     * expression does not evaluate to null after the file is loaded; false otherwise.
     */
    function _jsGet(file, nullCheck) {
        var js = syncGet(file);
        if (js) {
            try {
                eval(js);

                return nullCheck ?
                    !!eval(nullCheck) :
                    true;
            } catch (localerr) {
                window.alert('JavaScript compile error:\n\nFile: ' + file + '\n\nError: ' + localerr.message);
            }
        }
        return false;
    }

    mstrmojo.requiresBundle = function reqBundle(bundleName) {
        return _jsGet(jsBundlesRoot + bundleName);
    };

    /**
     * <p>Loads a resource file from path synchronously via XmlHttpRequest</p>
     *
     * @param {String} file path + name of the file to load (example: "/data/data.xml").
     * @returns {String} the contents of the requested file.
     */
    mstrmojo.loadFile = function loadFile(file) {
        return syncGet(file);
    };

    /**
     * <p>Appends a new css link element to the document head element</p>
     *
     * @param {String[]} an array of file paths to link (example: ["/styles/style.css"]).
     */
    mstrmojo.insertCSSLinks = function insertCSSLinks(files) {
        var css;

        if (files && files.length > 0) {

            files.forEach(function (file) {
                css = document.createElement("link");
                css.setAttribute("rel", "stylesheet");
                css.setAttribute("type", "text/css");
                css.setAttribute("href", file);
                document.getElementsByTagName("head")[0].appendChild(css);
            });
        }
    };

    /**
     * <p>Loads script files for javascript objects.</p>
     *
     * @class
     * @static
     */
    mstrmojo.loader = {
        /**
         * <p>Hash of FQCNs that are successfully loaded.</p>
         *
         * <p>The hash is keyed by FQCN strings; each has value is a Boolean (true).</p>
         */
        loaded: {
            mstrmojo: true,
            "mstrmojo.loader": true
        },

        /**
         * <p>Determines if a given JavaScript class is currently loaded.</p>
         *
         * <p>This method tries to evaluate the FQCN into an object. If the evaluation results
         * in a non-null object, the class is considered loaded.  If this method determines that the given FQCN is loaded,
         * it will ensure that the FQCN is recorded in a local hash of loaded classes for future reference.</p>
         *
         * @param {String} fqcn The fully qualified class name of the JavaScript class.
         * @returns {Boolean} true if the given FQCN evaluates to a non-null result; false otherwise.
         */
        isLoaded: function isLd(fqcn) {
            var o;
            try {
                o = eval(fqcn);
            } catch (localerr) {
            }
            if (o) {
                this.loaded[fqcn] = true;
            }
            return !!o;
        },

        /**
         * Attempts to load a named JavaScript class, if not loaded already.
         */
        load: function ld(fqcn) {

            // Have we tried and failed before?
            if ($MISSING[fqcn]) {
                return false;
            }
            // Have we succeeded before? Or perhaps it's already loaded?
            if (this.loaded[fqcn] || this.isLoaded(fqcn)) {
                return true;
            }

            // No luck so far. Try to load it for the first time.
            if (_jsGet(fqcn2File(fqcn), fqcn)) {
                this.loaded[fqcn] = true;
                return true;
            }

            $MISSING[fqcn] = true;
            return false;
        }
    };

    var $LOADER = mstrmojo.loader,
        isLoaded = $LOADER.loaded;

    /**
     * <p>Cache of arguments passed into loader.requires method. Used to avoid duplicate loads.</p>
     * @private
     */
    var reqCache = {},
        addPackagesToReqCache = function addPkg(n, ns) {
            var ps = n.split('.'),
                klen = ps.length,
                k;

            for (k = 1; k < klen; k++) {
                var s = ps.slice(0, k).join('.');
                if (!reqCache[s]) {
                    ns.push(s);
                    reqCache[s] = true;
                }
            }
        },
        loadInputScripts = function loadInputScripts(ns) {
            var jlen = ns.length,
                j;

            for (j = 0; j < jlen; j++) {
                if (!$LOADER.load(ns[j])) {
                    window.alert('Warning: Javascript class not found:\n' + ns[j]);
                    break;
                }
            }
        };

    /**
     * <p>Ensures that the given fully qualified class names are loaded, as well as the
     * package prefixes of those names. Attempts to load any which are not already loaded, in the given order.</p>
     *
     * <p>This method takes a variable number of input parameters. Each parameter is assumed to be a
     * fully qualified class name (String).</p>
     *
     * @returns {boolean} true, so that calls can be AND'ed with subsequent operations, for example: "mstrmojo.requiresCls('X') && X.foo()"
     */
    mstrmojo.requiresCls = function reqCls() {
        // Create an array of input strings.
        var argLen = arguments.length,
            ns = [],
            i,
            len;

        // Walk the given FQCN strings...
        for (i = 0, len = argLen; i < len; i++) {

            // Optimization: Have we received this argument before? or preloaded it? If so, skip it.
            var n = arguments[i];
            if (!n || isLoaded[n] || $MISSING[n]) {
                continue;
            } else if (reqCache[n]) {
                // we have requested this class before.  get it now
                loadInputScripts([n]);
                reqCache[n] = false;
                continue;
            }

            // is this not a plugin?
            if (!n.match(/^mstrmojo\.plugins\./)) {

                // If the argument has package prefixes, first add packages to array of inputs
                addPackagesToReqCache(n, ns);

            }
            // After package prefixes (if any), add the FQCN to array of inputs.
            ns.push(n);
            reqCache[n] = true;
        }

        // Now load all the inputs.
        loadInputScripts(ns);
        return true;
    };

    /**
     * <p>Ensures that the given fully qualified class names are loaded, as well as the
     * package prefixes of those names. Attempts to load any which are not already loaded, in the given order.</p>
     *
     * <p>This method takes a minimum of two parameters.  The first parameter is the package prefix of the
     * remaining variable number of input parameters. Each subsequent parameter is assumed to be an unqualified class name (String).</p>
     *
     * @returns {boolean} true, so that calls can be AND'ed with subsequent operations, for example: "mstrmojo.requiresCls('X') && X.foo()"
     */
    mstrmojo.requiresClsP = function reqClsP() {

        // Create an array of input strings.
        var argLen = arguments.length,
            ns = [],
            pkgName = arguments[0],
            i,
            len;

        // If the argument has package prefixes, first add packages to array of inputs.
        addPackagesToReqCache(pkgName, ns);

        // Walk the given class names strings...
        for (i = 1, len = argLen; i < len; i++) {

            // Optimization: Have we received this argument before? or preloaded it? If so, skip it.
            var n = pkgName + "." + arguments[i];
            if (!n || isLoaded[n] || $MISSING[n]) {
                continue;
            } else if (reqCache[n]) {
                // we have requested this class before.  get it now
                loadInputScripts([n]);
                reqCache[n] = false;
                continue;
            }


            if (!n.match(/^mstrmojo\.plugins\./)) {

                // After package prefixes (if any), add the FQCN to array of inputs.
                ns.push(n);
                reqCache[n] = true;
            }
        }

        // Now load all the inputs.
        loadInputScripts(ns);

        return true;
    };

    // =============================== loading descriptors =============================
    var $DESCRIPTORS = mstrmojo.descriptors,
        descPrefix = 'mstrWeb.';

    /**
     * Merge the descriptors information from input into descriptor store.
     *
     * @param ds {Object} This object contains the descriptor information retrieved from task call.
     * @private
     */
    function populateDescriptors(ds) {
        if (ds) {
            var dlen = ds.length,
                di;
            for (di = 0; di < dlen; di++) {
                var d = ds[di];
                $DESCRIPTORS[d.key] = d.v;
            }
        }
    }

    mstrmojo.populateDescriptors = populateDescriptors;

    // When this file is loaded, try to merge the pre-loaded descriptor information into descriptor store
    if (window.mstrConfig !== undefined) {
        populateDescriptors(mstrConfig.mstrDescs && mstrConfig.mstrDescs.descriptors);

        // Remove the descriptors loaded into the page...
        mstrConfig.mstrDescs = null;
    }
    // #694796. merge pre-loaded descriptors
    if (window.mstrApp !== undefined) {
        populateDescriptors(mstrApp.mstrDescs && mstrApp.mstrDescs.descriptors);
    }

    /**
     * Helper method to retrieve descriptors via the XHR.
     *
     * @param {string} prefix The descriptor prefix.
     * @param {int[]} ids An array of requested descriptor IDs.
     *
     * @private
     */
    var requestDescriptor = function (prefix, ids) {
        // Create an array of input strings.
        var ns = [],
            len = ids.length,
            i;

        for (i = 0; i < len; i++) {
            var k = ids[i];
            if (k && !($DESCRIPTORS.hasOwnProperty(prefix + k))) {
                ns.push(k);
            }
        }
        if (ns.length > 0) {
            var response = syncXHR('POST', (window.mstrConfig && mstrConfig.taskURL) || 'taskProc', {
                taskId: 'getDescriptors',
                keys: ns.join(','),
                prefix: prefix
            });

            if (response) {
                var r = eval('(' + response + ')');
                populateDescriptors(r && r.descriptors);
            }
        }
    };

    /**
     * Ensure the required descriptors exist in descriptor store. If any descriptor is missing from the store,
     * this method will make XHR call to load it before returning.
     *
     * <p>This method takes a variable number of input parameters. The first parameter is for the prefix for every key.
     * Each parameter, except the first one, is assumed to be a descriptor id (number).</p>
     */
    mstrmojo.requiresDescsWPrefix = function reqDescP(prefix) {
        var args = [].slice.call(arguments);

        args[0] = null;
        requestDescriptor(prefix, args);
    };

    /**
     * <p>Ensure the required descriptors exist in descriptor store.</p>
     * If any descriptor is missing from the store, this method will make XHR call to load it before return.
     *
     * <p>This method takes a variable number of input parameters. Each parameter is assumed to be a
     * descriptor id (number). This method assumes that 'mstrWeb.' is the prefix for each key.</p>
     */
    mstrmojo.requiresDescs = function reqDesc() {
        // if we are not on a mobile device, then request the descriptors via XHR.
        // On a mobile device, it is assumed that the descriptors have been preloaded.
        if (window.mstrConfig !== undefined && !mstrConfig.onMobileDevice) {
            requestDescriptor(descPrefix, arguments);
        }
    };

    /**
     * <p>Returns the localized string for the descriptor key.</p>
     * This method assume the 'mstrWeb.' as the prefix. So, it will look up the descriptor by key 'mstrWeb.' + key.
     *
     * @param descID {Number} the key for the descriptor. It assumes the prefix for the key is 'mstrWeb.'.
     * @param defText {String} The text to use for the descriptor if it cannot be loaded.
     */
    mstrmojo.desc = function desc(descID, defText) {
        // Is the descID parameter a non-null value?
        if (descID !== null && descID !== undefined) {
            // Load the descriptor remotely if it is not found in the local store...
            mstrmojo.requiresDescs(descID);

            // Was it found?
            if ($DESCRIPTORS.hasOwnProperty(descPrefix + descID)) {
                return $DESCRIPTORS[descPrefix + descID];
            }

            // Give a meaningful string if omitted...
            defText = defText || "No string descriptor found for descID=" + descID;
        }

        // "Decorate" the default text...
        var decDefText = "[" + defText + "]";

        // Put the replacement text in the array so it doesn't get continually loaded from the Web Server...
        $DESCRIPTORS[descPrefix + descID] = decDefText;

        return decDefText;
    };

    /**
     * <p>Returns the localized string for the descriptor key.</p>
     * This method will lookup the descriptor whose key prefix + key.
     *
     * @param prefix {String} the prefix for the key.
     * @param descID {Number} the key for the descriptor. It assumes the prefix for the key is 'mstrWeb.'.
     * @param defText {String} The text to use for the descriptor if it cannot be loaded.
     */
    mstrmojo.descP = function descP(prefix, descID, defText) {
        // Load the descriptor remotely if it is not found in the local store...
        mstrmojo.requiresDescsWPrefix(prefix, descID);

        // Was it found?
        if ($DESCRIPTORS.hasOwnProperty(prefix + descID)) {
            return $DESCRIPTORS[prefix + descID];
        }

        // Give a meaningful string if omitted...
        defText = defText || "No string descriptor found for descID=" + descID;

        // "Decorate" the default text...
        var decDefText = "*" + defText + "*";

        // Put the replacement text in the array so it doesn't get continually loaded from the Web Server...
        $DESCRIPTORS[prefix + descID] = decDefText;

        return decDefText;
    };

    // =================== End of descriptors ============================

    /**
     * Records a given static class as loaded under a given fully qualified class name.
     *
     * @param {String} fqcn The fully qualified class name.
     * @param {Object} cls The static class object.
     * @returns {Object} The same static class object.
     */
    mstrmojo.provide = function prv(fqcn, cls) {
        isLoaded[fqcn] = !!cls;
        return cls;
    };

    //TQMS : 536567
    /**
     * <p>This method will mark the given FQCN as needing to be reloaded again during next call to {@link mstrmojo.requiresCls}.</p>
     *
     * @param {string} fqcn The fully qualified class name that should be reloaded during its next call to {@link mstrmojo.requiresCls}.
     */
    mstrmojo.invalidateCls = function rel(fqcn) {
        reqCache[fqcn] = false;
        isLoaded[fqcn] = false;

        eval(fqcn + " = null");
    };

    var mx = mstrmojo.mixin;

    /**
     * Creates a javascript custom class with the given superclass, mixins, and instance properties/methods.
     *
     * @param {Function} SuperCls The constructor of the superclass for the class to be declared. If missing, Object is implied.
     * @param {Object[]} mixins An optional array of "mixins" to be applied to the new custom class. A "mixin" is a hash table of
     *                          properties and/or methods; if given, these will be applied to the constructor's prototype.
     * @param {Object} config A hash table of functions, keyed by name. The functions are assumed to be instance methods;
     *                          they are applied to the constructor's prototype.
     *
     * @returns Function The class constructor.
     */
    mstrmojo.declare = function declare(SuperCls, mixins, config) {
        /**
         * Create a constructor for our custom class.  The constructor doesn't do much itself, it just calls
         * the class's instance method "init" (if any).  The one other job of the constructor is to check if the
         * input param tells it to skip the "init" call; this is useful when defining a subclass, because in
         * that scenario we want to skip the init call.
         *
         * @param {Object} [props={}] Optional instance properties.
         * @inner
         */
        function Constr(props) {
            if ((!props || !props.dontInit) && this.init) {
                this.init(props);
            }
        }

        // If superclass is given, set the constructor's prototype to an instance of it.  This allows
        // every instance of our constructor to inherit all the superclass' instance methods/props.  However,
        // this also means that all instances of our constructor will inherit the "constructor" property
        // from that superclass instance; the superclass instance's "constructor" property is the superclass constructor.
        // That's not right for us; we want all instances of our constructor to have their "constructor" property
        // point back to our constructor (of course).  To fix that, simply manually reset the constructor's prototype's
        // "constructor" back to our constructor.
        if (SuperCls) {
            Constr.prototype = new SuperCls({
                dontInit: true
            });
            Constr.prototype.constructor = Constr;
        }

        var proto = Constr.prototype;

        // Apply all the mixin methods to the constructor's prototype.
        var cnt = (mixins && mixins.length) || 0,
            i;
        for (i = 0; i < cnt; i++) {
            mx(mixins[i], proto);
        }

        // Apply all the instance methods to the constructor's prototype.
        if (config) {
            mx(config, proto);
            if (config.scriptClass) {
                isLoaded[config.scriptClass] = true;
            }
        }

        return Constr;
    };

    /**
     * Finds an ancestor widget (via 'parent' chain) by searching for the presence of a particular field or method.
     *
     * @param {mstrmojo.Widget} src The {@link mstrmojo.Widget} to begin searching from.
     * @param {string} property The name of the field or method to search for.
     * @param {*} [value=null] An optional property value to match against.
     * @param {mstrmojo.Container} [limitClass=null] An optional constructor to be used to limit the search.  If at any time this search
     *          encounters an instance of this passed constructor the search will halt and null will be returned.
     *
     * @returns {mstrmojo.Container} The found instance of {@link mstrmojo.Container}, or null if not found.

     * @static
     */
    mstrmojo.findAncestor = function findAncestor(src, property, value, limitClass) {
        var ancestor = src && src.parent;
        while (ancestor && (!limitClass || !(ancestor instanceof limitClass))) {
            var targetProperty = ancestor[property];
            if (targetProperty !== undefined) {
                if (value !== undefined && value !== null) {
                    if (targetProperty === value) {
                        return ancestor;
                    }
                } else {
                    return ancestor;
                }
            }

            ancestor = ancestor.parent;
        }

        return null;
    };

    /**
     * Check a given mojo widget to see whether it is a descandant of another mojo widget.
     * @param {mstrmojo.Widget} parent The container widget.
     * @param {mstrmojo.Widget} child The candidate descendant widget.
     *
     * @returns {boolean} True if child widget is a descendant of parent widget, otherwise, false
     */
    mstrmojo.isDescendant = function isDescendant(parent, child) {
        var ancestor;

        if (!child || !parent) {
            return false;
        }
        ancestor = child.parent;
        //loop through the ancestor of child widget
        while (ancestor) {
            //if found a match, end the loop and return true
            if (ancestor === parent) {
                return true;
            }
            //otherwise, look for its parent
            ancestor = ancestor.parent;
        }
        return false;
    };

    /**
     * Get CSRF token
     * @param {*} [url=null] the url where the token is to be added to. It would not append if it points to a different Web application
     * @returns {string} the csrf token
     */
    mstrmojo.getCSRFToken = function getCSRFToken(url) {
        var tkn = null;

        try {
            if (url) { // if a URL is provided we first check if we should add the token
                if (url.indexOf('validateRandNum=') >= 0) { // token already there?
                    return tkn;
                }

                if (this.isUrlExternal(url)) { // links to external websites do not need the token
                    return tkn;
                }
            }
            if (window.mstrApp && mstrApp.validateRandNum) {
                tkn = mstrApp.validateRandNum;
            } else if (window.mstrConfig && mstrConfig.validateRandNum) {
                tkn = mstrConfig.validateRandNum;
            } else if (window.microstrategy !== undefined && microstrategy && microstrategy.validateRandNum) {
                tkn = microstrategy.validateRandNum;
            }
        } catch (err) {
            //ignore
        }
        return tkn;
    };

    /**
     * Adds the CSRF token to a URL if needed
     * @param {String} url the url to add the token to
     * @returns {String} url with appended token if needed
     */
    mstrmojo.addCSRFTokenToURL = function addCSRFTknToURL(url) {
        if (!url) {
            return '';
        }
        var tkn = mstrmojo.getCSRFToken(url);
        if (tkn && tkn.length > 0) {
            if (url.indexOf('?') > 0) {
                url += "&";
            } else {
                url += "?";
            }
            url += "validateRandNum=" + tkn;
        }
        return url;
    };

    /**
     * Adds the CSRF token to task params if needed
     * @param {Object} params the task params collection
     * @returns {Object} params the task params collection
     */
    mstrmojo.addCSRFTokenToTaskParams = function addCSRFTknToTaskParams(params) {
        if (params) {
            var tkn = mstrmojo.getCSRFToken();
            if (tkn && tkn.length > 0) {
                params.validateRandNum = tkn;
            }
        }
        return params;
    };

    /**
     * <p>Returns a new instance as described by the configuration.</p>
     *
     * @param {Object} config The configuration for the requested instance (must include a valid scriptClass property).
     *
     * @return mstrmojo.Obj
     */
    mstrmojo.getInstance = function getInstance(config) {
        var Clazz = mstrmojo.hash.walk(config.scriptClass, window);
        if (Clazz) {
            return new Clazz(config);
        }

        return null;
    };

    /**
     * Determine is the URL provided is external (i.e. google.com)
     * @param url
     * @returns {boolean}
     */
    mstrmojo.isUrlExternal = function isUrlExternal(url) {
        var curURL = window.location.href;
        var servletName = window.mstrApp && mstrApp.name,
            taskProcName = window.mstrConfig.taskURL && mstrConfig.taskURL,
            isSameWebApp = (url.indexOf('?') === 0 || //?evt...
                url.indexOf(servletName) === 0 || //mstrWeb
                url.indexOf('./' + servletName) === 0 || // ./mstrWeb
                url.indexOf(taskProcName) === 0 || //taskProc
                url.indexOf('./' + taskProcName) === 0 || // ./taskProc
                url.indexOf(curURL) === 0 || // http://localhost:8080/MicroStrategy/servlet/mstrWeb
                ((curURL.indexOf('?') > 0) && (url.indexOf(curURL.substring(0, curURL.indexOf('?'))) === 0))); // http://localhost:8080/MicroStrategy/servlet/mstrWeb?a=1&b=2
        return !isSameWebApp;
    };

    /**
     * Resolve the value of a feature. Return true if the feature exists and it's true.
     *
     * @param {String} feature the name of the feature
     * @returns {Boolean}
     */
    mstrmojo.resolveFeature = function resolveFeature(feature) {
        var features = mstrApp.features;

        return features && features[feature];
    };
}());
(function () {
    //This class is borrowed from http://www.webtoolkit.info/javascript-base64.html
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        $FROM_CHAR_CODE = String.fromCharCode;

    function utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utfText = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utfText += $FROM_CHAR_CODE(c);
            } else if ((c > 127) && (c < 2048)) {
                utfText += $FROM_CHAR_CODE((c >> 6) | 192);
                utfText += $FROM_CHAR_CODE((c & 63) | 128);
            } else {
                utfText += $FROM_CHAR_CODE((c >> 12) | 224);
                utfText += $FROM_CHAR_CODE(((c >> 6) & 63) | 128);
                utfText += $FROM_CHAR_CODE((c & 63) | 128);
            }
        }

        return utfText;
    }

    function utf8Decode(utfText) {
        var string = "",
            i = 0,
            c = 0, c1 = 0, c2 = 0;

        while (i < utfText.length) {
            c = utfText.charCodeAt(i);
            if (c < 128) {
                string += $FROM_CHAR_CODE(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c1 = utfText.charCodeAt(i + 1);
                string += $FROM_CHAR_CODE(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utfText.charCodeAt(i + 1);
                c2 = utfText.charCodeAt(i + 2);
                string += $FROM_CHAR_CODE(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return string;
    }

    /**
     * @namespace mstrmojo.base64
     */
    mstrmojo.base64 = mstrmojo.provide(
        "mstrmojo.base64",

        /**
         * @lends mstrmojo.base64
         */
        {
            /**
             * <p> Decode the Base64-encoded response header whose value are in the following format: "=?UTF-8?B?EncodedText?=" </p>
             *
             * @param {String} value The value of a response header.
             *
             * @returns {String} The decoded response header.
             */
            decodeHttpHeader: function decodeHttpHeader(value) {
                var rEncoded = /\=\?UTF-8\?B\?(.+?)\?\=/g;
                if (value && value.indexOf("=?UTF-8?B?") === 0) {
                    var decMsg = "", result;
                    while ((result = rEncoded.exec(value)) !== null) {
                        decMsg += mstrmojo.base64.decode(result[1]);
                    }
                    return decMsg;
                }
                return value;
            },

            /**
             * Use Base64 to encode a string input.
             *
             * @param {String} input A string value.
             *
             * @returns {String} The Base64 encoded string.
             */
            encode: function encode(input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = utf8Encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output += _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

                }
                return output;
            },

            /**
             * Decode a Base64 encoded string.
             *
             * @param {String} input A Base64 encoded string value.
             *
             * @returns {String} The decoded string.
             */
            decode: function decode(input) {
                var output = "", i = 0;
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output += $FROM_CHAR_CODE(chr1);

                    if (enc3 !== 64) {
                        output += $FROM_CHAR_CODE(chr2);
                    }
                    if (enc4 !== 64) {
                        output += $FROM_CHAR_CODE(chr3);
                    }
                }
                output = utf8Decode(output);
                return output;
            }
        }
    );
})();

/**
 * Enumeration for widget types
 */
mstrmojo.vi.viz.EnumWidgetTypes = {

    GRID: 0,
    GRAPH_MATRIX: 1,
    HEATMAP: 2,
    NETWORK: 3,
    IMAGELAYOUT: 4,     // confirm!
    ESRIMAP: 5,
    GOOGLEMAP: 6

};
(function () {

    /**
     * Represents single title.
     *
     * @class
     */
    mstrmojo.models.template.Title = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.models.template.Title.prototype
         */
        {
            init: function init(props) {
                this.title = props.title;
            },

            getActionType: function () {
                return this.title.at;
            },
            getDrillPath: function () {
                return this.title.dp;
            },
            getHeaderValues: function getHeaderValues() {
                return this.title.es;
            },
            getHeaderName: function getHeaderValue(pos) {
                return this.title.es[pos].n;
            },
            getHeaderId: function getHeaderValue(pos) {
                return this.title.es[pos].id;
            },
            getForms: function getForms() {
                return this.title.fs;
            },
            getFormId: function getFormId() {
                return this.title.fid;
            },
            getFormType: function getFormType() {
                return this.title.ftp;
            },
            getUnitId: function getUnitId() {
                return this.title.id;
            },
            getLinkMap: function getLinkMap() {
                return this.title.lm;
            },
            getName: function getName() {
                return this.title.n;
            },
            getUnitDssType: function () {
                return this.title.otp;
            },
            getSelectorControl: function () {
                return this.title.sc;
            }
        }
    );
}());
(function () {



    function parseSetsAndCompareFunc(args) {
        var sets = [].slice.call(args),//make sure args is array
            last = sets[sets.length - 1],
            compareFunc = function (a, b) {
                return a === b;
            };

        // if the last parameter is a function|string, set it as compareFunc
        if (/function|string/.test(typeof last)) {
            compareFunc = typeof last === 'function' ? last : function (a, b) {
                return a[last] === b[last];
            };
            sets = sets.slice(0, sets.length - 1);
        }

        return {
            sets: sets,
            compareFunc: compareFunc
        };
    }

    /**
     * A utility class for working with arrays.
     *
     * @type {Object}
     */
    mstrmojo.array = mstrmojo.provide(
        "mstrmojo.array",

        /**
         * @lends mstrmojo.array
         */
        {

            /**
             * Searches a given array for a given item.
             *
             * @param {Array.<*>} arr The array to search.
             * @param {*} item The item to search for.
             *
             * @return {number} The index of the item if found; -1 otherwise.
             */
            indexOf: function indexOf(arr, item) {
                var len = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    if (arr[i] == item) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             * <p>Searches a given array for given set of items and returns an object with:</p>
             *
             * <ul>
             *     <li>"indices": an array of indices, one for each given item (null, if not found);</li>
             *     <li>"map": a mapping of each found item, keyed by its index in "items" param, to the index where it was found in the "arr" param.</li>
             *     <li>"count": the number of items found, possibly 0;</li>
             * </ul>
             *
             * @returns {{
             *     indices: int[],
             *     map: Object.<int, *>,
             *     count: int
             * }}
             */
            indexOfMulti: function indexOfMulti(arr, items) {
                var indices = [],
                    map = {},
                    count = 0,
                    me = this;

                // Iterate source array.
                me.forEach(arr, function (srcItem, srcIdx) {
                    // Iterate test items array.
                    me.forEach(items, function (testItem, testIdx) {
                        // Do the items match?
                        var isItem = (testItem === srcItem);
                        if (isItem) {
                            // Cached index in indices and map and increment count.
                            indices[testIdx] = map[testIdx] = srcIdx;
                            count++;
                        }

                        // Return true if item was found so iteration halts.
                        return !isItem;
                    });
                });

                // Return result.
                return {
                    indices: indices.length ? indices : null,
                    map: map,
                    count: count
                };
            },

            /**
             * Calls a given function once per each item in a given array,
             * passing into that function 3 arguments: the item value, the
             * item index, and the array itself.
             *
             * @param {Array.<*>|NodeList} arr The Array to be iterated.
             * @param {function(value, index:int, arr:Array)} f The function to be run for each iteration.  The function will accept three parameters (value, index, arr) and if it explicitly returns false the
             *        iteration will be canceled.
             * @param {mstrmojo.Obj=} scope An optional scope for the passed function.
             * @returns {Array.<*>|NodeList}
             */
            forEach: function forEach(arr, f, scope) {
                var len = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    var isLast = i === (len - 1);

                    if (scope) {
                        if (f.call(scope, arr[i], i, arr, isLast) === false) {
                            break;
                        }
                    } else {
                        if (f(arr[i], i, arr, isLast) === false) {
                            break;
                        }
                    }
                }
                return arr;
            },


            /**
             *  <p> Creates a new array with the results of calling a provided function on every element in this array.</p>
             *
             *  @param {Array.<*>} arr The array to loop through.
             *  @param {function(element)} f The function to use to apply each element. The function must have a return value.
             *
             *  @return {Array.<*>}
             */
            map: function map(arr, f) {
                var len = (arr && arr.length) || 0,
                    ret = [],
                    i;

                for (i = 0; i < len; i++) {
                    ret[i] = f(arr[i], i);
                }

                return ret;
            },

            /**
             * <p>Returns the subset of a given array.</p>
             *
             * <p>The items of the subset are determined by a given filter function. The function receives
             * each item as the sole argument to the function, and those items
             * for whom the function returns truthy are included in the subset.</p>
             *
             * @param {Array.<*>} arr The array to filter.
             * @param {function(*, number, Array.<*>)} fnFilter The function to use to test each element.
             * @param {{max: int}=} config An optional configuration object with a max value corresponding to the number of elements to find.
             *
             * @returns {Array.<*>}
             */
            filter: function filter(arr, fnFilter, config) {
                var subset = [],
                    cnt = 0,
                    len = (arr && arr.length) || 0,
                    max = (config && config.max) || 0,
                    i;

                // Iterate array.
                for (i = 0; i < len; i++) {
                    // Should this element be included in the subset?
                    if (fnFilter(arr[i], i, arr)) {
                        // Add to subset.
                        subset[cnt] = arr[i];

                        // Increment counter.
                        cnt++;

                        // Is there a max AND have we exceeded it?
                        if (max && cnt >= max) {
                            // Halt iteration.
                            break;
                        }
                    }
                }

                return subset;
            },

            /**
             * Returns a single element from the given array using the fnFilter function to test.
             *
             * @param {Array} arr The array to filter.
             * @param {function(element)} fnFilter The function to use to test each element.
             *
             * @returns {*}
             */
            filterOne: function filterOne(arr, fnFilter) {
                // Use filter to find one element.
                var subset = this.filter(arr, fnFilter, {
                    max: 1
                });

                // Did we get a subset array back with at least one element?
                if (subset.length) {
                    // Return first element.
                    return subset[0];
                }

                // No item found so return null.
                return null;
            },

            /**
             * Wraps the parameter in an array if it's not already an array.
             *
             * @param {Array.<Object>|Object|undefined} arr
             *
             * @returns {Array.<Object>}
             */
            ensureArray: function ensureArray(arr) {
                return [].concat(arr || []);
            },

            /**
             * Returns the index of the first item in a given array whose given
             * property name matches a given value.  This is a faster alternative to
             * using filter() for a simple property-value search.
             *
             * @param {Array.<*>} arr The array to search.
             * @param {string} n The name of the property to match.
             * @param {*} v The value to match on.
             *
             * @return {number} The index of the found item (or -1 if not found).
             */
            find: function find(arr, n, v) {
                var len = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    var obj = arr[i];
                    if (obj && obj[n] == v) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             * Returns the subset of a given array which removes the repetition (on a given property name if provided).
             * This is an algorithm with n^2 time complexity and improvement is needed in future.
             *
             * @param {Array.<*>} arr The array to search.
             * @param {string=} n Optional. The name of the property to match.
             *
             * @return {Array.<*>} The subset of the input array without repetition (on property n if provided).
             */
            distinct: function distinct(arr, n) {
                if (arr.reduce && !n) {
                    return arr.reduce(function (reducedArray, currentValue) {
                        // Does the current value exist in the reduced array ?
                        if (reducedArray.indexOf(currentValue) < 0) {
                            // If not - add it to the collection.
                            reducedArray.push(currentValue);
                        }

                        // Return the reduced array.
                        return reducedArray;
                    }, []);
                }

                var len = (arr && arr.length) || 0,
                    i,
                    obj,
                    subset = [];
                for (i = 0; i < len; i++) {
                    obj = arr[i];
                    if ((obj !== undefined) && ((n && this.find(subset, n, obj[n]) < 0) || (!n && this.indexOf(subset, obj) < 0))) {
                        subset.push(obj);
                    }
                }
                return subset;
            },

            /**
             * Binary search for an array item via comparison of a property.
             * Assumes the array is sorted (ascending) via the given property's value.
             * @param {Array.<*>} arr Array of items to be searched.
             * @param {Object} item Item whose property value is to be matched.
             * @param {string} p Name of property whose value is to be matched.
             * @param {number} [len] Length of given array; can be supplied as a performance optimization.
             */
            findBin: function fBin(arr, item, p, len) {
                var h = len || arr.length, // high
                    l = -1,                // low
                    m,                     // medium
                    v = item[p];           // value
                while (h - l > 1) {
                    if (arr[m = h + l >> 1][p] < v) { // a+b >> 1 is shortcut for parseInt((a+b)/2,10)
                        l = m;
                    } else {
                        h = m;
                    }
                }

                return arr[h][p] === v ? h : -1;
            },

            /**
             * Searches the provided array for an item that has a property p with a specified value.  The array must be
             * sorted in ascending order by the property p otherwise the results are undefined.  Both the property values
             * and the test value are assumed to be strings. The search is case INSENSITIVE.
             * The comparison of item property value against the test value is limited to the length on the test value.
             * If no match is found, this method returns the index into the array where an object with property p == test value
             * should be inserted to keep the array sorted.
             *
             * @param {Array.<*>} o Array to search
             * @param {string} v Value to search for in the array items property p
             * @param {string} p Name of property to use in comparisons
             * @return {number} The index of matching string or place to insert object with test value.
             */
            search: function search(o, v, p) {
                var h = o.length,
                    l = -1,
                    m,
                    val = v.toUpperCase(),
                    len = v.length;

                while (h - l > 1) {
                    if (o[m = h + l >> 1][p].substr(0, len).toUpperCase() < val) {
                        l = m;
                    } else {
                        h = m;
                    }
                }
                return h;
            },

            /**
             * Searches a given array for items which match a given set of items on a given property.
             *
             * @param {Array.<*>} arr The items to be searched.
             * @param {string} n The property name which will be used to match items.
             * @param {Array.<*>} items The items to be searched for.
             *
             * @return {Object} The search results object, with the following properties:
             *
             * <ul>
             *     <li>"indices": an array of indices, one for each given item (null, if not found);</li>
             *     <li>"count": the number of items found, possibly 0;</li>
             *     <li>"map": a mapping of each found item, keyed by its index in "items" param, to the index where it was found
             *                in the "arr" param.</li>
             * </ul>
             */
            findMulti: function idxOf(arr, n, items) {
                if (!items) {
                    return {
                        indices: null,
                        map: {},
                        count: 0
                    };
                }
                var len = items.length,
                    indices = [], // new Array(len), can not create fixed length array, since the items may have item not in the arr range.
                    map = {},
                    c = 0,
                    j = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < j; i++) {
                    var a = arr[i][n],
                        k;

                    for (k = 0; k < len; k++) {
                        if (items[k][n] === a) {
                            indices[k] = i;
                            map[k] = i;
                            c++;
                            break;  // Assumes item won't be repeat in items
                        }
                    }
                }
                return {
                    indices: indices,
                    map: map,
                    count: c
                };
            },

            /**
             * Removes a given item from a given array, if found.
             *
             * @param {Array.<*>} arr The array to remove from.
             * @param {*} item The item to removed.
             *
             * @return {number} The index of the item that was removed (or -1 if not found).
             */
            removeItem: function removeItem(arr, item) {
                var i = this.indexOf(arr, item);
                if (i > -1) {
                    this.removeIndices(arr, i, 1);
                }
                return i;
            },

            /**
             * Searches a given array for items which match a given set of items on a given property, and
             * removes any of the matches found.
             *
             * @param {Array.<*>} arr The items to be searched.
             * @param {string} n The property name which will be used to match items.
             * @param {Array.<*>} items The items to be searched for.
             */
            removeItems: function removeItems(arr, n, items) {
                var ret = this.findMulti(arr, n, items);
                if (ret.count) {
                    // Sort the indices in ascending order, slice off the nulls (i.e., the not found).
                    var indices = ret.indices.concat().sort(this.numSorter).slice(0, ret.count),
                        i;
                    for (i = indices.length - 1; i > -1; i--) {
                        // TO DO: optimize this function to do splices in ranges, not individual items.
                        arr.splice(indices[i], 1);
                    }
                }
            },

            /**
             * Comparison function for sorting number data types. Used with Array.prototype.sort.
             */
            numSorter: function numSorter(a, b) {
                return Number(a) - Number(b);
            },

            stringSorter: function stringSorter(a, b) {
                var A = a.toLowerCase(),
                    B = b.toLowerCase();

                if (A < B) {
                    return -1;
                }

                if (A > B) {
                    return 1;
                }

                return 0;
            },

            /**
             * Removes a given range of indices from a given array.
             *
             * @param {Array.<*>} arr The array whose indices should be removed.
             * @param {number} start The starting index (0-based) of the indices to be removed.
             * @param {number} count The number of indices to be removed.
             */
            removeIndices: function removeIds(arr, start, count) {
                arr.splice(start, count);
            },

            /**
             * Inserts a given array of items into a given array at a given index.
             *
             * @param {Array.<*>} [arr] The array to be inserted into; if missing, a new array is created.
             * @param {number} idx The index at which to insert the new items.
             * @param {Array.<*>} items The items to be inserted.
             *
             * @return {Array.<*>} The array after insertion.
             */
            insert: function inst(arr, idx, items) {
                if (!arr) {
                    arr = [];
                }
                if (idx === null || idx === undefined) {
                    idx = arr.length;
                }
                Array.prototype.splice.apply(arr, [idx, 0].concat(items));
                return arr;
            },

            /**
             * <p>Creates a hash table of booleans from the contents of a given array.</p>
             *
             * <p>The array values are used as the hash keys; the hash values are all set to true.</p>
             *
             * @param {Array.<*>} arr The array from which to read the hash keys.
             * @param {Object=} h An optional hash that will be populated with the array properties.
             *
             * @return {Object} The new (or modified) hash table.
             */
            hash: function hash(arr, h) {
                h = h || {};
                var len = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    h[arr[i]] = true;
                }

                return h;
            },

            /**
             * Returns a list of the items at the given indices of an array.
             * @param {Array.<*>} arr The array whose items are to be read.
             * @param {Array.<int>} indices The list of indices at which the array will be read. If null, null is returned. If empty, an empty array is returned.
             *
             * @return {Array.<*>} The subset of array items at the requested indices; possibly empty or null.
             */
            get: function get(arr, indices) {
                if (!indices) {
                    return null;
                }
                var ret = [],
                    len = indices.length,
                    i;

                for (i = 0; i < len; i++) {
                    ret[i] = arr[indices[i]];
                }
                return ret;
            },

            /**
             * This function do a deep sort on array of array of objects based on a sortable object property.
             *
             * The object in the innermost array could have depth 2 or higher.
             *
             * @param {Array.<*>} arr Array to sort
             * @param {string} prop Property to sort on
             * @param {number} idx Index of the property in the object (0-based).
             * @param {boolean} asc
             *
             * var data = [ //all rows
             [ //row 1
             { //col 1
               text: 'r1 text 1',//text to display
               icon: 'r1 icon 1'
             },
             { //col 2
               text: 'r1 text 2',//text to display
               icon: 'icon 2'
             },

             { //col 3
               text: 'r1 text 3',//text to display
               icon: 'icon 3'
             }

             ],//end row1

             [ //row 2

             { //col 1
               text: 'r2 text 1',//text to display
               icon: 'r2 icon 1'
             },
             { //col 2
               text: 'r2 text 2',//text to display
               icon: 'r2 icon 2'
             },

             { //col 3
               text: 'r2 text 3',//text to display
               icon: ' r2 icon 3'
             }


             ], //end row2
             [ //row 3

             { //col 1
               text: 'ar3 text 1',//text to display
               icon: 'r3 icon 1'
             },
             { //col 2
               text: 'r3 text 2',//text to display
               icon: 'r3 icon 2'
             },

             { //col 3
               text: 'r3 text 3',//text to display
               icon: ' r3 icon 3'
             }


             ]//end row3
             ];

             Usage: Sort on 'text' whose index is 0 in the sample data 'col' object.
             deepSort(data, 'text', 0, true);
             */
            deepSortArr: function deepSortArr(arr, prop, idx, asc) {
                return arr.sort(function (a, b) {
                    var aProp = a[idx][prop],
                        bProp = b[idx][prop];

                    if (!asc) {
                        return (aProp <= bProp);
                    }

                    return (aProp > bProp) ? -1 : 1;
                });
            },

            isArray: function (obj) {
                var isa = Array.isArray;
                if (isa) {
                    return isa(obj);
                }
                //ie8
                return Object.prototype.toString.call(obj) === '[object Array]';
            },

            /**
             * <p>This method tests whether any element in the array will pass the test implemented by the provided function.</p>
             *
             * @param {Array.<*>} arr The array to validate.
             * @param {function(*, number=, Array.<*>=):boolean} fnSome The function used to test each element.
             *
             * @returns {boolean}
             */
            some: function some(arr, fnSome) {
                // Is the array undefined or null?
                if (!arr) {
                    // Not found.
                    return false;
                }

                // Does the array support the native some method?
                if (arr.some) {
                    // Use the native method.
                    return arr.some(fnSome);
                }

                // Assume result is false.
                var result = false;

                // Iterate array.
                this.forEach(arr, function (element, idx) {
                    // Evaluate current element.
                    result = fnSome(element, idx, arr);

                    // Return false if found (so iteration halts).
                    return !result;
                });

                // Return result.
                return result;
            },

            /**
             * Compute the set-theoretic difference for several arrays.
             * NOTE: The passed-in arrays should be sets, not multi-sets.
             *       The result of multi-sets is unpredictable.
             *       Passing [1,2,6,8,9] is fine, but passing [1,1,3,3,5] is not recommended.
             *
             * The result must be a subset of the first array.
             * For example:
             * - difference([1,2,3,4], [2,4,7,9]) will return [1,3]
             * - difference([1,2,3,5,6,7], [2,3,4], [4,5,6]) will return [1, 7]
             *
             * Moreover, you can pass a function as the last parameter, this function will
             * act as a compare function to determine whether two items are identical.
             *
             * For example:
             * - difference([{n: 1}, {n:2}, {n:3}], [{n:2}], function(a,b){return a.n === b.n})
             *   will get [{n: 1}, {n: 3}]
             *
             * Also, if you think your compare function is too simple to write a function, pass
             * a string to indicate the property you are comparing to is fine.
             *
             * For example:
             * - difference([{n: 1}, {n:2}, {n:3}], [{n:2}], 'n')
             *   will get [{n: 1}, {n: 3}]
             *
             * @returns Array
             */
            difference: function difference() {
                if (arguments.length < 2) {
                    throw new Error("difference should get at least 2 parameters");
                }

                var obj = parseSetsAndCompareFunc(arguments),
                    sets = obj.sets,
                    compareFunc = obj.compareFunc,
                    first = sets[0],
                    rest = [].concat.apply([], sets.slice(1)); // flatten the rest sets

                return first.filter(function (item) {
                    return !rest.some(function (rest_item) {
                        return compareFunc(item, rest_item);
                    });
                });
            },

            /**
             * Compute the set-theoretic intersection for several arrays.
             * NOTE: The passed-in arrays should be sets, not multi-sets.
             *       passing [1,2,6,8,9] is fine, but passing [1,1,3,3,5] is not recommended.
             *
             * For example:
             * - intersection([1,2,3,4], [2,4,7,9]) will return [2, 4]
             * - intersection([1,2,3,5,6,7], [2,3,4], [2,4,5,6]) will return [2]
             *
             * Moreover, you can pass a function as the last parameter, this function will
             * act as a compare function to determine whether two items are identical.
             *
             * For example:
             * - intersection([{n: 1}, {n:2}, {n:3}], [{n:2}], function(a,b){return a.n === b.n})
             *   will get [{n: 2}]
             *
             * Also, if you think your compare function is too simple to write a function, pass
             * a string to indicate the property you are comparing to is fine.
             *
             * For example:
             * - intersection([{n: 1}, {n:2}, {n:3}], [{n:2}], 'n')
             *   will get [{n: 2}]
             *
             * @returns Array
             */
            intersection: function intersect() {
                if (arguments.length < 2) {
                    throw new Error("intersection should get at least 2 parameters");
                }

                var obj = parseSetsAndCompareFunc(arguments),
                    sets = obj.sets,
                    compareFunc = obj.compareFunc,
                    result = sets[0],
                    rest = sets.slice(1);

                // intersect with every sets
                rest.forEach(function (_set) {
                    result = result.filter(function (item) {
                        return _set.some(function (item2) {
                            return compareFunc(item, item2);
                        });
                    });
                });

                return result;
            },

            /**
             * Static function used with Array.prototype.reduce to reduce a collection of numbers.
             *
             * @param {number} sum
             * @param {number} value
             *
             * @returns {Number}
             */
            fnReduceNumber: function fnReduceNumber(sum, value) {
                return sum + value;
            }
        }
    );
}());

/**
 * Enumeration for visualization style names
 */
mstrmojo.vi.viz.EnumVizStyles = {

    GRAPH_MATRIX: "GraphMatrixVisualizationStyle",
    NETWORK: "NetworkVisualizationStyle",
    HEAT_MAP: "VIHeatMapVisualizationStyle",
    GOOGLE_MAP: "GoogleMapVisualizationStyle",
    ESRI_MAP: "ESRIMapVisualizationStyle"

};
(function () {

    /**
     * <p>Helper class for working with hash objects..</p>
     *
     * @namespace mstrmojo.hash
     */
    mstrmojo.hash = mstrmojo.provide(
        "mstrmojo.hash",

        /**
         * @lends mstrmojo.hash
         */
        {
            /**
             * <p>Copies all of the members of a given source hash to another given destination hash.</p>
             *
             * <p>Any existing members in the destination whose names conflict will be overwritten.</p>
             *
             * @param {Object} src The source object whose properties/values should be copied.
             * @param {Object=} dest An optional hash to receive the copied properties/values.  If this parameter is undefined, an empty hash will be used.
             *
             * @returns {Object} The modified destination hash.
             */
            copy: function copy(src, dest) {
                if (src) {
                    dest = dest || {};

                    var n;
                    for (n in src) {
                        dest[n] = src[n];
                    }
                }
                return dest;
            },

            /**
             * <p>Copies an enumerated list of members of a given source hash to another given destination hash.</p>
             *
             * <p>Any existing members in the destination whose names conflict will be overwritten.  Only overwrites the value if the property is present in the source hash.</p>
             *
             * @param {string[]} ns An array of property names to be copied.
             * @param {Object} src The hash from which the property values should be copied.
             * @param {Object=} dest An optional hash to which the property values should be copied.  If this parameter is undefined, an empty hash will be used.
             *
             * @returns {Object} The modified destination hash.
             */
            copyProps: function copyProps(ns, src, dest) {
                // If destination is not there create one.
                dest = dest || {};

                if (src) {
                    // Iterate properties.
                    var length = (ns && ns.length) || 0,
                        i;

                    for (i = 0; i < length; i++) {
                        var n = ns[i];
                        // Does the property exist in the source hash?
                        if (src[n] !== undefined) {
                            // Overwrite the property value in the destination hash.
                            dest[n] = src[n];
                        }
                    }
                }
                return dest;
            },

            /**
             * <p>Iterates the supplied hash and calls the supplied function once for each item in the hash.</p>
             *
             * <p>The function is passed three parameters:</p>
             *
             * <ol>
             *  <li>The member value</li>
             *  <li>The member key</li>
             *  <li>The hash itself</li>
             * </ol>

             * @param {Object} hash The hash to be iterated.
             * @param {Function} f The function to be run for each iteration.
             * @param {Object=} scope An optional scope for the passed function.
             *
             * @returns {Object} The iterated hash object.
             */
            forEach: function forEach(hash, f, scope) {
                if (hash) {
                    var key;
                    for (key in hash) {
                        if (scope) {
                            if (f.call(scope, hash[key], key, hash) === false) {
                                break;
                            }
                        } else {
                            if (f(hash[key], key, hash) === false) {
                                break;
                            }
                        }
                    }
                }

                return hash;
            },

            /**
             * <p>Walks a given path of property names, starting with a context object.  If no context is given, the global context is assumed.</p>
             *
             * @param {string} path The path to be walked.
             * @param {Object} context The object to be walked.
             *
             * @returns {Object} The resolved path within the supplied context.
             */
            walk: function walk(path, context) {
                if (!context) {
                    context = mstrmojo.global;
                }

                var parts = path.split('.');
                if (parts.length === 1) {
                    return context[path];
                }

                var length = (parts && parts.length) || 0,
                    i;
                for (i = 0; i < length; i++) {
                    context = context[parts[i]];
                    if (!context) {
                        break;
                    }
                }
                return context;
            },

            /**
             * <p>Returns true if a given hash either:</p>
             *
             *  <ol>
             *      <li>is null or</li>
             *      <li>has no non-null property values.</li>
             *  </ol>
             *
             *  @param {Object} hash The hash object to evaluate.
             *
             *  @return {boolean}
             */
            isEmpty: function isEmpty(hash) {
                if (!hash) {
                    return true;
                }

                var k;
                for (k in hash) {
                    if (hash[k] !== null && hash[k] !== undefined) {  // is not null and not undefined
                        return false;
                    }
                }

                return true;
            },

            /**
             * <p>Removes all the properties of a given hash table.</p>
             *
             * @param {Object} h The hash table.
             * @returns {Object} The given hash table.
             */
            clear: function clear(h) {
                if (h) {
                    var k;
                    for (k in h) {
                        delete h[k];
                    }
                }

                return h;
            },

            /**
             * <p>Returns any (the first) property value encountered in a given hash if any; <i>undefined</i> otherwise.</p>
             *
             * <p>Similar in concept to reading the first item in an array, however no order is guaranteed for a hash's properties.</p>
             *
             * @param {Object} hash The hash to examine.
             * @param {boolean} [keyOrValue=false] Whether to look for the key (true) or the value (undefined|false).
             *
             * @returns {string|number|Object|undefined} Either the key, the value or <i>undefined</i>.
             */
            any: function any(hash, keyOrValue) {
                var rtn;

                // Was a hash provided?
                if (hash) {
                    // Get keys.
                    var keys = this.keyarray(hash); //Object.keys(hash); //IE8 does not support this api

                    // Is there at least one key?
                    if (keys.length > 0) {
                        // Set return value to either key or the value of the hash at that key.
                        var k = keys[0];
                        rtn = keyOrValue ? k : hash[k];
                    }
                }

                return rtn;
            },

            /**
             * <p>Creates a deep clone of a given hash (or array), meaning that any contained hash object (or arrays) are also cloned.</p>
             *
             * @param {Object|Array} obj The object (or array) to be cloned.
             *
             * @returns {Object|Array} The cloned object (or array).
             */
            clone: function clone(obj) {
                if (!obj) {
                    return null;
                }

                var c;
                if (obj.constructor === Array) {
                    // An array can be duplicated by concat, but that's only a shallow clone.
                    c = obj.concat();
                    // Check if we need to clone the array items too.
                    var first = c[0];
                    if (first && typeof first === 'object') {
                        var len = c.length,
                            i;
                        for (i = 0; i < len; i++) {
                            c[i] = this.clone(obj[i]);
                        }
                    }
                } else {
                    // Assume its a hash.
                    c = {};
                    var k;
                    for (k in obj) {
                        var v = obj[k];
                        // Check if we have a subobject/subarray to clone.
                        if (v && typeof v === 'object') {
                            // Nested object/array, clone recursively.
                            c[k] = this.clone(v);
                        } else {
                            // Scalar, just copy by value.
                            c[k] = v;
                        }
                    }
                }

                return c;
            },

            /**
             * <p>Clones an array.</p>
             *
             * @param {Array} arr The array to clone.
             *
             * @returns {Array} The cloned array.
             */
            cloneArray: function cloneArray(arr) {
                var arr2 = [],
                    len = (arr && arr.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    arr2[i] = this.clone(arr[i]);
                }

                return arr2;
            },

            /**
             * Generates an array of the keys in a given hash.
             *
             * @param {Object} h The hash whose keys are to be inspected.
             * @param {boolean} [nums=false] If true, the values are treated as numbers for comparison.
             *
             * @returns {number[]|string[]} The array of hash keys.
             */
            keyarray: function kyarr(h, nums) {

                var arr = [],
                    k;
                if (h) {
                    if (Object.keys && !nums) {
                        arr = Object.keys(h);
                    } else {
                        for (k in h) {
                            arr.push(nums ? Number(k) : k);
                        }
                    }
                }
                return arr;
            },

            /**
             * Generates an array of the values in a given hash.
             * @param {Object} h The hash whose values are to be inspected.
             * @returns {Array} The array of hash values.
             */
            valarray: function varr(h) {
                var arr = [];
                if (h) {
                    var k;
                    for (k in h) {
                        arr.push(h[k]);
                    }
                }
                return arr;
            },
            /**
             * Returns whether the two hashes are the same.
             */
            equals: function eq(h1, h2) {
                // check null, equals when either both not null or both null
                var $HASH = mstrmojo.hash,
                    rtn = (h1 && h2) || (!h1 && !h2 && (h1 === h2));

                // for not null
                if (rtn && h1) {
                    // check constructor
                    rtn = (h1.constructor === h2.constructor);
                    if (rtn) {
                        // array type
                        if (h1.constructor === Array) {
                            var len = h1.length;
                            // check length
                            rtn = (len === h2.length);
                            // for same length and has items
                            if (rtn && len) {
                                // check each individual item
                                var i;
                                for (i = 0; i < len; i++) {
                                    rtn = rtn && $HASH.equals(h1[i], h2[i]);
                                }
                            }

                        // object type
                        } else if (typeof h1 === 'object') {
                            // check keys
                            var h1k = $HASH.keyarray(h1),
                                h2k = $HASH.keyarray(h2);

                            rtn = h1k.length === h2k.length;

                            if (rtn) {
                                var p;
                                for (p in h1) {
                                    rtn = rtn && ($HASH.equals(h1[p], h2[p]));
                                }
                            }

                        // primitive type
                        } else {
                            rtn = (h1 === h2);
                        }
                    }
                }

                return rtn;
            },
            /**
             * Traverse a json object and transform any of its Object property into an array
             * if it has a boolean property called "isArray" with value = true. It also assumes that this
             * Object property has another property called "length" indicating the length of the array.
             *
             * @param {{isArray:boolean}} o The hash to be transformed.
             *
             * @return {Array|Object} The object after being transformed.
             */
            obj2array: function obj2array(o) {
                var n;
                for (n in o) {
                    var p = o[n];
                    if (p && typeof p === 'object') {
                        o[n] = this.obj2array(p);
                    }
                }

                var isArray = o.isArray;
                if (isArray !== undefined && isArray === true) {
                    var r = [],
                        len = o.length,
                        i;

                    for (i = 0; i < len; i++) {
                        r.push(o[i]);
                    }

                    return r;
                }

                return o;
            },

            /**
             * Returns the smallest value in a given hash.
             *
             * @param {Object} h The hash to be inspected.
             * @param {boolean} [vals=false] If true, the hash values are inspected; otherwise, the hash keys are.
             * @param {boolean} [nums=false] If true, hash entries are treated as numbers for comparison.
             *
             * @returns {*}
             */
            min: function min(h, vals, nums) {
                var m = null,
                    k;

                if (h) {
                    for (k in h) {
                        var v = vals ? h[k] : k;
                        if (nums) {
                            v = Number(v);
                        }
                        if ((m === null) || (v < m)) {
                            m = v;
                        }
                    }
                }
                return m;
            },

            /**
             * Returns the largest value in a given hash.
             *
             * @param {Object} h The hash to be inspected.
             * @param {boolean} [vals=false] If true, the hash values are inspected; otherwise, the hash keys are.
             * @param {boolean} [nums=false] If true, hash entries are treated as numbers for comparison.
             *
             * @returns {*}
             */
            max: function max(h, vals, nums) {
                var m = null,
                    k;

                if (h) {
                    for (k in h) {
                        var v = vals ? h[k] : k;
                        if (nums) {
                            v = Number(v);
                        }
                        if ((m === null) || (v > m)) {
                            m = v;
                        }
                    }
                }
                return m;
            },

            /**
             * <p>Converts a given hash into an instance of a given javascript class.</p>
             *
             * <p>This method is typically used to make a native javascript Object into an observable object.
             * Unlike using a class constructor, this call enhances the given object rather than creating a new object.</p>
             *
             * @param {mstrmojo.Obj|{attachEventListener: function, init: function}} h The object (hash) to be converted.
             * @param {mstrmojo.Obj|{makeObservable: function, init: function}} c The instantiated class to which the given object will be converted.
             * @param {Object=} props Hash of properties to apply to the resulting class instance. Only used if the instance has an "init" method,
             *                     in which case the hash is passed in as a single argument to that method.
             *
             * @returns {Object} The same object passed in.
             * @static
             */
            make: function make(h, c, props) {
                if (!h || !c) {
                    return null;
                }

                if (h.attachEventListener) {
                    // Object is already observable. Don't try to re-register it.
                    return h;
                }

                if (c.makeObservable) {
                    h = c.makeObservable(h, props) || h;
                } else {
                    this.copy(c.prototype, h);
                    if (h.init) {
                        h = h.init(props) || h;
                    }
                }
                return h;
            },

            /**
             * Merges the hashes of the data and delta object which includes copying over primitive data properties,
             * concatenating arrays and recursively merging objects.
             *
             * @param {Object} data
             * @param {Object} delta
             *
             * @returns {Object} The merged hash.
             */
            mergeHashes: function mergeHashes(data, delta) {
                // Clone the data object so as to not change the original data.
                data = this.clone(data) || {};

                // Do we have a delta ? (If not there's no merge necessary.)
                if (delta) {
                    // Loop through all the object keys without duplicates
                    mstrmojo.array.forEach(mstrmojo.array.distinct(this.keyarray(delta).concat(this.keyarray(data))), function (k) {
                        // Do we have a key for it in the data ?
                        var dataValue = data[k],
                            deltaValue = delta[k];

                        // Does the key not exist on the data object ?
                        if (!dataValue) {
                            // Add the delta value to the data object.
                            data[k] = deltaValue;

                        } else if (dataValue && deltaValue) {
                            // If we're dealing with objects - we may need to merge them recursively.
                            if (typeof dataValue === 'object') {
                                // Is this an array ?
                                if (dataValue.constructor === Array) {
                                    // Concatenate the two arrays.
                                    data[k] = dataValue.concat(deltaValue);
                                } else {
                                    // Recursively call merge hashes to merge them recursively.
                                    data[k] = this.mergeHashes(dataValue, deltaValue);
                                }
                            } else {
                                // For primitive data types - save it on the data.
                                data[k] = deltaValue;
                            }
                        }
                    }, this);
                }

                return data;
            }
        }
    );
}());
(function () {

    /**
     * Represents a metric value.
     *
     * @class
     */
    mstrmojo.models.template.MetricValue = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.models.template.MetricValue.prototype
         */
        {
            init: function init(props) {
                this.data = props.data;
                this.value = props.value;
            },

            getValue: function getValue() {
                return this.value.v;
            },
            getThresholdType: function getThresholdType() {
                return this.value.ty;
            },
            getRawValue: function getRawValue() {
                return this.value.rv;
            },
            getCSS: function getCSS() {
                return this.data.css[this.value.cni].n;
            },
            getThresholdValue: function getThresholdValue(defaultValue) {
                if (this.value.ti === undefined) {
                    return defaultValue;
                }
                return this.data.th[this.value.ti].n;
            },
            getFillColor: function getFillColor(defaultValue) {
                if (this.value.ci === undefined) {
                    return defaultValue;
                }
                return this.data.fc[this.value.ci].n;
            }
        }
    );
}());
/**
 * File: EnumVisualizationTemplates.js
 * User: dhill
 * Date: 12/11/13 4:40 PM
 * Copyright (c) 2013 MicroStrategy Incorporated. All rights reserved.
 */

mstrmojo.vi.viz.EnumVisualizationTemplates = {
    UNKNOWN_GRAPHMATRIX_TYPE: -1,
    GRID: 0,
    HEATMAP: 1,
    GOOGLEMAP: 2,
    PIE: 3,
    RING: 4,
    GRAPHMATRIXVERTICALBARSTACKED: 6,
    GRAPHMATRIXVERTICALBARCLUSTERED: 7,
    GRAPHMATRIXVERTICALBARPERCENT: 8,
    GRAPHMATRIXHORIZONTALBARSTACKED: 9,
    GRAPHMATRIXHORIZONTALBARCLUSTERED: 10,
    GRAPHMATRIXHORIZONTALBARPERCENT: 11,
    GRAPHMATRIXVERTICALLINESTACKED: 12,
    GRAPHMATRIXVERTICALLINECLUSTERED: 13,
    GRAPHMATRIXVERTICALLINEPERCENT: 14,
    GRAPHMATRIXHORIZONTALLINESTACKED: 15,
    GRAPHMATRIXHORIZONTALLINECLUSTERED: 16,
    GRAPHMATRIXHORIZONTALLINEPERCENT: 17,
    GRAPHMATRIXSCATTERCIRCLEMM: 18,
    GRAPHMATRIXSCATTERGRIDCIRCLEAA: 19,
    GRAPHMATRIXBUBBLECIRCLEMM: 21,
    GRAPHMATRIXBUBBLEGRIDCIRCLEAA: 22,
    GRAPHMATRIXSCATTERSQUAREAM: 23,
    GRAPHMATRIXSCATTERSQUAREMM: 24,
    GRAPHMATRIXSCATTERGRIDSQUAREAA: 25,
    GRAPHMATRIXBUBBLESQUAREAM: 26,
    GRAPHMATRIXBUBBLESQUAREMM: 27,
    GRAPHMATRIXBUBBLEGRIDSQUAREAA: 28,
    GRAPHHORIZONTALBARCLUSTERED: 29,
    GRAPHMATRIXVERTICALAREASTACKED: 30,
    GRAPHMATRIXVERTICALAREAPERCENT: 31,
    GRAPHMATRIXVERTICALAREACLUSTERED: 32,
    GRAPHMATRIXHORIZONTALAREASTACKED: 40,
    GRAPHMATRIXHORIZONTALAREAPERCENT: 41,
    GRAPHMATRIXHORIZONTALAREACLUSTERED: 42,
    GRAPHHORIZONTALBARDUALAXISCLUSTERED: 33,
    GRAPHHORIZONTALBARDUALAXISABSOLUTE: 34,
    GRAPHHORIZONTALLINEABSOLUTE: 35,
    GRAPHHORIZONTALLINEDUALAXISABSOLUTE: 36,
    GRAPHHORIZONTALAREAABSOLUTE: 37,
    GRAPHHORIZONTALAREADUALAXISABSOLUTE: 38,
    GRAPHVERTICALBARCLUSTERED: 39,
    GRAPHVERTICALBARDUALAXISCLUSTERED: 43,
    GRAPHVERTICALBARDUALAXISABSOLUTE: 44,
    GRAPHVERTICALBARDUALAXISSTACKED: 45,
    GRAPHVERTICALLINEABSOLUTE: 46,
    GRAPHVERTICALLINESTACKED: 47,
    GRAPHVERTICALLINEPERCENT: 48,
    GRAPHVERTICALLINEDUALAXISABSOLUTE: 49,
    GRAPHVERTICALLINEDUALAXISSTACKED: 50,
    GRAPHVERTICALAREAABSOLUTE: 51,
    GRAPHVERTICALAREAPERCENT: 52,
    GRAPHVERTICALAREASTACKED: 53,
    GRAPHVERTICALAREADUALAXISABSOLUTE: 54,
    GRAPHVERTICALAREADUALAXISSTACKED: 55,
    GRAPHCOMBINATIONBARAREA: 56,
    GRAPHCOMBINATIONBARAREADUALAXIS: 57,
    NETWORK: 58,
    IMAGELAYOUT: 59,
    GOOGLEMAPDENSITY: 60,
    GRAPHMATRIXPIE: 61,
    GRAPHMATRIXRING: 62,
    GRAPHHORIZONTALBARABSOLUTE: 63,
    GRAPHHORIZONTALBARPERCENT: 64,
    GRAPHHORIZONTALBARSTACKED: 65,
    GRAPHVERTICALBARABSOLUTE: 66,
    GRAPHVERTICALBARPERCENT: 67,
    GRAPHVERTICALBARSTACKED: 68,
    ESRIMAP: 69,
    GRAPHMATRIXVERTICALBARAUTOMATIC: 70,
    GRAPHMATRIXHORIZONTALBARAUTOMATIC: 71,
    GRAPHMATRIXVERTICALLINEAUTOMATIC: 72,
    GRAPHMATRIXHORIZONTALLINEAUTOMATIC:73,
    GRAPHMATRIXVERTICALAREAAUTOMATIC: 74,
    GRAPHMATRIXHORIZONTALAREAAUTOMATIC: 75

};
mstrmojo.LoadedExternalJSURLs = {};

function LoadScriptsExternalJSCallback() {

    //since we processed this url, remove it from the array
    mstrmojo.LoadedExternalJSURLs[mstrmojo._LoadsScript.esScripts.splice(0, 1)[0].url] = true;
    //now load the remaining urls
    mstrmojo._LoadsScript.requiresExternalScripts(
        mstrmojo._LoadsScript.esScripts,
        mstrmojo._LoadsScript.callback,
        mstrmojo._LoadsScript.esScritsContext
    );

    mstrmojo._LoadsScript.ExternalJSCallbackIsBusy = false;
}

/**
 * <p>Enables an object to load javascript methods at run-time.</p>
 *
 * @mixin
 * @public
 */
mstrmojo._LoadsScript = mstrmojo.provide(
    "mstrmojo._LoadsScript",

    /**
     * @lends mstrmojo._LoadsScript.prototype
     */
    {
        /**
         * @ignore
         */
        _meta_usesSuper: false,

        /**
         * <p>Ensures that the script for a given method is loaded into this object.</p>
         *
         * <p>If this object's property with the given method name points to a function, we assume
         * that function is the desired method.  Otherwise, we assume we must load a mixin that
         * implements the method.  The FQCN from the mixin is a string that is assumed to be declared
         * either:
         * <ul>
         * <li>under the method name; or</li>
         * <li>under the "this.methods" hash, keyed by the method name; or</li>
         * <li>under the "this.methods" hash, keyed by "*" (meaning, a default mixin for all methods).</li>
         * </ul>
         * </p>
         *
         * @param {string} n The name of the method to be loaded.
         * @returns {boolean} true if the method is now successfully loaded in this object.
         */
        requiresMethod: function requiresMethod(n) {
            if (!n) {
                return false;
            }

            // Do we have a function for this method?
            if (typeof this[n] === "function") {
                return true;
            }
            // Try to load the method. We need the FQCN of the mixin that impls the method.
            var fqcn = this[n] || (this.methods && (this.methods[n] || this.methods["*"]));
            if (typeof fqcn === "string") {
                this.requiresCls(fqcn);
                return typeof this[n]  === "function";
            }

            return false;
        },

        /**
         * Loads the requested mixins (if not already loaded), mixes them into the
         * prototype of this widget's constructor, and then fires given callback.
         *
         * @param {Array|String} mixins
         * @param {Function=} callback
         */
        requiresCls: function req(mixins, callback) {
            // TO DO: implement this using async XHR.
            if (mixins) {
                if (typeof mixins === "string") {
                    mixins = [mixins];
                }
                // XHR get any of the mixins that are not loaded in-memory yet.
                mstrmojo.requiresCls.apply(mstrmojo, mixins);
                // Mix these into the constructor's prototype. Record the mixins
                // we do in a class-level hash, so we don't redo them again later.
                var p = this.constructor.prototype,
                    pm = p.mixins;
                if (!pm) {
                    p.mixins = {};
                    pm = p.mixins;
                }
                var mx = mstrmojo.mixin,
                    i,
                    len;

                for (i = 0, len = mixins.length; i < len; i++) {
                    var fqcn = mixins[i];
                    if (!pm[fqcn]) {
                        var m = eval(mixins[i]);
                        mx(m, p);
                        pm[fqcn] = true;
                        // After each mixin, call the mixin's __onmixin__ method (if any) on ourselves.
                        if (m.__onmixin__) {
                            m.__onmixin__.apply(this, []);
                        }
                    }
                }
                if (callback) {
                    callback.apply(this, []);
                }
            }
        },

        /**
         * Loads the contributor object identified in the given property. If loaded successfully,
         * stores a reference to it in the given property and sets its parent to this widget; otherwise,
         * if not loaded successfully, replaces the property value with null.
         *
         * @param {string} propName
         * @param {boolean} [bForceStartup=false]
         */
        requiresContrib: function reqCb(propName, bForceStartup) {
            var fqcn = this[propName];
            if (fqcn) {
                var c,
                    firstTime = false;
                if (typeof fqcn === 'string') {
                    c = mstrmojo.registry.ref(fqcn);
                    this[propName] = c;
                    firstTime = true;
                } else {
                    c = fqcn;    // Assume its the contributor object itself.
                }
                // Set the parent and call startup. We do this the first time we initialize
                // the contributor, and additionally if a flag tells us to do it subsequent times.
                if (c && (firstTime || bForceStartup)) {
                    c.parent = this;
                    if (c.startup) {
                        c.startup();
                    }
                }
                return c;
            }
            return null;
        },

        /**
         *
         * Load the external java scripts synchronously
         *
         */
        requiresExternalScripts: function requiresExternalScripts(esScripts, callback, context) {

            if (esScripts && esScripts instanceof Array) {
                if (esScripts.length === 0) { //this could be case when user provided only one url and has a call back
                    if (callback) {
                        callback.call(context);
                    }

                    return false;
                }

                //check if the next script to be loaded is in the loaded cache, then skip this one
                if (esScripts[0] && esScripts[0].forceReload === false && mstrmojo.LoadedExternalJSURLs[esScripts[0].url]) {

                    esScripts.splice(0, 1); //remove this from the array and start loading the remaining urls

                    return this.requiresExternalScripts(esScripts, callback, context);
                }

                var script = document.createElement("script"), isIE = !!document.all,
                    url = esScripts[0].url;

                // TQMS#1007849 prefix URL with 'HTTP:' for OneTier app. otherwise it will default the protocol to 'file://'
                if (mstrApp.isSingleTier && url.substr(0,4) !== "http" ) {
                    url = "http:" + url;
                }
                script.type = "text/javascript";
                script.src = url;

                if (!esScripts[0].callbackParamName) {
                    if (isIE) {
                        //IE: handle <script> Tag state change event:
                        script.onreadystatechange = function () {
                            //when IE finishes loading/parsing current <script>, continue next

                            if (script.readyState === "loaded" || script.readyState === "complete") {
                                script.onreadystatechange = null; //avoid handling twice
                                //load the next script if any here
                                if (esScripts.length > 1) {
                                    //remove the first element which is processed

                                    mstrmojo.LoadedExternalJSURLs[esScripts.splice(0, 1)[0].url] = true;
                                    mstrmojo._LoadsScript.requiresExternalScripts(esScripts, callback);

                                } else if (esScripts.length === 1) {
                                    mstrmojo.LoadedExternalJSURLs[esScripts[0].url] = true;
                                    //call the callback function if any
                                    if (callback) {
                                        callback.call(context);
                                    }
                                }
                            }
                        };
                    } else { // for FireFox, safari etc
                        script.onload = function () {

                            script.onload = null; //avoid handling twice
                            //load the next script if any here
                            if (esScripts.length > 1) {
                                //remove the first element which is processed

                                mstrmojo.LoadedExternalJSURLs[esScripts.splice(0, 1)[0].url] = true;
                                mstrmojo._LoadsScript.requiresExternalScripts(esScripts, callback);
                            } else if (esScripts.length === 1) {
                                mstrmojo.LoadedExternalJSURLs[esScripts[0].url] = true;
                                //call the callback function if any
                                if (callback) {
                                    callback.call(context);
                                }

                            }
                        };
                    }
                } else {
                    if (esScripts[0].callbackParamName.length !== 0) { //if we have a callback request parameter name then use it
                        //check if already someone else is using the global callback method. If yes, then we have to wait for sometime and check back
                        if (mstrmojo._LoadsScript.ExternalJSCallbackIsBusy && mstrmojo._LoadsScript.ExternalJSCallbackIsBusy === true) {
                            var that = this;
                            window.setTimeout(function () {
                                that.requiresExternalScripts(esScripts, callback, context);
                            }, 500);
                            return;
                        }
                        //indicate the global flag that the callback function is busy
                        mstrmojo._LoadsScript.ExternalJSCallbackIsBusy = true;

                        //remove the first element which is processed
                        script.src += "&" + esScripts[0].callbackParamName + "=LoadScriptsExternalJSCallback";

                        mstrmojo._LoadsScript.esScripts = esScripts;
                        mstrmojo._LoadsScript.callback = callback;
                        mstrmojo._LoadsScript.esScritsContext = context;

                    }
                }

                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }

    }
);
(function () {

    /**
     * The name to use for the popop host slot in the opener.
     *
     * @type {string}
     * @const
     */
    var HOST_SLOT_NAME = 'xviPopopNode';

    /**
     * Creates the object used to add and remove slots in the opener.
     *
     * @param {?Node=} hostElement An optional element to act as the popop slot.
     *
     * @returns {Object.<string, ?Node>}
     * @memberOf mstrmojo.ui.menus._IsMenuPopup
     * @private
     */
    function getHostSlot(hostElement) {
        var slot = {};
        slot[HOST_SLOT_NAME] = hostElement;
        return slot;
    }

    /**
     * Mixin to make any Widget a popup that can be opened or closed.
     *
     * NOTE: Requires mstrmojo._IsPopup to be mixed into the widget as well.
     *
     * @mixin
     * @public
     */
    mstrmojo.ui.menus._IsMenuPopup = mstrmojo.provide(

        "mstrmojo.ui.menus._IsMenuPopup",

        /**
         * @lends mstrmojo.ui.menus._IsMenuPopup
         */
        {
            init: function init(props) {
                this._super(props);

                // Do we NOT have a popup configuration?
                var popupCfg = this.popupConfig;
                if (!popupCfg) {
                    throw new Error("Cannot instantiate popup without supplying the popupConfig property.");
                }

                // Mark popup configuration as disposable.
                this.addDisposable(popupCfg);

                var host = mstrmojo.all[popupCfg.hostId],
                    hostElement = popupCfg.hostElement;

                // Is the menu set up to be hosted within the host element? And does the config have host and hostElement?
                if (popupCfg.isHostedWithin && host && hostElement) {
                    // Add a slot for the host element to the host.
                    host.addSlots(getHostSlot(hostElement));

                    // Add the slot name to the popup.
                    this.slot = HOST_SLOT_NAME;
                }
            },

            /**
             * Closes all open menus.
             */
            closeAllMenus: function closeAllMenus() {
                var opener = this.opener;

                // Ask opener to close this popup.
                if (opener && opener.closePopup) {
                    opener.closePopup();
                }

                // Does the opener have a closeAllMenus method?
                if (opener && opener.closeAllMenus) {
                    // Call it.
                    opener.closeAllMenus();
                }
            },

            open: function open(opener, config) {
                // Call super .
                if (this._super) {
                    this._super(opener, config);
                }
            },

            close: function close(config) {
                // Did this popup add a dynamic slot to the host?
                if (this.slot === HOST_SLOT_NAME) {
                    // Remove the host slot from the opener.
                    this.opener.removeSlots(getHostSlot(null));
                }

                // Call super .
                if (this._super) {
                    this._super(config);
                }

                // Destroy the popup.
                this.destroy();

                // Ask the host to close the popup.
                var host = mstrmojo.all[this.popupConfig.hostId];
                if (host) {
                    host.closePopup();
                }
            }
        }
    );

}());
(function () {

    /**
     * Utility method that returns a native DOM event object.  Used to get a handle
     * to the event while encapsulating cross-browser differences.
     *
     * @param {Window} hWin
     * @param {Event=} e
     *
     * @returns {Event}
     */
    function getEvent(hWin, e) {
        return e || (hWin || window).event;
    }

    /**
     * A type to describe the position of an HTMLElement.
     *
     * @typedef {{
     *     x: int,
     *     y: int,
     *     w: int,
     *     h: int
     * }}
     *
     * @property {int} x The position of the element along the x-axis.
     * @property {int} y The position of the element along the y-axis.
     * @property {int} w The width of the element.
     * @property {int} h The height of the element.
     */
    mstrmojo.PositionType = null;

    var isIE = !!document.all,
        docMode = document.documentMode, //available in IE browsers
        ua = navigator.userAgent,
        isIE6 = false,
        isIE7 = false,
        isIE8 = false,
        isIE9 = false,
        isIE10 = false,
        isDXIE = false;

    if (isIE) {
        if (window.mstrConfig && mstrConfig.isEdgeModeEnabled) {
            isIE6 = !!ua.match(/MSIE 6/);
            isIE7 = ((!!ua.match(/MSIE 7/) && !docMode) || docMode === 7);  //IE7 or IE in IE7 Standards Mode
            isIE8 = (docMode === 8);    //IE in IE8 Standards Mode
            isIE9 = (docMode === 9);    //IE in IE9 Standards Mode
            isIE10 = (docMode === 10);  //IE in IE10 Standards Mode
            isDXIE = (!docMode || docMode <= 9); //IE9- supports DX filters
        } else {
            isIE6 = !!ua.match(/MSIE 6/);
            isIE7 = !!ua.match(/MSIE 7/);
            isIE8 = !!ua.match(/MSIE 8/);
            isIE9 = !!ua.match(/MSIE 9/);
            isIE10 = !!ua.match(/MSIE 10/);
            isDXIE = !isIE10;
        }
    }

    var isFF = !isIE && !!ua.match(/Firefox/),
        bv = 0,
        isAndroid = !!ua.match(/Android/),
        isIPad = !!ua.match(/iPad/),
        tch = !!document.createTouch || isAndroid,
        isPlayBook = !!ua.match(/PlayBook/),
        isWinPhone = !!ua.match(/Windows Phone/),
        isIEW3C = !isIE && !!ua.match(/Trident.*rv/),
        CSS3_PREFIX = isFF ? '-moz-' : (isIE || isIEW3C) ? '' : '-webkit-',
        CSS3_TRANSFORM_PREFIX = isFF ? 'Moz' : (isIE10 || isIEW3C) ? '' : isIE ? 'ms' : 'webkit',
        CSS3_T_INITIAL = ((isIE10 || isIEW3C) ? 't' : 'T'),
        CSS3_TRANSITION = CSS3_TRANSFORM_PREFIX + CSS3_T_INITIAL + 'ransition'; // IE9: N/A, IE10: transition, Chrome: webkitTransition, Moz: transition or MozTransransition

    function buildCSS3Transform() {

        /*
         IE9: msTransform
         IE10: transform
         Chrome: webkitTransform
         Moz: transform or MozTransform
         */
        return CSS3_TRANSFORM_PREFIX + CSS3_T_INITIAL + 'ransform';
    }

    function buildCSS3TransitionProperty() {

        /*
         IE9: N/A
         IE10: transitionProperty
         Chrome: webkitTransitionProperty
         Moz: transitionProperty or MozTransransitionProperty
         */

        return CSS3_TRANSITION + 'Property';
    }

    function buildCSS3TransitionDuration() {

        /*
         IE9: N/A
         IE10: transitionDuration
         Chrome: webkitTransitionDuration
         Moz: transitionDuration/MozTransitionDuration
         */

        return CSS3_TRANSITION + 'Duration';
    }

    function buildCSS3TransitionEnd() {

        /*
         IE9: N/A
         IE10: transitionend
         Chrome: webkitTransitionEnd
         Moz: transitionend
         */

        return (isIE10 || isFF) ? 'transitionend' : 'webkitTransitionEnd';
    }

    function buildCSS3BoxShadow() {

        /*
         IE9: N/A
         IE10: BoxShadow
         Chrome: webkitBoxShadow
         Moz: MozBoxShadow
         */

        return CSS3_TRANSFORM_PREFIX + 'BoxShadow';
    }

    var CSS3_TRANSFORM = buildCSS3Transform(),
        CSS3_TRANSITION_PROPERTY = buildCSS3TransitionProperty(),
        CSS3_TRANSITION_DURATION = buildCSS3TransitionDuration(),
        CSS3_TRANSITION_END = buildCSS3TransitionEnd(),
        CSS3_BOXSHADOW = buildCSS3BoxShadow();

    /**
     * Private function for extracting the Firefox browser version number.
     *
     * @private
     * @ignore
     */
    function getBrowserVersion() {
        // Have we cached the browser version already?
        if (!bv && isFF) {
            // If not, we only need this for Firefox.
            // Retrieve the Firefox version number from the user agent.
            var nav = ua.match(/.*Firefox\/([\d|\.]*).*/);
            // Did we find it?
            if (nav) {
                // Store this in the browser version and return it.
                bv = parseFloat(nav[1]);
            }
        }

        return bv;
    }

    function docScroll() {
        var x = 0,
            y = 0,
            w = window,
            d = document,
            b = d.body,
            de = d.documentElement;
        if (typeof w.pageYOffset === 'number') {
            y = w.pageYOffset;
            x = w.pageXOffset;
        } else if (b && (b.scrollLeft || b.scrollTop)) {
            y = b.scrollTop;
            x = b.scrollLeft;
        } else if (de && (de.scrollLeft || de.scrollTop)) {
            y = de.scrollTop;
            x = de.scrollLeft;
        }
        return {
            x: x,
            y: y
        };
    }

    function setTranslateValue(num) {

        //Validate for null or undefined
        num = num || 0;

        //Convert to string
        num = String(num);

        return ((num.indexOf("%", 0)) !== -1) ? num : (num + 'px');
    }

    function createTransformationString(x, y, z, use3d, translateString) {

        if (!mstrmojo.dom.isWinPhone) {
            use3d = (use3d || false || this.isHWAccelerated);
        } else {
            use3d = false;
        }

        var translateOpen = translateString + (use3d ? '3d' : '') + '(',
            translateClose = use3d ? (',' + z + ')') : ')';

        return translateOpen + x + ',' + y + translateClose;
    }

    var BOTTOM = 2,
    //        TOP = 1,
    //        LEFT = 4,
    //        RIGHT = 5,
        CENTER = 3;

    /**
     * Align DOM node to the indicated position within the window.
     *
     * @param {HTMLElement} e The dom node that needs alignment
     * @param {int} h Horizontal alignment flag, can be LEFT, CENTER, or RIGHT
     * @param {int} v Vertical alignment flag, can be TOP, CENTER, or BOTTOM
     */
    function alignDOM(e, h, v) {
        var elementStyle = e.style,
            elementDisplay = elementStyle.display,
            windowDimensions = this.windowDim(),
            ds = docScroll();

        //display before reading clientWidth/height
        elementStyle.display = 'block';

        var hpos = windowDimensions.w - e.clientWidth,
            vpos = windowDimensions.h - e.clientHeight,
            hm = {
                4: 0, /* left */
                5: hpos, /* right */
                3: hpos / 2     /* center */
            },
            vm = {
                1: 0, /* top */
                3: vpos / 2, /* center */
                2: vpos         /* bottom */
            };

        elementStyle.left = hm[h] + ds.x + 'px';
        elementStyle.top = vm[v] + ds.y + 'px';
        elementStyle.display = elementDisplay;
    }

    /**
     * It's an override of mstrmojo.dom.attachEvent, since in IE8- attachEvent will duplicate register the same handlers
     *
     * @param {HTMLElement} el The HTMLElement to attach an event listener to.
     * @param {string} eventName The name of event to listen for.
     * @param {Function} f The function to execute when the event occurs.
     * @param {boolean=} phase The event phase to capture (false for bubbles, true for capture).
     */
    function attachUniqueEvent(el, eventName, f, phase) {
        if (el.addEventListener) {
            return el.addEventListener(eventName, f, !!phase);
        }

        // assign each event handler a unique ID
        f._id = f._id || attachUniqueEvent.guid++;

        // create a hash table of event types for the element
        el.events = el.events || {};

        // create a hash table of event handlers for each element/event pair
        var handlers = el.events[eventName];
        if (!handlers) {
            handlers = el.events[eventName] = {};
            // store the existing event handler (if there is one)
            if (el["on" + eventName]) {
                handlers[0] = el["on" + eventName];
            }
        }

        // store the event handler in the hash table
        handlers[f._id] = f;

        function handleUniqueEvent(event) {
            // grab the event object (IE uses a global event object)
            event = event || window.event;
            // get a reference to the hash table of event handlers
            var handles = this.events[event.type],
                i;

            // execute each event handler
            for (i in handles) {
                handles[i].call(this, event);
            }
        }

        // assign a global event handler to do all the work
        el["on" + eventName] = handleUniqueEvent;
    }

    // a counter used to create unique IDs
    attachUniqueEvent.guid = 1;

    /**
     * It's an override of mstrmojo.dom.detachEvent
     *
     * @param {HTMLElement} el The HTMLElement to attach an event listener to.
     * @param {string} eventName The name of event to listen for.
     * @param {Function} f The function to execute when the event occurs.
     * @param {boolean=} phase The event phase to capture (false for bubbles, true for capture).
     */
    function detachUniqueEvent(el, eventName, f, phase) {
        if (!el) {
            return;
        }
        if (el.removeEventListener) {
            el.removeEventListener(eventName, f, !!phase);
        } else {
            // delete the event handler from the hash table
            if (el.events && el.events[eventName]) {
                delete el.events[eventName][f._id];
            }
        }
    }

    mstrmojo.Enum_Keys = {
        // summary:
        //      Definitions for common key values
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        CTRL: 17,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        INSERT: 45,
        DELETE: 46
    };

    /**
     * Utility class for common DOM operations.
     *
     * @type {Object}
     * @static
     */
    mstrmojo.dom = mstrmojo.provide(
        "mstrmojo.dom",

        /**
         * @lends mstrmojo.dom
         */
        {
            userAgent: ua,

            isIE: isIE,
            isIE6: isIE6,
            isIE7: isIE7,
            isIE8: isIE8,
            isIE9: isIE9,
            isIE10: isIE10,
            isIEW3C: isIEW3C,
            isNSIE: isDXIE, //Non Standards IE
            isDXIE: isDXIE,

            isFF: isFF,

            isWK: !!ua.match(/AppleWebKit/),

            isSafari: !!ua.match(/Safari/) && !ua.match(/Chrome/),

            isChrome : !!ua.match(/AppleWebKit/) && ua.match(/Chrome/),

            isHWAccelerated: !isAndroid,

            isAndroid: isAndroid,

            isIPad: isIPad,

            isPlayBook: isPlayBook,

            isWinPhone: isWinPhone,

            supportsTouches: tch,

            TOUCHSTART: tch ? 'touchstart' : 'mousedown',
            TOUCHMOVE: tch ? 'touchmove' : 'mousemove',
            TOUCHEND: tch ? 'touchend' : 'mouseup',
            TOUCHCANCEL: tch ? 'touchcancel' : '',
            RESIZE: tch ? 'orientationchange' : 'resize',

            CSS3_PREFIX: CSS3_PREFIX,
            CSS3_BOXSHADOW: CSS3_BOXSHADOW,
            CSS3_TRANSFORM: CSS3_TRANSFORM,
            CSS3_TRANSITION: CSS3_TRANSITION,
            CSS3_TRANSITION_PROPERTY: CSS3_TRANSITION_PROPERTY,
            CSS3_TRANSITION_DURATION: CSS3_TRANSITION_DURATION,
            CSS3_TRANSITION_END: CSS3_TRANSITION_END,

            cssFeatures: {
                GRADIENTS: 'gd',
                ROUND_CORNERS: 'rc',
                TEXT_ROTATION: 'tr',
                DROP_SHADOW: 'sh'
            },
            htmlFeatures: {
                FILE_READER: 'fr'
            },

            /**
             * button associated with mouse event
             */
            MOUSE_BUTTON: {
                LEFT: 1,
                RIGHT: 2
            },

            /**
             * Determines if the users browser supports a particular feature.
             *
             * @param {string} featureName The feature to check using the constants defined on this object.
             *
             * @returns {boolean}
             */
            supports: function supports(featureName) {
                var ffVer = this.isFF && getBrowserVersion();
                switch (featureName) {
                case this.cssFeatures.GRADIENTS:
                    return (this.isIE || this.isIEW3C || this.isWK || ffVer >= 3.6 || this.isWinPhone);

                case this.cssFeatures.ROUND_CORNERS:
                    return (this.isWK || this.isFF || this.isWinPhone || this.isIE10);

                case this.cssFeatures.TEXT_ROTATION:
                    // fall-through
                case this.cssFeatures.DROP_SHADOW:
                    return (this.isIE || this.isWK || ffVer >= 3.5 || this.isWinPhone || this.isIE10 || this.isIEW3C);
                case this.htmlFeatures.FILE_READER:
                    return !!(window.FileReader);
                }

                return false;
            },

            /**
             * <p>Returns information on the OS (and it's version) on which the browser is running.</p>
             *
             * @returns {{name: string, version: string}}
             */
            getOSInfo: function getOSInfo() {
                var unknown = 'Unknown',
                    appVersion = navigator.appVersion,
                    userAgent = navigator.userAgent,
                    os = unknown;

                // A map of all the browser strings that we care about.
                var clientStrings = [{
                    s: 'Windows 3.11',
                    r: /Win16/
                }, {
                    s: 'Windows 95',
                    r: /(Windows 95|Win95|Windows_95)/
                }, {
                    s: 'Windows ME',
                    r: /(Win 9x 4.90|Windows ME)/
                }, {
                    s: 'Windows 98',
                    r: /(Windows 98|Win98)/
                }, {
                    s: 'Windows CE',
                    r: /Windows CE/
                }, {
                    s: 'Windows 2000',
                    r: /(Windows NT 5.0|Windows 2000)/
                }, {
                    s: 'Windows XP',
                    r: /(Windows NT 5.1|Windows XP)/
                }, {
                    s: 'Windows Server 2003',
                    r: /Windows NT 5.2/
                }, {
                    s: 'Windows Vista',
                    r: /Windows NT 6.0/
                }, {
                    s: 'Windows 7',
                    r: /(Windows 7|Windows NT 6.1)/
                }, {
                    s: 'Windows 8.1',
                    r: /(Windows 8.1|Windows NT 6.3)/
                }, {
                    s: 'Windows 8',
                    r: /(Windows 8|Windows NT 6.2)/
                }, {
                    s: 'Windows NT 4.0',
                    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                }, {
                    s: 'Windows ME',
                    r: /Windows ME/
                }, {
                    s: 'Android',
                    r: /Android/
                }, {
                    s: 'Open BSD',
                    r: /OpenBSD/
                }, {
                    s: 'Sun OS',
                    r: /SunOS/
                }, {
                    s: 'Linux',
                    r: /(Linux|X11)/
                }, {
                    s: 'iOS',
                    r: /(iPhone|iPad|iPod)/
                }, {
                    s: 'Mac OS X',
                    r: /Mac OS X/
                }, {
                    s: 'Mac OS',
                    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                }, {
                    s: 'QNX',
                    r: /QNX/
                }, {
                    s: 'UNIX',
                    r: /UNIX/
                }, {
                    s: 'BeOS',
                    r: /BeOS/
                }, {
                    s: 'OS/2',
                    r: /OS\/2/
                }, {
                    s: 'Search Bot',
                    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                }];

                var i;
                for (i = 0; i < clientStrings.length; i++) {
                    var clientInfo = clientStrings[i];
                    if (clientInfo.r.test(userAgent)) {
                        os = clientInfo.s;
                        break;
                    }
                }

                // Now let's determine the OS
                var osVersion = unknown;

                // Special case for multiple Windows versions.
                if (/Windows/.test(os)) {
                    osVersion = /Windows (.*)/.exec(os)[1];
                    os = 'Windows';
                }

                // Handling Mac, Android and iOS...
                switch (os) {
                case 'Mac OS X':
                    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(userAgent)[1];
                    break;

                case 'Android':
                    osVersion = /Android ([\.\_\d]+)/.exec(userAgent)[1];
                    break;

                case 'iOS':
                    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(appVersion);
                    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                    break;
                }

                // Return the name of the OS and it's version number.
                return {
                    name: os,
                    version: osVersion
                };
            },

            /**
             * The name of the transition end event for a given transition prefix.
             *
             * @type {Object.<string, string>}
             */
            transEndEvtNames: {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd',
                msTransition: 'MSTransitionEnd',
                transition: 'transitionend'
            },

            /**
             * Replaces one Dom node in a DOM Doc with another.
             *
             * @param {HTMLElement|Node} target
             * @param {HTMLElement|Node} replacement
             *
             * @returns {HTMLElement|Node} The replacement element.
             */
            replace: function replace(target, replacement) {
                // Is there both a target AND a replacement node?
                if (target && replacement) {
                    // Is there a parent element?
                    var p = target.parentNode;
                    if (p) {
                        // Replace target in parent.
                        p.replaceChild(replacement, target);
                    }
                }

                // Return replacement;
                return replacement;
            },

            /**
             * Cross-browser wrapper for DOM2's addEventListener method, which in IE is called attachEvent.
             *
             * @param {HTMLElement|Node|Window} el The HTMLElement to attach an event listener to.
             * @param {string} eventName The name of event to listen for.
             * @param {Function} f The function to execute when the event occurs.
             * @param {boolean=} phase The event phase to capture (false for bubbles, true for capture).
             */
            attachEvent: function attachEvent(el, eventName, f, phase) {
                if (el.addEventListener) {
                    return el.addEventListener(eventName, f, !!phase);
                }

                return el.attachEvent('on' + eventName, f);
            },

            /**
             * Cross-browser wrapper for DOM2's removeEventListener method, which in IE is called detachEvent.
             *
             * @param {HTMLElement|Node} el The HTMLElement to attach an event listener to.
             * @param {string} eventName The name of event to listen for.
             * @param {Function} f The function to execute when the event occurs.
             * @param {boolean=} phase The event phase to capture (false for bubbles, true for capture).
             */
            detachEvent: function dom_detach(el, eventName, f, phase) {
                if (!el) {
                    return;
                }

                if (el.removeEventListener) {
                    el.removeEventListener(eventName, f, !!phase);
                } else {
                    el.detachEvent("on" + eventName, f);
                }
            },

            /**
             * <p>Cross-browser wrapper to allow attaching DOM events on a given element and raising an event to a given
             * mstrmojo widget.</p>
             *
             * @param {String} id The alpha-numeric mstrmojo id of the widget which needs to attach an event on it's markup.
             * @param {HTMLElement|Node} el The DOM element node to which the event needs to be attached.
             * @param {String} eventName The name of the event to attach on the DOM element.
             *
             * @return {Function} The event handler.
             */
            attachMarkupEvent: function attachMarkupEvent(id, el, eventName) {
                var fnEventHandler = function (e) {
                    mstrmojo.all[id].captureDomEvent(eventName, window, e);
                };

                this.attachEvent(el, eventName, fnEventHandler);

                // Return the event handler function which can be used to detach the event.
                return fnEventHandler;
            },

            /**
             * Attaches an event listener to a DOM node that will automatically be detached after it fires.
             *
             * @param {HTMLElement|Node} el The element to attach to.
             * @param {string} eventName The event to listen for.
             * @param {Function} f The function to listen for.
             * @param {boolean} [forceUnique=false] whether we want to avoid duplicate register same handlers
             *
             * @returns {Function}
             */
            attachOneTimeEvent: function attachOneTimeEvent(el, eventName, f, forceUnique) {
                // Create wrapper function so we can detach later.
                var fn = function (evt) {
                    // Call supplied function.
                    f(evt);

                    // Detach event.
                    if (forceUnique) {
                        detachUniqueEvent(this, eventName, fn);
                    } else {
                        mstrmojo.dom.detachEvent(this, eventName, fn);
                    }
                };

                // Attach event.
                if (forceUnique) {
                    attachUniqueEvent(el, eventName, fn);
                } else {
                    this.attachEvent(el, eventName, fn);
                }

                // Kill 'el' reference to avoid memory leaks.
                el = null;

                return fn;
            },

            /**
             * Attaches event listeners to the document for mousemove and mouseup that will automatically detach during mouseup.
             *
             * @param {function(evt:Event):boolean} fnMove The mouse move function to attach.
             * @param {function(evt:Event):boolean} [fnUp] An optional mouse up function that will be called during mouseup.
             */
            attachMouseMoveEvents: function attachMouseMoveEvents(fnMove, fnUp) {
                var $DOM = this,
                    fnMouseUp = function (evt) {
                        // Was a mouse up function supplied?
                        if (fnUp) {
                            fnUp(evt);
                        }

                        // Detach mouse event handlers.
                        $DOM.detachEvent(document, 'mousemove', fnMove);
                        $DOM.detachEvent(document, 'mouseup', fnMouseUp);
                    };

                // Attach mouse event handlers.
                $DOM.attachEvent(document, 'mousemove', fnMove);
                $DOM.attachEvent(document, 'mouseup', fnMouseUp);
            },

            /**
             * captures and processes a DOM event; usually called from event handler attached to DOM element.
             * event is passed to the object in the mstrmojo.all collection referenced by the id parameter.
             */
            captureDomEvent: function captureDomEvent(id, type, hWin, e, config) {
                var x = mstrmojo.all[id];
                if (x) {
                    x.captureDomEvent(type, hWin, e, config);
                }
            },

            /**
             * This method uses the Webkit's transform property to translate a DOM node. Based on whether the browser has been HW accelerated,
             * the method decides whether to use 'translate' or 'translate3d'.
             *
             * @param {HTMLElement} el The HTML DOM element that needs to be translated
             * @param {int} x The number of pixels (or percentage) to be moved along the x axis
             * @param {int} y The number of pixels (or percentage) to be moved along the y axis
             * @param {int} z The number of pixels (or percentage) to be moved along the z axis
             * @param {string=} extra Optional parameter: Any other extra CSS transform properties.
             * @param {boolean=} useTranslate3d Optional parameter helps in overriding the default device/browser behavior in using webkitTransforms.
             */
            translate: function translate(el, x, y, z, extra, useTranslate3d) {
                extra = (extra && ' ' + extra) || '';

                el.style[((mstrmojo.dom.isWinPhone || mstrmojo.dom.isIE9 || mstrmojo.dom.isIE10) ? 'ms' : 'webkit') + 'Transform'] = this.createTranslateString(x, y, z, useTranslate3d) + extra;
            },

            createTranslateString: function createTranslateString(x, y, z, useTranslate3d) {

                // Set the property to fit the transform string.
                x = setTranslateValue(x);
                y = setTranslateValue(y);
                z = setTranslateValue(z);

                return createTransformationString(x, y, z, useTranslate3d, 'translate');
            },

            createScaleString: function createScaleString(x, y, z, useScale3d) {

                //Set the property to fit the transform string.
                x = x || 0;
                y = y || 0;
                z = z || 0;

                return createTransformationString(x, y, z, useScale3d, 'scale');
            },

            /**
             * Number of milliseconds that an event is buffered by attachBufferedEvent methods.
             */
            _bufferSize: 200,

            /**
             * A lookup hash of buffer DOM attachments (plus timeout ids, listeners, etc) keyed by "<nodeid>-<event name>".
             */
            _bufferConnects: {},

            /**
             * Warning: this method assumes a single namespace for all node ids. Need to enhance it to support
             * nodes from different frames/windows with the same id.
             * Warning: this method assumes the given node has an id. That's done for performance reasons; it allows
             * us to cache info by node id in a hash; otherwise, we'd have to cache the node handle, which could be
             * risky for memory leaks, and would require using a cache array instead of hash, which would mean
             * slower performance for cache lookups.
             * Warning: buffered events will callback the given function with no arguments, so only use for
             * specific cases when your callback doesn't need the native DOM event object (because it will be long gone).
             *
             * @param {HTMLElement} el
             * @param {string} eventName
             * @param {Function} f
             * @param {number=} bufferSize
             *
             */
            attachBufferedEvent: function dom_attchbuf(el, eventName, f, bufferSize) {

                var key = el.id + '-' + eventName,
                    info = this._bufferConnects[key];

                if (!info) {
                    info = this._bufferConnects[key] = {
                        elId: el.id,
                        eventName: eventName,
                        timer: null,
                        bufferSize: bufferSize,
                        listeners: [],
                        callback: function (e) {
                            mstrmojo.dom._callback(e, mstrmojo.global, key);
                            return true;
                        }
                    };
                    this.attachEvent(el, eventName, info.callback);
                }
                info.listeners.push(f);
            },

            /**
             *
             * @param {Event} e
             * @param {Window} hWin
             * @param {string} key
             */
            _callback: function _callback(e, hWin, key) {
                var info = this._bufferConnects[key],
                    timer = info && info.timer;

                if (info && !timer) {
                    var ms = (info.bufferSize === null) ? this._bufferSize : info.bufferSize;

                    if (info.bufferSize) {
                        info.timer = hWin.setTimeout(function () {
                            mstrmojo.dom.updateBuffers(key);
                        }, ms);
                    } else {
                        // instant callback.
                        mstrmojo.dom.updateBuffers(key);
                    }
                }
            },

            /**
             *
             * @param {string} key
             */
            updateBuffers: function updateBuffers(key) {
                var info = this._bufferConnects[key],
                    ls = info && info.listeners,
                    len = (ls && ls.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    ls[i]();
                }
                if (info && info.timer) {
                    delete info.timer;
                }
            },

            /**
             *
             * @param {HTMLElement} el
             * @param {string} eventName
             * @param {Function} f
             */
            detachBufferedEvent: function detachBufferedEvent(el, eventName, f) {
                if (!el) {
                    return;
                }

                var key = el.id + '-' + eventName,
                    info = this._bufferConnects[key],
                    ls = info && info.listeners,
                    len = (ls && ls.length) || 0,
                    i;

                if (len) {
                    for (i = len - 1; i > -1; i--) {
                        if (ls[i] === f) {
                            ls.splice(i, 1);
                        }
                    }

                    // if no listeners left, detach the callback and
                    // remove its entry in our lookup so we can reconnect in the future if needed.
                    if (!ls.length) {
                        this.detachEvent(el, eventName, info.callback);
                        delete this._bufferConnects[key];
                        if (info.timer) {
                            var global = /** @type {Window} **/ mstrmojo.global;
                            global.clearTimeout(info.timer);
                        }
                    }
                }
            },

            /**
             * Returns the target DOM node of a given DOM event.
             *
             * @param {Window} hWin
             * @param {Event} e
             *
             * @returns {EventTarget|Node}
             */
            eventTarget: function evtTgt(hWin, e) {
                e = getEvent(hWin, e);
                return e.target || e.srcElement;
            },

            isMac: function isMac() {
                return this.getOSInfo().name.toLowerCase().indexOf('mac') >= 0;
            },

            /**
             * Returns true if the CTRL key was pressed on Windows or the Command Key on a Mac during given DOM event.
             *
             * @param {Window} hWin
             * @param {Event} e
             *
             * @returns {boolean}
             */
            isMetaKey: function isMetaKey(hWin, e) {
                var isMac = this.getOSInfo().name.toLowerCase().indexOf('mac') >= 0,
                    evt = getEvent(hWin, e) || {};

                // Exclusively use the Ctrl Key on non-Macs and the meta key on Macs.
                return (evt.ctrlKey && !isMac) || (evt.metaKey && isMac);
            },

            /**
             * Returns true if the CTRL key was pressed during given DOM event.
             *
             * @param {Window} hWin
             * @param {Event} e
             *
             * @returns {boolean}
             */
            ctrlKey: function ctrl(hWin, e) {
                return (getEvent(hWin, e) || {}).ctrlKey;
            },

            /**
             * Returns true if the SHIFT key was pressed during given DOM event.
             *
             * @param {Window} hWin
             * @param {Event} e
             *
             * @returns {boolean}
             */
            shiftKey: function shift(hWin, e) {
                return (getEvent(hWin, e) || {}).shiftKey;
            },

            /**
             * Returns true if the META key was pressed during given DOM event.
             *
             * @param {window} hWin
             * @param {Event} e
             *
             * @returns {boolean}
             */
            metaKey: function meta(hWin, e) {
                return (getEvent(hWin, e) || {}).metaKey;
            },

            /**
             * Returns mouse button of event, 1 for left-click, 2 for right (middle is considered as left)
             *
             * @param {Window} hWin
             * @param {Event} e
             *
             * @returns {int}
             */
            getButton: function getButton(hWin, e) {
                return ((Number(getEvent(hWin, e).button)) === 2) ? 2 : 1;    // IE, Firefox, Chrome all treat right button as 2
            },

            /**
             * Determines if the mouse button associated with the Event is the primary button or not.
             *
             * @param {Event} e The mouse event.
             * @param {Window} [hWin=window] An optional containing window.
             *
             * @returns {boolean}
             */
            isPrimaryMouseBtn: function isPrimaryMouseBtn(e, hWin) {
                return this.getButton(hWin || window, e) === 1;
            },

            /**
             * Returns an object with the x and y positions of the mouse.
             *
             * @param {Event} e The HTML Event.
             * @param {Window=} hWin The window.
             *
             * @returns {{x: number, y: number}}
             */
            getMousePosition: function getMousePosition(e, hWin) {
                hWin = hWin || window;

                var x,
                    y;


                if (mstrmojo.dom.isIE) {
                    e = e || hWin.event;
                    // In IE, clientX and clientY are relative to the current scroll position, not to the document.
                    var d = document,
                        b = d.body,
                        de = d.documentElement;
                    x = e.clientX + b.scrollLeft + (de.scrollLeft || 0);
                    y = e.clientY + b.scrollTop + (de.scrollTop || 0);
                } else {
                    // In other browsers, pageX & pageY are relative to the document, independent of the scroll position.
                    x = e.pageX;
                    y = e.pageY;
                }

                return {
                    x: x,
                    y: y
                };
            },

            /**
             * Return the position and size of a dom node.
             * The position is relative to its owner document, if includeScroll = true.
             * Otherwise, relative to its client view port.
             * TO-DO: Consider move it to boxmodel.js.
             *
             * @param {Node|HTMLElement} el
             * @param {boolean=} includeScroll
             *
             * @returns {mstrmojo.PositionType}
             */
            position: function position(el, includeScroll) {
                var p = {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                };

                // Does the browser support getBoundingClientRect?
                if (el && el.getBoundingClientRect) {
                    // Reset to client rect.
                    try {
                        // IE throws error if one of el's parents is removed from page and el becomes an orphan
                        p = el.getBoundingClientRect();
                    } catch (e) {
                        p = {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            height: 0,
                            width: 0
                        };
                    }

                    // Change to x, y, w and h;
                    p = {
                        x: p.left,
                        y: p.top,
                        w: p.right - p.left,
                        h: p.bottom - p.top
                    };

                    // Is this IE7 and below?
                    if (this.isIE6 || this.isIE7) {
                        // Does the element have an owner document?
                        var ownerDocument = el.ownerDocument;
                        if (ownerDocument) {
                            // Adjust top and left.
                            var de = ownerDocument.documentElement,
                                deo = de.getBoundingClientRect();
                            p.x -= deo.left;
                            p.y -= deo.top;
                        }
                    }
                }

                // Should we adjust for scroll?
                if (includeScroll) {
                    var ds = docScroll();
                    p.x += ds.x;
                    p.y += ds.y;
                }

                return p;
            },

            /**
             * <p>Measures the delta position of one DOM node relative to another.</p>
             *
             * <p>Note: compared to offset, this one consider scroll.</p>
             *
             * @param {HTMLElement|Node} el
             * @param {HTMLElement|Node} elLimit
             *
             * @returns {{x: int, y: int}}
             */
            delta: function delta(el, elLimit) {
                elLimit = elLimit || document.body;
                var pe = this.position(el),
                    pr = this.position(elLimit);

                return {
                    x: Math.round(pe.x - pr.x),
                    y: Math.round(pe.y - pr.y)
                };
            },

            /**
             * Calculate the dimension of browser window.
             *
             * @returns {{w: int, h: int}}
             */
            windowDim: function windowDim() {
                var w = 0,
                    h = 0,
                    win = window,
                    d = document,
                    de = d.documentElement,
                    db = d.body;
                if (typeof(win.innerWidth) == 'number' && typeof(win.innerHeight) == 'number') {
                  w = win.innerWidth;
                  h = win.innerHeight;
                } else if (de  && (de.clientWidth || de.clientHeight)) {
                  w = de.clientWidth;
                  h = de.clientHeight;
                } else if (db && (db.clientWidth || db.clientHeight)) {
                    w = db.clientWidth;
                    h = db.clientHeight;
                }
                return {
                    w: w,
                    h: h
                };
            },

            /**
             * Position an element to the center of browser window.
             *
             * @param {HTMLElement} e The element to center.
             */
            center: function center(e) {
                alignDOM.call(this, e, CENTER, CENTER);
            },

            /**
             * Position an element to the bottom center of browser window.
             *
             * @param {HTMLElement} e The element to position.
             */
            bottomCenter: function bottomCenter(e) {
                alignDOM.call(this, e, CENTER, BOTTOM);
            },

            /**
             * Removes the native text highlight that browsers tend to do whenever
             * end-users do a SHIFT+click or CTRL+click.
             *
             * @param {Window=} hWin
             */
            clearBrowserHighlights: function clearBrowserHighlights(hWin) {
                hWin = hWin || self;

                if (isIE || isIEW3C) {
                    var doc = hWin.document,
                        sel = doc && doc.selection,
                        em = sel && sel.empty;
                    if (em) {
                        try {
                            sel.empty();
                        } catch (ex) {
                            // TQMS# 337503: It seems that for an unknown reason the empty property sometimes can generate Runtime error, so swallow any errors.
                        }
                    }
                } else {
                    var gs = hWin.getSelection,
                        s = gs && hWin.getSelection();
                    if (s && !s.isCollapsed) {
                        if (s.empty) {
                            s.empty();
                        } else if (s.removeAllRanges) {
                            s.removeAllRanges();
                        }
                    }
                }
            },

            /**
             * <p>Searches for an ancestor of a given DOM node with a given HTML attribute.</p>
             *
             * <p>The attribute value may be any non-null value.   If a boolean flag is true,
             * the given DOM node is included in the search along with its ancestors.
             * If a limit node is given, the search stops when that limit is encountered (and
             * the limit itself is not tested).</p>
             *
             * @param {HTMLElement} el
             * @param {string} attr
             * @param {boolean} inclusive
             * @param {HTMLElement} elLimit
             * @returns {{node: HTMLElement, value: string}|null}
             */
            findAncestorByAttr: function fndAncAttr(el, attr, inclusive, elLimit) {
                var node = inclusive ? el : el && el.parentNode;
                while (node && (node !== elLimit)) {
                    var v = node.getAttribute && node.getAttribute(attr);
                    if (v != null) {
                        return {
                            node: node,
                            value: v
                        };
                    }
                    node = node.parentNode;
                }
                return null;
            },

            /**
             * Searches for an ancestor of a given DOM node with a given node name.
             * The attribute value may be any non-null value.   If a boolean flag is true,
             * the given DOM node is included in the search along with its ancestors.
             * If a limit node is given, the search stops when that limit is encountered (and
             * the limit itself is not tested).
             *
             * @param {HTMLElement} el
             * @param {string} nodeName
             * @param {boolean} inclusive
             * @param {HTMLElement} elLimit
             *
             * @returns {HTMLElement|null}
             */
            findAncestorByName: function fndAncNm(el, nodeName, inclusive, elLimit) {
                nodeName = nodeName && nodeName.toLowerCase();
                var node = inclusive ? el : el && el.parentNode;
                while (node && (node !== elLimit)) {
                    var n = node.nodeName;
                    if (n && (n.toLowerCase() === nodeName)) {
                        return node;
                    }
                    node = node.parentNode;
                }
                return null;
            },

            /**
             * <p>Returns true if a given DOM node is an ancestor of another given node.</p>
             *
             * <p>If a boolean flag is true, the latter node is included in the search.
             * If a limit node is given, the search stops when that limit is encountered (and
             * the limit itself is not tested).</p>
             *
             * @param {HTMLElement} elP The parent element to test.
             * @param {HTMLElement} elC The child element.
             * @param {boolean=} inclusive True if the search should start with the child element.
             * @param {HTMLElement=} elLimit An optional element that when encountered will stop the search.
             *
             * @returns {boolean}
             */
            contains: function cntns(elP, elC, inclusive, elLimit) {
                var node = elC;

                // Should we exclude the elC?
                if (!inclusive) {
                    // Start the search with the parent of elC.
                    node = node.parentNode;
                }

                while (node) {
                    // Is this node the target node?
                    if (node === elP) {
                        return true;
                    }

                    // Is the node the limit?
                    if (node === elLimit) {
                        break;
                    }

                    // Check the parent.
                    node = node.parentNode;
                }

                return false;
            },

            /**
             * Toggles the ability for text selection on the supplied {@link HTMLElement}.
             *
             * @param {HTMLElement} el The element whose selectability should be toggled.
             * @param {boolean} isSelectable Whether the item should be selectable.
             */
            toggleSelection: function toggleSelection(el, isSelectable) {
                // Set the unselectable attribute on the element.
                el.setAttribute('unselectable', isSelectable ? 'off' : 'on');

                // Toggle the unselectable CSS class on the element.
                mstrmojo.css.toggleClass(el, 'unselectable', !isSelectable);

                // Attach an event listener on select start to prevent any selections.
                el.onselectstart = function () {
                    return isSelectable;
                };

                // Clear previous highlight to deal with a timing issue.
                if (!isSelectable) {
                    this.clearBrowserHighlights();
                }

            },

            /**
             * Prevents the default event behavior.
             *
             * @param {Window|Object} hWin
             * @param {Event} e
             */
            preventDefault: function preventDefault(hWin, e) {
                e = e || hWin.event;

                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            },

            /**
             * Stops event propagation.
             *
             * @param {Window} hWin
             * @param {Event} e
             */
            stopPropogation: function stopPropogation(hWin, e) {
                e = e || hWin.event;

                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
            },

            /**
             * Returns the first touch event from the touches collection.
             *
             * @param {Window} hWin
             * @param {{touches: Event[]}} e
             *
             * @returns {Event|undefined}
             */
            firstTouch: function firstTouch(hWin, e) {
                return e && e.touches && e.touches.length ? e.touches[0] : (e || hWin.event);
            },

            /**
             * Returns the first touch event from the changedTouches collection.
             *
             * @param {Window} hWin
             * @param {{changedTouches: Event[]}} e
             *
             * @returns {Event}
             */
            firstChangedTouch: function firstChangedTouch(hWin, e) {
                return e && e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : (e || hWin.event);
            },

            /**
             * @returns {boolean}
             */
            isLandscape: function isLandscape() {
                return !this.supportsTouches || (Math.abs(window.orientation) === 90);
            },

            /**
             * <p>Finds the corresponding widget for a given DOM node.</p>
             *
             * <p>Searches the DOM node and its ancestors for an mstrmojoId expando property, which is assumed to
             * be set in the domNode of every widget to the widget's id.</p>
             *
             * @param {Node} el The DOM node.
             *
             * @returns {mstrmojo.Widget} The corresponding widget, if any; null otherwise.
             */
            findWidget: function findWidget(el) {
                while (el) {
                    var id = el.mstrmojoId;
                    if (id !== null && id !== undefined) {
                        return mstrmojo.all[id];
                    }
                    el = el.parentNode;
                }
                return null;
            },

            /**
             * Move caret to the specified position.
             *
             * @param {HTMLInputElement} el DOMNode to move its caret, like <INPUT>, <TextArea>
             * @param {int} pos  The number of character of the node's text content from the beginning
             */
            setCaret: function setCaret(el, pos) {
                if (el.setSelectionRange) {
                    el.focus();
                    el.setSelectionRange(pos, pos);

                } else if (el.createTextRange) { //IE7,8
                    var tr = el.createTextRange();
                    tr.move('character', pos);
                    tr.select();
                }
            },

            /**
             * Selects form control content. Not intended for other kinds of elements.
             *
             * @param {HTMLInputElement} el Form control to highlight, like <INPUT>, <TextArea>
             */
            setInputSelection: function setInputSelection(el) {
                if (el.select) {
                    el.focus();
                    el.select();
                } else if (el.createTextRange) { //IE7,8
                    el.createTextRange().select();
                }
            },

            /**
             * Selects element content.
             * NOTE: A side effect is that the element will get focused in IE7 and Chrome. IE8+ and Firefox don't have the problem.
             * @param {HTMLElement} el
             */
            setElementSelection: function setElementSelection(el) {
                if (window.getSelection) { // W3C
                    var range = document.createRange(),
                        selection = window.getSelection();

                    range.selectNodeContents(el);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else if (document.body.createTextRange) { // IE7,8
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.select();
                }
            },

            /**
             * Return the left position of the horizontal scroll bar
             *
             * @returns {number} x position
             */
            getHorizontalScroll: function getHorizontalScroll() {
                return docScroll().x;
            },

            /**
             * Return the top position of the vertical scroll bar
             *
             * @returns {number} y position
             */
            getVerticalScroll: function getVerticalScroll() {
                return docScroll().y;
            }
        }
    );
}());
(function () {

    /**
     * This mixin provides methods for opening and closing popups.
     *
     * @mixin
     * @public
     */
    mstrmojo._HasPopup = mstrmojo.provide(
        'mstrmojo._HasPopup',

        /**
         * @lends mstrmojo._HasPopup#
         */
        {
            _mixinName: 'mstrmojo._HasPopup',

            /**
             * The last opened popup.
             *
             * @type {Object}
             */
            _lastOpened: null,

            /**
             * <p>Opens a popup, applying a given (optional) config hash table of properties.</p>
             *
             * <p>A reference to the popup is provided, which may be either the ID of a widget, a config for a widget, or a handle to a widget.
             * The widget is assumed to implement the {@link mstrmojo._IsPopup} API.</p>
             *
             * @param {String|Object|Widget} ref The reference for the widget.
             * @param {Object} [config=undefined] An optional configuration for the popup.
             */
            openPopup: function openPopup(ref, config) {
                // If the given ref is a string with no periods, it is a property name which
                // holds the popup config.
                var isProp = !!ref && (typeof ref === "string") && !ref.match(/\./) && !!this[ref],
                    // Resolve the reference to the popup.
                    popup = mstrmojo.registry.ref(isProp ? this[ref] : ref);

                // Did the ref resolve to an object with an open method?
                if (popup && popup.open) {
                    // Dont cache popup handle in this._popup because this widget might support
                    // multiple popups.  If we want caching, we have to supply a property name for the ref.
                    // The resolve reference to the popup will be cached there.
                    if (isProp) {
                        this[ref] = popup;
                    }

                    // Push into the disposables array so that the popup would be destroyed when the host widget being destroyed.
                    if (popup.disposable !== false) {
                        this.addDisposable(popup);
                    }

                    // If the popup has a slot, insert the child into the slot.
                    var slot = popup.slot && this[popup.slot];
                    if (slot) {
                        if (popup.parent !== this) {
                            // The popup is not our child already.
                            if (this.addChildren) {
                                // We are a container, so add the popup as our child.
                                // That will ensure that its DOM gets inserted into our slot.
                                this.addChildren([ popup ]);
                            } else {
                                // We are not a container, so instead just manually insert the popup's
                                // domNode into our slot.  If the popup has no domNode yet, create a placeholder
                                // node for it in our slot.
                                // Warning: Don't call appendChild if the domNode is already in this slot; it
                                // causes repaint issues, such as resetting scrollTop = 0.
                                var skipCheck = false,
                                    el = popup.domNode || popup.placeholder;
                                if (el && typeof el === 'string') {
                                    el = document.getElementById(el);
                                }
                                if (!el) {
                                    skipCheck = true;
                                    el = document.createElement('span');
                                    popup.placeholder = el;
                                }
                                if (skipCheck || (el.parentNode !== slot)) {
                                    slot.appendChild(el);
                                }
                            }
                        }
                    }

                    // Catch the error so it doesn't affect the setting of the lastOpened property.
                    try {
                        popup.open(this, config);
                    } catch (e) {
                        console.log('Error opening popup: ' + e);
                    }
                    this._lastOpened = popup;
                }
            },

            /**
             * Closes the currently open popup, if any.
             */
            closePopup: function closePopup() {
                var popup = this._lastOpened;
                if (popup && popup.visible && popup.close) {
                    popup.close();
                    delete this._lastOpened;
                }
            }
        }
    );
}());
(function () {

    function getElementPropertyValue(name) {
        var idx = this.h.idx;
        if (idx !== -1) {
            return this.t.es[idx][name];
        }

        return '';
    }

    /**
     * Represents single header.
     *
     * @class
     */
    mstrmojo.models.template.Header = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.models.template.Header.prototype
         */
        {
            init: function init(props) {
                this.h = props.h;
                this.t = props.t;
            },

            getName: function getName() {
                return getElementPropertyValue.call(this, 'n');
            },
            getElementId: function getElementId() {
                return getElementPropertyValue.call(this, 'id');
            },
            getObjectId: function getId() {
                return getElementPropertyValue.call(this, 'oid');
            },
            getElementIndex: function getElementIndex() {
                return this.h.idx;
            },
            getActionType: function getActionType() {
                return this.h.at;
            },
            isTotal: function isTotal() {
                return this.h.otr === 1;
            }
        }
    );
}());
(function () {

    /**
     * A utility class to hold common box model operations.
     *
     * @namespace mstrmojo.boxmodel
     */
    mstrmojo.boxmodel = mstrmojo.provide(
        "mstrmojo.boxmodel",

        /**
         * @lends mstrmojo.boxmodel
         */
        {
            /**
             * Determines if two sets of points intersect.
             *
             * @param {int} top1
             * @param {int} bot1
             * @param {int} top2
             * @param {int} bot2
             *
             * @returns {boolean}
             */
            rangeIntersect: function rangeInt(top1, bot1, top2, bot2) {
                if (top1 < top2) {
                    return top2 <= bot1;
                }

                if (top1 > top2) {
                    return top1 <= bot2;
                }

                return true;
            },

            /**
             * Converts pixel units to inches.
             *
             * @param {{zf: number, dpi: int}} di A object with properties for zoom factor (zf) and DPI (dpi).
             * @param {string|int} v The pixel value.
             */
            px2Inches: function px2Inches(di, v) {
                // Convert to an integer.
                v = parseInt(v, 10);

                // Divide by zoom and dpi (limit to 4 decimals).
                return parseFloat((v / di.zf / di.dpi).toFixed(4));
            },

            /**
             * Measures the offsetLeft and offsetTop of one DOM node relative to another.
             *
             * @param {HTMLElement} el The element whose offsets should be calculated.
             * @param {HTMLElement=} elLimit An optional element to be used as the basis for offset calculations.
             *
             * @returns {{left: int, top: int}}
             */
            offset: function offst(el, elLimit) {
                var org = el,
                    x = 0,
                    y = 0;

                while (el) {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                    el = el.offsetParent;
                    if (el === elLimit) {
                        break;
                    }
                }
                // Now loop through the ancestors of the element, looking for any that have scrollTop/Left set.
                // Subtract these scrolling values from the total offset. However, we must be sure to stop the loop
                // before we reach document.body, or we'll take document scrolling into account
                // and end up converting our offset ot window coordinates.
                // TQMS 716812 Zhang, Hongchao 20130201
                var e;
                for (e = org && org.parentNode; e && e !== elLimit; e = e.parentNode) {
                    if (e.scrollTop) {
                        y -= e.scrollTop;
                    }
                    if (e.scrollLeft) {
                        x -= e.scrollLeft;
                    }
                }
                return {
                    left: x,
                    top: y
                };
            },

            /**
             * Converts em to pixels.
             *
             * @param {HTMLElement} el The dom node where the relative unit value associated.
             * @param {string} v The em values string.
             *
             * @returns {string} The supplied value, in pixels.
             */
            convert2px: function convert2px(el, v) {
                // Is the value NOT already in pixels?
                if (!/px$/.test(v)) {
                    var img = document.createElement('img'),
                        imgStyle = img.style,
                        pl;

                    imgStyle.zIndex = -1;
                    imgStyle.left = v;

                    el.appendChild(img);

                    // Get the pixel value.
                    pl = imgStyle.pixelLeft;
                    el.removeChild(img);

                    return pl + 'px';
                }

                return v;
            },

            /**
             * <p>Uses the diagonal lines equation to calculate which edge of the given position the given point is closest to.
             *
             * @param {mstrmojo.PositionType} position The position to test.
             * @param {{x: int, y: int}} point The point to test.
             *
             * @returns {String} Either 'Top', 'Right', 'Bottom' or 'Left', depending on which is closer to the point.
             */
            getEdgeQuadrantByPoint: function getEdgeQuadrantByPoint(position, point) {
                var x = point.x - position.x,
                    y = point.y - position.y,
                    w = position.w,
                    h = position.h,
                    quadrants = [
                        ['Left', 'Bottom'],
                        ['Top', 'Right']
                    ];

                // Is it less than the mid point?
                if (y > h / w * x) {
                    // Use left and bottom.
                    quadrants = quadrants[0];
                } else {
                    // Use top and right.
                    quadrants = quadrants[1];
                }

                return (y < -h / w * x + h) ? quadrants[0] : quadrants[1];
            },

            /**
             * Determines if a given point is contained within a polygon.
             *
             * @param {{x: int, y: int}} pt The point to test.
             * @param {Array.<{x: int, y: int}>} polygonVertices An array of polygon vertices.
             *
             * @returns {boolean}
             */
            isPtInPolygon: function isPtInPolygon(pt, polygonVertices) {
                // Extract point values and assume it doesn't intersect.
                var x = pt.x,
                    y = pt.y,
                    intersects = false;

                // Iterate vertices.
                polygonVertices.forEach(function (currentVertex, idx) {
                    // Get previous (or last) vertex.
                    var previousVertex = polygonVertices[idx - 1] || polygonVertices[polygonVertices.length - 1];

                    // Is y NOT on the same side of both vertices?
                    if ((currentVertex.y >= y) !== (previousVertex.y >= y)) {

                        if ((x < (previousVertex.x - currentVertex.x) * (y - currentVertex.y) / (previousVertex.y - currentVertex.y) + currentVertex.x)) {
                            intersects = !intersects;
                        }
                    }
                });

                return intersects;
            }
        }
    );
}());
(function () {
    /**
     * <p>Static class with helper methods for using Function objects.</p>
     *
     * @namespace mstrmojo.func
     */
    mstrmojo.func = mstrmojo.provide(
        "mstrmojo.func",

        /**
         * @lends mstrmojo.func
         */
        {
            /**
             * <p>Utility function for combining multiple function calls.</p>
             *
             * @param {Function[]} fn An array of functions to call.
             *
             * @returns {Function} The wrapper function that will call each of the supplied functions in the order they appear in the <strong>fn</strong> parameter.
             */
            composite: function composite(fn) {
                // Is the 'fn' parameter invalid?
                if (!fn || !fn.length) {
                    // Return an empty function
                    return mstrmojo.emptyFn;
                }

                return function () {
                    var len = fn.length,
                        i;

                    for (i = 0; i < len; i++) {
                        fn[i].apply(this, arguments);
                    }
                };
            },

            /**
             * Creates (or modifies destination) object with the combined methods of the any number of parameters objects where all methods will be called.
             * The first [arguments.length - 1] become the sources array
             * The last argument should be the destination
             * @param {...Object} var_args respresenting sources and destination
             * @returns {Object}
             */
            wrapMethods: function wrapMethods(src, dest) {

                /**
                 * inner wrapMethods that take one or two arguments.
                 * Creates (or modifies destination) object with the combined methods of the two parameters objects where all methods will be called.
                 *
                 * @param {Object} source
                 * @param {Object=} destination
                 *
                 * @returns {Object}
                 */
                function wrap(source, destination) {
                    // Initialize callback (in case it was null).
                    destination = destination || {};

                    // Iterate the source object and wrap existing methods (if present in destination) or
                    // add source method if not present in destination.
                    mstrmojo.hash.forEach(source, function (fn, fnName) {
                        destination[fnName] = (destination.hasOwnProperty(fnName) && typeof fn === 'function') ? mstrmojo.func.composite([ fn, destination[fnName] ]) : fn;
                    });

                    return destination;
                }

                //if only two arguments or less, call wrap method directly.
                if (arguments.length < 3) {
                    return wrap(src, dest);
                }

                // extract arguments(when arguments more than 2):
                // The first [arguments.length - 1] become the sources array
                //    * call `reverse` here to make sure the first source to be put into destination last.
                //      when we call destination[fnName], sources[0][fnName] would be invoke first.
                // The last argument should be the destination
                var len = arguments.length,
                    sources = [].slice.call(arguments, 0, len - 1).reverse(),
                    destination = arguments[len - 1];

                // Iterate the sources array and wrap with destination
                mstrmojo.array.forEach(sources, function (source) {
                    destination = wrap(source, destination);
                });

                return destination;
            },

            /**
             * Overrides in destination methods provided by src. Methods from src can use
             * this._super to call overridden method
             * @param src {Object} an object containing overriding methods. Nothing but methods is allowed in src
             * @param destination {Object} an object whose methods will be overridden. If this parameter is omitted
             *                             a new object will be created
             * @returns {Object} the destination object.
             */
            override: function override(src, destination) {

                var fnWrapMethod = function (overwriting, inher) {
                    return function superwrap() {
                        var tmp = this._super,
                            ret;
                        this._super = inher || mstrmojo.emptyFn;
                        try {
                            ret = overwriting.apply(this, arguments || []);
                        } finally {
                            this._super = tmp;
                        }
                        return ret;
                    };
                };

                destination = destination || {};

                // #940083 Iterate the source object and wrap existing methods even destination is empty,
                //         so that the _super will be set correctly while executing.
                mstrmojo.hash.forEach(src, function (fn, fnName) {
                    destination[fnName] = fnWrapMethod(fn, destination[fnName]);
                });

                return destination;
            },

            /**
             * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
             * will only actually call the original function at most once per every wait milliseconds.
             * Useful for rate-limiting events that occur faster than you can keep up with.
             *
             * By default, throttle will execute the function as soon as you call it for the first time, and,
             * if you call it again any number of times during the wait period, as soon as that period is over.
             * If you'd like to disable the leading-edge call, pass {leading: false}, and if you'd like to
             * disable the execution on the trailing-edge, pass {trailing: false}.
             *
             * @param func {Function} the original function
             * @param wait {int} milliseconds to throttle
             * @param opts {leading:Boolean, trailing:Boolean}
             * @returns {Function}
             */
            throttle: function (func, wait, opts) {
                var context, args, result,
                    timeout = null,
                    previous = 0,
                    options = opts || {};

                var later = function () {
                    previous = options.leading === false ? 0 : mstrmojo.date.now();
                    timeout = null;
                    result = func.apply(context, args);
                    context = args = null;
                };
                return function () {
                    var now = mstrmojo.date.now();
                    if (!previous && options.leading === false) {
                        previous = now;
                    }
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                        context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },

            /**
             * Creates and returns a new debounced version of the passed function which will postpone its execution until
             * after wait milliseconds have elapsed since the last time it was invoked. Useful for implementing behavior
             * that should only happen after the input has stopped arriving. For example: rendering a preview of a Markdown
             * comment, recalculating a layout after the window has stopped being resized, and so on.
             *
             * Pass true for the immediate parameter to cause debounce to trigger the function on the leading instead of the
             * trailing edge of the wait interval. Useful in circumstances like preventing accidental double-clicks on a
             * "submit" button from firing a second time.
             *
             * @param {Function} func the original function
             * @param {int} wait milliseconds to wait
             * @param {Boolean=} immediate trigger the function on the leading instead of the trailing edge
             * @returns {Function}
             */
            debounce: function (func, wait, immediate) {
                var timeout, args, context, timestamp, result, now = mstrmojo.date.now;

                var later = function () {
                    var last = now() - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            context = args = null;
                        }
                    }
                };

                return function () {
                    context = this;
                    args = arguments;
                    timestamp = now();
                    var callNow = immediate && !timeout;
                    if (!timeout) {
                        timeout = setTimeout(later, wait);
                    }
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }

                    return result;
                };
            },

            /**
             * Creates (or modifies destination) object to have all the methods from the source object, provided those methods didn't already exist on the destination.
             *
             * @param {Object} source
             * @param {Object=} destination
             *
             * @returns {Object}
             */
            addMethods: function addMethods(source, destination) {
                // Initialize callback (in case it was null).
                destination = destination || {};

                // Iterate the source object and wrap existing methods (if present in destination) or
                // add source method if not present in destination.
                mstrmojo.hash.forEach(source, function (fn, fnName) {
                    if (!destination.hasOwnProperty(fnName) && typeof fn === 'function') {
                        destination[fnName] = fn;
                    }
                });

                return destination;
            }
        }
    );
}());
(function () {
    mstrmojo.requiresCls(
        "mstrmojo.base64",
        "mstrmojo.func",
        "mstrmojo.hash"
    );

    /**
     * A standard XHR callback object.
     *
     * @typedef {{
     *      submission: Function=,
     *      progress: Function=,
     *      success: Function=,
     *      failure: Function=,
     *      complete: Function=,
     *      canceled: Function=
     *  }} mstrmojo.XhrCallbackType
     *
     * @property {Function=} submission Called when the XHR request is submitted.
     * @property {Function=} progress Called when the XHR has progress.
     * @property {Function=} success Called when the XHR request succeeds.
     * @property {Function=} failure Called when the XHR request fails.
     * @property {Function=} complete Called when the XHR request is complete, regardless of status.
     * @property {Function=} canceled Called when the XHR request is canceled.
     */
    mstrmojo.XhrCallbackType = null;

    /**
     * <p> Decode the Base64-encoded response header whose value are in the following format: "=?UTF-8?B?EncodedText?=" </p>
     *
     * @param {string} value The value of a response header.
     * @returns {string} The decoded response header.
     *
     * @private
     */
    function decodeHeader(value) {
        var rEncoded = /\=\?UTF-8\?B\?(.+?)\?\=/g;
        if (value && value.indexOf("=?UTF-8?B?") === 0) {
            var decMsg = "", result;
            while ((result = rEncoded.exec(value)) !== null) {
                decMsg += mstrmojo.base64.decode(result[1]);
            }
            return decMsg;
        }
        return value;
    }

    /**
     * <p>Encodes parameters for XHR transport.</p>
     *
     * @param {Object} params A hash containing parameter names and values.
     *
     * @returns {string} A URL of encoded parameters.
     */
    function encodeParams(params) {
        var x = -1,
            url = [],
            p;

        if (params) {
            for (p in params) {
                url[++x] = p + '=' + encodeURIComponent(params[p]);
            }
        }

        return url.join('&');
    }

    /**
     * <p>Builds up the url with parameters is method == 'GET'.</p>
     *
     * @param {string} method The method for the xhr ('GET' or 'POST').
     * @param {string} baseUrl The url used for both GET and POST (excludes parameters in GET case).
     * @param {Object} [params] The parameters for this request.
     *
     * @returns {string} The url built from the baseUrl and params.
     */
    function appendUrlParams(method, baseUrl, params) {
        if (method !== 'GET' || !params) {
            return baseUrl;
        }

        return baseUrl + '?' + encodeParams(params);
    }

    /**
     * <p>Opens and sends the xhr.</p>
     *
     * @param {{open: Function, send: Function, setRequestHeader: Function, onreadystatechange: Function}} xhr The xhr to use for this request.
     * @param {string} method The method for the xhr ('GET' or 'POST').
     * @param {string} baseUrl The url used for both GET and POST (excludes parameters in GET case).
     * @param {Object} params The parameters for this request.
     * @private
     */
    function sendXhr(xhr, method, baseUrl, params) {
        // Make sure it's uppercase for comparisons.
        method = method.toUpperCase();
        var app = mstrApp,
            m = window.microstrategy;

        // Set default values.
        if (this.isTask) {
            params = mstrmojo.addCSRFTokenToTaskParams(params);

            params.taskContentType = params.taskContentType || 'json';
            params.taskEnv = params.taskEnv || 'xhr';
            params.xts = new Date().getTime();
            baseUrl = baseUrl || mstrConfig.taskURL;
        }

        //persisted task params
        var ptp = app.persistTaskParams || (m && m.persistParams);
        if (ptp) {
            mstrmojo.requiresCls("mstrmojo.hash");
            mstrmojo.hash.copy(ptp, params);
        }

        xhr.open(method, appendUrlParams(method, baseUrl, params), this.async);

        if (method !== 'POST') {
            xhr.send(null);
        } else {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(encodeParams(params));
        }

        if (this.async === false) {
            xhr.onreadystatechange();
        }
    }

    /**
     * <p>Creates an XHR object.</p>
     *
     * @type XMLHttpRequest
     * @returns An instance of the XMHttpRequest object.
     *
     * @private
     */
    function createXhr() {
        var methods = [
                function () {
                    return new XMLHttpRequest();
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            ],
            cnt = methods.length,
            i;

        for (i = 0; i < cnt; i++) {
            var xhr;
            try {
                xhr = methods[i]();
            } catch (e) {
                continue;
            }

            // Success, replace this method with appropriate method.
            createXhr = methods[i];
            return xhr;
        }

        // Failed, throw error.
        throw new Error('mstrmojo.SimpleXHR: Could not create an XHR object.');
    }

    /**
     * Evals the XHR response, swallowing any errors that occur.
     *
     * @param {string} rt The XHR.responseText.
     *
     * @private
     */
    function evalResponse(rt) {
        var rtn = null;

        try {
            rtn = eval('(' + rt + ')');
        } catch (ex) {
            rtn = rt && mstrmojo.string.trim(rt);
        }

        return rtn;
    }

    /**
     * Error codes for disconnected session.
     *
     * @private
     * @ignore
     */
    var MSI_SERVER_NAME_NOT_INITIALIZED = 0x800438F3,  // Server Name Not initialized
        MSI_INVALID_SESSION_ID = 0x800438F4,           // Session ID invalid
        E_MSI_USERMGR_USER_NOTFOUND = 0x800430A5,      // UserLogin expired
        E_MSI_CONNECT_FAILED = 0x80043705;

    /**
     * Check response code to see whether the xhr error because of disconnected session.
     *
     * @private
     * @ignore
     */
    function isSessionExpiredError(res) {
        var c = res && res.getResponseHeader('X-MSTR-TaskErrorCode');
        c = (c < 0) ? (0x100000000 + parseInt(c, 10)) : c;    // c from task is a negative number, we need to recover it into positive number
        switch (c) {
        case MSI_SERVER_NAME_NOT_INITIALIZED:
        case MSI_INVALID_SESSION_ID:
        case E_MSI_USERMGR_USER_NOTFOUND:
        case E_MSI_CONNECT_FAILED:
            return true;
        }
        return false;
    }

    function xhrSupportsProgress(xhr) {
        return !!(xhr && xhr.upload && xhr.upload.onprogress);
    }

    /**
     * A simple XHR.
     *
     * @class
     */
    mstrmojo.SimpleXHR = mstrmojo.declare(
        // superclass
        null,

        // mixins
        null,

        /**
         * @lends mstrmojo.SimpleXHR.prototype
         */
        {
            scriptClass: "mstrmojo.SimpleXHR",

            /**
             * If true, this object's requests are treated as requests to a MicroStrategy Web Task, and
             * therefore Task-specific default parameters are automatically included in each request.
             *
             * @type Boolean
             */
            isTask: true,

            /**
             * If true, the XHR will be sent asynchronously
             *
             * @type Boolean
             */
            async: true,

            init: function init(props) {
                // Apply the given properties to this instance.
                mstrmojo.hash.copy(props, this);
            },

            onreadystatechange: function onreadystatechange(xhr, callback, prevRequest) {
                // ignore all state changes until we see a 4
                if (xhr.readyState !== 4) {
                    return;
                }
                // we expect the callback parameter to be a hash of callback functions for success, failure, etc.
                if (typeof callback !== "object") {
                    return;
                }

                try {
                    // djh 2010/06/30 added check for 304 error code to handle cached files that have not changed.
                    if ((xhr.status === 200) || (xhr.status === 304)) {

                        // evaluate the response from the server in the hopes that it returned us JSON.  However, it may not.
                        // We can receive text, HTML, XML, or <empty string> here as well.
                        this.response = callback.textResponse ? xhr.responseText : evalResponse(xhr.responseText);

                        // if we got a response then pass it back to the success() callback.  It is this function's responsibility to
                        // determine if the repsonse data received is value for the request made of the server.
                        if (typeof callback.success === "function") {
                            // got data back from the server that evaluated w/o errors; call the success callback
                            callback.success(this.response);

                        }
                    } else {

                        if (xhr.status !== 0) {
                            // need to check session expiration error
                            var app = mstrApp,
                                sessionExp = app && app.onSessionExpired;

                            if (sessionExp && isSessionExpiredError(xhr)) {
                                sessionExp.call(app, prevRequest);
                            } else {
                                var orig = xhr.getResponseHeader;
                                xhr.getResponseHeader = function (name) {
                                    return decodeHeader(orig.apply ? orig.apply(xhr, [name]) : orig(name));
                                };

                                // since we failed to get the data, call the failure callback
                                if (typeof callback.failure === "function") {
                                    callback.failure(xhr);
                                }
                            }
                        }
                    }
                } catch (ex) {
                    mstrmojo.err(ex);
                    throw ex;
                } finally {
                    // no matter what, call the complete callback
                    if (typeof callback.complete === "function") {
                        callback.complete();
                    }

                    // This xhr request should have extended the session to a new cycle of life,
                    // then we need restart session manager unless the request sets flag 'notRestartSessionManager.params' true.
                    // Specifically task 'isSessionAlive' should have set this flag true.
                    if (!isSessionExpiredError(xhr) && !prevRequest.params.notRestartSessionManager) {
                        var sm = mstrApp.sessionManager;
                        if (sm && sm.restart) {
                            sm.restart();
                        }
                    }
                }
            },

            /**
             * <p>Aborts an XHR request in progress.</p>
             *
             * @returns {boolean} TRUE if xhr request was canceled
             */
            cancel: function () {
                var didCancel = false;
                var xhr = this.xhr;
                if (xhr) {
                    delete xhr.onreadystatechange;
                    // assign it to null would cause type mismatch error in IE.
                    // xhr.onreadystatechange = null;
                    xhr.isAborted = true;//for some browsers, the onreadystatechange is still called, so we need to use this workaround.

                    if (xhr.readyState < 4) {
                        xhr.abort();
                        didCancel = true;
                    }
                    this.xhr = null;
                }
                return didCancel;
            },

            /**
             * <p>Initiates an XHR request.</p>
             *
             * @param {string} method The method to use, i.e. 'GET' or 'POST'.
             * @param {string} baseUrl The base URL of the web server page to hit with the XHR request.
             * @param {mstrmojo.XhrCallbackType} callback The callback interface
             * @param {Object} params A hash of parameter names/values.
             * @param {string=} webSvrUrl  Web server url if the call is targeted to another web server other than the one hosting the app.
             * @param {boolean=} useResFeed if use resourceFeed to access webSrvUrl
             * @param {Object=} webSrvParams Params for webSvrUrl
             */
            request: function request(method, baseUrl, callback, params, webSvrUrl, useResFeed, webSrvParams) {
                // If webSvrUrl is presented, it means this is a cross web server request.
                // Then it will be delegated to mstrmojo.jsonp.request.
                if (webSvrUrl) {
                    if (useResFeed === true) {
                        if (!params) {
                            params = {};
                        }
                        params.srcURL = appendUrlParams('GET', webSvrUrl, webSrvParams);
                        this.request(method, baseUrl, callback, params);
                    } else {
                        mstrmojo.jsonp.request(webSvrUrl, params, callback);
                    }
                } else {
                    var xhr = createXhr();
                    xhr.onreadystatechange = (function (me, x, c, pr) {
                        return function () {
                            me.onreadystatechange(x, c, pr);
                        };
                    }(this, xhr, callback, {
                        method: method,
                        baseUrl: baseUrl,
                        callback: callback,
                        params: params
                    }));

                    // if the xhr supports it, hook up the progress callback if we have one
                    if (xhrSupportsProgress(xhr) && callback.progress) {
                        xhr.onprogress = (function (me, x, c) {
                            return function (evt) {
                                c.progress.call(me, evt);
                            };
                        }(this, xhr, callback));
                    }
                    this.xhr = xhr;

                    sendXhr.call(this, xhr, method, baseUrl, params);
                }
            }
        }
    );

    /**
     * An XHR that queues requests.
     *
     * @class
     * @extends mstrmojo.SimpleXHR
     */
    mstrmojo.QueuedXHR = mstrmojo.declare(
        // superclass
        mstrmojo.SimpleXHR,

        // mixins,
        null,

        /**
         * @lends mstrmojo.QueuedXHR.prototype
         */
        {
            scriptClass: "mstrmojo.QueuedXHR",

            /**
             * The request queue.
             *
             * @type {Object[]}
             * @private
             */
            queue: null,

            /**
             * Number of requests in the queue, it indicates where there is any request in progress.
             *
             * @type {Integer}
             * @private
             */
            requestCount: 0,

            /**
             * The number of seconds to delay between requests.
             *
             * @type {int}
             * @private
             */
            retryDelay: 1,

            /**
             * The request cache, the task with same parameters can hit this cache
             *
             * @type {Object[]}
             * @private
             */
            lookup: null,

            /**
             * <p>Override of super that aborts an XHR request in progress and purges queue of any outstanding requests</p>
             */
            cancel: function cancel() {
                // cancel any request that's actually processing ASAP so it doesn't complete and fire off any queued requests
                var didCancel = this._super();

                // now empty the queue of any requests we haven't processed yet firing the complete() callback for each one
                while (this.queue.length) {
                    var x = this.queue.pop();
                    var cb = x.callback;
                    if (cb && cb.complete) {
                        cb.complete();
                    }
                }
                this.queue = [];

                // reset our busy flag
                this.requestCount--;

                return didCancel;
            },

            /**
             * Constructor. Initializes the queue to an empty array.
             */
            init: function init() {
                this.queue = [];
                this.lookup = [];
            },

            /**
             * <p>Initiates an XHR request.</p>
             *
             * @param {string} method The method to use, i.e. 'GET' or 'POST'.
             * @param {string} baseUrl The base URL of the web server page to hit with the XHR request.
             * @param {mstrmojo.XhrCallbackType} callback An optional callback interface
             * @param {Object} params A hash of parameter names/values.
             * @param {boolean=} override Indicates that any in progress requests should be cancelled.
             * @param {string=} webSvrUrl  Webserver url if the call is targeted to another web server other than the one hosting the app.
             * @param {boolean=} useResFeed if use resourceFeed to access webSrvUrl
             * @param {Object=} webSrvParams Params for webSvrUrl
             * @param {boolean=} useCache indicates whether to cache the response of the request into local memory
             */
            request: function request(method, baseUrl, callback, params, override, webSvrUrl, useResFeed, webSrvParams, useCache) {
                // If webSvrUrl is presented, it means this is a cross web server request.
                // Then it will be delegated to mstrmojo.jsonp.request.
                if (webSvrUrl) {
                    if (useResFeed === true) {
                        if (!params) {
                            params = {};
                        }
                        params.srcURL = appendUrlParams('GET', webSvrUrl, webSrvParams);
                        this.request(method, baseUrl, callback, params);
                    } else {
                        mstrmojo.jsonp.request(webSvrUrl, params, callback);
                    }
                } else {
                    // if there's already a request processing and we're not to preempt it then queue the new request
                    if (this.requestCount > 0 && !override) {
                        this.queue.push({
                            method: method,
                            baseUrl: baseUrl,
                            callback: callback,
                            params: params
                        });
                    } else {
                        // either nothing is going on or we want to preempt any running/queued requests

                        // if there is a request in progress then kill it any empty the queue
                        if (this.requestCount > 0) {
                            this.cancel();
                        }

                        this.requestCount++;

                        var lu = null,
                            oriParams = null;
                        if (useCache) {
                            lu = this._searchForCacheRequest(params);
                            oriParams = mstrmojo.hash.copy(params); // because it may add some more parameters in later sendXHR method
                        }

                        if (lu) {
                            // If find the cache, directly call the success callback with cached response data
                            try {
                                if (callback.success) {
                                    window.setTimeout(
                                        function () {
                                            callback.success(lu.res);
                                        },
                                        10
                                    );
                                    //callback.success(lu.res);
                                }
                            } catch (ex) {
                                mstrmojo.err(ex);
                                throw ex;
                            } finally {
                                if (callback.complete) {
                                    callback.complete();
                                }
                                this.advanceQueue();
                            }
                        } else {
                            var xhr = this.xhr = createXhr();

                            // wrap the complete callback with our own that will advance the queue
                            callback = /** @type {mstrmojo.XhrCallbackType} **/ mstrmojo.func.wrapMethods(callback, {
                                complete: (function (ths) {
                                    return function () {
                                        ths.advanceQueue();
                                    };
                                }(this)),

                                success: (function (ths) {
                                    return function () {
                                        // Cache the request with parameters and response into the lookup
                                        if (useCache) {
                                            ths.lookup.push({
                                                params: oriParams,
                                                res: ths.response
                                            });
                                        }
                                    };
                                }(this))
                            });

                            xhr.onreadystatechange = (function (me, x, c, pr) {
                                return function () {
                                    me.onreadystatechange(x, c, pr);
                                };
                            }(this, xhr, callback, {
                                method: method,
                                baseUrl: baseUrl,
                                callback: callback,
                                params: params
                            }));

                            // if the xhr supports it, hook up the progress callback if we have one
                            if (xhrSupportsProgress(xhr) && callback.progress) {
                                xhr.onprogress = (function (me, x, c) {
                                    return function (evt) {
                                        c.progress.call(me, evt);
                                    };
                                }(this, xhr, callback));
                            }

                            sendXhr.call(this, xhr, method, baseUrl, params);
                        }
                    }
                }
            },

            /**
             * Use Formdata to send data to the server via XHR request
             *
             * @param method The method to use, i.e. 'GET' or 'POST'
             * @param baseUrl The base URL of the web server page to hit with the XHR request
             * @param callback An optional callback interface
             * @param params A hash of parameter names/values.
             * @param data The data being sent. Data can be a Blob, File, or a string, if neither, the value is converted to a string.
             * @param config Configuration for the progress bar
             * @param override Indicates that any in progress requests should be cancelled.
             * @param webSrvParams Params for webSvrUrl
             * @param useCache indicate whether to cache the response of the request into local memory
             */
            upload: function upload(method, baseUrl, callback, params, data, config, override, webSrvParams, useCache) {

                if (this.isTask) {
                    params = mstrmojo.addCSRFTokenToTaskParams(params);
                }

                // if there's already a request processing and we're not to preempt it then queue the new request
                if (this.requestCount > 0 && !override) {
                    this.queue.push({
                        method: method,
                        baseUrl: baseUrl,
                        callback: callback,
                        params: params,
                        data: data,
                        config: config
                    });
                } else {
                    // either nothing is going on or we want to preempt any running/queued requests

                    // if there is a request in progress then kill it any empty the queue
                    if (this.requestCount > 0) {
                        this.cancel();
                    }

                    this.requestCount++;

                    var lu = null,
                        oriParams = null;
                    if (useCache) {
                        lu = this._searchForCacheRequest(params);
                        oriParams = mstrmojo.hash.copy(params); // because it may add some more parameters in later sendXHR method
                    }

                    if (lu) {
                        // If find the cache, directly call the success callback with cached response data
                        try {
                            if (callback.success) {
                                window.setTimeout(
                                    function () {
                                        callback.success(lu.res);
                                    },
                                    10
                                );
                                //callback.success(lu.res);
                            }
                        } catch (ex) {
                            mstrmojo.err(ex);
                            throw ex;
                        } finally {
                            if (callback.complete) {
                                callback.complete();
                            }
                            this.advanceQueue();
                        }
                    } else {
                        var xhr = this.xhr = createXhr();
                        var self = this;
                        // wrap the complete callback with our own that will advance the queue
                        callback = mstrmojo.func.wrapMethods(callback, {
                            complete: (function (ths) {
                                return function () {
                                    ths.advanceQueue.call(ths);
                                };
                            }(this)),
                            success: (function (ths) {
                                return function () {
                                    // Cache the request with parameters and response into the lookup
                                    if (useCache) {
                                        ths.lookup.push({
                                            params: oriParams,
                                            res: ths.response
                                        });
                                    }
                                };
                            }(this))
                        });

                        var handleProgress = function (event) {
                            callback.progress(event, config);
                        };

                        // TQMS 837861. by muli.
                        var url = baseUrl;
                        xhr.open('POST', url, false);

                        var formData = new FormData();
                        var a;
                        for (a in params) {
                            formData.append(a, params[a]);
                        }
                        if (data) { //YGUO TQMS-958717
                            if (params.fileName) {
                                formData.append('myFile', data, params.fileName); //YGUO TQMS-942690 For QE's concern, change the blob object's default name into the file's name, even though this does not affect the functionality at all.
                            } else {
                        formData.append('myFile', data);
                            }
                        }

                        // if the xhr supports it, hook up the progress callback if we have one
                        if (xhrSupportsProgress(xhr) && callback.progress) {
                            xhr.upload.onprogress = handleProgress;
                        }
                        xhr.onreadystatechange = (function (me, x, c, pr) {
                            return function () {
                                me.onreadystatechange(x, c, pr);
                            };
                        }(self, xhr, callback, {
                            method: method,
                            baseUrl: baseUrl,
                            callback: callback,
                            params: params
                        }));
                        xhr.send(formData);
                    }
                }
            },

            /**
             * Moves to the next request in the queue.
             *
             * @private
             */
            advanceQueue: function advanceQueue() {
                // nothing is processing right now
                this.requestCount--;
                if (this.queue.length === 0) {
                    this.requestCount = 0;
                    return;
                }
                var req = this.queue.shift();
                if (req.params.taskId === "importFile") {
                    this.upload(req.method, req.baseUrl, req.callback, req.params, req.data, req.config);
                } else {
                    this.request(req.method, req.baseUrl, req.callback, req.params, true);
                }
            },

            /**
             * Search from lookup table, see if there is a cahced request has the same parameters.
             * @param params
             * @private
             */
            _searchForCacheRequest: function _searchForCacheRequest(params) {
                var i;
                for (i in this.lookup) {
                    if (mstrmojo.hash.equals(params, this.lookup[i].params)) {
                        return this.lookup[i];
                    }
                }
                return null;
            }

        }
    );

    mstrmojo.xhr = new mstrmojo.QueuedXHR();

    /**
     * A Singleton class which is able to send HTTP requests to web server on the different domain.
     * The basic idea is dynamic script insertion. The content of the script is a piece of code that invokes
     * mstrmojo.jsonp.onsuccess or mstrmojo.jsonp.onfailure on the JSON data.
     *
     * Usage: Previously, we used ResourceFeedController as the solution for cross web server request. And we
     * did this by calling mstrmojo.xhr.request with the parameter "webSvrUrl" that indicates the remote web server url.
     * Now, we are trying to introduce JSONP without changing this interface. So in the mstrmojo.xhr.request, we
     * check the existence of "webSvrUrl", if presented, it will delegate to mstrmojo.jsonp.request method.
     *
     * TODO: We are not queueing the JSONP request now. Please be careful when dealing with multiple JSONP requests as it may cause racing conditions.
     */
    mstrmojo.jsonp = {
        jsc: new Date().getTime(),

        /**
         * The number of milliseconds to wait after the request is sent out.
         *
         * @type {int}
         */
        timeToWait: 20000,

        /**
         * <p>Send out a jsonp request</p>
         *
         * @param {string} url The target web server address
         * @param {Object} params A hash of parameter names/values
         * @param {Object} callback Object that contains three callback methods: success, failure, timeout(optional)
         */
        request: function (url, params, callback) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement,
                jsonp = 'jsonp' + (this.jsc++),
                script = document.createElement("script");

            params.jsonp = jsonp + "(@R@);"; //@R@ is the placeholder for the JSON object
            params.taskContentType = 'jsonp';
            params.taskEnv = 'jsonp';
            params.xts = new Date().getTime();

            //This function will be executed automatically when the script is loaded.
            window[jsonp] = function (response) {
                if (!response) { // request timeout
                    if (callback.timeout) {
                        callback.timeout();
                    }
                } else if (response.status === 200) { //request succeeded
                    callback.success(response.content);
                } else { //request failed
                    //As we reuse mstrmojo.xhr.request to send a JSONP request, we use getResponseHeader quite often
                    //in the xhr failure callback. It's better to have this method as well so that we don't need to
                    //change the existing app code.
                    var res = {
                        status: response.status,
                        getResponseHeader: function (name) {
                            switch (name) {
                            case 'X-MSTR-TaskFailureMsg':
                                return response.errorMsg;
                            case 'X-MSTR-TaskErrorCode':
                                return response.errorCode;
                            }
                        }
                    };
                    if (mstrApp.onSessionExpired && isSessionExpiredError(res)) {
                        if (callback.onSessionExpired) {
                            callback.onSessionExpired();
                        }else{
                        mstrApp.onSessionExpired();
                        }
                    } else {
                        callback.failure(res);
                    }
                }

                // Do some cleanup
                if (window[jsonp]) {
                    if (callback.complete) {
                        callback.complete();
                    }
                    //delete the global variable
                    window[jsonp] = undefined;
                    try {
                        delete window[jsonp];
                    } catch (e) {
                    }

                    //remove the script node
                    head.removeChild(script);
                }
            };

            head.insertBefore(script, head.firstChild);
            script.src = appendUrlParams("GET", url, params); // This will trigger a HTTP GET request to the target web server

            //If the script is not loaded or evaluated successfully, it will fail silently.
            //We need to handle this case by waiting for a reasonable amount of time(10s).
            setTimeout(function () {
                var fn = window[jsonp];
                if (fn) {
                    fn();
                }
            }, this.timeToWait);
        }
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.models.template.Header");

    /**
     * Represents the headers collection.
     *
     * @class
     */
    mstrmojo.models.template.Headers = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.models.template.Headers.prototype
         */
        {
            init: function init(props) {
                var isRow = this.isRow = props.isRow,
                    data = this.data = props.data,
                    gridTitles = data.gts,
                    gridHeaders = data.ghs,
                    headers = this.hs = isRow ? gridHeaders.rhs : gridHeaders.chs,
                    idx = this.i = props.i,
                    missingHeaders = 0,
                    j;

                this.titles = isRow ? gridTitles.row : gridTitles.col;
                this.headers = headers.items && headers.items[idx] && headers.items[idx].items;

                if (isRow && this.headers) {
                    missingHeaders = this.titles.length - this.headers.length;

                    if (missingHeaders) {

                        for (j = idx - 1; j >= 0; j--) {
                            var previousRowHeaders = headers.items[j].items,
                                headerDifference = previousRowHeaders.length - this.headers.length;
                            if (headerDifference > 0) {
                                this.headers = previousRowHeaders.slice(0, headerDifference).concat(this.headers);
                                if (this.titles.length === this.headers.length) {
                                    break;
                                }
                            }
                        }
                    }
                }

            },

            /**
             * @returns {number}
             */
            size: function size() {
                var h = this.headers;
                return (!h ? 0 : h.length);
            },

            /**
             * @param pos
             * @returns {mstrmojo.models.template.Header}
             */
            getHeader: function getHeader(pos) {
                var headers = this.headers,
                    header = headers && headers[pos];

                return header && new mstrmojo.models.template.Header({
                    h: header,
                    t: this.titles[this.isRow ? pos : this.i]
                });
            },

            getCSS: function getCSS(pos) {
                var h = this.headers;
                return h && this.data.css[h[pos].cni].n;
            },

            getHeaderCell: function (pos) {
                var h = this.headers;
                return h && h[pos];
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.dom");

	mstrmojo.fx = {enabled: true};
	
	var $DOM = mstrmojo.dom;	

	/**
	 * _Effect is an abstract base class for all visual effects.  It implements the machinery for a generic effect,
	 * but omits the "exec()" method which actually applies a change to the GUI.  That method is expected to be implemented
	 * by subclasses of _Effect.
     *
     * @class
	 */
	mstrmojo.fx._Effect = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.fx._Effect.prototype
         */
		{
			scriptClass: "mstrmojo.fx._Effect",
			
			/**
             * Length (in milliseconds) of the entire effect.
			 */
			duration: 500,
			
			/**
             * Length (in milliseconds) of pause in between steps of this effect's animation.
			 */
			interval: 50,
			
			/**
             * Optional delay (in milliseconds) before effect is started once play() is called.
			 */
			delay: null,
			
			/**
			 * The object to which this effect is applied.
			 */
			target: null,
			
			/**
			 * Optional getter function for "target" property.  If specified, called at start-time (before "preStart").
			 */
			getTarget: null,
			
			/**
			 * Optional handle to the widget whose DOM will be targeted. An alternative to using "target" or "getTarget".
			 * If those 2 properties are omitted and "widget" is provided, the target will be set to a slot in the widget.
			 */
			widget: null,
			
			/**
			 * If "widget" is provided, the name of the widget's slot which will be targeted ("domNode" by default).
			 */
			slot: null,
			
			/**
			 * Optional handler, called before effect is started. For customization.
			 */
			preStart: null,

			/**
			 * Optional handler, called before effect is started. For customization.
			 */
			postStart: null,

			/**
			 * Optional handler, called before effect is started. For customization.
			 */
			onCancel: null,

			/**
			 * Optional handler, called after effect is successfully completed. For customization.
			 */
			onEnd: null,

			/**
			 * If true and the effect is cancelled while playing, the start value of the effect
			 * will be reapplied to the target.
			 */
			revertOnCancel: true,
			
			/**
			 * This boolean gets set to true when play() is called, and to false when
			 * either pause() or cancel() are called, or when the animation's steps are completed.
			 */
			isPlaying: false,
			
			/**
			 * This boolean gets set to true after both (1) play() is called and (2) the start delay
			 * (if any) is over. Gets reset to false after effect ends or is cancelled.
			 */
			started: false,
			
			/**
             * @inheritDoc
			 */
            init: function init(props) {
				mstrmojo.hash.copy(props, this);
			},
									
			/**
			 * Plays this effect, beginning with the effect's delay (if any).
			 */
			play: function ply() {
				this.isPlaying = true;
				this.started = false;
				if (this.delay) {
					var me = this;
					this.delayTimer = window.setTimeout(
                        function () {
							me._start();
							me = null;
						},  
						this.delay
					);
				} else {
					this._start();
				}
			},
			/**
			 * Prevents the effect from continuing to play any further.
			 */
			pause: function pause() {
				if (this.delayTimer) {
					window.clearTimeout(this.delayTimer);
					delete this.delayTimer;
				}
				if (this.timer) {
					window.clearInterval(this.timer);
					delete this.timer;
				}
				this.isPlaying = false;
			},

			/**
			 * Prevents the effect from continuing to play, optionally re-applies the start value, and
			 * fires the onCancel callback, if any.
			 */
			cancel: function cnl() {
				this.pause();
				if (this.started) {
					if (this.revertOnCancel) {
						this.counter = 0;
						this.exec();
					}
					if (this.onCancel) {
						this.onCancel();
					}
					this.started = false;
				}
			},
						
			/**
			 * Kicks off the application of this effect, possibly after a delay.
			 */
			_start: function start() {
				this.started = true;

				// Call the target getter method, if given.
				this._doTarget();

				// Calculate the # of animation steps required.
				// If duration = 0, do animation in 1 step.
                this.steps = Math.max(Math.ceil(this.duration / this.interval), 1);
				
				// Validate the ease property; could be a Function or String.
				var ea = this.ease;
                if (typeof ea  === "string") {
					this.ease = mstrmojo.registry.ref(ea);
				}
				
				// Call any pre-start method from the animation's config.
                if (this._doPreStart() === false) {
				    this.started = false;
				    this.isPlaying = false;
				    return;
				}

				// Start the animation immediately.
				this.counter = 0;
				this.exec();
				this.counter++;

				// Call postStart, if any.
				this._doPostStart();
				
				// Do any steps remain?
				if (this.counter >= this.steps) {
					// No, cleanup.
					this._end();
				} else {
					// Yes, continue animation in a repeating interval.
					var me = this;
					if (this.timer) {
						window.clearInterval(this.timer);
					}
                    this.timer = window.setInterval(function fxIntvl() {
							    if (me) {
							        me.exec();
							        me.counter++;
							        if (me.counter >= me.steps) {
							            me._end();
							            me = null;
							        }
							    }
                    }, this.interval);
				}
			},

			/**
			 * The method which applies a single step of a given effect.  Intentionally omitted for this
			 * abstract base class; expected to be implemented by subclasses.
			 */			
			exec: null,
			
			/**
			 * Called internally for cleanup after an animation executes all of its steps.
			 */
            _end: function end() {
				// Clear the interval.
				this.pause();
				this.started = false;
				if (this.onEnd) {
					this.onEnd();
				}
			},

            _doTarget: function tgt() {
                // Do we have a target getter?
                if (this.getTarget) {
                    // Assume the getter will return a DOM node.
                    this.target = this.getTarget();
                } else if (this.widget) {
                    // If we have a widget, target the widget's given slot ("domNode", by default).
                    // Refresh this every time we start, because the slot pointer may have changed (e.g., after a re-render).
                    this.target = this.widget[this.slot || "domNode"];
                } else if (this.target) {
                    // If we do have a target, check if its a widget or DOM node.
                    var t = this.target;
                    if (t && this.slot && t.scriptClass) {
                        var node = t[this.slot];
                        if (node) {
                            this.widget = t;
                            this.target = node;
                        }
                    }
                }
				// Finally, if we don't have a target, just assume it is the domNode of our widget ancestor.
				// Typically, that would be our parent. However, if this effect is used as a child of a Parallel effect,
				// then our parent would be the Parallel effect.  So we want to walk our ancestors until we reach an
				// ancestor with a domNode.
				if (!this.target) {
					var w = this;
					while (w = w.parent) {	// Note: this is an assignment ("="), not a comparison ("==")!
                        if (!w || w.domNode) {
						  break;
                        }
					}
					if (w) {
						this.widget = w;
						this.target = w[this.slot || "domNode"];
					}
				}
			},

            _doPreStart: function pre() {
				if (this.preStart) {
					 return this.preStart();
				}
			},
            _doPostStart: function post() {
				if (this.postStart) {
					this.postStart();
				}
			}			
		}
	);		

	/**
	 * Utility function used by mstrmojo.fx.Parallel to call methods in all of its children.
	 */
	function _callChildren(me, fName) {
        var arr = me.children,
            len = (arr && arr.length) || 0,
            i;

        for (i = 0; i < len; i++) {
			arr[i][fName]();
		}
	}
	
	/**
	 * Parallel is essentially a list ("children") of effects which are all played simultaneously when Parallel is played.
	 * Each "child" effect supports its own individual properties, such as "duration", "delay", "preStart", "onEnd", etc.  
	 * Note that "duration" of the Parallel itself is ignored.
	 * Additionally, the Parallel itself supports a "delay" which is applied before any of the children are played.
     *
     * @class
     * @extends mstrmojo.fn._Effect
	 */
	mstrmojo.fx.Parallel = mstrmojo.declare(
        mstrmojo.fx._Effect,

        null,

        /**
         * @lends mstrmojo.fx.Parallel.prototype
         */
		{
			scriptClass: "mstrmojo.fx.Parallel",
			
            init: function init(props) {
				this._super(props);
				// Inspect our children.  If they are native javascript Objects, try replacing them
				// with newly instantiated javascript classes.
				var ch = this.children;
				mstrmojo.registry.refArray(ch);
				// Set the children's parent pointer.
                var len = (ch && ch.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
					ch[i].parent = this;
				}
			},
			
			/**
			 * Fires the preStart callback if any, triggers the playing of all the effects in its "children" 
			 * array, and then fires the postStart callback if any.  
			 */
			_start: function start() {
				this.started = true;

				if (this.preStart) {
					this.preStart();
				}

				_callChildren(this, "play");
				
				if (this.postStart) {
					this.postStart();
				}
			},

			/**
			 * Triggers the pause of all the effects in its "children" array.
			 */
			pause: function pause() {
				_callChildren(this, "pause");
			},

			/**
			 * Triggers the cancel of all the effects in its "children" array.
			 */
			cancel: function cnl() {
				_callChildren(this, "cancel");
			}
		}
	);
	
    /**
     * Animates a given property of a given target DOM Node.
     *
     * @class
     * @extends mstrmojo.fx._Effect
     */
    mstrmojo.fx.AnimateProp = mstrmojo.declare(
        mstrmojo.fx._Effect,

        null,

        /**
         * @lends mstrmojo.fs.AnimateProp.prototype
         */
		{
			scriptClass: "mstrmojo.fx.AnimateProp",
			
			/**
			 * Hashtable of style properties animated by this effect.
			 * Keyed by name of the property; value is an object with the following
			 * properties: {start: .., stop: .., suffix: .., ease: ..}.
			 */
			props: null,

			/**
			 * Extends the inherited method in order to validate "ease" property of each
			 * individual property to be animated.
			 */
			_start: function st() {
				// Validate the ease function for each given property. Could be a String that
				// needs to be eval'd into a function.  Do this before calling the inherited method,
				// because that method will perform the first animation step, which will need the ease function.
                var ps = this.props,
                    n;

                for (n in ps) {
					var p = ps[n],
						ea = p.ease;
                    if (typeof ea  === "string") {
					    p.ease = mstrmojo.registry.ref(ea, {dontInst: true});
					}
				}
				// Call the inherited method to truly start the animation.
				this._super();

			},
									
			exec: function exec() {
                var ps = this.props,
                    n;

                for (n in ps) {
                    var p = ps[n],
                        v = (p.ease || mstrmojo.ease.sin)(this.counter, p.start, p.stop - p.start, this.steps - 1);
                    if (p.fn) {
					    v = p.fn(v);
					}
                    if (p.suffix) {
					   v += p.suffix;
                    }
                    var o = p.isStyle === false ? this.target : this.target.style;
                    o[n] = v;
				}
			}
		}
	);
	
    /**
     * @class
     * @extends mstrmojo.fx._Effect
     */
	mstrmojo.fx.Typewriter = mstrmojo.declare(
        mstrmojo.fx._Effect,

        null,

        /**
         * @lends mstrmojo.fn.Typewriter.prototype
         */
		{
			scriptClass: "mstrmojo.fx.Typewriter",
			
			charGroupSize: 1,
			
			/**
			 * This property is used to set the effect's "stop" value if none is provided.
			 * The srcProp is the name of the targeted widget's property from which to read the typewriter text.
			 */
			srcProp: "text",
			
			/**
			 * Extends the inherited method in order to do some additional initialization, and to
			 * support the targetField property.
			 */
			_doPreStart: function () {
				// First call the inherited method to do standard setup.
				this._super();
				
				// Now validate the "stop" property. 
				this._dynStop = false;
				// If it's null, try setting it with the help of the srcProp.
				if (this.stop == null) {    // if null or undefined
					var sp = this.srcProp,
                        st;
					if (sp) {
						var w = this.widget || this.parent;
						st = w && w[sp];
						if ((st != null) && (typeof(st) !== 'string')) {  // if not null and not undefined
							st = String(st);
						}
					}
					this.stop = st;
					this._dynStop = true;
				}
				// If it's still null, use empty string.
				if (this.stop == null) {
					this.stop = "";
				}

				// Prepare the target's innerHTML.				
				var t = this.target,
					ttn = null,
					cgs = 1;

				if (t) {
					t.innerHTML = '';
					ttn = document.createTextNode('');
					t.appendChild(ttn);
                    cgs = Math.max(Math.floor(this.stop.length / this.steps), 1);
				}
				this.targetTextNode = ttn;
				this.charGroupSize = cgs;
			},
			
            exec: function () {
				var ttn = this.targetTextNode;
				if (!ttn) {
				    return;
			    }
				
				var v;
                if (this.counter >= this.steps - 1) {
					v = this.stop;
				} else if (this.counter === 0) {
					v = '';
				} else {
					v = this.stop.substring(0, this.charGroupSize * this.counter) + '_';
				}
				ttn.nodeValue = v;
			},
			
			_end: function end() {
				this._super();
				if (this._dynStop) {
					this.stop = null;
					delete this._dynStop;
				}
			},
			
			cancel: function cnl() {
				if (this._dynStop) {
					this.stop = null;
					delete this._dynStop;
				}
			}
		}
	);
	
	mstrmojo.requiresCls("mstrmojo.dom");
		
	/**
	 * Animates the opacity of a DOM node.  The target may be specified as either a sDOM node
     *
     * @class
     * @extends mstrmojo.fx._Effect
	 */
	mstrmojo.fx.Fade = mstrmojo.declare(
        mstrmojo.fx._Effect,

        null,

        /**
         * @lends mstrmojo.fx.Fade.prototype
         */
		{
			scriptClass: "mstrmojo.fx.Fade",
			
			/**
			 * "start" and "stop" define a range of values over which this effect will be applied.
			 */
			start: null,
			stop: null,
			
			/**
			 * Optional easing function used to compute in-between values for animation.
			 */
			ease: null,

			/**
			 * Optional suffix to be appended to property values applied by this effect.
			 */
			suffix: null,

			exec: function exec(v) {
				if (v == null) {    // if null or undefined
                    v = (this.ease || mstrmojo.ease.sin)(this.counter, this.start, this.stop - this.start, this.steps - 1);
				}
				if ($DOM.isIE && !$DOM.isWinPhone) {
					// TO DO: implement opacity via filter
                    this.target.style.filter = 'alpha(opacity=' + parseInt(v * 100, 10) + ')';
					
				} else {
					this.target.style.opacity = v;
				}
			}
		}
	);
	
	/**
	 * A subclass of Fade which fades opacity from 1 to 0, and (optionally) then sets the style.display of target.
     *
     * @class
     * @extends mstrmojo.fx.Fade
	 */
	mstrmojo.fx.FadeOut = mstrmojo.declare(
        mstrmojo.fx.Fade,

        null,

        /**
         * @lends mstrmojo.fx.FadeOut.prototype
         */
		{
			scriptClass: "mstrmojo.fx.FadeOut",
			
			start: 1,
			stop: 0,
			revertOnCancel: true,
			
			/**
			 * If not null, when the animation is completed the target's style.display will be set to "hidden";
			 * when it is cancelled, if revertOnCancel is true the target's style.display will be set to the cssDisplay value.
			 */
			cssDisplay: 'block',
			
			/**
			 * Extends the inherited method in order to implement the "cssDisplay" feature.
			 */
            _end: function end() {
				if (this.cssDisplay) {
					this.target.style.display = 'none';
					this.exec(this.start);
				}
				this._super();
			},
			
			/**
			 * Extends the inherited method in order to implement the "cssDisplay" feature.
			 */
			cancel: function cnl() {
				if (this.started && this.cssDisplay) {
					this.target.style.display = this.cssDisplay;
				}
				this._super();
			}
		}
	);

	/**
	 * A subclass of Fade which fades opacity from 1 to 0, and (optionally) then sets the style.display of target.
     *
     * @class
     * @extends mstrmojo.fx.Fade
	 */
	mstrmojo.fx.FadeIn = mstrmojo.declare(
        mstrmojo.fx.Fade,

        null,

        /**
         * @lends mstrmojo.fx.FadeIn.prototype
         */
		{
			scriptClass: "mstrmojo.fx.FadeIn",
			
			start: 0,
			stop: 1,
			revertOnCancel: true,
			
			/**
			 * If not null, when the animation is completed the target's style.display will be set to "hidden";
			 * when it is cancelled, if revertOnCancel is true the target's style.display will be set to the cssDisplay value.
			 */
			cssDisplay: 'block',
			
			/**
			 * Extends the inherited method in order to implement the "cssDisplay" feature.
			 */
            _doPostStart: function postS() {
				if (this.cssDisplay) {
					this.target.style.display = this.cssDisplay;
				}
				this._super();
			},
			
			/**
			 * Extends the inherited method in order to implement the "cssDisplay" feature.
			 */
            cancel: function () {
				if (this.started && this.revertOnCancel && this.cssDisplay) {
					this.target.style.display = 'none';
				}
				this._super();
			}
		}
	);

	function fraction(num, dem, digits) {
		var x = Math.pow(10, digits || 2);
		if (dem) {
			return parseInt(x * num / dem, 10) / x;
        }

        return parseInt(x * num, 10) / x;
	}
	
	/**
	 * Collection of easing functions, ready to be used with mstrmojo.fx effects.
     *
     * @namespace mstrmojo.ease
	 */
	mstrmojo.ease = {
		linear: function ln(t, b, c, d) {
            if (t === d) {
                return b + c;
            }

            if (t === 0) {
				return b;
            }
				return b + c * fraction(t, d);
		},
		
		sin: function sin(t, b, c, d) {
			return b + c * Math.sin((Math.PI / 2) * t / d);
		},
		
		cos: function cos(t, b, c, d) {
			return b + c * Math.cos((Math.PI / 2) * (1 - t / d));
		},
		
		sincos: function sincos(t, b, c, d) {
			if (t > d / 2) {
				return b + c * Math.cos((Math.PI / 2) * (1 - t / d));
            }

            return b + c * Math.sin((Math.PI / 2) * t / d);
		},
		
		cossin: function cossin(t, b, c, d) {
			if (t > d / 2) {
				return b + c * Math.sin((Math.PI / 2) * t / d);
            }

            return b + c * Math.cos((Math.PI / 2) * (1 - t / d));
		},
		
		bounce: function bounce(t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
			      return c * (7.5625 * t * t) + b;
			}

            if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }

            if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }

            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		},
		
		shake: function shake(t, b, c, d) {
            if (t < d / 2) {
                return b + c * fraction(Math.sin(2 * Math.PI * t / 8), null, 2) * 2 * t / d;
            }
            return b + c * fraction(Math.sin(2 * Math.PI * t / 8), null, 2) * 2 * (1 - t / d);
//				return b + c * fraction(Math.sin(6 * Math.PI * t/d), null, 2) * 2 *(1-t/d);
			}
	};
}());

(function () {

    mstrmojo.requiresCls("mstrmojo.dom");

    var $DOM = mstrmojo.dom;

    //The mouse event type to attach to document.body to close popup
    var EVENT_TO_CLOSE = 'mousedown';

    function attachHotSlot(me) {
        // After rendering, attach event listeners for mouseover/out on the hotSlot.
        var el = me[me.hotSlot || "domNode"];
        if (el) {
            // Define and cache callbacks.
            if (!me._closeCallback) {
                var id = me.id,
                    fnCallback = function (mthName) {
                        return function (e) {
                            var p = mstrmojo.all[id];
                            if (p && !p.ignoreHover) {
                                p['auto' + mthName](e, self);
                            }
                        };
                    };

                // Minor/major cheat: Support for ignoreHover property from _CanLockHover mixin.
                // Ideally, this code shouldn't be aware of that property.
                me._uncloseCallback = fnCallback('Unclose');
                me._closeCallback = fnCallback('Close');
            }
            // Attach callbacks.
            $DOM.attachEvent(el, "mouseover", me._uncloseCallback);
            $DOM.attachEvent(el, "mouseout", me._closeCallback);
        }
    }

    function detachHotSlot(me) {
        if (me._closeCallback) {
            var el = me[me.hotSlot || "domNode"];
            if (el) {
                $DOM.detachEvent(el, "mouseover", me._uncloseCallback);
                $DOM.detachEvent(el, "mouseout", me._closeCallback);
            }
        }
    }

    function toggleLock(me, lock) {
        var w = me;
        while (w) {
            // If w is either a popup or an opener of popups...
            if (w.open || w.openPopup) {
                // Update its "ignoreHover" property.
                if (w.set) {
                    w.set("ignoreHover", lock);
                } else {
                    w.ignoreHover = lock;
                }
            }
            // Keep walking up the chain of ancestors and openers.
            w = w.opener || w.parent;

            // For the ancestor on the chain, we have this custom hook-up, which decide whether to keep on the hover lock change
            if (w && w.shouldPropagateLockHover && !w.shouldPropagateLockHover()) {
                break;
            }
        }
    }

    function clearLockHoverCallback() {
        var fn = this._lockHoverCallback;
        if (fn) {
            $DOM.detachEvent(document.body, EVENT_TO_CLOSE, fn, true);
            delete this._lockHoverCallback; // clear lock hover callback so that next time the mouse click event can be attached again
        }

    }

    /**
     * <p>A mixin for popups that enables the popup to close itself when the end-user moves the
     * the mouse away from the popups DOM.</p>
     *
     * <p>An optional delay can be specified between the mouseout and the call to close the popup.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._CanAutoClose = mstrmojo.provide(
        "mstrmojo._CanAutoClose",

        /**
         * @lends mstrmojo._CanAutoClose
         */
        {

            /**
             * <p>If true, this popup will automatically call its own close() when the end-user moves away
             * from its DOM.</p>
             *
             * <p>The specified DOM node can be specified by the "hotSlot" property.</p>
             *
             * @type {boolean}
             */
            autoCloses: false,

            /**
             * Delay (in milliseconds) before the popup closes itself after the mouse moves away.
             *
             * @type {int}
             */
            autoCloseDelay: 100,

            /**
             * If true, when this popup is opened it will tell its opener (and its opener's
             * openers chain) to ignore mouseovers, which otherwise might cause this popup to be auto-closed.
             *
             * @type {boolean}
             */
            locksHover: false,

            /**
             * Name of the slot which will trigger an auto-closes when the user moves away from it.
             * If null, "domNode" is assumed.
             *
             * @type {string}
             */
            hotSlot: null,

            /**
             * <p>If true, this popup will automatically call its own close() when the end-user clicks
             * on the curtainNode.</p>
             *
             * <p>The specified DOM node can be specified by the "curtainNode" property.</p>
             *
             * @type {boolean}
             */
            closeOnClick: false,

            /**
             * <p>Name of the slot which will trigger an auto-closes when the user moves away from it.
             * If null, "domNode" is assumed.</p>
             *
             * <p>This property will be converted to the actual DOM element.</p>
             *
             * @type {HTMLElement}
             */
            curtainNode: null,

            /**
             * @inheritDoc
             */
            postBuildRendering: function postBuildRendering() {
                this._super();

                // Can we auto close?
                if (this.autoCloses) {
                    // Attach to listen to hot slot.
                    attachHotSlot(this);
                }

                this.oncloseOnClickChange();

            },

            /**
             * Handler for "autoCloses" property; attaches or detaches event listeners to the DOM as needed.
             */
            onautoClosesChange: function onautoClosesChange() {
                var fn = (this.autoCloses) ? attachHotSlot : detachHotSlot;
                fn(this);
            },

            oncloseOnClickChange: function oncloseOnClickChange() {
                if (!this.curtainNode) {
                    return;
                }

                var me = this,
                    mthName = 'click',
                    isTouchApp = (mstrApp && mstrApp.isTouchApp && mstrApp.isTouchApp());

                if (isTouchApp) {
                    mthName = 'touchstart';
                }

                $DOM.attachEvent(me.curtainNode, mthName, function () {
                    me.close();
                    if (isTouchApp) {
                        mstrmojo.touchManager.notify([]);
                    }
                });
            },

            /**
             * Responds to a mouse over by aborting any prior timeout to close this popup.
             */
            autoUnclose: function autoUnclose() {
                var t = this._autoCloseTimer;
                if (t) {
                    self.clearTimeout(t);
                    delete this._autoCloseTimer;
                }
            },

            /**
             * <p>Responds to a mouseout by starting a timeout to close this popup.</p>
             *
             * <p>The timeout delay length is determined by the "autoCloseDelay" property; if zero, no timeout is used
             * and the closing is done immediately.</p>
             */
            autoClose: function autoClose() {
                if (this.ignoreHover) {
                    return;
                }

                // Stop any prior timeout to close the popup.
                if (this._autoCloseTimer) {
                    self.clearTimeout(this._autoCloseTimer);
                }

                if (this.opener) {
                    if (this.autoCloseDelay) {
                        // If we have a delay, start a timeout.
                        var xid = this.opener.id;
                        this._autoCloseTimer = self.setTimeout(function () {
                            mstrmojo.all[xid].closePopup();
                        }, this.autoCloseDelay);
                    } else {
                        // We have no delay, close immediately.
                        this.opener.closePopup();
                    }
                }
            },

            /**
             * Detaches DOM events.
             *
             * @inheritDoc
             */
            destroy: function destroy(ignoreDom) {
                clearLockHoverCallback.call(this);

                this._super(ignoreDom);
            },

            /**
             * Notifies the popup and its opener to ignore mouse over events, and attaches a listener for mouse down
             * anywhere in the document body.
             */
            lockHover: function lockHover() {
                toggleLock(this, true);

                if (!this._lockHoverCallback) {
                    var id = this.id,
                        fn = this._lockHoverCallback = function (evt) {
                            mstrmojo.all[id]._unlockHoverCheck(evt, self);
                        };

                    // Minor hack: We want to listen for mousedown events, but NOT including the mousedown event
                    // that caused this method to be called (if any). So we record the time for future reference.
                    //this._lastAttach = new Date();

                    //But the above method comparing time-difference will fail with large amount of data in the popup.
                    //Instead we set a flag to ignore the first mousedown bubbled to document.body

                    //#768117,768122 - these scenarios use 'click' to open popup so that '_ignoreMousedown' flag wont be cleared
                    //as expected by document.body.onmousedown handler right after popup is open.
                    //To avoid this, we do two things
                    // 1- IE7 and IE8: check 'window.event' type, if it is 'mousedown' event then set up flag '_ignoreMousedown'
                    // 2- Other browsers - they support 'capture' mouse event so we attach to 'capture' phase thus document.body.onmousedown
                    //    will be invoked to close last opened popup before opening new popup, and avoid accidentally closing the to-be-opened one.
                    if (($DOM.isIE7 || $DOM.isIE8) && window.event && (window.event.type === EVENT_TO_CLOSE) && this.opener) {
                        //This flag will be cleared immediately by the mousedown handler attached below
                        this.opener._ignoreMousedown = true;
                    }

                    //IE7/8 - this handler will be fired right after attached to clear the above set flag '_ignoreMousedown'
                    $DOM.attachEvent(document.body, EVENT_TO_CLOSE, fn, true);
                }
            },

            /**
             * Notifies the popup and its opener to stop ignoring mouseovers, and detaches mousedown listener.
             */
            unlockHover: function unlockHover() {
                toggleLock(this, false);

                clearLockHoverCallback.call(this);
            },

            /**
             * The callback for the document.body.mousedown event.  If the event occurs outside this popups domNode,
             * the popup closes itself.
             *
             * @param {Event} e The DOM event associated with the mouseover.
             * @param {Window} hWin The current window object.
             */
            _unlockHoverCheck: function _unlockHoverCheck(e, hWin) {
                // Minor hack: Ignore the mousedown if it's the same mousedown which caused lockHover to be
                // called in the first place.
                var opener = this.opener;
                if (opener && opener._ignoreMousedown) {
                    delete opener._ignoreMousedown;
                    return;
                }

                var target = $DOM.eventTarget(hWin, e);
                if (!$DOM.contains(this.domNode, target, true, document.body)) {
                    // Find if the widget that the target node belongs to is a child of this widget.
                    // For the cases that the clicked widget is a part/popup of this widget, but the node is not hosted within this widget's domNode.
                    // E.g. Click on a popup that is open from this widget but not hosted within.
                    var widget = $DOM.findWidget(target);

                    // Iterate ancestors.
                    while (widget) {
                        // Does this ancestor is this widget itself?
                        if (widget === this) {
                            return;
                        }

                        // Get next ancestor.
                        widget = widget.parent || widget.opener;
                    }

                    // Custom hook to notify the opener that the popup is auto closed.
                    var canAutoClose;
                    if (opener && opener.onPopupAutoClosed) {
                        canAutoClose = opener.onPopupAutoClosed(e, hWin);
                    }

                    // Does the opener explicitly not want to auto-close the popup it opened ?
                    if (canAutoClose !== false) {
                        // NO? Default behavior is to auto-close.
                        this.close();
                    }
                }
            },

            /**
             * <p>Undoes any lingering auto close and (possibly) locks the hover handling.</p>
             *
             * @inheritDoc
             */
            open: function open(opener, config) {
                // Stop any prior timeout to close the popup.
                if (this.autoCloses) {
                    this.autoUnclose();
                }

                this._super(opener, config);

                // Do the lock hover AFTER the inherited method has set our opener property.
                if (this.locksHover) {
                    this.lockHover();
                }
            },

            /**
             * @inheritDoc
             */
            close: function close(cfg) {
                // Do the unlock hover BEFORE the inherited method has cleared our opener property.
                if (this.locksHover) {
                    this.unlockHover();
                }
                this._super(cfg);
            },

            /**
             * When triggered the lock hover, by default, it will change all its ancestor.
             * This function can be customized in the extended widget, to stop the propagation.
             *
             * @returns {boolean}
             */
            shouldPropagateLockHover: function shouldPropagateLockHover() {
                return true;
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.dom");

    var $DOM = mstrmojo.dom,
        TOOLTIP_CLOSE_DELAY = 100;

    /**
     * Returns a function for handling mousemove or mouseover for the tooltip node.
     *
     * @param {string} id The widget ID.
     * @param {boolean} isDynamic Whether the tooltip show be attached to mousemove or mouseover.
     *
     * @returns {function(e:Event)}
     */
    function getTooltipHandler(id, isDynamic) {
        return function (e) {
            // Show (or hide) the tooltip.
            mstrmojo.all[id][(isDynamic ? 'move' : 'show') + 'Tooltip'](e, self);
        };
    }

    function attachTooltipEvents() {
        var node = this.tooltipNode || this.domNode,
            id = this.id,
            i,
            funcName = "_ontooltip" + (this.isDynamicTooltip ? "move" : "over");

        if (!this._ontooltipout) {
            this._ontooltipout = function (e) {
                mstrmojo.all[id].hideTooltip(e, self);
            };
        }
        if (!this[funcName]) { //mizhang. If and only if _ontooltipover is null, set default tooltip handler.
            this[funcName] = getTooltipHandler(id, this.isDynamicTooltip);
        }

        // Make sure node is an array.
        node = [].concat(node);

        // Iterate nodes.
        for (i = 0; i < node.length; i++) {
            // Make sure there is not a native tooltip.
            node[i].removeAttribute('title');

            // Attach event listeners.
            $DOM.attachEvent(node[i], (this.isDynamicTooltip ? "mousemove" : "mouseover"), this[funcName]);
            $DOM.attachEvent(node[i], 'mouseout', this._ontooltipout);
        }
    }

    /**
     * Mixin to provide rich tooltip functionality.
     *
     * @mixin
     * @public
     */
    mstrmojo._HasTooltip = mstrmojo.provide(
        'mstrmojo._HasTooltip',

        /**
         * @lends mstrmojo._HasTooltip
         */
        {

            /**
             * <p>The tooltip for this widget.</p>
             *
             * @type {string}
             */
            tooltip: '',

            /**
             * <p>The rich tooltip for this widget. </p>
             *
             * <p>It can be a string or a JSON object. If it is a JSON object, it can include the following information:</p>
             *
             *     <ul>
             *         <li>areaId - anything that uniquely identifies an area in the widget, like item index, slot name, DOM node, ...
             *         Moving to another area will incur a tooltip open delay.
             *         Areas are useful for lists and other widgets that display different tooltips for different visual areas.
             *         By default, the whole widget is a single area with areaId = undefined.</li>
             *         <li>content - the content to put into the rich tooltip. It can be HTML code.</li>
             *         <li>cssClass - the css class to be used for the tooltip</li>
             *         <li>top/left - the position of the tooltip </li>
             *         <li>keepArrowXPos/keepArrowYPos - under which axis we should keep the arrow if it has one when tooltip reposition happens.</li>
             *     </ul>
             *
             * <p>If it is a string, then the string will be used as content, and rich tooltip will use its default implementation
             * for positioning and css class.</p>
             *
             * @type {string|{areaId:String, content:String, cssClass: String, top: String, left: String, keepArrowXPos: String, keepArrowYPos: String}}
             */
            richTooltip: null,

            /**
             * <p>The flag to control whether to use the rich tooltip.</p>
             *
             * When this flag is set to true, then rich tooltip will be used.
             * If richTooltip is defined, then it will be used. If richTooltip is not defined, then tooltip will be used.
             *
             * @type {boolean}
             */
            useRichTooltip: false,

            /**
             * <p>Should we invoke showTooltip based on mouse position</p>
             * @type {boolean}
             */
            isDynamicTooltip: false,

            /**
             * The node which will listen to mouse over/out event for rich tooltip feature. If this node is null, then the domNode will be used.
             *
             * @type {HTMLElement}
             */
            tooltipNode: null,

            /**
             * How long we need to wait to see the tooltip since last mousemove. The delay will not be applied if there is already a open tooltip for the widget.
             */
            tooltipOpenDelay: 700,

            /**
             * Whether the widget has a tooltip open right now.
             *
             * @type {boolean}
             */
            hasOpenTooltip: false,

            postBuildRendering: function () {
                var ret = this._super();

                // Do we have a rich tooltip?
                if (this.useRichTooltip) {
                    attachTooltipEvents.call(this);
                }

                return ret;
            },

            /**
             * Toggle useRichTooltip property on the fly by attaching and detaching corresponding event listeners.
             * TQMS 937143
             */
            onuseRichTooltipChange: function onuseRichTooltipChange() {
                if (this.hasRendered) {
                    var node = this.tooltipNode || this.domNode,
                        i;

                    // Do we have a rich tooltip?
                    if (this.useRichTooltip) {
                        attachTooltipEvents.call(this);
                        //@TODO  we should consider invoke showTooltip based on mouse position
                    } else {
                        // Detach events
                        if (this._ontooltipout) {
                            if (node && node.constructor !== Array) {
                                node = [node];
                            }
                            //@TODO   Theoretically we should reset back the "title" attribute based on the value of the tooltip, but that could cause problems on UI that absolutely don't use regular tooltips
                            for (i = 0; i < node.length; i++) {
                                // Attach event listeners.
                                $DOM.detachEvent(node[i], this.isDynamicTooltip ? 'mousemove' : 'mouseover', this["_ontooltip" + (this.isDynamicTooltip ? "move" : "over")]);
                                $DOM.detachEvent(node[i], 'mouseout', this._ontooltipout);
                            }
                        }
                        this.hideTooltip();
                    }
                }
            },

            /**
             * <p>Shows the tooltip.</p>
             *
             * @param {Event} e
             * @param {window} win
             */
            showTooltip: function showTooltip(e, win) {
                var $this = this;
                // Is the tooltip NOT already open or is the app not interactive?
                if (!$this.hasOpenTooltip && (!mstrApp.isInteractive || mstrApp.isInteractive && mstrApp.isInteractive())) {
                    mstrmojo.requiresCls("mstrmojo.tooltip");
                    if (this.updateTooltipConfig) {
                        this.updateTooltipConfig(e);
                    }

                    window.clearTimeout(this._tooltipTimeOut);

                    /*
                    It looks that for IE the event object is not passed when the thread is lost (setTimeout) so
                    a copy of the event has to be made. TQMS:838277
                    http://stackoverflow.com/questions/3531751/member-not-found-ie-error-ie-6-7-8-9
                     */
                    if(mstrmojo.dom.isIE){
                        var eventCopy = {};
                        for (var i in e) {
                            eventCopy[i] = e[i];
                        }
                        e = eventCopy;
                    }

                    // Add a lag when hovering an inactive area. Use a time out to show tooltip.
                    // When we open a tooltip on an area, the area becomes active. It keeps active until we leave the area for a certain duration.
                    var newAreaId = this.richTooltip ? this.richTooltip.areaId : undefined;

                    this._tooltipTimeOut = window.setTimeout(function () {
                        if ($this._closeTooltipTimeout) {
                            window.clearTimeout($this._closeTooltipTimeout);
                            delete $this._closeTooltipTimeout;
                        }

                        mstrmojo.tooltip.open($this, e, win);


                        $this.tooltip.onmouseover = function () {
                            if ($this.richTooltip && $this.richTooltip.enableHover) {
                                window.clearTimeout($this._closeTooltipTimeout);
                                window.clearTimeout($this._deactivationTimeout);

                                if ($this.tooltip) {
                                    $this.tooltip.onmouseout = function (evt) {
                                        if (!$DOM.contains(this.domNode, evt.e.toElement || evt.e.relatedTarget)) {
                                            $this.hideTooltip();
                                        }
                                    };
                                }
                            }
                        };

                        $this.hasOpenTooltip = true;
                        $this._hasActiveArea = true;
                        $this._tooltipAreaId = newAreaId;

                        window.clearTimeout($this._deactivationTimeout);
                        delete $this._deactivationTimeout;

                    }, (this._hasActiveArea && newAreaId && newAreaId === this._tooltipAreaId) ? 0 : this.tooltipOpenDelay); // TQMS961158: Don't delay if newAreaId is not set by default.
                }
            },

            /**
             * <p>If tooltip is invoked based on mouse position, call this function</p>
             *
             * @param evt
             * @param win
             */
            moveTooltip: function moveTooltip(evt, win) {
                // if the mouse is moving, the tooltip should not be shown.
                if (this._tooltipTimeOut) {
                    window.clearTimeout(this._tooltipTimeOut);
                    this._tooltipTimeOut = null;
                    mstrmojo.tooltip.close();
                }

                var _this = this,
                    _evt = evt,
                    _win = win;

                this._tooltipTimeOut =  setTimeout(function () {
                    mstrmojo.tooltip.open(_this, _evt, _win);
                }, this.tooltipOpenDelay);
            },

            /**
             * <p>Hides the tooltip.</p>
             */
            hideTooltip: function hideTooltip() {
                var $this = this;

                // Don't show tooltip if the mouse has moved out from button but the time out is still not triggered.
                window.clearTimeout(this._tooltipTimeOut);

                if (this._closeTooltipTimeout) {
                    window.clearTimeout(this._closeTooltipTimeout);
                }

                // If the mouse has been out of the active area for more than a duration, clear the active area.
                if (this._hasActiveArea && !this._deactivationTimeout) {
                    this._deactivationTimeout = window.setTimeout(function () {
                        delete $this._deactivationTimeout;

                        delete $this._hasActiveArea;
                        delete $this._tooltipAreaId;
                    }, 100);
                }

                mstrmojo.requiresCls("mstrmojo.tooltip");
                if ($this.richTooltip && $this.richTooltip.enableHover) {
                    this._closeTooltipTimeout = window.setTimeout(function () {
                        mstrmojo.tooltip.close();

                        delete $this._closeTooltipTimeout;
                    }, TOOLTIP_CLOSE_DELAY);
                } else {
                    mstrmojo.tooltip.close();
                }
                this.hasOpenTooltip = false;
            },

            unrender: function unrender(ignoreDom) {
                var node = this.tooltipNode || this.domNode,
                    i;

                if (node && node.constructor !== Array) {
                    node = [node];
                }

                if (node) {
                    var over = this._ontooltipover,
                        out = this._ontooltipout,
                        move = this._ontooltipmove;

                    for (i = 0; i < node.length; i++) {
                        // Do we have a mouse over handler?
                        if (over) {
                            // Detach it.
                            $DOM.detachEvent(node[i], 'mouseover', over);
                        }

                        // Do we have a mouse out handler?
                        if (out) {
                            // Detach it.
                            $DOM.detachEvent(node[i], 'mouseout', out);
                        }

                        if (move) {
                            $DOM.detachEvent(node[i], 'mousemove', move);
                        }
                    }
                }

                this._super(ignoreDom);
            }
        }
    );
}());
(function () {
    mstrmojo.requiresCls("mstrmojo.hash");

    var reCHAIN_THIS = /this\.([\w\.\[\]\'\"\-]+)/m,
        reCHAIN_THIS_TEST = /this\./m,
        reCHAIN_ALL_BRACKET = /mstrmojo\.all\[[\'\"]([\w]+)[\'\"]\]\.([\w\.\[\]\'\"\-]+)/m,
        reCHAIN_ALL_BRACKET_TEST = /mstrmojo\.all\[/m,
        reCHAIN_ALL_DOT = /mstrmojo\.all\.([\w]+)\.([\w\.\[\]\'\"\-]+)/m,
        reCHAIN_ALL_DOT_TEST = /mstrmojo\.all\./m,
        reCvtIdxs = /\[(\d+)\]/g,
        reCvtSingleQts = /\[\'([\w\-]+)\'\]/g,
        reCvtDblQts = /\[\"([\w\-]+)\"\]/g,
        reTruncBrkts = /([\[\]].*)/;

    /**
     * @class
     */
    mstrmojo.Binding = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.Binding.prototype
         */
        {
            scriptClass: "mstrmojo.Binding",

            /**
             * Reference to the context object whose property is the destination of this Binding.
             */
            parent: null,

            /**
             * String|Function. Javascript to be evaluated to determine a value for this Binding's destination.
             * The script will be evaluated in the context of the Binding's parent.
             */
            source: null,

            /**
             * String. Name of the property whose value will be determined by this Binding.
             */
            destination: null,

            /**
             * Records whether or not the binding is attached.
             */
            enabled: false,

            /**
             * Optional config for a setter function to set the destination's value. If null, no setter is used; the
             * destination is set directly (e.g., parent[destination] = value). If String, specifies the name of a method
             * of the parent object, which will serve as the setter. If Function, specifies a setter function which will be
             * applied in the parent's context to set the destination.
             */
            setter: "set",

            /**
             * <p>Indicates whether or not this binding is currently updating the bound destination.</p>
             *
             * <p>This flag is set to a positive integer while this binding is executing; otherwise it is zero.
             * The specific number is the total count
             * of calls to this.exec() which are currently executing; this count can be > 1 if the binding is designed to
             * cause its own trigger, either directly or indirectly, in a cyclical manner.</p>
             * @type Integer
             */
            executing: 0,

            init: function init(/*Object?*/ props) {
                // Apply the given properties to this instance.
                mstrmojo.hash.copy(props, this);

                // Then add ourselves to the registry, so we can be called back by events later.
                mstrmojo.registry.add(this);
            },

            destroy: function dest() {
                // Remove any event communication involving this object (faster than calling disable).
                mstrmojo.publisher.clearSubscriptions(this.id);
                // Remove ourselves from registry.
                mstrmojo.registry.remove(this);
            },

            /**
             * Executes the source script and stores the resulting value in the destination.
             */
            exec: function exec() {
                this.executing++;
                // Retrieve the source script as a Function object (cache it for later re-use).
                var fn = this._sourceFn;
                if (!fn) {
                    var s = this.source;
                    if (s != null) {
                        if (typeof(s) == "string") {
                            // TO DO: add a "return " at the beginning of the string if all conditions are met:
                            // [1] it has no "return ", and
                            // [2] if there is a semicolon, it is not followed by any chars except possibly blankspace chars.
                            if (!(s.match("return ")) && !(s.match(/\;\s*\S/))) {
                                s = "return " + s;
                            }
                            fn = new Function(s);
                        } else if (typeof(s) == "function") {
                            fn = s;
                        }
                        this._sourceFn = fn;
                    }
                }

                // If we have a source script Function, call it to calculate a value.
                var v, p = this.parent;
                if (fn) {
                    try {
                        v = fn.apply(p, []);
                    } catch (ex) {
                        // Bad binding script. Result value will be undefined.
                    }
                }

                // Update the destination with the new value.
                var st = this.setter,
                    d = this.destination;
                if (st == null) {
                    p[d] = v;
                } else if (typeof(st) == "string") {
                    p[st](d, v);
                } else if (typeof(st) == "function") {
                    st.apply(p, [d, v]);
                }
                this.executing--;
            },

            /**
             * Starts up the binding by executing the source script, updating the destination's value,
             * and attach event listeners for changes in the source's result value.
             */
            enable: function en() {
                if (!this.enabled) {
                    // Update the destination's value.
                    this.exec();
                    // Parse the source script, if we haven't already.
                    var chs = this._chains;
                    if (!chs) {
                        this._parseChains();
                        chs = this._chains;
                    }
                    // Attach event listeners to expressions within the source script.
                    for (var k in chs) {
                        this._attachChain(chs[k]);
                    }
                    this.enabled = true;
                }
            },

            /**
             * Stops the binding by detaching event listeners for changes in the source's result value.
             */
            disable: function dis() {
                if (this.enabled) {
                    // Detach event listeners, if any.
                    var chs = this._chains;
                    if (chs) {
                        for (var k in chs) {
                            this._detachChain(chs[k]);
                        }
                    }
                    this.enabled = false;
                }
            },

            /**
             * Internal cache of results from parsing the source script.
             */
            _chains: null,

            /**
             * Parses the source script, searching for "chains" of objects that we should attach event listeners to.
             * Examples of a chain:  "this.foo.bar", "mstrmojo.all['foo'].bar.get(..)".
             */
            _parseChains: function () {
                // Init cache.
                this._chains = {};
                var chains = this._chains;

                // Fetch source script as a string.
                var s = this.source;
                if (s && (typeof(s) == "function")) {
                    s = s.toString && s.toString();
                }
                if (!s) {
                    return;
                }

                // Helper method for using regular expression to find matches and storing results in cache.
                function _findMatches(/*String*/ str, /*RegExp*/ re, /*Integer*/ hostIdx, /*Integer*/ partsIdx) {
                    var sTemp = str,
                        match;

                    while (match = sTemp.match(re)) {    // Note: this is an assignment ("=") and null-check, NOT an equals test ("==")
                        // Found a match.
                        var key = match[0],
                            len = key.length,
                            add = true;

                        // Replace "[##]" with ".#", ['XX'] with .XX, ["XX"] with .XX
                        // Then truncate any remaining bracketed substring.
                        key = key.replace(reCvtIdxs, ".$1"
                            ).replace(reCvtSingleQts, ".$1"
                            ).replace(reCvtDblQts, ".$1"
                            ).replace(reTruncBrkts, '');

                        // Is this match redundant?
                        for (var k in chains) {
                            if (k.substr(0, len) === key) {
                                // The match is a subset of a previous match; skip it.
                                add = false;
                                break;
                            } else if (key.indexOf(k) === 0) {
                                // The match is a superset of a previous match; drop the previous match.
                                delete chains[k];
                            }
                        }
                        if (add) {
                            chains[key] = {
                                host: (hostIdx == null) ? null : match[hostIdx],
                                parts: match[partsIdx].replace(reCvtIdxs, ".$1"
                                    ).replace(reCvtSingleQts, ".$1"
                                    ).replace(reCvtDblQts, ".$1"
                                    ).replace(reTruncBrkts, '').split('.')
                            };
                        }
                        sTemp = sTemp.substr(match.index + len);
                    }
                }

                /*
                 We only recognize chains with specific syntax:
                 a) "this.<parts>"
                 where <parts> has only periods and word chars (alphanumerics+underscore). So, not allowed: "(" ,")",":", commas, blanks, etc.
                 Note: We don't check for double-periods ("this.foo..bar"), but of course that will result in a run-time err when exec() is called anyway.
                 Note: We DO allow <parts> to have square brackets ONLY like this "[##]", to support arrays, or like this ['..'] and [".."] to support hyphenated property names.
                 */
                if (reCHAIN_THIS_TEST.test(s)) {
                    _findMatches(s, reCHAIN_THIS, null, 1);
                }

                /*
                 Or in the following syntax:
                 b) "mstrmojo.all['<host>'].<parts>", or
                 c) "mstrmojo.all["<host>"].<parts>"
                 where <host> has only word chars (alphanumerics+underscore).
                 */
                if (reCHAIN_ALL_BRACKET_TEST.test(s)) {
                    _findMatches(s, reCHAIN_ALL_BRACKET, 1, 2);
                }
                /* Or in the following syntax:
                 d) "mstrmojo.all.<host>.<parts>"
                 where <host> has only word chars.
                 */
                if (reCHAIN_ALL_DOT_TEST.test(s)) {
                    _findMatches(s, reCHAIN_ALL_DOT, 1, 2);
                }
            },

            /**
             * Attaches event listeners to the objects along a given "chain".  The "chain" is an object in this._chains
             * hashtable, which was generated by _parseChains. Optional start index can be given; if missing, 0 is assumed.
             */
            _attachChain: function attCh(/*Object*/ ch, /*Integer?*/ start) {

                // Init lookups, if needed.
                if (!ch.evt2idx) {
                    ch.evt2idx = {};
                }
                if (!ch.idx2evt) {
                    ch.idx2evt = [];
                }
                var evt2idx = ch.evt2idx,
                    idx2evt = ch.idx2evt,
                    parts = ch.parts;

                // Init starting index, context and property.
                var idx = (start >= 0) ? start : 0,
                    bId = this.id,
                    reg = mstrmojo.all,
                    ctxt = (start > 0) ?
                        reg[idx2evt[idx - 1].context][parts[idx - 1]] :
                        (ch.host ? reg[ch.host] : this.parent),
                    prop = parts[idx];

                // Walk the chain...
                var A = mstrmojo.array;
                while (ctxt && prop) {
                    if (ctxt.attachEventListener) {
                        // What events should we listen for?
                        var evts = ctxt[prop + "_bindEvents"] || (prop + "Change");
                        if (typeof(evts) == "string") {
                            evts = [evts];
                        }
                        var subs = [];
                        for (var i = 0, iLen = evts.length; i < iLen; i++) {
                            subs[i] = ctxt.attachEventListener(evts[i], bId, "_callback");
                        }

                        // Update the map from event to index.
                        for (var i = 0; i < evts.length; i++) {
                            evt2idx[ ctxt.id + "_" + evts[i] ] = idx;
                        }

                        // Update the map from index to event.
                        idx2evt[idx] = {context: ctxt.id, evts: evts, subs: subs};
                    }
                    // Continue to the next item on the chain...
                    ctxt = ctxt[prop];
                    prop = ch.parts[++idx];
                }
            },

            /**
             * Detaches event listeners from the objects along a given "chain".  The "chain" is an object in this._chains
             * hashtable, which was generated by _parseChains. Optional start index can be given; if missing, 0 is assumed.
             */
            _detachChain: function detCh(/*Object*/ ch, /*Integer?*/ start) {

                var reg = mstrmojo.all,
                    idx2evt = ch.idx2evt,
                    evt2idx = ch.evt2idx,
                    bId = this.id;

                var i = (start > -1) ? start : 0,
                    len = idx2evt.length;
                if (i < len) {
                    for (; i < len; i++) {

                        var atts = idx2evt[i];
                        if (!atts) {
                            break;
                        }
                        var ctxtid = atts.context,
                            ctxt = reg[ctxtid],
                            evts = atts.evts;

                        // Stop listening for events in this outdated context.
                        if (ctxt && ctxt.detachEventListener) {
                            var s = atts.subs;
                            for (var t = 0, tLen = s.length; t < tLen; t++) {
                                ctxt.detachEventListener(s[t]);
                            }
                        }
                        // Update the map from index to event.
                        idx2evt[i] = null;
                        // Update the map from event to index.
                        for (var j = 0, jLen = evts.length; j < jLen; j++) {
                            delete evt2idx[ctxtid + "_" + evts[j]];
                        }
                    }
                }
            },

            /**
             * Notifies the Binding that the destination's value needs to be refreshed.  Also responsible for determining
             * whether or not event listeners need to be detached and re-attached.
             */
            _callback: function clbk(/*Event*/ evt) {

                // Update the destination's value.
                this.exec();

                /*
                 // For debugging only:
                 var n = evt && evt.name,
                 cbs = window.cbs;
                 if (!cbs) cbs = window.cbs = {};

                 if (cbs[n]) {
                 cbs[n]++;
                 } else {
                 cbs[n] = 1;
                 }
                 */

                if (!evt || !evt.name || !evt.src) {
                    return;
                }

                // Do we have any chains that require updating when this event is heard?
                var k = evt.src.id + "_" + evt.name,
                    chains = this._chains;
                // For each chain...
                for (var c in chains) {
                    // Does this event.src+evt.name combination map to an index in this chain?
                    var ch = chains[c],
                        idx = ch.evt2idx[k];
                    if (idx != null) {
                        // Yes, this chain needs to be detached & re-attached.
                        this._detachChain(ch, idx + 1);
                        this._attachChain(ch, idx + 1);
                    }
                }

            }

        }
    );

})();
(function () {

    mstrmojo.requiresCls("mstrmojo.array",
                         "mstrmojo.hash");

    var $ARR = mstrmojo.array,
        $HASH = mstrmojo.hash;

    /**
     * Makes sure that supplied items are NOT null and within an array.
     *
     * @param {*|Array} items The items collection to test.
     *
     * @returns {Array|null}
     */
    function verifyArray(items) {
        if (items !== null) {
            return (items.constructor !== Array) ? [ items ] : items;
        }

        return null;
    }

    /**
     * Adds the given indices to the selectedIndices of the given widget.  Raises no events. Returns an array of the
     * indices that were actually added (possibly empty).
     *
     * @param {mstrmojo._ListSelections} me
     * @param {int[]} idxs An array of selection indicies.
     */
    function addSelections(me, idxs) {

        // do we have any indexes to add?
        if (!idxs) {
            return null;
        }

        var added = [],
            sel = me.selectedIndices,
            allIdx = me.allIdx,
            noneIdx = me.noneIdx;

        // if we selecting nothing
        if (me.multiSelect && (noneIdx > -1) && ($ARR.indexOf(idxs, noneIdx) > -1)) {
            return added;
        }

        // add ALL
        var i, len,
            items = me.items,
            idf = me.itemIdField,
            selectedItems = me.selectedItems,
            item;

        //If we selecting all
        if (me.multiSelect && (allIdx > -1) && ($ARR.indexOf(idxs, me.allIdx) > -1)) {
            for (i = 0, len = items.length; i < len; i++) {
                if (!sel[i]) {
                    added.push(i);
                    sel[i] = true;
                    me.selectedIndex = i;
                    me.selectedItem = items[i];
                }
            }

        } else {
            for (i = 0, len = idxs.length; i < len; i++) {
                var idx = idxs[i];
                if (!sel[idx]) {
                    sel[idx] = true;
                    added.push(idx);
                    me.selectedIndex = idx;
                    item = me.selectedItem = items[idx];
                    if (selectedItems) {
                        selectedItems[item[idf]] = item;
                    }
                }
            }
        }

        return added;
    }

    /**
     * Removes all selectedIndices from given widget.  Raises no events. Returns an array of the
     * indices that were actually removed (possibly empty).
     *
     * @param {mstrmojo._ListSelections} me
     */
    function removeAll(me) {
        var rmv = [],
            sel = me.selectedIndices,
            selectedItems = me.selectedItems,
            i;

        for (i in sel) {
            delete sel[i];
            rmv.push(parseInt(i, 10));    // convert string keys to integers
        }
        me.selectedIndex = -1;
        me.selectedItem = null;
        if (selectedItems) {
            me.selectedItems = {};
        }
        return rmv;
    }

    /**
     * Removes the given indices from the selectedIndices of the given widget.  Raises no events. Returns an array of the
     * indices that were actually removed (possibly empty).
     *
     * @param {mstrmojo._ListSelections} me
     * @param {int[]} idxs An array of selection indicies.
     *
     * @returns {int[]}
     */
    function remove(me, idxs) {
        // do we have any indexes to remove?
        if (!idxs) {
            return null;
        }

        var removed = [],
            sel = me.selectedIndices,
            arrIdx = $ARR.indexOf,
            allIdx = me.allIdx,
            noneIdx = me.noneIdx,
            idf = me.itemIdField,
            selectedItems = me.selectedItems;

        // remove ALL
        if (me.multiSelect && (((allIdx > -1) && (arrIdx(idxs, allIdx) > -1)) || ((noneIdx > -1) && (arrIdx(idxs, noneIdx) > -1)))) {
            return removeAll(me);
        }

        // remove non-ALL
        // if ALL is currently selected, we need to remove it when any other one removed
        if (idxs.length > 0 && sel[allIdx]) {
            if (arrIdx(idxs, allIdx) < 0) {
                idxs.push(allIdx);
            }
        }

        var len = idxs.length,
            i;

        for (i = 0; i < len; i++) {
            var idx = idxs[i];
            if (sel[idx]) {
                delete sel[idx];
                removed.push(idx);
                if (selectedItems) {
                    delete selectedItems[me.items[idx][idf]];
                }
                if (me.selectedIndex === idx) {
                    me.selectedIndex = -1;
                    me.selectedItem = null;
                }
            }
        }
        return removed;
    }

    /**
     * Utility method: raises an event after the selectedIndices hash has been modified.
     *
     * @param {Array.<int>=} added An array of added item indices.
     * @param {Array.<int>=} removed An array of removed item indices.
     * @param {Array.<int>=} idxs An array of selected indices.
     * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
     *
     * @this mstrmojo.ListBase
     */


    function raiseListEvent(added, removed, idxs, bSuppressEvt) {
        // Are events suppressed?


        // TODO: FIX this function so that if one suppresses the event, the selection is still changed.  Suggestion:  call onSelectionChange() directly.


        if (bSuppressEvt) {
            // Nothing to do.
            return;
        }

        // Can this widget raise events?
        if (this.raiseEvent) {
            // Do we have either added or removed indices ?
            if ((added && added.length) || (removed && removed.length)) {
                try {
                    this.raiseEvent({
                        name: 'selectionChange',
                        added: added,
                        removed: removed
                    });
                } catch (ex) {
                    //There's been an error, undo previous action
                    remove(this, added);
                    addSelections(this, removed);

                    throw ex;
                }
            }
        }
    }

    /**
     * Finds the index of the supplied item within the items collection based on either the itemIdField (if present) or the item itself.
     *
     * @param {Object} item The item to search for.
     *
     * @returns {int}
     */
    function indexOf(item) {
        var idf = this.itemIdField,
            items = this.items;

        // Is the item an object AND do we have an itemIdField?
        if (typeof item === 'object' && idf) {
            // Find item index using itemIfField.
            return $ARR.find(items, idf, item[idf]);
        }

        // Find item index by direct comparison.
        return $ARR.indexOf(items, item);
    }

    /**
     *  A mixin to mix into Model or its subclass that adds the ability to select items.
     *
     *  @public
     *  @mixin
     */
    mstrmojo._ListSelections = {

        /**
         * Whether the selections support multiple selections.
         *
         * @type {boolean}
         * @default false
         */
        multiSelect: false,

        /**
         * The index of the "All" item within the list items.
         *
         * @type {int}
         * @default -1
         */
        allIdx: -1,

        /**
         * The index of the "None" item within the list items.
         *
         * @type {int}
         * @default -1
         */
        noneIdx: -1,

        /**
         * The name of the field within the items objects that corresponds to the ID of that item.
         *
         * @type {string}
         */
        itemIdField: '',

        /**
         * Array of data items to be displayed. We assume the array's contents are static; to modify the displayed list,
         * the entire widget must be re-rendered.
         *
         * @type {Object[]}
         */
        items: null,

        /**
         * A hash of selected indices, possibly empty.  Key = a selected index, value[key] = true if index selected.
         *
         * @type {Object.<int, boolean>}
         */
        selectedIndices: null,

        /**
         * The last index that was added to the selectedIndices. If none, -1.
         *
         * @type {int}
         * @default -1
         */
        selectedIndex: -1,

        /**
         * Metadata for "selectedIndices" property. Identifies the event which is raised when the property value is changed.
         *
         * @type {string}
         */
        selectedIndices_bindEvents: "selectionChange",

        /**
         * Metadata for "selectedIndex" property. Identifies the event which is raised when the property value is changed.
         *
         * @type {string}
         */
        selectedIndex_bindEvents: "selectionChange",

        /**
         * The currently selected item.
         *
         * @type {Object}
         */
        selectedItem: null,

        /**
         * Metadata for "selectedItem" property. Identifies the event which is raised when the property value is changed.
         *
         * @type {string}
         */
        selectedItem_bindEvts: "selectionChange",

        /**
         * Indicates that the list allows adding selected items that are not currently present in the items collection.
         *
         * @type {boolean}
         */
        allowUnlistedValues: true,

        /**
         * <p>The collection of selected items.</p>
         *
         * <p>We need to maintain a separate collection of selected items only if the list supports incremental fetch.  We can
         *    support a separate collection of selected items only if items have ID field.</p>
         *
         * @type {Object.<string, *>}
         */
        selectedItems: null,

        /**
         * Whether the list support incremental fetch.
         *
         * @type {boolean}
         * @default false
         */
        supportsIncFetch: false,

        init: function (props) {
            this._super(props);

            //We need to maintain a separate collection of selected items only if the list supports incremental fetch.
            //We can support a separate collection of selected items only if items have IF field.
            if (this.supportsIncFetch && this.itemIdField) {
                this.selectedItems = {};
            }

            if (!this.items) {
                this.items = [];
            }

            if (!this.selectedIndices) {
                this.selectedIndices = {};
                if (this.selectedIndex > -1) {
                    this._set_selectedIndex("selectedIndex", this.selectedIndex, true);
                } else if (this.selectedItem) {
                    this._set_selectedItem("selectedItem", this.selectedItem, true);
                }
            }
        },

        /**
         * Adds new items to the list.
         *
         * @param {Object[]} newItems An array of items or a single item
         */
        addItems: function addItems(newItems) {
            // Did we get NOT new items?
            newItems = verifyArray(newItems);
            if (!newItems) {
                // Nothing to do.
                return;
            }

            var items = this.items,
                start = this.items.length,
                selectedItems = this.selectedItems,
                newSelected = [], // whether any newly added item should already be selected
                end;

            items = this.items = items.concat(newItems); // concat returns a new array
            end = items.length;

            // If any of added items are already selected we need to add them
            // to slectedIndexes.
            if (selectedItems) {
                var idf = this.itemIdField,
                    i,
                    item;

                for (i = start; i < items.length; i++) {
                    item = items[i];
                    if (selectedItems[item[idf]]) {
                        newSelected.push(i);
                    }
                }
            }

            if (newSelected && newSelected.length) { // selectedIndexes got update needs to notify any listener
                addSelections(this, newSelected); // update selectedIndices and raise event
            }

            if (end > start) {
                // Have we rendred already?
                var itemsContainerNode = this.itemsContainerNode;
                if (itemsContainerNode) {
                    // Render items again.
                    itemsContainerNode.innerHTML += this._buildItemsMarkup(start, end - 1).join('');
                }
            }
        },

        /**
         * Adds new selected items.
         *
         * @param {*|Array} newSelections An array of items or a single item.
         *
         * @deprecated Suspect it's never used.
         */
        addSelectedItems: function addSelectedItems(newSelections) {
            this.selectItems(newSelections, false);
        },

        /**
         * Sets new selected items (clearing old selected items).
         *
         * @param {*|Array} newSelections An array of items or a single item.
         */
        setSelectedItems: function setSelectedItems(newSelections) {
            this.selectItems(newSelections, true);
        },

        /**
         * Selects list items.
         *
         * @param {*|Array} newSelections An array of items or a single item
         * @param {boolean} clearPrevSelections if this flag is true previous selections will be cleared before setting new ones.
         */
        selectItems: function selectItems(newSelections, clearPrevSelections) {
            // Did we get NO items to select?
            newSelections = verifyArray(newSelections);
            if (!newSelections) {
                // Nothing to do.
                return;
            }

            //Reset selected items
            if (clearPrevSelections && this.selectedItems) {
                this.selectedItems = {};
            }

            var selectedItems = this.selectedItems,
                idf = this.itemIdField,
                addedItems = [],                        // A collection of items that must be added to the items collection.
                addedIdx = this.items.length,           // An index of the last added item.
                newSelectedIndices = [],                // A collection of new selected indexes.
                allowUnlistedValues = this.allowUnlistedValues,
                item,
                idx,
                i;

            for (i = 0; i < newSelections.length; i++) {
                item = newSelections[i];
                idx = indexOf.call(this, item);

                //If the item is not present in the list
                if (idx < 0) {
                    //and we don't maintain a separate collection of selected items
                    if (selectedItems === null) {
                        //and we are allowed to add missing items to the list
                        if (allowUnlistedValues) {
                            //Remember that we need to add this item to the list
                            addedItems.push(item);
                            idx = addedIdx++;
                            // TQMS 969635: Add unlisted items to selection.
                            newSelectedIndices.push(idx);
                        }
                    } else {
                        //If we maintain a separate list of selected items then we just
                        //add the item to it
                        selectedItems[item[idf]] = item;
                    }
                } else {
                    //If selected item is present in the items list remember it's index.
                    newSelectedIndices.push(idx);
                }
            }

            //Add items to the list if any
            if (addedItems.length > 0) {
                this.addItems(addedItems);
            }

            //Modify selectedIndexes
            if (newSelectedIndices.length > 0) {
                if (clearPrevSelections) {
                    this.select(newSelectedIndices);
                } else {
                    this.addSelect(newSelectedIndices);
                }
            }
        },

        /**
         * Deselects the given items.
         *
         * @param {Array} items The items to deselect.
         */
        unselectItems: function unselectItems(items) {
            // Did we get NO items to deselect?
            items = verifyArray(items);
            if (!items) {
                // Nothing to do.
                return;
            }

            var selectedItems = this.selectedItems,
                unselectedIndices = [],
                idf = this.itemIdField,
                item,
                idx,
                i;

            if (selectedItems === null) {
                return;
            }

            for (i = 0; i < items.length; i++) {
                item = items[i];

                //TQMS 522453. We need to delete it from selected items here because the item
                //may be missing from the elements list due to incremental fetch.
                if (selectedItems) {
                    delete selectedItems[item[idf]];
                }

                idx = indexOf.call(this, item);

                if (idx < 0) {
                    unselectedIndices.push(idx);
                }
            }

            // Modify selectedIndexes.
            if (unselectedIndices.length > 0) {
                this.removeSelect(unselectedIndices);
            }
        },

        /**
         * Returns an array of the selected items.
         *
         * @returns {Array}
         */
        getSelectedItems: function getSelectedItems() {
            //If we maintain a list of selected items then use it.
            //Otherwise use the selected indices
            if (this.selectedItems) {
                return $HASH.valarray(this.selectedItems);
            }

            return $ARR.get(this.items, $HASH.keyarray(this.selectedIndices, true));
        },

        /**
         * Selects the item at the given index.
         *
         * @param {int} idx The index of the item to select.
         * @param {boolean=} suppressEvt Whether to silently update the selections or not.
         *
         */
        singleSelect: function (idx, suppressEvt) {
            if (idx !== -1) {
                this.select([idx], suppressEvt);
            }
        },

        /**
         * Select the item with the given value.
         *
         * @param {string|int} value The value to select.
         * @param {string} fieldName The name of the item field to match with the given value.
         * @param {boolean=} suppressEvt Whether to silently update the selections or not.
         */
        singleSelectByField: function singleSelectByField(value, fieldName, suppressEvt) {
            this.singleSelect($ARR.find(this.items, fieldName, value), suppressEvt);
        },

        /**
         * <p>Used to toggle selection on an item.</p>
         *
         * <p>If the given index is selected, deselects it; otherwise, selects it.  Raises "selectionChange" event.</p>
         *
         * @param {int} idx The index of the item to toggle.
         */
        toggleSelect: function toggleSelect(idx) {
            var add,
                rmv;

            if (this.selectedIndices[idx]) {
                rmv = remove(this, [idx]);
            } else {
                add = addSelections(this, [idx]);
            }

            raiseListEvent.call(this, add, rmv, [idx]);
        },

        /**
         * Selects the items at the indices.
         *
         * @param {int|int[]} idxs The indices to select.
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        select: function (idxs, bSuppressEvt) {
            // Did we get NO items to select?
            idxs = verifyArray(idxs);
            if (!idxs) {
                // Nothing to do.
                return;
            }

            var rmv = removeAll(this),
                add = addSelections(this, idxs),
                i;

            // Do we not allow reselection?
            if (this.selectionPolicy !== 'reselect') {
                // Iterate removed.
                for (i = rmv.length - 1; i >= 0; i--) {
                    // Is the added element in the remove collection?
                    var ind = $ARR.indexOf(add, rmv[i]);
                    if (ind > -1) {
                        // Remove from both.
                        rmv.splice(i, 1);
                        add.splice(ind, 1);
                    }
                }
            }

            // Raise the event.
            raiseListEvent.call(this, add, rmv, idxs, bSuppressEvt);
        },

        /**
         * Removes all indices from the selectedIndices collection (if any). Raises "selectionChange"
         * event if collection was modified.
         *
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        clearSelect: function (bSuppressEvt) {
            raiseListEvent.call(this, null, removeAll(this), [], bSuppressEvt);
            if (!bSuppressEvt) {
                this.raiseEvent({
                    name: 'clearSelection'
                });
            }
        },

        /**
         * Adds the given indices to the selectedIndices collection (if not already there).  Raises "selectionChange"
         * event if collection was modified.
         *
         * @param {int|int[]} idxs The indices to select.
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        addSelect: function (idxs, bSuppressEvt) {
            // Did we get NO items to select?
            idxs = verifyArray(idxs);
            if (!idxs) {
                // Nothing to do.
                return;
            }

            var ret = addSelections(this, idxs),
                rmv = null,
                noneIdx = this.noneIdx;

            // Check if the not select all selector is selected, if true than remove all indices.
            if (this.multiSelect && (noneIdx > -1 && $ARR.indexOf(idxs, noneIdx) > -1)) {
                rmv = remove(this, idxs);
            }

            raiseListEvent.call(this, ret, rmv, idxs, bSuppressEvt);
        },

        /**
         * Removes the given indices from the selectedIndices collection (if already there). Raises "selectionChange"
         * event if collection was modified.
         *
         * @param {int|int[]} idxs The indices to deselect.
         */
        removeSelect: function (idxs) {
            // Did we get NO items to remove from selections?
            idxs = verifyArray(idxs);
            if (!idxs) {
                // Nothing to do.
                return;
            }

            raiseListEvent.call(this, null, remove(this, idxs), idxs);
        },

        /**
         * Custom setter for selectedIndices. Avoids resetting the object reference, and instead updates the existing
         * hashtable and raises an event.
         *
         * @param {string} n The name of the property that changed (in this case "selectedIndices").
         * @param {Object.<int, boolean>} v The new property value (in this case the "selectedIndices" hash).
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        _set_selectedIndices: function _set_selectedIndices(n, v, bSuppressEvt) {
            //Reset selected items collection.
            if (this.selectedItems) {
                this.selectedItems = {};
            }

            var sel = this.selectedIndices;
            if (sel === v) {
                return false;
            }

            if (!sel) {
                sel = {};
                this.selectedIndices = sel;
            }

            if (!v) {
                v = {};
            }

            // Remove the current selections which are not in the new selections.
            var sidx = this.selectedIndex,
                rmv = [],
                idx;

            for (idx in sel) {
                if (!v[idx]) {
                    idx = parseInt(idx, 10);
                    delete sel[idx];
                    rmv.push(idx);
                    if (sidx === idx) {
                        this.selectedIndex = -1;
                        this.selectedItem = null;
                    }
                }
            }
            // Add the new selections which are not already in the current selections.
            var add = [],
                itms = this.items,
                idf = this.itemIdField,
                item;

            for (idx in v) {
                if (!sel[idx]) {
                    idx = parseInt(idx, 10);
                    sel[idx] = true;
                    add.push(idx);
                    this.selectedIndex = idx;
                    item = this.selectedItem = itms[idx];
                    if (this.selectedItems) {
                        this.selectedItems[item[idf]] = item;
                    }
                }
            }

            // Raise event if collection as modified.
            if (bSuppressEvt !== true) {
                var idxs = [];
                for (idx in v) {
                    if (sel[idx]) {
                        idx = parseInt(idx, 10);
                        idxs.push(idx);
                    }
                }
                raiseListEvent.call(this, add, rmv, idxs);
            }

            return (add.length || rmv.length);    // True if selections modified; false otherwise.
        },

        /**
         * <p>Custom setter for selectedIndex.</p>
         *
         * <p>Leverages setter for selectedIndices to keep that property synchronized.</p>
         *
         * @param {string} n The name of the property that changed (in this case "selectedIndex").
         * @param {int} v The new property value (in this case the "selectedIndex" integer).
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        _set_selectedIndex: function _set_selectedIndex(n, v, bSuppressEvt) {
            var idxs = {};
            if (v > -1) {
                idxs[v] = true;
            }

            return this._set_selectedIndices("selectedIndices", idxs, bSuppressEvt);
        },

        /**
         * <p>Custom setter for selectedItem.</p>
         *
         * <p>Leverages setter for selectedIndex to keep that property synchronized.
         * Supports values which are either objects or scalars. If an object is given, and itemIdField is defined, then
         * the given item's itemIdField property is compared to the itemIdField properties
         * of the list's items. If no match is found, the selected index is set to -1 UNLESS the "allowUnlistedValues" property is true.
         * If allowUnlistedValues is true and no match is found, the given item is appended to the items list and selected.</p>
         *
         * @param {string} n The name of the property that changed (in this case "selectedItem").
         * @param {*} v The new property value (in this case the "selectedItem" value).
         * @param {boolean=} bSuppressEvt Whether list events should be suppressed.
         */
        _set_selectedItem: function _set_selectedItem(n, v, bSuppressEvt) {

            // Find the index corresponding to the given item.
            var idx = indexOf.call(this, v);
            if ((idx < 0) && (v !== null && v !== undefined) && this.allowUnlistedValues && this.items) {
                // We couldn't find the given item in items, but we are allowed to add it.
                // Note: we reset the "items" array by reference, rather than appending to the
                // existing array, because we want to raise a "itemsChange" event that will repaint the list.
                this.set('items', this.items.concat(v));
                idx = this.items.length - 1;
            }

            return this._set_selectedIndex("selectedIndex", idx, bSuppressEvt);
        },

        // TODO: Remove these helper methods that are exposing the private functions addSelections() and removeAll() once raiseListEvent() properly supports bSuppressEvent
        // These helpers are currently being used by HTML VI Viz Gallery list.

        /**
         * Adds the given indices to the selectedIndices of the given widget.  Raises no events. Returns an array of the
         * indices that were actually added (possibly empty).
         *
         * @param {int[]} idxs An array of selection indicies.
         */
        _addSelections: function(idxs) {
            return addSelections(this, idxs);
        },

        /**
         * Removes all selectedIndices from given widget.  Raises no events. Returns an array of the
         * indices that were actually removed (possibly empty).
         *
         * @param {mstrmojo._ListSelections} me
         */

        _removeAll: function() {
            return removeAll(this);
        }



    };
}());
(function () {

    mstrmojo.requiresCls('mstrmojo.array',
                         'mstrmojo.hash');

    /**
     * Internal regular expression used to match dynamic tokens in a string template.
     * @private
     */
    var _reTOKENS = /\{\@(en@)?([^\}]+)\}/gm,
        _reLT = /\</gm,
        _reGT = /\>/gm,
        _reNEm = /\S/,
        _regSpecials = ['$', '^', '=', '!', ':',
                    '/', '.', '*', '+', '?', '|',
            '(', ')', '[', ']', '{', '}', '\\'],
        _reRegEsc = new RegExp('(\\' + _regSpecials.join('|\\') + ')', 'g'),
        _xmlRep = {
            '&': { k: '&(?!#?\\w+;)', v: '&amp;'},
            '<': '&lt;',
            '>': '&gt;',
            'u0009': '&#x09;',  // tab
            '\n': '&#x0A;',  // line feed
            '\r': '&#x0D;',  // carriage return
            '"': '&quot;'
        },
        _htmlRep = {
            '&': { k: '&(?!#?\\w+;)', v: '&amp;'},
            '<': '&lt;',
            '>': '&gt;',
            ' ': '&nbsp;',
            '\n': '<br/>',  // line feed
            '\r': '&nbsp;&nbsp;&nbsp;&nbsp;',  // carriage return
            '\'': '&#039;',
            '"': '&quot;'
        },
        _htmlDecodeRep = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&nbsp;': ' ',
            '<br/>': '\n',  // line feed
            '&nbsp;&nbsp;&nbsp;&nbsp;': '\r',  // carriage return
            '&#039;': '\'',
            '&quot;': '"'
        },
        _basicHtmlRep = { // TQMS 839236, encode strings following the HTMLHelper.java rules.
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#039;',
            '"': '&quot;',
            '\u20ac': '&#8364;' //euro
        },
        _basicHtmlDecodeRep = { // TQMS 839236, decode strings following the HTMLHelper.java rules.
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#039;': '\'',
            '&quot;': '"',
            '&#8364;': '\u20ac' //euro
        };

    /**
     * Internal method to determine the object type.
     * It will return primitive type as of built-in typeof returns.
     * It will return "array" for built-in JavaScript Array and mstrmojo.Arr.
     * It will return "object" for other
     */
    var _typeOf = function (v) {
        if (v === null) {
            return 'null';
        }

        var t = typeof v;
        if (t !== 'object') {
            return t;
        }

        if (v.length === undefined) {
            return 'object';
        }
        return 'array';
    };

    var parseUriOptions = {
        strictMode: false,

        key: [ 'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor' ],

        q: {
            name: 'queryKey',
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },

        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };

    /**
     * A static utility class for string operations.
     *
     * @namespace mstrmojo.string
     */
    mstrmojo.string = mstrmojo.provide(

        "mstrmojo.string",

        /**
         * @lends mstrmojo.string
         */
        {

            /**
             * Performs multiple replacement operations on a single string.
             *
             * @param {string} s The string whose values should be replaced.
             * @param {Object} hash A hash whose property names represent the strings that should be replaced and values represent the strings that should replace them.
             * @param {Array} [skip=[]] An optional array containing characters that will be skip during the encoding.
             *
             * @returns {string}
             */
            multiReplace: function multiReplace(s, hash, skip) {
                var k;
                skip = skip || [];

                if (!s) {
                    return '';
                }

                var keys = [];
                for (k in hash) {

                    if (mstrmojo.array.indexOf(skip, k) === -1) {
                        keys.push(k.k || k); // if has a key defined explicitly, using it
                    }
                }

                return s.replace(new RegExp(keys.join('|'), 'g'), function ($0) {
                    var v = hash[$0];
                    return v.v || v;           // return value, if it is defined explicitly
                });
            },

            /**
             * Removes white space from beginning & end of a given string.
             *
             * @param {string} s The string to trim.
             *
             * @returns {string} The trimmed string.
             */
            trim: function trim(s) {
                return (s && s.replace) ? s.replace(/^\s+/, "").replace(/\s+$/, "") : s;
            },

            /**
             * Shortens the supplied text to the supplied length and adds HTML ellipsis (if needed).
             *
             * @param {string} text Header text item.
             * @param {int} length The length the text should be shortened to.
             *
             * @returns {string} Modified text.
             */
            ellipsize: function ellipsize(text, length) {
                // Shorten and trim string.
                var shortText = this.trim(text.substr(0, (length || 1) - 1));

                // Is shortened string NOT equal to original string?
                if (shortText !== text) {
                    // Add ellipsis.
                    shortText += '&hellip;';
                }

                return shortText;
            },

            /**
             * Check whether a string is empty.
             *
             * @param {string} v The string to check.
             *
             * @returns {boolean}
             */
            isEmpty: function isEmpty(v) {
                return (v === null) || (v === undefined) || !(_reNEm.test(v)); // Boolean
            },

            regEscape: function regEscape(text) {
                return text.replace(_reRegEsc, '\\$1');
            },

            /**
             * Creates an encoded attribute string for an XML element for the value passed.
             *
             * @param {string} v The value of the attribute.
             *
             * @returns {string} The encoded string that can be used as XML attribute.
             */
            encodeXMLAttribute: function (v) {
                return mstrmojo.string.multiReplace(v, _xmlRep);
            },

            /**
             * Creates an html encoded string from the value passed.
             *
             * @param {string} v The string to encode.
             * @param {boolean} [skipSpaces=false] An optional parameter indicates whether to convert spaces into &nbsp;.
             * @param {boolean} when basicHtmlEncode is true, encode v following the HTMLHelper.java rules(always skip encoding spaces).
             *
             * @returns {string} The encoded string that can be used as XML attribute.
             */
            encodeHtmlString: function (v, skipSpaces, basicHtmlEncode) {
                // TQMS 839236, when basicHtmlEncode is true, encode v following the HTMLHelper.java rules(always skip encoding spaces).
                if (basicHtmlEncode) {
                    return mstrmojo.string.multiReplace(v, _basicHtmlRep);
                }
                return mstrmojo.string.multiReplace(v, _htmlRep, skipSpaces ? [" "] : []);
            },

            //TQMS 589864
            decodeHtmlString: function (v, basicHtmlDecode) {
                // TQMS 839236, when basicHtmlDecode is true, decode v following the HTMLHelper.java rules(always skip decoding spaces).
                return basicHtmlDecode ? mstrmojo.string.multiReplace(v, _basicHtmlDecodeRep) : mstrmojo.string.multiReplace(v, _htmlDecodeRep);
            },

            /**
             * <p>Replace angles brackets in a given string with the HTML equivalents "&lt;" and "&gt;".</p>
             *
             * <p>Used as a faster substitute for multiReplace.</p>
             *
             * @param {string} s String to be encoded.
             *
             * @returns {string} The encoded result; if null was provided, null is returned.
             */
            htmlAngles: function (s) {
                if (!mstrmojo.string.isEmpty(s)) {    // if is not null and not undefined
                    s = String(s);
                    return s.replace(_reLT, '&lt;').replace(_reGT, '&gt;');
                }
                return s;
            },


            /**
             * <p>Applies a given template string to a given object.</p>
             *
             * <p>This method replaces tokens in the given template with actual property values from the given
             * object. The token syntax is a dot (".") delimited string (e.g., "{@&lt;prop.foo&gt;}" where &lt;prop> is the name of a property and &lt;foo> is
             * a name of a property within &lt;prop>. If the property value is null, the token is replaced by an empty string.</p>
             *
             * @param {String} template The template to be applied.
             * @param {Object} obj The object to which the template is applied.
             *
             * @returns {string} The new string without tokens.
             */
            apply: function apl(template, obj) {
                if (!template) {
                    return "";
                }
                var me = this;
                return template.replace(_reTOKENS, function fnReplaceToken(token, encodeSymbol, prop) {

                    var propertyValue;
                    try {
                        propertyValue = mstrmojo.hash.walk(prop, obj);
                    } catch (ex) {}

                    propertyValue = (propertyValue === null || propertyValue === undefined) ? '' : propertyValue;

                    return (!!encodeSymbol) ? me.encodeHtmlString(propertyValue, true) : propertyValue;
                });
            },

            /**
             * <p>Converts JSON object into its XML representation.</p>
             *
             * <p>Primitive type of data will be serialized as attribute of the xml node;
             * Object type of data will be serialized as a child node of the current node, with node name the same as the property name;
             * Array type of data will be serialized as a child node of the current node, with the node name the same as the property name,
             * and each item in the array will be serialized as a child node of the array node, with the node name determined by config.getArrItemName.</p>
             *
             * @param {string} nodeName the name of the root node of the XML string
             * @param {Array|Object} jsons An array of JSON objects or a single JSON object. When it is an array, the properties of each
             *                             JSON object will be serialized as root node's attribute or child node.
             * @param {Object} config A config object to help customizing serializing. It can have following properties:
             *          getArrItemName(n,v,i): when an array is encountered, each item in the array will be serialized into a child node.
             *                                  But what to be used as child node name will be determined by the return value of this function.
             *                                  parameter 'n' is the name of the array property; parameter 'v' is the array; parameter 'i' is the index of the current item.
             *          isSerializable(nodeName, jsons): before json2xml serialize for any property of current node, it will refer to this method to
             *                                  check whether serialization in json2xml should be performed. If this method returns boolean "true", the regular
             *                                  serialization will keep going. If this method return boolean 'false', then serialization of this property will be skipped.
             *                                  If an object is returned, then the string value of its 'att' property will be put in as xml attribute for current node,
             *                                  and the string value of its 'child' property will be put as child node of current node.
             *                                  So, by using this method, caller can customize json2xml to skip serialization of certain nodes, or customize certain node's serialization result.
             *          convertBoolean: when serializing boolean properties whether to convert them to integers (-1/0) or not. Default to true
             *          skipFunctions: Whether to serialize function definitions or not. Default to false
             */
            json2xml: function (nodeName, jsons, config) {
                if (!(jsons instanceof Array)) {
                    jsons = [jsons];
                }

                var serial = config && config.isSerializable,
                    convertBoolean = (config.convertBoolean !== false),
                    skipFunctions = config && config.skipFunctions,
                    ji,
                    jlen;

                // serialize jsons
                var att = [],    // array of all attributes for this xml node
                    ch = [],    // array of all child nodes for this xml node
                    n,          // name of the property
                    v,          // value of the property
                    t;          // type of the property value
                // loop through all json objects
                for (ji = 0, jlen = jsons.length; ji < jlen; ji++) {
                    var json = jsons[ji];
                    // loop through each property
                    for (n in json) {
                        if (skipFunctions && typeof json[n] === "function") {
                            continue;  // skip current property
                        }
                        // config may have customized serialization for certain node
                        if (serial) {
                            var ret = serial(n, jsons, ji);

                            if (ret !== true) {
                                if (ret === false) {    // returned boolean 'false'

                                    continue; // skip current property.
                                } else {

                                    if (ret.att) {       // returned object contains attribute xml
                                        att.push(ret.att);
                                    }

                                    if (ret.child) {     // returned object contains child xml
                                        ch.push(ret.child);
                                    }
                                    continue;
                                }
                            }
                            // returned true, then keep going with regular serialization
                        }
                        v = json[n];
                        t = _typeOf(v);

                        switch (t) {
                        case 'array':
                            var i,
                                len;

                            ch.push('<' + n + '>');     // node for array
                            // loop through each array item
                            for (i = 0, len = v.length; i < len; i++) {
                                var cn = config.getArrItemName(n, v, i) || i; // child name
                                ch.push(this.json2xml(cn, v[i], config));   // node for each array item
                            }
                            ch.push('</' + n + '>'); // close the array node
                            break;
                        case 'object':
                            ch.push(this.json2xml(n, v, config));
                            break;
                        case 'string':
                            att.push(n + '="' + mstrmojo.string.encodeXMLAttribute(v) + '"');
                            break;
                        case 'boolean':
                            att.push(n + '="' + (convertBoolean ? (v ? '-1' : '0') : v) + '"');
                            break;
                        case 'null':
                            if (!config.skipNull) {
                                att.push(n + '="' + config.nullValue + '"');
                            }
                            break;
                        default:
                            att.push(n + '="' + v + '"');
                            break;
                        }
                    } // end of looping through each property
                } // end of looping through each json objects
                return '<' + nodeName + ' ' + att.join(' ') + '>' + ch.join('') + '</' + nodeName + '>';
            },

            escape4HTMLText: function escape4HTMLText(v) {
                if (!v || !v.replace) {
                    return v;
                }
                var QUOTE = /"/gm;
                var QUOTE_ENCODED = '&quot;';
                var AMP = /&/gm;
                var AMP_ENCODED = '&amp;';
                var LESSTHAN = /</gm;
                var LESSTHAN_ENCODED = '&lt;';
                var GREATERTHAN = />/gm;
                var GREATERTHAN_ENCODED = '&gt;';
                return v.replace(AMP, AMP_ENCODED
                    ).replace(QUOTE, QUOTE_ENCODED
                    ).replace(LESSTHAN, LESSTHAN_ENCODED
                    ).replace(GREATERTHAN, GREATERTHAN_ENCODED);
            },

            /**
             * <p>Parses a URI into an object containing it's component parts.</p>
             *
             * <p>Ported from Steven Levithan's parseURI 1.2.2</p>
             *
             * <ul>
             *  <li>parseUri 1.2.2</li>
             *  <li>(c) Steven Levithan &lt;stevenlevithan.com&gt;</li>
             *  <li>MIT License</li>
             * </ul>
             *
                 * @param {string} str The URI to parse.
                 * @param {Object=} options Optional parsing options (will default to standard options).
             *
                 * @returns {Object}
             */
            parseUri: function (str, options) {
                options = options || parseUriOptions;

                var m = options.parser[((options.strictMode) ? 'strict' : 'loose')].exec(str),
                    uri = {},
                    i = 14;

                while (i--) {
                    uri[options.key[i]] = m[i] || '';
                }

                uri[options.q.name] = {};
                uri[options.key[12]].replace(options.q.parser, function ($0, $1, $2) {
                    if ($1) {
                        uri[options.q.name][$1] = $2;
                    }
                });

                return uri;
            }

        }
    );

})();
(function () {
    mstrmojo.requiresCls("mstrmojo.hash");

    /**
     * Public lookup of registered objects, keyed by id.
     *
     * @type {Object.<string, mstrmojo.Obj>}
     * @static
     */
    mstrmojo.all = {};

    var $REGISTRY = mstrmojo.all,
        $HASH = mstrmojo.hash;

    /**
     * <p>A counter used for auto-generated ids.</p>
     *
     * @type {int}
     */
    var freeIdCounter = 0;

    /**
     * <p>Returns a unique auto-generated id that is not currently used in the {@link mstrmojo.all} collection.</p>
     *
     * <p>The id will following the syntax "mstr#" where "#" is an integer.</p>
     *
     * @returns {string}
     */
    function getFreeID() {
        var id;
        while (!id) {
            // Create test ID.
            var testId = 'mstr' + (freeIdCounter++);

            // Is test ID NOT found in the registry?
            if (!$REGISTRY[testId]) {
                // Use this ID>
                id = testId;
            }
        }

        return id;
    }

    /**
     * <p>Manages a lookup of mojo objects.</p>
     *
     * @namespace mstrmojo.registry
     */
    mstrmojo.registry = mstrmojo.provide(
        "mstrmojo.registry",

        /**
         * @lends mstrmojo.registry
         */
        {
            /**
             * <p>Adds an object to the lookup.</p>
             *
             * <p>The object must have a non-null "id" property, and that id must not already be used in the lookup;
             * otherwise, throws an error.</p>
             *
             * @param {Object} obj The object to be added to the lookup.
             */
            add: function add(obj) {
                if (!obj) {
                    return;
                }

                // If we don't have an id (null|undefined), get an auto-generated one, so we can be looked up by id later.
                var id = obj.id;
                if (!id) {   // if id is null OR undefined
                    obj.id = id = getFreeID();
                } else if ($REGISTRY[id]) {
                    throw new Error("Tried to register 2 objects with same id: " + id);
                }

                $REGISTRY[id] = obj;
            },

            /**
             * <p>Removes a given object from the lookup.</p>
             *
             * @param {Object} obj The object to be removed from the lookup.
             */
            remove: function rmv(obj) {
                if (obj && obj.id) {    // if id is not null and not undefined
                    delete $REGISTRY[obj.id];
                }
            },

            /**
             * Dumps the ID and, if possible, scriptClass properties of all objects in mstrmojo.all to console.
             */
            dumpAll: function () {
                var o;
                for (o in $REGISTRY) {
                    var id = $REGISTRY[o].id;
                    if (id) {
                        mstrmojo.dbg(id + "(" + ($REGISTRY[o].scriptClass || "[unknown class]") + ")");
                    }
                }
            },

            /**
             * <p>Attempts to convert a given object reference into an instance of a javascript class.</p>
             *
             * <p>The object reference may be either of the following:</p>
             * <ol>
             *     <li>a fully qualified class name (String); or</li>
             *     <li>a hash table of properties, which includes a "scriptClass" property; or</li>
             *     <li>an instance of a javascript class.</li>
             * </ol>
             *
             * <p>In case #1, the FQCN is loaded (if needed) and evaluated. If the evaluated result
             * is a Function, it is assumed to be a constructor and then used to instantiate a
             * return value. Otherwise if the evaluated result is an object, then the object is
             * used for either cases #2 (for a native object) or #3 (for an instance of a javascript class).</p>
             *
             * <p>In case (2), the hash table's scriptClass property determines what constructor
             * is called to instantiate a javascript class.  The hash table is passed into the
             * constructor call. If no scriptClass property is defined, the hash table is returned.</p>
             *
             * <p>In case (3), the given instance is returned.</p>
             *
             * @param {String|Object} config The object reference to be evaluated.
             * @param {{skipLoadChecks: boolean, dontInst: boolean, clone: boolean}=} flags Hash table of flags to customize this function call's behavior:
             * <ul>
             *     <li>skipLoadChecks: If true, this method will skip calling mstrmojo.requiresCls before evaluating an FQCN string.</li>
             *     <li>dontInst: If true, when this method evaluates a reference as a Function, it will return that Function; otherwise, this method assumes the Function is a constructor and calls the Function to create a new object instance.</li>
             *     <li>clone: If true, when this method evaluates a reference as a hash table of properties, it will pass in a clone of the hash table, rather than the hash table itself, to a class constructor.</li>
             * </ul>
             *
             * @returns {Object}
             */
            ref: function ref(config, flags) {
                flags = flags || {};

                if (config) {
                    var C = config;
                    while (C) {
                        switch (typeof C) {
                        // FQCN.
                        case "string":
                            // Should we verify the script class is loaded?
                            if (flags.skipLoadChecks !== true) {
                                // Require the class.
                                mstrmojo.requiresCls(C);
                            }

                            // Reset C to the constructor.
                            C = $HASH.walk(C, window);
                            break;

                        // Constructor.
                        case "function":
                            // A constructor. Call it, unless explicitly asked not to.
                            return (flags.dontInst !== true) ? new C() : C;

                        // Instantiated class.
                        case "object":
                            if (C.constructor === Object) {
                                // A hash table of properties; try to convert to script class instance.
                                var sc = C.scriptClass;
                                if (sc) {
                                    // Script class FQCN is specified; load and evaluate it.
                                    if (flags.skipLoadChecks !== true) {
                                        mstrmojo.requiresCls(sc);
                                    }

                                    var Cls = $HASH.walk(sc, window);
                                    if (Cls) {
                                        // Got the constructor; call it.
                                        return new Cls((flags.clone === true) ? $HASH.clone(C) : C);
                                    }

                                    // Couldn't load the constructor; failed.
                                    return null;
                                }

                                // Script class FQCN not specified; return the hash table.
                                return C;
                            }

                            // A javascript custom class instance.
                            return C;

                        default:
                            return null;
                        }
                    }
                }

                return null;
            }
        }
    );

    /**
     * <p>Shortcut to mstrmojo.registry.ref method, for convenience.</p>
     *
     * @type {Function}
     * @return {Object}
     */
    mstrmojo.insert = mstrmojo.registry.ref;
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.hash");

    mstrmojo.requiresDescs(3852, 3853, 3854, 3855, 3856, 3857, 3858, 3859, 3860, 3861, 3862, 3863,
        1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967,
        9379, 9380, 9381, 9382, 9383, 9384, 9385,
        6078, 7899, 7900, 7901, 6079, 6081, 6080, 6082, 7902, 7902, 6076, 6077, 7903);

    /**
     * A utility class to load locale specific information from web server.
     *
     * @namespace mstrmojo.locales
     */
    mstrmojo.locales = mstrmojo.provide(
        "mstrmojo.locales",
            /**
             * @lends mstrmojo.locales
             */
            {
                /**
                 * Load locale specific information and callback if succeeded.
                 */
                load: function (callback) {
                    var me = this;
                    if (this.isLoaded) {
                        callback();
                        callback=null;
                    } else {
                        mstrmojo.xhr.request('POST', mstrConfig.taskURL,
                        {
                            success: function (res) {
                                //copy result
                                me.update(res);

                                callback();
                                callback=null;

                                if (mstrmojo.expr) {
                                    mstrmojo.expr.onLocaleUpdated();
                                }
                                mstrmojo.locales.isLoaded = true;

                            },
                            failure: function (res) {
                                alert(res.getResponseHeader('X-MSTR-TaskFailureMsg'));//can not use mstrmojo.alert because mstrmojo.Dialog may not be loaded yet.
                            }
                        },
                        // no parameter, load current user's all locale related info
                        {
                            taskId: 'getLocaleInfo'
                        });
                    }
                },

                /**
                 * Updates locale specific information.
                 */
                update: function (props) {
                    //copy properties
                    if (props) {
                        mstrmojo.hash.copy(mstrmojo.hash.obj2array(props), this);
                    }
                },

                isLoaded: false,

                "datetime": {
                    "MONTHNAME_SHORT": [
                        mstrmojo.desc(3852, "Jan"),
                        mstrmojo.desc(3853, "Feb"),
                        mstrmojo.desc(3854, "Mar"),
                        mstrmojo.desc(3855, "Apr"),
                        mstrmojo.desc(3856, "May"),
                        mstrmojo.desc(3857, "Jun"),
                        mstrmojo.desc(3858, "Jul"),
                        mstrmojo.desc(3859, "Aug"),
                        mstrmojo.desc(3860, "Sep"),
                        mstrmojo.desc(3861, "Oct"),
                        mstrmojo.desc(3862, "Nov"),
                        mstrmojo.desc(3863, "Dec")
                    ],
                    "MONTHNAME_FULL": [
                        mstrmojo.desc(1956, "January"),
                        mstrmojo.desc(1957, "February"),
                        mstrmojo.desc(1958, "March"),
                        mstrmojo.desc(1959, "April"),
                        mstrmojo.desc(1960, "May"),
                        mstrmojo.desc(1961, "June"),
                        mstrmojo.desc(1962, "July"),
                        mstrmojo.desc(1963, "August"),
                        mstrmojo.desc(1964, "September"),
                        mstrmojo.desc(1965, "October"),
                        mstrmojo.desc(1966, "November"),
                        mstrmojo.desc(1967, "December")
                    ],
                    "dayShortNames": [
                        "S",
                        "M",
                        "T",
                        "W",
                        "T",
                        "F",
                        "S"
                    ],
                    "dayNames": [
                        mstrmojo.desc(9379, "Sunday"),
                        mstrmojo.desc(9380, "Monday"),
                        mstrmojo.desc(9381, "Tuesday"),
                        mstrmojo.desc(9382, "Wednesday"),
                        mstrmojo.desc(9383, "Thursday"),
                        mstrmojo.desc(9384, "Friday"),
                        mstrmojo.desc(9385, "Saturday")
                    ],
                    "DATEINPUTFORMATS": [
                        "M/d/yy",
                        "M/d/yyyy",
                        "MMM d, yy"
                    ],
                    "TIMEINPUTFORMATS": [
                        "h:mm a",
                        "H:mm",
                        "h:mm:ss a",
                        "H:mm:ss",
                        "h:mm:ss a z"
                    ],
                    "DATEOUTPUTFORMAT": "M/d/yyyy",
                    "TIMEOUTPUTFORMAT": "h:mm:ss a",

                    // TQMS 927462 add the date/time output format in perferences
                    "DATEDISPLAYFORMAT":"M/d/yy",
                    "TIMEDISPLAYFORMAT":"h:mm:ss",

                    "AM_NAME": "AM",
                    "PM_NAME": "PM",
                    "TWODIGITYEARSTART": "2029"
                },
                "number": {
                    "NUMBERINPUTFORMATS": {
                        "0": "#,##0.###"
                    },
                    "INTEGERINPUTFORMATS": {
                        "0": "#,##0"
                    },
                    "NUMBEROUTPUTFORMAT": "#0.##########",
                    "INTEGEROUTPUTFORMAT": "#0",
                    "DECIMALSEPARATOR": ".",
                    "THOUSANDSEPARATOR": ","
                },
                "expression": {
                    "METRICVALIDATIONLEVEL": "0",
                    "PRESERVEWHITESPACE": false,
                    "Include": [
                        {
                            "did": "1",
                            "n": mstrmojo.desc(3945, "Include")
                        },
                        {
                            "did": "2",
                            "n": mstrmojo.desc(3946, "Exclude")
                        }
                    ],
                    "BranchQual": [
                        {
                            "did": "19",
                            "n": mstrmojo.desc(5282, "AND")
                        },
                        {
                            "did": "20",
                            "n": mstrmojo.desc(5283, "OR")
                        },
                        {
                            "did": "21",
                            "n": mstrmojo.desc(12298, "NOT")
                        },
                        {
                            "did": "19_21",
                            "n": mstrmojo.desc(5924, "AND NOT")
                        },
                        {
                            "did": "20_21",
                            "n": mstrmojo.desc(5925, "OR NOT")
                        }
                    ],
                    "RootOperator": [
                        {
                            "did": "19",
                            "n": mstrmojo.desc(534, "All selections")
                        },
                        {
                            "did": "20",
                            "n": mstrmojo.desc(535, "Any selection")
                        }
                    ],
                    "ExprType": [
                        {
                            "did": "2",
                            "n": mstrmojo.desc(546, "Qualify")
                        },
                        {
                            "did": "5",
                            "n": mstrmojo.desc(547, "Select")
                        }
                    ],
                    "DimtyLevels": [
                        {
                            "did": "1",
                            "n": mstrmojo.desc(2171, "Default")
                        },
                        {
                            "did": "2",
                            "n": mstrmojo.desc(3086, "Metric")
                        },
                        {
                            "did": "3",
                            "n": mstrmojo.desc(3344, "Report")
                        }
                    ],
                    "Attribute": [
                        {
                            "did": "1,6",
                            "n": mstrmojo.desc(2795, "Equals"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,7",
                            "n": mstrmojo.desc(2796, "Does not equal"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,8",
                            "n": mstrmojo.desc(521, "Greater than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,10",
                            "n": mstrmojo.desc(522, "Greater than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,9",
                            "n": mstrmojo.desc(523, "Less than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,11",
                            "n": mstrmojo.desc(524, "Less than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,17",
                            "n": mstrmojo.desc(696, "Between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,44",
                            "n": mstrmojo.desc(746, "Not between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,76",
                            "n": mstrmojo.desc(686, "Contains"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,79",
                            "n": mstrmojo.desc(2784, "Does not contain"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,77",
                            "n": mstrmojo.desc(687, "Begins with"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,80",
                            "n": mstrmojo.desc(2785, "Does not begin with"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,78",
                            "n": mstrmojo.desc(688, "Ends with"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,81",
                            "n": mstrmojo.desc(2786, "Does not end with"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,18",
                            "n": mstrmojo.desc(525, "Like"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,43",
                            "n": mstrmojo.desc(526, "Not Like"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,54",
                            "n": mstrmojo.desc(2202, "Is Null"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,55",
                            "n": mstrmojo.desc(2203, "Is Not Null"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,22",
                            "n": mstrmojo.desc(587, "In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,57",
                            "n": mstrmojo.desc(2204, "Not In"),
                            "t": 1,
                            "tp": 1
                        }
                    ],
                    "Metric": [
                        {
                            "did": "1,6",
                            "n": mstrmojo.desc(2795, "Equals"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,7",
                            "n": mstrmojo.desc(2796, "Does not equal"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,8",
                            "n": mstrmojo.desc(521, "Greater than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,10",
                            "n": mstrmojo.desc(522, "Greater than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,9",
                            "n": mstrmojo.desc(523, "Less than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,11",
                            "n": mstrmojo.desc(524, "Less than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,17",
                            "n": mstrmojo.desc(696, "Between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,44",
                            "n": mstrmojo.desc(746, "Not between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,54",
                            "n": mstrmojo.desc(2202, "Is Null"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,55",
                            "n": mstrmojo.desc(2203, "Is Not Null"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,22",
                            "n": mstrmojo.desc(587, "In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,57",
                            "n": mstrmojo.desc(2204, "Not In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "2,1",
                            "n": mstrmojo.desc(529, "Highest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "2,2",
                            "n": mstrmojo.desc(530, "Lowest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "3,1",
                            "n": mstrmojo.desc(4407, "Highest %"),
                            "t": 3,
                            "tp": 3
                        },
                        {
                            "did": "3,2",
                            "n": mstrmojo.desc(4406, "Lowest %"),
                            "t": 3,
                            "tp": 3
                        }
                    ],
                    "MetricRP": [
                        {
                            "did": "2,13",
                            "n": mstrmojo.desc(13897, "Rank between highest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "2,4",
                            "n": mstrmojo.desc(1101, "Exclude highest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "2,3",
                            "n": mstrmojo.desc(13896, "Rank between lowest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "2,5",
                            "n": mstrmojo.desc(1102, "Exclude lowest"),
                            "t": 2,
                            "tp": 2
                        },
                        {
                            "did": "3,13",
                            "n": mstrmojo.desc(13890, "Between highest") + '%',
                            "t": 3,
                            "tp": 3
                        },
                        {
                            "did": "3,4",
                            "n": mstrmojo.desc(1101, "Exclude highest") + '%',
                            "t": 3,
                            "tp": 3
                        },
                        {
                            "did": "3,3",
                            "n": mstrmojo.desc(13889, "Between lowest") + '%',
                            "t": 3,
                            "tp": 3
                        },
                        {
                            "did": "3,5",
                            "n": mstrmojo.desc(1102, "Exclude lowest") + '%',
                            "t": 3,
                            "tp": 3
                        }
                    ],
                    "MDXAttribute": [
                        {
                            "did": "1,6",
                            "n": mstrmojo.desc(2795, "Equals"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,7",
                            "n": mstrmojo.desc(2796, "Does not equal"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,8",
                            "n": mstrmojo.desc(521, "Greater than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,10",
                            "n": mstrmojo.desc(522, "Greater than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,9",
                            "n": mstrmojo.desc(523, "Less than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,11",
                            "n": mstrmojo.desc(524, "Less than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,17",
                            "n": mstrmojo.desc(696, "Between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,44",
                            "n": mstrmojo.desc(746, "Not between"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,22",
                            "n": mstrmojo.desc(587, "In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,57",
                            "n": mstrmojo.desc(2204, "Not In"),
                            "t": 1,
                            "tp": 1
                        }
                    ],
                    "MDXMetric": [
                        {
                            "did": "1,6",
                            "n": mstrmojo.desc(2795, "Equals"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,7",
                            "n": mstrmojo.desc(2796, "Does not equal"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,8",
                            "n": mstrmojo.desc(521, "Greater than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,10",
                            "n": mstrmojo.desc(522, "Greater than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,9",
                            "n": mstrmojo.desc(523, "Less than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,11",
                            "n": mstrmojo.desc(524, "Less than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,17",
                            "n": mstrmojo.desc(696, "Between"),
                            "t": 1,
                            "tp": 1
                        }
                    ],
                    "SAPAttribute": [
                        {
                            "did": "1,6",
                            "n": mstrmojo.desc(2795, "Equals"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,7",
                            "n": mstrmojo.desc(2796, "Does not equal"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,22",
                            "n": mstrmojo.desc(587, "In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,57",
                            "n": mstrmojo.desc(2204, "Not In"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,8",
                            "n": mstrmojo.desc(521, "Greater than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,10",
                            "n": mstrmojo.desc(522, "Greater than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,9",
                            "n": mstrmojo.desc(523, "Less than"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,11",
                            "n": mstrmojo.desc(524, "Less than or equal to"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,17",
                            "n": mstrmojo.desc(696, "Between"),
                            "t": 1,
                            "tp": 1
                        }
                    ],
                    "Element": [
                        {
                            "did": "1,22",
                            "n": mstrmojo.desc(2219, "In List"),
                            "t": 1,
                            "tp": 1
                        },
                        {
                            "did": "1,57",
                            "n": mstrmojo.desc(2220, "Not In List"),
                            "t": 1,
                            "tp": 1
                        }
                    ]
                },
                "validation": {
                        "requiredFieldError": mstrmojo.desc(6078, "This field is required."),
                        "invalidCharError": mstrmojo.desc(7899, "This field contains invalid characters for #."),
                        "invalidDateStringError": mstrmojo.desc(7900, "This field contains invalid date/time string."),
                        "invalidNumericFormatError": mstrmojo.desc(7901, "This field contains numeric value with incorrect format."),
                        "outofRangeError": mstrmojo.desc(6079, "This field should be # between ## and ###."),
                        "noLessMinError": mstrmojo.desc(6081,  "This field should be # greater than or equal to ##."),
                        "noGreaterMaxError": mstrmojo.desc(6080, "This field should be # less than or equal to ###."),
                        "failRegexTestError": mstrmojo.desc(6082, "This field failed regular expression validation."),
                        "invalidValueInListError": mstrmojo.desc(7902, "One of the value (#) in this list is not valid."),
                        "integerDataType": mstrmojo.desc(6076, "an Integer value"),
                        "numericDataType": mstrmojo.desc(6077, "a Number value"),
                        "dateDataType": mstrmojo.desc(7903, "a Date/Time value")
                },
            'color': {
                'colors': [
                    {'n': 'Black', 'v': '#000000'},
                    {'n': 'Brown', 'v': '#993300'},
                    {'n': 'Olive Green', 'v': '#333300'},
                    {'n': 'Dark Green', 'v': '#003300'},
                    {'n': 'Dark Teal', 'v': '#003366'},
                    {'n': 'Dark Blue', 'v': '#000080'},
                    {'n': 'Indigo', 'v': '#333399'},
                    {'n': 'Grey-80%', 'v': '#333333'},
                    {'n': 'Dark Red', 'v': '#800000'},
                    {'n': 'Orange', 'v': '#FF6600'},
                    {'n': 'Dark Yellow', 'v': '#808000'},
                    {'n': 'Green', 'v': '#008000'},
                    {'n': 'Teal', 'v': '#008080'},
                    {'n': 'Blue', 'v': '#0000FF'},
                    {'n': 'Blue-Grey', 'v': '#666699'},
                    {'n': 'Grey-50%', 'v': '#808080'},
                    {'n': 'Red', 'v': '#FF0000'},
                    {'n': 'Light Orange', 'v': '#FF9900'},
                    {'n': 'Lime', 'v': '#99CC00'},
                    {'n': 'Sea Green', 'v': '#339966'},
                    {'n': 'Aqua', 'v': '#33CCCC'},
                    {'n': 'Light Blue', 'v': '#3366FF'},
                    {'n': 'Violet', 'v': '#800080'},
                    {'n': 'Grey-40%', 'v': '#969696'},
                    {'n': 'Pink', 'v': '#FF00FF'},
                    {'n': 'Gold', 'v': '#FFCC00'},
                    {'n': 'Yellow', 'v': '#FFFF00'},
                    {'n': 'Bright Green', 'v': '#00FF00'},
                    {'n': 'Turquoise', 'v': '#00FFFF'},
                    {'n': 'Sky Blue', 'v': '#00CCFF'},
                    {'n': 'Plum', 'v': '#993366'},
                    {'n': 'Grey-25%', 'v': '#C0C0C0'},
                    {'n': 'Rose', 'v': '#FF99CC'},
                    {'n': 'Tan', 'v': '#FFCC99'},
                    {'n': 'Light Yellow', 'v': '#FFFF99'},
                    {'n': 'Light Green', 'v': '#CCFFCC'},
                    {'n': 'Light Turquoise', 'v': '#CCFFFF'},
                    {'n': 'Pale Blue', 'v': '#99CCFF'},
                    {'n': 'Lavender', 'v': '#CC99FF'},
                    {'n': 'White', 'v': '#ffffff'}
                ],
                'userPalette': [
                    {'n': '#F00E0E', 'v': '#F00E0E'},
                    {'n': '#080000', 'v': '#080000'},
                    {'n': '#E81A1A', 'v': '#E81A1A'},
                    {'n': '#6E0909', 'v': '#6E0909'},
                    {'n': '#4F2828', 'v': '#4F2828'},
                    {'n': '#141212', 'v': '#141212'},
                    {'n': '#D60202', 'v': '#D60202'},
                    {'n': '#C40404', 'v': '#C40404'}
                ]
                }

        	}
        );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.array",
                         "mstrmojo.hash");

    var $ARR = mstrmojo.array;

    function getTemplateProps(data) {

        var mx = $ARR.filter((data && data.gts && data.gts.col) || [], function (obj) {
            return obj.otp === -1;//#979181 obj.n may not equal to 'Metrics' by different language
        })[0];

        return {
            tpltProp: data.prop,
            mxProp: $ARR.map((mx && mx.es) || [], function (metric) {
                var o = {};

                o[metric.oid] = mstrmojo.hash.copy(metric.prop, {
                    n: metric.n,
                    t: metric.otp
                });
                return o;
            })
        };
    }

    /**
     * A mixin to augment widgets that render templates within Report Services Documents.
     *
     * @mixin
     */
    mstrmojo._IsDocumentTemplate = mstrmojo.provide(
        "mstrmojo._IsDocumentTemplate",

        /**
         * @lends mstrmojo._IsDocumentTemplate
         */
        {

            _mixinName: 'mstrmojo._IsDocumentTemplate',

            /**
             * The structure of the grid.
             *
             * @type {{rows: Array.<Object>, cols: Array.<Object>, mx: Array.<Object>, tma: int}}
             */
            gridInfo: null,

            tmsProps: null,

            update: function update(node) {

                if (node && node.data) {
                    // Get grid structure info.
                    this.gridInfo = node.data.gsi;

                    // get template properties
                    this.tmsProps = getTemplateProps(node.data);
                }

                if (this._super) {
                    return this._super(node);
                }

                return true;
            }
        }
    );
}());
/**
 * Singleton for adjusting layout configurations for consumers of the _HasLayout mixin based on DPI.
 *
 * @public
 */
mstrmojo.DPIManager = {

    /**
     * Collection of constructors to be modified.
     *
     * @type {Array.<{c:Function, d: String, s: String, v: Object}>}
     * @private
     */
    classes: [],

    /**
     * Registers a class that should be updated for DPI settings.
     *
     * @param {Function} clz The widget constructor to be modified.
     * @param {String} dimension The layout dimension to modify (h for height, w for width).
     * @param {String} slot The slot to modify.
     * @param {Object} dpiValues An object with a property for each possible DPI with the correct value for that DPI.
     */
    registerClass: function registerClass(clz, dimension, slot, dpiValues) {
        // Add this class to the classes collection.
        this.classes.push({
            c: clz,
            d: dimension,
            s: slot,
            v: dpiValues
        });
    },

    /**
     * Modifies previously registered classes.
     */
    setDPI: function () {
        // Get device DPI.
        var dpi = mstrMobileApp.getDeviceDPI();

        mstrmojo.array.forEach(this.classes, function (clz) {
            // Store DPI value on layout config.
            clz.c.prototype.layoutConfig[clz.d][clz.s] = clz.v[dpi] + 'px';
        });

        // Reset collection of classes.
        this.classes = [];
    }
};

(function () {

    // TQMS #888901: Turn on float metrics so _HasLayout works in IE10.
    document.msCSSOMElementFloatMetrics = true;

    mstrmojo.requiresCls("mstrmojo.hash");

    var $HASH = mstrmojo.hash,
        defaultSlot = 'containerNode',
        auto = 'auto',
        px = 'px';

    /**
     * The layout sizing info for a slot with no layout.
     *
     * @type {{v: string, c: undefined, sv: string}}
     * @static
     */
    var autoBlock = {
        v: auto,
        c: undefined,
        sv: auto
    };

    /**
     * <p>Calculates and returns the new height (or width) for the child.</p>
     *
     * <p>NOTE: Children in auto slots and percentage slots (if onlyPercentageSlots == true) will return the value from their height or width property.</p>
     *
     * @param {mstrmojo.Widget} child The child whose dimension should be calculated.
     * @param {string} dimension The dimension to calculate, either 'h' or 'w'.
     * @param {Boolean} onlyPercentageSlots True if the dimensions should be calculated for only percentage slots.
     *
     * @returns String The value for the indicated dimension (in pixels or 'auto').
     */
    function calcChildDimension(child, dimension, onlyPercentageSlots) {
        var dim = this._layoutWidgets[dimension],
            slot = child.slot || defaultSlot,
            fixedSlots = dim.f,
            percentageSlots = dim.p,
            isFixed = (fixedSlots && fixedSlots[slot] !== undefined),
            isPercent = (percentageSlots && percentageSlots[slot] !== undefined);

        // Does this child have a fixed or percentage slot, or only a percentage slot if onlyPercentageSlot is true?
        if (slot && ((!onlyPercentageSlots && isFixed) || isPercent)) {
            // Return the calculated size of this widget (either fixed or a percentage of the available height).
            return isFixed ? fixedSlots[slot] : (dim.x * parseInt(percentageSlots[slot], 10) / 100) + px;
        }

        return child[(dimension === 'h') ? 'height' : 'width'];
    }

    /**
     * Applies the height and width to the child.
     *
     * @param {mstrmojo._HasLayout|mstrmojo._Provider} child The child widget whose dimensions will be set.
     * @param {string} h The height of the child (in pixels, e.g. '31px').
     * @param {string} w The width of the child (in pixels, e.g. '31px').
     *
     */
    function applyChildDimensions(child, h, w) {
        // Does the child wish to ignore layout?
        if (child.ignoreLayout) {
            // Nothing to do.
            return;
        }

        // Check for auto.
        var hAuto = (h === auto) || h === 'NaNpx',
            wAuto = (w === auto) || w === 'NaNpx';

        // Does the child have offsets?
        var offsets = child.getLayoutOffsets && child.getLayoutOffsets();

        if (offsets) {
            // Is height NOT auto?
            if (!hAuto) {
                // Reduce height by height offset.
                h = (parseInt(h, 10) - offsets.h) + px;
            }

            // Is width NOT auto?
            if (!wAuto) {
                // Reduce width by width offset.
                w = (parseInt(w, 10) - offsets.w) + px;
            }
        }

        // Does the child have a setDimensions method?
        if (child.setDimensions) {

            // Set dimensions on child.
            child.setDimensions(h, w);
        } else {

            // Child doesn't have a setDimensions method so use "set" method.
            if (child.set) {
                if (!hAuto) {
                    child.set('height', h);
                }

                if (!wAuto) {
                    child.set('width', w);
                }
            }
        }
    }

    /**
     * <p>Applies calculated dimensions to slots and children by iterating children.</p>
     *
     * <p>This is the original default layout style where dimensions are only applied to slots that have children.</p>
     *
     * @param {Boolean} onlyPercentageSlots True if dimensions should be applied to percentage slots only, False to apply to both percentage and fixed slots.
     *
     * @private
     */
    function applyDimensionsFromChildren(onlyPercentageSlots) {
        var ch = this.children,
            i,
            len;

        // Iterate children again.
        for (i = 0, len = (ch && ch.length) || 0; i < len; i++) {
            var child = ch[i],
                slot = child.slot || defaultSlot;

            // Do we have a slot?
            if (slot) {
                // Get child sizes.
                var h = /** @type {string} **/ calcChildDimension.call(this, child, 'h', onlyPercentageSlots),
                    w = /** @type {string} **/ calcChildDimension.call(this, child, 'w', onlyPercentageSlots);

                // Apply initial slot dimensions.
                this.setSlotDimensions(slot, h, w);

                // Apply the sizes.
                applyChildDimensions(child, h, w);

                // Calculate child sizes again?
                var zh = /** @type {string} **/ calcChildDimension.call(this, child, 'h', onlyPercentageSlots),
                    zw = /** @type {string} **/ calcChildDimension.call(this, child, 'w', onlyPercentageSlots);

                // Did either dimension change?  This should only happen if auto slot to repaints when it (or a siblings) dimensions are applied.
                if (zh !== h || zw !== w) {
                    // Apply new sizes.
                    applyChildDimensions(child, zh, zw);
                }

                // Set the dimension on the slot (using new dimensions in case they changed).
                this.setSlotDimensions(slot, zh, zw);
            }
        }

        // Call the afterLayout handler.
        this.afterLayout();
    }

    /**
     * <p>Applies calculated dimensions to slots and children by iterating slots.</p>
     *
     * <p>This is a new experimental style where dimensions are applied to all slots, regardless of the presence of children.</p>
     *
     * @private
     */
    function applyDimensionsFromSlots() {
        var children = this.children,
            layoutWidgets = this._layoutWidgets;

        // Iterate all slots.
        $HASH.forEach(this.slotNames, function (isRendered, slot) {
            // Is the slot not rendered yet?
            // TQMS 972710: Or, is the slot unavailable for layout in current widget state?
            if (!isRendered || this.skipsSlotLayout(slot)) {
                // Skip this slot.
                return;
            }

            // Get slot size.
            var h = (layoutWidgets.h && layoutWidgets.h.getSlotSizeInfo(slot, children)) || autoBlock,
                w = (layoutWidgets.w && layoutWidgets.w.getSlotSizeInfo(slot, children)) || autoBlock,
                slotChildren = h.c || w.c;

            mstrmojo.array.forEach(slotChildren, function (slotChild) {
                // Apply the sizes to the child.
                applyChildDimensions(slotChild, h.v, w.v);
            });

            // Set the dimension on the slot.
            this.setSlotDimensions(slot, h.sv, w.sv);
        }, this);

        // Call the afterLayout handler.
        this.afterLayout();
    }

    /**
     * Applies dimensions to children and slots.
     *
     * @private
     */
    function applyDimensions(onlyPercentageSlots) {
        // Decide which style to use.
        var fn = this.layoutConfig.xt ? applyDimensionsFromSlots : applyDimensionsFromChildren;
        fn.call(this, onlyPercentageSlots);
    }

    /**
     * Adjusts the size of any percentage slots in the supplied container to account for newly rendered auto slots.
     *
     * @param {mstrmojo.Widget} child The newly rendered child.
     * @param {Object} lw The layout widget properties created during calculateDimension.
     * @param {string} d The dimension, either height or width.
     *
     * @private
     */
    function adjustDimension(child, lw, d) {
        // Which slot?
        var slot = child.slot || defaultSlot,
            autoSlots = lw && lw.a;

        // Is this NOT an 'auto' slot?
        if (!autoSlots || autoSlots[slot] === undefined) {
            // No, then return.
            return;
        }

        // Measure the size of the newly rendered slot.
        var x = this[slot]['offset' + d],
            size = autoSlots[slot];

        // Is the new size the same as the old size?
        if (x === size) {
            // No changes.
            return;
        }

        // Adjust the current dimension size by the delta of the old size and the new size.
        lw.x -= (x - size);

        // Store the new slot size.
        autoSlots[slot] = x;
    }

    /**
     * <p>Adjusts the layout to account for newly rendered children.</p>
     *
     * @param {mstrmojo.Event} evt The "childrenRendered" event.
     *
     * @private
     */
    function adjustLayout(evt) {
        // Call the beforeLayout handler.
        this.beforeLayout();

        var lw = this._layoutWidgets,
            child = evt.src;

        // Calculate adjusted dimensions for the newly rendered child.
        adjustDimension.call(this, child, lw.h, 'Height');
        adjustDimension.call(this, child, lw.w, 'Width');

        applyDimensions.call(this, true);
    }


    /**
     * Calculates and returns the dimensions for the containers slots and child widgets.
     *
     * @param {Object} dimensionConfig The layout config for this dimension.
     * @param {string} dimension The dimension to calculate, either 'Height' or 'Width' (case sensitive).
     *
     * @private
     * @returns {Object} An object with the following properties:
     * <dl>
     *  <dt>f</dt>
     *  <dd>An object containing fixed slots and their current size value.</dd>
     *  <dt>p</dt>
     *  <dd>An object containing percentage slots and their current size value.</dd>
     *  <dt>a</dt>
     *  <dd>An object containing auto slots and their current size value (zero since they haven't been measured yet).</dd>
     *  <dt>x</dt>
     *  <dd>The current size of this widget that will be devoted to percentage slots.</dd>
     * </dl>
     */
    function calculateDimension(dimensionConfig, dimension) {
        // Do we NOT have layout in this dimension?
        if (!dimensionConfig) {
            // Nothing to do.
            return null;
        }

        var ch = this.children,
            lcDimension = dimension.toLowerCase(),
            widgetDimensionValue = parseInt(this[lcDimension], 10),                     // The total size of this widget dimension (height or width).
            widgetRawValue = widgetDimensionValue,
            fixedSlots = {},
            percentageSlots = {},
            autoSlots = {},
            autoSlotValues = {},
            allSlots = {},
            i,
            len,
            child,
            v,
            slot;

        // Step through all slots in the layoutConfig dimension.
        for (slot in dimensionConfig) {
            if (!dimensionConfig.hasOwnProperty(slot)) {
                continue;
            }

            // The value for this slot.
            v = dimensionConfig[slot];

            // Is the value fixed for this slot?
            if (v.match(/px$/)) {
                // Reduce the total size by the amount of this slots fixed size.
                widgetDimensionValue -= parseInt(v, 10);

                // Store this slot as fixed.
                fixedSlots[slot] = v;

            // Is the value a percentage for this slot?
            } else if (v.match(/%$/)) {
                // Store this slot as a percentage.
                percentageSlots[slot] = v;

            // Is the value "all"?
            } else if (v.match(/all/)) {
                allSlots[slot] = widgetRawValue;

            // Otherwise, it's an auto value.
            } else {
                autoSlots[slot] = v;
            }
        }

        // Where both auto and percentage slots found?
        if (!$HASH.isEmpty(autoSlots) && !$HASH.isEmpty(percentageSlots)) {
            // Iterate the children.
            for (i = 0, len = (ch && ch.length) || 0; i < len; i++) {
                child = ch[i];
                slot = child.slot || defaultSlot;

                // Does this child have an auto slot and is it not ignoring layout?
                if (slot && autoSlots[slot] && !child.ignoreLayout) {
                    // Has it rendered?
                    if (child.hasRendered) {
                        autoSlotValues[slot] = this[slot]['offset' + dimension];

                        // Reduce the measured height by the offsetHeight of the slot.
                        widgetDimensionValue -= autoSlotValues[slot];

                    } else {
                        // Cache the slot of this widget for later measurement.
                        autoSlotValues[slot] = 0;

                        // Add event listener to hear when this component is done rendering.
                        child.attachEventListener((child instanceof mstrmojo.Container) ? 'childrenRendered' : 'renderComplete', this.id, adjustLayout);
                    }
                }
            }
        }

        // Return measurements.
        return {
            f: $HASH.isEmpty(fixedSlots) ? undefined : fixedSlots,
            p: $HASH.isEmpty(percentageSlots) ? undefined : percentageSlots,
            a: $HASH.isEmpty(autoSlotValues) ? undefined : autoSlotValues,
            n: $HASH.isEmpty(allSlots) ? undefined : allSlots,
            x: widgetDimensionValue,
            getSlotSizeInfo: function (slot, children) {
                // Is there no layout for this slot?
                if (!dimensionConfig[slot]) {
                    // Return auto values.
                    return autoBlock;
                }

                // Look for child and initialize return values.
                var slotChildren = mstrmojo.array.filter(children, function (child) {
                        var childSlot = child.slot;
                        return childSlot === slot || (slot === defaultSlot && !childSlot);
                    }),
                    slotValue,
                    value;

                // Is this a fixed slot?
                var fixedValue = fixedSlots[slot];
                if (fixedValue) {
                    // Set value to fixed value.
                    value = fixedValue;
                }

                // Is this a percent slot?
                var percentValue = percentageSlots[slot];
                if (percentValue) {
                    // Set value to calculated value (percentage of available space).
                    value = (this.x * parseInt(percentValue, 10) / 100) + px;
                }

                // Is this an auto slot?
                if (autoSlots[slot]) {
                    // Do we have a value for this auto slot?
                    value = autoSlotValues[slot];
                    if (value) {
                        // Add unit.
                        value += px;
                    } else {
                        value = auto;
                    }

                    // Slot value should be auto.
                    slotValue = auto;
                }

                // Is this an all slot?
                var allSlotValue = allSlots[slot];
                if (allSlotValue) {
                    // Value and slot value will be entire dimension size.
                    value = slotValue = allSlotValue + px;
                }

                // Default to zero.
                value = value || '0px';

                return {
                    v: value,
                    c: slotChildren,
                    sv: slotValue || value
                };
            }
        };
    }

    /**
     * Updates the dimension on the domNode and calls doLayout.
     *
     * @param {string} dimension The dimension to update, either "height" or "width".
     */
    function handleDimensionChange(dimension) {
        var dn = this.domNode;
        if (!dn || !this.layoutConfig) {
            return;
        }

        dn.style[dimension] = this[dimension];
        this.doLayout();
    }

    /**
     * <p>A mixin for applying "layout" to a widget, it's slots and children within those slots.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._HasLayout = mstrmojo.provide(
        'mstrmojo._HasLayout',

        /**
         * @lends mstrmojo._HasLayout
         */
        {
            _mixinName: 'mstrmojo._HasLayout',

            /**
             * The inner height of the entire widget.
             *
             * @type String
             * @default auto
             */
            height: 'auto',

            /**
             * The inner width of the entire widget.
             *
             * @type String
             * @default auto
             */
            width: 'auto',

            /**
             * Indicates if this child should be ignored by it's parent for calculating slot layout.
             *
             * @type Boolean
             * @default false
             */
            ignoreLayout: false,

            /**
             * A custom hook that will be called before the widget is laid out.
             */
            beforeLayout: mstrmojo.emptyFn,

            /**
             * A custom hook that will be called after the widget is laid out.
             */
            afterLayout: mstrmojo.emptyFn,

            /**
             * <p>The configuration object for the layout of this component.</p>
             *
             * <p>This object has two optional properties: h (for height) and w (for width).  The values of these properties are an Object with any number
             * of properties.  Each property name corresponds to a slot within the component and it's value can either be fixed (in pixels), a percentage
             * (with % sign), auto or all.</p>
             *
             * <p>For example:</p>
             *
             * <pre>{
             *         h: {
             *             top: '31px',
             *             containerNode: '100%',
             *             bottom: 'auto',
             *             gutter: 'all'
             *         }
             * }</pre>
             *
             * <p>This configuration would set the top slot to have a height of 31 pixels, the bottom slot would be auto (or fit to content), the
             * containerNode height would expand to occupy whatever space is not occupied by the top and bottom and the gutter slot would be equal
             * to the entire eight of the component (or the sum of the top, containerNode and bottom slots).</p>
             *
             * <p><b>NOTE:</b> To do this, the bottom slot would be measured after it's children render and the height of the container node would
             * be adjusted by the measured height of the bottom slot.</p>
             *
             * <p>Adding an "xt" property with a value of true to the layoutConfig will signal that the widget wants to use a new
             * and improved layout style that will layout it's slots regardless of whether there are children or not.</p>
             *
             * @type {{h: {}, v: {}, xt: boolean}}
             */
            layoutConfig: null,

            init: function init(props) {
                this._super(props);

                // Clone the layout config so all instances won't share the same layout config.
                this.layoutConfig = $HASH.clone(this.layoutConfig);
            },

            preBuildRendering: function preBuildRendering() {
                var cssText = this.cssText || '';

                var height = this.height;
                if (height && height !== auto) {
                    cssText += 'height:' + this.height + ';';
                }

                var width = this.width;
                if (width && width !== auto) {
                    cssText += 'width:' + this.width + ';';
                }

                this.cssText = cssText;

                return (this._super) ? this._super() : true;
            },

            postBuildRendering: function postBuildRendering() {
                // Layout all child components.
                this.doLayout();

                return this._super();
            },

            /**
             * Modifies the existing layout configuration and then lays out all children.
             *
             * @param {Object.<string, string>=} hConfig The horizontal configuration nodes to change.
             * @param {Object.<string, string>=} vConfig The vertical configuration nodes to change.
             */
            modifyLayoutConfig: function modifyLayoutConfig(hConfig, vConfig) {
                // Clone the existing config because it may be static.
                var cfg = this.layoutConfig = this.layoutConfig || {};

                // Copy new configuration properties to layout.
                cfg.h = $HASH.copy(hConfig, cfg.h);
                cfg.w = $HASH.copy(vConfig, cfg.w);

                // Perform layout again.
                this.doLayout();
            },

            /**
             * Returns an object containing the height and width amounts that dimensions for this objects should be reduced
             * to account for borders, margin and padding.
             *
             * @returns {{h: int, w: int}}
             * @abstract
             */
            getLayoutOffsets: mstrmojo.emptyFn,

            set: function set(n, v) {
                // TQMS 1005458: Previously we attach an "visibleChange" event handler.
                // However, when it's invoked, the markup method is not called yet and thus the DOM subtree is still invisible.
                // Now we simply set a flag and override 'set' in _HasMarkup to handle visible change.
                var ret = this._super(n, v);
                if (n === 'visible' && this._pendingLayoutOnVisible) {
                    delete this._pendingLayoutOnVisible;
                    this.doLayout();
                }

                return ret;
            },

            /**
             * Lays out the children and slots of this widget.
             */
            doLayout: function doLayout() {
                // Do we NOT have a layout config OR are BOTH height and width still set to auto?
                var lc = this.layoutConfig;
                if (!lc || (this.height === auto && this.width === auto)) {
                    // No reason to perform layout (yet).
                    return;
                }

                // Is this the new style of layout?
                if (lc.xt) {
                    // Is the widget NOT visible?
                    if (!this.visible) {
                        // TQMS 1005458: Previously we attach an "visibleChange" event handler.
                        // However, when it's invoked, the markup method is not called yet and thus the DOM subtree is still invisible.
                        // Now we simply set a flag and intercept 'set' to handle visible change.
                        this._pendingLayoutOnVisible = true;

                        // Do not layout at this time.
                        return;
                    }
                }

                // Call the beforeLayout handler.
                this.beforeLayout();

                // Initialize the _layoutWidgets collection.
                this._layoutWidgets = {
                    h: calculateDimension.call(this, lc.h, 'Height'),
                    w: calculateDimension.call(this, lc.w, 'Width')
                };

                // Apply the dimensions.
                applyDimensions.call(this, false);

                // Call the custom hook to denote that the widget was resized.
                this.widgetResized();
            },

            browserResized: function browserResized(size) {
                // Call set dimensions.
                this.setDimensions(size.h, size.w);

                return true;
            },

            /**
             * Sets the width of the domNode and then calls doLayout.
             */
            onwidthChange: function onwidthChange() {
                handleDimensionChange.call(this, 'width');
            },

            /**
             * Sets the height of the domNode and then calls doLayout.
             */
            onheightChange: function onheightChange() {
                handleDimensionChange.call(this, 'height');
            },

            /**
             * Determines if we want to skip the slot during layout for the current widget state.
             * @param slotName
             * @returns {boolean}
             */
            skipsSlotLayout: function (slotName) {
                return false;
            },

            /**
             * <p>This method will adjust the layout dimensions of the parent.</p>
             *
             * <p>This method will NOT reapply the dimensions.  This method is intended to be used during layout when the application of dimension values to this child
             * require that the parent's slot values be adjusted.  Use with care.</p>
             *
             * @deprecated Suspect it's no longer used.
             */
            adjustParentDimensions: function adjustParentDimensions() {
                var p = this.parent,
                    lw = p && p._layoutWidgets;

                // Does the parent have widgets to be laid out.
                if (lw) {
                    // Adjust the parents dimensions.
                    adjustDimension.call(p, this, lw.h, 'Height');
                    adjustDimension.call(p, this, lw.w, 'Width');
                }
            },

            /**
             * Changes the widget dimensions and calls doLayout.
             *
             * @param {string} h The height of the widget in pixels, e.g. '31px'.
             * @param {string} w The width of the widget in pixels, e.g. '31px'.
             *
             * @returns {Boolean} True if either dimension changed, False if neither did.
             */
            setDimensions: function setDimensions(h, w) {
                var hAuto = (h === auto) || h === 'NaNpx',
                    wAuto = (w === auto) || w === 'NaNpx';

                // Has the height or width changed (excluding auto)?

                // TQMS# 972403 Normalize the height and widths before comparison.  Unfortunately due to a change made in Vis.js in 2011
                //              visualizations store their height and width WITHOUT the "px".  The rest of Mojo does the opposite.

                if ((!hAuto && parseInt(this.height, 10) !== parseInt(h, 10)) || (!wAuto && parseInt(this.width, 10) !== parseInt(w, 10))) {
                    // Set new dimensions on instance.
                    if (!hAuto) {
                        this.height = h;
                    }

                    if (!wAuto) {
                        this.width = w;
                    }

                    // Do we have a DOM node?
                    var dn = this.domNode,
                        dnStyle = dn && dn.style;

                    if (dnStyle) {
                        // Resize DOM node.
                        if (!hAuto) {
                            dnStyle.height = h;
                        }

                        if (!wAuto) {
                            dnStyle.width = w;
                        }

                        // Layout children.
                        this.doLayout();
                    }

                    return true;
                }

                return false;
            },

            /**
             * Sets the height and width for the supplied slot.
             *
             * @param {string} slot The name of the slot whose dimension should be set.
             * @param {string=} h The new height value in pixels, e.g. '31px'.
             * @param {string=} w The new width value in pixels, e.g. '31px'.
             */
            setSlotDimensions: function setSlotDimensions(slot, h, w) {
                // Does the slot not have a style collection?
                var sl = this[slot] && this[slot].style;
                if (!sl) {
                    // Nothing to do.
                    return;
                }

                // Is the height NOT auto AND NOT undefined (IE compatible required check) and does it NOT match the current height?
                if (h !== auto && h !== undefined && h !== 'NaNpx' && sl.height !== h && parseInt(h) >= 0) {
                    // Apply the height.
                    sl.height = h;
                }

                // Is the width NOT auto AND NOT undefined (IE compatible required check) and does NOT match the current width?
                if (w !== auto && w !== undefined && w !== 'NaNpx' && sl.width !== w && parseInt(w) >= 0) {
                    // Apply the width.
                    sl.width = w;
                }
            }

        }
    );

    /**
     * Static method to get slot size once the device DIP is used to change the layout config height/width.
     *
     * @param {mstrmojo._HasLayout} constructor The constructor whose layout is requested.
     * @param {string} slot The slot whose layout is requested.
     *
     * @returns {{h: string, w: string}}
     * @static
     */
    mstrmojo._HasLayout.getSlotSize = function getSlotSize(constructor, slot) {
        var layoutCfg = constructor && constructor.prototype.layoutConfig;
        if (layoutCfg) {
            var h = layoutCfg.h,
                w = layoutCfg.w;

            return {
                h: (h && h[slot]) || undefined,
                w: (w && w[slot]) || undefined
            };
        }

        return null;
    };

}());
(function () {

    mstrmojo.requiresCls(
        "mstrmojo.hash",
        "mstrmojo.array"
    );

    mstrmojo.requiresDescs(5421, 5422);

    var $HASH = mstrmojo.hash,
        $ARR = mstrmojo.array,
        $DESC = mstrmojo.desc;

    function createDEParam(w, cell, /*td, isSingleCellClick,*/ isEdit, funcVal) {
        var selCells = w.selCells,
            elemsStr = [],
            titleInfo = w.model.getCellTitleInfo(cell).title,
            dpt,
            order,
            processCell = function (cell) {
                var cInfo = w.getCellForNode(cell);
                elemsStr.push(w.getCellUnitIndex(cInfo));
                dpt = cInfo.dpt;
            },
            switchFlag;

        if (typeof funcVal === 'string' && funcVal.indexOf(';') > 0) {   //calculation minus or divde
            order = parseInt(funcVal.substring(funcVal.indexOf(';') + 1), 10);
            funcVal = parseInt(funcVal.substring(0, funcVal.indexOf(';')), 10);
        }

        if (order === 1 && !isEdit) {
            selCells.reverse().forEach(processCell);
        } else if (order === 1) {     //isEdit = true
            //add a switch flag
            switchFlag = 1;
            selCells.forEach(processCell);
        } else {
            selCells.forEach(processCell);
        }

        return {
            oId: titleInfo.id,
            oTp: titleInfo.otp,
            depth: dpt,
            ordinals: elemsStr.join(','),
            sliceId: w.sid,
            viewKey: w.k,
            funcVal: funcVal,
            switchOrder: switchFlag
        };
    }

    function createDE(w, cell, funcVal) {
        var deInfo = w.getDEInfo(cell),
            deItems = deInfo && deInfo.deObject && deInfo.deObject.des,
            newItemTag = 1,
            newItemName = funcVal === -1 ? $DESC(5187, 'Group') :$DESC(5188, 'Calculation'),
            hasSameName = function (item) {
                return item.n === newItemName + ' ' + newItemTag;
            };
        while(true && deItems) {
            if (deItems.some(hasSameName)) {
                newItemTag++;
            } else {
                break;
            }
        }
        w.controller.onAddQuickDE(w, $HASH.copy(createDEParam(w, cell, false, funcVal), {
            act: 'addQuickDE',
            deName: newItemName + ' ' + newItemTag
        }));
    }

    function setDEHierachyOptions(w, cell, de, splice, expand) {
        var titleInfo = w.model.getCellTitleInfo(cell).title;
        w.controller.onSetDEHierachyOptions(w, {
            act: 'setDEHierarchyOptions',
            oId: titleInfo.id,
            eId: de.id,
            splice: splice,
            expand: expand
        });
    }

    /**
     * <p>A collection of methods for supporting Xtab Derived Elements</p>
     *
     * @type {Object}
     * @mixin
     */
    mstrmojo.vi.ui.rw._XtabDE = mstrmojo.provide(
        'mstrmojo.vi.ui.rw._XtabDE',

        /**
         * @lends mstrmojo.vi.ui.rw._XtabDE
         */
        {
            scriptClass: "mstrmojo.vi.ui.rw._XtabDE",

            /**
             * Invoke add quick group on controller.
             *
             * @param {Object} data
             */
            derivedElementGroup: function derivedElementGroup(data) {
                createDE(this, data, -1);
            },

            derivedElementCalculation: function derivedElementCalculation(data, funcVal) {
                createDE(this, data, funcVal);
            },

            separateOthers: function separateOthers(data, de) {
                setDEHierachyOptions(this, data, de, 1, 1);
            },

            renameDEList: function renameDEList(data) {
                this.controller.onEditQuickDEList(this, $HASH.copy(createDEParam(this, data, true, -1), {
                    act: 'editQuickDEList',
                    deName: data.v
                }));
            },

            editQuickDECalculationNumberFormat: function editQuickDECalculationNumberFormat(data, prop) {
                var action = createDEParam(this, data);
                action.deId = prop.de.id;
                action.act = 'editQuickDECalculationNumberFormat';
                this.controller.editQuickDECalculationNumberFormat(this, $HASH.copy(action, this.model.docModel.createNumberFormatParams(prop)));
            },

            editDECalculation: function editDECalculation(data, funcVal) {
                if (funcVal !== undefined && funcVal !== null) {
                    this.controller.editQuickDECalculation(this, $HASH.copy(createDEParam(this, data, true, funcVal), {
                        act: 'editQuickDECalculation'
                    }));
                } else {
                    this.controller.onEditQuickDECalculation(this, $HASH.copy(createDEParam(this, data, true), {
                        act: 'editQuickDECalculation',
                        deName: data.v
                    }));
                }
            },

            removeQuickDE: function removeQuickDE(data) {
                this.controller.removeQuickDE(this, $HASH.copy(createDEParam(this, data), {
                    act: 'removeQuickDE'
                }));
            },

            derivedElementsEdit: function derivedElementsEdit(cell, deInfo) {
                if (!deInfo) {
                    deInfo = this.getDEInfo(cell);
                }
                var model = this.model,
                    ttlCell = model.getCellTitleInfo(cell).title,
                    deObj = deInfo && deInfo.deObject,
                    de = deInfo && deInfo.de,
                    dsId,
                    attId,
                    attName;

                if (!deObj) {
                    dsId = this.gridData.datasetId;
                    attId = ttlCell.id;
                    attName = ttlCell.n;
                }
                this.controller.openDEEditor(this, {
                    dsId: dsId,
                    attId: attId,
                    attName: attName,
                    deObj: deObj,
                    elemId: de && de.id,
                    dispName: cell.n
                });
            },

            /**
             * Finds a Derived Elements Object corresponding to the given grid cell
             * @param cell {Object} A grid cell.
             * @returns {mstrmojo.vi.models.DEObjectType}
             */
            getDEInfo: function getDEInfo(cell) {
                var model = this.model,
                    ttl = model.getCellTitleInfo(cell).title,
                    dei = cell.dei,
                    deObject,
                    de;
                if (ttl.ost !== 0x2f01) { //DssXmlSubTypeConsolidationManaged
                    return null;
                }
                deObject = model.docModel.getDEObject(ttl.id);
                if (deObject && dei !== undefined) {
                    de = deObject.des[dei];
                }
                return {
                    deObject: deObject,
                    de: de,
                    ttl: ttl
                };
            },

            getOthersDEInfo: function getOthersDEInfo(deObject) {
                var res;
                $ARR.forEach(deObject.des, function (de) {
                    if (de.t === 4) {
                        res = de;
                        return false;
                    }
                });
                return res;
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.hash",
                         "mstrmojo.array");

    /**
     * <p>Hashtable of subscriptions with callbacks to method names, keyed by publisher ID.</p>
     *
     * <p>The "subs" hashtable maps a publisher ID to the event names for which that publisher has subscriptions.
     * The event names are stored in a hashtable, which is keyed by event name.  That event hashtable, in turn,
     * maps an event name to the listener IDs for that event.  Each listener ID represents an object which wishes to
     * be notified when that given event name is published by the given publisher ID.  The list of listener IDs is
     * a hashtable as well, keyed by listener ID, where key value is a list of callbacks to that listener.  Generally,
     * a listener maybe ask for multiple callbacks, each of which may be either a method name or a Function object.
     * This hashtable stores these callbacks in an object with properties "methods" and "functions".
     * Note that an empty listener ID ("") is used to store callbacks to global methods.</p>
     *
     * <p>In summary, the hashtable's internal structures look like this:</p>
     * <pre>
     * subs[publisherId][evtName][listenerId] = {
     *  methods: {
     *    "methodName1": true,
     *    "methodName2": true,
     *    ..
     *  },
     *  functions: [
     *    Function1,
     *    Function2,
     *    ..
     *  ]
     * }
     * </pre>
     *
     * @type Object
     * @private
     * @static
     */
    var _subs = {};

    /**
     * A map of listeners so that we can release subscriptions when a listening instance is destroyed.
     *
     * @type Object
     * @private
     * @static
     */
    var _listenerMap = {};

    /**
     * <p>A publish-and-subscribe system for broadcasting events to observable objects in a mojo application.</p>
     *
     * @namespace mstrmojo.publisher
     */
    mstrmojo.publisher = mstrmojo.provide(
        "mstrmojo.publisher",

        /**
         * @lends mstrmojo.publisher
         */
        {
            /**
             * <p>Notifies subscribers of an event occurrence.</p>
             *
             * <p>All subscribers to that object's event will receive the data via whatever callback they used to subscribe.</p>
             *
             * @param {String} id The ID of the object that is publishing this event.
             * @param {String} type The name of the event to publish.
             * @param {Object} data The event occurrence information.
             */
            publish: function pub(id, type, data) {
                // Retrieve the hash of listener ids for this publisher + event combo.
                var ls = _subs[id] && _subs[id][type],
                    lid;
                if (!ls) {
                    return;
                }

                // Notify the listeners.
                for (lid in ls) {
                    // Get a handle to the listener, if any.
                    var l = null;
                    if (lid) {
                        l = mstrmojo.all[lid];
                        //A safty check for the case when the same listener was added several times.
                        //The optimization in the clearSubscriptions - using the listener to source map
                        //doesn't remove a listener if it was added more then once. This code will clean
                        //such orphan subscriptions.
                        if (!l) {
                            delete ls[lid];
                            continue;
                        }
                    }
                    // Call the methods subscribed on that listener.
                    var ns = ls[lid].methods;
                    if (ns) {
                        // If we have a listener object, call its method.
                        // Without a listener, use the global context.
                        var ctxt = l || mstrmojo.global,
                            n;
                        for (n in ns) {
                            if (ctxt[n]) {
                                ctxt[n](data);
                            }
                        }
                    }
                    // Call the Functions subscribed on that listener.
                    // Notify them in reverse order in case some callback deletes a callback.
                    // Also do a null check on ls[lid] because method callbacks above may have
                    // removed it from the listener hash.
                    var fs = ls[lid] && ls[lid].functions,
                        flen = (fs && fs.length) || 0;
                    if (flen) {
                        var i;
                        if (l) {
                            // If we have a listener object, apply the Function to it.
                            for (i = flen - 1; i > -1; i--) {
                                if (fs[i]) {
                                    fs[i].apply(l, [data]);
                                }
                            }
                        } else {
                            // Without a listener object, just call the Function directly.
                            // We avoid using apply() here for performance.
                            for (i = flen - 1; i > -1; i--) {
                                if (fs[i]) {
                                    fs[i](data);
                                }
                            }
                        }
                    }

                }
            },

            /**
             * <p>Requests that an object be notified of a future event in another object.</p>
             *
             * @param {String} id The ID of the object that will do the publishing.
             * @param {String} type The type of the event that will be listened for.
             * @param {Function|String} callback Either a Function, or the name of a listener method, to call when the event is published.
             * @param {String} [listener] ID of the listener to be notified when the given event is published. If missing, the global context is assumed to be the listener.
             *
             * @returns {Object} A newly generated identifier (Object) for this subscription, which can then be used to call unsubscribe() later.
             */
            subscribe: function sub(id, type, callback, listener) {

                // Validate publisher's hash.
                var s = _subs[id];
                if (!s) {
                    s = {};
                    _subs[id] = s;
                }

                // Validate publisher's event's hash.
                var e = s[type];
                if (!e) {
                    e = {};
                    s[type] = e;
                }

                // Validate publisher's event's listener's hash.
                var l = e[listener || ""];
                if (!l) {
                    l = {};
                    e[listener || ""] = l;
                }

                // Record the callback under either "methods" or "functions", depending on type.
                if (typeof callback  === "function") {
                    var fs = l.functions;
                    if (!fs) {
                        fs = [];
                        l.functions = fs;
                    }
                    fs.push(callback);
                } else {
                    // Assume callback is a String; a method name.
                    var ms = l.methods;
                    if (!ms) {
                        ms = {};
                        l.methods = ms;
                    }
                    ms[callback] = true;
                }

                // Performance optimization: To enable a reverse lookup, record a map from listener to publisher.
                var lmap = _listenerMap,
                    pmap = lmap[listener || ""];
                if (!pmap) {
                    pmap = {};
                    lmap[listener || ""] = pmap;
                }
                var emap = pmap[id];
                if (!emap) {
                    emap = {};
                    pmap[id] = emap;
                }
                emap[type] = true;


                // Return a handle to this subscription to use for unsubscribing later.
                return {
                    id: id,
                    type: type,
                    callback: callback,
                    listener: listener,
                    clear: function () {
                        mstrmojo.publisher.unsubscribe(this);
                    }
                };
            },

            /**
             * <p>Cancels a subscription created by calling the subscribe() method.</p>
             *
             * @param {Object} sub The subscription object provided by the subscribe() call.
             */
            unsubscribe: function unsub(sub) {
                var s = _subs[sub.id],
                    e = s && s[sub.type],
                    l = e && e[sub.listener || ""];
                if (!l) {
                    return;
                }

                var A = mstrmojo.array,
                    H = mstrmojo.hash,
                    tp = typeof sub.callback,
                    cleanupListener = false;
                if (tp === "function") {
                    // Remove the callback from the functions array.
                    var fs = l.functions;
                    if (fs) {
                        A.removeItem(fs, sub.callback);
                        if (!fs.length) {
                            // If array now empty, remove it.
                            delete l.functions;
                            // If no callbacks remain, remove listener id.
                            if (H.isEmpty(l.methods)) {
                                cleanupListener = true;
                            }
                        }
                    }
                } else {
                    // Remove the callback from the methods hash.
                    var ms = l.methods;
                    if (ms) {
                        delete ms[sub.callback];
                        if (H.isEmpty(ms)) {
                            // If the hash is now empty, remove it.
                            delete l.methods;
                            // If no callbacks remain, remove listener id.
                            if (!l.functions || !l.functions.length) {
                                cleanupListener = true;
                            }
                        }
                    }
                }
                // Did we remove the final callback from the listener?
                if (cleanupListener) {
                    // Yes, now remove the listener id from the listeners hash.
                    delete e[sub.listener || ""];
                    // And if there are no more listeners for this event...
                    if (H.isEmpty(e)) {
                        // Remove the listeners hash entirely for this event.
                        delete s[sub.type];
                    }
                }
            },

            /**
             * <p>Determines if a specified object hasany listeners subscribed for a given event.</p>
             *
             * @param {String} id The ID of the publishing object.
             * @param {String} type The name of the event.
             *
             * @returns {Boolean} true if the object has at least one listener; false otherwise.
             */
            hasSubs: function hasSubs(id, type) {
                var s = _subs[id],
                    evt = s && s[type];

                return !!evt;
            },

            /**
             * Clear all subscriptions for listeners of the component as well as any subscriptions the component has for other objects.
             *
             * @param {String} listener The id of the component whose subscriptions should be cleared.
             */
            clearSubscriptions: function clr(listener) {
                if (!listener) {
                    listener = "";
                }
                var sbs = _subs,
                    _H = mstrmojo.hash,
                    id;

                // Do we have anybody listening to this object?
                if (sbs[listener]) {
                    // Delete the subscriptions to this object.
                    delete sbs[listener];
                }

                // Is this object listening to anybody else?
                var pmap = _listenerMap[listener];
                if (pmap) {
                    // Walk the event providers...
                    for (id in pmap) {
                        var es = sbs[id],
                            emap = pmap[id],
                            e;
                        if (!es) {
                            continue;
                        }
                        // Walk the event names...
                        for (e in emap) {
                            // Remove this listener from that event.
                            var ls = es[e];
                            if (!ls) {
                                continue;
                            }
                            delete ls[listener];
                            // If there are no remaining listeners for that event...
                            if (_H.isEmpty(ls)) {
                                // ...remove the listeners hash for that event entirely.
                                delete es[e];
                            }
                        }
                    }
                }
                delete _listenerMap[listener];
            }
        }
    );

    mstrmojo.publisher.NO_SRC = "NO_SRC";
    mstrmojo.publisher.CONNECTIVITY_CHANGED_EVENT = "CONNECTIVITY_CHANGED";
    mstrmojo.publisher.RECONCILE_END_EVENT = "RECONCILE_END";

}());
(function () {
    mstrmojo.requiresCls("mstrmojo.array",
                         "mstrmojo.hash");

    var $ARR = mstrmojo.array,
        $HASH = mstrmojo.hash;

    /**
     * <p>An Interface for processing the datasets collection.</p>
     *
     * @class
     */
    mstrmojo.models.datasets.DataInterface = mstrmojo.provide(
        "mstrmojo.models.datasets.DataInterface",

        /** @lends mstrmojo.models.datasets.DataInterface */
        {
            /**
             * Get the forms of attribute from datasets (on the dataset template, identified by 'obf'.) by attributeID
             *
             * @param {String} attributeID The DSSID of the attribute.
             * @param {Array.<Object>} datasets The datasets collection, where we get all the available forms
             *
             * @returns {Array.<Object>} array of attribute forms.
             */
            getFormsByAttrId: function getFormsByAttrId(attributeID, datasets) {
                var attributeForms = [];
                datasets = datasets || [];

                // Loop through all the datasets collections to find the required attribute.
                $HASH.forEach(datasets, function (ds) {
                    // Loop through all the attributes of the dataset to find the required attribute.
                    $ARR.forEach(ds.att || [], function (at) {
                        // Have we found the attribute id for which we need to collect forms?
                        if (at.did === attributeID) {
                            // Keep appending to the forms collection.
                            attributeForms = attributeForms.concat(at.fs || []);

                            //Assume no identical attributes in one dataset
                            return false;
                        }
                    });
                });

                attributeForms = $ARR.filter(attributeForms, function (f) {
                    return !!f.obf;
                });

                // Return distinct copies of the forms across datasets.
                return $ARR.distinct(attributeForms, 'fid');
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.hash");

    var $H = mstrmojo.hash;

    //    mstrmojo.mojoClasses = {};

    /**
     * <p>Base class for all Mojo objects.</p>
     * @class
     */
    mstrmojo.Base = mstrmojo.declare(
        // superclass
        null,

        // mixins
        null,

        /**
         * @lends mstrmojo.Base.prototype
         */
        {
            /**
             * The FQCN for this object.
             *
             * @type String
             */
            scriptClass: "mstrmojo.Base",

            /**
             * <p>Optional handler called during initialization.</p>
             *
             * <p>This handler is supported as a customization hook within the instance creation process.
             * If specified, the handler will be called from constructor after properties are applied to this object,
             * but before the object is registered in the "mstrmojo.all" collection.</p>
             *
             * @type Function
             */
            //postApplyProperties: null,

            /**
             * <p>Base class for all objects.</p>
             *
             * <p>Constructs a new instance by doing the following:</p>
             * <ol>
             * <li>applying all the property values in a given hashtable to the new instance,</li>
             * <li>calls the "postApplyProperties" handler, if any,</li>
             * </ol>
             *
             * @constructs
             * @param {Object} [props] Hash of property values to be applied to this instance.
             */
            init: function init(props) {

                // Apply the given properties to this instance.
                $H.copy(props, this);    // Optimization: use copy rather than mixin, unless truly needed.


                // DEBUG: uncomment to keep count of how many instances of each mojo class are created.
                //                var mc = mstrmojo.mojoClasses,
                //                    sc = this.scriptClass;
                //                mc[sc] ? mc[sc] += 1 :  mc[sc] = 1;

                // Hook for customizations before getting registered.
                if (this.postApplyProperties) {
                    this.postApplyProperties();
                }
            }
        }
    );

}());
(function () {
    mstrmojo.requiresCls("mstrmojo.models.template.Title");

    /**
     * A class representing the grid Titles collection.
     *
     * @class
     * @returns {{size: Function, getTitle: Function, getCSS: Function}}
     */
    mstrmojo.models.template.Titles = mstrmojo.declare(
        null,

        null,

        /**
         * @lends mstrmojo.models.template.Titles.prototype
         */
        {
            init: function init(props) {
                var gridData = this.gridData = props.data,
                    gridTitles = gridData.gts;

                this.titles = props.isRow ? gridTitles.row : gridTitles.col;
            },

            size: function size() {
                return this.titles.length;
            },

            /**
             * @param pos
             *
             * @returns {mstrmojo.models.template.Title}
             */
            getTitle: function getTitle(pos) {
                return new mstrmojo.models.template.Title({
                    title: this.titles[pos]
                });
            },

            getCSS: function getCSS(pos) {
                return this.gridData.css[this.titles[pos].cni].n;
            }
        }
    );
}());
(function () {
    mstrmojo.requiresCls("mstrmojo.array",
                         "mstrmojo.hash",
                         "mstrmojo.models.template.Titles",
                         "mstrmojo.models.template.MetricValue",
                         "mstrmojo.models.template.Headers",
                         "mstrmojo.models.datasets.DataInterface");

    var $ARR = mstrmojo.array,
        $HASH = mstrmojo.hash,
        $DATASET_INTERFACE = mstrmojo.models.datasets.DataInterface;

    var METRIC_OBJECT_TYPE = -1,
        RESIZE_SCENARIO_FIT_TO_WINDOW = 1,
        RESIZE_SCENARIO_FIT_TO_CONTENT = 2,
        RESIZE_SCENARIO_FIXED = 3;

    var DATA_FORMAT_TREE = 1,
        DATA_FORMAT_ROWS = 2;

    function getDataAsRowsArray() {
        var rows = this.getTotalRows(),
            data = this.data,
            rowsArray = [],
            col = data.gts.col[0].es,
            i;

        if (rows <= 0) {
            throw 'ERROR';
        }

        for (i = 0; i < rows; i++) {
            var headers = this.getRowHeaders(i),
                j,
                rowNode = {};

            for (j = 0; j < headers.size(); j++) {
                var header = headers.getHeader(j);

                rowNode[header.t.n] = header.getName();
            }
            for (j = 0; j < col.length; j++) {
                var value = this.getMetricValue(i, j).value;
                rowNode[col[j].n] = {
                    "v": value.v,
                    "rv": value.rv
                };
            }

            rowsArray.push(rowNode);
        }
        return rowsArray;
    }

    function getDataAsTree() {
        var rows = this.getTotalRows(),
            root = {name: "root"},
            i;

        if (rows <= 0) {
            throw 'ERROR';
        }

        var processRowHeaders = function (node, headers, index, rowIndex) {
            var children = (node.children = node.children || []),
                name = headers.getHeader(index).getName(),
                newNode = $ARR.filterOne(children, function (child) {
                    return (child.name === name);
                });

            if (!newNode) {
                newNode = {"name": name};
                children.push(newNode);
            }

            if (index < headers.size() - 1) {
                processRowHeaders.call(this, newNode, headers, index + 1, rowIndex);
            } else {
                newNode.value = this.getMetricValue(rowIndex, 0).value.rv;
                newNode.formattedValue = this.getMetricValue(rowIndex, 0).value.v;
            }
        };

        for (i = 0; i < rows; i++) {
            processRowHeaders.call(this, root, this.getRowHeaders(i), 0, i);
        }

        return root;
    }

    /**
     * <p>An Interface for accessing a grid data.</p>
     *
     * @class
     */
    mstrmojo.models.template.DataInterface = mstrmojo.declare(
        null,
        null,
        /**
         * @lends mstrmojo.models.template.DataInterface.prototype
         */
        {
            scriptClass: "mstrmojo.models.template.DataInterface",

            /**
             * @type {Object}
             * @ignore
             */
            data: null,

            /**
             * <p>Initialize instance with model data.</p>
             *
             * @param data the data of the report
             */
            init: function (data) {
                this.data = data;
            },

            /**
             * <p>Returns rows Titles </p>
             *
             * @returns {mstrmojo.models.template.Titles}
             */
            getRowTitles: function () {
                return new mstrmojo.models.template.Titles({
                    data: this.data,
                    isRow: true
                });
            },

            /**
             * <p>Returns columns Titles </p>
             *
             * @returns {mstrmojo.models.template.Titles}
             */
            getColTitles: function () {
                return new mstrmojo.models.template.Titles({
                    data: this.data,
                    isRow: false
                });
            },

            /**
             * <p>Returns the number of rows in the grid model.</p>
             *
             * @returns {int}
             */
            getTotalRows: function getTotalRows() {
                if (this.data.eg) {
                    return 0;
                }

                var data = this.data,
                    gridHeaders = data && data.ghs,
                    rowHeaders = gridHeaders && gridHeaders.rhs,
                    rowItems = rowHeaders && rowHeaders.items;

                return (rowItems && rowItems.length) || 0;
            },

            /**
             * <p>Returns the number of header rows in columns in model.</p>
             *
             * @returns {int}
             */
            getTotalColHeaderRows: function getTotalColHeaderRows() {
                var columnHeaderItems = this.data.ghs.chs.items;
                return (columnHeaderItems && columnHeaderItems.length) || 0;
            },

            /**
             * <p>Returns the number of columns in model.</p>
             *
             * @returns {int}
             */
            getTotalCols: function getTotalCols() {
                return this.getColHeaders(0).size();
            },

            /**
             * <p>Returns headers for given row</p>
             * @param {int} pos index of row
             * @returns {mstrmojo.models.template.Headers} headers
             */
            getRowHeaders: function getRowHeaders(pos) {
                return new mstrmojo.models.template.Headers({
                    data: this.data,
                    i: pos,
                    isRow: true
                });
            },

            /**
             * <p>Returns headers for given column.</p>
             *
             * @param {int} pos The column index.
             *
             * @returns {mstrmojo.models.template.Headers}
             */
            getColHeaders: function getColHeaders(pos) {
                return new mstrmojo.models.template.Headers({
                    data: this.data,
                    i: pos,
                    isRow: false
                });
            },

            /**
             * <p>Returns metric value for given row and column.</p>
             *
             * @param {int} row index of row
             * @param {int} col index of column
             *
             * @returns {mstrmojo.models.template.MetricValue}
             */
            getMetricValue: function getMetricValue(row, col) {
                var data = this.data;
                return new mstrmojo.models.template.MetricValue({
                    data: data,
                    value: data.gvs.items && data.gvs.items[row].items[col]
                });
            },

            /**
             * <p>Returns count of column headers.</p>
             *
             * @returns {int}
             */
            getColumnHeaderCount: function getColumnHeaderCount() {
                var gridValueItems = this.data.gvs.items;
                return gridValueItems ? gridValueItems[0].items.length : 0;
            },

            /**
             * <p>Returns the CSS class.</p>
             *
             * @returns {string}
             */
            getCSSString: function getCSSString() {
                return this.data.cssString;
            },

            /**
             * Indicates if the template has no units.
             *
             * @returns {boolean}
             */
            isEmpty: function isEmpty() {
                var gsi = this.data.gsi;
                return !gsi || (!gsi.rows.length && !gsi.cols.length && !gsi.mx.length);
            },

            /**
             * Returns the average vertical and horizontal padding for the grid based on the grid structure formatting zones.
             *
             * @returns {{v:number, h:number}}
             */
            getAggregatePadding: function getAggregatePadding() {
                var fmts = this.data.gsi && this.data.gsi.fmts,
                    fnReduce = function (a, b) {
                        return a + b;
                    },
                    fnGetPadding = function (props) {
                        // Iterate formatting zones.
                        return [ 'ch', 'rh', 'va' ].map(function (axis) {

                            // Iterate properties to calculate.
                            return props.map(function (p) {
                                // Return property value.
                                return fmts[axis] && fmts[axis].hasOwnProperty(p) ? fmts[axis][p] : 1;

                            }).reduce(fnReduce) / axis.length;  // Sum and average.

                        }).reduce(fnReduce) / 3;  // Sum and average.
                    };

                if (!fmts) {
                    return null;
                }

                return {
                    v: fnGetPadding([ 'tp', 'bp' ]),
                    h: fnGetPadding([ 'rp', 'lp' ])
                };
            },

            /**
             * Return the column scenario based on the current data.
             * @returns {number}
             */
            getColResizeScenario: function getColResizeScenario() {
                var data = this.data;

                // Is the grid auto fit to window?
                if (data.afw) {
                    // Change scenario.
                    return RESIZE_SCENARIO_FIT_TO_WINDOW;

                    // Is the grid explicitly NOT fit to content?
                } else if (data.afc === false) {
                    // Change scenario to fixed.
                    return RESIZE_SCENARIO_FIXED;
                } else {
                    // Assume fit to content (because an inserted grid won't have any properties).
                    return RESIZE_SCENARIO_FIT_TO_CONTENT;
                }
            },

            /**
             * Returns information about the current column widths scenario and associated column widths.
             *
             * @param {Array<Object>} datasets The datasets collection, where we get all the available forms
             *
             * @returns {{v: int, widths: Array.<{n: string, did: string, t: int, width: int}>}}
             */
            getColResizeInfo: function getColResizeInfo(datasets) {
                var data = this.data,
                    info = {
                        v: this.getColResizeScenario(),
                        widths: null
                    };

                var gsi = data.gsi,
                    colWidths = [],
                    tabularWidthModel = data.twm || {},
                    topColWidths = tabularWidthModel.top || [],
                    bottomColWidths = tabularWidthModel.bottom || [],
                    colWidthIdx = 0,
                    fnAddColWidth = function (axisName, addOneUnit) {
                        // Iterate units on this axis.
                        if (gsi) {
                            gsi[axisName].every(function (unit) {
                                var unitId = unit.did,
                                    formsInfo = $DATASET_INTERFACE.getFormsByAttrId(unitId, datasets);

                                // Loop through the forms so that their widths can be displayed in the properties editor.
                                (formsInfo.length ? formsInfo : [{}]).forEach(function (formInfo, index) {
                                    var bottomWidthObj = (bottomColWidths && bottomColWidths[colWidthIdx]) || {};

                                    // Add unit.
                                    colWidths.push({
                                        n: unit.n + (formsInfo.length ? (' - ' + formInfo.fnm) : ''),
                                        did: unitId,
                                        depth: index + 1,
                                        t: unit.t || 4,
                                        width: parseInt((bottomWidthObj.w) || 0, 10),
                                        widthModel: {
                                            top: (topColWidths && topColWidths[colWidthIdx]) || {},
                                            bottom: bottomWidthObj
                                        }
                                    });

                                    // Increment column width index.
                                    colWidthIdx++;
                                });

                                // Return false if only adding one unit.
                                return !addOneUnit;
                            });
                        }
                    };

                // Add columns from rows and metrics (limiting metrics to 1 if metrics are on the row axis).
                fnAddColWidth('rows', false);
                fnAddColWidth('mx', gsi.tma === 1);

                // Cache widths in info.
                info.widths = colWidths;

                return info;
            },

            /**
             * Return the row scenario based on the current data.
             *
             * @returns {number}
             */
            getRowResizeScenario: function getRowResizeScenario() {
                // Return the appropriate resize scenario.
                return !!this.data.rh ? RESIZE_SCENARIO_FIXED : RESIZE_SCENARIO_FIT_TO_CONTENT;
            },

            /**
             * Returns information about the current row scenario and associated row widths.
             *
             * @returns {{v: int, height: int}}
             */
            getRowResizeInfo: function getRowResizeInfo() {
                var data = this.data,
                    rowHeight = data.rh;

                return {
                    v: this.getRowResizeScenario(),
                    height: (rowHeight === undefined || rowHeight === '') ? data.xrh : rowHeight        // Use saved height or actual height.
                };
            },

            /**
             * Helper function that returns the header data for the columns as they appear rendered on the xtab.
             *
             * @return {Array}
             */
            getColumnHeaderData: function getColumnHeaderData() {
                // TODO: We may consider refactoring this to use the data interface objects.
                var data = this.data,
                    gridTitlesData = data.gts,
                    shouldRemoveExtraColumn = data.gts.rec,
                    headerObjects = [],
                    metricElements = [],
                    rowTitles = gridTitlesData.row;

                // Find the correct header objects from the row titles collection.
                $ARR.forEach(rowTitles, function (templateUnit) {
                    var forms = templateUnit.fs,
                        isMetricObject = templateUnit.otp === METRIC_OBJECT_TYPE;

                    if (forms && forms.length > 1) {
                        $ARR.forEach(forms, function () {
                            headerObjects.push(templateUnit);
                        });
                    } else {
                        headerObjects.push(templateUnit);
                    }

                    // In the case of metrics, pick up the metric template units.
                    if (isMetricObject) {
                        // Remember the metric elements.
                        metricElements = templateUnit.es;
                    }
                });

                // Loop through the column headers and find the unit objects.
                var columnTitles = gridTitlesData.col;

                // Do we have column headers?
                if (columnTitles && columnTitles.length > 0) {
                    var gridHeaders = data.ghs,
                        colHeaders = gridHeaders.chs,
                        colHeaderItems = colHeaders.items,
                        totalColumns = colHeaderItems[colHeaderItems.length - 1].items,
                        findMetricHeader = function findMetricHeader(headerUnit) {
                            // Recursively call the parent header item.
                            var parentIndex = headerUnit.pi,
                                columnIndex = parentIndex.ci,
                                rowIndex = parentIndex.ri;

                            // Have we found a metric - return it back to the caller.
                            if (headerUnit.mix !== undefined) {
                                return headerUnit;
                            }

                            // If there's no header units left - return null.
                            if (rowIndex === undefined || columnIndex === undefined) {
                                return;
                            }

                            return findMetricHeader(colHeaderItems[rowIndex].items[columnIndex]);
                        };

                    // Find the correct header objects from the column titles collection.
                    $ARR.forEach(columnTitles, function (templateUnit) {
                        var isMetricObject = templateUnit.otp === METRIC_OBJECT_TYPE;

                        // Should we add the unit ? We should only do in all cases except when it's a metric object and remove extra col is true or
                        // if there's nothing in the rows and we have one attribute along with metrics in the column.
                        if ((isMetricObject && (!shouldRemoveExtraColumn || rowTitles.length === 0))) {
                            headerObjects.push(templateUnit);
                        }

                        // In the case of metrics, pick up the metric template units.
                        if (isMetricObject) {
                            // Remember the metric elements.
                            metricElements = templateUnit.es;
                        }
                    });

                    // Calculate the
                    var rowHeaderCount = headerObjects.length;

                    // Delete all the related indices from the column headers.
                    $ARR.forEach(totalColumns, function (headerUnit) {
                        delete headerUnit._ridx;
                    });
                    if (metricElements.length > 0) {
                        // Loop through all the column header items.
                        $ARR.forEach(totalColumns, function (headerUnit) {
                            var metricParent = findMetricHeader(headerUnit);

                            // Does this unit have a metric parent?
                            var metricIndex = metricParent ? metricParent.mix : 0,
                                metricElement = metricElements[metricIndex];

                            // Create a related indices collection for each of the items.
                            var relatedIndices = metricElement._ridx = metricElement._ridx || [];

                            // Only visit the other columns if we haven't already visited them.
                            if (relatedIndices.length === 0) {
                                $ARR.forEach(totalColumns, function (relatedHeader, relatedIndex) {
                                    var relatedMetricParent = findMetricHeader(relatedHeader);

                                    // In the case there's no metrics in the columns, default all of them to the first metric element.
                                    if (!metricParent || relatedMetricParent.mix === metricIndex) {
                                        relatedIndices.push(rowHeaderCount + relatedIndex);
                                    }
                                });
                            }

                            // Add the metric header to the headerObjects collection.
                            headerObjects.push(metricElement);
                        });
                    }
                } else if (metricElements.length > 0) {
                    // Add the first metric element as that is what will get resized when there's nothing in the rows.
                    headerObjects.push(metricElements[0]);
                }

                return headerObjects;
            },

            /**
             * Returns information about the unit (with the given ID) if it's present on the grid.
             *
             * @param {String} id The DSSID of the unit in question.
             *
             * @returns {{axis: number, depth: number, unit: Object}}
             */
            getUnitById: function getUnitById(id) {
                var gsi = this.data.gsi,
                    unit = null;

                // Iterate rows, columns and metrics axis.
                [ gsi.rows, gsi.cols, gsi.mx ].some(function (axisUnits, axis) {
                    // Is this the metrics axis?
                    if (axis === 2) {
                        // Use -2 (converted to -1 later).
                        axis = -2;
                    }

                    // Iterates units on axis.
                    axisUnits.some(function (axisUnit, depth) {
                        // Does this unit match requested ID?
                        if (axisUnit.did === id) {
                            // Create unit config to return.
                            unit = {
                                axis: axis + 1,     // Convert to one based.
                                depth: depth + 1,   // Convert to one based.
                                unit: axisUnit
                            };
                        }

                        // Return true if unit was found so iteration halts.
                        return !!unit;
                    });

                    // Return true if unit was found so iteration halts.
                    return !!unit;
                });

                // Return unit.
                return unit;
            },


            /**
             * <p>Returns the xtab data in the raw format specified.</p>
             *
             * @param {int} format The raw format from {mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT}.
             *
             * @returns {Object}
             */
            getRawData: function getRawData(format) {
                if (format === DATA_FORMAT_ROWS) {
                    return getDataAsRowsArray.call(this);
                }

                return getDataAsTree.call(this);
            }
        }
    );

    /**
     * Inflates grid data from server compacted version.
     *
     * @param {Object} gridData The grid data to inflate.
     *
     * @static
     */
    mstrmojo.models.template.DataInterface.inflateGridData = function (gridData) {
        var gridValues = gridData.gvs,
            gridHeaders = gridData.ghs;

        // Is this NOT an empty grid AND are the grid values empty (meaning there are no metrics)?
        if (gridData.egt === undefined && (gridData.eg === undefined || gridData.eg === null) &&  !!gridValues && $HASH.isEmpty(gridValues)) {
            var emptyObj = {    // Common empty cell value.
                    v: '',
                    rv: ''
                },
                row = {
                    // Create empty items.  Use column width count if there, or one if not (no column widths means there are no units on the columns).
                    items: (gridHeaders.chs.cws || [ 0 ]).map(function () {
                        return emptyObj;
                    })
                };

            // Set grid value items to an array of row item (to match row headers count).
            gridValues.items = gridHeaders.rhs.items ? gridHeaders.rhs.items.map(function () {
                return row;
            }) : [];

            // Mark values as visible.
            gridValues.show = true;
        }
    };

    /**
     * An enumeration of grid column resize scenarios.
     *
     * @enum {int}
     */
    mstrmojo.models.template.DataInterface.ENUM_GRID_RESIZE = {
        /**
         * Fit to window scenario.
         * @type {int}
         */
        FIT_TO_WINDOW: RESIZE_SCENARIO_FIT_TO_WINDOW,

        /**
         * Fit to content scenario.
         * @type {int}
         */
        FIT_TO_CONTENTS: RESIZE_SCENARIO_FIT_TO_CONTENT,

        /**
         * Fixed scenario.
         * @type {int}
         */
        FIXED: RESIZE_SCENARIO_FIXED
    };

    /**
     * An enumeration of raw data formats.
     *
     * @enum {int}
     */
    mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT = {
        /**
         * Tree raw format.
         * @type {int}
         */
        TREE: DATA_FORMAT_TREE,

        /**
         * Array of Rows raw format.
         * @type {int}
         */
        ROWS: DATA_FORMAT_ROWS
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.publisher");

    var $P = mstrmojo.publisher;

    /**
     * <p>Enables an object to raise events that can be heard by listeners.</p>
     *
     * <p>This mixin provides a generic "set" method for updating an object's property value. The set method is capable of
     * raising an "event" when a property value changes by leveraging mstrmojo.publisher. This event can then be heard
     * by other objects who wish to be notified of the change.  Those objects can sign up as "listeners" by calling the
     * object's "attachEventListener" and "detachEventListener" methods.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._Provider = mstrmojo.provide(

        "mstrmojo._Provider",

        /**
         * @lends mstrmojo._Provider#
         */
        {
            /**
             * @ignore
             */
            _meta_usesSuper: false,

            /**
             * <p>Specifies which properties (if any) should raise an event when
             * their value is changed via a call to the "set()" method.<p>
             *
             * <p>For example, if changes to the property "foo" should raise an event that can be listened for by event
             * listeners, then we should set audibles to:</p>
             *
             *   <pre>audibles: {"foo": true}</pre>
             *
             * <p>Alternatively, if the changes to "foo" should NOT raise an event, we can declare:</p>
             *
             *   <pre>audibles: {"foo": false}</pre>
             *
             * <p>To specify default behavior for properties in general, we can use the "*" shortcut:</p>
             *
             *   <pre>audibles: {"*": true}</pre>
             *
             * <p>If no default is specified, we assume the default to be audible.
             * Note that changes to property values which are NOT audible will not generate an internal event
             * which this instance can respond to.</p>
             *
             * @type Object
             */
            audibles: {
                "*": true
            },

            /**
             * <p>Sets the value of a given property of this object.</p>
             *
             * <p>This method checks this instance for a custom setter; if not found, the property value is updated directly.
             * If the value of the property was indeed changed, an event named "{propertyname}Change" is raised, but only
             * if both the following conditions are met:</p>
             * <ol>
             * <li>the property is audible; and</li>
             * <li>either this object has a handler for the event, or the global publisher has subscriptions for this event.</li>.
             * </ol>
             *
             * <p>If the custom setter is used and returns truthy, the event is automatically published.</p>
             *
             * @param {String} n The name of the property to change.
             * @param {*} [v] The new value.
             *
             * @returns {Boolean} true if the property value was changed; false otherwise.
             */
            set: function set(n, v) {
                // Do we have a custom setter with the name "_set_XXX"?
                var bChanged = false,
                    f = this["_set_" + n],
                    vWas = this[n];    // Old value.

                if (f) {
                    // We have a custom setter, so call it with our arguments.
                    bChanged = f.apply(this, arguments);
                } else {
                    // We don't have a custom setter, just update our property directly.
                    this[n] = v;
                    bChanged = (vWas !== v);
                }

                // Did the property value actually change?
                if (bChanged) {
                    // Performance optimization: Raise event only if it's audible and someone is
                    // listening for it (including this observable itself).
                    var evtName = n + "Change",
                        aud = this.audibles || {},
                        isAudible =  (aud[n] === true) || ((aud[n] !== false) && (aud["*"] !== false));

                    if (isAudible && (this['pre' + evtName] || this['on' + evtName] || this['post' + evtName] || $P.hasSubs(this.id, evtName))) {
                        // Raise an event corresponding to this property value change,
                        // so listeners can be notified.
                        this.raiseEvent({
                            name: evtName,
                            prop: n,
                            value: v,
                            valueWas: vWas
                        });
                    }
                }
                return this;
            },

            /**
             * <p>Publishes an event that can be handled by this and other objects.</p>
             *
             * <p>Given an object which represents an event that originated within this object, this method will call
             * this object's handler for that event (if any) with the given event object. Additionally, this method will
             * ask the mstrmojo.publisher to publish the event so other objects can be notified of the event.</p>
             *
             * @param {Object} evt An object representing an event; must have a "name" property representing the event's name.
             *
             * @returns {Object} The augmented event object.
             */
            raiseEvent: function rse(evt) {
                var n = evt && evt.name;
                if (!n) {
                    return null;
                }
                // Set the event source.
                evt.src = this;

                // Hook for customization.
                this.preHandleEvent(evt);

                // First let this object respond to the event with its own custom handler, if any.
                var ns = ['pre', 'on', 'post'],
                    abort = false,
                    i,
                    len;

                for (i = 0, len = ns.length; i < len; i++) {
                    var fn = ns[i] + n;
                    if (this[fn]) {
                        if (this[fn](evt) === false) {
                            abort = true;
                            break;
                        }
                    }
                }

                // If no event handler has "aborted" this event...
                if (!abort) {
                    // Hook for customization.
                    this.postHandleEvent(evt);

                    // Then publish the event for other listeners to be notified.
                    $P.publish(this.id, n, evt);
                }

                return evt;
            },

            /**
             * <p>Optional handler called before event handling is executed.</p>
             *
             * <p>This handler is supported as a customization hook within the event handling process.
             * If specified, the handler will be called from raiseEvent before the object's handler for the event.
             * A single argument will be passed into the call: the event object.</p>
             *
             * @param {mstrmojo.Event}
             *
             * @abstract
             */
            preHandleEvent: mstrmojo.emptyFn,

            /**
             * <p>Optional handler called after event handling is executed.</p>
             *
             * <p>This handler is supported as a customization hook within the event handling process.
             * If specified, the handler will be called from raiseEvent after the object's handler for the event.
             * A single argument will be passed into the call: the event object.</p>
             *
             * @abstract
             */
            postHandleEvent: mstrmojo.emptyFn,

            /**
             * <p>A shortcut for subscribing to events from this observable object.</p>
             *
             * <p>Although mstrmojo.publisher can be called to attach an event listener to an observable object,
             * this method is provided as a convenience for attaching listeners for events that originate within this object.</p>
             *
             * @param {String} name The name of the event we wish to subcribe to.
             * @param {Function|String} callback A function, or name of a method, to be called in response to the event.
             * @param {String} [listener] ID of object which hosts the callback. If omitted, the global context is assumed.
             * @returns {Object} An object representing the attached subscription.  This object can be used subsequently as the argument to
             * detachEventListener to cancel the subscription.
             */
            attachEventListener: function att(name, listener, callback) {
                return $P.subscribe(this.id, name, callback, listener);
            },

            /**
             * <p>A shortcut for unsubscribing from events from this observable object.</p>
             *
             * <p>Although mstrmojo.publisher can be called to detach an event listener to an observable object,
             * this method is provided as a convenience for detaching listeners for events that originate within this object.
             * This method is a complement to the attachEventListener method, and can be used to cancel a subscription created by attachEventListener.</p>
             *
             * @param {Object} sub A single object identifier for the subscription, or an array of object identifiers.
             */
            detachEventListener: function det(sub) {
                $P.unsubscribe(sub);
            },

            /**
             * Clears any subscriptions associated with this component.
             *
             */
            destroy: function destroy() {
                // Clear all subscription to or from this object.
                $P.clearSubscriptions(this.id);

                if (this._super) {
                    this._super();
                }
            }
        }
    );
}());
(function () {
    mstrmojo.requiresCls("mstrmojo.registry",
                         "mstrmojo.array",
                         "mstrmojo.publisher");

    var $REG = mstrmojo.registry,
        $ARR = mstrmojo.array,
        $PUB = mstrmojo.publisher;

    /**
     * <p>Pre-processing for a new child. Converts a given JSON object into a script class instance,
     * and sets its parent.</p>
     *
     * @param {mstrmojo.Container} p The parent to which a child is about to be added.
     * @param {mstrmojo.Widget|{}} c The child which is about to be added.
     *
     * @private
     */
    function preAddChild(p, c) {
        if (c) {
            c.parent = p;
            return $REG.ref(c);
        }
        return null;
    }

    /**
     * <p>Post processing for a new child. Sets an alias reference on the parent to the child.</p>
     *
     * @param {mstrmojo.Container} p The parent to which a child has been added.
     * @param {mstrmojo.Widget|{}} c The child which has been added.
     *
     * @private
     */
    function postAddChild(p, c) {
        var alias = c.alias;
        if (alias !== null && alias !== '') {
            p[alias] = c;
        }
    }

    /**
     * <p>Post processing for a newly removed child. Clears the alias reference on the parent and
     * the parent reference on the child.</p>
     *
     * @param {mstrmojo.Container} p The parent to which a child has been added.
     * @param {mstrmojo.Widget|{}} c The child which has been added.
     *
     * @private
     */
    function postRemoveChild(p, c) {
        var alias = c.alias;
        if (c.parent === p) {
            delete c.parent;
        }
        if ((alias !== null && alias !== '') && (p[alias] === c)) {
            delete p[alias];
        }
    }

    /**
     * <p>Converts an array of child references to a new array of child objects.</p>
     *
     * <p>Each array member that is a child reference will be replaced by the evaluation of that reference; the evaluation
     * is done via the mstrmojo.registry.ref method. If the evaluation results in null, the array member is removed.
     * Each array member that is already a child object will remain intact.</p>
     *
     * <p>Each array member will have its parent set, and the parent will have alias references set to the children
     * (for each child that specifies an alias).</p>
     *
     * @param {mstrmojo.Container} p The parent to which children will be added.
     * @param {Object[]} refs An array of either child references or child objects.
     *
     * @returns {Object[]} An array of child objects, if successful; otherwise, an empty array or null.
     *
     * @private
     */
    function makeCh(p, refs) {
        var len = refs && refs.length,
            ch,
            i;

        if (len) {
            ch = [];
            for (i = 0; i < len; i++) {
                var c = preAddChild(p, refs[i]);
                if (!c) {
                    continue;
                }
                ch.push(c);
                postAddChild(p, c);
            }
        }
        return ch;
    }

    /**
     * <p>A mixin that equips an observable object with methods for managing an array of children.</p>
     *
     * <p> The children list is maintained in a "children" property (type: Array of Objects). Additions and removals
     * of children in the list raise events that can be handled by this or other objects.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._HasChildren = mstrmojo.provide(

        "mstrmojo._HasChildren",

        /**
         * @lends mstrmojo._HasChildren#
         */
        {
            /**
             * @ignore
             */
            _meta_usesSuper: false,

            /**
             * Array of child objects contained by this object.
             *
             * @type {mstrmojo.Widget[]}
             */
            children: null,

            /**
             * <p>Optional handler called after initialization of children.</p>
             *
             * <p>This handler is supported as a customization hook during the initialization process.
             * If specified, the handler will be called after the instance's initial children have been created.
             * If the instance has no initial children, the handler is not called.</p>
             *
             * @type {Function}
             */
            postCreateChildren: mstrmojo.emptyFn,

            /**
             * <p>Optional handler called after children are added.</p>
             *
             * @type {Function}
             */
            onaddChild: null,

            /**
             * <p>Optional handler called after children are removed.</p>
             *
             * @type {Function}
             */
            onremoveChild: null,

            /**
             * <p>Constructs child objects from this object's "children" property value.</p>
             * <p>This method is intended to be used during initialization and therefore operates silently;
             * meaning it does not raise "addChild" events for the initial set of children.</p>
             */
            initChildren: function initChildren() {
                var propertyName = "children",
                    children = this[propertyName];

                // Are there no children?
                if (!children) {
                    // Nothing to do.
                    return;
                }

                // Clear children (MUST use null, since delete won't work when children is defined on prototype) and call custom property setter.
                this[propertyName] = null;
                this._set_children(propertyName, children, true);

                // Hook for customizations.
                this.postCreateChildren();
            },

            /**
             * <p>Custom setter for the "children" property value.</p>
             *
             * <p>This method will add a given array of children to this object's
             * "children" property. Any children previously in the "children" property
             * are removed first.</p>
             *
             * @param {string} [n=children] The property whose value is being set.
             * @param {Array.<Object>=} v An array of either child objects or references to child objects. If
             *                      references are specified, they are resolved to actual child objects using the {@link mstrmojo.registry.ref} method.
             * @param {boolean} [silent=false] If true, suppresses raising of event.
             *
             * @returns {boolean} false to avoid raising a "childrenChange" event when called from {@link mstrmojo.Obj.set}.
             *                          Instead, calling this method should raise "removeChild" and/or "addChild" events (unless suppressed
             *                          by the "silent" argument).
             */
            _set_children: function _set_children(n, v, silent) {
                var ch = this.children;
                if (v !== ch) {
                    if (ch) {
                        // Call removeChildren with null to clear all children; it doesn't accept arrays.
                        this.removeChildren(null, silent);
                    }
                    this.addChildren(v, 0, silent);
                }
                return false;
            },

            /**
             * <p>Destroys the children of this object, if any.</p>
             *
             * <p>This method calls the destroy method of any objects in the "this.children" array, and removes the objects as children of
             * this parent object.  This is done in reverse order, in case any destroy call causes a child to be removed from this.children.
             * It is also done silently, meaning that no "removeChild" events are raised.</p>
             *
             * <p>This method can be called either separately or from this object's own "destroy" method.  When called from this object's own
             * method, it should be called with a true argument.  This allows the method to pass a flag into the children's "destroy" calls,
             * letting them know whether or not the cleanup is being coordinated by a parent/ancestor object.  The flag is used
             * as a performance optimization for a cascading destruction.</p>
             *
             * @param {boolean} [meDestroying=false] This param should be set to true when this method is called from this object's
             *                                 own "destory" method.  If true, this method skips removing the children's "parent" handle
             *                                 from the children, removing the "alias" handle to child from this parent object, and skips
             *                                 clearing the children array.
             */
            destroyChildren: function destroyChildren(meDestroying) {
                var ch = this.children,
                    len = (ch && ch.length) || 0,
                    i;
                if (len) {
                    for (i = len - 1; i > -1; i--) {
                        var c = ch[i];
                        if (c && c.destroy) {
                            c.destroy(meDestroying);
                            if (!meDestroying) {
                                postRemoveChild(this, c);
                            }
                        }
                    }
                    if (!meDestroying) {
                        ch.length = 0;
                    }
                }
            },

            invalidateChildren: function invalidateChildren() {
                mstrmojo.array.forEach(this.children, function (child) {
                    child.invalidate();
                });
            },

            invalidate: function invalidate() {
                this.invalidateChildren();
            },

            /**
             * <p>Adds a given child or array of children to this object's "children" array. Notifies event
             * listeners by raising an "addChild" event.</p>
             *
             * <p>Each "child" will have a "parent" property whose value is a handle to this object.
             * Additionally, for each child with an "alias" property, a handle to that child will be
             * stored in a property of this object; the property's name will be the child's "alias" value.</p>
             *
             * @param {mstrmojo.Widget|Object|mstrmojo.Widget[]|Object[]} c A child or array of children to be added.
             * @param {int=} idx Index at which the given child(ren) should be inserted. If missing, they are appended.
             * @param {boolean} [silent=false] If true, suppresses raising of event.
             *
             * @returns {Object|Object[]|null} The child or array of children newly added (possibly empty or null).
             */
            addChildren: function addChildren(c, idx, silent) {
                if (!c) {
                    return c;
                }
                // Convert the given children references to an array of proper children.
                var isArr = c.constructor === Array,
                    arr = makeCh(this, isArr ? c : [c]);

                if (arr && arr.length) {
                    // Insert the new kids into our "children" property.
                    var ch = this.children || [];
                    if (idx === null || idx === undefined) {  // if idx is null OR undefined
                        idx = ch.length;
                    }
                    this.children = $ARR.insert(ch, idx, arr);

                    // Raise an event, only if someone is listening for it (including this object itself).
                    if (!silent && (this.onaddChild || $PUB.hasSubs(this.id, "addChild"))) {
                        this.raiseEvent({
                            name: "addChild",
                            value: arr,
                            index: idx
                        });
                    }
                }
                return isArr ? arr : (arr && arr[0]);
            },

            /**
             * <p>Removes a given child or all children from this object's "children" array. Notifies event
             * listeners by raising an "removeChild" event.</p>
             *
             * <p>Each removed child's parent property is cleared.  Additionally, if a child has an "alias" property,
             * this object's alias handle to that child will be cleared.</p>
             *
             * @param {mstrmojo.Widget=} c The child to be removed. If missing, all children are removed.
             * @param {boolean} [silent=false] If true, suppresses raising of event.
             *
             * @returns {int} The index at which the child was removed, if successful; -1 otherwise.
             */
            removeChildren: function removeChildren(c, silent) {
                var ch = this.children,
                    c2r = c ? [c] : (this.children || []).concat(),
                    len = c2r.length,
                    idx = -1,
                    i;

                if (len) {
                    for (i = len - 1; i > -1; i--) {
                        postRemoveChild(this, c2r[i]);
                    }

                    if (c) {
                        idx = $ARR.removeItem(ch, c);
                    } else if (ch) {
                        ch.length = 0;
                        idx = 0;
                    }

                    // Raise an event, only if someone is listening for it (including this object itself).
                    if (!silent && (this.onremoveChild || $PUB.hasSubs(this.id, "removeChild"))) {
                        this.raiseEvent({
                            name: "removeChild",
                            value: c2r,
                            index: idx
                        });
                    }
                }
                return idx;
            },

            /**
             * <p>Removes a given child from this object's "children" collection and raises an event, unless silent,
             * and destroys that child widget.</p>
             *
             * @param {mstrmojo.Obj} child The child object/widget to be removed from the children collection.
             * @param {boolean=} silent If true, suppresses raising of the event that a child was removed.
             * @param {boolean=} ignoreDOM Optional boolean flag, if true, won't remove the child's domNode from the document.
             */
            removeAndDestroyChild: function removeAndDestroyChild(child, silent, ignoreDOM) {
                // Do we have the child widget?
                if (child) {
                    // Does the child widget belong to us?
                    if (child.parent !== this) {
                        // No? Throw an error.
                        throw "Unable to remove an object that is not in the children collection.";
                    }

                    // Remove the child from the children collection.
                    this.removeChildren(child, silent);

                    // Destroy the child.
                    child.destroy(ignoreDOM);
                }
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.registry",
                         "mstrmojo.hash");

    var loadedCls = false,
        FQCN = "mstrmojo.Binding",
        $BINDINGS = "bindings",
        $REGISTRY = mstrmojo.registry;

    /**
     * Disables a given collection of binding objects.
     * @param {Object} bs Hash of binding objects.
     *
     * @private
     */
    function shutdown(bs) {
        var d;
        for (d in bs) {
            var b = bs[d];
            if (b && b.disable) {
                b.destroy();
            }
        }
    }

    /**
     * Enables a given collection of either binding objects or references to binding objects.
     *
     * @param {Object} bs Hash of binding objects or references.
     * @param {Object} p The parent object to which these bindings belong.
     * @private
     */
    function startup(bs, p) {
        // Load the Binding class (one-time only).
        if (!loadedCls) {
            mstrmojo.requiresCls(FQCN);
            loadedCls = true;
        }
        // For each binding config...
        var d;
        for (d in bs) {
            var b = bs[d];
            if (b === null || b === undefined) {    // if b is null or undefined
                continue;
            }
            var t = typeof b;
            // Strings values are shorthand for binding "source" properties;
            // otherwise assume we have an object value.
            if (t === "string" || t === "function") {
                b = {
                    destination: d,
                    source: b,
                    scriptClass: FQCN
                };
            }
            // Before creating the binding, set its parent handle (in case it uses it).
            b.parent = p;
            // Evaluate the binding reference into a binding object and start it up.
            // Optimization: skip class loaded check, because we assume we've already loaded the one binding class above.
            b = $REGISTRY.ref(b, {
                skipLoadChecks: true
            });
            bs[d] = b;
            b.enable();
        }
    }

    /**
     * <p>Enables the use of bindings to determine property values on a given object.</p>
     *
     * <p>The object is expected to have a "bindings" property whose value is a hashtable, which is keyed by destination name;
     * the hash values are configs for instances of Binding objects.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._HasBindings = mstrmojo.provide(
        "mstrmojo._HasBindings",

        /**
         * @lends mstrmojo._HasBindings#
         */
        {
            _meta_usesSuper: false,

            /**
             * <p>Hash of bindings defined for this object.</p>
             *
             * @type {Object}
             */
            //bindings: null,

            /**
             * <p>Optional handler called after initialization of bindings.</p>
             *
             * <p>This handler is supported as a customization hook at the end of the binding creation process.
             * If specified, the handler will be called after the instance's bindings have been initialized.
             * If the instance has no bindings, the handler will not be called.</p>
             *
             * @type Function
             */
            //postCreateBindings: null,

            /**
             * <p>Initializes the bindings for properties in this object and its children (if any).</p>
             *
             * <p>This method first inspects this object's "bindings" property. If given, this method creates
             * bindings from that property value. Then this method calls the "initBindings" method of this object's children
             * (if any) regardless of whether or not this object has any bindings.</p>
             */
            initBindings: function inB() {
                this.hasInitBindings = true;

                var bs = mstrmojo.hash.copy(this[$BINDINGS]);

                if (bs) {
                    delete this[$BINDINGS];
                    this._set_bindings($BINDINGS, bs);
                    // Hook for customizations after creating bindings.
                    if (this.postCreateBindings) {
                        this.postCreateBindings();
                    }
                }

                var ch = this.children,
                    len = (ch && ch.length) || 0;

                if (len) {
                    var i;
                    for (i = 0; i < len; i++) {
                        var c = ch[i];
                        if (c && c.initBindings) {
                            c.initBindings();
                        }
                    }
                }
            },

            destroyBindings: function destB() {
                var bs = this.bindings;
                if (bs) {
                    shutdown(bs);
                    delete this.bindings;
                }
            },

            /**
             * <p>Custom setter for the "bindings" property value.</p>
             *
             * <p>This method will apply a given hash of bindings to this object.
             * It initializes the values of the bound properties in this object.
             * Any bindings previously in the "bindings" property are removed first.</p>
             *
             * <p>This method inspects the given bindings hash. Each hash key is the
             * name of a bound property; each hash value is either an instance of a Binding object,
             * or a reference to a Binding. A "reference" is either a String (which serves as the
             * source script for a new Binding) or a hashtable of properties for a new Binding, which
             * is resolved via the mstrmojo.registry.ref method.</p>
             *
             * @param {String} [n="bindings"] The property whose value is being set.
             * @param {Object} [v] Hash of either binding objects or references to binding objects.
             * @returns {Boolean} true if the "bindings" hash object was reset; false otherwise.
             */
            _set_bindings: function setB(n, v) {
                var bs = this[$BINDINGS];
                if (v !== bs) {
                    if (bs) {
                        shutdown(bs);
                    }
                    this[$BINDINGS] = v;
                    if (v) {
                        startup(v, this);
                    }
                    return true;
                }
                return false;
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.dom",
        "mstrmojo.array",
        "mstrmojo.string");

    var $D = mstrmojo.dom,
        $S = mstrmojo.string,
        $A = mstrmojo.array;

    /**
     * A utility class for browser sniffing.
     *
     * @namespace mstrmojo.css
     */
    mstrmojo.css = mstrmojo.provide(
        "mstrmojo.css",

        /**
         * @lends mstrmojo.css
         */
        {

            /**
             * The browser appropriate display property for a table.
             *
             * @type {string}
             * @constant
             */
            DISPLAY_TABLE: $D.isNSIE ? 'block' : 'table',

            /**
             * The browser appropriate display property for a table cell.
             *
             * @type {string}
             * @constant
             */
            DISPLAY_CELL: $D.isNSIE ? 'block' : 'table-cell',

            /**
             * The browser appropriate property for min-height.
             *
             * @type {string}
             * @constant
             */
            MINHEIGHT: $D.isIE6 ? 'height' : 'minHeight',

            /**
             * <p>Adds one or more of class names to the class name attribute of the supplied element.</p>
             *
             * <p>If the class name is already present, it will ignore it.</p>
             *
             * @param {HTMLElement|Node} el The element to receive the classes.
             * @param {string|string[]} s Array of one or more classes to add.
             *
             * @returns {HTMLElement|Node} The modified node.
             */
            addClass: function addClass(el, s) {
                if (el) {
                    if (s.constructor !== Array) {
                        s = [ s ];
                    }
                    var cls = el.className || '',
                        start = ' ' + cls + ' ',
                        bAdded = false,
                        len = s.length,
                        i;

                    for (i = 0; i < len; i++) {
                        var c = s[i];
                        if (!start.match(new RegExp("\\s" + c + "\\s"))) {
                            cls += ' ' + c;
                            bAdded = true;
                        }
                    }

                    if (bAdded) {
                        el.className = $S.trim(cls);
                    }
                }

                return el;
            },

            /**
             * <p>Removes one or more class names from the class name attribute of the supplied element.</p>
             *
             * <p>If the class name is not present, it will ignore it.</p>
             *
             * @param {HTMLElement|Node} el The element whose class name is to be edited.
             * @param {string|string[]} s Array of one or more classes to remove.
             */
            removeClass: function removeClass(el, s) {
                if (!el) {
                    return;
                }

                if (s.constructor !== Array) {
                    s = [ s ];
                }
                var cls = ' ' + (el.className || '') + ' ',
                    len = s.length,
                    i;

                for (i = 0; i < len; i++) {
                    cls = cls.replace(new RegExp("\\s" + s[i] + "\\s", "g"), " ");
                }
                el.className = $S.trim(cls);
            },

            /**
             * <p>Adds classes to the space delimited {@link mstrmojo.Widget.cssClass} property.</p>
             *
             * <p><strong>NOTE:</strong> This is only effective before rendering.  After rendering the {@link mstrmojo.css.addClass} method should be used.</p>
             *
             * @param {mstrmojo.Widget} widget The widget whose cssClass property should be changed.
             * @param {string|string[]} classes An array of css class names to add (will also work with a single class name).
             */
            addWidgetCssClass: function addWidgetCssClass(widget, classes) {
                // Split original class names into an array.
                var origClasses = widget.cssClass,
                    existing = (origClasses && origClasses.split(' ')) || [],
                    i;

                // Ensure classes is an array.
                classes = [].concat(classes);

                // Check if the new classes already exist.
                for (i = 0; i < classes.length; i++) {
                    var cls = classes[i];

                    // Does the class already exist in the existing classes collection ?
                    if ($A.indexOf(existing, cls) === -1) {
                        existing.push(cls);
                    }
                }

                // Reset cssClass property to new collection of classes.
                widget.cssClass = existing.join(' ');
            },

            /**
             * <p>Removes classes from the space delimited {@link mstrmojo.Widget.cssClass} property.</p>
             *
             * <p><strong>NOTE:</strong> This is only effective before rendering.  After rendering the
             * {@link mstrmojo.css.removeClass} method should be used.</p>
             *
             * @param {mstrmojo.Widget} widget The widget whose cssClass property should be changed.
             * @param {string|string[]} classes An array of css class names to add (will also work with a single class name).
             */
            removeWidgetCssClass: function removeWidgetCssClass(widget, classes) {
                // Split original class names into an array.
                var origClasses = widget.cssClass,
                    existing = (origClasses && origClasses.split(' ')) || [],
                    i;

                // Ensure classes is an array.
                classes = [].concat(classes);

                // Check if the new classes already exist.
                for (i = 0; i < classes.length; i++) {
                    var cls = classes[i];

                    // Does the class already exist in the existing classes collection ?
                    var classIndex = $A.indexOf(existing, cls);

                    // Does the class exist ?
                    if (classIndex !== -1) {
                        // Remove the class from the css class collection.
                        existing.splice(classIndex, 1);
                    }
                }

                // Reset cssClass property to new collection of classes.
                widget.cssClass = existing.join(' ');
            },

            /**
             * <p>Adds (or removes) one or more class names from the class name attribute of the supplied element.</p>
             *
             * <p>If the class name is not present, it will ignore it.</p>
             *
             * @param {HTMLElement|Node} el The element whose class name is to be edited.
             * @param {string|string[]} s Array of one or more classes to remove.
             * @param {boolean} b True if the class names should be added.
             */
            toggleClass: function toggleClass(el, s, b) {
                if (b) {
                    this.addClass(el, s);
                } else {
                    this.removeClass(el, s);
                }
            },

            /**
             * Applies a drop shadow to the supplied element.
             *
             * @param {HTMLElement} el The HTMLElement that will receive the drop shadow.
             * @param {int} xOff The offset x value for the drop shadow.
             * @param {int} yOff The offset y value for the drop shadow.
             * @param {int} spread The spread value for the drop shadow (does not apply to IE).
             * @param {string} color The hexidecimal color value for the drop shadow (must be full 7 digits for IE).
             */
            applyShadow: function applyShadow(el, xOff, yOff, spread, color) {
                var s = el.style;
                if ($D.isDXIE) {
                    s.filter += "progid:DXImageTransform.Microsoft.dropshadow(OffX=" + xOff + "px, OffY=" + yOff + "px, Color='" + color + "')";
                } else if ($D.isFF || $D.isWK || $D.isIE10) {
                    s[$D.CSS3_BOXSHADOW] = xOff + 'px ' + yOff + 'px ' + spread + 'px ' + color;
                }
            },

            /**
             * Removes any drop shadow from the supplied element.
             *
             * @param {HTMLElement} el The HTMLElement whose drop shadow should be removed.
             */
            removeShadow: function removeShadow(el) {
                var s = el.style;
                //                if ($D.isIE) {
                //                    s.filter += "progid:DXImageTransform.Microsoft.dropshadow(OffX=" + xOff + "px, OffY=" + yOff + "px, Color='" + color + "')";
                if ($D.isFF || $D.isWK || $D.isIE10) {
                    s[$D.CSS3_BOXSHADOW] = '';
                }
            },

            /**
             * Set opacity value on the given element.
             * NOTE: This method is originated from <code>getFilter</code> and <code>setFilter</code> method in DHTML.js.
             *
             * @param {HTMLElement} el The target HTMLElement to apply the opacity on.
             * @param {int} val of opacity(between 0 and 100)
             */
            setOpacity: function setOpacity(el, val) {
                if ($D.isDXIE && !$D.isIE9) {
                    var filterText = el.currentStyle.filter;
                    var filter = null;
                    if (filterText.length > 0) {
                        filter = el.filters['DXImageTransform.Microsoft.Alpha'];
                    }

                    if (filter) {
                        filter.opacity = val;
                        filter.enabled = (val !== 100);
                    } else if (val < 100) {
                        var filterDefinition = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + val + ')';
                        el.style.filter = (filterText || "") + " " + filterDefinition;
                    }
                } else {
                    // TODO: Add validation for IE10??
                    el.style.opacity = val / 100 - ($D.isIE9 ? 0.00001 : 0);
                }
            },

            /**
             * Builds an object with the browser specific property css name and value for a gradient.
             *
             * @param {int} t The type of gradient (0 = vertical, 1 = horizontal).
             * @param {string} sc The start color.
             * @param {string} ec The end color.
             *
             * @returns {Object}
             */
            buildGradient: function buildGradient(t, sc, ec) {
                if ($D.supports($D.cssFeatures.GRADIENTS)) {
                    var rtn = {};

                    if ($D.isDXIE) {
                        rtn.n = 'filter';
                        rtn.v = "progid:DXImageTransform.Microsoft.Gradient(GradientType=" + t + ",StartColorStr='" + sc + "',EndColorStr='" + ec + "')";

                    } else if ($D.isFF) {
                        rtn.n = 'background-image';
                        rtn.v = '-moz-linear-gradient(' + ((t === 0) ? 'top' : 'left') + ',' + sc + ',' + ec + ')';

                    } else if ($D.isWK) {
                        rtn.n = 'background';
                        rtn.v = '-webkit-gradient(linear,' + ((t === 0) ? 'left top, left bottom' : 'left top, right top') + ',from(' + sc + '),to(' + ec + '))';
                    } else if ($D.isIE10 || $D.isIEW3C) {
                        rtn.n = 'background';
                        rtn.v = 'linear-gradient(' + ((t === 0) ? 'to bottom' : 'to right') + ',' + sc + ',' + ec + ')';
                    }
                    return rtn;
                }

                return null;
            },

            /**
             * Returns a String of browser specific css for rounded corners.
             *
             * @param {int} r The single radius value for all borders.
             * @param {boolean} t True if the top corners are the only rounded corners.
             *
             * @returns {string}
             */
            buildRoundCorners: function buildRoundCorners(r, t) {
                if ($D.supports($D.cssFeatures.ROUND_CORNERS)) {
                    var v = r + 'px';
                    var radiusValue = v + (t ? ' ' + v + ' 0 0' : '') + ';';

                    if ($D.isFF || $D.isWinPhone || $D.isIE10) {
                        return 'border-radius:' + radiusValue;
                    }

                    if ($D.isWK) {
                        // Are all four corners the same?
                        if (!t) {
                            // Send one value.
                            return '-webkit-border-radius:' + v + ';';
                        }

                        // Otherwise, send four separate values.
                        var ds = ['left', 'right'],
                            css = [],
                            x = -1,
                            i;

                        for (i = 0; i < 2; i++) {
                            css[++x] = '-webkit-border-top-' + ds[i] + '-radius:' + v;    // Top is rounded.
                            css[++x] = '-webkit-border-bottom-' + ds[i] + '-radius:0';    // Bottom is not.
                        }

                        return css.join(';');
                    }
                }

                return '';
            },

            /**
             * Converts a css "border-width" or "padding" value to an object with individual border width or padding values in pixels.
             * "border-width" and "padding" have the same format so deal with them the same
             *
             * @param {string} b The value of the "border-width" or "padding" css property which may have 4, 3, 2 or 1 individual border widths or paddings.
             * @param {int} dpi The users DPI settings value.
             *
             * @returns {Object} An object with 't' (top), 'r' (right), 'b' (bottom), 'l' (left), 'h' (top  + bottom) and 'w' (left + right) properties which contain the
             *  individual border widths or paddings (in pixels) for the supplied border-width or padding value.
             */
            getBorderWidthsOrPaddings: function getBorderWidthsOrPaddings(b, dpi) {
                // Create empty borders object.
                var o = {
                    t: 0,
                    r: 0,
                    b: 0,
                    l: 0,
                    h: 0,
                    w: 0
                };

                // Is b undefined or empty?
                if (!b) {
                    return o;
                }

                // Split border value into components.
                var a = b.split(' '),
                    len = a.length,
                    i;

                // Convert point values to pixels.
                for (i = 0; i < len; i++) {
                    a[i] = Math.round(dpi * parseFloat(a[i]) / 72);
                }

                // Normalize the components array so there are always four border width values.
                if (len < 4) {
                    // Is there only one value?
                    if (len === 1) {
                        // Add three duplicated values for right, bottom and left.
                        a[1] = a[2] = a[3] = a[0];
                    } else {
                        // Must be 2 or 3 so left border will match right border.
                        a[3] = a[1];
                        // Are there only two values?
                        if (len === 2) {
                            // Bottom border will match top border.
                            a[2] = a[0];
                        }
                    }
                }

                // Configure and return borders object.
                o.t = a[0];
                o.r = a[1];
                o.b = a[2];
                o.l = a[3];
                o.h = o.t + o.b;
                o.w = o.l + o.r;

                return o;
            },

            /**
             * Refer to getBorderWidthsOrPaddings
             */
            getBorderWidths: function getBorderWidths(p, dpi) {
                return this.getBorderWidthsOrPaddings(p, dpi);
            },

            /**
             * Refer to getBorderWidthsOrPaddings
             */
            getPaddings: function getPaddings(p, dpi) {
                return this.getBorderWidthsOrPaddings(p, dpi);
            },

            /**
             * <p>Parks an element to the left of the viewport after it fades out.</p>
             *
             * @param {Event} evt An event with a "target" property that points to the element that has faded.
             *
             * @returns {boolean} True if the element was parked.
             */
            parkAfterFade: function parkAfterFade(evt) {
                // Get the style of the element.
                var elStyle = evt.target.style;

                // Is the element hidden?
                if (elStyle.opacity === 0) {
                    // Park the element off to the left of the viewport so it doesn't mask touch events.
                    elStyle.left = '-10000px';

                    // Restore the opacity after a timeout. (Bugfix - in iPhone we see 2 flashes because
                    //the opacity changes before the mask has been parked
                    window.setTimeout(function () {
                        elStyle.opacity = 0.99;
                    }, 0);

                    // Return true to indicate that the element was parked.
                    return true;
                }

                // Return false to indicate that the element was NOT parked.
                return false;
            },

            /**
             * Returns computed style property value for specified CSS property, like 'height', etc.
             *
             * @param {HTMLElement} el The html element
             * @param {string} prop The css property name
             *
             * @returns {string}
             */
            getStyleValue: function getStyleValue(el, prop) {
                var propIsFloat = (prop === 'float'),
                    value;

                if (el.currentStyle) { //IE
                    prop = propIsFloat ? 'styleFloat' : prop;
                    value = el.currentStyle[prop];

                } else if (document.defaultView && document.defaultView.getComputedStyle) { //FF
                    prop = propIsFloat ? 'cssFloat' : prop;
                    var styles = document.defaultView.getComputedStyle(el, null);
                    value = styles ? styles[prop] : null;
                }

                return value;
            },

            /**
             * <p>Returns the computed style of current element.</p>
             *
             * <p>To use, call this method to retrieve the elements style, then query the result for individual properties.</p>
             *
             * <pre>
             *     var computedStyle = mstrmojo.css.getComputedStyle(elem),
             *         color = cs.color,
             *         vis = cs.visibility;
             * </pre>
             *
             * @param {HTMLElement} element The HTMLElement for which to get the computed style.
             * @param {string} [pseudoElement] An optional string specifying the pseudo-element to match.  Must be omitted for regular elements.
             *
             * @returns {CSSStyleDeclaration}
             */
            getComputedStyle: function getComputedStyle(element, pseudoElement) {
                var fn = (window.getComputedStyle) ? function (element, pseudoElement) {
                        return window.getComputedStyle(element, pseudoElement || null);
                    } : function (element) {
                        return element.currentStyle || {};
                    };

                mstrmojo.css.getComputedStyle = fn;

                return fn(element, pseudoElement);
            },

            /**
             * Converts an object with css property names and css property values to a CSS text string.
             *
             * @param {Object.<string, string>} obj The CSS object.
             *
             * @returns {string}
             */
            getCssTextFromObj: function getCssTextFromObj(obj) {
                var s = '',
                    k;

                // Iterate object.
                for (k in obj) {
                    // Add css name/property to return string.
                    s += k + ':' + obj[k] + ';';
                }

                // Return result.
                return s;
            },

            /**
             * Callback a function after a transition is done, if transitions are not supported by the browser the function is called asynchronously
             *
             * @param {HTMLElement} el The HTMLElement for which to listen for the transition end.
             * @param {Function} cb callback to be executed
             */
            onTransitionEnd: function onTransitionEnd(el, cb) {
                var t = "transition",
                    modernizr = window.Modernizr;

                //Check if transitions are supported
                if (modernizr.testProp(t)) {
                    // Attach one time event listener to hear when event happens
                    $D.attachOneTimeEvent(el, $D.transEndEvtNames[modernizr.prefixed(t)], cb);
                } else {
                    //browser doesn't support animations so just callback
                    window.setTimeout(cb, 0);
                }
            },

            /**
             * <p>Applies one or more css classes on the given DOM element for a given duration and then removes it.</p>
             *
             * @param {HTMLElement|Node} el The element whose class name is to be edited.
             * @param {String|String[]} cls Array of one or more classes to add or remove.
             * @param {int} duration The duration for which we need to flash the class(es)
             */
            flashClass: function flashClass(el, cls, duration) {
                this.toggleClass(el, cls, true);

                var $DOM = this;
                window.setTimeout(function () {
                    $DOM.toggleClass(el, cls, false);
                }, duration);
            },

            /**
             * Converts the passed hyphen delimited CSS style string (e.g., background-color) to it's corresponding camelCase version (e.g., backgroundColor).
             *
             * @param {String} cssName The string to convert.
             *
             * @returns {String}
             */
            convertCssToCamelCase: function convertCssToCamelCase(cssName) {
                return cssName.replace(/\-([a-z])/gi, function (match, hyphenated) {
                    return hyphenated.toUpperCase();
                });
            },

            /**
             * Debug function that loops through all the stylesheets prints the rules and the selectors displayed in it.
             *
             * @param {String=} fileName An optional file name to limit the output to a single file's information.
             * @ignore
             */
            printCSSInfo: function printCSSInfo(fileName) {
                var styleSheets = document.styleSheets,
                    totalStyleSheets = styleSheets.length,
                    j,
                    i;

                // Loop through all the stylesheets defined on the page.
                for (i = 0; i < totalStyleSheets; i++) {
                    var styleSheet = styleSheets[i],
                        rules = styleSheet.cssRules,
                        totalRulesInStylesheet = rules ? rules.length : 0,
                        totalSelectorsInStylesheet = 0;

                    // Find all the selectors defined within the rules.
                    for (j = 0; j < totalRulesInStylesheet; j++) {
                        var selectorText = rules[j].selectorText;

                        // Do we have a selector text ?
                        if (selectorText) {
                            try {
                                totalSelectorsInStylesheet += selectorText.split(',').length;
                            } catch (err) {
                                // Fail silently.
                            }
                        }
                    }

                    // Grab the link of the stylesheet.
                    var cssFileName = styleSheet.href;

                    // Do we not have any filenames provided or if it is provided, is it the one we care about ?
                    if (!fileName || (cssFileName && $A.indexOf(cssFileName, fileName) > -1)) {
                        // Print the stylesheet link, if it doesn't exist, very likely it's an inline CSS block.
                        console.log("Stylesheet: " + cssFileName || "Inline CSS Block");

                        // Next - print the rules and number of selectors in the given stylesheet.
                        console.log("Total rules: " + totalRulesInStylesheet);
                        console.log("Total selectors: " + totalSelectorsInStylesheet);
                    }
                }
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.string",
                         "mstrmojo.dom",
                         "mstrmojo.hash");

    var $STRING = mstrmojo.string,
        $HASH = mstrmojo.hash,
        $DOM = mstrmojo.dom;

    /**
     * An orphaned DOM element used for creating other elements.
     * @private
     * @static
     * @todo Need to add code to set creationElement to null when window unloads.
     */
    var creationElement = mstrmojo.usesFrames ? null : document.createElement('span');

    var REG_EXP_EVENTS = /mstrAttach:([\w,]+)/g;

    /**
     * <p>Used to determine if mouse event handlers should be rendered and if click event handlers should be replaced with touch start event handlers.</p>
     *
     * @default undefined If undefined at run time this value will be calculated (and then cached for performance).
     * @private
     */
    var isTouchEnabled;

    /**
     * Replaces tokens for event handlers in a given markupString with actual
     * event handler markup.
     *
     * @param {String} s The HTML template string with event handler tokens.
     *
     * @returns {String} The HTML string with replaced event handler tokens.
     * @private
     */
    function replaceEvtTokens(s) {
        // Have we NOT calculated the isTouchEnabled flag?
        if (isTouchEnabled === undefined) {
            // Ask the Application if it is touch enabled (default to false if no application is found).
            isTouchEnabled = (mstrApp !== undefined && mstrApp.isTouchApp && mstrApp.isTouchApp()) || false;
        }

        return s.replace(REG_EXP_EVENTS, function hRepl(token, es) {
            var arr = es.split(","),
                out = [],
                len = arr.length,
                i;

            for (i = 0; i < len; i++) {
                var e = arr[i];
                if (e) {
                    // Is touch enabled for the application.
                    if (isTouchEnabled) {
                        // Is this a mouse event?
                        if (e.indexOf('mouse') > -1) {
                            // Ignore this event because touch has no equivalent.
                            continue;

                        // Is this a click event?
                        } else if (e === 'click') {
                            // Replace click with touchstart.
                            e = 'touchend';
                        }
                    }

                    // Add event handling markup.
                    out.push('on' + e + '="mstrmojo.dom.captureDomEvent(\'{@id}\',\'' + e + '\', self, event)"');
                }
            }
            return out.join(" ");
        });
    }

    var PRE = 'preBuildRendering',
        BUILD = 'buildRendering',
        POST = 'postBuildRendering';

    /**
     * <p>Creates a DOM node (and its descendants) for a given widget from its "markupString" property.</p>
     *
     * <p>The method accomplishes this by creating a (temporary) &lt;span&gt; container, setting its innerHTML,
     * then removing the resulting firstChild from the &lt;span&gt; container.  The innerHTML is set to the
     * Widget's markup string after some modifications (tokens representing dynamic values in HTML are replaced
     * with actual values).</p>
     *
     * @param {Object} widget The widget whose DOM will be built.
     * @returns {HTMLElement|Node} The newly created HTMLElement.
     * @private
     */
    function buildDomNode(widget) {

        var s = widget.markupString;
        // Does the markupString template have abbreviated event handler tokens ("mstrAttach")?
        if (s.match(/mstrAttach:/)) {
            // Yes, replace those tokens with unabbreviated markup.
            s = replaceEvtTokens(s);
            // Optimization: If the template is used for all class instances...
            if (widget.markupString === widget.constructor.prototype.markupString) {
                // ...update the template for all instances.
                widget.constructor.prototype.markupString = s;
            }
        }
        var html = $STRING.apply(s, widget);
        if (html) {
            if (mstrmojo.usesFrames) {
                // Optimization: only do doc-check if our app is using frames.
                // Otherwise, assume there is only one global doc object for this code's lifespan.
                var doc = (widget.domNode && widget.domNode.ownerDocument) || window.document;
                if (!creationElement || creationElement.ownerDocument !== doc) {
                    creationElement = doc.createElement('span');
                }
            }
            creationElement.innerHTML = html;
            var d = creationElement.removeChild(creationElement.firstChild);
            // Drag-drop manager assumes ever widget.domNode has an mstrmojoId expando property.
            d.mstrmojoId = widget.id;
            return d;
        }
        return null;
    }

    /**
     * Calls the given widget's "markupSlots" methods to retrieve the slot nodes for that widget.
     *
     * @param {mstrmojo._HasMarkup} widget The widget.
     *
     * @returns {Object.<string, Node>} A hash (Object) of slot nodes, keyed by slot name.
     * @private
     */
    function callSlots(widget) {
        // Walk the collection of slot setter functions.
        var ms = widget.markupSlots,
            nodes,
            n;

        if (ms) {
            nodes = {};
            for (n in ms) {
                nodes[n] = ms[n].call(widget);
            }
        }
        return nodes;
    }

    /**
     * A mixin for classes that will be represented with markup in the page.
     *
     * @mixin
     * @public
     */
    mstrmojo._HasMarkup = mstrmojo.provide(
        "mstrmojo._HasMarkup",

        /**
         * @lends mstrmojo._HasMarkup.prototype
         */
        {
            /**
             * String template that specifies the HTML for this Widget's GUI.
             * @type {String}
             */
            markupString: null,

            /**
             * <p>Optional hash of methods that will be fired in response to specific events in this widget.</p>
             *
             * <p>This hash is used for reflecting the widget's state in its markup.  The hash is keyed by the events
             * to be monitored (e.g., "on&lt;eventName&gt;"). The hash values are each a Function that will be executed
             * when that event occurs.</p>
             *
             * <p>When a widget is first rendered, all of its markupMethods are called immediately, to initialize its DOM.</p>
             *
             * <p>One exception is the reserved key "sequence". That optional key's value is an array of key names.
             * This array lists the order in which these markupMethods should be fired. If missing, the order is arbitrary.</p>
             *
             * @type {Object}
             */
            markupMethods: null,

            /**
             * <p>A hash of functions that will return the node for the key from within this widget's markup.</p>
             *
             * @type {Object.<string, Function>}
             */
            markupSlots: null,

            onRender: mstrmojo.emptyFn,

            onUnRender: mstrmojo.emptyFn,

            /**
             * <p>Manages the rendering of this widget's domNode.</p>
             *
             * <p>The method calls "buildRendering", as well as calls to optional "preBuildRendering" and "postBuildRendering" hooks
             * for customization. If any method returns exactly false, aborts the rendering.</p>
             *
             * @return {Boolean} True if the rendering changed.
             */
            render: function render() {
                if ((this[PRE] && this[PRE]() === false) || (this[BUILD]() === false) || (this[POST] && this[POST]() === false)) {
                    return false;
                }

                this.hasRendered = !!this.domNode;

                this.onRender();

                // Is anybody listening for the hasRendered event?
                var evtName = 'renderComplete';
                if (mstrmojo.publisher.hasSubs(this.id, evtName)) {
                    // Raise the event.
                    this.raiseEvent({
                        name: evtName
                    });
                }

                return true;
            },


            buildDom: function buildDom() {
                return buildDomNode(this);
            },

            /**
             * Called after the domNode is generated.
             *
             * @type {Function}
             */
            postBuildDom: null,

            /**
             * Called before the domNode is rendered.
             *
             * @type {Function}
             */
            preBuildRendering: mstrmojo.emptyFn,

            /**
             * <p>Builds and sets this.domNode.</p>
             *
             * <p>This method will build this.domNode by applying the HTML markup string in this
             * instance's "markupString" property.</p>
             *
             * @return {Boolean} True.
             */
            buildRendering: function buildRendering() {

                // Build a new DOM node according to this Widget's markupString.
                var dnWas = this.domNode,
                    dn = this.buildDom();

                this.domNode = dn;

                // Hook for customizations immediately after markup generation.
                if (this.postBuildDom) {
                    this.postBuildDom();
                }

                // Clear any old slots from previous renderings.
                if (this.slotNames) {
                    this.removeSlots(this.slotNames);
                }
                // Call all the "markupSlots" getters and record the slots found.
                this.addSlots(callSlots(this));

                // Call all the "markupMethods", to initial state of this Widget's DOM.
                this.paint();

                // Now that the DOM is ready, we can place it in the HTML page.
                if (dn) {
                    // Our placeholder is either the previous "domNode"...
                    var ph = dnWas;
                    if (!ph) {
                        // ..or if we don't have a previous "domNode", use the "placeholder" property.
                        ph = this.placeholder;
                        if (ph) {
                            // If its a string, assume its a node's id.
                            if (typeof ph === 'string') {
                                ph = document.getElementById(ph);
                            }
                            // Clear the placeholder property after it's been used one time.
                            delete this.placeholder;
                        }
                    }
                    if (ph) {
                        $DOM.replace(ph, dn);
                    }
                }

                // Optimization: Notify your parent (if any) directly that your domNode has
                // changed.  This used to be done indirectly by having the Container parent
                // listen for the "domNodeChange" event but that leads to thousands of events
                // being raised on page load.
                var fn = "onchildRenderingChange",
                    p = this.parent;
                if (p && p[fn]) {
                    p[fn](this);
                }

                return true;
            },

            /**
             * Called after the domNode is rendered.
             *
             * @type {Function}
             */
            postBuildRendering: mstrmojo.emptyFn,

            /**
             * <p>Removes this widget's domNode from the document, resets the widget's "domNode" property to null,
             * clears all of its slots (if any), and resets its "hasRendered" to false.</p>
             *
             * <p>If this widget's hasRendered is false, this method does nothing.</p>
             *
             * @param {Boolean} ignoreDom If true we don't need to remove the domNode from the document (meaning, it's being handled
             * by a parent or ancestor).
             */
            unrender: function unrender(ignoreDom) {
                // If the element is in the DOM then we need to remove it.
                if (this.hasRendered) {
                    if (!ignoreDom) {
                        try {
                            var dn = this.domNode;
                            // if the node has a parent then remove it
                            if (dn.parentNode) {
                                dn.parentNode.removeChild(dn);
                            }
                            // if we are running in IE, wipe out the outerHTML to force IE to release memory
                            if (mstrmojo.dom.isIE && dn.outerHTML !== "undefined") {
                                dn.outerHTML = "";
                            }
                        } catch (ex) {
                          //swallow
                        }
                    }
                    this.domNode = null;
                    this.removeSlots(this.slotNames);
                    this.hasRendered = false;

                    this.onUnRender();
                }
            },

            /**
             * <p>Executes all the given widget's markupMethods to initialize state of the widget's DOM.</p>
             *
             * <p>Typically the markupMethods are called in batch only once per rendering, immediately after the widget's domNode
             * is built. Subsequently, markupMethods are called individually in response to events as they occur.  To allow the
             * methods to distinguish between the first (batch) call and subsequent individual calls, a single optional Boolean param is
             * passed into the methods. This param is set to true only during the initial batch call.</p>
             */
            paint: function paint() {
                var ms = this.markupMethods;
                if (!ms) {
                    return;
                }
                var me = this,
                    callM = function (n) {
                        var f = ms[n];
                        if (f) {
                            try {
                                f.apply(me, [true]);
                            } catch (localErr) {
                                throw new Error([
                                    "Error in markup method.",
                                    "Script class: " + me.scriptClass,
                                    "Widget id: " + me.id,
                                    "Method name: " + n,
                                    "Err: " + localErr.message
                                ].join('\n\n'));
                            }
                        }
                    };
                var s = ms.sequence,
                    len,
                    i,
                    n;

                if (s) {
                    len = s.length || 0;
                    for (i = 0; i < len; i++) {
                        callM(s[i]);
                    }
                } else {
                    for (n in ms) {
                        callM(n);
                    }
                }
            },

            /**
             * <p>Called when a redraw of this widget is needed.</p>
             *
             * @return {boolean} true if redrawing was successful.
             * @default false
             */
            redraw: function redraw() {
                return false;
            },

            /**
             * <p>Forces a re-render of this widget.</p>
             *
             * <p>If this widget is already rendered, this method unrenders and then re renders it;
             * otherwise, does nothing.</p>
             *
             * <p>When refreshing an orphan, this method temporarily sets the previous domNode as the placeholder
             * for the next domNode, and asks the unrender not to remove that placeholder from the document.
             * This not done for children as they rely on slots rather placeholders.</p>
             *
             * @param {Function} [postUnrender] Callback to be notified after the unrender (if any) but before the re-render.
             */
            refresh: function refresh(postUnrender) {
                // Has this widget rendered already?
                if (this.hasRendered) {
                    // Ask widget to redraw.  If it doesn't explicitly return true then proceed to render again.
                    if (this.redraw() !== true) {
                        // Cache handle to the domNode even if we are a child of a container; otherwise
                        // we may lose our place within our siblings that share the same slot.
                        var ph = this.domNode;
                        // When unrendering, don't try to remove domNode from HTML; we need it to
                        // stay put so we can replace it with the new domNode after re-rendering.
                        this.unrender(true);
                        this.placeholder = ph;
                        if (postUnrender) {
                            postUnrender();
                        }
                        this.render();
                    }
                }
            },

            /**
             * <p>Extends the set() method from _Observable so that it calls the corresponding markup method for the property, thus updating the DOM.</p>
             *
             * <p>This is done regardless of whether or not an event is published corresponding to the change in property value.</p>
             *
             * <p>If a property named "<n>" is changed, the corresponding markupMethod to call is assumed to be named "on<n>Changed".</p>
             *
             * @param {String} n The name of the property whose value is to be set.
             * @param {*} v The new value.
             *
             * @returns {Object} this
             */
            set: function set(n, v) {
                // We must call the super method first to update the property value,
                // because the markup method will assume the property value has been updated.
                this._super(n, v);

                if (this.domNode) {  //was: this.hasRendered, changed it in order to fire this code in mid-rendering cycle
                    // If an event is published, ideally the markup method should be
                    // done before publishing the event to external listeners so that the DOM
                    // response is immediate, but for now that can't be done, because the
                    // superclass method already took care of the publishing.
                    var ms = this.markupMethods,
                        f = ms && ms["on" + n + "Change"];
                    if (f) {
                        f.apply(this);
                    }
                }
                return this;
            },


            /**
             * <p>A hash of names used for DOM node slots.</p>
             *
             * <p>A "slot" is a DOM node in a Widget's rendering which has some special significance. Such a node would be labeled with a special attribute in the Widget's markup string.
             * This mixin will store a reference to each such dom node as a property of this Widget; the property's name is designed by the "mstrSlot"
             * attribute of the DOM node.  This allows javascript convenient access to meaningful nodes in the DOM rendering beyond just the root "domNode".</p>
             *
             * <p>All slot label names that are found in this Widget's DOM are recorded in an internal hash so the references to those nodes can be destroyed
             * later for garbage collection.<p>
             *
             * @type {Object}
              */
            slotNames: null,

            /**
             * <p>Given a hash of DOM nodes, keyed by slot name, this method sets properties on this widget that point to the DOM nodes.</p>
             *
             * <p>Each property is named after the slot name.  Additionally, each property name is stored in the widget's internal "this.slotNames" hash for future reference.</p>
             *
             * @param {Object} slots A has of slot names to add.
             */
            addSlots: function addSlots(slots) {
                // Initialize internal hash table of slot names.
                var ns = this.slotNames,
                    n;

                if (!ns) {
                    ns = {};
                    this.slotNames = ns;
                }

                // Add each given slot to our hash tables.
                for (n in slots) {
                    this[n] = slots[n];
                    ns[n] = true;
                }
            },

            /**
             * <p>Given a hash table of slot names, removes each slot-named property value from this widget.</p>
             *
             * <p>This method also removes the given slot names from the internal hash of used slot names
             * for this widget (this.slotNames).</p>
             *
             * @param {Object} slots A hash of slot names to remove, keyed by slot name.
             */
            removeSlots: function removeSlots(slots) {
                if (slots) {
                    var sns = this.slotNames,
                        n;

                    for (n in slots) {
                        delete this[n];
                        if (sns) {
                            delete sns[n];
                        }
                    }
                }
            },

            /**
             * <p>Generic method to wire up DOM events to widget's handlers.</p>
             *
             * <p>This generic method can be called from any DOM handler in the markup.  It acts as a bridge between the
             * markup's native DOM handler and the widget's handler method for that event. This method synthesizes
             * an object representing the event, and raises that event. If DOM provides an event object, that DOM event object is
             * enclosed in the synthesized object, along with an optional config hash of params.</p>
             *
             * <p>Typical usage: a Widget subclass typically implements the preXXX & postXXX methods, but leaves the
             * onXXX method empty, to be specified by the app developer in the config of the Widget instance.</p>
             *
             * <p>Example:</p>
             * <pre>var myButton = new mstrmojo.Button({onclick: function () {alert("Hello world!")});</pre>
             *
             * @param {String} type The name of the DOM event.
             * @param {Window} hWin The DOM window in which the event originated.
             * @param {Event} [e] The DOM event object, if provided by the browser.
             * @param {Object} [config] Hash of configuration settings to be passed along to the widget handler.
             */
            captureDomEvent: function captureDomEvent(type, hWin, e, config) {
                if (this.enabled !== false) {
                    this.raiseEvent(mstrmojo._HasMarkup.newDomEvent(type, hWin, e || hWin.event, config));
                }
            },

            /**
             * <p> Method to play an effect expressed by a json object on this widget. </p>
             * TO-DO: where would be the best place to locate this?
             */
            playEffect: function playEffect(n) {
                var fx = this[n];
                if (fx && fx.constructor === Object) {
                    fx = mstrmojo.insert(mstrmojo.hash.clone(fx)); //TO-DO: do we really need to make a copy of fx first?
                    fx.widget = this;
                    this[n] = fx;
                }
                if (fx) {
                    fx.play();
                }
            }
        }
    );

    /**
     * Adds the passed markup methods to the prototype of the passed class constructor.
     *
     * @param {Object} clazz The class constructor to augment.
     * @param {Object} methods The methods to add.
     *
     * @static
     */
    mstrmojo._HasMarkup.addMarkupMethods = function addMarkupMethods(clazz, methods) {
        // Replace markup methods with an augmented copy of the original markup methods.
        clazz.prototype.markupMethods = $HASH.copy(methods, $HASH.copy(clazz.prototype.markupMethods));
    };

    /**
     * @typedef {{
     *     name: String,
     *     hWin: Window,
     *     e: MouseEvent,
     *     config: Object,
     *     ctrlKey: boolean,
     *     shiftKey: boolean,
     *     metaKey: boolean,
     *     cancel: Function,
     *     preventDefault: Function,
     *     getTarget: function():EventTarget|Node
     * }}
     *
     * @property {String} name The name of the event.
     * @property {Window} hWin The parent window of the event.
     * @property {Event} e The native Mouse Event.
     * @property {Object} [config] An optional configuration object.
     * @property {boolean} ctrlKey True if the control key is depressed.
     * @property {boolean} shiftKey True if the shift key is depressed.
     * @property {boolean} metaKey True if the meta key (mac) is depressed.
     * @property {Function} cancel Stops native event propagation.
     * @property {Function} preventDefault Prevents the native default action.
     * @property {function():EventTarget|Node} getTarget Returns the target of the event.
     */
    mstrmojo._HasMarkup.MSTRDomEventType = null;

    /**
     * Returns a new MSTR DOM event instance.
     *
     * @param {String} type The name of the DOM event.
     * @param {Window} hWin The DOM window in which the event originated.
     * @param {Event} winEvt The DOM event object, if provided by the browser.
     * @param {Object} [config] An optional hash of configuration settings.
     *
     * @returns {mstrmojo._HasMarkup.MSTRDomEventType}
     */
    mstrmojo._HasMarkup.newDomEvent = function (type, hWin, winEvt, config) {
        return /** @type {mstrmojo._HasMarkup.MSTRDomEventType} **/ {
            name: type,
            hWin: hWin,
            e: winEvt,
            config: config,
            ctrlKey: $DOM.ctrlKey(hWin, winEvt),
            shiftKey: $DOM.shiftKey(hWin, winEvt),
            metaKey: $DOM.isMetaKey(hWin, winEvt),

            /**
             * Cancels the event propagation.
             * @ignore
             */
            cancel: function () {
                $DOM.stopPropogation(hWin, winEvt);
            },

            /**
             * Prevents the events default behavior.
             * @ignore
             */
            preventDefault: function () {
                $DOM.preventDefault(hWin, winEvt);
            },

            /**
             * Returns the target of the event.
             *
             * @returns {EventTarget|Node}
             * @ignore
             */
            getTarget: function () {
                return $DOM.eventTarget(hWin, winEvt);
            }
        };
    };
}());
(function () {

    mstrmojo.requiresCls('mstrmojo.css');

    var $CSS = mstrmojo.css;

    /**
     * <p>A mixin for UI widgets that wish for their children to use a theme.
     *
     * @mixin
     * @public
     */
    mstrmojo.ui._HasUITheme = mstrmojo.provide(
        'mstrmojo.ui._HasUITheme',

        /**
         * @lends mstrmojo.ui._HasUITheme
         */
        {
            _mixinName: 'mstrmojo.ui._HasUITheme',

            /**
             * The theme class this component (and it's descendants) will use.
             *
             * @type {String}
             * @default ''
             */
            themeClassName: '',

            postBuildRendering: function postBuildRendering() {
                // Is there a theme class name?
                var themeClass = this.themeClassName;
                if (themeClass) {
                    // Trigger initial theme class change.
                    this.onthemeClassNameChange({
                        value: themeClass
                    });
                }

                return this._super();
            },

            onthemeClassNameChange: function onthemeClassNameChange(evt) {
                // Do we have a DOM node?
                var domNode = this.domNode;
                if (domNode) {
                    var newClass = evt.value,
                        oldClass = evt.valueWas;

                    // Is there a new theme class?
                    if (newClass) {
                        // Add class to DOM Node.
                        $CSS.addClass(domNode, evt.value);
                    }

                    // Is there an old class?
                    if (oldClass) {
                        // Remove class from DOM node.
                        $CSS.removeClass(domNode, evt.valueWas);
                    }
                }
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.css",
        "mstrmojo.dom",
        "mstrmojo.fx");

    var $CSS = mstrmojo.css,
        $DOM = mstrmojo.dom,
        $ARR = mstrmojo.array,
        $SB_PROPS = {
            v: {
                styleDim: 'height',
                styleDir: 'top',
                dimension: 'h',
                position: 'y',
                scroll: 'scrollTop',
                scrollDimension: 'scrollHeight',
                cls: 'vertical',
                hostCls: 'hasVertical',
                scrollNodeCls: 'hasVertical'
            },
            h: {
                styleDim: 'width',
                styleDir: 'left',
                dimension: 'w',
                position: 'x',
                scroll: 'scrollLeft',
                scrollDimension: 'scrollWidth',
                cls: 'horizontal',
                hostCls: 'hasHorizontal',
                scrollNodeCls: 'hasHorizontal'
            }
        },
        CSS_SCROLLING_MODE = 'scrollingMode',
        CSS_SCROLLING = 'scrolling',
        SCROLLBAR_MIN_BUFFER = 3;

    /*
     * Flag of Mac OS X
     * @type {boolean}
     */
    var isMac = $DOM.getOSInfo().name.toLowerCase().indexOf('mac') >= 0;

    /**
     * Returns the configured scroll host element or the parent node of the scroll node.
     *
     * @returns {HTMLElement|Node} The host node for the scrollbars.
     * @private
     */
    function getScrollbarHostNode() {
        return (this.scrollbarHostNode || (this.scrollNode && this.scrollNode.parentNode));
    }

    /**
     * Event listener for when the user clicks on the scroll track.
     *
     * @param {Event} evt
     * @param {window} hWin
     *
     * @private
     */
    function scrollTrackClick(evt, hWin) {
        var target = $DOM.eventTarget(hWin, evt),
            scrollNode = this.scrollNode,
            scrollNodePos = $DOM.position(scrollNode),
            scrollTrackNodes = this.scrollTrackNodes,
            scrollBarNodes = this.scrollBarNodes,
            processTrackClick = function processTrackClick(direction) {
                var isScrollTrack = target === scrollTrackNodes[direction];

                // Has the user clicked on the scroll track ?
                if (isScrollTrack) {
                    var scrollBarProps = $SB_PROPS[direction],
                        scrollBar = scrollBarNodes[direction],
                        targetPos = $DOM.position(scrollBar),
                        clickPos = $DOM.getMousePosition(evt, hWin)[scrollBarProps.position],
                        scrollbarDelta = clickPos - targetPos[scrollBarProps.position],
                        sign = scrollbarDelta > 0 ? 1 : -1,
                        scrollDimension = scrollNode[scrollBarProps.scrollDimension],
                    // Try to align the scrollbar to the center of the mouse click.
                        scrollNodeDelta = Math.abs(scrollbarDelta - (targetPos.h / 2)) * (scrollDimension / scrollNodePos[scrollBarProps.dimension]),
                        animateProps = {};

                    // Set hte property to be animated.
                    animateProps[scrollBarProps.scroll] = {
                        isStyle: false,
                        start: scrollNode[scrollBarProps.scroll],
                        stop: scrollNode[scrollBarProps.scroll] + (sign * Math.min(scrollDimension / 3, 500, scrollNodeDelta)),
                        ease: mstrmojo.ease.linear
                    };

                    // Animate the scroll top/left...
                    (new mstrmojo.fx.AnimateProp({
                        props: animateProps,
                        duration: 200,
                        interval: 10,
                        target: scrollNode
                    })).play();
                }
            };

        // Process clicks in both directions...
        processTrackClick.call(this, 'h');
        processTrackClick.call(this, 'v');
    }

    /**
     * Handler for mouse wheel event on scroll track/bar.
     * @param evt
     * @param hWin
     */
    function scrollTrackWheelHandler(evt, hWin) {
        var scrollNode = this.scrollNode,
            isMouseWheelEvt = evt.type === 'mousewheel',
        //MouseWheel event's wheelDelta is opposite to delta or the scrolling direction,
        // need to negate it to the right data for scrollingTop/Left.
            negation = isMouseWheelEvt ? -1 : 1;

        // Handle both scrolling direction
        mstrmojo.array.forEach(['h', 'v'], function (direction) {
            var scrollBarProps = $SB_PROPS[direction],
            //Chromium CEF only supports 'mousewheel' event which provides property 'wheelDelta' not 'delta'.
                wheelDeltaProp = isMouseWheelEvt ? 'wheelDelta' : 'delta',
                wheelDelta = evt[wheelDeltaProp + {h: 'X', v: 'Y'}[direction]] * negation, //wheelDelta is opposite to delta
                wheelDeltaAbs = Math.abs(wheelDelta),
                sign = wheelDelta / wheelDeltaAbs,   //scrolling direction
                isFirefoxOnWin = wheelDeltaAbs === 3 && $DOM.isFF && !isMac;

            // Mac OS X - Chrome/Firefox/Safari all provide actual scroll distance in event.deltaX/Y
            // Windows - Chrome/Safari/IE - provide actual scroll distance in event.deltaX/Y
            //         - Chrome always uses a fixed amount of 100
            //         - IEs get the amount depending on the ratio of container height(width) / scrollHeight(Width)
            //         - Firefox always provides evt.deltaX/Y as a constant (3/-3)
            //              but its actual scroll distance depends on ratio of document.documentElement height(width)/scrollHeight(width),
            //              and around constant 40 on a child element.
            //              -- It'd be ok to use browser-provided delta with Chrome/IE, but Firefox has to use 40 as a workaround below.

            // Update scrollNode scrollTop/Left to scroll
            scrollNode[scrollBarProps.scroll] += isFirefoxOnWin ? sign * 40 : wheelDelta;
        });

        $DOM.stopPropogation(hWin, evt);
        $DOM.preventDefault(hWin, evt);
    }

    /**
     * Private helper function to set up the scrollbar nodes for a single direction.  If this function returns true if means
     * that the widget is scrollable in the indicated direction.
     *
     * @param {String} direction
     *
     * @returns {boolean}
     * @private
     */
    function setupScrollBars(direction) {
        var px = 'px',
            scrollBarProps = $SB_PROPS[direction],
            scrollNode = this.scrollNode,
            hostNode = getScrollbarHostNode.call(this),
            scrollNodePos = $DOM.position(scrollNode),
            scrollNodeDim = scrollNodePos[scrollBarProps.dimension],
            scrollDimension = scrollNode[scrollBarProps.scrollDimension],
            scrollRatio = Math.ceil(scrollNodeDim) / scrollDimension,
            scrollBarNodes = this.scrollBarNodes,
            scrollBar = scrollBarNodes[direction],
            scrollTrackNodes = this.scrollTrackNodes,
            scrollTrack = scrollTrackNodes[direction],
            isNodeScrollable = (!isNaN(scrollRatio) && scrollRatio < 1) && (Math.abs(scrollNodeDim - scrollDimension) > SCROLLBAR_MIN_BUFFER),
            scrollCSSClass = scrollBarProps.cls;

        // Do we not have a scrollbar node in this direction?
        if (!scrollBar) {
            // Create the scroll track node.
            scrollTrack = scrollTrackNodes[direction] = document.createElement('div');

            // Attach a click listener on the scroll track and trigger it on the widget..
            var widget = this,
                clickHandler = function (e) {
                    scrollTrackClick.call(widget, e);
                },
                wheelHandler = function (e) {
                    scrollTrackWheelHandler.call(widget, e);
                },
                registerEventListener = function (e, evt, h) {
                    $DOM.attachEvent(e, evt, h);
                    widget.installedEventListeners.push({
                        e: e,
                        evt: evt,
                        fn: h
                    });
                };

            registerEventListener(scrollTrack, 'click', clickHandler);

            // Add specific class names and the direction class name to the scroll bar.
            scrollTrack.className = 'mstrmojo-scrolltrack ' + scrollCSSClass;

            // Create the scroll indicator.
            scrollBar = scrollBarNodes[direction] = document.createElement('div');


            // Add specific class names and the direction class name to the scroll bar.
            scrollBar.className = 'mstrmojo-scrollbar ' + scrollCSSClass;

            // Append the scrollbar to it's corresponding scroll track node.
            scrollTrack.appendChild(scrollBar);

            // Append both the scrollbar nodes in the host node.
            hostNode.appendChild(scrollTrack);

            // Attach mouse wheel event listener on the scrollTrack/scrollBar nodes
            //Chromium CEF only supports 'mousewheel'.
            var wheelEvent = mstrApp.isSingleTier ? 'mousewheel' : 'wheel';

            registerEventListener(scrollTrack, wheelEvent, wheelHandler);
            registerEventListener(scrollBar, wheelEvent, wheelHandler);
        }

        var scrollBarStyle = scrollBar.style,
            percentageScrolled = (scrollNode[scrollBarProps.scroll] / scrollNode[scrollBarProps.scrollDimension]),
            scrollNodeDelta = $DOM.delta(scrollNode, getScrollbarHostNode.call(this))[scrollBarProps.position],
            scrollTrackStyle = scrollTrack.style;

        // Is the scroll node scrollable?
        if (isNodeScrollable) {
            // In case the scroll node is offset from the scroll host, adjust the track.
            scrollTrackStyle[scrollBarProps.styleDir] = scrollNodeDelta + px;

            // Set the scrollbar's dimension.
            scrollBarStyle[scrollBarProps.styleDim] = (scrollRatio * scrollNodeDim) + px;

            // Set the position of the scroll bar based on the scroll position
            scrollBarStyle[scrollBarProps.styleDir] = (scrollNodeDim * percentageScrolled) + px;
        }

        $CSS.toggleClass(hostNode, scrollBarProps.hostCls, isNodeScrollable);
        $CSS.toggleClass(scrollNode, scrollBarProps.scrollNodeCls, isNodeScrollable);

        return isNodeScrollable;
    }

    /**
     * Returns whether the application should show scrollbars.
     *
     * @returns {boolean}
     */
    function shouldShowScrollbars() {
        // Return false for SingleTier Macs since the native Mac scrollbar is pretty cool!
        return !(mstrApp.isSingleTier && isMac);
    }

    /**
     * <p>A mixin for widgets that have a customized scroller.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo.ui._HasScroller = mstrmojo.provide(
        'mstrmojo.ui._HasScroller',

        /**
         * @lends mstrmojo.ui._HasScroller
         */
        {
            _mixinName: "mstrmojo.ui._HasScroller",

            /**
             * Flag denoting whether the widget supports custom scrollbars.
             *
             * @type {boolean}
             * @default true
             */
            hasCustomScrollbar: true,

            /**
             * The widget needs to be draggable to drag the scrollbars.
             *
             * @type {Boolean}
             * @default true
             */
            draggable: true,

            /**
             * Denotes that the widget will provide it's own avatar.
             *
             * @type {boolean}
             */
            ownAvatar: true,

            /**
             * <p>The scroll node to have the customized scrollbar.</p>
             *
             * @type {HTMLElement|Node}
             * @default undefined
             */
            scrollNode: undefined,

            /**
             * <p>An optional host node for the scrollbar nodes. If not specified, defaults to the parent of the scrollNode.</p>
             *
             * @type {HTMLElement|Node}
             * @default undefined
             * @optional
             */
            scrollbarHostNode: undefined,

            /**
             * <p>Internal property to hold the collection of the scrollbar dom nodes.</p>
             *
             * @ignore
             */
            scrollBarNodes: undefined,

            /**
             * <p>Abstract function that should be implemented to setup the scroll nodes for the scroller.</p>
             */
            setupScrollNodes: mstrmojo.emptyFn,

            /**
             * DOM event listeners attached that need disposing on destroy()
             * @type {Array}
             */

            installedEventListeners: null,


            init: function init(props) {
                // Call super.
                this._super(props);

                // Check if the scrollbars are supported and set it on a local property.
                this.hasCustomScrollbar = shouldShowScrollbars();

                this.installedEventListeners = [];
            },

            onRender: function onRender() {
                if (this._super) {
                    // Call Super.
                    this._super();
                }

                // Update the scroller config.
                this.updateScrollbars();

                var scrollNode = this.scrollNode;

                // Do we have a scroll node ready ?
                if (scrollNode) {
                    // Set an event listener to hear on the scroll node. TODO: How do we detect if a node already has a scroll listener?
                    var fnEventHandler = $DOM.attachMarkupEvent(this.id, scrollNode, 'scroll');

                    // Add to listener collection so that it can be disposed when unrendering.
                    this.installedEventListeners.push({
                        e: scrollNode,
                        evt: 'scroll',
                        fn: fnEventHandler
                    });
                }

                // Are the custom scrollbars not supported ?
                if (!this.hasCustomScrollbar) {
                    // Add a CSS class to ensure that the overflow is set up correctly on the scroll node.
                    $CSS.addClass(scrollNode, 'mstrmojo-sb-show-default');

                    // Return - nothing to do here.
                    return;
                }

                // Do we have a scroll node ready ?
                if (scrollNode) {
                    // Add a CSS class on the host node.
                    $CSS.addClass(getScrollbarHostNode.call(this), 'mstrmojo-scrollbar-host');

                    // Add a CSS class on the scroll node.
                    $CSS.addClass(scrollNode, 'mstrmojo-scrollNode');
                }
            },

            /**
             * <p>This function creates and updates the scrollbars dimension and position to match that of the scroll position
             * of the given node.</p>
             */
            updateScrollbars: function updateScrollbars() {
                // If the widget is not rendered - return!
                if (!this.hasRendered) {
                    return;
                }

                // Set up the scroll nodes.
                this.setupScrollNodes();

                // Check if the custom scrollbars are not supported and if not, return.
                if (!this.hasCustomScrollbar) {
                    return;
                }

                // Do we have the scroll node configured?
                if (this.scrollNode) {
                    // Initialize the scrollbarNodes and track nodes collection if not already created.
                    this.scrollBarNodes = this.scrollBarNodes || {};
                    this.scrollTrackNodes = this.scrollTrackNodes || {};

                    // Set up the scroll bar positions and dimensions.  If either dimension returns true then set overflow of scroll node to scroll.
                    var scrollNodeStyle = this.scrollNode.style;
                    // TQMS948129: In Chrome when one direction is scrollable and the other is not, and the scroll node's height is very close to scrollHeight, unexpected native scroll bar will show.
                    // Change 'visible' to 'hidden' when there is no need to scroll.
                    scrollNodeStyle.overflowY = setupScrollBars.call(this, 'v') ? 'scroll' : 'hidden';
                    scrollNodeStyle.overflowX = setupScrollBars.call(this, 'h') ? 'scroll' : 'hidden';
                }
            },

            onscroll: function onscroll() {
                var scrollNode = this.scrollNode;

                // Do we have a scroll node and do we support custom scrollbars ?
                if (scrollNode && this.hasCustomScrollbar) {
                    var getNumber = function getNumber(value) {
                            var n = parseInt(value);
                            return n === null || isNaN(n) ? 0 : n;
                        },
                        scrollNodePos = $DOM.position(scrollNode),
                        scrollNodeHeight = scrollNodePos.h - getNumber($CSS.getStyleValue(scrollNode, "padding-bottom")),
                        scrollNodeWidth = scrollNodePos.w - getNumber($CSS.getStyleValue(scrollNode, "padding-right")),
                        scrollBarNodes = this.scrollBarNodes,
                        vScrollBar = scrollBarNodes.v,
                        hScrollBar = scrollBarNodes.h;

                    // Update the position of the scrollbar nodes based on the scroll position.
                    if (scrollNode.scrollHeight - scrollNodeHeight > 0) {
                        vScrollBar.style.top = ((scrollNodeHeight - $DOM.position(vScrollBar).h) * (scrollNode.scrollTop / (scrollNode.scrollHeight - scrollNodeHeight))) + 'px';
                    }
                    if (scrollNode.scrollWidth - scrollNodeWidth > 0) {
                        hScrollBar.style.left = ((scrollNodeWidth - $DOM.position(hScrollBar).w) * (scrollNode.scrollLeft / (scrollNode.scrollWidth - scrollNodeWidth))) + 'px';
                    }
                }

                // Call super if it exists
                if (this._super) {
                    this._super();
                }

                // Call on scroll end hook.
                if (this.onScrollEnd) {
                    this.onScrollEnd();
                }
            },

            getDragData: function getDragData(context) {
                var scrollNode = this.scrollNode,
                    scrollNodePos = $DOM.position(scrollNode),
                    sourceNode = context.src.node,
                    scrollbarNodes = this.scrollBarNodes;

                // Is the user dragging the scroll bar node?
                if (this.isDraggingScrollBar(context)) {
                    return {
                        isScrollBar: true,
                        direction: sourceNode === scrollbarNodes.v ? 'v' : 'h',
                        scrollTop: scrollNode.scrollTop,
                        scrollLeft: scrollNode.scrollLeft,
                        conversionRatio: {
                            y: scrollNode.scrollHeight / scrollNodePos.h,
                            x: scrollNode.scrollWidth / scrollNodePos.w
                        }
                    };
                }

                return (this._super && this._super(context)) || {};
            },

            isDragValid: function isDragValid(context) {
                // If dragging scroll bar return true, otherwise return super or default to false.
                return this.isDraggingScrollBar(context) || (this._super && this._super(context)) || false;
            },

            /**
             * Helper function that checks if the user is dragging the scrollbar nodes.
             *
             * @param {Object} context The drag context object.
             * @returns {boolean} True if the user is dragging one of the scrollbar nodes.
             */
            isDraggingScrollBar: function isDraggingScrollBar(context) {
                var sourceNode = context.src.node,
                    scrollbarNodes = this.scrollBarNodes;

                return !!scrollbarNodes && (sourceNode === scrollbarNodes.v || sourceNode === scrollbarNodes.h);
            },

            ondragstart: function ondragstart(context) {
                // Are we dragging the scroll bars?
                if (this.isDraggingScrollBar(context)) {
                    // Attach a CSS class on the scroll node if we're dragging the scrollbar.
                    $CSS.addClass(context.src.node, CSS_SCROLLING);
                    $CSS.addClass(getScrollbarHostNode.call(this), CSS_SCROLLING_MODE);
                }

                if (this._super) {
                    this._super(context);
                }
            },

            shouldDragBubble: function shouldDragBubble(context) {
                var sourceNode = context.src.node,
                    scrollTrackNodes = this.scrollTrackNodes;

                // Prevent the drag from bubbling if the user clicked on the track nodes...
                return !!scrollTrackNodes && (sourceNode === scrollTrackNodes.v || sourceNode === scrollTrackNodes.h);
            },

            ondragmove: function ondragmove(context) {
                // Are we dragging the scroll bars?
                if (this.isDraggingScrollBar(context)) {
                    var target = context.tgt,
                        source = context.src,
                        targetPos = target.pos,
                        sourcePos = source.pos,
                        sourceNode = source.node,
                        scrollNode = this.scrollNode,
                        scrollbarNodes = this.scrollBarNodes,
                        dragData = source.data,
                        scrollbarDelta = {
                            y: (targetPos.y - sourcePos.y),
                            x: (targetPos.x - sourcePos.x)
                        },
                        conversionRatio = dragData.conversionRatio;

                    // Are we dragging the vertical scrollbar?
                    if (sourceNode === scrollbarNodes.v) {
                        // Set the scroll top so that that onscroll is triggered.
                        scrollNode.scrollTop = dragData.scrollTop + (scrollbarDelta.y * conversionRatio.y);
                    } else {
                        // Set the scroll left for the horizontal scrollbar.
                        scrollNode.scrollLeft = dragData.scrollLeft + (scrollbarDelta.x * conversionRatio.x);
                    }
                }

                // Call super
                if (this._super) {
                    this._super(context);
                }
            },

            ondragend: function ondragmove(context) {
                // Are we dragging the scroll bars?
                if (this.isDraggingScrollBar(context)) {
                    // Remove the scrolling css class.
                    $CSS.toggleClass(context.src.node, CSS_SCROLLING, false);
                    $CSS.toggleClass(getScrollbarHostNode.call(this), CSS_SCROLLING_MODE, false);
                }

                // Call super
                if (this._super) {
                    this._super(context);
                }
            },

            widgetResized: function widgetResized() {
                if (this._super) {
                    this._super();
                }

                // If the widget's resized - update the scrollbars.
                this.updateScrollbars();
            },

            unrender: function unrender(ignoreDom) {
                // Clean up.

                $ARR.forEach(this.installedEventListeners, function (h) {
                    $DOM.detachEvent(h.e, h.evt, h.fn);
                });

                // Delete all the old properties.
                delete this.scrollNode;
                delete this.scrollbarHostNode;
                delete this.scrollBarNodes;
                delete this.scrollTrackNodes;

                // Call Super.
                this._super(ignoreDom);
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.dom",
        "mstrmojo.css");

    /**
     * <p>A map for common formatting style properties.</p>
     *
     * <dl>
     *      <dt>T</dt>
     *      <dd>position, i.e. top and left.</dd>
     *
     *      <dt>D</dt>
     *      <dd>dimension, i.e. height and width.</dd>
     *
     *      <dt>B</dt>
     *      <dd>border, split into color, style and width components.</dd>
     *
     *      <dt>F</dt>
     *      <dd>common font formatting.</dd>
     *
     *      <dt>P</dt>
     *      <dd>padding, with 1, 2, 3 or 4 property values.</dd>
     *
     *      <dt>BG</dt>
     *      <dd>background and fx (for gradients)</dd>
     *
     *      <dt>RW</dt>
     *      <dd>adds z-index to the dimension property group (D)</dd>
     * </dl>
     *
     * @type {{T: Array.<String>, D: Array.<String>, B: Array.<String>, F: Array.<String>, P: Array.<String>, BG: Array.<String>, RW: Array.<String>}}
     */
    var commonProps = {
        T: [ 'top', 'left' ],
        D: [ 'height', 'width' ],
        B: [ 'border', 'border-color', 'border-style', 'border-width' ],
        F: [ 'font', 'color', 'text-decoration' ],
        P: [ 'padding' ],
        BG: [ 'background-color', 'fx' ],
        RW: []
    };

    /**
     * Combines common rw unit formatting properties top, left, height, width and zIndex.
     *
     * @type {Array.<String>}
     */
    commonProps.RW = ['z-index'].concat(commonProps.T.concat(commonProps.D));

    /**
     * Shortcut to dom class.
     */
    var $DOM = mstrmojo.dom,
        $CSS = mstrmojo.css;

    /**
     * Utility function to initialize and populate effects property array.
     *
     * @param {Object} fx An object to hold fx properties and values.
     * @param {string} n The name of the fx property.
     * @param {string} v The new value.
     */
    function pushFxProperty(fx, n, v) {
        // Extract or initialize value array.
        var p = fx[n] || [];
        // Set new value.
        p.push(v);
        // Set value array back onto fx object.
        fx[n] = p;
    }

    /**
     * Returns the resolved formats for the given definition node.
     *
     * @param {Object} defn The definition node for the widget.
     * @param {string} thresholdId The ID of the threshold formatting to use for this instance.
     *
     * @returns {Object} The resolved format node for this object.
     */
    function getFormat(defn, thresholdId) {
        // Get the base formatting.
        var fmts = ((defn && defn.fmts) || null);

        // Is there a threshold?
        if (thresholdId) {
            // Get the threshold formatting.
            var ts = defn.thresholds,
                tFmts = ts && ts[thresholdId];

            // Did we find threshold formatting?
            if (tFmts) {
                // Create composite formatting of thresholds and base formatting.
                var fx = {},
                    p;

                // Get all formatting from base.
                for (p in fmts) {
                    fx[p] = tFmts[p] || fmts[p];
                }

                // Overwrite with threshold formatting to get any values that are in the threshold but not in the base formatting.
                for (p in tFmts) {
                    var formatValue = tFmts[p];
                    fx[p] = (typeof formatValue === "string") ? (formatValue + " !important") : formatValue;
                }

                // Reset formats to composite format.
                fmts = fx;
            }
        }

        // Return resolved formatting.
        return fmts;
    }

    /**
     * <p>A mixin for formatting {@link mstrmojo.Widget}s based on MicroStrategy Report Services document definitions.</p>
     *
     * @public
     * @mixin
     */
    mstrmojo._Formattable = mstrmojo.provide(
        'mstrmojo._Formattable',

        /**
         * @lends mstrmojo._Formattable
         */
        {
            _mixinName: 'mstrmojo._Formattable',

            /**
             * <p>Specifies which formatting properties should be applied to which dom slots.</p>
             *
             * <p>This object will contain one property per each markup slot that should be formatted.  The value of each prop can be
             * either of the following:</p>
             *
             * <ol>
             *     <li>An array of strings for the formatting properties that will be applied to the node.  In this case all formatting values will
             *     come from the root formatting object.</li>
             *     <li>An object with two properties: "src" and "props" where src is the name of the property within the root formatting object that has the
             *     formatting values to use, and the props property contains the array of strings for the formatting properties that will be applied.</li>
             * </ol>
             *
             * @type {Object.<string, Array.<String>|{src: String, props: Array.<String>}>}
             */
            formatHandlers: null,

            /**
             * Optional threshold ID.
             *
             * @type {String}
             */
            thresholdId: null,

            /**
             * Utility function for generating cache key.
             */
            getCacheKey: function getCacheKey() {
                return 'css_cache' + (this.thresholdId || '');
            },

            update: function update(node) {
                var continueUpdate = true;

                //TQMS 673119
                this.invisible = !!(node && node.data && node.data.invisible);

                if (this._super) {
                    continueUpdate = this._super(node);
                }

                return continueUpdate;
            },

            /**
             * Assembles the CSS text string  for a given slot with values from the supplied format object.
             *
             * @param {String} slotName The name of the slot being formatted.
             * @param {Object} formats The format block.
             *
             * @returns {String}
             */
            buildCSSFormatString: function buildCSSFormatString(slotName, formats) {
                var slot = this.formatHandlers[slotName],
                    formatSource = slot.src ? formats[slot.src] : formats;

                // Resolve the src (default to format).
                if (!formatSource) {
                    return null;
                }

                // Get the format node.
                var props = slot.props || slot;
                if (!props) {
                    return null;
                }

                // Initialize an array to hold string fragments.
                var css = [],
                    x = -1;

                // Step through the collection of properties to apply.
                var propertyIdx = props.length - 1;
                for (propertyIdx; propertyIdx >= 0; propertyIdx--) {
                    var property = props[propertyIdx];

                    // If the property is an enumeration from commonProps then use that, otherwise an array with the single property.
                    var propsCollection = commonProps[property] || [ property ];

                    // Step through the resolved collection of properties.
                    var z = propsCollection.length - 1;
                    for (z; z >= 0; z--) {
                        // Reset the property name.
                        property = propsCollection[z];

                        // Does the format block have a value for this property?
                        var propertyValue = formatSource[property];
                        if (propertyValue !== undefined) {
                            // Is this the 'fx' property?
                            if (property === 'fx') {
                                var f = /** @type {{gd: {t: int, sc: string, ec: string}, rt: string|int, ds: boolean}} **/ propertyValue,
                                    fx = {};

                                // Format the gradient (if present).
                                var gradient = f.gd;
                                if (gradient) {
                                    this.formatGradient(gradient, fx);
                                }

                                // Format the text rotation (if present).  We need to do this before drop shadow so the shadow appears in the correct
                                // position in IE.
                                var textRotation = parseInt(f.rt, 10);
                                if (textRotation) {
                                    if (textRotation === 1 || textRotation === 3) {
                                        this.formatTextRotation(f.rt, fx);
                                    }
                                }

                                // Format the drop shadow (if present).
                                if (f.ds) {
                                    this.formatDropShadow(f, fx);
                                }

                                // Iterate the fx object.
                                var fp;
                                for (fp in fx) {
                                    // Join all elements with space (really only needed for IE filter property).
                                    css[++x] = fp + ':' + fx[fp].join(' ');
                                }
                            } else {
                                css[++x] = property + ':' + propertyValue;
                            }
                        }
                    }
                }
                //TQMS 673119
                if (this.invisible) {
                    css.push("visibility:hidden");
                }

                return css.join(';') + ';';
            },

            /**
             * Formats the indicated slot node with values from the supplied formats.
             *
             * @param {String} slotName The name of the slot being formatted.
             * @param {Object} formats The format block.
             *
             * @returns {String}
             */
            applyCSSFormatToNode: function applyCSSFormatToNode(slotName, formats) {
                var node = this[slotName],
                    nodeStyle = node && node.style;

                // Is the node rendered?
                if (nodeStyle) {
                    // Iterate assembled CSS format properties.
                    this.buildCSSFormatString(slotName, formats).split(';').forEach(function (item) {
                        // Update node style with value for this property.
                        var parts = item.split(':');
                        nodeStyle[$CSS.convertCssToCamelCase(parts[0])] = parts[1];
                    });
                }
            },

            /**
             * Clears background formatting for the indicated slot.
             *
             * @param {String} slotName The name of the slot to clear.
             */
            clearSlotBackgroundCSS: function clearSlotBackgroundCSS(slotName) {
                var node = this[slotName],
                    nodeStyle = node && node.style;

                // Does the slot exist?
                if (nodeStyle) {
                    // Clear background and filter.
                    nodeStyle.background = 'transparent none 0 0 no-repeat';
                    nodeStyle.filter = 'none';
                }
            },

            /**
             * <p>Builds css text for dom slots during rendering.</p>
             *
             * <p>Extends the widget's preBuildRendering method in order to first build cssText strings
             * from the widget's formatting properties & store the strings in widget properties,
             * which can then be applied to the rendering.</p>
             *
             * @returns {boolean}
             * @ignore
             */
            preBuildRendering: function preBuildRendering() {
                this._super();

                var formatHandlers = this.formatHandlers,
                    formats = this.getFormats();

                // Are there format handlers AND formats?
                if (formatHandlers && formats) {
                    var defn = this.defn = this.defn || {},
                        cacheKey = this.getCacheKey(),
                        cache = defn[cacheKey];

                    // Do we have a cache of resolved formatting strings?
                    if (!cache) {
                        // Create cache.
                        cache = defn[cacheKey] = {};

                        // Iterate slot names within the format handlers.
                        for (var slotName in formatHandlers) {
                            // Create the name of the property the slot CSS will be stored in.
                            var slotCss = slotName + 'CssText';

                            // Store the aggregated css style text in the slotCssText property.
                            this[slotCss] = cache[slotCss] = this.buildCSSFormatString(slotName, formats) || '';
                        }

                    } else {
                        // Restore from cache.
                        var n;
                        for (n in cache) {
                            this[n] = cache[n];
                        }
                    }
                }

                return true;
            },

            /**
             * Builds the browser specific css for gradients.
             *
             * @param {{t: int, sc: string, ec: string}} gp The gradient properties node as retrieved from the fx formatting node.
             * @param {Object} fx An object to hold the new formatting property values.
             */
            formatGradient: function formatGradient(gp, fx) {
                var gd = $CSS.buildGradient(gp.t, gp.sc, gp.ec);
                if (gd) {
                    pushFxProperty(fx, gd.n, gd.v);
                }
            },

            /**
             * Builds the browser specific css for drop shadows.
             *
             * @param {Object} f The rw unit format node.
             * @param {Object} fx An object to hold the new formatting property values.
             */
            formatDropShadow: function formatDropShadow(f, fx) {
                if ($DOM.supports($DOM.cssFeatures.DROP_SHADOW)) {
                    var ds = f.ds;

                    if ($DOM.isDXIE) {
                        pushFxProperty(fx, 'filter', "progid:DXImageTransform.Microsoft.DropShadow(Color='#66000000',Positive='true',OffX=" + ds + ",OffY=" + ds + ")");
                    } else {
                        var v = [ ds, ds ],
                            rotation = parseInt(f.rt, 10);

                        // Is the text rotated?
                        if (rotation === 1 || rotation === 3) {
                            // Adjust either the first or second value (based on rotation angle) so that shadow appears in the correct position.
                            v[((rotation === 1) ? 1 : 0)] = -ds;
                        }

                        pushFxProperty(fx, ($DOM.isWK ? '-webkit-' : '') + 'box-shadow', v.join('px ') + 'px 3px 0px #888');
                    }
                }
            },

            /**
             * Builds the browser specific css for text rotation.
             *
             * @param {int} tr The text rotation value (1 or 3).
             * @param {Object} fx An object to hold the new formatting property values.
             */
            formatTextRotation: function formatTextRotation(tr, fx) {
                if ($DOM.supports($DOM.cssFeatures.TEXT_ROTATION)) {
                    if ($DOM.isDXIE) {
                        pushFxProperty(fx, 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + tr + ')');
                    } else {

                        // The number of degrees to rotate (depending on the type of rotation)...
                        var degrees = (tr === 1) ? 90 : -90;

                        // Rotate about the top-left corner of the element...
                        pushFxProperty(fx, $DOM.CSS3_PREFIX + 'transform-origin', 'top left');

                        // Rotate the specified number of degrees...
                        // NOTE: For rt==1, we can omit the postBuildRendering stop of relocating the left
                        // position if we are passed the outer height of the text field (which would
                        // be saved in MD as a text width). Assuming it was present, we could add a
                        // 'translateX' directive (with the text height as its argument) before the
                        // 'rotate' directive as:
                        //
                        // -moz-transform: translateX(22px) rotate(90deg)
                        pushFxProperty(fx, $DOM.CSS3_PREFIX + 'transform', 'rotate(' + degrees + 'deg)');
                    }
                }
            },

            /**
             * Returns the format for this widget from the formatResolver.
             *
             * @returns {Object} The resolved formats for this widget.
             */
            getFormats: function getFormats() {
                if (!this.fmts) {
                    this.fmts = getFormat.call(this, this.defn, this.thresholdId);    // getFormat() now expects defn object arg, not key string
                }

                return this.fmts;
            },

            /**
             * Clear widget format
             */
            clearFormats: function clearFormats() {
                this.fmts = undefined;
            },

            /**
             * Returns an empty format
             *
             * @return {Object}
             */
            createEmptyFormats: function () {
                return (this.fmts = this.fmts || {});
            },

            clearCache: function clearCache() {
                // Clear the format cache for next render.
                delete this.defn[this.getCacheKey()];
            },

            unrender: function unrender(ignoreDom) {
                // Do we have a thresholdId?
                // TODO: Is this.thresholdId a correct indication? Should  we use a more specific and persistent boolean instead e.g. what if after a selector action, a textfield doesn't have any conditional formatting applied any more?
                if (this.thresholdId) {
                    // Clear the cached fmts node.
                    this.fmts = null;
                }

                this._super(ignoreDom);
            }
        }
    );

    /**
     * Returns the individual border width values for the supplied widget (in pixels, but without the unit identifier).
     *
     * @param {mstrmojo.Widget|mstrmojo._Formattable} widget The widget whose border widths should be calculated.
     *
     * @returns {{t: int, r: int, b: int, l: int, h: int, w: int}}
     * @static
     */
    mstrmojo._Formattable.getBorderWidths = function (widget) {
        var f = widget.getFormats(),
            b = (f.border) ? f.border.match(/(\d*|\d*\.\d*)pt/)[0] : f['border-width'],    // Extract border widths from either border or border-width.
            model = widget.model,
            docModel = model.docModel;

        return $CSS.getBorderWidths(b, (docModel && docModel.dpi) || model.dpi);
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.string",
                         "mstrmojo.dom",
                         "mstrmojo.css",
                         "mstrmojo.array");

    var $DOM = mstrmojo.dom,
        $CSS = mstrmojo.css,
        CLASS_SELECTED = 'selected';

    function delegateSelect(mthName, el, item, idx, widget) {
        // If the widget has a custom hook than call it and check return value.
        var hook = widget.listHooks[mthName];
        if (hook && hook.call(widget, el, item, idx)) {
            // Hook returned true so exit.
            return;
        }

        // Hook returned false so use default selection behavior.
        $CSS.toggleClass(el, CLASS_SELECTED, mthName === 'select');
    }

    function addToCollection(propertyName, delimiter, values) {
        // Retrieve delimited string of existing values (or empty array if none).
        var existing = this[propertyName],
            arr = existing ? existing.split(delimiter) : [];

        // Store values (including new ones) back on instance (omitting repeated values).
        this[propertyName] = mstrmojo.array.distinct(arr.concat(values.split(delimiter))).join(delimiter);
    }

    /**
     * <p>A mixin for adding specific behavior to subclasses of {@link mstrmojo.ListBase}.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo._IsList = mstrmojo.provide(

        "mstrmojo._IsList",

        /**
         * @lends mstrmojo._IsList.prototype
         */
        {
            _mixinName: 'mstrmojo._IsList',

            /**
             * Collection of item renderer hooks that can be implemented by consumers of this mixin (for custom selection code).
             */
            listHooks: {},

            /**
             * <p>Used in conjunction with multiSelect to determine what type of multi-select list this is.</p>
             *
             * <p>If this value is true, selections will be cleared if they are made without the use of a modifier key (control or shift).
             * If this value is false, selections will be retained as you make new ones (i.e. a check list).</p>
             *
             * @type {boolean}
             * @default false
             */
            useListModKeys: false,

            init: function init(props) {
                this._super(props);

                // Record the start index for shift selection. When doing select with shift key, items between the index and current
                // clicked index will be selected.
                this._shiftStartIndex = -1;
            },

            /**
             * Method for generating markup for each item.
             *
             * @param {Object} item The item that will use the markup.
             * @param {number} idx The index of the item to render.
             *
             * @returns {string} The markup string for the given item containing tokens for dynamic data replacement.
             */
            getItemMarkup: function getItemMarkup(item, idx) {
                //jshint unused:false
                return '<{@tag} class="item {@cls}" idx="{@idx}" style="{@style}" title="{@title}">{@en@n}</{@tag}>';
            },

            /**
             * Returns an customized display name for the given item.
             * Called by getItemProps().
             *
             * @param {Object} item The item to render.
             * @returns {string}
             */
            getItemDisplayName: function getItemDisplayName(item) {
                return item.n || '';
            },

            /**
             * Returns an object with markup string token replacement values for the given item.
             *
             * @param {{n:string}} item The item to render.
             * @param {number} idx The index of the item.
             *
             * @returns {{tag:string, sel:boolean, cls:string, n:string, style:string, idx:number, addCls:Function, addStyle:Function}}
             */
            getItemProps: function getItemProps(item, idx) {
                var isSelected = !!this.selectedIndices[idx],
                    itemProps = {
                        tag: 'div',                                                 // Markup root tag name.
                        sel: isSelected,                                            // True if the item is selected.
                        cls: '',                                                    // Item CSS class name.
                        n: this.getItemDisplayName(item),                           // Item text.
                        style: '',                                                  // Item CSS text.
                        idx: idx,
                        addCls: function addCls(cls) {
                            addToCollection.call(this, 'cls', ' ', cls);
                        },
                        addStyle: function addStyle(s) {
                            addToCollection.call(this, 'style', ';', s);
                        },
                        title: item.title || ""
                    };

                // Is the item selected?
                if (isSelected) {
                    // Add the selected class to item properties.
                    itemProps.addCls(CLASS_SELECTED);
                }

                // Does the item have it's own custom class?
                var itemClass = item.cls;
                if (itemClass) {
                    // Add custom class to item properties.
                    itemProps.addCls(itemClass);
                }

                return itemProps;
            },

            itemRenderer: {
                render: function render(item, idx, widget) {
                    // Add render index to item.
                    item._renderIdx = idx;

                    // Create and return markup.
                    return  mstrmojo.string.apply(widget.getItemMarkup(item, idx), widget.getItemProps(item, idx));
                },

                select: function select(el, item, idx, widget) {
                    delegateSelect('select', el, item, idx, widget);
                },

                unselect: function unselect(el, item, idx, widget) {
                    delegateSelect('unselect', el, item, idx, widget);
                }
            },

            onclick: function onclick(evt) {
                try {
                    // Was an item clicked?
                    var item = this.getItemFromTarget(evt.getTarget());
                    if (item) {
                        // Stop the event propagation.
                        evt.cancel();
                        this.doItemSelect(item, evt || {});
                    }

                } catch (ex) {
                    // This is a top level exception handler so we display the error to the user
                    // and do not re-throw the exception.
                    mstrApp.onerror(ex);
                }
            },

            /**
             * The function to handle item selection when act on an item.
             *
             * @param {Object} item Dataset unit
             * @param {mstrmojo._HasMarkup.MSTRDomEventType} [evt] The MSTR DOM Event object.
             */
            doItemSelect: function doItemSelect(item, evt) {
                // Get item index.
                var hWin = evt.hWin,
                    e = evt.e,
                    idx = item._renderIdx,
                    isMetaKey = $DOM.isMetaKey(hWin, e),   // #897025, we treat the metaKey as ctrlKey. Mac do not have ctrlKey when mouse click.
                    isShiftKey = $DOM.shiftKey(hWin, e),
                    allowMultiSelect = this.multiSelect,
                    useListModKeys = this.useListModKeys,
                    rangeStartIndex = this._shiftStartIndex,
                    selectedIndices = this.selectedIndices;

                if (allowMultiSelect && useListModKeys && isShiftKey && rangeStartIndex > -1) {
                    // Select continuous items with shift key
                    var adding = [],
                        removing = [],
                        startIdx = Math.min(rangeStartIndex, idx),
                        endIdx = Math.max(rangeStartIndex, idx),
                        i;
                    for (i = 0; i < this.items.length; i++) {
                        if (startIdx <= i && i <= endIdx) {
                            if (!selectedIndices[i]) {
                                adding.push(i);
                            }
                        } else if (selectedIndices[i]) {
                            removing.push(i);
                        }
                    }
                    this.addSelect(adding);
                    this.removeSelect(removing);
                } else {
                    if (allowMultiSelect && (!useListModKeys  || isMetaKey)) {
                        // Do multi-selection to add or remove new item (when ctrl key clicked or setting doesn't require modifier key)
                        var methodName = (selectedIndices[idx]) ? 'remove' : 'add';
                        this[methodName + 'Select'](idx);
                    } else {
                        // Single select.
                        this.singleSelect(idx);
                    }

                    // Record shift start index
                    this._shiftStartIndex = idx;
                }
            },

            onclearSelection: function onclearSelection() {
                // Reset shift selection info.
                this._shiftStartIndex = -1;
            },

            /**
             * Returns the item node that contains the target element.
             *
             * @param {HTMLElement} target The target at which to begin the item node search.
             *
             * @returns {HTMLElement}
             */
            getItemNodeFromTarget: function getItemNodeFromTarget(target) {
                var node = $DOM.findAncestorByAttr(target, 'idx', true, this.domNode);
                return (node && node.node) || null;
            },

            /**
             * Returns the item that contains the target element.
             *
             * @param {HTMLElement} target The target at which to begin the item node search.
             *
             * @returns {Object|undefined}
             */
            getItemFromTarget: function getItemFromTarget(target) {
                // Get index from target node.
                var node = this.getItemNodeFromTarget(target),
                    idx = node && parseInt(node.getAttribute('idx'), 10);

                // Was an item found?
                if (idx !== null && !isNaN(idx) && this.items) {
                    // Get item.
                    return this.items[idx];
                }

                // Item not found.
                return undefined;
            }
        }
    );

    /**
     * The class name added to selected items.
     *
     * @type {string}
     * @static
     */
    mstrmojo._IsList.SELECTED_CLS = CLASS_SELECTED;

}());
(function () {

    mstrmojo.requiresCls("mstrmojo._HasPopup",
                         "mstrmojo.hash",
                         "mstrmojo.css");

    var $HASH = mstrmojo.hash,
        $CSS = mstrmojo.css;

    /**
     * The class that will get added (and later removed) to items that have opened a menu.
     *
     * @type {string}
     * @static
     * @private
     */
    var CLS_IS_OPEN = 'open';

    /**
     * Returns the parent of the {@link mstrmojo.ui.PopupConfig.hostElement}.
     *
     * @param {{popupConfig: mstrmojo.ui.PopupConfig}} popup The popup.
     *
     * @returns {Node}
     */
    function getHostElement(popup) {
        return popup ? popup.popupConfig.hostElement : null;
    }

    /**
     * Mixin for {@link mstrmojo.Widget} that show menu popups.
     *
     * @mixin
     * @public
     * @extends mstrmojo._HasPopup
     */
    mstrmojo.ui.menus._HasMenuPopup = mstrmojo.provide(

        "mstrmojo.ui.menus._HasMenuPopup",

        /**
         * @lends mstrmojo.ui.menus._HasMenuPopup
         */
        $HASH.copy(mstrmojo._HasPopup)
    );

    mstrmojo.ui.menus._HasMenuPopup.openPopup = function openPopup(ref, config) {
        // Do we already have a menu popup opened?
        var lastOpened = this._lastOpened;
        if (lastOpened) {
            // Close that menu...
            this.closePopup();

            // Fall through so that the next menu can be opened.
        }

        // Unable to call _super through mixin inheritance so call directly.
        mstrmojo._HasPopup.openPopup.call(this, ref, config);

        // Add open class to the parent node of the host element.
        $CSS.addClass(getHostElement(ref), CLS_IS_OPEN);
    };

    mstrmojo.ui.menus._HasMenuPopup.closePopup = function closePopup() {
        // Add open class to the parent node of the host element.
        $CSS.removeClass(getHostElement(this._lastOpened), CLS_IS_OPEN);

        // Unable to call _super through mixin inheritance so call directly.
        mstrmojo._HasPopup.closePopup.call(this);
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.Base",
                         "mstrmojo.registry",
                         "mstrmojo._Provider",
                         "mstrmojo.array");

    var $REG = mstrmojo.registry,
        $ARR = mstrmojo.array;

    /**
     * <p>Base class for an observable object.</p>
     *
     * <p>When an instance of Obj is constructed, it is automatically added to the "mstrmojo.all" collection, keyed by its
     * "id" property (if missing, an id will be auto-generated).  Hence the instance can be used with the "publisher" system
     * (mstrmojo.publisher) for raising and listening to "events". When the instance's "destroy" method is called, it is
     * removed from the "all" collection and from the publisher system.</p>
     *
     * <p>Each instance can have any arbitrary set of properties and values.  The instance has a "set" method for updating
     * its property values.  The "set" method is capable of raising an "event" which can then be heard by other objects who wish
     * to be notified of a change in the state of the instance. Those objects can sign up as "listeners" for events by calling the
     * "attachEventListener" and "removeEventListener" methods.</p>
     *
     * @class
     * @extends mstrmojo.Base
     * @mixes mstrmojo._Provider
     */
    mstrmojo.Obj = mstrmojo.declare(
        mstrmojo.Base,

        [ mstrmojo._Provider ],

        /**
         * @lends mstrmojo.Obj.prototype
         */
        {
            /**
             * The fully qualified class name for this object.
             *
             * @type String
             */
            scriptClass: "mstrmojo.Obj",

            /**
             * <p>The ID of this object.</p>
             *
             * <p>Typically the ID is auto generated when the object is added to the registry</p>
             *
             * @type {string}
             */
            id: '',

            /**
             * <p>Optional handler called after initialization.</p>
             *
             * <p>This handler is supported as a customization hook at the end of the instance creation process.
             * If specified, the handler will be called from constructor after the instance properties are finished
             * processing and the instance has been registered in the "mstrmojo.all" collection.</p>
             *
             * @type Function
             */
            //postCreate: null,

            /**
             * <p>Base class for an observable object.</p>
             *
             * <p>Constructs a new instance by doing the following:</p>
             * <ol>
             * <li>applying all the property values in a given hash table to the new instance,</li>
             * <li>calls the "postApplyProperties" handler, if any,</li>
             * <li>auto-assigns an "id" property value to the instance (if needed),</li>
             * <li>adds the instance to the "mstrmojo.all" collection,</li>
             * <li>calls the "postCreate" handler, if any.</li>
             * </ol>
             *
             * @param {Object} [props] Hash of property values to be applied to this instance.
             */
            init: function init(props) {
                // Create disposables collection.
                this.disposables = [];

                // Apply the given properties to this instance.
                this._super(props);

                // Add this instance to the mstrmojo.all collection so it can participate in event publishing/listening.
                $REG.add(this);

                // Hook for customizations after getting registered.
                if (this.postCreate) {
                    this.postCreate();
                }
            },

            /**
             * Adds an object that should be destroyed when this object is destroyed.
             *
             * @param {Object|Array.<Object>} obj The object to destroy (via the destroy or clear method).
             */
            addDisposable: function addDisposable(obj) {
                // Add to disposable collection.
                var disposables = this.disposables,
                    i,
                    len;
                if(obj.constructor === Array) {
                    for(i = 0, len = obj.length ; i < len; i++) {
                        disposables.push(obj[i]);
                    }
                } else {
                    disposables.push(obj);
                }

                // Return the added disposable object.
                return obj;
            },

            /**
             * Destroys all objects marked as disposable by this object.
             *
             * @param {boolean} [ignoreDOM=false] True if DOM elements associated with the disposable should NOT be destroyed.
             */
            destroyDisposables: function destroyDisposables(ignoreDOM) {
                // Iterate disposables.
                $ARR.forEach(this.disposables, function (d) {
                    // Does item have a destroy method?
                    if (d.destroy) {
                        // Destroy it.
                        d.destroy(ignoreDOM);

                    // Does item has a clear method?
                    } else if (d.clear) {
                        // Clear item.
                        d.clear();
                    }
                });

                // Reset the disposables collection.
                this.disposables = [];
            },

            /**
             * Throws an error that the given required abstract method is not implemented for this script class.
             *
             * @param {String} methodName The name of the required abstract method that is not implemented.
             */
            throwAbstractMethodError: function throwAbstractMethodError(methodName) {
                throw new Error(this.scriptClass + ' must implement ' + methodName + '.');
            },

            /**
             * Removes this instance from the mstrmojo.all collection and from any event subscriptions.
             */
            destroy: function destroy(ignoreDOM) {
                // if the object is destroyed before, then do not go through the destroy method again
                if (this.destroyed) {
                    return;
                }

                this._super(ignoreDOM);

                // Destroy disposables.
                this.destroyDisposables(ignoreDOM);

                // Remove this instance from event publishing/listening.
                $REG.remove(this);

                // DE9448 Helps reduce the size of memory leaks by detaching from any parent
                delete this.parent;

                // set the destroyed flag to be true to ensure the object gets destroyed only once
                this.destroyed = true;
            }
        }
    );

    // static convenience function for destroying and deleting an Obj object;
    // if you are disposing of lots of objects, recommendation is to define a local variable = mstrmojo.Obj.free and
    // use it to call this function.
    //
    // You may pass null and undefined variables to this function.
    //
    var obj = mstrmojo.Obj;
    obj.free = function free(o) {
        if (o instanceof obj) {
            o.destroy();
        }
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.Obj",
                         "mstrmojo._LoadsScript",
                         "mstrmojo.Binding",
                         "mstrmojo._HasBindings",
                         "mstrmojo._HasMarkup",
                         "mstrmojo._HasTooltip",
                         "mstrmojo.css");

    /**
     * <p>Base UI widget class.</p>
     *
     * <p>A Widget is an enhanced Obj with the ability to:
     * <ul>
     * <li>load additional javascript methods at run-time,</li>
     * <li>use "bindings" to set its property values dynamically, and</li>
     * <li>render markup.</li>
     * </ul>
     * </p>
     *
     * @class
     * @extends mstrmojo.Obj
     * @mixes mstrmojo._LoadsScript
     * @mixes mstrmojo._HasBindings
     * @mixes mstrmojo._HasMarkup
     * @mixes mstrmojo._HasTooltip
     */
    mstrmojo.Widget = mstrmojo.declare(
        mstrmojo.Obj,

        [ mstrmojo._LoadsScript, mstrmojo._HasBindings, mstrmojo._HasMarkup, mstrmojo._HasTooltip ],

        /**
         * @lends mstrmojo.Widget.prototype
         */
        {
            scriptClass: "mstrmojo.Widget",

            /**
             * Handle to the root DOM node of this widget's HTML, if rendered.
             *
             * @type {HTMLElement}
             */
            domNode: null,

            /**
             * <p>Indicates whether this widget has been rendered.</p>
             *
             * @type {boolean}
             * @default false
             */
            hasRendered: false,

            /**
             * Specifies whether or not this widget's DOM node should be visible.
             *
             * @type {boolean}
             * @default true
             */
            visible: true,

            /**
             * Specifies whether or not this widget responds to events originating within its DOM.
             *
             * @type {boolean}
             * @default true
             */
            enabled: true,

            /**
             * <p>The tooltip for this widget.</p>
             *
             * @type {String}
             */
            tooltip: '',

            /**
             * Optional CSS class for the domNode. Used for customization.
             *
             * @type {String}
             */
            cssClass: "",

            /**
             * Optional text to appear in the domNode "style" attribute. Used for customization.
             *
             * @type {String}
             */
            cssText: "",

            /**
             * The display value to use when this widget is visible.
             *
             * @type {String}
             * @default block
             */
            cssDisplay: 'block',

            /**
             * The name of the slot within the parent {@link mstrmojo.Container} that this widget should be rendered within.
             *
             * @type {String}
             * @default ''
             */
            slot: '',

            /**
             * An optional name that the parent of this widget can use to get a reference to this widget.
             *
             * @type {String}
             * @default ''
             */
            alias: '',

            /**
             * The instance of {@link mstrmojo.Container} that owns this widget (may be null).
             *
             * @type {mstrmojo.Container}
             * @default null
             */
            parent: null,

            /*
             * <p>Extends the inherited method in order to do the following after initializing itself:
             *
             * 1. initialize this object's bindings (if any), and</li>
             * 2. call the "postCreateBindings" handler (if any).</li>
             */
            init: function init(props) {
                this._super(props);

                // If we are an orphan, init our bindings now (if any). Otherwise we have a parent,
                // and that parent is responsible for calling us later to init our bindings, after it
                // has finished constructing its children; exception: if our parent has already
                // initialized its bindings, we can do so now.
                // Note: even if we don't have a "bindings" property, we might have references to other
                // widgets (such as list items) which do have bindings, so we should still call initBindings.
                var p = this.parent;
                if (!p || p.hasInitBindings) {
                    this.initBindings();
                }
            },

            /**
             * <p>Extends the inherited method in order to unrender the widget and destroy its bindings before destroying the widget.</p>
             *
             * <p>Bindings are destroyed after the widget in unrendered in order to minimize DOM updates during the destruction of the bindings.</p>
             *
             * @param {Boolean} [skipCleanup] If true, this flag indicates that some parent/ancestor of this object
             * will handle some cleanup after this object is destroyed. Used as a performance optimization.
             *
             * @ignore
             */
            destroy: function dst(skipCleanup) {
                if (this.hasRendered) {
                    this.unrender(skipCleanup);
                }
                if (this.bindings) {
                    this.destroyBindings();
                }
                this._super();
            },

            /**
             * When this method is called it means that the widget is not being destroyed but it's data is no longer valid.
             */
            invalidate: mstrmojo.emptyFn,

            /**
             * <p>Abstract customization hook that gets triggered once a widget is resized.</p>
             */
            widgetResized: mstrmojo.emptyFn
        }
    );

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the cssText property changes.
     *
     * @static
     */
    mstrmojo.Widget.cssTextMarkupMethod = function () {
        this.domNode.style.cssText = this.cssText || '';
    };

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the visible property changes.
     *
     * @static
     */
    mstrmojo.Widget.visibleMarkupMethod = function () {
        this.domNode.style.display = (this.visible) ? this.cssDisplay : 'none';
    };

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the top property changes.
     *
     * @static
     */
    mstrmojo.Widget.topMarkupMethod = function () {
        // The style.top was set to '' if this.top is not existing, which might override the value set before by cssText.
        // Change it to set the value only when the value is existing.
        var top = this.top;
        if (top) {
            this.domNode.style.top = top;
        }
    };

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the left property changes.
     *
     * @static
     */
    mstrmojo.Widget.leftMarkupMethod = function () {
        // The style.left was set to '' if this.left is not existing, which might override the value set before by cssText.
        // Change it to set the value only when the value is existing.
        var left = this.left;
        if (left) {
            this.domNode.style.left = left;
        }
    };

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the height property changes.
     *
     * @static
     */
    mstrmojo.Widget.heightMarkupMethod = function () {
        // The style.height was set to '' if this.height is not existing, which might override the value set before by cssText.
        // Change it to set the value only when the value is existing.
        var height = this.height;
        if (height) {
            this.domNode.style.height = height;
        }

        // Call the custom hook to denote that the widget was resized.
        this.widgetResized();
    };

    /**
     * Default markup method for use in subclasses of mstrmojo.Widget for when the width property changes.
     *
     * @static
     */
    mstrmojo.Widget.widthMarkupMethod = function () {
        // The style.width was set to '' if this.width is not existing, which might override the value set before by cssText.
        // Change it to set the value only when the value is existing.
        var width = this.width;
        if (width) {
            this.domNode.style.width = width;
        }

        // Call the custom hook to denote that the widget was resized.
        this.widgetResized();
    };

    /**
     * Default markup method to use in subclasses of mstrmojo.Widget for when the enabled property changes.
     *
     * @static
     */
    mstrmojo.Widget.enabledMarkupMethod = function () {
        mstrmojo.css.toggleClass(this.domNode, 'disabled', !this.enabled);
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.Obj");

    var CONFIG_ENUM_CORNERS = {
        TOP_LEFT: 1,
        TOP_RIGHT: 2,
        BOTTOM_RIGHT: 3,
        BOTTOM_LEFT: 4
    };

    /**
     * An object for configuring the contents and position of objects that pop up from and are connected to menus.
     *
     * @class
     * @extends mstrmojo.Obj
     */
    mstrmojo.ui.PopupConfig = mstrmojo.declare(
        mstrmojo.Obj,

        null,

        /**
         * @lends mstrmojo.ui.PopupConfig.prototype
         */
        {
            scriptClass: 'mstrmojo.ui.PopupConfig',

            /**
             * An enumeration of corners for use with {@link mstrmojo.ui.PopupConfig.setAlignment} method.
             *
             * @enum {int}
             */
            ENUM_CORNERS: CONFIG_ENUM_CORNERS,

            /**
             * <p>A boolean flag that controls whether the menu is hosted within the host element or will it be hosted
             * in the body with a proxy host.</p>
             *
             * @type {boolean}
             */
            isHostedWithin: true,

            /**
             * <p>An optional object that controls the position of the popup when
             * {@link mstrmojo.ui.PopupConfig.isHostedWithin} flag is set to false.</p>
             *
             *
             * @type {{
             *     x : int,
             *     y : int,
             *     w : int?,
             *     h : int?
             *  }}
             */
            position : null,

            /**
             * <p>An optional property that controls the css class in the event that the
             * {@link mstrmojo.ui.PopupConfig.isHostedWithin} flag is set to false.</p>
             *
             * @type {String}
             */
            hostProxyCssClass: '',

            /**
             * The ID of the {@link mstrmojo.Widget} that is opening (and will contain) the popup.
             *
             * @type {String}
             */
            hostId: '',

            /**
             * The Node within the host that will contain the popup.
             *
             * @type {HTMLElement|Node}
             */
            hostElement: null,

            /**
             * An optional property to specify which node the popup should anchor around, when it is not hosted within.
             *
             * It defaults to the host element if not specified.
             *
             * @type {HTMLElement|Node}
             */
            anchorElement: null,

            /**
             * The collection of popup handlers for this popup.
             *
             * @type {Object.<string, {}>}
             */
            popupHandlers: null,

            /**
             * The corners of the popup and host element that should be aligned.
             *
             * @see {mstrmojo.ui.PopupConfig.ENUM_CORNERS}
             *
             * @type {{host: number, popup: number}}
             */
            alignment: null,

            /**
             * Specifies if the popup uses rich tooltip
             *
             * @type {boolean}
             * @default false
             */
            useTooltip: false,

            /**
             * @override
             */
            init: function init(props) {
                // Initialize properties.
                this.clear();

                this._super(props);
            },

            /**
             * Configures the position of the popup by storing which corners of the popup and host should be aligned.
             *
             * @see {@link mstrmojo.ui.PopupConfig.ENUM_CORNERS}
             *
             * @param {number} hostCorner The corner of the host element that should align with the popup.
             * @param {number} popupCorner The corner of the popup that should align with the host element.
             */
            setAlignment: function setAlignment(hostCorner, popupCorner) {
                // Cache corner alignment.
                this.alignment = {
                    host: hostCorner,
                    popup: popupCorner
                };
            },

            /**
             * <p>Adds handler functions to be called when the popup opens and closes.</p>
             *
             * <p>The handlers are optional and will recieve a boolean parameter indicating whether the popup is opening or closing.</p>
             *
             * @param {string} scopeId The ID of the {@link mstrmojo.Obj} to use as the scope for the passed functions.
             * @param {function(boolean)=} fnOpen An optional Function to be called when the popup opens.
             * @param {function(boolean)=} fnClose An optional Function to be called when the popup closes.
             */
            addPopupHandlers: function addPopupHandlers(scopeId, fnOpen, fnClose) {
                // Create and cache handler object.
                this.popupHandlers[scopeId] = {
                    open: fnOpen,
                    close: fnClose
                };
            },

            /**
             * Resets the configuration to it's initial state.
             */
            clear: function clear() {
                // Initialize handlers and...
                this.popupHandlers = {};

                // set default alignment.
                var corners = this.ENUM_CORNERS;
                this.alignment = {
                    host: corners.BOTTOM_LEFT,
                    popup: corners.TOP_LEFT
                };
            }
        }
    );

    /**
     * An enumeration of corners for use with {@link mstrmojo.ui.PopupConfig.setAlignment} method.
     *
     * @enum {int}
     */
    mstrmojo.ui.PopupConfig.ENUM_CORNERS = CONFIG_ENUM_CORNERS;
}());

(function () {

    mstrmojo.requiresCls("mstrmojo.ui.PopupConfig",
                         "mstrmojo.array",
                         "mstrmojo.hash",
                         "mstrmojo.css",
                         "mstrmojo.dom");

    var $ARR = mstrmojo.array,
        $DOM = mstrmojo.dom,
        $HASH = mstrmojo.hash,
        $CSS = mstrmojo.css,
        $PX = 'px';

    var isDebugging = false;

    function toggleLockInfoWin(owner, lock) {
        if (!mstrmojo.DocInfoWindow) {
            return;
        }

        var w = owner;
        // lock\unlock all parent info wins
        while (w) {
            if (w instanceof mstrmojo.DocInfoWindow) {
                w[lock ? 'registerLock' : 'releaseLock'](this);
                this.lockIW = lock ? w : null;
                break;
            }

            w = w.parent;
        }
    }

    var $ENUM_CORNERS = mstrmojo.ui.PopupConfig.ENUM_CORNERS,
        ENUM_CORNER_TOP_LEFT = $ENUM_CORNERS.TOP_LEFT,
        ENUM_CORNER_TOP_RIGHT = $ENUM_CORNERS.TOP_RIGHT,
        ENUM_CORNER_BOTTOM_RIGHT = $ENUM_CORNERS.BOTTOM_RIGHT,
        ENUM_CORNER_BOTTOM_LEFT = $ENUM_CORNERS.BOTTOM_LEFT;

    /**
     * Private helper function to check if a corner aligns left.
     *
     * @param {int} corner The corner for which we wish to check the left edge.
     * @returns {boolean} Whether the corner is aligned left.
     * @private
     */
    function isCornerLeft(corner) {
        return (corner === ENUM_CORNER_BOTTOM_LEFT || corner === ENUM_CORNER_TOP_LEFT);
    }

    /**
     * Private helper function to check if a corner aligns right.
     *
     * @param {int} corner The corner for which we wish to check the right edge.
     * @returns {boolean} Whether the corner is aligned right.
     * @private
     */
    function isCornerRight(corner) {
        return (corner === ENUM_CORNER_TOP_RIGHT || corner === ENUM_CORNER_BOTTOM_RIGHT);
    }

    /**
     * Private helper function to check if a corner aligns bottom.
     *
     * @param {int} corner The corner for which we wish to check the bottom edge.
     * @returns {boolean} Whether the corner is aligned bottom.
     * @private
     */
    function isCornerBottom(corner) {
        return (corner === ENUM_CORNER_BOTTOM_RIGHT || corner === ENUM_CORNER_BOTTOM_LEFT);
    }

    /**
     * Private helper function to check if a corner aligns top.
     *
     * @param {int} corner The corner for which we wish to check the top edge.
     * @returns {boolean} Whether the corner is aligned top.
     * @private
     */
    function isCornerTop(corner) {
        return (corner === ENUM_CORNER_TOP_RIGHT || corner === ENUM_CORNER_TOP_LEFT);
    }

    /**
     * <p>Helper function that calculates the directions off the screen where the menu overflows the page.</p>
     *
     * @param {mstrmojo.ui.PopupConfig} cfg The instance of the config that this menu is rendering.
     * @param {{x: number, y: number, w: number, h: number}} bodyPos The coordinates and dimensions of the body node.
     * @param {{x: number, y: number, w: number, h: number}} hostElemPos The coordinates and dimensions of the host node.
     * @param {{x: number, y: number, w: number, h: number}} menuPos The coordinates and dimensions of the popup node.
     * @returns {{top: boolean, bottom: boolean, left: boolean, right: boolean}} An object with the four directions and whether it overflows.
     */
    function calculateOverflowDirections(cfg, bodyPos, hostElemPos, menuPos) {
        var hostX = hostElemPos.x,
            hostY = hostElemPos.y,
            hostWidth = hostElemPos.w || 0,
            hostHeight = hostElemPos.h || 0,
            menuWidth = menuPos.w,
            menuHeight = menuPos.h,
            corners = cfg.alignment,
            popupCorner = corners.popup,
            hostCorner = corners.host,
            isHostAlignedRight = isCornerRight(hostCorner),
            isHostAlignedBottom = isCornerBottom(hostCorner),
            hasOverflowedRight = false,
            hasOverflowedBottom = false,
            hasOverflowedLeft = false,
            hasOverflowedTop = false;

        // In order to check if the menu has overflowed off the right edge of the screen,
        // we only need to test if the popup corner is aligned to the left.
        if (isCornerLeft(popupCorner)) {
            // Initialize the menu's right position based on menu's x coordinates and the width of the popup.
            var menuRightPos = hostX + menuWidth + (isHostAlignedRight ? hostWidth : 0);

            // Let's check if the menu's total right position is greater than the body's width.
            hasOverflowedRight = bodyPos.w < menuRightPos;
        }

        // In order to check if the menu has overflowed off the bottom edge of the screen,
        // we only need to test if the popup corner is aligned to the top.
        if (isCornerTop(popupCorner)) {
            // Initialize the menu's bottom position based on the menu's y coordinate and the height of the popup.
            var menuBottomPos = hostY + menuHeight + (isHostAlignedBottom ? hostHeight : 0);

            // Let's check if the menu's total bottom position is greater than the body's height.
            hasOverflowedBottom = bodyPos.h < menuBottomPos;
        }

        // In order to check if the menu has overflowed off the left  edge of the screen,
        // we only need to test if the popup corner is aligned to the right.
        if (isCornerRight(popupCorner)) {
            var menuLeftPos = hostX - menuWidth + (isHostAlignedRight ? hostWidth : 0);

            // Let's check if the left most position is negative (off the left edge)
            hasOverflowedLeft = menuLeftPos < 0;
        }

        // In order to check if the menu has overflowed off the top edge of the screen,
        // we only need to test if the popup corner is aligned to the bottom.
        if (isCornerBottom(popupCorner)) {
            var menuTopPos = hostY - menuHeight + (isHostAlignedBottom ? hostHeight : 0);

            // Let's check if the top most position is negative (off the top edge)
            hasOverflowedTop = menuTopPos < 0;
        }

        return {
            top: hasOverflowedTop,
            bottom: hasOverflowedBottom,
            left: hasOverflowedLeft,
            right: hasOverflowedRight
        };
    }

    /**
     * Iterates the popup handlers object and calls the appropriate handler.
     *
     * @param {boolean=} isOpen If true the open handler will be called, otherwise, the close handler will be called.
     *
     * @this mstrmojo._IsPopup
     * @private
     */
    function callPopupHandlers(isOpen) {
        var popupConfig = this.popupConfig;

        // Do we have a popup config ?
        if (popupConfig) {
            // Iterate popup handlers.
            $HASH.forEach(popupConfig.popupHandlers, function (h, id) {
                // Is there a handler?
                var fn = h[isOpen ? 'open' : 'close'];
                if (fn) {
                    // Call it in the scope indicated, passing whether the popup is open or not.
                    fn.call(mstrmojo.all[id] || fn, !!isOpen);
                }
            });
        }
    }

    /**
     * Sets the host proxy's visibility to hidden or not based on whether we want to show it or not.
     *
     * @param {Boolean} show Whether to show the host proxy node or not.
     */
    function setHostProxyVisibility(show) {
        var cfg = this.popupConfig;

        // Is the popup not hosted within ?
        if (cfg && !cfg.isHostedWithin) {
            // Set the host proxy to be set to display none.
            var hostProxy = this.hostProxy;
            if (hostProxy) {
                hostProxy.style.display = show ? '' : 'none';
            }
        }
    }

    /**
     * Returns whether the value provided as a parameter is a number.
     *
     * @param {Number} v The value to check whether it is valid.
     *
     * @returns {boolean} Whether the value is a number
     */
    function isValidPosValue(v) {
        return v !== undefined && v !== null && !isNaN(v);
    }

    /**
     * Mixin to make any Widget a popup that can be opened or closed.
     *
     * @mixin
     * @public
     */
    mstrmojo._IsPopup = {

        /**
         * True when the popup is visible.
         *
         * @type {boolean}
         * @default false
         */
        visible: false,

        /**
         * True when the popup is added as a disposable object of its opener.
         *
         * @type {boolean}
         * @default true
         */
        disposable: true,

        /**
         * <p>Handle back to the widget that called the popup open method.</p>
         *
         * <p>Set at run-time in open(). Reset to null when close() is called.</p>
         *
         * @type {mstrmojo.Widget}
         */
        opener: null,

        /**
         * Customizable event handler, called when open() is called.
         *
         * @abstract
         */
        onOpen: mstrmojo.emptyFn,

        /**
         * Customizable event handler, called when close() is called.
         *
         * @param {Object=} config Optional configuration settings.
         * @abstract
         */
        onClose: mstrmojo.emptyFn,

        /**
         * The popupConfiguration for this popup.
         *
         * @type {mstrmojo.ui.PopupConfig}
         */
        popupConfig: null,

        /**
         * Private property to hold a proxy host element node that will be used to host the menu when
         * the popup config is set up to not be hosted within.
         *
         * @type {HTMLElement|Node}
         * @ignore
         */
        hostProxy: undefined,

        /**
         * <p>Opens this popup, meaning makes it visible, calling its render() method if not already rendered.</p>
         *
         * @param {mstrmojo.Widget=} opener The widget that opened this popup.
         * @param {Object=} config An optional hash of properties for the popup.
         */
        open: function open(opener, config) {
            // Call the open popup handlers.
            callPopupHandlers.call(this, true);

            // Apply config props, if any. This will be done with a custom method, if the popup defines one;
            // otherwise, it is done by just setting properties.
            if (this.updatePopupConfig) {
                this.updatePopupConfig(config, opener);
            } else {
                $HASH.forEach(config, function (v, k) {
                    this.set(k, v);
                }, this);
            }

            // Define in-render CSS class.
            var positionCSS = 'popup-mid-render';

            // Update the opener. Do this before rendering, because setting the opener may cause
            // the contents to update themselves, and it's more efficient to avoid re-rendering DOM updates.
            this.set('opener', opener);

            // Has the popup NOT already rendered?
            if (!this.hasRendered) {
                // Cache current visible value and change to false.
                var currentVisible = this.visible;
                this.visible = false;

                // Render popup.
                this.render();

                // Add in-render CSS class and show popup.
                $CSS.addClass(this.domNode, positionCSS);
                this.set('visible', currentVisible);
            }

            // Customization hook.
            if (this.nudge) {
                this.domNode.style.top = '-10000px';
            }

            // Set the host proxy visibility to hidden.
            setHostProxyVisibility.call(this, true);

            // Ready to show to the end-user.
            this.set('visible', true);

			// #789093,#788895.lock IW if popup is opened in it.
            if (config && config.lockIW) {
                toggleLockInfoWin.call(this, config.lockIW, true);
            }

            // Customization hook for positioning the popup.
            if (this.nudge) {
                this.nudge();
            }

            // Customization hook.
            this.onOpen();

            // Adjust the popup alignment
            this.adjustCornersForPopupOverflow();

            // Remove in-render CSS class.
            $CSS.removeClass(this.domNode, positionCSS);
        },

        /**
         * Adjust the placement of the popup to make sure that it's always inside the window.
         *
         * All the popups that wants to fit into window should have a {@link mstrmojo.ui.PopupConfig} popupConfig property.
         *
         * @return {Boolean} If the replacement is done
         */
        adjustCornersForPopupOverflow: function adjustCornersForPopupOverflow() {
            var cfg = this.popupConfig;
            if (!cfg) {
                return false;
            }

            // Cache or calculate the popups anchor position.
            var popupAnchorPos = cfg.position || $DOM.position(cfg.anchorElement || cfg.hostElement, true); // TQMS 837417: add true parameter to $DOM.position to include the scroll

            // First, if the popup isn't hosted within, we add it to the host proxy; so we can calculate it's dimensions.
            if (!cfg.isHostedWithin) {

                //cache host proxy so it is removed later, this method might be called on refresh and if the menu
                //is still open the host proxy remains on the page
                var oldHostProxy = this.hostProxy,
                    hostProxyElement = this.hostProxy = document.createElement('div');

                // Add the host proxy element to the body.
                document.body.appendChild(hostProxyElement);

                // Add the menu within the proxy host element node.
                hostProxyElement.appendChild(this.domNode);

                // Remove any lingering old proxy hosts...
                if (oldHostProxy) {
                    oldHostProxy.parentNode.removeChild(oldHostProxy);
                }

                // Reposition domNode and apply the css and style properties.
                // Give it a width instead of height so that the popup list can have same width as the anchor element.
                var divStyle = hostProxyElement.style,
                    POS_TO_STYLE_ATTR_MAP = {
                        x: 'left',
                        y: 'top',
                        w: 'width'
                    };

                hostProxyElement.className = cfg.hostProxyCssClass;
                divStyle.position = 'absolute';
                divStyle.background = 'none';

                // Make the proxy height 0px so that it doesn't obstruct the original host.
                divStyle.height = '0';

                // Loop through x, y, and width of the anchor position and apply it to the host proxy.
                $ARR.forEach(['x', 'y', 'w'], function (posProp) {
                    var popupAnchorProp = popupAnchorPos[posProp];

                    // Is this popup anchor position valid?
                    if (isValidPosValue(popupAnchorProp)) {
                        // Set the corresponding property on the divs style.
                        divStyle[POS_TO_STYLE_ATTR_MAP[posProp]] = popupAnchorProp + $PX;
                    }
                });
            }

            var cornersEnum = cfg.ENUM_CORNERS,
                BOTTOM_LEFT = cornersEnum.BOTTOM_LEFT,
                BOTTOM_RIGHT = cornersEnum.BOTTOM_RIGHT,
                TOP_RIGHT = cornersEnum.TOP_RIGHT,
                TOP_LEFT = cornersEnum.TOP_LEFT;

            var overflowDirections = calculateOverflowDirections(cfg, $DOM.position(document.body), popupAnchorPos, $DOM.position(this.domNode)),
                hasOverflowedRight = overflowDirections.right,
                hasOverflowedBottom = overflowDirections.bottom,
                hasOverflowedLeft = overflowDirections.left,
                hasOverflowedTop = overflowDirections.top,
                corners = cfg.alignment,
                originalPopupCorner = corners.popup,
                originalHostCorner = corners.host,
                popupCorner = originalPopupCorner,
                hostCorner = originalHostCorner;

            // Based on the current alignment, will the menu overflow horizontally (along the x-axis)?
            if (hasOverflowedRight || hasOverflowedLeft) {
                // Fix the host corner.
                if (isCornerLeft(hostCorner)) {
                    hostCorner = isCornerTop(hostCorner) ? TOP_RIGHT : BOTTOM_RIGHT;
                } else if (isCornerRight(hostCorner)) {
                    hostCorner = isCornerTop(hostCorner) ? TOP_LEFT : BOTTOM_LEFT;
                }

                // Fix the popup corner.
                if (hasOverflowedRight && isCornerLeft(popupCorner)) {
                    popupCorner = isCornerTop(popupCorner) ? TOP_RIGHT : BOTTOM_RIGHT;
                } else if (hasOverflowedLeft && isCornerRight(popupCorner)) {
                    popupCorner = isCornerTop(popupCorner) ? TOP_LEFT : BOTTOM_LEFT;
                }
            }

            // Check if the menu either overflows vertically (along the y-axis).
            if (hasOverflowedBottom || hasOverflowedTop) {
                // Fix the host corner.
                if (isCornerLeft(hostCorner)) {
                    hostCorner = isCornerTop(hostCorner) ? BOTTOM_LEFT : TOP_LEFT;
                } else if (isCornerRight(hostCorner)) {
                    hostCorner = isCornerTop(hostCorner) ? BOTTOM_RIGHT : TOP_RIGHT;
                }

                // Fix the popup corner.
                if (hasOverflowedBottom && isCornerTop(popupCorner)) {
                    popupCorner = isCornerLeft(popupCorner) ? BOTTOM_LEFT : BOTTOM_RIGHT;
                } else if (hasOverflowedTop && isCornerBottom(popupCorner)) {
                    popupCorner = isCornerLeft(popupCorner) ? TOP_LEFT : TOP_RIGHT;
                }
            }

            // If the alignment of the menu has changed from what the user configured
            if (hasOverflowedTop || hasOverflowedRight || hasOverflowedBottom || hasOverflowedLeft) {
                // If the debug flags are on, log which direction overflowed.
                if (isDebugging) {
                    console.log("Overflow directions: " + JSON.stringify(overflowDirections));
                }

                // Are we updating the alignment ? Cache the original ones so we can revert back to it later on.
                this._orgalgn = {
                    host: originalHostCorner,
                    popup: originalPopupCorner
                };

                // Update it on the config.
                cfg.setAlignment(hostCorner, popupCorner);
            }

            // Now that we've calculated that we've overflows, is this the non-hosted within case?
            if (!cfg.isHostedWithin) {
                // Do we have valid top and height props for the popupAnchor position ?
                if (isValidPosValue(popupAnchorPos.y) && isValidPosValue(popupAnchorPos.h)) {
                    // Move the host proxy to the top or bottom based on which corner it's anchored to.
                    this.hostProxy.style.top = (popupAnchorPos.y + (isCornerBottom(popupCorner) ? 0 : popupAnchorPos.h)) + $PX;
                }
            }

            var isHostBottom = isCornerBottom(hostCorner),
                isHostRight = isCornerRight(hostCorner),
                auto = 'auto',
                p100 = '100%',
                p0 = '0';

            // Initialize position to auto.
            var top = auto,
                right = auto,
                bottom = auto,
                left = auto;

            // Is the popup corner on the bottom?
            if (isCornerBottom(popupCorner)) {
                // Set bottom to 0 or 100% based on host corner.
                bottom = isHostBottom ? p0 : p100;
            } else {
                // Set top to 100% or 0 based on host corner.
                top = isHostBottom ? p100 : p0;

            }

            // Is the popup corner on the right?
            if (isCornerRight(popupCorner)) {
                // Set right to 100% or 0 based on host corner.
                right = isHostRight ? p0 : p100;
            } else {
                // Set left to 100% or 0 based on host corner.
                left = isHostRight ? p100 : p0;
            }

            // Reposition domNode.
            var domNodeStyle = this.domNode.style;
            domNodeStyle.top = top;
            domNodeStyle.right = right;
            domNodeStyle.bottom = bottom;
            domNodeStyle.left = left;

            return true;
        },

        /**
         * <p>Closes this popup, making it invisible.</p>
         *
         * <p>The "opener" property is reset to null.</p>
         *
         * @param {Object=} config Optional configuration settings that will be passed along to the onClose handler (if any).
         */
        close: function close(config) {
            // Do we have an onClose handler?
            if (this.onClose) {
                // Customization hook; execute it before we lose the handle to opener.
                this.onClose(config);
            }

            // Set the host proxy visibility to hidden.
            setHostProxyVisibility.call(this, false);

            this.set('visible', false);
            this.set('opener', null);

			// #789093,#788895.lock IW if popup is opened in it.
            if (this.lockIW) {
                toggleLockInfoWin.call(this, this.lockIW, false);
            }

            // Call the close popup handlers.
            callPopupHandlers.call(this, false);

            // Did we have to update the alignment (i.e. - do we have a cached original alignment ?)
            var originalAlignment = this._orgalgn;
            if (originalAlignment) {
                // Update the alignment.
                this.popupConfig.setAlignment(originalAlignment.host, originalAlignment.popup);
            }
        },

        buildRendering: function buildRendering() {
            // Call super.
            var res = this._super();
            if (res) {
                // Do we NOT have a parent and does our DOM node NOT have a parent element?
                if (!this.parent && !this.domNode.parentElement) {
                    // Insert the domNode as a child of the body tag.
                    document.body.appendChild(this.domNode);
                }
            }
            return res;
        },

        unrender: function unrender(ignoreDom) {
            // Check if the popup is not hosted within the host element.
            if (this.popupConfig && !this.popupConfig.isHostedWithin && this.hostProxy) {
                // Remove the node from the body.
                document.body.removeChild(this.hostProxy);

                // Delete the reference to the host proxy
                delete this.hostProxy;
            }

            // Call super.
            this._super(ignoreDom);
        }
    };

}());
(function () {

    mstrmojo.requiresCls("mstrmojo.dom",
                         "mstrmojo.Widget",
                         "mstrmojo._ListSelections");

    var $DOM = mstrmojo.dom;

    /**
     * <p>ListBase is an "abstract" base class for list widgets that display a 1-D array of data items.</p>
     *
     * <p>It is called "abstract" in the sense that it does not implement the 4 methods "_markupPrefix", "_markupSuffix", "_itemPrefix" and "_itemSuffix".
     * These methods are implemented by subclasses such as ListBox and ListBoxHoriz in order to render a table layout.</p>
     *
     * @class
     * @extends mstrmojo.Widget
     * @mixes mstrmojo._ListSelections
     */
    mstrmojo.ListBase = mstrmojo.declare(
        mstrmojo.Widget,

        [ mstrmojo._ListSelections ],

        /**
         * @lends mstrmojo.ListBase.prototype
         */
        {
            scriptClass: "mstrmojo.ListBase",


            selectionPolicy: null,

            /**
             * Responsible for defining the HTML of each data item, and optionally for marking a rendered item as selected,
             * unselected, hovered, or unhovered. The itemRenderer should have the following public members:
             * {
             *        render: function (item, index, widget),        // required
             *        select: function (el, item, index, widget),    // optional
             *        unselect: function (el, item, index, widget),    // optional
             *        hover: function (el, item, index, widget),    // optional
             *        unhover: function (el, item, index, widget),    // optional
             *        colWidth: Integer    // optional
             * }
             */
            itemRenderer: null,

            /**
             * CSS text for the items container node.
             *
             * @type {string}
             * @default ''
             */
            icnCssText: '',

            /**
             * CSS class name for the items container node.
             *
             * @type {string}
             * @default
             */
            icnCss: '',

            markupString: '<div id="{@id}" class="mstrmojo-ListBase {@cssClass}" style="{@cssText}" mstrAttach:click,dblclick,mouseover,mouseout,contextmenu>' +
                              '<div class="{@icnCss}" style="{@icnCssText}">{@itemsHtml}</div>' +
                          '</div>',

            markupSlots: {
                itemsContainerNode: function itemsContainerNode() { return this.domNode.firstChild; },
                scrollboxNode: function scrollboxNode() { return this.domNode; }
            },

            markupMethods: {
                onvisibleChange: mstrmojo.Widget.visibleMarkupMethod,
                onheightChange: mstrmojo.Widget.heightMarkupMethod,
                onwidthChange: mstrmojo.Widget.widthMarkupMethod
            },

            /**
             * If true, this widget will set its "visible" property when we set its "items" property:
             * false if items is null or an empty array, true otherwise.
             */
            autoHide: false,

            /**
             * The node that contains the list item nodes.
             *
             * @type {Node}
             */
            itemsContainerNode: null,

            _markupPrefix: null,
            _markupSuffix: null,
            _itemPrefix: null,
            _itemSuffix: null,

            /**
             * Extends the inherited method in order to implement the "autoHide" feature.
             *
             * @ignore
             */
            init: function init(props) {
                this._super(props);

                if (this.autoHide) {
                    this.visible = !!(this.items && this.items.length);
                }
            },

            /**
             * Extends the rendering by defining the "itemsHtml" property at run-time, thus rendering
             * the data items.
             *
             * @ignore
             */
            buildRendering: function buildRendering() {
                // Set the itemsHtml property to an HTML string for the first page of table cells.
                this.itemsHtml = '';
                var len = (this.renderOnScroll ? this.items && ((this.renderIndex + 1) * this.renderBlockSize) : this.items && this.items.length);
                if (len) {
                    this.itemsHtml = this._buildItemsMarkup(
                        0,
                        len - 1,
                        this._markupPrefix && this._markupPrefix(),
                        this._markupSuffix && this._markupSuffix(),
                        this._itemPrefix && this._itemPrefix(),
                        this._itemSuffix && this._itemSuffix()
                    ).join('');
                }

                // This does the actual DOM construction, and attaches listener to our own scrollbox.
                // We assume the scrollbox is our own, not our parent's.
                // TO DO: does this.connectScrollbox(this) cause 2 listeners to be attached?
                this._super();

                delete this.itemsHtml;
                // Record pointer to the newly constructed table for future reference.
                this.addSlots({itemsNode: this.itemsContainerNode.firstChild});
            },

            /**
             * Builds the markup for the list items.
             *
             * @param {number} start
             * @param {number} end
             * @param {string=} markupPrefix
             * @param {string=} markupSuffix
             * @param {string=} itemPrefix
             * @param {string=} itemSuffix
             *
             * @return {string[]} An array of HTML strings for a <table> with a single <tbody> whose rows contain the data from the items
             *                   of a given range of indices.
             */
            _buildItemsMarkup: function _buildItemsMarkup(start, end, markupPrefix, markupSuffix, itemPrefix, itemSuffix) {
                // For performance, we generate the HTML as an array of small strings, which the caller can then join when needed.
                var markup = [],
                    count = 0;
                markup[count++] = markupPrefix || '';

                // Do we have an item renderer with a render function?
                var ir = this.itemRenderer,
                    fn = ir && ir.render;

                if (fn && typeof fn === "function") {
                    // Walk the items and generate a single table row of HTML for each.
                    var items = this.items,
                        stop = Math.min(end + 1, ((items && items.length) || 0)),
                        i;

                    for (i = start; i < stop; i++) {
                        markup[count++] = itemPrefix || '';
                        markup[count++] = fn(items[i], i, this);
                        markup[count++] = itemSuffix || '';
                    }
                }

                markup[count + 1] = markupSuffix || '';
                return markup;
            },

            /**
             *  Handler for selectionChange event, raised by _ListSelections mixin.
             */
            onselectionChange: function onselectionChange(evt) {
                if (!evt) {
                    return;
                }

                var ir = this.itemRenderer;
                if (!ir) {
                    return;
                }

                var unsel = ir.unselect,
                    its = this.items || [],
                    rem = evt.removed,
                    ix,
                    el,
                    j,
                    jLen;

                if (unsel && rem) {
                    // ask itemRenderer to unhighlight previous selections
                    for (j = 0, jLen = rem.length; j < jLen; j++) {
                        ix = rem[j];
                        el = this._getItemNode(ix);
                        if (el) {
                            unsel(el, its[ix], ix, this);
                        }
                    }
                }

                var sel = ir.select,
                    added = evt.added,
                    i,
                    len;

                if (sel && added) {
                    // ask itemRenderer to highlight selections
                    for (i = 0, len = added.length; i < len; i++) {
                        ix = added[i];
                        el = this._getItemNode(ix);
                        if (el) {
                            sel(el, its[ix], ix, this);
                        }
                    }
                }

                // A hook for custom behavior
                if (this.onchange) {
                    this.onchange({
                        added: evt.added,
                        removed: evt.removed
                    });
                }
            },

            /**
             * Custom setter for "items", implements the autoHide feature.
             *
             * @param {string} n The name of the property.
             * @param {*} v The new property value.
             *
             * @return {boolean} true if the property value was changed.
             */
            _set_items: function _set_items(n, v) {
                //reset the index
                this.renderIndex = 0;

                if (this.autoHide) {
                    this.set('visible', !!(v && v.length));
                }

                var was = this.items;
                this.items = v;
                if (was !== v) {
                    var hr = this.hasRendered;
                    if (hr) {
                        this.unrender(false);
                    }
                    // Setting items clears any prior selections.  Previously we only cleared
                    // selections that are out of bounds, but this breaks lists in popups
                    // that only have 1 item, yet need to have their selectedIndex reset to -1
                    // every time they are opened.
                    this.clearSelect();

                    if (hr) {
                        this.render();
                    }
                    return true;
                }

                return false;
            },

            /**
             * <p>Custom hook that notifies the user whether a RMC was invoked on a list item.</p>
             *
             * @param {Object} item The list item being RMC'd on.
             * @param {Object} evt The mouse event.
             *
             * @abstract
             */
            onItemContextMenu: mstrmojo.emptyFn,

            oncontextmenu : function oncontextmenu(evt) {
                $DOM.preventDefault(window, evt.e);

                // Find the target node.
                var target = evt.getTarget(),
                    item = this.getItemFromTarget(target);

                // Was an item found?
                if (item) {
                    // Is the widget going to handle this event?
                    if (this.onItemContextMenu(item, evt)) {
                        // Cancel bubble always.
                        evt.cancel();
                    }
                }
            },

            /**
             * Returns the item node at the given index.
             *
             * @param {number} idx The index of the item to find.
             * @return {Node|null} The found node, or null.
             */
            _getItemNode: function _getItemNode(idx) {
                var itemsNode = this.itemsContainerNode;
                return (itemsNode && itemsNode.childNodes[idx]) || null;
            },

            /**
             * <p>If true, List will render the items as they scroll into view; otherwise, all items are
             * rendered immediately when the List is rendered.</p>
             * @type Boolean
             */
            renderOnScroll: false
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.Widget",
    		"mstrmojo.string");

    var $STR = mstrmojo.string;

    /**
     * A click sensitive label to display text.
     *
     * @class
     * @extends mstrmojo.Widget
     */
    mstrmojo.Label = mstrmojo.declare(

        mstrmojo.Widget,

        null,

        /**
         * @lends mstrmojo.Label.prototype
         */
        {
            scriptClass: "mstrmojo.Label",

            /**
             * Flag indicating whether allowing HTML element in the provided text content.
             *  True - text content will be displayed as is. Set to true only when the text is ensured from a safe source.
             *  False - text content will be html-encoded for security reason.
             * @param {boolean}
             * @default false
             */
            allowHTML: false,

            /**
             * The text (or HTML) to be displayed in the label.
             *
             * @type {string}
             */
            text: '',

            /**
             * The tooltip for this button.
             *
             * @type String
             */
            title: '',

            /**
             * @inheritDoc
             */
            markupString: '<div id="{@id}" class="mstrmojo-Label {@cssClass}" style="{@cssText}" title="{@title} "mstrAttach:click>' +
                          '</div>',

            /**
             * @inheritDoc
             */
            markupMethods: {
                ontitleChange: function () {
                    this.domNode.title = this.title;
                },
                ontextChange: function () {
                    var txt = this.text;

                    // Make sure the text is not empty and is a String object.
                    txt = $STR.isEmpty(txt) ? '' : txt.toString();

                    this.domNode.innerHTML = this.allowHTML ? txt : $STR.encodeHtmlString(txt, true); //set the skip space param to be true to fix 1009484.
                },
                oncssTextChange: mstrmojo.Widget.cssTextMarkupMethod,
                onvisibleChange: mstrmojo.Widget.visibleMarkupMethod,
                onenabledChange: mstrmojo.Widget.enabledMarkupMethod
            },

            /**
             * If this property is true the label will be hidden for empty string, <code>null</code> or <code>undefined</code>.
             *
             * @type {boolean}
             * @default false
             */
            autoHide: false,

            _set_text: function _set_text(n, v) {
                // Should we auto hide?
                if (this.autoHide) {
                    // Set visible status to false for empty string, null or undefined.
                    this.set('visible', (v !== null) && (v !== '') && (v !== undefined));
                }

                // Change text value.
                var was = this.text;
                this.text = v;

                // Return boolean indicating whether the value changed.
                return (was !== v);
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.publisher",
                         "mstrmojo.Widget",
                         "mstrmojo.array",
                         "mstrmojo._HasChildren");

    var $ARR = mstrmojo.array;

    /**
     * Disables the supplied children (which aren't already disabled) and caches them for later restoration.
     *
     * @param {Array.<mstrmojo.Widget>} children  The children to disable.
     *
     * @this {mstrmojo.Container}
     */
    function disableChildren(children) {
        // Do we NOT propagate enabled state to children?
        if (!this.shouldPropagateEnabled) {
            // Nothing to do.
            return;
        }

        // Get collection.
        var disabledCollection = this._disabledChildren;

        // Iterate passed children.
        $ARR.forEach(children, function (child) {
            // Is the child enabled?
            if (child.enabled) {
                // Add to collection and disable.
                disabledCollection.push(child.id);
                child.set('enabled', false);
            }
        });
    }

    /**
     * Enables any children that were previously disabled by this container.
     *
     * @this {mstrmojo.Container}
     */
    function enableChildren() {
        // Iterate disabled children.
        $ARR.forEach(this._disabledChildren, function (childId) {
            // Does the child still exist and belong to this container?
            var child = mstrmojo.all[childId];
            if (child && child.parent === this) {
                // Enable child.
                child.set('enabled', true);
            }
        }, this);

        // Clear cache.
        this._disabledChildren = [];
    }

    /**
     * <p>Base widget container class.</p>
     *
     * <p>Container is a widget that contains other "child" widgets. Typically used to arrange other widgets
     * visually in a GUI.</p>
     *
     * @class
     * @extends mstrmojo.Widget
     * @mixes mstrmojo._HasChildren
     */
    mstrmojo.Container = mstrmojo.declare(
        mstrmojo.Widget,

        [ mstrmojo._HasChildren ],

        /**
         * @lends mstrmojo.Container.prototype
         */
        {
            scriptClass: "mstrmojo.Container",

            /**
             * <p>The default slot name under which children should be placed.</p>
             *
             * <p>Typically each child has a "slot" (String) property which indicates which "slot node" that child's DOM should
             * be appended to. If the child's "slot" property is undefined, we assume this default instead.</p>
             */
            defaultChildSlot: "containerNode",

            /**
             * The default {@link HTMLElement} that will hold child DOM nodes.
             *
             * @type {HTMLElement}
             */
            containerNode: null,

            /**
             * <p>If true, the domNodes of the Container's children will be inserted into their
             * corresponding slot nodes in the same order in which the children are listed in the "children" array
             * property.</p>
             *
             * <p>Otherwise, the domNodes are appended to their corresponding slot nodes in whatever
             * order they happen to be rendered; by default, that order is the same sequence as the "children" array,
             * but in general, other subclasses can modify that order if desired (for example, an "on-demand" rendering mixin).</p>
             *
             * @type {boolean}
             */
            preserveChildDomOrder: true,

            /**
             * <p>True if the children of this container should become disabled when the container is disabled.</p>
             *
             * <p>Subclasses that want to use this need to include {@link mstrmojo.Container.enabledMarkupMethod}.</p>
             *
             * @type {boolean}
             * @default false
             */
            shouldPropagateEnabled: false,

            /**
             * <p>Base widget container class.</p>
             *
             * <p>Overwrites the inherited constructor {@link mstrmojo.Widget#init} in order to initialize child widgets (if any)
             * before initializing this object's bindings.</p>
             *
             * @param {Object=} props Hash of property values to be applied to this instance.
             */
            init: function init(props) {
                this._super(props);

                // Create cache to hold children who have been disabled through inheritance.
                this._disabledChildren = [];

                // Attach event listener to hear when a children is added.
                this.attachEventListener('addChild', this.id, function (evt) {
                    // Should we propagate enabled state AND are we currently disabled?
                    if (this.shouldPropagateEnabled && !this.enabled) {
                        // Disable newly added children.
                        disableChildren.call(this, evt.value);
                    }
                });

                // If we have a "children" config, initialize our children.
                if (this.children) {
                    this.initChildren();
                }

                // If we are an orphan, init our bindings now (if any). Otherwise we have a parent,
                // and that parent is responsible for calling us later to init our bindings, after it
                // has finished constructing its children.
                // Note: If we have no bindings, our children still might, so don't skip initBindings call.
                var parent = this.parent;
                if (!parent || parent.hasInitBindings) {
                    this.initBindings();
                }
            },

            /**
             * <p>Extends the inherited method in order to call destroy on its child objects and its bindings before
             * destroying itself.</p>
             *
             * <p>This method destroys this object's children first before destroying this object's bindings.
             * Typically, children with bindings are bound to properties in their ancestors. Therefore, we wait
             * until after our children are destroyed to destroy our own bindings, thereby reducing the number of
             * binding events raised by our own destruction.</p>
             *
             * <p>This method passes a flag along to its children's "destroy" call which lets the children know
             * that they can skip the DOM cleanup, because it will be handled by this container.</p>
             */
            destroy: function dst(skipCleanup) {
                if (this.children) {
                    this.destroyChildren(true);
                }
                if (this.bindings) {
                    this.destroyBindings();
                }
                this._super(skipCleanup);
            },

            /**
             * <p>Extends the inherited method to unrender all children before un-rendering this container.</p>
             *
             * <p>This container calls the children's "unrender" before performing its own unrender, because
             * the children might assume that their domNode is still in the document when their unrender is called.</p>
             *
             * <p>This method also passes a flag along to its children's "unrender" call which lets the children know
             * that they can skip the DOM cleanup, because it will be handled by a container. This is intended as
             * a performance optimization, so that the children's DOM can be removed from the document in a single batch operation.</p>
             *
             * @param {boolean} [ignoreDom=false] If true we don't need to clear the DOM (meaning it'll be handled by a parent/ancestor).
             */
            unrender: function unrender(ignoreDom) {
                var c = this.children,
                    len = (c && c.length) || 0,
                    i;

                for (i = len - 1; i > -1; i--) {
                    c[i].unrender(true);
                }

                this._super(ignoreDom);
            },

            /**
             * <p>Extends the rendering cycle to trigger the rendering of child widgets, if any.</p>
             *
             * <p>This method triggers the rendering of this container's children after the container's domNode
             * has been rendered but BEFORE the container's "hasRendered" property is set to true.</p>
             */
            postBuildRendering: function postBuildRendering() {
                if (this._super() !== false) {
                    this.renderChildren();
                    // Override the return value to show that we rendered.
                    return true;
                }

                return false;
            },

            /**
             * <p>Asks all children who are ready for rendering to render now.</p>
             *
             * <p>Container's implementation of renderChildren renders
             * all the children immediately who pass the "childRenderCheck" filter.
             * Subclasses of Container can enhance/overwrite this behavior to support alternative rendering modes.
             */
            renderChildren: function renderChildren() {
                var ch = this.children,
                    len = (ch && ch.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    var c = ch[i];
                    if (this.childRenderCheck(c)) {
                        c.render();
                    }
                }
            },

            /**
             * <p>Returns true if a given child is ready to be rendered.</p>
             *
             * <p>A child is considered ready if:</p>
             * <ol>
             * <li>the child has not rendered yet, and</li>
             * <li>the child's "slot" property corresponds to a non-null slot in this Container.</li>
             * </ol>
             *
             * <p>The slot check was important because a container may choose to
             * deliberately omit a slot so that certain children won't render.</p>
             *
             * @param {mstrmojo.Widget} c The child widget to be checked.
             *
             * @returns {Boolean} true if the child is ready to be rendered; false otherwise.
             */
            childRenderCheck: function childRenderCheck(c) {
                if (c && !c.hasRendered) {
                    var s = c.slot || this.defaultChildSlot;
                    return !!this[s];
                }
                return false;
            },

            addChildren: function addChildren(c, idx, silent) {
                var arr = this._super(c, idx, silent);
                if (arr) {
                    this.childRenderOnAddCheck(arr);
                }
                return arr;
            },

            /**
             * <p>Extends the inherited method to remove the children's DOM.</p>
             *
             * @inheritDoc
             */
            removeChildren: function removeChildren(c, silent) {
                var c2r = c ? [c] : (this.children || []),
                    len = c2r.length,
                    i;

                // Remove domNode(s) from slot(s).
                for (i = len - 1; i > -1; i--) {
                    var w = c2r[i],
                        dn = w && w.domNode;
                    if (dn) {
                        var s = this[(w.slot || this.defaultChildSlot)];
                        if (dn.parentNode === s) {
                            s.removeChild(dn);
                        }
                    }
                }

                // Call the inherited method to remove children from this.children.
                return this._super(c, silent);
            },

            /**
             * <p>Checks if newly added child should be rendered.</p>

             * <p>Called when children are newly added.  Checks if each child should be rendered, and if so,
             * calls the child's render() method. If the child has already been rendered, attempts to include
             * its rendering within this container's rendering.</p>
             *
             * <p>If this container has not been rendered, this method does nothing.</p>
             *
             * @param {mstrmojo.Widget[]} ch The newly added child widgets to be checked.
             */
            childRenderOnAddCheck: function childRenderOnAddCheck(ch) {
                if (this.hasRendered && ch) {
                    var len = ch.length,
                        i;

                    for (i = 0; i < len; i++) {
                        var c = ch[i];
                        if (this.childRenderCheck(c)) {
                            c.render();
                        } else if (c && c.hasRendered) {
                            this.onchildRenderingChange(c);
                        }
                    }
                }
            },

            /**
             * <p>Inserts a given child widget's DOM into a slot of this container. Once all children are
             * rendered, raises a "childrenRendered" event.</p>
             *
             * <p>The target slot name is determined by the child's "slot" property (if missing,
             * this container's "defaultChildSlot" property value is assumed).</p>
             *
             * <p>If the targeted slot is not defined in the current rendering, the child widget's domNode is
             * simply removed from DOM until future use.
             * If the targeted slot is defined, the child's domNode will be appended to
             * the slot node, unless this Container's "preserveChildDomOrder" property is
             * true; if so, the child's domNode will be inserted at the child index corresponding
             * to the child's order in this container's "children" array.</p>
             *
             * @param {mstrmojo.Widget} child The child whose rendering is to be inserted.
             */
            onchildRenderingChange: function onchildRenderingChange(child) {
                var d = child && child.domNode;
                if (!d) {
                    return;
                }

                // Compare the domNode's parentNode to the slot node it belongs under.
                var defaultChildSlot = this.defaultChildSlot,
                    childSlot = child.slot || defaultChildSlot,
                    slot = this[childSlot],
                    children = this.children;

                if (!slot) {
                    // No slot found. Remove child domNode from DOM.
                    if (d.parentNode) {
                        d.parentNode.removeChild(d);
                    }
                } else {
                    // We have a slot. Is the domNode already inserted into the slotNode?
                    // TO DO: Do we really need this parentNode check? What happens if you try to call node.parentNode.appendChild(node)?
                    if (d.parentNode === slot) {
                        return;
                    }
                    // Insert the domNode; compute the insertion index.
                    if (!this.preserveChildDomOrder) {
                        // Append the domNode, insertion index is irrelevant.
                        slot.appendChild(d);
                    } else {
                        // Compute an insertion position. Find the domNode of the last preceding child in the same slot (if any).
                        var sib,
                            i;

                        for (i = children.length - 1; i >= 0; i--) {
                            var c = children[i];

                            // Is this the rendered child?
                            if (c === child) {
                                // We've found the child so the last sib value is it's sib.
                                break;
                            }

                            // Is this child in the same slot as the rendered child?
                            if (childSlot === (c.slot || defaultChildSlot)) {
                                // Does it have a domNode?
                                var cNode = c.domNode;

                                // Does the parent of the domNode match the slotNode?
                                if (cNode && cNode.parentNode === slot) {
                                    // This is the node of the child that should appear after the rendered child.
                                    sib = cNode;
                                }
                            }
                        }

                        // Do we have a child that should appear after the rendered child?
                        if (sib) {
                            // Yes, then insert the child before that node.
                            slot.insertBefore(d, sib);
                        } else {
                            // No, then append the child to the slot node.
                            slot.appendChild(d);
                        }
                    }
                }

                // Raise a "childrenRendered" if all children are now rendered.
                if (mstrmojo.publisher.hasSubs(this.id, "childrenRendered")) {
                    var childrenLength = children.length,
                        k;

                    // Iterate my children
                    for (k = 0; k < childrenLength; k++) {
                        // Does the domNode NOT exist?  We check for the existence of the domNode rather than the isRendered flag because at this point, the
                        // isRendered flag has not been set yet.
                        if (!children[k].domNode) {
                            // No, then no reason to raise event.
                            return;
                        }
                    }

                    // All children are rendered so raise the event.
                    this.raiseEvent({
                        name: "childrenRendered"
                    });
                }
            },

            /**
             * <p>Propagates the value of the property from a given container to it's children widgets.</p>
             *
             * @param {String} propName The name of the property that needs to be propagated.
             */
            propagateChildProps: function propagateChildProps(propName) {
                var containerProp = this[propName],
                    children = this.children || [],
                    childCount = children.length,
                    i;

                // Iterate children. TODO: Convert to native forEach once we stop supporting older browsers.
                for (i = 0; i < childCount; i++) {
                    // Pass property value from the container to it's child widget.
                    children[i].set(propName, containerProp);
                }
            }
        }
    );

    /**
     * <p>Markup method for container enabled state.</p>
     *
     * <p>Includes code for optionally propagating enabled state to children</p>
     *
     * @static
     */
    mstrmojo.Container.enabledMarkupMethod = function () {
        // Call super.
        mstrmojo.Widget.enabledMarkupMethod.apply(this, arguments);

        // Should we propagate enabled state to children?
        if (this.shouldPropagateEnabled) {
            // Are we enabled?
            if (this.enabled) {
                // Enable our children.
                enableChildren.call(this);
            } else {
                // Disable our children.
                disableChildren.call(this, this.children);
            }
        }
    };
}());
(function () {
    mstrmojo.requiresCls("mstrmojo.dom",
        "mstrmojo.css",
        "mstrmojo.Container",
        "mstrmojo._IsPopup",
        "mstrmojo.boxmodel",
        "mstrmojo.dom",
        "mstrmojo.ui._HasScroller");

    var $BOX = mstrmojo.boxmodel,
        $DOM = mstrmojo.dom,
        $CSS = mstrmojo.css,
        CSS_TOOLTIP = 'mstrmojo-Tooltip',
        CSS_SCROLL_NODE = 'mstrmojo-scrollNode',
        CURSOR_HEIGHT = 20;

    /**
     * Attaches (or detaches) a listener to hear opener ancestors scroll event.
     *
     * @param {mstrmojo.Widget} opener
     * @param {mstrmojo.Tooltip} tooltip
     * @param {boolean=} isDetach
     */
    function toggleScrollbox(opener, tooltip, isDetach) {
        // Default listener name.
        var fnName = 'connectScrollbox';

        // Are we detaching the listener?
        if (isDetach) {
            // Change name.
            fnName = 'dis' + fnName;
        }

        // Get opener parent and step up ancestor chain.
        var parent = opener && opener.parent;
        while (parent) {
            // Does this ancestor support this method?
            if (parent[fnName]) {
                // Call the method passing the tooltip.
                parent[fnName](tooltip);
            }

            // Get next ancestor.
            parent = parent.parent;
        }
    }

    /**
     * Paints the tooltip UI after a slight delay.
     */
    function delayPaint() {
        // Do we NOT have a delayed paint already scheduled?
        if (!this._paintHandle) {
            var id = this.id,
                fnPaint = function () {
                    // Is there NO tooltip?
                    var tooltip = mstrmojo.all[id];
                    if (!tooltip) {
                        // Nothing to do.
                        return;
                    }

                    // Clear paint handle.
                    delete tooltip._paintHandle;

                    // Create collection to hold CSS tooltips (start with default).
                    var domNodeCss = [ CSS_TOOLTIP ],
                        cssClass = tooltip.cssClass;

                    // Is there a custom CSS class?
                    if (cssClass) {
                        // Add custom CSS class.
                        domNodeCss.push(cssClass);
                    }

                    // we will use page theme for the tooltip everywhere unless the opener has a custom theme for tooltip
                    var themeClassName = mstrApp.getThemeClassName && mstrApp.getThemeClassName(),
                        opener = tooltip.opener;

                    // if the opener has a specific tooltip theme (ex: root toolbar), use it
                    if(opener && opener.getTooltipThemeClass) {
                        themeClassName = opener.getTooltipThemeClass();
                    }

                    // add css for the tooltip theme
                    domNodeCss.push(themeClassName);

                    // Replace class name of DOM node.
                    tooltip.domNode.className = domNodeCss.join(' ');

                    var tooltipContent = tooltip.content,
                        contentNode = tooltip.contentNode,
                        arrowNode = tooltip.arrowNode;

                    contentNode.className = (CSS_TOOLTIP + '-content ' + CSS_SCROLL_NODE + ' ' + tooltip.contentNodeCssClass);
                    contentNode.style.cssText = tooltip.contentNodeCssText;
                    contentNode.innerHTML = tooltipContent;

                    // Clear the arrowNode inline style.
                    arrowNode.style.cssText = '';

                    // Set visibility based on presence of content.
                    tooltip.domNode.style.visibility = !!tooltipContent ? 'visible' : 'hidden';

                    // Position the tooltip.
                    tooltip.updatePosition();
                    if (tooltip.optimizePos) {
                        // TQMS 762074: has multiple tooltips, need to optimize their positions.
                        tooltip.optimizePos();
                    }

                    tooltip.updateScrollbars();

                };

            // #937665: when show warning tooltip there is some position computations based on the tooltip size, thus
            // we have to show it right now for the first time so we can get the correct tooltip size information.
            if (!this._hasPaint) {
                fnPaint();
                this._hasPaint = true;
            } else {
                this._paintHandle = window.setTimeout(fnPaint, 0);
            }
        }
    }

    /**
     * Updates current tooltip properties based on opener's properties.
     *
     * @param {mstrmojo.Tooltip} tooltip
     * @param {mstrmojo.Widget} opener
     * @param {Event=} e
     * @param {window=} win
     */
    function updateTooltipProperties(tooltip, opener, e, win) {
        // Get tooltip reference and mouse position.
        var reference = opener && (opener.richTooltip || opener.tooltip),
            mousePosition = e ? $DOM.getMousePosition(e, win || self) : null,
            isString = reference && (typeof reference === 'string');

        // Initialize default property value (assuming reference is a string).
        var cnCssCls = '',
            cssClass = '',
            cnCssTxt = '',
            content = reference,
            refNode = null,
            positionType = mstrmojo.tooltip.POS_TOPLEFT,
            left = null,
            top = null;

        var keepArrowXPos = false,
            keepArrowYPos = false;

        // Do we have a reference AND is the reference NOT a string?
        if (reference && !isString) {
            // Reset property values to reference values (or current if not in reference).
            cssClass = reference.cssClass || cssClass;
            cnCssCls = reference.contentNodeCssClass || cnCssCls;
            cnCssTxt = reference.contentNodeCssText || cnCssTxt;
            content = reference.content || '';                  // Not sure why, but doesn't use default value if no reference content.
            refNode = reference.refNode || refNode;
            positionType = reference.posType || positionType;
            left = reference.left || 0;
            top = reference.top || 0;
            keepArrowXPos = reference.keepArrowXPos || keepArrowXPos;
            keepArrowYPos = reference.keepArrowYPos || keepArrowYPos;
        }

        // Set properties on tooltip.
        tooltip.set('contentNodeCssClass', cnCssCls);
        tooltip.set('cssClass', cssClass);
        tooltip.set('contentNodeCssText', cnCssTxt);
        tooltip.set('content', content);
        tooltip.set('refNode', refNode);
        tooltip.set('posType', positionType);
        tooltip.set('left', isString ? ((mousePosition && mousePosition.x) || tooltip.left) : left);
        tooltip.set('top', (isString || !reference) ? ((mousePosition && (mousePosition.y + CURSOR_HEIGHT)) || tooltip.top) : top);        // vertical offset is cursor position + cursor height (20px)
        tooltip.set('keepArrowXPos', keepArrowXPos);
        tooltip.set('keepArrowYPos', keepArrowYPos);
    }

    /**
     * This is the tooltip popup to show customized tooltip.
     *
     * @class
     * @extends mstrmojo.Container
     * @mixes mstrmojo._IsPopup
     */
    mstrmojo.Tooltip = mstrmojo.declare(
        mstrmojo.Container,

        [ mstrmojo._IsPopup, mstrmojo.ui._HasScroller ],

        /**
         * @lends mstrmojo.Tooltip.prototype
         */
        {
            scriptClass: 'mstrmojo.Tooltip',

            /**
             * Tooltip content
             */
            content: null,

            /**
             * Top position of the tooltip.
             *
             * The final position of the tooltip is decided by (top,left) x refNode x posType.
             */
            top: null,

            /**
             * Left position of the tooltip.
             *
             * The final position of the tooltip is decided by (top,left) x refNode x posType.
             */
            left: null,

            /**
             * The reference node for top/left. If refNode is null, then left/top is corresponding to window.
             */
            refNode: null,

            // The reason we set two properties to controll arrow position is that we do not know when under which axis the arrow should be kept.
            // This should be told by users.

            /**
             * Keep the arrow x position when the reposition is triggered to avoid tooltip beyond browser.
             */
            keepArrowXPos: false,

            /**
             * Keep the arrow y position when the reposition is triggered to avoid tooltip beyond browser.
             */
            keepArrowYPos: false,

            /**
             * The corner of the tooltip is positioned.
             * mstrmojo.tooltip.POS_TOPLEFT: the top left corner of the tooltip would be positioned according to the offset (top, left) of refNode.
             *                     (top,left)
             *                         o-----------
             *                      |  tooltip |
             *                      ------------
             *                        --------------------
             *                        |                  |
             *                        |    RefNode       |
             *                        --------------------
             * mstrmojo.tooltip.POS_BOTTOMLEFT: the bottom left corner of the tooltip would be positioned according to the offset (top, left) of refNode.
             *                         ------------
             *                      |  tooltip |
             *                      o-----------
             *                  (top,left)
             *
             *
             *                        --------------------
             *                        |                  |
             *                        |    RefNode       |
             *                        --------------------
             * mstrmojo.tooltip.POS_TOPRIGHT: the top right corner of the tooltip would be positioned according to the offset (top, left) of refNode.
             *                     (top,left)
             *              -----------o
             *           |  tooltip |
             *           ------------
             *                        --------------------
             *                        |                  |
             *                        |    RefNode       |
             *                        --------------------
             * mstrmojo.tooltip.POS_BOTTOMRIGHT: the bottom right corner of the tooltip would be positioned according to the offset (top, left) of refNode.
             *           ------------
             *           |  tooltip |
             *              -----------o
             *                     (top,left)
             *
             *
             *                        --------------------
             *                        |                  |
             *                        |    RefNode       |
             *                        --------------------
             * Default value is mstrmojo.tooltip.POS_TOPLEFT.
             *
             */
            posType: "TL",

            markupString: '<div id="{@id}" class="' + CSS_TOOLTIP + ' {@cssClass}" style="{@cssText}" mstrAttach:mouseover,mouseout>' +
                              '<div class="' + CSS_TOOLTIP + '-shadow {@shadowNodeCssClass}"></div>' +
                              '<div class="' + CSS_TOOLTIP + '-contentWrapper">' +
                                  '<div class="' + CSS_TOOLTIP + '-content ' + CSS_SCROLL_NODE + ' {@contentNodeCssClass}" style="{@contentNodeCssText}"></div>' +
                              '</div>' +
                              '<div class="' + CSS_TOOLTIP + '-arrow"></div>' +
                          '</div>',

            markupSlots: {
                containerNode: function () {
                    return this.domNode.children[1];
                },
                contentNode: function () {
                    return this.domNode.children[1].firstChild;
                },
                shadowNode: function () {
                    return this.domNode.firstChild;
                },
                arrowNode: function () {
                    return this.domNode.children[2];
                }
            },

            setupScrollNodes: function setupScrollNodes() {
                this.scrollNode =  this.contentNode;
                this.scrollbarHostNode = this.containerNode;
            },

            /***
             * Use to remember the previous visible value. Because markupMethods.onvisibleChange do not know whether the value is really changed.
             */
            _previousVisible: false,

            markupMethods: {
                onvisibleChange: function () {
                    var domNodeStyle = this.domNode.style,
                        isVisible = !!this.visible;

                    if (this._previousVisible !== isVisible) {
                        // Set visible to hide and display based on visible property.
                        domNodeStyle.visibility = 'hidden';
                    }
                    domNodeStyle.display = isVisible ? 'block' : 'none';

                    this._previousVisible = isVisible;

                    // Should the tooltip be visible?
                    if (isVisible) {
                        // Update the position.
                        this.updatePosition();

                        // Do we have content?
                        if (this.content) {
                            // Show positioned content.
                            delayPaint.call(this);
                        }
                    }
                },

                onleftChange: delayPaint,
                ontopChange: delayPaint,
                onrefNodeChange: delayPaint,
                onposTypeChange: delayPaint,
                oncontentNodeCssClassChange: delayPaint,
                oncontentNodeCssTextChange: delayPaint,
                oncontentChange: delayPaint,
                oncssClassChange: delayPaint
            },

            /**
             * If there is no parent node assigned for this tooltip, we need to append it to the document body node.
             *
             * @ignore
             */
            preBuildRendering: function preBuildRendering() {
                // if no slot or placeholder is assigned, create the placeholder under the body node.
                if (!this.slot && !this.placeholder) {
                    this.placeholder = document.body.appendChild(document.createElement('div'));
                }

                return this._super();
            },

            updatePosition: function updatePosition(ignoreVisible) {
                // Is the tooltip NOT visible AND are we NOT ignoring that?
                if (!this.visible && !ignoreVisible) {
                    // Nothing to do.
                    return;
                }

                // update position
                // x and y in event refers to a certain node, we need to calculate the offset corresponding to document
                var ref = this.refNode,
                // if we have reference node, we need to calculate the offset in document
                // if we do not have a reference node, then the left/top are from event,
                // which is in window coordinate, so we need to calculate the scroll offset
                    offset = ref ? $BOX.offset(ref, document.body) : {
                        left: $DOM.getHorizontalScroll(),
                        top: $DOM.getVerticalScroll()
                    },
                    domNodeStyle = this.domNode.style,
                    containerNode = this.containerNode,
                    containerOffsetWidth = containerNode.offsetWidth,
                    containerOffsetHeight = containerNode.offsetHeight,
                    positionType = this.posType,
                    positionRight = positionType.indexOf("R") > -1,
                    positionBottom = positionType.indexOf("B") > -1,

                    top = this.top !== null ? parseInt(this.top, 10) + offset.top - (positionBottom ? containerOffsetHeight : 0) : null,
                    left = this.left !== null ? parseInt(this.left, 10) + offset.left - (positionRight ? containerOffsetWidth : ((positionType.indexOf("C") > -1) ? Math.floor(containerOffsetWidth / 2) : 0)) : null,
                    isLeftOffset = false,
                    isTopOffset = false,
                    newLeft,
                    newTop,

                    // Check body clinetWidth/clientHeight in case the scrollbar shows.
                    de = document.documentElement,
                    db = document.body,
                    bodyClientWidth = de ? de.clientWidth : db.clientWidth,
                    bodyClientHeight = de ? de.clientHeight : db.clientHeight,

                    arrowNode = this.arrowNode,
                    arrowStyle = null;

                if (left !== null) {
                    newLeft = Math.min(Math.max(left, 0), bodyClientWidth - containerOffsetWidth);
                    domNodeStyle.left = newLeft + 'px';
                    isLeftOffset = left !== newLeft;
                }

                if (top !== null) {
                    newTop = Math.min(Math.max(top, 0), bodyClientHeight - containerOffsetHeight);
                    domNodeStyle.top = newTop + 'px';
                    isTopOffset = top !== newTop;
                }

                if (isLeftOffset || isTopOffset) {
                    // Performance: only getComputedStyle when we need it.
                    if ((this.keepArrowXPos && isLeftOffset) || (this.keepArrowYPos && isTopOffset)) {
                        arrowStyle = $CSS.getComputedStyle(arrowNode);
                    }

                    if (this.keepArrowXPos && isLeftOffset) {
                        arrowNode.style.left = (parseInt(arrowStyle.left, 10) + left - newLeft) + 'px';
                    }
                    if (this.keepArrowYPos && isTopOffset) {
                        arrowNode.style.top = (parseInt(arrowStyle.top, 10) + top - newTop) + 'px';
                    }
                }

                $CSS.toggleClass(this.domNode, 'offset', isLeftOffset || isTopOffset);
            },

            _on_tooltip_change: function (evt) {
                updateTooltipProperties(this, evt && evt.src);
            },

            /**
             * Custom setter for 'opener' property.
             *
             * Since we are going to share the same tooltip instance with different widget, each time when this tooltip associates with a new widget,
             * we need to perform some cleanup with previous widget and set up some listeners with the new widget.
             *
             * @ignore
             */
            _set_opener: function (n, opener) {
                var currentOpener = this.opener,
                    isOpenerChanged = opener !== currentOpener;

                // if new opener is different from previous opener,
                // 1. we need to attach event listeners for scrolling to the new opener
                // at the same time detach event listeners for scrolling from previous opener
                // 2. we need to listen to any change of opener's richTooltip and tooltip
                if (isOpenerChanged) {
                    if (opener) {
                        toggleScrollbox(opener, this);
                    }

                    if (currentOpener) {
                        toggleScrollbox(opener, this, true);
                    }

                    if (currentOpener && currentOpener.detachEventListener) {
                        currentOpener.detachEventListener(this._richSubs);
                        currentOpener.detachEventListener(this._ttpSubs);
                    }

                    if (opener && opener.attachEventListener) {
                        this._richSubs = opener.attachEventListener('richTooltipChange', this.id, '_on_tooltip_change');
                        this._ttpSubs = opener.attachEventListener('tooltipChange', this.id, '_on_tooltip_change');
                    }

                    this.opener = opener;
                }

                return isOpenerChanged;
            },

            /**
             * Updates config for Popup rendering.
             */
            updatePopupConfig: function (config, opener) {
                updateTooltipProperties(this, opener, config && config.e, config && config.win);
            },

            /**
             * Event handler for scroll event generated from any ancestor of opener.
             * When any ancestor of opener is scrolled, we need to reposition tooltip.
             *
             * @ignore
             */
            onscroll: function onscroll() {
                //421475
                if (this.visible && this.nudge) {
                    this.nudge();
                }
                this._super();
            },

            onmouseover: mstrmojo.emptyFn,
            onmouseout: mstrmojo.emptyFn
        }
    );

    // Single tooltip instance.
    var ttpInst = null;

    /**
     * Singleton for tooltip widget.
     *
     * @static
     */
    mstrmojo.tooltip = {
        /**
         * @type {string}
         */
        POS_TOPLEFT: "TL",

        /**
         * @type {string}
         */
        POS_BOTTOMLEFT: "BL",

        /**
         * @type {string}
         */
        POS_TOPRIGHT: "TR",

        /**
         * @type {string}
         */
        POS_BOTTOMRIGHT: "BR",

        /**
         * @type {string}
         */
        POS_BOTTOMCENTER: "BC",

        /**
         * @type {string}
         */
        POS_TOPCENTER: "TC",

        /**
         * Displays a single tooltip.
         *
         * @param {mstrmojo.Widget} opener
         * @param {Event} e
         * @param {window} win
         * @param {Object=} config
         */
        open: function open(opener, e, win, config) {
            // Create a new tooltip object if either we haven't created the object.
            // OR if the tooltip object has been destroyed...
            if (!ttpInst || !mstrmojo.all[ttpInst.id]) {
                ttpInst = new mstrmojo.Tooltip();
            }

            config = config || {};
            config.e = e;
            config.win = win;

            ttpInst.open(opener, config);

            // Set reference to opener
            opener.tooltip = ttpInst;
        },

        /**
         * Hides the previously opened tooltip.
         */
        close: function close() {
            if (ttpInst) {
                if (ttpInst.opener) {
                    // Clear reference
                    ttpInst.opener.tooltip = null;
                }

                ttpInst.close();
            }
        }
    };
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.string",
        "mstrmojo.dom",
        "mstrmojo.css",
        "mstrmojo.array",
        "mstrmojo.tooltip");

    var $DOM = mstrmojo.dom,
        $STR = mstrmojo.string,
        $HASH = mstrmojo.hash,
        $ARR = mstrmojo.array,
        $TTP = mstrmojo.tooltip;


    /**
     * <p>A mixin for specifying the tooltip for lists.</p>
     *
     * @mixin
     * @public
     */
    mstrmojo.ui._HasListTooltip = mstrmojo.provide(

        "mstrmojo.ui._HasListTooltip",

        /**
         * @lends mstrmojo.ui._HasListTooltip.prototype
         */
        {
            /**
             * Orientation for the tooltip
             *
             * @type {string} 'vertical' OR 'horizontal'
             * @default 'horizontal'
             */
            tooltipOrientation: 'horizontal',

            /**
             * Offset for the button's rich tooltip (in px).
             *
             * @enum {int}
             * @default 8
             */
            tooltipOffset: 8,

            tooltipMarkup : '<div class="content" style="{@style}">{@c}</div>',

            /**
             * Currently, horizontal Tooltip can display by itself without providing any css class. This css is only for
             * overwriting the existing tooltip css.
             *
             * For Vertical, please provide the css class to use.
             *
             * Additional Css for the tooltip, object with properties:
             *      cssClass: css for the tooltip (Only when orientation is vertical)
             *      leftCssClass: css for the tooltip when it is displayed left (Only when orientation is horizontal)
             *      rightCssClass: css for the tooltip when it is displayed right (Only when orientation is horizontal)
             *      getItemCssClass: function that returns a customized css which will be appended to cssClass
             *
             * @type {Object}
             */
            tooltipCss: {},

            /**
             * Specify whether the tooltip theme is in contrast with the page theme.
             *
             * @type {Boolean}
             * @default false
             */
            tooltipContrast: false,

            showTooltip: function showTooltip(e, win) {
                var $this = this;

                // Is the tooltip NOT already open or is the menu open?
                if (!$this.hasOpenTooltip && !($this._lastOpened && $this._lastOpened.visible)) {

                    var target = $DOM.eventTarget(win,e),
                        item = $this.getItemFromTarget(target),
                        node = $this.getItemNodeFromTarget(target),
                        //If the item has a custom tooltip content (ttp), use it. Otherwise, use n for tooltip content.
                        name = item && (item.ttp || item.n),
                        cfg = $this.tooltipCss;


                    // Is the mouse over a BUTTON?
                    if (!name) {
                        return;
                    }

                    var position = $DOM.position(node),
                        tooltipLeft,
                        tooltipTop,
                        positionType,
                        contentStyle = '',
                        tooltipOffset = $this.tooltipOffset;

                    //set the properties for tooltip to display vertical if the orientation is vertical
                    if (this.tooltipOrientation === 'vertical') {
                        tooltipLeft = position.x + position.w / 2;
                        positionType = $TTP.POS_TOPCENTER;
                        tooltipTop = position.y + position.h + tooltipOffset;
                        // Add css classes so tooltip will appear correct.
                        $this.tooltipCss = $HASH.copy({
                            cssClass: 'vi-regular vi-tooltip-A A-center'
                        }, cfg);
                    }

                    // Otherwise, set the properties for tooltip to display either on left or on right depending on space available
                    else {
                        var winDimension = $DOM.windowDim(),
                            widthBuffer = 40,

                            // Calculate the right position (tooltips left top corner if it is placed right)
                            rightPosition = position.x + position.w + tooltipOffset,

                            // Calculate the left position (tooltips right top corner if it is placed left)
                            leftPosition = position.x - tooltipOffset,

                            // Calculate left and right space available based on the window size and expected tooltip position
                            leftWidth = leftPosition - widthBuffer,
                            rightWidth = winDimension.w - (rightPosition + widthBuffer),
                            tooltipCssString = 'vi-regular vi-tooltip-',
                            contentWidth;

                        tooltipTop = position.y;

                        //if the available space on the right is larger, build the properties to display on right, otherwise on left
                        if (rightWidth >= leftWidth) {
                            tooltipLeft = rightPosition;
                            contentWidth = rightWidth;
                            positionType = $TTP.POS_TOPLEFT;
                            cfg.cssClass = tooltipCssString + 'C ' + ' ' + cfg.rightCssClass;
                        }
                        else {
                            tooltipLeft = leftPosition;
                            contentWidth = leftWidth;
                            positionType = $TTP.POS_TOPRIGHT;
                            cfg.cssClass = tooltipCssString + 'D ' + ' ' + cfg.leftCssClass;
                        }

                        //set max width for the tooltip
                        contentStyle = 'max-width: ' + contentWidth + 'px;';
                    }

                    //Does tooltip have contrasting theme compared to page theme?
                    if ($this.tooltipContrast) {
                        cfg.cssClass = cfg.cssClass + " contrast";
                    }

                    // Append custom item css class.
                    if (cfg && cfg.getItemCssClass) {
                        cfg.cssClass = $ARR.filter([ cfg.cssClass, cfg.getItemCssClass(item) ], function (cls) {
                            return !!cls;
                        }).join(' ');
                    }

                    $this.richTooltip = $HASH.copy($this.tooltipCss, {
                        content: $STR.apply($this.tooltipMarkup, {
                            c: name,
                            style: contentStyle
                        }),
                        top: tooltipTop,
                        left: tooltipLeft,
                        posType: positionType
                    });

                    this._super(e, win);
                }
            },

            onclick: function onclick(evt) {
                //hide tooltip
                //bind does not work in older IE (below IE9) so using $this
                var $this = this;
                window.setTimeout(function () {
                    if ($this.hasOpenTooltip) {
                        $this.hideTooltip();
                    }
                    // Clear the timeout if the button is clicked before the tooltip timeout is triggered.
                    window.clearTimeout($this._tooltipTimeOut);
                }, 0);
                this._super(evt);
            }
        }
    );
}());
(function () {

    mstrmojo.requiresCls("mstrmojo.ListBase",
        "mstrmojo._IsList",
        "mstrmojo.ui.menus._HasMenuPopup",
        "mstrmojo._CanAutoClose",
        "mstrmojo._IsPopup",
        "mstrmojo.ui.menus._IsMenuPopup",
        "mstrmojo.ui._HasScroller",
        "mstrmojo.ui._HasUITheme",
        "mstrmojo.dom",
        "mstrmojo.css",
        "mstrmojo.ui._HasListTooltip");

    var $DOM = mstrmojo.dom,
        $CSS = mstrmojo.css;

    /**
     * Cache to hold the item markup for each type of item.
     *
     * @type {Object.<string, string>}
     * @private
     * @static
     */
    var itemMarkup = {};

    /**
     * Disables menu hiding if debug mode is enabled.
     *
     * @type {boolean}
     * @private
     * @ignore
     */
    var debug = false;

    function openSubMenu(item, isActionAreaClicked) {
        // Is this item a popup?
        if (item.pop) {
            // Are we clicking on the menu item and is it a popup item with an action ?
            if (isActionAreaClicked && item.ax) {
                // Clear the action popup timeout if the user clicked before it was set up to open.
                window.clearTimeout(this._popupAxTimeout);

                // Execute the action function.
                item.actionFn();

                // Close all menus.
                this.closeAllMenus();
            } else {
                // Get the popup configuration.
                var popupConfig = item.fn.call(mstrmojo.all[item.scope], item.ctxt);

                // Set menu position.
                var corners = popupConfig.ENUM_CORNERS;
                popupConfig.setAlignment(corners.TOP_RIGHT, corners.TOP_LEFT);

                // Add host ID and host element to configuration.
                popupConfig.hostId = this.id;
                popupConfig.hostElement = this._getItemNode(item._renderIdx);

                // Open the new popup.
                this.openPopup(popupConfig.newInstance());
            }

        // Is the user not clicking on a disabled item?
        } else if (item.dsbld !== true) {
            // Execute item function passing in item and toolbar instance.  If it doesn't return exactly false, then...
            if (item.fn(item, this) !== false) {
                // close all menus.
                this.closeAllMenus();
            }
        }
    }

    function extractNumber(value) {
        var n = parseInt(value);

        return n === null || isNaN(n) ? 0 : n;
    }

    /**
     * <p>List widget to display a floating menu.</p>
     *
     * @class
     * @extends mstrmojo.ListBase
     *
     * @mixes mstrmojo._IsList
     * @mixes mstrmojo.ui.menus._HasMenuPopup
     * @mixes mstrmojo._IsPopup
     * @mixes mstrmojo.ui.menus._IsMenuPopup
     * @mixes mstrmojo._CanAutoClose
     * @mixes mstrmojo.ui._HasListTooltip
     * @mixes mstrmojo.ui._HasScroller
     * @mixes mstrmojo.ui._HasUITheme
     */
    mstrmojo.ui.menus.Menu = mstrmojo.declare(
        mstrmojo.ListBase,

        [ mstrmojo._IsList, mstrmojo.ui.menus._HasMenuPopup, mstrmojo._IsPopup, mstrmojo.ui.menus._IsMenuPopup, mstrmojo._CanAutoClose, mstrmojo.ui._HasListTooltip,  mstrmojo.ui._HasScroller, mstrmojo.ui._HasUITheme ],

        /**
         * @lends mstrmojo.ui.menus.Menu.prototype
         */
        {
            scriptClass: 'mstrmojo.ui.menus.Menu',

            selectionPolicy: 'reselect',

            locksHover: true,

            closeOnClick: true,

            themeClassName: 'mojo-theme-dark',

            icnCss: 'mstrmojo-ui-Menu-item-container',

            /**
             * The configuration for this menu.
             *
             * @type {mstrmojo.ui.menus.MenuConfig}
             */
            popupConfig: null,

            tooltipCss: {
                leftCssClass: 'menuTooltip',
                rightCssClass: 'menuTooltip'
            },

            setupScrollNodes: function () {
                if (this.popupConfig && this.popupConfig.supportsScroll) {
                    this.scrollNode = this.itemsContainerNode;
                    this.scrollbarHostNode = this.domNode;
                }
            },

            updateScrollbars: function () {
                this._super();

                /***
                 * Here we calculate the exact scroll bar width ( 0 if no scroll bar ),
                 * and use this value to adjust marginRight and paddingRight,
                 * so that the scrollNode content width will keep the same no matter there is a scroll bar or not.
                 */
                if (this.popupConfig && this.popupConfig.supportsScroll && this.hasCustomScrollbar) {
                    var scrollNode = this.scrollNode,
                        style = (getComputedStyle && getComputedStyle(scrollNode, null)) || scrollNode.currentStyle,
                        scrollbarWidth = scrollNode.offsetWidth - extractNumber(style.borderLeftWidth) - extractNumber(style.borderRightWidth) - scrollNode.clientWidth;

                    scrollNode.style.marginRight = -scrollbarWidth + 'px';
                    scrollNode.style.paddingRight = 0;
                }
            },

            onscroll: function () {
                // When scroll, hide the sub menu.
                this.closePopup();
                this._super();
            },

            init: function init(props) {
                this._super(props);

                var menuConfig = this.popupConfig;

                // Pull items out of menu configuration.
                this.items = menuConfig.getMenuItems();

                // Create array to hold menu class names.
                var css = [ 'mstrmojo-ui-Menu', 'unselectable' ],
                    cfgCss = menuConfig.menuCssClass;

                // Is there a class within the configuration?
                if (cfgCss) {
                    // Add configuration CSS class.
                    css.push(cfgCss);
                }

                // Add custom css classes.
                $CSS.addWidgetCssClass(this, css);

                if (menuConfig && menuConfig.supportsScroll && menuConfig.maxHeight > 0) {
                    this.icnCssText = (this.icnCssText || '') + ';max-height:' + menuConfig.maxHeight + 'px';
                }

                this.useRichTooltip = !!menuConfig.useTooltip;
            },

            markupMethods: {
                onvisibleChange: function onvisibleChange() {
                    var isVisible = this.visible;
                    if (!debug || isVisible) {
                        $CSS.toggleClass(this.domNode, 'visible', isVisible);
                    }
                }
            },

            getItemMarkup: function getItemMarkup(item, idx) {
                // Does item has its customized markup function?
                if (item.getItemMarkup) {
                    return item.getItemMarkup.apply(this, [ item, idx ]);
                }

                var isPopup = !!item.pop,
                    type = isPopup ? 'submenu' : 'item',
                    markup = itemMarkup[type];

                // Have we NOT already created this markup?
                if (!markup) {
                    // Create standard markup.
                    markup = this._super(item, idx).replace('{@en@n}', '<div class="micn"></div>{@en@n}');

                    // Is this a popup menu item?
                    if (isPopup) {
                        // Add arrow DIV.
                        markup = markup.replace('{@en@n}', '{@en@n}<div class="arw"></div>');
                    }

                    // Cache markup in itemMarkup.
                    itemMarkup[type] = markup;
                }

                return markup;
            },

            getItemProps: function getItemProps(item, idx) {
                // Get default properties.
                var props = this._super(item, idx);

                // Use anchor tag.
                props.tag = 'a';

                // Add item class.
                props.addCls('mstrmojo-ui-Menu-item');
                props.addCls(item.cls);

                // Return properties.
                return props;
            },

            /**@override
             * @see mstrmojo._IsPopup.adjustCornersForPopupOverflow */
            adjustCornersForPopupOverflow: function adjustCornersForPopupOverflow() {
                var adjusted = this._super();

                if (adjusted) {
                    var domNode = this.domNode,
                        curPos = $DOM.position(domNode),
                        curY = curPos.y;
                    // Does menu content overflow in body?
                    if (curY < 0 || (curY + curPos.h > $DOM.position(document.body).h)) {
                        var style = domNode.style,
                            cfg = this.popupConfig,
                            hostPos = cfg.position || $DOM.position(cfg.hostElement);
                        // Reposition menu content to 5px offset from body top
                        style.top = (- hostPos.y + 5) + 'px';
                        style.bottom = 'auto';
                    }
                }

                return adjusted;
            },

            onmouseover: function onmouseover(evt) {
                var target = evt.getTarget(),
                    item = this.getItemFromTarget(target),
                    me = this,
                    lastOpened = me._lastOpened,
                    lastOpenIndex = lastOpened && this.getItemFromTarget(lastOpened.popupConfig.hostElement)._renderIdx,
                    itemNode = this.getItemNodeFromTarget(target),
                    within = (lastOpenIndex !== undefined &&
                        $DOM.contains(this._getItemNode(lastOpenIndex), target, true, this.domNode));

                /*
                 * always open on a timeout
                 * when we open remember the open index
                 * on mouse over monitor the last hovered index
                 * renew the timeout on mouse over
                 * when timeout fires compare the last index to the open index
                 * if the same do nothing, if different close and open the new one
                 * */
                if (item) {
                    this._lastHoverIx = item._renderIdx;

                    // Clear the open popup time out.
                    window.clearTimeout(this._popupTimeOut);

                    // Clear the action popup timeout so no lingering menus are shown.
                    window.clearTimeout(this._popupAxTimeout);

                    if (this._lastHoverIx !== lastOpenIndex && !within) {
                        this._popupTimeOut = window.setTimeout(function () {
                            if (me._lastOpened && me._lastOpened.visible) {
                                // Close that menu...
                                me.closePopup();
                            }
                            // Is the menu visible AND is this item a popup menu?
                            if (me.visible && item.pop) {
                                // Is this a popup menu item with an action function ?
                                if (item.ax) {
                                    // Delay opening the popup menu to emphasize that it can be clicked.
                                    me._popupAxTimeout = window.setTimeout(function () {
                                        // Remove the highlight CSS class from the menu item.
                                        $CSS.removeClass(itemNode, 'hlt-ax');

                                        // Open the sub-menu after the timeout.
                                        openSubMenu.call(me, item);
                                    }, 0);
                                } else {
                                    // If the item has no action configured - open the item right away.
                                    openSubMenu.call(me, item);
                                }
                            }
                        }, 400);

                        // Are we on a popup menu item which also has an action ?
                        if (item.pop && item.ax) {
                            // Add a CSS class to highlight the action area.
                            $CSS.addClass(itemNode, 'hlt-ax');
                        }
                    }
                }
            },

            onclick: function onclick(evt) {
                // Cache the event target.
                this._evtTarget = evt.getTarget();

                // Call super.
                this._super(evt);

                // DE4857: Always stop the event propagation because the event should be handled in this menu and nothing to do with its parent.
                // Otherwise clicking that does nothing will be propagated to parent and may cause this menu closed.
                // E.g. Clicking on top/bottom padding or scrollbar.
                evt.cancel();
            },

            postselectionChange: function postselectionChange(evt) {
                // Were any selections added?
                var added = evt.added;
                if (added) {
                    var item = this.items[added[0]];

                    // Open the sub menu denoting whether we're clicking on an action area.
                    openSubMenu.call(this, item, !(item.ax && this._evtTarget.className === 'arw'));

                    // Delete any references to the event target.
                    delete this._evtTarget;
                }
            },

            /***
             * Disable browser RMC context menu.
             *
             * @param evt
             * @returns {boolean}
             */
            oncontextmenu: function oncontextmenu(evt) {
                $DOM.preventDefault(window, evt.e);
                return false;
            },

            showTooltip: function showTooltip(e, win) {
                var target = $DOM.eventTarget(win, e),
                    node = this.getItemNodeFromTarget(target),
                    item = this.getItemFromTarget(target);

                // Show tooltip only when content does not fit
                if (node && ((item && item.ttp) || (node.scrollWidth > node.clientWidth))) {
                    this._super(e, win);
                }
            },

            onClose: function onClose(config) {
                if (this._super) {
                    this._super(config);
                }
                // Close all the sub menu popup before menu close itself
                this.closePopup();
            }
        }
    );

}());
(function () {

    mstrmojo.requiresCls(
        "mstrmojo.ui.PopupConfig",
        "mstrmojo.ui.menus.Menu",
        "mstrmojo.hash",
        "mstrmojo.array"
    );

    /**
     * An object holding properties about a menu item or toolbar button.
     *
     * @typedef {{
     *     n: String,
     *     cls: String,
     *     fn: Function,
     *     ttp: String,
     *     ctxt: Object,
     *     dsbld: boolean
     * }}
     *
     * @property {String} n The text to display for the item.
     * @property {String} cls The CSS class to include in the item.
     * @property {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.vi.ui.toolbars.Toolbar|mstrmojo.ui.menus.Menu)} fn The function that will be executed when the item is selected.
     * @property {String} ttp An optional tooltip of the menu item.
     * @property {Object} [ctxt] An optional context object for the menu item.
     * @property {boolean} [dsbld] An optional flag denoting that the menu item cannot be interacted with.
     */
    mstrmojo.ui.menus.MenuItemType = null;

    var CLS_SEPARATOR = 'separator';

    /**
     * An object for configuring the contents of a {@link mstrmojo.ui.menus.Menu}.
     *
     * @class
     * @extends mstrmojo.ui.PopupConfig
     */
    mstrmojo.ui.menus.MenuConfig = mstrmojo.declare(
        mstrmojo.ui.PopupConfig,

        null,

        /**
         * @lends mstrmojo.ui.menus.MenuConfig.prototype
         */
        {
            scriptClass: 'mstrmojo.ui.menus.MenuConfig',

            /**
             * The collection of menu items for this toolbar.
             *
             * @type {Array.<mstrmojo.ui.menus.MenuItemType>}
             */
            menus: null,

            /**
             * An optional css class to be applied to the menu widget that builds this menu config.
             *
             * @type {String}
             * @default ''
             */
            menuCssClass: '',

            /***
             * Allow the vertical scroll bar when menu list is too long.
             *
             * @type {boolean}
             */
            supportsScroll: false,

            /***
             * <p>The max height of the itemContainerNode of menu. Only works when supportsScroll is true.</p>
             *
             * <p><b>NOTE</b>: when set to 0, user could use css to define the max-height.</p>
             * TODO give a default value to it.
             */
            maxHeight: 0,

            /**
             * Indicates if the configuration has menu items.
             *
             * @returns {boolean}
             */
            hasMenuItems: function hasMenuItems() {
                return !!this.menus.length;
            },

            /**
             * Returns the collection of menu items.
             *
             * @param {boolean} [includeAll=false] If false the items will be sanitized to omit repeated separators.
             *
             * @returns {Array.<mstrmojo.ui.menus.MenuItemType>}
             */
            getMenuItems: function getMenuItems(includeAll) {
                // Reverse copy of menu items and filter for repeated separators.
                return mstrmojo.array.filter(this.menus.slice().reverse(), function (item, idx, arr) {
                    // Get next item.
                    var nextItem = arr[idx + 1];

                    // Include item if returning raw items OR it's NOT a separator OR it's not the first or last item AND the next item is NOT also a separator.
                    return includeAll || item.cls !== CLS_SEPARATOR || (idx && nextItem && nextItem.cls !== CLS_SEPARATOR);
                }).reverse();
            },

            /**
             * Absorbs the menu items from the passed {@link mstrmojo.ui.menus.MenuConfig} into this instance.
             *
             * @param {mstrmojo.ui.menus.MenuConfig} menuCfg The menu configuration whose items should be absorbed.
             */
            absorbMenuItems: function absorbMenuItems(menuCfg) {
                // Add new menu items.
                this.menus = this.menus.concat(menuCfg.menus);
            },

            /**
             * Adds a menu item to the configuration.
             *
             * @param {String|{n:String, ttp:String}} text The text to display for this menu item.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu):boolean} fn The Function to execute when the menu item is clicked.  If it returns false the menu will not be closed.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the {@link mstrmojo.ui.menus.MenuItemType}.
             * @param {int=} index Optional index at which to add the menu item.
             *
             * @return {mstrmojo.ui.menus.MenuItemType}
             */
            addMenuItem: function addMenuItem(text, cls, fn, ctxt, index) {
                var menuText,
                    menuTooltip,
                    newMenuItem;
                if (!text || typeof text === 'string') {
                    menuText = text;
                } else {
                    menuText = text.n;
                    menuTooltip = text.ttp;
                }

                newMenuItem = /** @type mstrmojo.ui.menus.MenuItemType **/ {
                    n: menuText,
                    ttp: menuTooltip,
                    cls: cls,
                    fn: fn,
                    ctxt: ctxt
                };

                // Check the position where to add the new item
                if (isNaN(index) || index >= this.menus.length) {
                    // Add item to menus.
                    this.menus.push(newMenuItem);
                } else {
                    this.menus.splice(index, 0, newMenuItem);
                }

                // Return the menu item to the caller.
                return newMenuItem;
            },

            /**
             * Add a menu item with customized item markup
             * @param {String} text The text to display for this menu item.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu):boolean} fn The Function to execute when the menu item is clicked.  If it returns false the menu will not be closed.
             * @param {function} fnGetItemMarkup Customized function to get item markup string, called as fnGetItemMarkup(item, idx)
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the {@link mstrmojo.ui.menus.MenuItemType}.
             * @return {mstrmojo.ui.menus.MenuItemType}
             */
            addCustomMenuItem: function addCustomMenuItem(text, cls, fn, fnGetItemMarkup, ctxt) {
                var menuItem = this.addMenuItem(text, cls, fn, ctxt);
                menuItem.getItemMarkup = fnGetItemMarkup;
                return menuItem;
            },

            /**
             * Adds a non-interactive menu item, that appears disabled, to the configuration.
             *
             * @param {String} text The text to display for this menu item.
             * @param {String=} cls The CSS class to use for this menu item.
             *
             * @deprecated Please use {@link mstrmojo.ui.menus.MenuConfig.addNonInteractiveMenuItem}.
             */
            addDisabledMenuItem: function addDisabledMenuItem(text, cls) {
                // Add an non-interactive menu item that is disabled.
                this.addNonInteractiveMenuItem(text, cls, true);
            },

            /**
             * Adds a non-interactive menu item, that appears enabled or disabled, to the configuration.
             *
             * @param {String} text The text to display for this menu item.
             * @param {String=} cls The CSS class to use for this menu item.
             * @param {Boolean=} isDisabled Whether we want this non-interactive menu item to be enabled or disabled.
             */
            addNonInteractiveMenuItem: function addNonInteractiveMenuItem(text, cls, isDisabled) {
                var classes = ['non-int'];

                // Add the custom classes if provided...
                if (cls) {
                    classes.push(cls);
                }

                // Is this non-interactive item disabled ?
                if (isDisabled) {
                    // Push the disabled class.
                    classes.push('disabled');
                }

                // Add a menu item with no execution function..
                var lastMenuItem = this.addMenuItem(text, classes.join(' '), mstrmojo.emptyFn);

                // Mark as disabled.
                lastMenuItem.dsbld = true;
            },

            /**
             * <p>Adds a menu separator to the configuration.</p>
             */
            addSeparator: function addSeparator() {
                // Add separator.
                this.addMenuItem('', CLS_SEPARATOR, function () {
                    // Return false so menu doesn't close.
                    return false;
                });
            },

            /**
             * Adds an item to the menu that will launch a popup.
             *
             * @param {String} text The text to display for this menu item.
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {Function} fn A Function that when executed will return the {@link mstrmojo.ui.menus.MenuConfig} for the sub menu.
             * @param {String=} cls An optional CSS class to use for this menu item.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             * @param {int=} index Optional index at which to add this item.
             */
            addPopupMenuItem: function addPopupMenuItem(text, scopeId, fn, cls, ctxt, index) {
                // Add default class.
                var css = [ 'pop '];

                // Was a custom class supplied?
                if (cls) {
                    // Add custom class.
                    css.push(cls);
                }

                // Add menu item.
                var subMenuItem = this.addMenuItem(text, css.join(' '), fn, ctxt, index);

                // Mark as popup and add scope.
                subMenuItem.pop = true;
                subMenuItem.scope = scopeId;

                return subMenuItem;
            },

            /**
             * Adds a popup menu item that has an action enabled when the user clicks on the action area (item minus the
             * menu arrow area).
             *
             * @param {String} text The text to display for this menu item.
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {Function} actionFn The action function for the action button part of the popup menu item.
             * @param {Function} actionPopupMenuFn A Function that when executed will return the {@link mstrmojo.ui.menus.MenuConfig} for the sub menu.
             * @param {String=} cls An optional CSS class to use for this menu item.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             * @param {int=} index Optional index at which to add this item.
             */
            addActionPopupMenuItem: function addActionPopupMenuItem(text, scopeId, actionFn, actionPopupMenuFn, cls, ctxt, index) {
                var popupMenuItem = this.addPopupMenuItem(text, scopeId, actionPopupMenuFn, (cls || '') + ' ax', ctxt, index);

                popupMenuItem.actionFn = actionFn;
                popupMenuItem.ax = true;
            },

            /**
             * Adds an item to the menu that will launch a sub menu.
             *
             * @param {String} text The text to display for this menu item.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {Function} fn A Function that when executed will return the {@link mstrmojo.ui.menus.MenuConfig} for the sub menu.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             *
             * @deprecated Please use {@link mstrmojo.ui.menus.MenuConfig.addPopupMenuItem}.
             */
            addSubMenuItem: function addSubMenuItem(text, cls, scopeId, fn, ctxt) {
                this.addPopupMenuItem(text, scopeId, fn, cls, ctxt);
            },

            /**
             * Adds an item to the menu that will launch an editor that is attached to the menu.
             *
             * @param {String} text The text to display for this menu item.
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {Function} fn A Function that when executed will return the {@link mstrmojo.ui.menus.EditorConfig} for the attached editor.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             * @param {int=} index Optional index at which to add this item.
             *
             * @deprecated Please use {@link mstrmojo.ui.menus.MenuConfig.addPopupMenuItem}.
             */
            addEditorMenuItem: function addEditorMenuItem(text, scopeId, fn, ctxt, index) {
                this.addPopupMenuItem(text, scopeId, fn, '', ctxt, index);
            },

            /**
             * Returns an array of {@link mstrmojo.ui.menus.MenuItemType} for use with toggle items.
             *
             * @param {String|{on:String, off:String, ttpOn:String, ttpOff:Sting}} text The text to display for this menu item.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu)} fnOn The Function to execute when switching state to "on".
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu)} fnOff The Function to execute when switching state to "off".
             * @param {boolean} [isOn=false] Whether the initial state is "on" (true) or "off" (false).
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the {@link mstrmojo.ui.menus.MenuItemType}.
             *
             * @returns {Array.<mstrmojo.ui.menus.MenuItemType>}
             */
            getToggleItemStates: function getToggleItemStates(text, cls, fnOn, fnOff, isOn, ctxt) {
                var textOn,
                    textOff,
                    tooltipOn,
                    tooltipOff;
                if (typeof text === 'string') {
                    textOn = textOff = text;
                    tooltipOn = tooltipOff = '';
                } else {
                    textOn = text.on || '';
                    textOff = text.off || '';
                    tooltipOn = text.ttpOn || '';
                    tooltipOff = text.ttpOff || '';
                }

                // Create states assuming the item is currently "on".
                var states = [{
                    n: textOn,
                    ttp: tooltipOn,
                    cls: cls + ' on',           // Add class to signify "on" status.
                    fn: fnOff,
                    ctxt: ctxt
                }, {
                    n: textOff,
                    ttp: tooltipOff,
                    cls: cls,
                    fn: fnOn,
                    ctxt: ctxt
                }];

                // Is the item NOT on?
                if (!isOn) {
                    // Reverse states.
                    states.reverse();
                }

                return states;
            },

            /**
             * Adds a toggle menu item.  This item will show an "on" state when it is on, and default state when it is off.
             *
             * @param {String|{on:String, off:String, ttpOn:String, ttpOff:Sting}} text The text to display for this menu item.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu)} fnOn The Function to execute when switching state to "on".
             * @param {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.ui.menus.Menu)} fnOff The Function to execute when switching state to "off".
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {boolean} [isOn=false] Whether the initial state is "on" (true) or "off" (false).
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             */
            addToggleMenuItem: function addToggleMenuItem(text, cls, fnOn, fnOff, scopeId, isOn, ctxt) {
                // Get toggle states.
                var states = this.getToggleItemStates(text, cls, fnOn, fnOff, isOn, ctxt);

                // Add dual state item to toggle state.
                return this.addDualStateItem(scopeId, states[0], states[1]);
            },

            /**
             * Adds an item to the menu that has two states.
             *
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {mstrmojo.ui.menus.MenuItemType} initialState The initial state of the item.
             * @param {mstrmojo.ui.menus.MenuItemType} toggleState The toggle state of the item.
             */
            addDualStateItem: function addDualStateItem(scopeId, initialState, toggleState) {
                // Add menu item with toggle function.
                return this.addMenuItem({
                    n: initialState.n,
                    ttp: initialState.ttp
                }, initialState.cls, this.getDualStateHandler(scopeId, initialState, toggleState), initialState.ctxt);
            },

            /**
             * <p>Returns the dual state item handler.</p>
             *
             * @param {String} scopeId The ID of the item whose scope should be used when the item function is called.
             * @param {mstrmojo.ui.menus.MenuItemType} initialState The initial state of the item.
             * @param {mstrmojo.ui.menus.MenuItemType} toggleState The toggle state of the item.
             *
             * @returns {function(mstrmojo.ui.menus.MenuItemType, mstrmojo.vi.ui.toolbars.Toolbar|mstrmojo.ui.menus.Menu)}
             */
            getDualStateHandler: function getDualStateHandler(scopeId, initialState, toggleState) {
                return function (item, widget) {
                    // Create orders list of states.
                    var states = [ initialState, toggleState ];

                    // Should we show the toggle state?
                    if (item.cls === initialState.cls) {
                        // Reverse the states.
                        states.reverse();
                    }

                    // Call old state item handler within scope of the source.
                    states[1].fn.call(mstrmojo.all[scopeId], item, widget);

                    // Update toolbar item to next state.
                    item.n = states[0].n;
                    item.ttp = states[0].ttp;
                    item.cls = states[0].cls;
                };
            },

            /**
             * Add a group of mutual exclusive menu items, if one is selected, the others is unselected.
             * When met an option that has separator property set true, one separator will be added instead of a radio item.
             *
             * @param {String|number} currValue
             * @param {Function} fnChange
             * @param {Array.<{value: String|number, text: String}>} options The options to show.
             * @param {String} cls The CSS class to use for this menu item.
             * @param {Object=} ctxt Optional context that will be included in the "ctxt" property of the menu item.
             * @param {Boolean=} useCheckMark
             * @param {function(mstrmojo.ui.menus.MenuItemType, number)} [customItemMarkupFn] The function to generate customizing menu item markup func
             */
            addRadioMenuGroup: function addRadioMenuGroup(currValue, fnChange, options, cls, ctxt, useCheckMark, customItemMarkupFn) {
                // Initialize collection to hold menu items for this radio group.
                var menuItems = /** @type {Array.<mstrmojo.ui.menus.MenuItemType>} **/ [];

                // Iterate options.
                options.forEach(function (option, idx) {
                    if (option.separator) {
                        this.addSeparator();
                        return;
                    }

                    var text = option.text,
                        itemCls = (cls || '') + ' ' + (option.cls || '') + (useCheckMark ? '' : ' radio') + (option.value === currValue ? ' on' : ''),
                        fn = function () {
                            // Is the newly selected value the same as the current value?
                            if (fnChange.call(this.ctxt, option.value, currValue, option) === false) {
                                // Do not close the menu.
                                return false;
                            }

                            // Change current value to new value.
                            currValue = option.value;

                            // Iterate all menu items.
                            menuItems.forEach(function (item) {
                                // Set class to "on" if radio value matches current value.
                                item.cls = item.cls.replace(/ on$/, '') + (item.radioValue === currValue ? ' on' : '');
                            });

                            // Return true to close menu.
                            return true;
                        },
                        menuItem = customItemMarkupFn ? this.addCustomMenuItem(text, itemCls, fn, customItemMarkupFn(option, idx), ctxt) : this.addMenuItem(text, itemCls, fn, ctxt);

                    // Cache radio value on menu item and add to menu items collection.
                    menuItem.radioValue = option.value;
                    menuItems.push(menuItem);
                }, this);
            },

            /**
             * Resets the toolbar configuration to it's initial state.
             */
            clear: function clear() {
                this._super();

                // Initialize menus collection.
                this.menus = [];
            },

            /**
             * Returns a new instance of {@link mstrmojo.ui.menus.Menu} using this configuration.
             *
             * @returns {mstrmojo.ui.menus.Menu}
             */
            newInstance: function newInstance(props) {
                return new mstrmojo.ui.menus.Menu(mstrmojo.hash.copy({
                    popupConfig: this
                }, props));
            }
        }
    );
}());

(function () {

    mstrmojo.requiresCls(
        "mstrmojo.func",
        "mstrmojo.Container",
        "mstrmojo._HasLayout",
        "mstrmojo._Formattable",
        "mstrmojo._IsDocumentTemplate",
        "mstrmojo.Label",
        "mstrmojo.ui.menus.MenuConfig"
    );

    mstrmojo.requiresClsP("mstrmojo.vi.viz",
        "EnumVisualizationTemplates",
        "EnumVizStyles",
        "EnumWidgetTypes"
    );

    var FMTS = {
            top: 'top',
            left: 'left',
            'z-index': 'zIndex',
            width: 'width',
            height: 'height'
        };

        /**
     * Base class for visualization control.
     *
     * @class
     * @extends mstrmojo.Container
     * @mixes mstrmojo._HasLayout
     * @mixes mstrmojo._Formattable
     * @mixes mstrmojo._IsDocumentTemplate
     */
    mstrmojo.VisBase = mstrmojo.declare(
        mstrmojo.Container,

        [ mstrmojo._HasLayout, mstrmojo._Formattable, mstrmojo._IsDocumentTemplate ],

        /**
         * @lends mstrmojo.VisBase.prototype
         */
        {
            scriptClass: 'mstrmojo.VisBase',

            updated: false,
            waitingForData : false,
            node: null,

            /**
             * True if the visualization should skip the rerender during set dimensions.
             *
             * @type {boolean}
             * @default false
             */
            skipReRender: false,

            /**
             * Indicates whether formatting properties will be modified in update().
             *
             * @type {boolean}
             * @default true
             */
            updateFormatsOnUpdate: true,

            setModel: function setModel(model) {
                this.set('model', model);
            },

            destroy: function destroy() {
                var model = this.model;
                if (model && model.destroy) {
                    model.destroy();
                    delete this.model;
                }

                this._super();
            },

            /**
             * Handle dimension change to sync with container portlet.
             * (#968541)
             * @param {string} height The vis widget height with px
             * @param {string} width  The vis widget width with px
             */
            resize: function resize() {
                // Get the new dimension
                var f = this.getFormats();

                // Simply hide when minimized; otherwise update dimension.
                if (parseInt(f.height, 10) === 0 || parseInt(f.width, 10) === 0) {
                    this.domNode.style.display = 'none';
                } else {
                    this.setDimensions(f.height, f.width);
                    this.domNode.style.display = '';
                }
            },

            setDimensions: function setDimensions(h, w) {
                // Call super.
                var dimensionChanged = this._super(h, w);

                // Where dimensions changed AND have we already rendered AND should we NOT skip rendering?
                if (dimensionChanged && this.hasRendered && !this.skipReRender) {
                    // Render again.
                    this.reRender();
                }

                return dimensionChanged;
            },

            reRender: function reRender() {
                this.unrender();
                this.render();
            },

            getWidth: function getWidth() {
                return parseInt(this.width, 10); // remove the px if present
            },

            getHeight: function getHeight() {
                return parseInt(this.height, 10); // remove the px if present
            },

            getLeft: function getLeft() {
                return parseInt(this.left, 10);
            },

            getTop: function getTop() {
                return parseInt(this.top, 10);
            },

            buildRendering: function bldRn() {
                this.height = this.getHeight(); // remove the px if present
                this.width = this.getWidth();   // remove the px if present
                this.left = this.getLeft();
                this.top = this.getTop();

                if (!this.updated) {
                    this.update();
                }

                // Call the inherited method to do the DOM construction.
                this._super();
            },

            /**
             * This function will read the properties defined in vis properties editor and than
             * set the properties accordingly
             *
             * @param vp
             *
             * @abstract
             */
            initFromVisProps: function initFromVisProps() {},

            /**
             * Called after rendering is finished.  This override returns TRUE if the postBuildRendering process
             * should continue. Subclasses of VisBase can use this value to halt their processing in the case of empty visualization
             *
             * @returns {boolean}
             */
            postBuildRendering: function () {
                var isEmpty = this.isEmpty();

                // call super to allow children widgets to be rendered
                this._super();

                this.raiseEvent({
                    name: "toggleCtrlOverlay",
                    visible: isEmpty,
                    controls: this.getVisEmptyMsgControls()
                });

                return !isEmpty;
            },

            /**
             *
             * @param node
             * @returns {boolean} TRUE if update process should continue
             */
            update: function update(node) {

                // 964470 clear selections for all widgets when data model is changed
                // Comment, as this is done in _HasVisSelection.update
//                if (this.clearSelections) {
//                    this.clearSelections();
//                }

                node = node || this.node;

                if (node) { // called from docs

                    var nodeData = node.data;

                    if (nodeData) {
                        this.model.set('data', nodeData);
                    }

                    // are we waiting for server JSON?
                    this.waitingForData = !!nodeData.nsj;

                    // do we need to re-request the data for this visualization from server?
                    if ( this.waitingForData ) {
                        var iveStyleName = 'ServerJsonRWDStyle';

                        // YES: fire of a task to retrieve the server JSON
                        var model = this.model,
                            ds = model.getDataService(),
                            taskReq = {
                                host: this,
                                nodes: [ this.k ]
                            };

                        if ( nodeData.wid !== undefined ) {
                            taskReq.slices = [ nodeData.wid ];
                        }

                        ds.retrieveServerJson( taskReq,
                            mstrmojo.func.wrapMethods(model.docModel.getUpdateColorMapCallback(), model.docModel.getUpdateThemePaletteCallback(), model.controller._getXtabCallback(this)),
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
                            }
                        );


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

                } // if node

                if (this.model) {
                    var docModel = this.model && this.model.docModel;
                    this.initFromVisProps(this.model.vp);
                    if (docModel && docModel.getDocBuilder) { //html5 vi to update visName
                        var visName = docModel.getDocBuilder().getMojoVisName(node);
                        if (visName) {
                            node.data.visName = visName;
                        }
                    }
                }

                this.updated = true;

                if (this._super) {
                    return this._super(node);
                }

                // update process should continue
                return true;
            },

            /**
             * Determines whether visualization is empty.
             *
             * @returns {boolean}
             */
            isEmpty: function isEmpty() {
                return false;
            },

            /**
             *
             * @returns {Array<mstrmojo.Widget>}
             */
            getVisEmptyMsgControls: function getVisEmptyMsgControls() {
                return [
                    {
                        scriptClass: 'mstrmojo.Label',
                        cssClass: 'dropMsg',
                        text: mstrmojo.desc(11668, 'Drag objects here.')
                    }
                ];
            },

            getModel: function getModel() {
                return this.model;
            },

            getData: function getData() {
                return this.model.data;
            },

            getRowsAndCols: function () {
                var gts = this.model.data.gts;

                return (gts.row || []).concat(gts.col || []);
            },

            getExp: function () {
                var data = this.model.data,
                    exp = data && data.sc && data.sc.exp;

                return exp;
            },

            getDocModel: function getDocModel() {
                return this.model && this.model.docModel;
            },

            /**
             * To support the RMC on title popup.
             * Currently we only popup the font toolbar in Graph Matrix.
             * If we need to support the popup on all viz, we need to extract the logic from visGraphMatrix to this class.
             */
            getTitleRMCPopup: mstrmojo.emptyFn,

            getMenuHandler: function getMenuHandler() {
                return mstrmojo.emptyFn;
            },

            /**
             * Renders an error message replacing the entire DOM node.
             *
             * @param {string} msg
             */
            renderErrorMessage: function renderErrorMessage(msg) {
                this.domNode.innerHTML = "<div class=\"mstrmojo-message\">" + msg + "</div>";
            },

            /**
             * Returns the message ID for the current document/report.
             *
             * @returns {string}
             */
            getMessageID: function getMessageID() {
                return this.model.docModel.mid || this.model.mid;
            },

            performAction: function performAction(actionObj) {
                var action = this.model.getAction(actionObj),
                    handler = action && action.h;

                if (handler && this.controller[handler]) {
                    this.controller[handler](this, action.a);
                    return true;
                }
                return false;
            },

            findSelectorControl: function findSelectorControl() {
                var data = this.getData(),
                    v = data && data.sc;
                if (v && parseInt(v.ct, 10) === 6) {  //6 == multi unit control type
                    this.selectorControl = v;
                    this.isMultiSelect = true;
                } else {
                    delete this.selectorControl;
                }
                return this.selectorControl;
            }
        }
    );

})();
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

    function toggleError(show) {
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
    }

    /**
     * Base class for custom visualizations.
     *
     * @class
     * @extends mstrmojo.VisBase
     *
     * @mixes mstrmojo.vi.ui.rw._XtabDE
     */
    mstrmojo.CustomVisBase = mstrmojo.declare(
        mstrmojo.VisBase,

        [ mstrmojo.vi.ui.rw._XtabDE ],

        /**
         * @lends mstrmojo.CustomVisBase.prototype
         */
        {
            scriptClass: 'mstrmojo.CustomVisBase',

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

            init: function init(props) {
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
            },

            plot: mstrmojo.emptyFn,

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
                toggleError.call(this, true);
            },

            renderVisualization: function renderVisualization() {
                try {
                    toggleError.call(this, false);

                    this.dataInterface = new mstrmojo.models.template.DataInterface(this.getData());
                    this.plot();
                    this.plotted = true;

                } catch (e) {
                    this.displayError();
                    this.plotted = false;
                }
            },

            postBuildRendering: function postBuildRendering() {
                var me = this,
                    libraries = this.externalLibraries;

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

                    if (tooltip.length) {
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
            }
        }
    );
}());
