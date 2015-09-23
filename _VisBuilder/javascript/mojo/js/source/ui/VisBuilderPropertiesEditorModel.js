(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel", "mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSection");
    var M$L = mstrmojo.Label, M$H = mstrmojo.HBox, M$T = mstrmojo.TextBox, M$C = mstrmojo.CheckBox, M$V = mstrmojo.VBox;
    var defaultImage = '../javascript/mojo/css/vi/images/viz_gallery_sprite.png';

    function getMainPropertiesGroup() {
        var content = this.descField = new mstrmojo.TextBoxWithLabel({
            cssDisplay: 'inline-block',
            cssClass: 'VBPropertiesLine',
            label: 'Visualization name',
            value: this.getHost().vbGetDescription(),
            hint: "Visualization name:",
            alias: "dsc"
        });
        return this.getEditorGroup([content]);
    }

    function getImageSection(currentLightIcon, currentDarkIcon) {
        var me = this, pluginFolder = me.getHost().pluginFolder;
        this.lightIcon = new mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSection({
            label: 'Light theme icon:',
            cssDisplay: 'inline-block',
            cssClass: 'VBPropertiesLine VBIconLine',
            alias: 'iconUpload',
            pluginFolder: pluginFolder,
            iconValue: currentLightIcon
        });
        this.darkIcon = new mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSection({
            label: 'Dark theme icon:',
            cssDisplay: 'inline-block',
            cssClass: 'VBPropertiesLine VBIconLine',
            alias: 'iconDark',
            pluginFolder: pluginFolder,
            isDarkScheme: true,
            iconValue: currentDarkIcon
        });
        return this.getEditorGroup([this.lightIcon, this.darkIcon]);
    }

    function getErrorMessageGroup() {
        var host = this.getHost();
        var line1Content = new mstrmojo.TextBoxWithLabel({
                cssDisplay: 'inline-block',
                cssClass: 'VBPropertiesLine',
                label: 'Error message :',
                value: host.vbGetErrorMessage1(),
                hint: "Error message",
                alias: "emsg1"
            }),

            line2Content = new mstrmojo.TextBoxWithLabel({
                cssDisplay: 'inline-block',
                cssClass: 'VBPropertiesLine',
                label: 'Error details:',
                value: host.vbGetErrorMessage2(),
                hint: "Error details",
                alias: "emsg2"
            });

        this.errMsg1Field = line1Content;
        this.errMsg2Field = line2Content;
        return this.getEditorGroup([line1Content, line2Content]);
    }

    function getMinGroup() {
        var host = this.getHost();

        var line1Content = new mstrmojo.TextBoxWithLabel({
                cssDisplay: 'inline-block',
                cssClass: 'VBPropertiesLine',
                label: 'Minimum number of attributes:',
                value: host.vbGetMinAttributes(),
                hint: "Minimum number of attributes",
                alias: "mat"
            }),

            line2Content = new mstrmojo.TextBoxWithLabel({
                cssDisplay: 'inline-block',
                cssClass: 'VBPropertiesLine',
                label: 'Minimum number of metrics:',
                value: host.vbGetMinMetrics(),
                hint: "Minimum number of metrics",
                alias: "mm"
            });
        this.minAttrField = line1Content;
        this.minMetricsField = line2Content;
        return this.getEditorGroup([line1Content, line2Content]);
    }

    function getJSLibraryGroup() {
        var host = this.getHost(), jsLibs = host.vbGetJSLibs(), i = 0, jsInputsArray = [], addNewSection, jsInputsSection;

        var urlInputButton = function getURLInputButton(value) {
            var bx = new M$T({value: value, cssText: "width:100%; border:0px", alias: "link", slot: 'txtNode'});
            var btn = mstrmojo.Button.newIconButton("Remove", "mstrmojo-ACLEditor-delete", function () {
                var toRemove = this.parent;
                toRemove.parent.removeChildren(toRemove);
            }, null, {slot: 'btnNode'});
            var cont = new mstrmojo.Container({
                markupString: '<div class="" style=" position: relative; ">' +
                '<div></div>' +
                '<span style=" position: absolute; z-index: 2; float: right; top: 0; right: 0; "></span>' +
                '</div>',
                markupSlots: {
                    txtNode: function () {
                        return this.domNode.children[0];
                    },
                    btnNode: function () {
                        return this.domNode.children[1];
                    }
                },
                children: [bx, btn]
            });
            return cont;
        };
        if (jsLibs) {
            for (i = 0; i < jsLibs.length; i++) {
                jsInputsArray.push(urlInputButton(jsLibs[i]));
            }
        }
        this.jsLibs = jsInputsSection = new mstrmojo.VBox({
            cssText: "width:100%",
            children: jsInputsArray,
            alias: "urlJS"
        });
        var tooltipDataFunction = function () {
            var pos = mstrmojo.dom.position(this.domNode, true);
            this.set("richTooltip", {
                cssClass: 'vi-regular A-center vi-tooltip-A',
                top: Math.max(pos.y+ 85, 0),
                left: Math.max(pos.x + pos.w / 2, 0),
                posType: mstrmojo.tooltip.POS_BOTTOMCENTER,
                content: 'Links to externally hosted libraries require end users to have Internet access. Clients that require HTTPS require links to libraries that also use HTTPS.'
            });
        };
        var button = mstrmojo.Button.newWebButton("Add Library", function () {
            var parent = this.parent;
            jsInputsSection.addChildren(urlInputButton(parent.newValue.value));
            parent.newValue.set("value", "");
            parent.parent.urlJS.renderChildren();
        }, false, {
            useRichTooltip: true,
            updateTooltipConfig: tooltipDataFunction
        });

        addNewSection = new M$H({
            cssText: "width:100%", children: [
                new M$T({
                    cssText: "width:100%",
                    value: "",
                    hint: "Insert script URL",
                    alias: "newValue",
                    useRichTooltip: true,
                    updateTooltipConfig: tooltipDataFunction
                }), button

            ]
        });
        return this.getEditorGroup([jsInputsSection, addNewSection]);
    }

    function getScopeGroup() {
        var host = this.getHost(), scope = host.scope, report = 1, document = 2, dashboard = 16;
        this.reportScopeField = new M$C({
            checked: (report === (report & scope)),
            value: report,
            label: 'Available for reports',
            cssDisplay: 'block',
            cssText: 'font-weight: bold'
        });
        this.documentScopeField = new M$C({
            checked: (document === (document & scope)),
            value: document,
            label: 'Available for documents',
            cssDisplay: 'block',
            cssText: 'font-weight: bold'
        });
        this.dashboardScopeField = new M$C({
            checked: (dashboard === (dashboard & scope)),
            value: dashboard,
            label: 'Available for dashboards',
            cssDisplay: 'block',
            cssText: 'font-weight: bold'
        });
        return this.getEditorGroup([this.reportScopeField, this.documentScopeField, this.dashboardScopeField]);
    }

    function getPropertiesGroup() {
        var host = this.getHost();
        this.rToolTipField = new M$C({
            checked: host.vbGetRichToolTip(),
            alias: "rtt",
            label: 'Rich tooltip',
            cssDisplay: 'block',
            cssText: 'font-weight: bold'
        });
        this.rDOOMField = new M$C({
            checked: host.vbGetReuseDom(),
            alias: "rd",
            label: 'Reuse DOM',
            cssDisplay: 'block',
            cssText: 'font-weight: bold'
        });
       // return this.getEditorGroup([this.rToolTipField, this.rDOOMField]);
    }

    function getScope() {
        var scope = 0;
        var updvalue = function updateValue(element, currentValue) {
            if (element && element.checked) {
                currentValue = currentValue | element.value;
            }
            return currentValue;
        };
        scope = updvalue(this.reportScopeField, scope);
        scope = updvalue(this.documentScopeField, scope);
        scope = updvalue(this.dashboardScopeField, scope);
        return scope;
    }

    /**
     * Class to generate content of Properties pane
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel
     * @extends mstrmojo.Container
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderPropertiesEditorModel = mstrmojo.declare(
        mstrmojo.plugins._VisBuilder.ui.VisBuilderAbstractEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderPropertiesEditorModel",
            cssClass: 'mstrmojo-VisBuilderMoreOptions',
            apply: function () {
                var lighIconSettings = this.lightIcon.apply(),
                    darkIconSettings = this.darkIcon.apply();
                //logic to re0render only if needed is missing
                var host = this.getHost();

                var jslibsarray = [];
                if (this.jsLibs && this.jsLibs.children) {
                    for (var i = 0; i < this.jsLibs.children.length; i++) {
                        jslibsarray.push({'url': this.jsLibs.children[i].link.value});
                    }
                }

                host.vbSetScope(getScope.call(this));
                host.vbSetIcons(lighIconSettings.tp, lighIconSettings.vl, darkIconSettings.tp, darkIconSettings.vl);
                host.vbSetJSLibs(jslibsarray);
                host.vbSetDescription(this.descField.value);
                //host.vbSetRichToolTip(this.rToolTipField.checked);
                //host.vbSetReuseDom(this.rDOOMField.checked);
                host.vbSetMinimal(this.minAttrField.value, this.minMetricsField.value);
                host.vbSetErrorMessage1(this.errMsg1Field.value);
                host.vbSetErrorMessage2(this.errMsg2Field.value);
                host.vbReRender = true;
                this._super();
            },
            getContent: function (results) {
                results.push(getMainPropertiesGroup.call(this));
                results.push(getImageSection.call(this, this.getHost().vbGetGalleryLightIcon(defaultImage), this.getHost().vbGetGalleryDarkIcon(defaultImage)));
                results.push(getErrorMessageGroup.call(this));
                results.push(getMinGroup.call(this));
                //results.push(getPropertiesGroup.call(this));
                getPropertiesGroup.call(this)
                results.push(getScopeGroup.call(this));
                results.push(getJSLibraryGroup.call(this));
                window.currentPropsTab = this;
                return results;
            }
        }
    );
}())